import { Router } from 'express';
import * as replyCtrl from '../controllers/reply.controller.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

// ONLY TUTOR or ADMIN can reply
r.post('/:topicId', authRequired, requireRole(['TUTOR','ADMIN']), replyCtrl.create);

export default r;
