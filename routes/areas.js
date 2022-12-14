import express from 'express';
import checkID from '../middleware/checkID.js';
import * as areasController from '../controllers/areas.js';

const router = express.Router();

router.get('/', areasController.list);
router.post('/', areasController.create);
router.get('/:id', checkID('areas'), areasController.read);
router.put('/:id', checkID('areas'), areasController.update);
router.delete('/:id', checkID('areas'), areasController.destroy);

export default router;
