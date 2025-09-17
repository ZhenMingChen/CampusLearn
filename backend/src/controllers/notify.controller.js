import { sendWhatsApp } from '../services/notify.service.js';

export async function test(req, res, next) {
  try {
    const body = (req.body?.message) || 'Hello from CampusLearn (WhatsApp test)';
    const to = process.env.REPLY_NOTIFY_TO;
    const result = await sendWhatsApp(to, body);
    res.json({ ok: true, result });
  } catch (err) { next(err); }
}
