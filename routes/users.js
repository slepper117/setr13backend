import express from 'express';
import checkID from '../middleware/checkID.js';
import * as usersController from '../controllers/users.js';

const router = express.Router();

router.get('/', usersController.list);
router.post('/', usersController.create);
router.get('/:id', checkID('users'), usersController.read);
router.put('/:id', checkID('users'), usersController.update);
router.delete('/:id', checkID('users'), usersController.destroy);

export default router;
