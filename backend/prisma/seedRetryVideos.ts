import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Buscando materias sin case-sensitivity...');
  
  const materias = await prisma.materia.findMany();
  console.log('Materias actuales en DB:', materias.map(m => m.nombre));

  const economia = materias.find(m => m.nombre.toLowerCase().includes('econom'));
  const matematica = materias.find(m => m.nombre.toLowerCase().includes('matem'));

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

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
