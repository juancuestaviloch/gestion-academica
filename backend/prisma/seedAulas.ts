/**
 * Seed Script: Inject verified classroom (aula) assignments
 * Data extracted from eco.mdp.edu.ar/aulas on 2026-03-13
 * Week of 16-21 March 2026 (first week of classes)
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏫 Inyectando datos de aulas verificados...');

  // Get all materias
  const materias = await prisma.materia.findMany({ include: { horarios: true } });
  console.log(`Materias encontradas: ${materias.map(m => m.nombre).join(', ')}`);

  // 1. Introducción a la Economía (Comisión 50)
  //    Martes 08:00-11:00 → Aula 14
  //    Viernes 08:00-11:00 → Aula 14
  const introEco = materias.find(m => m.nombre.includes('Economía') || m.nombre.includes('Economia'));
  if (introEco) {
    // Delete existing horarios and recreate with aulas
    await prisma.horario.deleteMany({ where: { materiaId: introEco.id } });
    await prisma.horario.createMany({
      data: [
        { materiaId: introEco.id, diaSemana: 'Martes', horaInicio: '08:00', horaFin: '11:00', aula: 'Aula 14' },
        { materiaId: introEco.id, diaSemana: 'Viernes', horaInicio: '08:00', horaFin: '11:00', aula: 'Aula 14' },
      ],
    });
    console.log('✅ Introducción a la Economía → Aula 14 (Mar y Vie)');
  }

  // 2. Matemática 1 (Comisión 4)
  //    Lunes 12:00-14:00 (Teoría - Belén Álvarez) → Aula 11
  //    Miércoles 08:00-10:30 (Práctica - Mailén García Boviero) → Aula 14
  const mate = materias.find(m => m.nombre.includes('Matemática') || m.nombre.includes('Matematica'));
  if (mate) {
    await prisma.horario.deleteMany({ where: { materiaId: mate.id } });
    await prisma.horario.createMany({
      data: [
        { materiaId: mate.id, diaSemana: 'Lunes', horaInicio: '12:00', horaFin: '14:00', aula: 'Aula 11' },
        { materiaId: mate.id, diaSemana: 'Miércoles', horaInicio: '08:00', horaFin: '10:30', aula: 'Aula 14' },
      ],
    });
    console.log('✅ Matemática 1 → Aula 11 (Lun) / Aula 14 (Mié)');
  }

  // 3. Principios de Administración (Comisión 50)
  //    Lunes 11:00-12:30 (Teoría - Daniel Guzman) → Aula 01
  //    Miércoles 11:00-12:30 (Teoría - Daniel Guzman) → Aula 01
  //    Jueves 10:00-12:00 (Práctica - Florencia Mussano) → Aula 06
  const admin = materias.find(m => m.nombre.includes('Administración') || m.nombre.includes('Administracion'));
  if (admin) {
    await prisma.horario.deleteMany({ where: { materiaId: admin.id } });
    await prisma.horario.createMany({
      data: [
        { materiaId: admin.id, diaSemana: 'Lunes', horaInicio: '11:00', horaFin: '12:30', aula: 'Aula 01' },
        { materiaId: admin.id, diaSemana: 'Miércoles', horaInicio: '11:00', horaFin: '12:30', aula: 'Aula 01' },
        { materiaId: admin.id, diaSemana: 'Jueves', horaInicio: '10:00', horaFin: '12:00', aula: 'Aula 06' },
      ],
    });
    console.log('✅ Principios de Administración → Aula 01 (Lun/Mié) / Aula 06 (Jue)');
  }

  console.log('\n🎉 ¡Aulas inyectadas exitosamente!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
