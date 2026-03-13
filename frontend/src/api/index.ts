// ============================================================
// MOCK DATA - Simula la base de datos para desarrollo frontend
// Cuando se integre Supabase, reemplazar estas funciones por
// llamadas reales a la API.
// ============================================================

import { Materia, Examen, Tarea, Asistencia, AsistenciaResumen, AsistenciaDetalle, Apunte, Evento, Meta, DashboardData } from '../types';

// Helper para fechas relativas
function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
function subDays(days: number): Date { return addDays(-days); }

// ===================== MATERIAS =====================
let MATERIAS: Materia[] = [
  { id: 1, nombre: 'Algoritmos y Estructuras de Datos', profesor: 'Dr. Carlos Méndez', estado: 'Cursando', color: '#4F46E5', createdAt: '', updatedAt: '', horarios: [{ id: 1, materiaId: 1, diaSemana: 'Lunes', horaInicio: '08:00', horaFin: '10:00' }, { id: 2, materiaId: 1, diaSemana: 'Miércoles', horaInicio: '08:00', horaFin: '10:00' }], bibliografia: [{ id: 1, materiaId: 1, nombre: 'Introduction to Algorithms - Cormen', url: 'https://mitpress.mit.edu/' }, { id: 2, materiaId: 1, nombre: 'Apunte de cátedra', url: null }] },
  { id: 2, nombre: 'Análisis Matemático II', profesor: 'Dra. Laura Fernández', estado: 'Cursando', color: '#059669', createdAt: '', updatedAt: '', horarios: [{ id: 3, materiaId: 2, diaSemana: 'Martes', horaInicio: '10:00', horaFin: '12:00' }, { id: 4, materiaId: 2, diaSemana: 'Jueves', horaInicio: '10:00', horaFin: '12:00' }], bibliografia: [{ id: 3, materiaId: 2, nombre: 'Análisis Matemático - Marsden & Tromba', url: null }] },
  { id: 3, nombre: 'Bases de Datos', profesor: 'Ing. Roberto Martínez', estado: 'Cursando', color: '#DC2626', createdAt: '', updatedAt: '', horarios: [{ id: 5, materiaId: 3, diaSemana: 'Miércoles', horaInicio: '14:00', horaFin: '17:00' }], bibliografia: [{ id: 4, materiaId: 3, nombre: 'Database System Concepts', url: 'https://www.db-book.com/' }] },
  { id: 4, nombre: 'Sistemas Operativos', profesor: 'Dr. Andrés López', estado: 'Cursando', color: '#D97706', createdAt: '', updatedAt: '', horarios: [{ id: 6, materiaId: 4, diaSemana: 'Viernes', horaInicio: '08:00', horaFin: '11:00' }], bibliografia: [{ id: 5, materiaId: 4, nombre: 'Operating Systems - Tanenbaum', url: null }] },
  { id: 5, nombre: 'Álgebra Lineal', profesor: 'Dra. María García', estado: 'Aprobada', color: '#7C3AED', createdAt: '', updatedAt: '', horarios: [], bibliografia: [{ id: 6, materiaId: 5, nombre: 'Álgebra Lineal - Grossman', url: null }] },
];

// ===================== EXÁMENES =====================
let EXAMENES: Examen[] = [
  { id: 1, materiaId: 1, fecha: addDays(5).toISOString(), tipo: 'Parcial', aula: 'Aula 301', notas: 'Temas: Grafos, Árboles, Hashing', createdAt: '', materia: { id: 1, nombre: 'Algoritmos y Estructuras de Datos', color: '#4F46E5' } },
  { id: 2, materiaId: 2, fecha: addDays(3).toISOString(), tipo: 'Parcial', aula: 'Aula 105', notas: 'Integrales dobles y triples', createdAt: '', materia: { id: 2, nombre: 'Análisis Matemático II', color: '#059669' } },
  { id: 3, materiaId: 3, fecha: addDays(14).toISOString(), tipo: 'Parcial', aula: 'Lab 2', notas: 'Normalización y SQL avanzado', createdAt: '', materia: { id: 3, nombre: 'Bases de Datos', color: '#DC2626' } },
  { id: 4, materiaId: 4, fecha: addDays(21).toISOString(), tipo: 'Final', aula: 'Aula Magna', notas: 'Todos los temas del cuatrimestre', createdAt: '', materia: { id: 4, nombre: 'Sistemas Operativos', color: '#D97706' } },
  { id: 5, materiaId: 1, fecha: addDays(30).toISOString(), tipo: 'Recuperatorio', aula: 'Aula 301', notas: 'Para quienes no aprueben el 1er parcial', createdAt: '', materia: { id: 1, nombre: 'Algoritmos y Estructuras de Datos', color: '#4F46E5' } },
];

