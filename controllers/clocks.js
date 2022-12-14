import query from '../database/knex.js';
import { Error404 } from '../classes/errors.js';

const clockIn = async (req, res, next) => {
  const { tag } = req.body;
  const datetime = new Date().toISOString();

  try {
    const getUser = await query
      .select('id', 'username')
      .from('users')
      .where({ tag });

    if (getUser.length === 0)
      throw new Error404(
        'tag-not-found',
        "The tag provided dosen't match with a user"
      );

    await query
      .insert({
        id_user: getUser[0].id,
        direction: 'in',
        datetime: datetime,
      })
      .into('clocks');

    res.json({
      username: getUser[0].username,
      direction: 'in',
      datetime: datetime,
    });
  } catch (e) {
    next(e);
  }
};

const clockOut = async (req, res, next) => {
  const { tag } = req.body;
  const datetime = new Date().toISOString();

  try {
    const getUser = await query
      .select('id', 'username')
      .from('users')
      .where({ tag });

    if (getUser.length === 0)
      throw new Error404(
        'tag-not-found',
        "The tag provided dosen't match with a user"
      );

    await query('clocks').insert({
      id_user: getUser[0].id,
      direction: 'out',
      datetime: datetime,
    });

    res.json({
      username: getUser[0].username,
      direction: 'out',
      datetime: datetime,
    });
  } catch (e) {
    next(e);
  }
};

export { clockIn, clockOut };
