import express from 'express';
import * as clocksController from '../controllers/clocks.js';

const router = express.Router();

router.post('/clockIn', clocksController.clockIn);
router.post('/clockOut', clocksController.clockOut);

export default router;
