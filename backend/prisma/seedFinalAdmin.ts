import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Iniciando Master Reset y Resiembra Definitiva - Lic. Administración 2026...');

  // 1. Borrado Masivo
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

  console.log('✨ Base de datos purgada. Inyectando 8 materias del 1er Año...');

  // --- 1ER CUATRIMESTRE (ESTADO: CURSANDO) ---

  const mate1 = await prisma.materia.create({
    data: {
      nombre: 'Matemática 1',
      profesor: 'Comisión 5 (Daniel Guzmán)',
      estado: 'Cursando',
      color: '#059669', // Emerald
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Lunes', horaInicio: '11:00', horaFin: '12:30', tipo: 'Teoría', aula: 'Aula 1' },
          { diaSemana: 'Miércoles', horaInicio: '11:00', horaFin: '12:30', tipo: 'Teoría', aula: 'Aula 1' },
          { diaSemana: 'Viernes', horaInicio: '11:00', horaFin: '13:30', tipo: 'Práctica', aula: 'Aula 2' },
        ]
      }
    }
  });

  const eco = await prisma.materia.create({
    data: {
      nombre: 'Introducción a la Economía',
      profesor: 'Comisión 50',
      estado: 'Cursando',
      color: '#DC2626', // Red
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Martes', horaInicio: '08:00', horaFin: '11:00', tipo: 'Teoría', aula: 'Aula 10' },
          { diaSemana: 'Viernes', horaInicio: '08:00', horaFin: '11:00', tipo: 'Práctica', aula: 'Aula 10' },
        ]
      }
    }
  });

  const admin = await prisma.materia.create({
    data: {
      nombre: 'Principios de Administración',
      profesor: 'Comisión 4',
      estado: 'Cursando',
      color: '#4F46E5', // Indigo
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Martes', horaInicio: '11:00', horaFin: '14:00', tipo: 'Teoría', aula: 'Aula 11' },
          { diaSemana: 'Jueves', horaInicio: '08:00', horaFin: '11:00', tipo: 'Práctica', aula: 'Aula 11' },
        ]
      }
    }
  });

  const sociales = await prisma.materia.create({
    data: {
      nombre: 'Introducción a las Ciencias Sociales',
      profesor: 'Comisión 1',
      estado: 'Cursando',
      color: '#D97706', // Amber
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Miércoles', horaInicio: '08:00', horaFin: '11:00', tipo: 'Teoría/Práctica', aula: 'Aula 5' },
        ]
      }
    }
  });

  // --- 2DO CUATRIMESTRE (ESTADO: PENDIENTE) ---

  const materias2C = [
    { nombre: 'Contabilidad I', color: '#7C3AED' },
    { nombre: 'Instituciones de Derecho Público', color: '#DB2777' },
    { nombre: 'Matemática II', color: '#0891B2' },
    { nombre: 'Historia Económica y Social General', color: '#4B5563' },
  ];

  for (const m of materias2C) {
    await prisma.materia.create({
      data: {
        nombre: m.nombre,
        profesor: 'A designar',
        estado: 'Pendiente',
        color: m.color,
        anio: 1,
        cuatrimestre: '2do Cuatrimestre'
      }
    });
  }

  // --- EVENTOS DE PARO (16-20 MARZO) ---
  const year = 2026;
  const month = 2; // Marzo
  await prisma.evento.createMany({
    data: [
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, month, 16), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, month, 17), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, month, 18), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, month, 19), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, month, 20), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
    ]
  });

  console.log('✅ Inyección completada exitosamente. 8 materias, horarios 2026 y eventos de paro cargados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
