// backend/src/controllers/topic.controller.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

/** GET /topics (role-aware) */
export async function list(req, res, next) {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let where = {};
    if (role === 'ADMIN') {
      where = {};
    } else if (role === 'TUTOR') {
      where = {
        OR: [
          { status: 'OPEN' },
          { assigneeId: userId },
        ],
      };
    } else {
      where = {
        OR: [
          { authorId: userId },
          { assigneeId: userId },
          { status: 'OPEN' },
        ],
      };
    }

    const topics = await prisma.topic.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author:   { select: { id: true, name: true, email: true, role: true } },
        assignee: { select: { id: true, name: true, email: true, role: true } },
        replies:  {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true } } },
        },
        files: true,
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
        author:   { select: { id: true, name: true, email: true, role: true } },
        assignee: { select: { id: true, name: true, email: true, role: true } },
        replies:  {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true } } },
        },
        files: true,
      },
    });
    if (!topic) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Topic not found' } });
    res.json(topic);
  } catch (err) { next(err); }
}

/** POST /topics (STUDENT only) */
export async function create(req, res, next) {
  try {
    const { title, content } = req.body || {};
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing user' } });
    if (!title || !content) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'title and content are required' } });
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        content,
        authorId: userId,
        status: 'OPEN',
      },
      include: {
        author:  { select: { id: true, name: true, email: true, role: true } },
        replies: true,
        files: true,
      },
    });

    res.status(201).json(topic);
  } catch (err) { next(err); }
}

/** POST /topics/:id/assign/:assigneeId (ADMIN/TUTOR) */
export async function assign(req, res, next) {
  try {
    const { id, assigneeId } = req.params;
    const updated = await prisma.topic.update({
      where: { id },
      data: { assigneeId, status: 'ASSIGNED' },
      include: {
        author:   { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });
    res.json(updated);
  } catch (err) { next(err); }
}

/** DELETE /topics/:id (ADMIN) */
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.reply.deleteMany({ where: { topicId: id } }); // clean replies first (FK safety)
    await prisma.file.deleteMany({ where: { topicId: id } });  // clean files if linked
    await prisma.topic.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) { next(err); }
}




