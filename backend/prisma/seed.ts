import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 SEED VERSION: 2026-03-16-CURRICULUM-FIX');
  console.log('🌱 Iniciando seed de datos...');

  // Limpiar datos existentes
  await prisma.asistencia.deleteMany();
  await prisma.apunte.deleteMany();
  await prisma.tarea.deleteMany();
  await prisma.examen.deleteMany();
  await prisma.bibliografia.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.meta.deleteMany();
  await prisma.materia.deleteMany();

  // --- MATERIAS 1ER CUATRIMESTRE ---
  const matematica1 = await prisma.materia.create({
    data: {
      nombre: 'Matemática 1',
      profesor: 'Daniel Guzmán',
      estado: 'Cursando',
      cuatrimestre: '1er Cuatrimestre',
      anio: 1,
      color: '#4F46E5',
      horarios: {
        create: [
          { diaSemana: 'Lunes', horaInicio: '11:00', horaFin: '12:30', tipo: 'Teoría', aula: 'Aula 3' },
          { diaSemana: 'Miércoles', horaInicio: '11:00', horaFin: '12:30', tipo: 'Práctica', aula: 'Aula 3' },
        ],
      },
    },
  });

  const introProg = await prisma.materia.create({
    data: {
      nombre: 'Introducción a la Programación',
      profesor: 'Dra. Elena Rossi',
      estado: 'Cursando',
      cuatrimestre: '1er Cuatrimestre',
      anio: 1,
      color: '#059669',
      horarios: {
        create: [
          { diaSemana: 'Martes', horaInicio: '08:30', horaFin: '11:30', tipo: 'Teórico-Práctico', aula: 'Lab 1' },
          { diaSemana: 'Jueves', horaInicio: '08:30', horaFin: '11:30', tipo: 'Práctica', aula: 'Lab 1' },
        ],
      },
    },
  });

  const algebra = await prisma.materia.create({
    data: {
      nombre: 'Álgebra Lineal',
      profesor: 'Ing. Marcos Paz',
      estado: 'Cursando',
      cuatrimestre: '1er Cuatrimestre',
      anio: 1,
      color: '#7C3AED',
      horarios: {
        create: [
          { diaSemana: 'Miércoles', horaInicio: '14:00', horaFin: '17:00', tipo: 'Teoría', aula: 'Aula 5' },
          { diaSemana: 'Viernes', horaInicio: '14:00', horaFin: '17:00', tipo: 'Práctica', aula: 'Aula 5' },
        ],
      },
    },
  });

  // --- MATERIAS 2DO CUATRIMESTRE ---
  const matematica2 = await prisma.materia.create({
    data: {
      nombre: 'Matemática 2',
      profesor: 'Dr. Julián Soria',
      estado: 'Cursando',
      cuatrimestre: '2do Cuatrimestre',
      anio: 1,
      color: '#3B82F6',
      horarios: {
        create: [
          { diaSemana: 'Lunes', horaInicio: '11:00', horaFin: '13:00', tipo: 'Teoría', aula: 'Aula 8' },
          { diaSemana: 'Miércoles', horaInicio: '11:00', horaFin: '13:00', tipo: 'Práctica', aula: 'Aula 8' },
        ],
      },
    },
  });

  const algoritmos = await prisma.materia.create({
    data: {
      nombre: 'Algoritmos y Estructuras de Datos',
      profesor: 'Ing. Martina Vales',
      estado: 'Cursando',
      cuatrimestre: '2do Cuatrimestre',
      anio: 1,
      color: '#10B981',
      horarios: {
        create: [
          { diaSemana: 'Martes', horaInicio: '09:00', horaFin: '12:00', tipo: 'Teórico-Práctico', aula: 'Lab 2' },
          { diaSemana: 'Jueves', horaInicio: '09:00', horaFin: '12:00', tipo: 'Práctica', aula: 'Lab 3' },
        ],
      },
    },
  });

  const arquitectura = await prisma.materia.create({
    data: {
      nombre: 'Arquitectura de Computadoras',
      profesor: 'Dr. Roberto Bosch',
      estado: 'Cursando',
      cuatrimestre: '2do Cuatrimestre',
      anio: 1,
      color: '#F59E0B',
      horarios: {
        create: [
          { diaSemana: 'Viernes', horaInicio: '08:00', horaFin: '12:00', tipo: 'Teoría', aula: 'Anfiteatro B' },
        ],
      },
    },
  });

  // Fechas relativas para datos realistas
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  // Crear exámenes
  await prisma.examen.createMany({
    data: [
      {
        materiaId: matematica1.id,
        fecha: addDays(today, 15),
        tipo: 'Parcial',
        aula: 'Aula 3',
        notas: 'Unidades 1 y 2: Límites y Continuidad',
      },
      {
        materiaId: introProg.id,
        fecha: addDays(today, 20),
        tipo: 'Parcial',
        aula: 'Lab 1',
        notas: 'Estructuras de control y tipos de datos',
      },
      {
        materiaId: algebra.id,
        fecha: addDays(today, 25),
        tipo: 'Parcial',
        aula: 'Aula 5',
        notas: 'Sistemas de ecuaciones lineales',
      },
    ],
  });

  // Crear tareas
  await prisma.tarea.createMany({
    data: [
      {
        materiaId: matematica1.id,
        titulo: 'Guía 1: Sucesiones',
        descripcion: 'Resolver ejercicios del 1 al 20 de la guía práctica.',
        fechaLimite: addDays(today, 5),
        estado: 'En progreso',
      },
      {
        materiaId: introProg.id,
        titulo: 'TP1: Calculadora básica',
        descripcion: 'Implementar una calculadora que maneje las 4 operaciones básicas en Python.',
        fechaLimite: addDays(today, 10),
        estado: 'Pendiente',
      },
      {
        materiaId: algebra.id,
        titulo: 'Trabajo Práctico: Vectores',
        descripcion: 'Operaciones con vectores en R2 y R3.',
        fechaLimite: addDays(today, 7),
        estado: 'Pendiente',
      },
    ],
  });

  // Crear asistencias (últimas semanas)
  const materiasActivas = [matematica1, introProg, algebra];
  for (const materia of materiasActivas) {
    for (let i = 1; i <= 6; i++) {
      const fechaClase = addDays(today, -i * 3);
      await prisma.asistencia.create({
        data: {
          materiaId: materia.id,
          fecha: fechaClase,
          presente: Math.random() > 0.1, // ~90% asistencia
        },
      });
    }
  }

  // Crear apuntes
  await prisma.apunte.createMany({
    data: [
      {
        materiaId: matematica1.id,
        titulo: 'Concepto de Límite',
        contenido: '# Límites\nDefinición formal de límite y propiedades básicas.',
        tipo: 'nota',
      },
      {
        materiaId: introProg.id,
        titulo: 'Lógica Booleana',
        contenido: '# Lógica\nTablas de verdad y operadores AND, OR, NOT.',
        tipo: 'nota',
      },
      {
        materiaId: algebra.id,
        titulo: 'Matrices: Introducción',
        contenido: '# Matrices\nDefinición, suma y multiplicación de matrices.',
        tipo: 'nota',
      },
    ],
  });

  // Crear eventos manuales (incluyendo feriados si es necesario, pero ya los agregamos antes)
  // Mantendré los eventos de tutoría
  await prisma.evento.createMany({
    data: [
      {
        titulo: 'Tutoría Matemática 1',
        fecha: addDays(today, 1),
        descripcion: 'Repaso de funciones trigonométricas',
        color: '#4F46E5',
      },
      {
        titulo: 'Charla: Salida laboral en IT',
        fecha: addDays(today, 8),
        descripcion: 'Salón de actos, 18:00 hs',
        color: '#DC2626',
      },
    ],
  });

  // Crear metas
  await prisma.meta.createMany({
    data: [
      {
        titulo: 'Completar 1er Año',
        descripcion: 'Aprobar todas las materias del primer año sin finales pendientes',
        objetivo: 6,
        progreso: 0,
        cuatrimestre: 'Ciclo 2026',
      },
      {
        titulo: 'Dominar Python',
        descripcion: 'Aprender las bases sólidas de programación con Python',
        objetivo: 100,
        progreso: 20,
        cuatrimestre: '1C 2026',
      },
    ],
  });

  console.log('✅ Seed completado exitosamente con Currículum de 1er Año!');
  console.log('   - 6 materias (3 cursando 1C, 3 pendientes 2C)');
  console.log('   - 3 exámenes');
  console.log('   - 3 tareas');
  console.log('   - 18 registros de asistencia');
  console.log('   - 3 apuntes');
  console.log('   - 2 eventos');
  console.log('   - 2 metas');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
