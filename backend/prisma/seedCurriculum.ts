/**
 * Seed Script: Full first-year curriculum, paro-specific events, and exam dates
 * Data from Plan de Estudios 2005 (Lic. en Administración, FCEyS, UNMdP)
 * Run: npx tsx prisma/seedCurriculum.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📚 Configurando plan de estudios completo...\n');

  // === 1. UPDATE EXISTING MATERIAS (1er Cuatrimestre, 1er Año) ===
  const existing = await prisma.materia.findMany();

  for (const m of existing) {
    await prisma.materia.update({
      where: { id: m.id },
      data: { anio: 1, cuatrimestre: '1er Cuatrimestre' },
    });
  }
  console.log('✅ Materias existentes → Año 1, 1er Cuatrimestre\n');

  // === 2. ADD 2DO CUATRIMESTRE (1er Año) SUBJECTS ===
  const COLORS_2DO = ['#0891B2', '#7C3AED', '#DB2777', '#059669'];
  const materias2doCuat = [
    { nombre: 'Contabilidad I', profesor: 'A confirmar', color: COLORS_2DO[0] },
    { nombre: 'Historia Económica y Social I', profesor: 'A confirmar', color: COLORS_2DO[1] },
    { nombre: 'Sociología', profesor: 'A confirmar', color: COLORS_2DO[2] },
    { nombre: 'Matemática II', profesor: 'A confirmar', color: COLORS_2DO[3] },
  ];

  for (const m of materias2doCuat) {
    const exists = await prisma.materia.findFirst({ where: { nombre: m.nombre } });
    if (!exists) {
      await prisma.materia.create({
        data: {
          nombre: m.nombre,
          profesor: m.profesor,
          estado: 'Pendiente',
          color: m.color,
          anio: 1,
          cuatrimestre: '2do Cuatrimestre',
        },
      });
      console.log(`  + ${m.nombre} (2do Cuat, Pendiente)`);
    }
  }

  // === 3. UPDATE PARO EVENTS WITH SPECIFIC CLASS INFO ===
  // Delete old generic paro events
  await prisma.evento.deleteMany({ where: { esParo: true } });

  // Create detailed paro events for each day (March 16-20, 2026)
  const paroEvents = [
    {
      titulo: 'Paro Docente - Sin Ppios. Admin (Teoría) ni Matemática 1 (Teoría)',
      fecha: new Date('2026-03-16T00:00:00'),
      descripcion: '⚠️ Matemática 1 Lunes 12:00-14:00 (Aula 10): CLASE NORMAL según foro. Ppios. Admin Lun 11:00-13:30 (Aula 01): SUSPENDIDA.',
      color: '#DC2626',
      esParo: true,
    },
    {
      titulo: 'Paro Docente - Sin Intro. Economía',
      fecha: new Date('2026-03-17T00:00:00'),
      descripcion: '⚠️ Intro. Economía Mar 08:00-11:00 (Aula 14): SUSPENDIDA por paro.',
      color: '#DC2626',
      esParo: true,
    },
    {
      titulo: 'Paro Docente - Sin Matemática 1 (Práctica) ni Ppios. Admin (Teoría)',
      fecha: new Date('2026-03-18T00:00:00'),
      descripcion: '⚠️ Matemática 1 Mié 08:00-10:00 (Aula 14): SUSPENDIDA. Ppios. Admin Mié 11:00-13:30 (Aula 01): SUSPENDIDA.',
      color: '#DC2626',
      esParo: true,
    },
    {
      titulo: 'Paro Docente - Sin Ppios. Admin (Práctica)',
      fecha: new Date('2026-03-19T00:00:00'),
      descripcion: '⚠️ Ppios. Admin Jue 10:00-12:30 (Aula 06): SUSPENDIDA por paro.',
      color: '#DC2626',
      esParo: true,
    },
    {
      titulo: 'Paro Docente - Sin Intro. Economía',
      fecha: new Date('2026-03-20T00:00:00'),
      descripcion: '⚠️ Intro. Economía Vie 08:00-11:00 (Aula 14): SUSPENDIDA por paro.',
      color: '#DC2626',
      esParo: true,
    },
  ];

  for (const ev of paroEvents) {
    await prisma.evento.create({ data: ev });
  }
  console.log('\n✅ Eventos de Paro detallados inyectados (16-20 marzo)\n');

  // === 4. ADD EXAM DATES FOR 1ER AÑO ===
  // Get materias for exam association
  const allMaterias = await prisma.materia.findMany();
  const introEco = allMaterias.find(m => m.nombre.includes('Economía'));
  const mate1 = allMaterias.find(m => m.nombre === 'Matemática 1');
  const admin = allMaterias.find(m => m.nombre.includes('Administración'));

  // Delete existing exams for clean slate
  if (introEco) await prisma.examen.deleteMany({ where: { materiaId: introEco.id } });
  if (mate1) await prisma.examen.deleteMany({ where: { materiaId: mate1.id } });
  if (admin) await prisma.examen.deleteMany({ where: { materiaId: admin.id } });

  // Typical exam schedule for 1er cuatrimestre (approximate dates)
  // Parciales: around week 7-8 and week 13-14
  // Finals: after end of semester (July/August)
  const examenes = [];

  if (introEco) {
    examenes.push(
      { materiaId: introEco.id, fecha: new Date('2026-05-05T08:00:00'), tipo: 'Parcial', aula: 'Aula 14', notas: '1er Parcial - Unidades 1-4' },
      { materiaId: introEco.id, fecha: new Date('2026-06-16T08:00:00'), tipo: 'Parcial', aula: 'Aula 14', notas: '2do Parcial - Unidades 5-8' },
      { materiaId: introEco.id, fecha: new Date('2026-06-30T08:00:00'), tipo: 'Recuperatorio', aula: 'A confirmar', notas: 'Recuperatorio' },
      { materiaId: introEco.id, fecha: new Date('2026-07-20T08:00:00'), tipo: 'Final', aula: 'A confirmar', notas: 'Mesa de Julio' },
    );
  }

  if (mate1) {
    examenes.push(
      { materiaId: mate1.id, fecha: new Date('2026-04-27T12:00:00'), tipo: 'Parcial', aula: 'Aula 10', notas: '1er Parcial - Funciones y Límites' },
      { materiaId: mate1.id, fecha: new Date('2026-06-08T12:00:00'), tipo: 'Parcial', aula: 'Aula 10', notas: '2do Parcial - Derivadas e Integrales' },
      { materiaId: mate1.id, fecha: new Date('2026-06-22T12:00:00'), tipo: 'Recuperatorio', aula: 'A confirmar', notas: 'Recuperatorio' },
      { materiaId: mate1.id, fecha: new Date('2026-07-20T10:00:00'), tipo: 'Final', aula: 'A confirmar', notas: 'Mesa de Julio' },
    );
  }

  if (admin) {
    examenes.push(
      { materiaId: admin.id, fecha: new Date('2026-05-04T11:00:00'), tipo: 'Parcial', aula: 'Aula 01', notas: '1er Parcial - Teoría de la Administración' },
      { materiaId: admin.id, fecha: new Date('2026-06-15T11:00:00'), tipo: 'Parcial', aula: 'Aula 01', notas: '2do Parcial - Funciones y procesos' },
      { materiaId: admin.id, fecha: new Date('2026-06-29T11:00:00'), tipo: 'Recuperatorio', aula: 'A confirmar', notas: 'Recuperatorio' },
      { materiaId: admin.id, fecha: new Date('2026-07-21T10:00:00'), tipo: 'Final', aula: 'A confirmar', notas: 'Mesa de Julio' },
    );
  }

  for (const ex of examenes) {
    await prisma.examen.create({ data: ex });
  }
  console.log(`✅ ${examenes.length} exámenes inyectados (parciales, recuperatorios, finales)\n`);

  console.log('🎉 ¡Plan de estudios completo configurado!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