// ===================== TAREAS =====================
let TAREAS: Tarea[] = [
  { id: 1, materiaId: 1, titulo: 'TP2: Implementar algoritmo de Dijkstra', descripcion: 'Implementar en C++ el algoritmo de Dijkstra con cola de prioridad. Entregar por campus virtual.', fechaLimite: addDays(2).toISOString(), estado: 'En progreso', createdAt: '', updatedAt: '', materia: { id: 1, nombre: 'Algoritmos y Estructuras de Datos', color: '#4F46E5' } },
  { id: 2, materiaId: 2, titulo: 'Guía de ejercicios Unidad 3', descripcion: 'Resolver ejercicios 1 al 15 de la guía de integrales múltiples.', fechaLimite: addDays(4).toISOString(), estado: 'Pendiente', createdAt: '', updatedAt: '', materia: { id: 2, nombre: 'Análisis Matemático II', color: '#059669' } },
  { id: 3, materiaId: 3, titulo: 'Diseño de esquema E-R para proyecto', descripcion: 'Diseñar el modelo Entidad-Relación del proyecto integrador.', fechaLimite: addDays(7).toISOString(), estado: 'Pendiente', createdAt: '', updatedAt: '', materia: { id: 3, nombre: 'Bases de Datos', color: '#DC2626' } },
  { id: 4, materiaId: 4, titulo: 'Informe: Comparación de schedulers', descripcion: 'Comparar FCFS, SJF, Round Robin y Priority scheduling con ejemplos numéricos.', fechaLimite: addDays(10).toISOString(), estado: 'Pendiente', createdAt: '', updatedAt: '', materia: { id: 4, nombre: 'Sistemas Operativos', color: '#D97706' } },
  { id: 5, materiaId: 1, titulo: 'TP1: Análisis de complejidad', descripcion: 'Análisis Big-O de 10 algoritmos dados en clase.', fechaLimite: subDays(3).toISOString(), estado: 'Entregada', createdAt: '', updatedAt: '', materia: { id: 1, nombre: 'Algoritmos y Estructuras de Datos', color: '#4F46E5' } },
];

// ===================== ASISTENCIAS =====================
let ASISTENCIAS: Asistencia[] = [];
let asistId = 1;
const materiaIds = [1, 2, 3, 4];
for (const mid of materiaIds) {
  for (let i = 1; i <= 8; i++) {
    ASISTENCIAS.push({ id: asistId++, materiaId: mid, fecha: subDays(i * 3).toISOString(), presente: Math.random() > 0.15 });
  }
}

// ===================== APUNTES =====================
let APUNTES: Apunte[] = [
  { id: 1, materiaId: 1, titulo: 'Resumen: Grafos y recorridos', contenido: '# Grafos\n\n## Definición\nUn grafo G = (V, E) consiste en un conjunto de **vértices** V y **aristas** E.\n\n## Recorridos\n- **BFS**: Recorrido en anchura, usa cola\n- **DFS**: Recorrido en profundidad, usa pila\n\n## Aplicaciones\n- Camino más corto (Dijkstra)\n- Detección de ciclos\n- Componentes conexas', tipo: 'nota', url: null, createdAt: '', updatedAt: '', materia: { id: 1, nombre: 'Algoritmos y Estructuras de Datos', color: '#4F46E5' } },
  { id: 2, materiaId: 2, titulo: 'Fórmulas integrales múltiples', contenido: '# Integrales Múltiples\n\n## Integral doble\nSe calcula iterando sobre la región R.\n\n## Cambio a polares\n- x = r·cos(θ)\n- y = r·sin(θ)\n- dA = r·dr·dθ', tipo: 'nota', url: null, createdAt: '', updatedAt: '', materia: { id: 2, nombre: 'Análisis Matemático II', color: '#059669' } },
  { id: 3, materiaId: 3, titulo: 'Tutorial SQL Joins', contenido: 'Referencia completa de JOINs en SQL (INNER, LEFT, RIGHT, FULL)', tipo: 'link', url: 'https://www.w3schools.com/sql/sql_join.asp', createdAt: '', updatedAt: '', materia: { id: 3, nombre: 'Bases de Datos', color: '#DC2626' } },
  { id: 4, materiaId: 4, titulo: 'Video: Procesos e hilos en Linux', contenido: 'Video explicativo sobre procesos e hilos', tipo: 'link', url: 'https://www.youtube.com/watch?v=exNgbSKMJA8', createdAt: '', updatedAt: '', materia: { id: 4, nombre: 'Sistemas Operativos', color: '#D97706' } },
  { id: 5, materiaId: 1, titulo: 'Cheatsheet Big-O', contenido: '# Notación Big-O\n\n| Complejidad | Nombre | Ejemplo |\n|---|---|---|\n| O(1) | Constante | Acceso a array |\n| O(log n) | Logarítmica | Búsqueda binaria |\n| O(n) | Lineal | Recorrido de array |\n| O(n log n) | Log-lineal | Merge sort |\n| O(n²) | Cuadrática | Bubble sort |', tipo: 'nota', url: null, createdAt: '', updatedAt: '', materia: { id: 1, nombre: 'Algoritmos y Estructuras de Datos', color: '#4F46E5' } },
];

