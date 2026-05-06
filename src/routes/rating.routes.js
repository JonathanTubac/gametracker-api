import * as ctrl from '../controllers/rating.controller.js'
import { Router } from 'express'

const router = Router();

router.get('/:id/rating',    ctrl.get);
router.post('/:id/reting',   ctrl.upsert);
router.delete('/:id/rating', ctrl.remove);

export default router;