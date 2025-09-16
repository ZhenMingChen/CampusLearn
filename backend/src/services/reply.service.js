import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
export async function create(authorId, topicId, content){
  return prisma.reply.create({ data: { authorId, topicId, content }, include: { author: true } });
}
