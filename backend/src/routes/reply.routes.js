// backend/src/routes/reply.routes.js
import { Router } from 'express';
import * as replyCtrl from '../controllers/reply.controller.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

/**
 * @openapi
 * tags:
 *   - name: Replies
 *     description: Tutor/Admin replies on topics
 */

/**
 * @openapi
 * /replies/{topicId}:
 *   post:
 *     summary: Add a reply to a topic
 *     description: Only users with **TUTOR** or **ADMIN** role can reply.
 *     tags: [Replies]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema: { type: string }
 *         description: The topic id to reply to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Here’s how to approach this assignment..."
 *     responses:
 *       201: { description: Reply created }
 *       400: { description: Validation error }
 *       401: { description: Auth required }
 *       403: { description: Tutor/Admin only }
 *       404: { description: Topic not found }
 */
const r = Router();

// ONLY TUTOR or ADMIN can reply
r.post('/:topicId', authRequired, requireRole(['TUTOR','ADMIN']), replyCtrl.create);

export default r;
