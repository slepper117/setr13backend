import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import query from '../database/knex.js';
import { Error400, Error401 } from '../classes/errors.js';
import cookiesConfig from '../config/cookies.js';

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check mandatory properties
    if (!username || !password)
      throw new Error400(
        'mandatory-props-are-missing',
        'Check if the mandatory properties are missing'
      );

    // Check if user exists
    const userExists = await query('users')
      .select('id', 'password')
      .where({ username });

    if (userExists.length === 0)
      throw new Error401(
        'username-password-wrong',
        'The username or password provided are wrong'
      );

    // Check if password is correct
    const checkPassword = await bcrypt.compare(
      password,
      userExists[0].password
    );

    if (!checkPassword)
      throw new Error401(
        'username-password-wrong',
        'The username or password provided are wrong'
      );

    // Creates a token
    const token = jwt.sign(
      {
        id: userExists[0].id,
      },
      process.env.JWT_SECRET
    );

    // Sends token as a Cookie
    res.cookie('token', token, cookiesConfig).send();
  } catch (e) {
    next(e);
  }
};

const logout = (req, res, next) => {
  try {
    // Clears Cookie Token
    res
      .cookie('token', '', {
        ...cookiesConfig,
        expires: new Date(0),
      })
      .send();
  } catch (e) {
    next(e);
  }
};

export { login, logout };
