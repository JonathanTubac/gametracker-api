import * as ctrl from '../controllers/rating.controller.js'
import { Router } from 'express'

const router = Router();

router.get('/:id',    ctrl.get);
router.post('/:id',   ctrl.upsert);
router.delete('/:id', ctrl.remove);

export default router;