// ===================== EVENTOS =====================
let EVENTOS: Evento[] = [
  { id: 1, titulo: 'Tutoría grupal de Algoritmos', fecha: addDays(1).toISOString(), descripcion: 'Tutoría en el lab 3, traer notebook', color: '#4F46E5', createdAt: '' },
  { id: 2, titulo: 'Inscripción a finales', fecha: addDays(8).toISOString(), descripcion: 'Cierre de inscripción a exámenes finales del cuatrimestre', color: '#DC2626', createdAt: '' },
  { id: 3, titulo: 'Feriado - No hay clases', fecha: addDays(12).toISOString(), descripcion: 'Día no laborable', color: '#6B7280', createdAt: '' },
];

// ===================== METAS =====================
let METAS: Meta[] = [
  { id: 1, titulo: 'Aprobar 4 materias este cuatrimestre', descripcion: 'Aprobar Algoritmos, Análisis II, Bases de Datos y Sistemas Operativos', objetivo: 4, progreso: 0, cuatrimestre: '1C 2026', createdAt: '', updatedAt: '' },
  { id: 2, titulo: 'Completar todas las tareas a tiempo', descripcion: 'Entregar el 100% de los TPs y guías antes de la fecha límite', objetivo: 10, progreso: 3, cuatrimestre: '1C 2026', createdAt: '', updatedAt: '' },
  { id: 3, titulo: 'Mantener asistencia arriba del 80%', descripcion: 'Asistir regularmente a todas las clases de las materias cursando', objetivo: 100, progreso: 85, cuatrimestre: '1C 2026', createdAt: '', updatedAt: '' },
];

// ===================== UTILS =====================
let nextId = 100;
function uid() { return ++nextId; }
function delay(ms = 60): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

function getMateriaRef(materiaId: number) {
  const m = MATERIAS.find((x) => x.id === materiaId);
  return { id: m?.id || materiaId, nombre: m?.nombre || '', color: m?.color || '#4F46E5' };
}

// ===================== API MOCK =====================

export const materiasAPI = {
  getAll: async (): Promise<Materia[]> => { await delay(); return [...MATERIAS]; },
  getById: async (id: number): Promise<Materia> => { await delay(); return MATERIAS.find((m) => m.id === id)!; },
  create: async (data: any): Promise<Materia> => {
    await delay();
    const m: Materia = { id: uid(), nombre: data.nombre, profesor: data.profesor, estado: data.estado || 'Cursando', color: data.color || '#4F46E5', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), horarios: (data.horarios || []).map((h: any, i: number) => ({ ...h, id: uid(), materiaId: nextId })), bibliografia: (data.bibliografia || []).map((b: any) => ({ ...b, id: uid(), materiaId: nextId })) };
    MATERIAS = [...MATERIAS, m];
    return m;
  },
  update: async (id: number, data: any): Promise<Materia> => {
    await delay();
    MATERIAS = MATERIAS.map((m) => {
      if (m.id !== id) return m;
      return { ...m, ...data, id, horarios: data.horarios !== undefined ? (data.horarios || []).map((h: any) => ({ ...h, id: h.id || uid(), materiaId: id })) : m.horarios, bibliografia: data.bibliografia !== undefined ? (data.bibliografia || []).map((b: any) => ({ ...b, id: b.id || uid(), materiaId: id })) : m.bibliografia, updatedAt: new Date().toISOString() };
    });
    return MATERIAS.find((m) => m.id === id)!;
  },
  delete: async (id: number): Promise<void> => { await delay(); MATERIAS = MATERIAS.filter((m) => m.id !== id); },
};

