import express from 'express';
import checkID from '../middleware/checkID.js';
import * as bookingsController from '../controllers/bookings.js';

const router = express.Router();

router.get('/', bookingsController.list);
router.post('/', bookingsController.create);
router.get('/:id', checkID('bookings'), bookingsController.read);
router.put('/:id', checkID('bookings'), bookingsController.update);
router.delete('/:id', checkID('bookings'), bookingsController.destroy);

export default router;
