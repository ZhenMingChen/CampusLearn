import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function saveLocal(file){
  const record = await prisma.file.create({ data: { url: `/uploads/${file.filename}`, mime: file.mimetype, size: file.size } });
  console.log(`[WHATSAPP:mock] New file uploaded: ${record.url}`);
  return record;
}
