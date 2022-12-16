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

    const newArea = await query('areas').insert({ name }, 'id');

    const getNewArea = await query
      .select(
        'id',
        'name',
        query.raw(
          "coalesce((SELECT array_to_json(array_agg(row_to_json(x))) FROM (SELECT u.id, u.username, u.name FROM setr.users_areas ua JOIN setr.users u ON u.id = ua.id_user WHERE ua.id_area = areas.id)x),'[]') AS authorized"
        )
      )
      .from('areas')
      .where('id', newArea[0].id);

    res.json(getNewArea[0]);
  } catch (e) {
    next(e);
  }
};

const read = async (req, res, next) => {
  const { id } = req;

  try {
    const getArea = await query
      .select(
        'id',
        'name',
        query.raw(
          "coalesce((SELECT array_to_json(array_agg(row_to_json(x))) FROM (SELECT u.id, u.username, u.name FROM setr.users_areas ua JOIN setr.users u ON u.id = ua.id_user WHERE ua.id_area = areas.id)x),'[]') AS authorized"
        )
      )
      .from('areas')
      .where({ id });

    res.json(getArea[0]);
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

    await query('areas').where({ id }).update({ name });

    const getArea = await query
      .select(
        'areas.id',
        'areas.name',
        query.raw(
          "coalesce((SELECT array_to_json(array_agg(row_to_json(x))) FROM (SELECT u.id, u.username, u.name FROM setr.users_areas ua JOIN setr.users u ON u.id = ua.id_user WHERE ua.id_area = areas.id)x),'[]') AS authorized"
        )
      )
      .from('areas')
      .where({ id });

    res.json(getArea[0]);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req;
  const { force } = req.query;

  try {
    const getDelArea = await query
      .select(
        'id',
        'name',
        query.raw(
          "coalesce((SELECT array_to_json(array_agg(row_to_json(x))) FROM (SELECT u.id, u.username, u.name FROM setr.users_areas ua JOIN setr.users u ON u.id = ua.id_user WHERE ua.id_area = areas.id)x),'[]') AS authorized"
        )
      )
      .from('areas')
      .where({ id });

    if (getDelArea[0].authorized.length === 0) {
      await query('areas').where({ id }).del();

      res.json({ deleted: getDelArea[0] });
    } else {
      if (force === 'true') {
        await query('bookings').where({ room: id }).del();
        await query('areas').where({ id }).del();

        res.json({ deleted: getDelArea[0] });
      } else {
        throw new Error400('cannot-delete-area', 'Area as users associated');
      }
    }
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  const { orderby, order } = req.params;

  try {
    const listAreas = await query
      .select(
        'id',
        'name',
        query.raw(
          "coalesce((SELECT array_to_json(array_agg(row_to_json(x))) FROM (SELECT u.username, u.name FROM setr.users_areas ua JOIN setr.users u ON u.id = ua.id_user WHERE ua.id_area = areas.id)x),'[]') AS authorized"
        )
      )
      .from('areas')
      .orderBy(`${orderby || 'id'}`, `${order || 'DESC'}`);

    if (listAreas.length === 0)
      throw new Error404(
        'areas-not-found',
        'No areas were found with the given params'
      );
    else res.json(listAreas);
  } catch (e) {
    next(e);
  }
};

export { create, read, update, destroy, list };
