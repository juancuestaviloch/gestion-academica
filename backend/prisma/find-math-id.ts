import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const materia = await prisma.materia.findFirst({
    where: { nombre: { contains: 'Matemática' } }
  });
  console.log(JSON.stringify(materia, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
