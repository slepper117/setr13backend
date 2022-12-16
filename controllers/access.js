import query from '../database/knex.js';
import { Error401, Error404 } from '../classes/errors.js';

/**
 * Function to check if Tag is associated a user
 * @param {*} tag
 * @param {*} datetime
 * @param {*} schedule
 * @returns
 */
const checkUser = async (tag, datetime, schedule = true) => {
  const datetimeDay = datetime.getUTCDay();

  const getUser = await query
    .select('id', 'user_role', 'name', 'schedule')
    .from('users')
    .where({ tag });

  if (getUser.length === 0)
    throw new Error404(
      'tag-not-found',
      "The tag provided dosen't match with a user"
    );

  if (
    getUser[0].schedule[datetimeDay] === '0' &&
    schedule &&
    getUser[0].user_role !== 1
  )
    throw new Error401('not-authorized', "The user isn't in work schedule");

  return getUser[0];
};

const clockIn = async (req, res, next) => {
  const { tag } = req.body;
  const datetime = new Date();
  const datetimeISO = datetime.toISOString();

  try {
    const user = await checkUser(tag, datetime);

    await query
      .insert({
        id_user: user.id,
        direction: 'in',
        datetime: datetimeISO,
      })
      .into('clocks');

    res.json({
      username: user.name,
      direction: 'in',
      datetime: datetimeISO,
    });
  } catch (e) {
    next(e);
  }
};

const clockOut = async (req, res, next) => {
  const { tag } = req.body;
  const datetime = new Date();
  const datetimeISO = datetime.toISOString();

  try {
    const user = await checkUser(tag, datetime, false);

    await query('clocks').insert({
      id_user: user.id,
      direction: 'out',
      datetime: datetimeISO,
    });

    res.json({
      name: user.name,
      direction: 'out',
      datetime: datetimeISO,
    });
  } catch (e) {
    next(e);
  }
};

const accessArea = async (req, res, next) => {
  const { id } = req;
  const { tag } = req.body;
  const datetime = new Date();
  const datetimeISO = datetime.toISOString();

  try {
    const user = await checkUser(tag, datetime);

    const accessArea = await query('users_areas').where({
      id_user: user.id,
      id_area: id,
    });

    if (accessArea.length === 0)
      throw new Error401(
        'not-authorized',
        "The user dosen't have authorization to access the area"
      );

    res.json({
      status: 'authorized-area',
      name: user.name,
      datetime: datetimeISO,
    });
  } catch (e) {
    next(e);
  }
};

const accessRoom = async (req, res, next) => {
  const { id } = req;
  const { tag } = req.body;
  const datetime = new Date();
  const datetimeISO = datetime.toISOString();

  try {
    const user = await checkUser(tag, datetime);

    const accessRoom = await query
      .select('validated')
      .from('bookings')
      .where('room', id)
      .andWhere('author', user.id)
      .andWhere('start', '<=', datetimeISO)
      .andWhere('final', '>=', datetimeISO);

    if (accessRoom.length === 0)
      throw new Error404(
        'booking-not-found',
        "The user dosen't have a booking for this room."
      );

    if (!accessRoom[0].validated)
      throw new Error401(
        'not-authorized',
        'The booking was not been validated by a supervisor'
      );

    res.json({
      status: 'authorized-room',
      name: user.name,
      datetime: datetimeISO,
    });
  } catch (e) {
    next(e);
  }
};

export { clockIn, clockOut, accessArea, accessRoom };
