// backend/src/integrations/twilio.js
import twilio from 'twilio';

const enabled = String(process.env.TWILIO_ENABLED || '').toLowerCase() === 'true';
const SID     = process.env.TWILIO_ACCOUNT_SID;
const TOKEN   = process.env.TWILIO_AUTH_TOKEN;
const FROM    = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+14155238886

let client = null;
if (enabled && SID && TOKEN) {
  client = twilio(SID, TOKEN);
}

/**
 * Send a WhatsApp message via Twilio.
 * Returns { skipped: true, reason } if disabled/misconfigured.
 * @param {string} to   - 'whatsapp:+<country><number>'
 * @param {string} text - message body
 */
export async function sendWhatsapp(to, text) {
  if (!enabled)                          return { skipped: true, reason: 'TWILIO_ENABLED=false' };
  if (!SID || !TOKEN)                    return { skipped: true, reason: 'Missing TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN' };
  if (!FROM)                             return { skipped: true, reason: 'Missing TWILIO_WHATSAPP_FROM' };
  if (!to?.startsWith('whatsapp:+'))     return { skipped: true, reason: 'Invalid "to" (must start with whatsapp:)' };
  if (!text)                             return { skipped: true, reason: 'Empty text' };

  try {
    const msg = await client.messages.create({ from: FROM, to, body: text });
    console.log('[WHATSAPP:SENT]', msg.sid, '->', to);
    return { sid: msg.sid, to, from: FROM };
  } catch (err) {
    console.error('[WHATSAPP:ERROR]', err.message);
    return { skipped: true, reason: err.message };
  }
}

