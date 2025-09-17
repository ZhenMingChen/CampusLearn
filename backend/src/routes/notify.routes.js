import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import * as ctrl from '../controllers/notify.controller.js';

const r = Router();
r.post('/test', authRequired, requireRole(['ADMIN']), ctrl.test);
export default r;
