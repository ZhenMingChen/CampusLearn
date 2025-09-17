import { Router } from 'express';
import * as topicCtrl from '../controllers/topic.controller.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

r.get('/', authRequired, topicCtrl.list);
r.get('/:id', authRequired, topicCtrl.get);

// ONLY STUDENT can create topics
r.post('/', authRequired, requireRole(['STUDENT']), topicCtrl.create);

// Assign (ADMIN/TUTOR)
r.post('/:id/assign/:assigneeId', authRequired, requireRole(['ADMIN','TUTOR']), topicCtrl.assign);

// Delete (ADMIN only)
r.delete('/:id', authRequired, requireRole(['ADMIN']), topicCtrl.remove);

export default r;

