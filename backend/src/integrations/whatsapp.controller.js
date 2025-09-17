// backend/src/integrations/whatsapp.controller.js
import { sendWhatsApp } from '../services/notify.service.js';

export async function testSend(req, res, next) {
  try {
    const body = req.body?.message || 'Hello from CampusLearn (WhatsApp test)';
    const to = process.env.REPLY_NOTIFY_TO; // e.g. whatsapp:+27...
    const result = await sendWhatsApp(to, body);
    res.json({ ok: true, result });
  } catch (err) {
    next(err);
  }
}
