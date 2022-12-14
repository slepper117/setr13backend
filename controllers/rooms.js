import query from '../database/knex.js';
import { Error400, Error404 } from '../classes/errors.js';

const create = async (req, res, next) => {
  const { name } = req.body;

  try {
    if (!name)
      throw new Error400(
        'mandatory-props-are-missing',
        'Check if the mandatory properties are missing'
      );

    const newRoom = await query('rooms').insert({ name }, 'id');

    const getNewRoom = await query
      .select(
        'rooms.id',
        'rooms.name',
        query.raw('count(bookings.id)::INTEGER')
      )
      .from('rooms')
      .leftJoin('bookings', 'rooms.id', 'bookings.room')
      .where('rooms.id', newRoom[0].id)
      .groupBy('rooms.id');

    res.json(getNewRoom[0]);
  } catch (e) {
    next(e);
  }
};

const read = async (req, res, next) => {
  const { id } = req;

  try {
    const getRoom = await query
      .select(
        'rooms.id',
        'rooms.name',
        query.raw('count(bookings.id)::INTEGER')
      )
      .from('rooms')
      .leftJoin('bookings', 'rooms.id', 'bookings.room')
      .where('rooms.id', id)
      .groupBy('rooms.id');

    res.json(getRoom[0]);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id } = req;
  const { name } = req.body;

  try {
    if (!name)
      throw new Error400(
        'mandatory-props-are-missing',
        'Check if the mandatory properties are missing'
      );

    const updateRoom = await query('rooms')
      .where({ id })
      .update({ name }, 'id');

    const getUpdatedRoom = await query
      .select(
        'rooms.id',
        'rooms.name',
        query.raw('count(bookings.id)::INTEGER')
      )
      .from('rooms')
      .leftJoin('bookings', 'rooms.id', 'bookings.room')
      .where('rooms.id', updateRoom[0].id)
      .groupBy('rooms.id');

    res.json(getUpdatedRoom[0]);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req;
  const { force } = req.query;

  try {
    const getDelRoom = await query
      .select(
        'rooms.id',
        'rooms.name',
        query.raw('count(bookings.id)::INTEGER')
      )
      .from('rooms')
      .leftJoin('bookings', 'rooms.id', 'bookings.room')
      .where('rooms.id', id)
      .groupBy('rooms.id');

    if (getDelRoom.count === 0) {
      await query('rooms').where({ id }).del();

      res.json({ deleted: getDelRoom[0] });
    } else {
      if (force === 'true') {
        await query('bookings').where({ room: id }).del();
        await query('rooms').where({ id }).del();

        res.json({ deleted: getDelRoom[0] });
      } else {
        throw new Error400('cannot-delete', 'Rooms as bookings associated');
      }
    }
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  const { orderby, order } = req.params;

  try {
    const listRooms = await query
      .select(
        'rooms.id',
        'rooms.name',
        query.raw('count(bookings.id)::INTEGER')
      )
      .from('rooms')
      .leftJoin('bookings', 'rooms.id', 'bookings.room')
      .groupBy('rooms.id')
      .orderBy(`${orderby || 'count'}`, `${order || 'DESC'}`);

    if (listRooms.length === 0)
      throw new Error404(
        'rooms-not-found',
        'No rooms were found with the given params'
      );
    else res.json(listRooms);
  } catch (e) {
    next(e);
  }
};

export { create, read, update, destroy, list };
