/**
 * Comprehensive Data Fix Script
 * - Sets all 3 materias to "Cursando" 
 * - Updates schedules with Teoría/Práctica, professors, and corrected aulas
 * - Data verified from eco.mdp.edu.ar/aulas and Moodle forums
 * Run: npx tsx prisma/seedFixCalendario.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📅 Corrigiendo datos del calendario...\n');

  // Get all materias
  const materias = await prisma.materia.findMany();
  console.log(`Materias: ${materias.map(m => m.nombre).join(', ')}`);

  // === 1. SET ALL MATERIAS TO "Cursando" ===
  await prisma.materia.updateMany({
    data: { estado: 'Cursando' },
  });
  console.log('✅ Todas las materias → estado "Cursando"\n');

  // === 2. INTRODUCCIÓN A LA ECONOMÍA (Comisión 50) ===
  const introEco = materias.find(m => m.nombre.includes('Economía') || m.nombre.includes('Economia'));
  if (introEco) {
    // Update profesor
    await prisma.materia.update({
      where: { id: introEco.id },
      data: { profesor: 'Dr. Eugenio Actis Di Pasquale' },
    });

    // Delete and recreate horarios with enriched data
    await prisma.horario.deleteMany({ where: { materiaId: introEco.id } });
    await prisma.horario.createMany({
      data: [
        {
          materiaId: introEco.id,
          diaSemana: 'Martes',
          horaInicio: '08:00',
          horaFin: '11:00',
          aula: 'Aula 14',
          tipo: 'Teórico-Práctico',
          profesor: 'Dr. Eugenio Actis Di Pasquale',
        },
        {
          materiaId: introEco.id,
          diaSemana: 'Viernes',
          horaInicio: '08:00',
          horaFin: '11:00',
          aula: 'Aula 14',
          tipo: 'Teórico-Práctico',
          profesor: 'Dr. Eugenio Actis Di Pasquale',
        },
      ],
    });
    console.log('✅ Introducción a la Economía:');
    console.log('   Mar 08:00-11:00 Aula 14 (Teórico-Práctico)');
    console.log('   Vie 08:00-11:00 Aula 14 (Teórico-Práctico)\n');
  }

  // === 3. MATEMÁTICA 1 (Comisión 4) ===
  const mate = materias.find(m => m.nombre.includes('Matemática') || m.nombre.includes('Matematica'));
  if (mate) {
    await prisma.materia.update({
      where: { id: mate.id },
      data: { profesor: 'Martinez Canto Eugenio / García Boviero Mailén' },
    });

    await prisma.horario.deleteMany({ where: { materiaId: mate.id } });
    await prisma.horario.createMany({
      data: [
        {
          materiaId: mate.id,
          diaSemana: 'Lunes',
          horaInicio: '12:00',
          horaFin: '14:00',
          aula: 'Aula 10',
          tipo: 'Teoría',
          profesor: 'Martinez Canto Eugenio',
        },
        {
          materiaId: mate.id,
          diaSemana: 'Miércoles',
          horaInicio: '08:00',
          horaFin: '10:00',
          aula: 'Aula 14',
          tipo: 'Práctica',
          profesor: 'García Boviero Mailén',
        },
      ],
    });
    console.log('✅ Matemática 1:');
    console.log('   Lun 12:00-14:00 Aula 10 (Teoría - Martinez Canto)');
    console.log('   Mié 08:00-10:00 Aula 14 (Práctica - García Boviero)\n');
  }

  // === 4. PRINCIPIOS DE ADMINISTRACIÓN (Comisión 50) ===
  const admin = materias.find(m => m.nombre.includes('Administración') || m.nombre.includes('Administracion'));
  if (admin) {
    await prisma.materia.update({
      where: { id: admin.id },
      data: { profesor: 'Daniel Guzman / Florencia Mussano' },
    });

    await prisma.horario.deleteMany({ where: { materiaId: admin.id } });
    await prisma.horario.createMany({
      data: [
        {
          materiaId: admin.id,
          diaSemana: 'Lunes',
          horaInicio: '11:00',
          horaFin: '13:30',
          aula: 'Aula 01',
          tipo: 'Teoría',
          profesor: 'Daniel Guzman',
        },
        {
          materiaId: admin.id,
          diaSemana: 'Miércoles',
          horaInicio: '11:00',
          horaFin: '13:30',
          aula: 'Aula 01',
          tipo: 'Teoría',
          profesor: 'Daniel Guzman',
        },
        {
          materiaId: admin.id,
          diaSemana: 'Jueves',
          horaInicio: '10:00',
          horaFin: '12:30',
          aula: 'Aula 06',
          tipo: 'Práctica',
          profesor: 'Florencia Mussano',
        },
      ],
    });
    console.log('✅ Principios de Administración:');
    console.log('   Lun 11:00-13:30 Aula 01 (Teoría - Daniel Guzman)');
    console.log('   Mié 11:00-13:30 Aula 01 (Teoría - Daniel Guzman)');
    console.log('   Jue 10:00-12:30 Aula 06 (Práctica - Florencia Mussano)\n');
  }

  console.log('🎉 ¡Calendario corregido exitosamente!');
  console.log('📌 Las 3 materias ahora aparecerán en el calendario.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
