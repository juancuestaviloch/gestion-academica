import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Inyectando materias reales de Juan José...');

  // Crear materia "Principios de Administración"
  const admin = await prisma.materia.create({
    data: {
      nombre: 'Principios de Administración',
      profesor: 'Comisión 50',
      estado: 'Cursando',
      color: '#4F46E5', // Indigo
      videos: {
        create: [
          {
            titulo: 'Clase Magistral: Teoría de las Organizaciones',
            url: 'https://campus.universidad.edu.ar/admin/video1',
            duracion: '1h 30m',
            visto: true
          },
          {
            titulo: 'Seminario Práctico Unidad 1',
            url: 'https://campus.universidad.edu.ar/admin/video2',
            duracion: '45m',
            visto: false
          }
        ]
      }
    }
  });
  console.log(`✅ Creada materia: ${admin.nombre} con 2 videos`);

  // Crear materia "Matemática 1"
  const mate = await prisma.materia.create({
    data: {
      nombre: 'Matemática 1',
      profesor: 'Comisión 4',
      estado: 'Cursando',
      color: '#059669', // Emerald
      videos: {
        create: [
          {
            titulo: 'Teoría: Límites y Continuidad',
            url: 'https://campus.universidad.edu.ar/mate1/video1',
            duracion: '2h 15m',
            visto: false
          },
          {
            titulo: 'Resolución Guía Práctica 2',
            url: 'https://campus.universidad.edu.ar/mate1/video2',
            duracion: '1h 45m',
            visto: false
          }
        ]
      }
    }
  });
  console.log(`✅ Creada materia: ${mate.nombre} con 2 videos`);

  // Crear materia "Introducción a la Economía"
  const eco = await prisma.materia.create({
    data: {
      nombre: 'Introducción a la Economía',
      profesor: 'Comisión 50',
      estado: 'Cursando',
      color: '#DC2626', // Red
      videos: {
        create: [
          {
            titulo: 'Oferta, Demanda y Punto de Equilibrio',
            url: 'https://campus.universidad.edu.ar/eco/video1',
            duracion: '1h 50m',
            visto: false
          }
        ]
      }
    }
  });
  console.log(`✅ Creada materia: ${eco.nombre} con 1 video`);

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
