import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Iniciando Master Reset y Resiembra Definitiva - Fase 14...');

  // 1. Borrado Masivo Total
  await prisma.horario.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.apunte.deleteMany({});
  await prisma.examen.deleteMany({});
  await prisma.tarea.deleteMany({});
  await prisma.asistencia.deleteMany({});
  await prisma.bibliografia.deleteMany({});
  await prisma.evento.deleteMany({});
  await prisma.meta.deleteMany({});
  await prisma.materia.deleteMany({});

  console.log('✨ Base de datos purgada. Inyectando 3 materias núcleo verificadas...');

  // 1. Matemática I (Comisión 5)
  await prisma.materia.create({
    data: {
      nombre: 'Matemática 1',
      profesor: 'Comisión 5 (Nicolas Llodra / Román)',
      estado: 'Cursando',
      color: '#059669', // Emerald
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Lunes', horaInicio: '08:00', horaFin: '10:30', tipo: 'Práctica', aula: 'Aula 07' },
          { diaSemana: 'Miércoles', horaInicio: '08:00', horaFin: '10:00', tipo: 'Teoría', aula: 'Aula 07' },
        ]
      }
    }
  });

  // 2. Principios de Administración (Comisión 50)
  await prisma.materia.create({
    data: {
      nombre: 'Principios de Administración',
      profesor: 'Comisión 50 (Daniel Guzman)',
      estado: 'Cursando',
      color: '#4F46E5', // Indigo
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Lunes', horaInicio: '11:00', horaFin: '12:30', tipo: 'Teoría', aula: 'Aula 01', profesor: 'Daniel Guzman' },
          { diaSemana: 'Miércoles', horaInicio: '11:00', horaFin: '12:30', tipo: 'Teoría', aula: 'Aula 01', profesor: 'Daniel Guzman' },
          { diaSemana: 'Jueves', horaInicio: '10:00', horaFin: '12:00', tipo: 'Práctica', aula: 'Aula 05' },
        ]
      }
    }
  });

  // 3. Introducción a la Economía (Comisión 50)
  await prisma.materia.create({
    data: {
      nombre: 'Introducción a la Economía',
      profesor: 'Comisión 50 (Giudice / Labruneé)',
      estado: 'Cursando',
      color: '#DC2626', // Red
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Martes', horaInicio: '08:00', horaFin: '11:00', tipo: 'Teoría', aula: 'Aula 14' },
          { diaSemana: 'Viernes', horaInicio: '08:00', horaFin: '11:00', tipo: 'Práctica', aula: 'Aula 13' },
        ]
      }
    }
  });

  // Eventos Académicos
  const year = 2026;
  await prisma.evento.createMany({
    data: [
      { titulo: 'Fin Cursada 1er Cuatrimestre', fecha: new Date(year, 6, 18), color: '#3B82F6', descripcion: 'Último día de clases antes de exámenes/vacaciones' },
      { titulo: '🏠 Receso Invernal', fecha: new Date(year, 6, 20), color: '#1E3A8A', descripcion: 'Inicio de vacaciones de invierno' },
      { titulo: '🏠 Receso Invernal (Fin)', fecha: new Date(year, 7, 2), color: '#1E3A8A', descripcion: 'Fin de vacaciones de invierno' },
    ]
  });

  console.log('✅ Inyección completada. 3 materias núcleo con horarios reales del Campus y eventos académicos cargados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
