import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Actualizando a Comisión 5 y verificando cronograma 2026...');

  // 1. Obtener las materias actuales por nombre para actualizarlas
  const mate = await prisma.materia.findFirst({ where: { nombre: 'Matemática 1' } });
  const eco = await prisma.materia.findFirst({ where: { nombre: 'Introducción a la Economía' } });
  const admin = await prisma.materia.findFirst({ where: { nombre: 'Principios de Administración' } });

  if (mate) {
    // Actualizar Matemática 1 a Comisión 5
    await prisma.materia.update({
      where: { id: mate.id },
      data: { profesor: 'Comisión 5 (Daniel Guzmán)' }
    });

    // Limpiar horarios viejos de Matemática
    await prisma.horario.deleteMany({ where: { materiaId: mate.id } });

    // Insertar nuevos horarios Com 5 (Teoría Lunes/Miércoles, Práctica Viernes)
    await prisma.horario.createMany({
      data: [
        { materiaId: mate.id, diaSemana: 'Lunes', horaInicio: '11:00', horaFin: '12:30', tipo: 'Teoría', aula: 'Aula 1' },
        { materiaId: mate.id, diaSemana: 'Miércoles', horaInicio: '11:00', horaFin: '12:30', tipo: 'Teoría', aula: 'Aula 1' },
        { materiaId: mate.id, diaSemana: 'Viernes', horaInicio: '11:00', horaFin: '13:30', tipo: 'Práctica', aula: 'Aula 2' },
      ]
    });
    console.log('✅ Matemática 1 -> Comisión 5 actualizada.');
  }

  if (eco) {
    // Verificar/Actualizar Economía (Com 50)
    await prisma.horario.deleteMany({ where: { materiaId: eco.id } });
    await prisma.horario.createMany({
      data: [
        { materiaId: eco.id, diaSemana: 'Martes', horaInicio: '08:00', horaFin: '11:00', tipo: 'Teoría', aula: 'Aula 10' },
        { materiaId: eco.id, diaSemana: 'Viernes', horaInicio: '08:00', horaFin: '11:00', tipo: 'Práctica', aula: 'Aula 10' },
      ]
    });
    console.log('✅ Introducción a la Economía (Com 50) verificada.');
  }

  if (admin) {
    // Ajustar Administración para no chocar (Jueves Mañana)
    await prisma.horario.deleteMany({ where: { materiaId: admin.id } });
    await prisma.horario.createMany({
      data: [
        { materiaId: admin.id, diaSemana: 'Jueves', horaInicio: '08:00', horaFin: '12:00', tipo: 'Teoría/Práctica', aula: 'Aula 11' },
      ]
    });
    console.log('✅ Principios de Administración ajustada a Jueves.');
  }

  console.log('🚀 Actualización de cronograma completada.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
