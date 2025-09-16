// backend/src/controllers/topic.controller.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

/** GET /topics */
export async function list(_req, res, next) {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
        assignee: { select: { id: true, name: true, email: true, role: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true } } },
        },
      },
    });
    res.json(topics);
  } catch (err) { next(err); }
}

/** GET /topics/:id */
export async function get(req, res, next) {
  try {
    const { id } = req.params;
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
        assignee: { select: { id: true, name: true, email: true, role: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true } } },
        },
      },
    });
    if (!topic) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Topic not found' } });
    res.json(topic);
  } catch (err) { next(err); }
}

/** POST /topics  (STUDENT only) */
export async function create(req, res, next) {
  try {
    const { title, content } = req.body || {};
    const userId = req.user?.id; // set by authRequired middleware
    if (!userId) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing user' } });
    if (!title || !content) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'title and content are required' } });
    }

    // Use EITHER authorId or author.connect; here we use authorId (simpler)
    const topic = await prisma.topic.create({
      data: {
        title,
        content,
        authorId: userId,          // <-- key fix
        // status will default to OPEN in schema; omit assigneeId unless you really assign
      },
      include: {
        author: { select: { id: true, name: true } },
        replies: true,
      },
    });

    return res.status(201).json(topic);
  } catch (err) { next(err); }
}

/** POST /topics/:id/assign/:assigneeId  (ADMIN/TUTOR if you enable it) */
export async function assign(req, res, next) {
  try {
    const { id, assigneeId } = req.params;
    const updated = await prisma.topic.update({
      where: { id },
      data: { assigneeId },
      include: {
        author: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });
    res.json(updated);
  } catch (err) { next(err); }
}

/** DELETE /topics/:id  (ADMIN only if you add the route) */
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.topic.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) { next(err); }
}
