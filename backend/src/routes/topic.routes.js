// backend/src/routes/topic.routes.js
import { Router } from 'express';
import * as topicCtrl from '../controllers/topic.controller.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const r = Router();

// Logged-in users can read topics
r.get('/', authRequired, topicCtrl.list);
r.get('/:id', authRequired, topicCtrl.get);

// STUDENT: create topics
r.post('/', authRequired, requireRole(['STUDENT']), topicCtrl.create);

// ADMIN: delete topics (clear difference vs Tutor)
r.delete('/:id', authRequired, requireRole(['ADMIN']), topicCtrl.remove);

// ADMIN: assign a tutor to a topic (optional feature for your demo)
r.post('/:id/assign/:assigneeId', authRequired, requireRole(['ADMIN']), topicCtrl.assign);

export default r;
