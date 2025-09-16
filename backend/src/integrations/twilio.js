// backend/src/integrations/twilio.js
import twilio from 'twilio';

const sid  = process.env.TWILIO_SID || "";
const tok  = process.env.TWILIO_TOKEN || "";
const from = process.env.TWILIO_WHATSAPP_FROM || ""; // e.g., 'whatsapp:+14155238886'
const to   = process.env.TWILIO_WHATSAPP_TO   || ""; // e.g., 'whatsapp:+27XXXXXXXXX'

let client = null;
if (sid && tok && from && to) client = twilio(sid, tok);

export async function sendWhatsapp(text) {
  if (!client) {
    console.log("[Twilio] Skipped (missing env). Message:", text);
    return { skipped: true };
  }
  const resp = await client.messages.create({ from, to, body: text });
  return { sid: resp.sid };
}

