import express from 'express';
import checkID from '../middleware/checkID.js';
import * as clocksController from '../controllers/clocks.js';

const router = express.Router();

router.get('/', clocksController.list);
router.post('/', clocksController.create);
router.get('/:id', checkID('bookings'), clocksController.read);
router.put('/:id', checkID('bookings'), clocksController.update);
router.delete('/:id', checkID('bookings'), clocksController.destroy);

export default router;
