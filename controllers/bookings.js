import query from '../database/knex.js';
import { Error400, Error401, Error404 } from '../classes/errors.js';

const checkExists = async (relation, field) => {
  const check = await query(relation).where('id', field);

  if (check.length !== 0)
    throw new Error404(
      `${field}-not-found`,
      `The indicated '${field}' property cannot be found`
    );
};

const create = async (req, res, next) => {
  const { user, role } = req;
  const { author, room, start, final, description } = req.body;

  try {
    if (author !== user && role === 3)
      throw new Error401(
        'not-authorized',
        'Can not create a booking for other user'
      );

    if (!room || !start || !final || !description)
      throw new Error400(
        'mandatory-props-are-missing',
        'Check if the mandatory properties are missing'
      );

    if (author) await checkExists('users', author);
    if (room) await checkExists('rooms', room);

    const checkAvailabilaty = await query('bookings')
      .where({ room })
      .andWhere('validated', 'true')
      .andWhere('start', '<=', start)
      .andWhere('final', '>=', final);

    if (checkAvailabilaty.length !== 0)
      throw new Error400(
        'book-overlaps',
        'Already exists a booking assign to the date range'
      );

    const newBooking = await query('bookings').insert(
      {
        author: author || user,
        room,
        start,
        final,
        description,
      },
      'id',
      query.raw(
        '(SELECT row_to_json(x) FROM (SELECT u.id, u.name FROM setr.users u WHERE bookings.author = u.id) x) AS author'
      ),
      query.raw(
        '(SELECT row_to_json(x) FROM (SELECT r.id, r.name FROM setr.rooms r WHERE bookings.room = r.id) x) AS room'
      ),
      'start',
      'final',
      query.raw('AGE(final, start) AS duration'),
      'description',
      'validated'
    );

    res.json(newBooking[0]);
  } catch (e) {
    next(e);
  }
};

const read = async (req, res, next) => {
  const { id } = req;

  try {
    const getBooking = await query
      .select(
        'id',
        query.raw(
          '(SELECT row_to_json(x) FROM (SELECT u.id, u.name FROM setr.users u WHERE bookings.author = u.id) x) AS author'
        ),
        query.raw(
          '(SELECT row_to_json(x) FROM (SELECT r.id, r.name FROM setr.rooms r WHERE bookings.room = r.id) x) AS room'
        ),
        'start',
        'final',
        query.raw('AGE(final, start) AS duration'),
        'description',
        'validated'
      )
      .from('bookings')
      .where({ id });

    res.json(getBooking[0]);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  let { id, user, role, body } = req;
  const { author, room, start, final, description } = req.body;

  try {
    const getBooking = await query
      .select('validated', 'author')
      .from('bookings')
      .where({ id });

    if (getBooking[0].validated)
      throw new Error400(
        'cannot-edit-booking',
        'Booking as been validated, and cannot be updated'
      );

    if (getBooking[0].author !== user && role === 3)
      throw new Error401(
        'not-booking-owner',
        'The user is not the owner of the booking'
      );

    if (Object.keys(body).length === 0)
      throw new Error400(
        'mandatory-props-are-missing',
        'Check if the mandatory properties are missing'
      );

    if (author) await checkExists('users', author);
    if (room) await checkExists('rooms', room);

    if ((author || room) && role === 3)
      throw new Error401(
        'not-authorized-room-author',
        'The user cannot change the ownership or room of booking'
      );

    const checkAvailabilaty = await query('bookings')
      .where({ room: room | getBooking[0].room })
      .andWhere('validated', 'true')
      .andWhere('start', '<=', start)
      .andWhere('final', '>=', final);

    if (checkAvailabilaty.length !== 0)
      throw new Error400(
        'can-not-book',
        'Already exists a booking assign to the date range'
      );

    const updateBooking = query('books')
      .where({ id })
      .update(
        { author, room, start, final, description },
        'id',
        query.raw(
          '(SELECT row_to_json(x) FROM (SELECT u.id, u.name FROM setr.users u WHERE bookings.author = u.id) x) AS author'
        ),
        query.raw(
          '(SELECT row_to_json(x) FROM (SELECT r.id, r.name FROM setr.rooms r WHERE bookings.room = r.id) x) AS room'
        ),
        'start',
        'final',
        query.raw('AGE(final, start) AS duration'),
        'description',
        'validated'
      );

    res.json(updateBooking[0]);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  const { id, user, role } = req;

  try {
    const getBooking = await query
      .select(
        'id',
        query.raw(
          '(SELECT row_to_json(x) FROM (SELECT u.id, u.name FROM setr.users u WHERE bookings.author = u.id) x) AS author'
        ),
        query.raw(
          '(SELECT row_to_json(x) FROM (SELECT r.id, r.name FROM setr.rooms r WHERE bookings.room = r.id) x) AS room'
        ),
        'start',
        'final',
        query.raw('AGE(final, start) AS duration'),
        'description',
        'validated'
      )
      .from('bookings')
      .where({ id });

    if (getBooking[0].validated)
      throw new Error400(
        'cannot-delete-booking',
        'Booking as been validated and cannot be deleted'
      );

    if (getBooking[0].author !== user && role === 3)
      throw new Error401(
        'not-authorized',
        'The user is not the owner of the booking'
      );

    await query('bookings').where({ id }).del();

    res.json({ deleted: getBooking[0] });
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  const { orderby, order } = req.query;

  try {
    const listBookings = await query
      .select('*')
      .from('bookings')
      .orderBy(`${orderby || 'datetime'}`, `${order || 'asc'}`);

    res.json(listBookings);
  } catch (e) {
    next(e);
  }
};

const validate = async (req, res, next) => {
  const { id, body } = req;

  try {
    if (!body.validated)
      throw new Error400(
        'mandatory-props-are-missing',
        'Check if the mandatory properties are missing'
      );

    const checkBooking = await query('bookings').where({ id });

    const checkAvailabilaty = await query('bookings')
      .where('room', checkBooking[0].room)
      .andWhere('start', '<=', checkBooking[0].start)
      .andWhere('final', '>=', checkBooking[0].final);

    if (checkAvailabilaty.length !== 0)
      throw new Error400(
        'can-not-book',
        'Already exists a booking assign to the date range'
      );

    const getBookingValidated = await query('bookings')
      .where({ id })
      .update(
        { validated: body.validated },
        'id',
        query.raw(
          '(SELECT row_to_json(x) FROM (SELECT u.id, u.name FROM setr.users u WHERE bookings.author = u.id) x) AS author'
        ),
        query.raw(
          '(SELECT row_to_json(x) FROM (SELECT r.id, r.name FROM setr.rooms r WHERE bookings.room = r.id) x) AS room'
        ),
        'start',
        'final',
        query.raw('AGE(final, start) AS duration'),
        'description',
        'validated'
      );

    res.json(getBookingValidated[0]);
  } catch (e) {
    next(e);
  }
};

export { create, read, update, destroy, list, validate };
