import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos financieros dinámicos...');

  // Limpiar recursos previos
  await prisma.recursoAcademico.deleteMany();

  const materias = await prisma.materia.findMany();
  
  if (materias.length === 0) {
    console.log('❌ No hay materias para asociar recursos.');
    return;
  }

  const matMate = materias.find(m => m.nombre.includes('Matemática')) || materias[0];
  const matAdmin = materias.find(m => m.nombre.includes('Administración')) || materias[1] || materias[0];
  const matEco = materias.find(m => m.nombre.includes('Economía')) || materias[2] || materias[0];

  const recursos = [
    {
      materiaId: matMate.id,
      nombre: 'Libro: Cálculo de una variable - Stewart',
      tipo: 'LIBRO',
      costo: 45000,
      adquirido: true,
      progreso: 15,
      url: 'https://ejemplo.com/stewart-pdf'
    },
    {
      materiaId: matAdmin.id,
      nombre: 'Dossier de Cátedra - Unidad 1 y 2',
      tipo: 'DOSSIER',
      costo: 3500,
      adquirido: true,
      progreso: 80,
    },
    {
      materiaId: matAdmin.id,
      nombre: 'Libro: Administración - Robbins',
      tipo: 'LIBRO',
      costo: 38000,
      adquirido: false,
      progreso: 0,
    },
    {
      materiaId: matEco.id,
      nombre: 'Apuntes de Microeconomía - Fotocopiadora',
      tipo: 'IMPRESION',
      costo: 5200,
      adquirido: true,
      progreso: 45,
    },
    {
      materiaId: matEco.id,
      nombre: 'Suscripción Diario Económico (Mensual)',
      tipo: 'DIGITAL',
      costo: 2500,
      adquirido: true,
      progreso: 100,
    }
  ];

  for (const r of recursos) {
    await prisma.recursoAcademico.create({
      data: r
    });
  }

  console.log(`✅ Semilla financiera completada para Materias: ${matMate.nombre}, ${matAdmin.nombre}, ${matEco.nombre}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
