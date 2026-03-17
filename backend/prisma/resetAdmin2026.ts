import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpiando base de datos para inyectar Lic. en Administración 2026...');

  // 1. Borrado masivo para evitar residuo de otras carreras
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

  console.log('✨ Base de datos limpia. Inyectando materias reales 1er Cuatrimestre 2026...');

  // 2. Materia: Matemática I (Comisión 5 - Daniel Guzmán)
  const mate = await prisma.materia.create({
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

  // 3. Materia: Introducción a la Economía (Comisión 50)
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

  // 4. Materia: Principios de Administración (Comisión Matutina)
  const admin = await prisma.materia.create({
    data: {
      nombre: 'Principios de Administración',
      profesor: 'Comisión Matutina',
      estado: 'Cursando',
      color: '#4F46E5', // Indigo
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Jueves', horaInicio: '08:00', horaFin: '12:00', tipo: 'Teoría/Práctica', aula: 'Aula 11' },
        ]
      }
    }
  });

  // 5. Metas y Eventos (Paros de Marzo 16-20)
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

  console.log('✅ Inyección completada con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
