import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

import { sendWhatsapp } from '../integrations/twilio.js';

export async function create(userId, topicId, content) {
  if (!userId) throw new Error('Missing user');
  if (!content) throw new Error('Content is required');

  // find user for role/name
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  if (!['TUTOR', 'ADMIN'].includes(user.role)) {
    const err = new Error('Only tutor/admin can reply');
    err.status = 403;
    throw err;
  }

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { author: { select: { id: true, name: true, email: true } } }
  });
  if (!topic) {
    const err = new Error('Topic not found');
    err.status = 404;
    throw err;
  }

  const reply = await prisma.reply.create({
    data: { content, topicId, authorId: userId },
    include: { author: { select: { id: true, name: true } } },
  });

  // WhatsApp notify (safe skip if not configured)
  const to = process.env.REPLY_NOTIFY_TO;
  if (to) {
    const text =
      `📢 New reply on "${topic.title}"\n` +
      `By: ${reply.author?.name || 'Tutor'}\n` +
      `Message: ${content.substring(0, 200)}${content.length > 200 ? '…' : ''}`;
    sendWhatsapp(to, text)
      .then(out => {
        if (out?.sid) console.log('[ReplyNotify] WhatsApp sent', out.sid);
        else console.log('[ReplyNotify] skipped:', out?.reason);
      })
      .catch(e => console.log('[ReplyNotify] error:', e.message));
  }

  return reply;
}
