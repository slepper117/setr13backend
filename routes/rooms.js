import express from 'express';
import checkID from '../middleware/checkID.js';
import * as roomsController from '../controllers/rooms.js';

const router = express.Router();

router.get('/', roomsController.list);
router.post('/', roomsController.create);
router.get('/:id', checkID('rooms'), roomsController.read);
router.put('/:id', checkID('rooms'), roomsController.update);
router.delete('/:id', checkID('rooms'), roomsController.destroy);

export default router;
