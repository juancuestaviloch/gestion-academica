import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const materias = await prisma.materia.findMany({ include: { horarios: true } });
  console.log(JSON.stringify(materias, null, 2));
}
run();
