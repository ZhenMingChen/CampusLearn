import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { sendWhatsapp } from '../integrations/twilio.js';

/**
 * @openapi
 * tags:
 *   - name: Integrations
 *     description: Third-party integrations (Twilio WhatsApp)
 */

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
const r = Router();

r.post('/whatsapp/test', authRequired, async (req, res, next) => {
  try {
    const text = req.body?.text || 'CampusLearn WhatsApp test message';
    const out = await sendWhatsapp(text);
    res.json({ ok: true, result: out });
  } catch (e) { next(e); }
});

export default r;
