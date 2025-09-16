// backend/src/routes/system.routes.js
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';

/**
 * @openapi
 * /system/info:
 *   get:
 *     summary: Show runtime config useful for the demo (no secrets)
 *     tags: [System]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Current non-sensitive backend info
 */
const r = Router();

r.get('/info', authRequired, (_req, res) => {
  const cors = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);
  res.json({
    ok: true,
    time: new Date().toISOString(),
    copilotProvider: (process.env.COPILOT_PROVIDER || 'openai/auto'),
    ollama: {
      host: process.env.OLLAMA_HOST || null,
      model: process.env.OLLAMA_MODEL || null,
    },
    uploads: {
      dir: process.env.UPLOAD_DIR,
      maxMB: Number(process.env.MAX_FILE_MB || 10),
      allowed: (process.env.ALLOWED_MIME || '').split(',').filter(Boolean),
    },
    corsOrigins: cors,
    env: 'demo', // don’t expose secrets or raw env here
  });
});

export default r;