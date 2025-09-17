import twilio from 'twilio';

const enabled = String(process.env.TWILIO_ENABLED || '').toLowerCase() === 'true';
let client = null;
if (enabled) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/** Send a WhatsApp message (or log if TWILIO_ENABLED=false) */
export async function sendWhatsApp(to, body) {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!to) throw new Error('sendWhatsApp requires "to"');
  if (!body) throw new Error('sendWhatsApp requires "body"');

  if (!enabled) {
    console.log('[WHATSAPP:MOCK]', { to, from, body });
    return { sid: 'MOCK', to, from, body };
  }
  if (!from) throw new Error('TWILIO_WHATSAPP_FROM is not set');

  const msg = await client.messages.create({ from, to, body });
  console.log('[WHATSAPP:SENT]', msg.sid, '->', to);
  return msg;
}
