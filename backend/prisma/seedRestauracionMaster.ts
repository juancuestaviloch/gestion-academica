import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Iniciando Restauración Master - Fase 15...');

  // 1. Limpieza Total
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

  console.log('✨ Base de datos limpia. Restaurando datos históricos y cronograma verificado...');

  // --- 1. MATEMÁTICA I (Comisión 5) ---
  const mate = await prisma.materia.create({
    data: {
      nombre: 'Matemática 1',
      profesor: 'Comisión 5 (Nicolas Llodra / Román)',
      estado: 'Cursando',
      color: '#059669',
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Lunes', horaInicio: '08:00', horaFin: '10:30', tipo: 'Práctica', aula: 'Aula 07' },
          { diaSemana: 'Miércoles', horaInicio: '08:00', horaFin: '10:00', tipo: 'Teoría', aula: 'Aula 07' },
        ]
      },
      videos: {
        create: [
          { titulo: 'Video Clase 1: Sucesiones', url: 'https://eco.mdp.edu.ar/cv/mod/url/view.php?id=112073', duracion: '1h 30m' },
          { titulo: 'Video Clase 2: Límites', url: 'https://eco.mdp.edu.ar/cv/mod/url/view.php?id=112074', duracion: '1h 30m' },
          { titulo: 'Teoría: Límites y Continuidad', url: 'https://campus.universidad.edu.ar/mate1/video1', duracion: '2h 15m' },
        ]
      },
      apuntes: {
        create: [
          { titulo: 'Guía de TP n° 1', url: 'https://eco.mdp.edu.ar/cv/mod/resource/view.php?id=106405', tipo: 'archivo' },
          { titulo: 'PDF Clase 1', url: 'https://eco.mdp.edu.ar/cv/mod/resource/view.php?id=106400', tipo: 'archivo' },
        ]
      },
      examenes: {
        create: [
          { fecha: new Date('2026-05-18T08:00:00'), tipo: 'Parcial', notas: '1er Parcial - Unidades 1 y 2', aula: 'Aula 07' },
          { fecha: new Date('2026-06-22T08:00:00'), tipo: 'Parcial', notas: '2do Parcial - Unidades 3 y 4', aula: 'Aula 07' },
          { fecha: new Date('2026-07-13T08:00:00'), tipo: 'Final', notas: 'Examen Final Regular', aula: 'Aula 07' },
        ]
      }
    }
  });

  // --- 2. PRINCIPIOS DE ADMINISTRACIÓN (Comisión 50) ---
  const admin = await prisma.materia.create({
    data: {
      nombre: 'Principios de Administración',
      profesor: 'Comisión 50 (Daniel Guzman)',
      estado: 'Cursando',
      color: '#4F46E5',
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Lunes', horaInicio: '11:00', horaFin: '12:30', tipo: 'Teoría', aula: 'Aula 01', profesor: 'Daniel Guzman' },
          { diaSemana: 'Miércoles', horaInicio: '11:00', horaFin: '12:30', tipo: 'Teoría', aula: 'Aula 01', profesor: 'Daniel Guzman' },
          { diaSemana: 'Jueves', horaInicio: '10:00', horaFin: '12:00', tipo: 'Práctica', aula: 'Aula 05' },
        ]
      },
      videos: {
        create: [
          { titulo: 'Clase Magistral: Teoría de las Organizaciones', url: 'https://campus.universidad.edu.ar/admin/video1', duracion: '1h 30m', visto: true },
        ]
      },
      apuntes: {
        create: [
          { titulo: 'Presentación 2026 (Campus)', url: 'https://eco.mdp.edu.ar/cv/course/view.php?id=80', tipo: 'link' },
        ]
      },
      examenes: {
        create: [
          { fecha: new Date('2026-05-14T10:00:00'), tipo: 'Parcial', notas: '1er Parcial - Evolución del Pensamiento', aula: 'Aula 01' },
          { fecha: new Date('2026-06-18T10:00:00'), tipo: 'Parcial', notas: '2do Parcial - Estructura y Procesos', aula: 'Aula 01' },
          { fecha: new Date('2026-07-09T10:00:00'), tipo: 'Final', notas: 'Examen Final Regular', aula: 'Aula 01' },
        ]
      }
    }
  });

  // --- 3. INTRODUCCIÓN A LA ECONOMÍA (Comisión 50) ---
  const eco = await prisma.materia.create({
    data: {
      nombre: 'Introducción a la Economía',
      profesor: 'Comisión 50 (Giudice / Labruneé)',
      estado: 'Cursando',
      color: '#DC2626',
      anio: 1,
      cuatrimestre: '1er Cuatrimestre',
      horarios: {
        create: [
          { diaSemana: 'Martes', horaInicio: '08:00', horaFin: '11:00', tipo: 'Teoría', aula: 'Aula 14' },
          { diaSemana: 'Viernes', horaInicio: '08:00', horaFin: '11:00', tipo: 'Práctica', aula: 'Aula 13' },
        ]
      },
      videos: {
        create: [
          { titulo: 'Oferta, Demanda y Punto de Equilibrio', url: 'https://campus.universidad.edu.ar/eco/video1', duracion: '1h 50m' },
          { titulo: 'Carpeta de Materiales Audiovisuales', url: 'https://eco.mdp.edu.ar/cv/mod/folder/view.php?id=70092', duracion: 'Varios' }
        ]
      },
      apuntes: {
        create: [
          { titulo: 'Dossiers Unidad 1', url: 'https://eco.mdp.edu.ar/cv/mod/folder/view.php?id=84749', tipo: 'link' },
          { titulo: 'GUÍA DE TRABAJOS PRACTICOS U1 2026', url: 'https://eco.mdp.edu.ar/cv/mod/resource/view.php?id=100542', tipo: 'archivo' }
        ]
      },
      examenes: {
        create: [
          { fecha: new Date('2026-05-12T08:00:00'), tipo: 'Parcial', notas: '1er Parcial - Microeconomía', aula: 'Aula 14' },
          { fecha: new Date('2026-06-16T08:00:00'), tipo: 'Parcial', notas: '2do Parcial - Macroeconomía', aula: 'Aula 14' },
          { fecha: new Date('2026-07-07T08:00:00'), tipo: 'Final', notas: 'Examen Final Regular', aula: 'Aula 14' },
        ]
      }
    }
  });

  // Eventos Académicos
  const year = 2026;
  const monthMar = 2; // Marzo
  await prisma.evento.createMany({
    data: [
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, monthMar, 16), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, monthMar, 17), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, monthMar, 18), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, monthMar, 19), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
      { titulo: 'Paro Nacional Docente', fecha: new Date(year, monthMar, 20), color: '#DC2626', esParo: true, descripcion: 'Adhesión total' },
      { titulo: 'Fin Cursada 1er Cuatrimestre', fecha: new Date(year, 6, 18), color: '#3B82F6', descripcion: 'Último día de clases antes de exámenes/vacaciones' },
      { titulo: '🏠 Receso Invernal', fecha: new Date(year, 6, 20), color: '#1E3A8A', descripcion: 'Inicio de vacaciones de invierno' },
      { titulo: '🏠 Receso Invernal (Fin)', fecha: new Date(year, 7, 2), color: '#1E3A8A', descripcion: 'Fin de vacaciones de invierno' },
    ]
  });

  // Metas
  await prisma.meta.createMany({
    data: [
      { titulo: 'Completar Trabajos Prácticos U1', descripcion: 'Economía y Matemática', objetivo: 2, progreso: 0, cuatrimestre: '1C 2026' },
      { titulo: 'Aprobar Cursadas', descripcion: 'Las 3 materias base', objetivo: 3, progreso: 0, cuatrimestre: '1C 2026' }
    ]
  });

  console.log('✅ Restauración completada. Materias, Exámenes, Videos, Apuntes, Paros y Metas rehabilitados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
