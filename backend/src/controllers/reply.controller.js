import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

/**
 * POST /replies/:topicId
 * body: { content }
 * auth: TUTOR or ADMIN
 */
export async function create(req, res, next) {
  try {
    const topicId = req.params.topicId;
    const { content } = req.body || {};
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing user' } });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'content is required' } });
    }

    // Ensure topic exists
    const topic = await prisma.topic.findUnique({ where: { id: topicId }, select: { id: true } });
    if (!topic) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Topic not found' } });
    }

    // Create reply using foreign key ids (no nested connect)
    const reply = await prisma.reply.create({
      data: {
        content: content.trim(),
        topicId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json(reply);
  } catch (err) {
    next(err);
  }
}

/**
 * (optional) GET /replies/topic/:topicId  — list replies for a topic
 */
export async function listForTopic(req, res, next) {
  try {
    const { topicId } = req.params;
    const replies = await prisma.reply.findMany({
      where: { topicId },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: { id: true, name: true } } },
    });
    res.json(replies);
  } catch (err) {
    next(err);
  }
}