export const examenesAPI = {
  getAll: async (params?: { materiaId?: number; proximos?: boolean }): Promise<Examen[]> => {
    await delay();
    let result = [...EXAMENES];
    if (params?.materiaId) result = result.filter((e) => e.materiaId === params.materiaId);
    if (params?.proximos) result = result.filter((e) => new Date(e.fecha) >= new Date());
    return result.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  },
  create: async (data: any): Promise<Examen> => {
    await delay();
    const e: Examen = { id: uid(), materiaId: data.materiaId, fecha: data.fecha, tipo: data.tipo, aula: data.aula || null, notas: data.notas || null, createdAt: new Date().toISOString(), materia: getMateriaRef(data.materiaId) };
    EXAMENES = [...EXAMENES, e];
    return e;
  },
  update: async (id: number, data: any): Promise<Examen> => {
    await delay();
    EXAMENES = EXAMENES.map((e) => e.id === id ? { ...e, ...data, materia: getMateriaRef(data.materiaId || e.materiaId) } : e);
    return EXAMENES.find((e) => e.id === id)!;
  },
  delete: async (id: number): Promise<void> => { await delay(); EXAMENES = EXAMENES.filter((e) => e.id !== id); },
};

export const tareasAPI = {
  getAll: async (params?: { materiaId?: number; estado?: string }): Promise<Tarea[]> => {
    await delay();
    let result = [...TAREAS];
    if (params?.materiaId) result = result.filter((t) => t.materiaId === params.materiaId);
    if (params?.estado) result = result.filter((t) => t.estado === params.estado);
    return result.sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime());
  },
  create: async (data: any): Promise<Tarea> => {
    await delay();
    const t: Tarea = { id: uid(), materiaId: data.materiaId, titulo: data.titulo, descripcion: data.descripcion || null, fechaLimite: data.fechaLimite, estado: data.estado || 'Pendiente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), materia: getMateriaRef(data.materiaId) };
    TAREAS = [...TAREAS, t];
    return t;
  },
  update: async (id: number, data: any): Promise<Tarea> => {
    await delay();
    TAREAS = TAREAS.map((t) => t.id === id ? { ...t, ...data, materia: getMateriaRef(data.materiaId || t.materiaId), updatedAt: new Date().toISOString() } : t);
    return TAREAS.find((t) => t.id === id)!;
  },
  delete: async (id: number): Promise<void> => { await delay(); TAREAS = TAREAS.filter((t) => t.id !== id); },
};

export const asistenciasAPI = {
  getResumen: async (): Promise<AsistenciaResumen[]> => {
    await delay();
    return MATERIAS.filter((m) => m.estado === 'Cursando').map((m) => {
      const asis = ASISTENCIAS.filter((a) => a.materiaId === m.id);
      const total = asis.length;
      const presentes = asis.filter((a) => a.presente).length;
      const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 100;
      return { materiaId: m.id, materia: m.nombre, color: m.color, total, presentes, ausentes: total - presentes, porcentaje, alerta: porcentaje < 75 };
    });
  },
  getByMateria: async (materiaId: number): Promise<AsistenciaDetalle> => {
    await delay();
    const asis = ASISTENCIAS.filter((a) => a.materiaId === materiaId).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    const total = asis.length;
    const presentes = asis.filter((a) => a.presente).length;
    return { asistencias: asis, total, presentes, porcentaje: total > 0 ? Math.round((presentes / total) * 100) : 100 };
  },
  create: async (data: any): Promise<Asistencia> => {
    await delay();
    const a: Asistencia = { id: uid(), materiaId: data.materiaId, fecha: data.fecha, presente: data.presente !== undefined ? data.presente : true };
    ASISTENCIAS = [...ASISTENCIAS, a];
    return a;
  },
  update: async (id: number, data: any): Promise<Asistencia> => {
    await delay();
    ASISTENCIAS = ASISTENCIAS.map((a) => a.id === id ? { ...a, ...data } : a);
    return ASISTENCIAS.find((a) => a.id === id)!;
  },
  delete: async (id: number): Promise<void> => { await delay(); ASISTENCIAS = ASISTENCIAS.filter((a) => a.id !== id); },
};

