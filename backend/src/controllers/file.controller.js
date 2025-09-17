// backend/src/controllers/file.controller.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'No file uploaded' } });
    }
    const userId = req.user?.id;
    const { topicId } = req.body || {};

    // optional: verify topic exists if topicId provided
    if (topicId) {
      const exists = await prisma.topic.findUnique({ where: { id: topicId }, select: { id: true }});
      if (!exists) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Topic not found' } });
    }

    const rec = await prisma.file.create({
      data: {
        url: `/uploads/${req.file.filename}`,
        mime: req.file.mimetype,
        size: req.file.size,
        uploaderId: userId,
        topicId: topicId || null,
      }
    });

    res.status(201).json(rec);
  } catch (e) { next(e); }
}
