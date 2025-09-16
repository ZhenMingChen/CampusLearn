// backend/src/integrations/routes.js
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { sendWhatsapp } from './twilio.js';
import { copilotSuggest } from './openai.js';

/**
 * @openapi
 * tags:
 *   - name: Integrations
 *     description: Third-party integrations (Twilio WhatsApp, Copilot)
 */
const r = Router();

/**
 * @openapi
 * /integrations/whatsapp/test:
 *   post:
 *     summary: Send a WhatsApp test message (Twilio)
 *     tags: [Integrations]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "CampusLearn WhatsApp test message"
 *     responses:
 *       200: { description: Message sent (or skipped if env missing) }
 *       401: { description: Auth required }
 */
r.post('/whatsapp/test', authRequired, async (req, res, next) => {
  try {
    const text = req.body?.text || 'CampusLearn WhatsApp test message';
    const out = await sendWhatsapp(text);
    res.json({ ok: true, result: out });
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /integrations/copilot:
 *   post:
 *     summary: Ask CampusLearn Copilot (OpenAI)
 *     description: Returns a concise assistant reply. Safely returns `{ skipped: true }` if OPENAI_API_KEY is not set.
 *     tags: [Integrations]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prompt]
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Explain the difference between GIN and BTREE indexes in Postgres."
 *     responses:
 *       200:
 *         description: Assistant response or `{ skipped: true }`
 *       401: { description: Auth required }
 */
r.post('/copilot', authRequired, async (req, res, next) => {
  try {
    const prompt = req.body?.prompt ?? '';
    const out = await copilotSuggest(prompt);
    res.json({ ok: true, result: out });
  } catch (e) { next(e); }
});

export default r;


