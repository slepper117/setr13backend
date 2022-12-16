import express from 'express';
import checkID from '../middleware/checkID.js';
import * as accessController from '../controllers/access.js';

const router = express.Router();

router.post('/clockIn', accessController.clockIn);
router.post('/clockOut', accessController.clockOut);
router.post('/area/:id', checkID('areas'), accessController.accessArea);
router.post('/room/:id', checkID('rooms'), accessController.accessRoom);

export default router;
