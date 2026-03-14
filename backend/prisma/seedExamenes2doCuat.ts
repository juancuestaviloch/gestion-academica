/**
 * Seed Script: Partial exam dates for 2nd semester subjects (Year 1)
 * Run: npx tsx prisma/seedExamenes2doCuat.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📅 Inyectando parciales del 2do Cuatrimestre...\n');

  const subjects = [
    'Contabilidad I',
    'Historia Económica y Social I',
    'Sociología',
    'Matemática II'
  ];

  const examsData = [
    {
      materiaNombre: 'Contabilidad I',
      exams: [
        { fecha: new Date('2026-10-06T09:00:00'), tipo: 'Parcial', notas: '1er Parcial - Introducción y Modelos' },
        { fecha: new Date('2026-11-17T09:00:00'), tipo: 'Parcial', notas: '2do Parcial - Cierre y Estados Contables' }
      ]
    },
    {
      materiaNombre: 'Historia Económica y Social I',
      exams: [
        { fecha: new Date('2026-10-08T09:00:00'), tipo: 'Parcial', notas: '1er Parcial - Edad Media a Rev. Industrial' },
        { fecha: new Date('2026-11-19T09:00:00'), tipo: 'Parcial', notas: '2do Parcial - Siglo XX y Globalización' }
      ]
    },
    {
      materiaNombre: 'Matemática II',
      exams: [
        { fecha: new Date('2026-10-05T09:00:00'), tipo: 'Parcial', notas: '1er Parcial - Álgebra Lineal' },
        { fecha: new Date('2026-11-16T09:00:00'), tipo: 'Parcial', notas: '2do Parcial - Cálculo Multivariable' }
      ]
    },
    {
      materiaNombre: 'Sociología',
      exams: [
        { fecha: new Date('2026-10-09T09:00:00'), tipo: 'Parcial', notas: '1er Parcial - Autores Clásicos' },
        { fecha: new Date('2026-11-20T09:00:00'), tipo: 'Parcial', notas: '2do Parcial - Sociología Contemporánea' }
      ]
    }
  ];

  for (const item of examsData) {
    const materia = await prisma.materia.findFirst({ where: { nombre: item.materiaNombre } });
    if (materia) {
      console.log(`Injecting exams for ${materia.nombre}...`);
      // Optional: Delete existing exams for these specific subjects if needed to avoid duplicates
      await prisma.examen.deleteMany({ where: { materiaId: materia.id } });

      for (const ex of item.exams) {
        await prisma.examen.create({
          data: {
            materiaId: materia.id,
            fecha: ex.fecha,
            tipo: ex.tipo,
            notas: ex.notas,
            aula: 'A confirmar'
          }
        });
      }
    } else {
      console.warn(`⚠️ Materia ${item.materiaNombre} no encontrada. Asegúrate de haber corrido seedCurriculum.ts primero.`);
    }
  }

  console.log('\n✅ Parciales del 2do cuatrimestre inyectados con éxito.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
