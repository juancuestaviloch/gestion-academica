import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando inyección de Paros y Videos de prueba...');

  // 1. Obtener materias para asociar los videos
  const economia = await prisma.materia.findFirst({
    where: { nombre: { contains: 'Economía' } }
  });

  const matematica = await prisma.materia.findFirst({
    where: { nombre: { contains: 'Matemática' } }
  });

  // Si no existen porque es otra base de datos de test local, intentar buscar cualquiera o crearlas temporalmente no aplica ahora porque la DB real los tiene.
  if (economia) {
    console.log(`- Encontrada materia ${economia.nombre}`);
    await prisma.video.createMany({
      data: [
        {
          materiaId: economia.id,
          titulo: '¿Qué es la economía? (Clase Intro)',
          url: 'https://campus.universidad.edu.ar/mod/page/view.php?id=123',
          duracion: '1h 25m',
          visto: true
        },
        {
          materiaId: economia.id,
          titulo: 'Escuelas de Pensamiento Económico',
          url: 'https://campus.universidad.edu.ar/mod/page/view.php?id=124',
          duracion: '55m',
          visto: false
        }
      ]
    });
    console.log('✅ Videos de Introducción a la Economía agregados.');
  }

  if (matematica) {
    console.log(`- Encontrada materia ${matematica.nombre}`);
    await prisma.video.createMany({
      data: [
        {
          materiaId: matematica.id,
          titulo: 'Clase 1: Sucesiones numéricas y convergencia',
          url: 'https://campus.universidad.edu.ar/mat1/clase1',
          duracion: '2h 10m',
          visto: false
        },
        {
          materiaId: matematica.id,
          titulo: 'Clase Práctica - Ejercicios de Sucesiones',
          url: 'https://campus.universidad.edu.ar/mat1/practica1',
          duracion: '1h 45m',
          visto: false
        }
      ]
    });
    console.log('✅ Videos de Matemática I agregados.');
  }

  // 2. Inyectar un Paro Nacional Universitario para hoy o mañana
  const today = new Date();
  today.setHours(8, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.evento.createMany({
    data: [
      {
        titulo: 'Paro Nacional Docente',
        descripcion: 'Medida de fuerza docente y no docente sin concurrencia a los lugares de trabajo.',
        fecha: tomorrow,
        color: '#DC2626',
        esParo: true
      }
    ]
  });
  console.log(`✅ Evento de Paro registrado para ${tomorrow.toLocaleDateString()}`);

  console.log('🚀 Finalizado.');
}

main()
  .catch((e) => {
    console.error('❌ Error en inyección:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
