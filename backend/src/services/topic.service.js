import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function list(){
  return prisma.topic.findMany({ include: { author: true, assignee: true, files: true, replies: { include: { author: true } } }, orderBy: { createdAt: 'desc' } });
}
export async function get(id){
  const t = await prisma.topic.findUnique({ where: { id }, include: { author: true, assignee: true, files: true, replies: { include: { author: true } } } });
  if (!t) throw Object.assign(new Error('Topic not found'), { status: 404 });
  return t;
}
export async function create(authorId, { title, content, assigneeId }){
  return prisma.topic.create({ data: { title, content, authorId, assigneeId: assigneeId || null } });
}
export async function assign(id, assigneeId){
  await prisma.topic.update({ where: { id }, data: { assigneeId } });
}
