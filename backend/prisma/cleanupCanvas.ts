import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpiando datos de canvas corruptos...');
  
  const updated = await prisma.apunte.updateMany({
    where: { tipo: 'canvas' },
    data: { canvasData: null }
  });
  
  console.log(`✅ Se resetearon ${updated.count} lienzos para evitar errores de carga.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
