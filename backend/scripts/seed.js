import 'dotenv/config';
import pkg from '@prisma/client';
import bcrypt from 'bcrypt';
const { PrismaClient, Role } = pkg;

const prisma = new PrismaClient();

async function main(){
  const pass = await bcrypt.hash('Passw0rd!', 10);
  const [student, tutor, admin] = await Promise.all([
    prisma.user.upsert({ where:{ email:'student@demo.dev' }, update:{}, create:{ name:'Student', email:'student@demo.dev', password: pass, role: Role.STUDENT, verified: true } }),
    prisma.user.upsert({ where:{ email:'tutor@demo.dev' }, update:{}, create:{ name:'Tutor', email:'tutor@demo.dev', password: pass, role: Role.TUTOR, verified: true } }),
    prisma.user.upsert({ where:{ email:'admin@demo.dev' }, update:{}, create:{ name:'Admin', email:'admin@demo.dev', password: pass, role: Role.ADMIN, verified: true } })
  ]);

  const topic = await prisma.topic.create({ data: { title:'Intro to SQL', content:'How do JOINs work?', authorId: student.id, assigneeId: tutor.id } });
  await prisma.reply.create({ data: { content:'Start with INNER JOIN, then LEFT/RIGHT. Draw two circles!', authorId: tutor.id, topicId: topic.id } });
  console.log('Seed complete.');
}
main().finally(()=>prisma.$disconnect());

