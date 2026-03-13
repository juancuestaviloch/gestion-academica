import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

  // Crear materias con horarios y bibliografía
  const algoritmos = await prisma.materia.create({
    data: {
      nombre: 'Algoritmos y Estructuras de Datos',
      profesor: 'Dr. Carlos Méndez',
      estado: 'Cursando',
      color: '#4F46E5',
      horarios: {
        create: [
          { diaSemana: 'Lunes', horaInicio: '08:00', horaFin: '10:00' },
          { diaSemana: 'Miércoles', horaInicio: '08:00', horaFin: '10:00' },
        ],
      },
      bibliografia: {
        create: [
          { nombre: 'Introduction to Algorithms - Cormen', url: 'https://mitpress.mit.edu/algorithms/' },
          { nombre: 'Apunte de cátedra - Complejidad', url: null },
        ],
      },
    },
  });

  const calculo = await prisma.materia.create({
    data: {
      nombre: 'Análisis Matemático II',
      profesor: 'Dra. Laura Fernández',
      estado: 'Cursando',
      color: '#059669',
      horarios: {
        create: [
          { diaSemana: 'Martes', horaInicio: '10:00', horaFin: '12:00' },
          { diaSemana: 'Jueves', horaInicio: '10:00', horaFin: '12:00' },
        ],
      },
      bibliografia: {
        create: [
          { nombre: 'Análisis Matemático - Marsden & Tromba', url: 'https://www.amazon.com/dp/0716749645' },
          { nombre: 'Guía de ejercicios Unidad 1-4', url: null },
        ],
      },
    },
  });

  const baseDatos = await prisma.materia.create({
    data: {
      nombre: 'Bases de Datos',
      profesor: 'Ing. Roberto Martínez',
      estado: 'Cursando',
      color: '#DC2626',
      horarios: {
        create: [
          { diaSemana: 'Miércoles', horaInicio: '14:00', horaFin: '17:00' },
        ],
      },
      bibliografia: {
        create: [
          { nombre: 'Database System Concepts - Silberschatz', url: 'https://www.db-book.com/' },
          { nombre: 'Documentación oficial PostgreSQL', url: 'https://www.postgresql.org/docs/' },
        ],
      },
    },
  });

  const sistemas = await prisma.materia.create({
    data: {
      nombre: 'Sistemas Operativos',
      profesor: 'Dr. Andrés López',
      estado: 'Cursando',
      color: '#D97706',
      horarios: {
        create: [
          { diaSemana: 'Viernes', horaInicio: '08:00', horaFin: '11:00' },
        ],
      },
      bibliografia: {
        create: [
          { nombre: 'Operating Systems - Tanenbaum', url: 'https://www.pearson.com/tanenbaum' },
        ],
      },
    },
  });

  const algebra = await prisma.materia.create({
    data: {
      nombre: 'Álgebra Lineal',
      profesor: 'Dra. María García',
      estado: 'Aprobada',
      color: '#7C3AED',
      horarios: { create: [] },
      bibliografia: {
        create: [
          { nombre: 'Álgebra Lineal - Grossman', url: null },
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
        materiaId: algoritmos.id,
        fecha: addDays(today, 5),
        tipo: 'Parcial',
        aula: 'Aula 301',
        notas: 'Temas: Grafos, Árboles, Hashing',
      },
      {
        materiaId: calculo.id,
        fecha: addDays(today, 3),
        tipo: 'Parcial',
        aula: 'Aula 105',
        notas: 'Integrales dobles y triples',
      },
      {
        materiaId: baseDatos.id,
        fecha: addDays(today, 14),
        tipo: 'Parcial',
        aula: 'Lab 2',
        notas: 'Normalización y SQL avanzado',
      },
      {
        materiaId: sistemas.id,
        fecha: addDays(today, 21),
        tipo: 'Final',
        aula: 'Aula Magna',
        notas: 'Todos los temas del cuatrimestre',
      },
      {
        materiaId: algoritmos.id,
        fecha: addDays(today, 30),
        tipo: 'Recuperatorio',
        aula: 'Aula 301',
        notas: 'Para quienes no aprueben el 1er parcial',
      },
    ],
  });

  // Crear tareas
  await prisma.tarea.createMany({
    data: [
      {
        materiaId: algoritmos.id,
        titulo: 'TP2: Implementar algoritmo de Dijkstra',
        descripcion: 'Implementar en C++ el algoritmo de Dijkstra con cola de prioridad. Entregar por campus virtual.',
        fechaLimite: addDays(today, 2),
        estado: 'En progreso',
      },
      {
        materiaId: calculo.id,
        titulo: 'Guía de ejercicios Unidad 3',
        descripcion: 'Resolver ejercicios 1 al 15 de la guía de integrales múltiples.',
        fechaLimite: addDays(today, 4),
        estado: 'Pendiente',
      },
      {
        materiaId: baseDatos.id,
        titulo: 'Diseño de esquema E-R para proyecto',
        descripcion: 'Diseñar el modelo Entidad-Relación del proyecto integrador. Incluir diagrama y documentación.',
        fechaLimite: addDays(today, 7),
        estado: 'Pendiente',
      },
      {
        materiaId: sistemas.id,
        titulo: 'Informe: Comparación de schedulers',
        descripcion: 'Comparar FCFS, SJF, Round Robin y Priority scheduling con ejemplos numéricos.',
        fechaLimite: addDays(today, 10),
        estado: 'Pendiente',
      },
      {
        materiaId: algoritmos.id,
        titulo: 'TP1: Análisis de complejidad',
        descripcion: 'Análisis Big-O de 10 algoritmos dados en clase.',
        fechaLimite: addDays(today, -3),
        estado: 'Entregada',
      },
    ],
  });

  // Crear asistencias (últimas semanas)
  const materiasActivas = [algoritmos, calculo, baseDatos, sistemas];
  for (const materia of materiasActivas) {
    for (let i = 1; i <= 8; i++) {
      const fechaClase = addDays(today, -i * 3);
      await prisma.asistencia.create({
        data: {
          materiaId: materia.id,
          fecha: fechaClase,
          presente: Math.random() > 0.15, // ~85% asistencia
        },
      });
    }
  }

  // Crear apuntes
  await prisma.apunte.createMany({
    data: [
      {
        materiaId: algoritmos.id,
        titulo: 'Resumen: Grafos y recorridos',
        contenido: '# Grafos\n\n## Definición\nUn grafo G = (V, E) consiste en un conjunto de vértices V y aristas E.\n\n## Recorridos\n- **BFS**: Recorrido en anchura, usa cola\n- **DFS**: Recorrido en profundidad, usa pila\n\n## Aplicaciones\n- Camino más corto\n- Detección de ciclos\n- Componentes conexas',
        tipo: 'nota',
      },
      {
        materiaId: calculo.id,
        titulo: 'Fórmulas integrales múltiples',
        contenido: '# Integrales Múltiples\n\n## Integral doble\n$$\\iint_R f(x,y) \\, dA$$\n\n## Cambio a polares\n$$x = r\\cos\\theta, \\quad y = r\\sin\\theta$$\n$$dA = r \\, dr \\, d\\theta$$',
        tipo: 'nota',
      },
      {
        materiaId: baseDatos.id,
        titulo: 'Tutorial SQL Joins',
        contenido: '',
        tipo: 'link',
        url: 'https://www.w3schools.com/sql/sql_join.asp',
      },
      {
        materiaId: sistemas.id,
        titulo: 'Video: Procesos e hilos',
        contenido: 'Video explicativo sobre la diferencia entre procesos e hilos en Linux.',
        tipo: 'link',
        url: 'https://www.youtube.com/watch?v=example',
      },
      {
        materiaId: algoritmos.id,
        titulo: 'Cheatsheet Big-O',
        contenido: '# Notación Big-O\n\n| Complejidad | Nombre | Ejemplo |\n|---|---|---|\n| O(1) | Constante | Acceso a array |\n| O(log n) | Logarítmica | Búsqueda binaria |\n| O(n) | Lineal | Recorrido de array |\n| O(n log n) | Log-lineal | Merge sort |\n| O(n²) | Cuadrática | Bubble sort |',
        tipo: 'nota',
      },
    ],
  });

  // Crear eventos manuales
  await prisma.evento.createMany({
    data: [
      {
        titulo: 'Tutoría grupal de Algoritmos',
        fecha: addDays(today, 1),
        descripcion: 'Tutoría en el lab 3, traer notebook',
        color: '#4F46E5',
      },
      {
        titulo: 'Inscripción a finales',
        fecha: addDays(today, 8),
        descripcion: 'Cierre de inscripción a exámenes finales del cuatrimestre',
        color: '#DC2626',
      },
      {
        titulo: 'Feriado - No hay clases',
        fecha: addDays(today, 12),
        descripcion: 'Día no laborable',
        color: '#6B7280',
      },
    ],
  });

  // Crear metas
  await prisma.meta.createMany({
    data: [
      {
        titulo: 'Aprobar 4 materias este cuatrimestre',
        descripcion: 'Aprobar Algoritmos, Análisis II, Bases de Datos y Sistemas Operativos',
        objetivo: 4,
        progreso: 0,
        cuatrimestre: '1C 2026',
      },
      {
        titulo: 'Completar todas las tareas a tiempo',
        descripcion: 'Entregar el 100% de los TPs y guías antes de la fecha límite',
        objetivo: 10,
        progreso: 3,
        cuatrimestre: '1C 2026',
      },
      {
        titulo: 'Mantener asistencia arriba del 80%',
        descripcion: 'Asistir regularmente a todas las clases de las materias cursando',
        objetivo: 100,
        progreso: 85,
        cuatrimestre: '1C 2026',
      },
    ],
  });

  console.log('✅ Seed completado exitosamente!');
  console.log('   - 5 materias (4 cursando, 1 aprobada)');
  console.log('   - 5 exámenes');
  console.log('   - 5 tareas');
  console.log('   - 32 registros de asistencia');
  console.log('   - 5 apuntes');
  console.log('   - 3 eventos');
  console.log('   - 3 metas');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
