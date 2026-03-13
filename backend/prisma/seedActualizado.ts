import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando actualización de BD con datos reales del Campus...');

  // 1. Limpiar materias, videos, eventos, apuntes y metas ANTERIORES para no duplicar
  await prisma.video.deleteMany({});
  await prisma.apunte.deleteMany({});
  await prisma.evento.deleteMany({});
  await prisma.meta.deleteMany({});
  await prisma.horario.deleteMany({});
  await prisma.tarea.deleteMany({});
  await prisma.examen.deleteMany({});
  await prisma.bibliografia.deleteMany({});
  await prisma.asistencia.deleteMany({});
  await prisma.materia.deleteMany({});

  console.log('Datos limpios. Creando datos reales...');

  // 2. Crear materias
  const eco = await prisma.materia.create({
    data: {
      nombre: 'Introducción a la Economía',
      profesor: 'Comisión 50',
      estado: 'Pendiente',
      color: '#DC2626',
      apuntes: {
        create: [
          { titulo: 'Dossiers Unidad 1', url: 'https://eco.mdp.edu.ar/cv/mod/folder/view.php?id=84749', tipo: 'link' },
          { titulo: 'GUÍA DE TRABAJOS PRACTICOS U1 2025', url: 'https://eco.mdp.edu.ar/cv/mod/resource/view.php?id=100542', tipo: 'archivo' }
        ]
      },
      videos: {
        create: [
          { titulo: 'Carpeta de Materiales Audiovisuales', url: 'https://eco.mdp.edu.ar/cv/mod/folder/view.php?id=70092', visto: false, duracion: 'Varios' }
        ]
      }
    }
  });

  const mate = await prisma.materia.create({
    data: {
      nombre: 'Matemática 1',
      profesor: 'Comisión 4',
      estado: 'Pendiente',
      color: '#059669',
      apuntes: {
        create: [
          { titulo: 'Guía de TP n° 1', url: 'https://eco.mdp.edu.ar/cv/mod/resource/view.php?id=106405', tipo: 'archivo' },
          { titulo: 'PDF Clase 1', url: 'https://eco.mdp.edu.ar/cv/mod/resource/view.php?id=106400', tipo: 'archivo' },
          { titulo: 'PDF Clase 2', url: 'https://eco.mdp.edu.ar/cv/mod/resource/view.php?id=106401', tipo: 'archivo' }
        ]
      },
      videos: {
        create: [
          { titulo: 'Video Clase 1: Sucesiones', url: 'https://eco.mdp.edu.ar/cv/mod/url/view.php?id=112073', visto: false, duracion: 'Aprox 1h 30m' },
          { titulo: 'Video Clase 2', url: 'https://eco.mdp.edu.ar/cv/mod/url/view.php?id=112074', visto: false, duracion: 'Aprox 1h 30m' },
          { titulo: 'Clase 3 P1', url: 'https://eco.mdp.edu.ar/cv/mod/url/view.php?id=112075', visto: false, duracion: '1h' },
          { titulo: 'Clase 3 P2', url: 'https://eco.mdp.edu.ar/cv/mod/url/view.php?id=112076', visto: false, duracion: '1h' }
        ]
      }
    }
  });

  const admin = await prisma.materia.create({
    data: {
      nombre: 'Principios de Administración',
      profesor: 'Comisión 50',
      estado: 'Pendiente',
      color: '#4F46E5',
      apuntes: {
        create: [
          { titulo: 'Presentación 2025 (Campus)', url: 'https://eco.mdp.edu.ar/cv/course/view.php?id=80', tipo: 'link' }
        ]
      }
    }
  });

  console.log('✅ Materias, Videos y Apuntes reales creados.');

  // 3. Crear Eventos de Paro Universitario (Semana del 16 al 20)
  // Marzo es mes 2 (0-indexado) en JavaScript Date
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

  console.log('✅ Paros Universitarios Agendados.');

  // 4. Metas de ejemplo reales
  await prisma.meta.createMany({
    data: [
      { titulo: 'Completar Trabajos Prácticos U1', descripcion: 'Economía y Matemática', objetivo: 2, progreso: 0, cuatrimestre: '1C 2026' },
      { titulo: 'Aprobar Cursadas', descripcion: 'Las 3 materias base', objetivo: 3, progreso: 0, cuatrimestre: '1C 2026' }
    ]
  });

  console.log('✅ Metas Iniciales creadas.');
  console.log('🚀 Finalizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
