import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de Plan de Estudios Completo...');

  // 1. Obtener materias base del 1er Cuatrimestre
  const principios = await prisma.materia.findFirst({ where: { nombre: { contains: 'Principios de Administración' } } });
  const mate1 = await prisma.materia.findFirst({ where: { nombre: { contains: 'Matemática 1' } } });
  const introEco = await prisma.materia.findFirst({ where: { nombre: { contains: 'Introducción a la Economía' } } });

  if (!principios || !mate1 || !introEco) {
    console.error('No se encontraron las materias base. Abortando seed.');
    return;
  }

  // 2. Crear materias del 2do Cuatrimestre con correlatividades
  console.log('Creando materias del 2do Cuatrimestre...');
  
  await prisma.materia.create({
    data: {
      nombre: 'Contabilidad I',
      profesor: 'Por asignar',
      anio: 1,
      cuatrimestre: '2do Cuatrimestre',
      estado: 'Pendiente',
      color: '#7C3AED',
      prerequisites: { connect: [{ id: principios.id }] }
    }
  });

  await prisma.materia.create({
    data: {
      nombre: 'Matemática II',
      profesor: 'Por asignar',
      anio: 1,
      cuatrimestre: '2do Cuatrimestre',
      estado: 'Pendiente',
      color: '#0891B2',
      prerequisites: { connect: [{ id: mate1.id }] }
    }
  });

  await prisma.materia.create({
    data: {
      nombre: 'Microeconomía I',
      profesor: 'Por asignar',
      anio: 1,
      cuatrimestre: '2do Cuatrimestre',
      estado: 'Pendiente',
      color: '#DB2777',
      prerequisites: { connect: [{ id: introEco.id }] }
    }
  });

  // 3. Crear algunas de 2do Año
  console.log('Creando materias de 2do Año...');
  const mate2 = await prisma.materia.findFirst({ where: { nombre: 'Matemática II' } });
  
  await prisma.materia.create({
    data: {
      nombre: 'Estadística I',
      profesor: 'Por asignar',
      anio: 2,
      cuatrimestre: '1er Cuatrimestre',
      estado: 'Pendiente',
      color: '#65A30D',
      prerequisites: { connect: mate2 ? [{ id: mate2.id }] : [] }
    }
  });

  console.log('Seed de Plan de Estudios finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
