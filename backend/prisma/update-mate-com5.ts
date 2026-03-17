import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const materiaId = 10;
  
  // 1. Update subject name/professor
  await prisma.materia.update({
    where: { id: materiaId },
    data: {
      profesor: 'Comisión 5 - Daniel Guzmán',
      estado: 'Cursando'
    }
  });

  // 2. Clear old schedules
  await prisma.horario.deleteMany({
    where: { materiaId }
  });

  // 3. Create new schedules
  await prisma.horario.createMany({
    data: [
      {
        materiaId,
        diaSemana: 'Lunes',
        horaInicio: '11:00',
        horaFin: '12:30',
        tipo: 'Teoría',
        aula: 'A definir'
      },
      {
        materiaId,
        diaSemana: 'Miércoles',
        horaInicio: '11:00',
        horaFin: '12:30',
        tipo: 'Práctica',
        aula: 'A definir'
      }
    ]
  });

  console.log('✅ Matemática 1 actualizada a Comisión 5.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
