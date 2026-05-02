import { Router } from "express";
import * as ctrl from '../controllers/game.controller.js'

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.del);

export default router;