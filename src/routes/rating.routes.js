import * as ctrl from '../controllers/rating.controller.js'
import { Router } from 'express'

const router = Router();

router.get('/',    ctrl.get);
router.post('/',   ctrl.upsert);
router.delete('/', ctrl.remove);

export default router;