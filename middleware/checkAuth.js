import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import query from '../database/index.js';
import { Error401 } from '../classes/errors.js';

const checkAuth = async (req, _res, next) => {
  const { token } = req.cookies;

  try {
    // Verifies is Token exists
    if (
      !token &&
      (!req.headers.authorization ||
        req.headers.authorization.indexOf('Basic ') === undefined)
    )
      throw new Error401('route-protected', 'Not Authorized');

    if (token) {
      // Validates Token
      const validateUser = jwt.verify(token, process.env.JWT_SECRET);

      // Return ID
      req.user = validateUser.id;
      next();
    }

    if (
      req.headers.authorization &&
      req.headers.authorization.indexOf('Basic ') === 0
    ) {
      // Removes Basic from string
      const base64Credentials = req.headers.authorization.split(' ')[1];

      // Decodes string into ascii
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'ascii'
      );

      // Destructs array into values
      const [user, key] = credentials.split(':');

      // Verifies that key exists and user is valid
      const queryKey = await query(
        `SELECT uk.id, uk.secret, u.status FROM crm.users_keys uk LEFT JOIN crm.users u ON uk.id_users = u.id WHERE uk.consumer = '${user}'`
      );
      if (queryKey.rowCount === 0)
        throw new Error401(
          'authorization-error',
          'Wrong Consumer or Secret Key'
        );
      if (queryKey.rows[0].status !== 'active')
        throw new Error401('authorization-error', "User isn't active");

      const { id, secret } = queryKey.rows[0];

      // Verifies the correct password
      const correctPassword = await bcrypt.compare(key, secret);
      if (!correctPassword)
        throw new Error401(
          'authorization-error',
          'Wrong Consumer or Secret Key'
        );

      // Updates Login info
      const updateKey = await query(
        `UPDATE crm.users_keys SET (date, ip) = ('${new Date().toISOString()}', '127.0.0.1') WHERE id = ${id} RETURNING id_users`
      );

      req.user = updateKey.rows[0].id_users;
      next();
    }
  } catch (err) {
    next(err);
  }
};

export default checkAuth;
