import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import query from '../database/knex.js';
import { Error400, Error401 } from '../classes/errors.js';

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password)
      throw new Error400(
        'mandatory-props-are-missing',
        'Check if the mandatory properties are missing'
      );

    const userExists = await query('users')
      .select('id', 'password', 'user_role')
      .where({ username });

    if (userExists.length === 0)
      throw new Error401(
        'username-password-wrong',
        'The username or password provided are wrong'
      );

    const checkPassword = await bcrypt.compare(
      password,
      userExists[0].password
    );

    if (!checkPassword)
      throw new Error401(
        'username-password-wrong',
        'The username or password provided are wrong'
      );

    console.log(userExists[0]);
    const token = jwt.sign(
      {
        id: userExists[0].id,
        role: userExists[0].user_role,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production' ? true : false,
      })
      .send();
  } catch (e) {
    next(e);
  }
};

const logout = (req, res, next) => {
  try {
    res
      .cookie('token', '', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production' ? true : false,
        expires: new Date(0),
      })
      .send();
  } catch (e) {
    next(e);
  }
};

export { login, logout };
