// backend/src/routes/topic.routes.js
import { Router } from 'express';
import * as topicCtrl from '../controllers/topic.controller.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

/**
 * @openapi
 * tags:
 *   - name: Topics
 *     description: Student topics, assignment and management
 */

/**
 * @openapi
 * /topics:
 *   get:
 *     summary: List topics (paginated)
 *     tags: [Topics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50 }
 *         example: 10
 *       - in: query
 *         name: query
 *         schema: { type: string }
 *         example: "database"
 *     responses:
 *       200:
 *         description: Paginated list of topics
 */
const r = Router();

// Logged-in users can read topics
r.get('/', authRequired, topicCtrl.list);

/**
 * @openapi
 * /topics/{id}:
 *   get:
 *     summary: Get a single topic by id
 *     tags: [Topics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Topic returned }
 *       404: { description: Topic not found }
 */
r.get('/:id', authRequired, topicCtrl.get);

/**
 * @openapi
 * /topics:
 *   post:
 *     summary: Create a new topic (Student)
 *     tags: [Topics]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:   { type: string, example: "Indexing in Postgres" }
 *               content: { type: string, example: "How do GIN indexes work?" }
 *     responses:
 *       201: { description: Topic created }
 *       400: { description: Validation error }
 *       401: { description: Auth required }
 *       403: { description: Role not allowed (requires STUDENT) }
 */
// STUDENT: create topics
r.post('/', authRequired, requireRole(['STUDENT']), topicCtrl.create);

/**
 * @openapi
 * /topics/{id}:
 *   delete:
 *     summary: Delete a topic (Admin)
 *     tags: [Topics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 *       401: { description: Auth required }
 *       403: { description: Admin only }
 *       404: { description: Not found }
 */
// ADMIN: delete topics (clear difference vs Tutor)
r.delete('/:id', authRequired, requireRole(['ADMIN']), topicCtrl.remove);

/**
 * @openapi
 * /topics/{id}/assign/{assigneeId}:
 *   post:
 *     summary: Assign a topic to a tutor (Admin)
 *     tags: [Topics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: assigneeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Assignment updated }
 *       401: { description: Auth required }
 *       403: { description: Admin only }
 *       404: { description: Not found }
 */
// ADMIN: assign a tutor to a topic (optional feature for your demo)
r.post('/:id/assign/:assigneeId', authRequired, requireRole(['ADMIN']), topicCtrl.assign);

export default r;

