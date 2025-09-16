// backend/src/routes/file.routes.js
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';   // <- consistent name
import { upload } from '../utils/storage.js';
import * as ctrl from '../controllers/file.controller.js';

const r = Router();

/**
 * @openapi
 * tags:
 *   - name: Files
 *     description: Learning materials upload/download
 */

/**
 * @openapi
 * /file/upload:
 *   post:
 *     summary: Upload a learning material
 *     tags: [Files]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: File uploaded (record returned) }
 *       400: { description: No file or invalid payload }
 *       401: { description: Auth required }
 */
r.post('/upload', authRequired, upload.single('file'), ctrl.upload);

export default r;