export const apuntesAPI = {
  getAll: async (params?: { materiaId?: number; busqueda?: string }): Promise<Apunte[]> => {
    await delay();
    let result = [...APUNTES];
    if (params?.materiaId) result = result.filter((a) => a.materiaId === params.materiaId);
    if (params?.busqueda) { const q = params.busqueda.toLowerCase(); result = result.filter((a) => a.titulo.toLowerCase().includes(q) || (a.contenido || '').toLowerCase().includes(q)); }
    return result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },
  getById: async (id: number): Promise<Apunte> => { await delay(); return APUNTES.find((a) => a.id === id)!; },
  create: async (data: any): Promise<Apunte> => {
    await delay();
    const a: Apunte = { id: uid(), materiaId: data.materiaId, titulo: data.titulo, contenido: data.contenido || null, tipo: data.tipo || 'nota', url: data.url || null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), materia: getMateriaRef(data.materiaId) };
    APUNTES = [...APUNTES, a];
    return a;
  },
  update: async (id: number, data: any): Promise<Apunte> => {
    await delay();
    APUNTES = APUNTES.map((a) => a.id === id ? { ...a, ...data, materia: getMateriaRef(data.materiaId || a.materiaId), updatedAt: new Date().toISOString() } : a);
    return APUNTES.find((a) => a.id === id)!;
  },
  delete: async (id: number): Promise<void> => { await delay(); APUNTES = APUNTES.filter((a) => a.id !== id); },
};

export const metasAPI = {
  getAll: async (): Promise<Meta[]> => { await delay(); return [...METAS]; },
  create: async (data: any): Promise<Meta> => {
    await delay();
    const m: Meta = { id: uid(), titulo: data.titulo, descripcion: data.descripcion || null, objetivo: data.objetivo || 1, progreso: data.progreso || 0, cuatrimestre: data.cuatrimestre, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    METAS = [...METAS, m];
    return m;
  },
  update: async (id: number, data: any): Promise<Meta> => {
    await delay();
    METAS = METAS.map((m) => m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m);
    return METAS.find((m) => m.id === id)!;
  },
  delete: async (id: number): Promise<void> => { await delay(); METAS = METAS.filter((m) => m.id !== id); },
};

export const eventosAPI = {
  getAll: async (): Promise<Evento[]> => { await delay(); return [...EVENTOS].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); },
  create: async (data: any): Promise<Evento> => {
    await delay();
    const e: Evento = { id: uid(), titulo: data.titulo, fecha: data.fecha, descripcion: data.descripcion || null, color: data.color || '#6366F1', createdAt: new Date().toISOString() };
    EVENTOS = [...EVENTOS, e];
    return e;
  },
  update: async (id: number, data: any): Promise<Evento> => {
    await delay();
    EVENTOS = EVENTOS.map((e) => e.id === id ? { ...e, ...data } : e);
    return EVENTOS.find((e) => e.id === id)!;
  },
  delete: async (id: number): Promise<void> => { await delay(); EVENTOS = EVENTOS.filter((e) => e.id !== id); },
};

export const dashboardAPI = {
  get: async (): Promise<DashboardData> => {
    await delay();
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoyDia = diasSemana[now.getDay()];

    const clasesHoy = MATERIAS.filter((m) => m.estado === 'Cursando').flatMap((m) => {
      const hoys = m.horarios.filter((h) => h.diaSemana === hoyDia);
      if (hoys.length === 0) return [];
      return [{ materiaId: m.id, materia: m.nombre, color: m.color, horarios: hoys.map((h) => ({ horaInicio: h.horaInicio, horaFin: h.horaFin })) }];
    });

    const examenesProximos = EXAMENES.filter((e) => new Date(e.fecha) >= now && new Date(e.fecha) <= in7Days).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    const tareasUrgentes = TAREAS.filter((t) => ['Pendiente', 'En progreso'].includes(t.estado) && new Date(t.fechaLimite) >= now).sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime()).slice(0, 5);

    const totalMaterias = MATERIAS.length;
    const materiasCursando = MATERIAS.filter((m) => m.estado === 'Cursando').length;
    const materiasAprobadas = MATERIAS.filter((m) => m.estado === 'Aprobada').length;
    const materiasPendientes = MATERIAS.filter((m) => m.estado === 'Pendiente').length;
    const totalTareas = TAREAS.length;
    const tareasEntregadas = TAREAS.filter((t) => t.estado === 'Entregada').length;
    const total = ASISTENCIAS.length;
    const presentes = ASISTENCIAS.filter((a) => a.presente).length;
    const asistenciaPromedio = total > 0 ? Math.round((presentes / total) * 100) : 100;
    const todayStr = now.toISOString().slice(0, 10);
    const eventosHoy = EVENTOS.filter((e) => e.fecha.slice(0, 10) === todayStr);

    return { clasesHoy, examenesProximos, tareasUrgentes, eventosHoy, estadisticas: { totalMaterias, materiasCursando, materiasAprobadas, materiasPendientes, totalTareas, tareasEntregadas, asistenciaPromedio } };
  },
};
