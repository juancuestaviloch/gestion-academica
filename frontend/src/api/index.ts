// ============================================================
// MOCK DATA - Datos reales extraídos del Campus Virtual
// FCEyS - Universidad Nacional de Mar del Plata
// Estudiante: Cuesta Viloch, Juan José
//
// Cuando se integre Supabase, reemplazar estas funciones por
// llamadas reales a la API.
// ============================================================

import { Materia, Examen, Tarea, Asistencia, AsistenciaResumen, AsistenciaDetalle, Apunte, Evento, Meta, DashboardData } from '../types';

// Helper para fechas relativas
function addDays(days: number): Date {
  const d = new Date(); d.setDate(d.getDate() + days); return d;
}
function subDays(days: number): Date { return addDays(-days); }

// ===================== MATERIAS =====================
// Horarios verificados en eco.mdp.edu.ar — 1° Cuatrimestre 2026
let MATERIAS: Materia[] = [
  {
    id: 1, nombre: 'Introducción a la Economía', profesor: 'Adrián Giudice (T) / A designar (P)', estado: 'Cursando', color: '#4F46E5',
    createdAt: '', updatedAt: '',
    horarios: [
      { id: 1, materiaId: 1, diaSemana: 'Martes', horaInicio: '08:00', horaFin: '11:00' },
      { id: 2, materiaId: 1, diaSemana: 'Viernes', horaInicio: '08:00', horaFin: '11:00' },
    ],
    bibliografia: [
      { id: 1, materiaId: 1, nombre: 'Mankiw - Principios de Economía', url: null },
      { id: 2, materiaId: 1, nombre: 'Material Campus Virtual', url: 'https://eco.mdp.edu.ar/cv/' },
    ],
  },
  {
    id: 2, nombre: 'Matemática I', profesor: 'Belén Álvarez (T) / Mailén García Boviero (P)', estado: 'Cursando', color: '#059669',
    createdAt: '', updatedAt: '',
    horarios: [
      { id: 3, materiaId: 2, diaSemana: 'Lunes', horaInicio: '12:00', horaFin: '14:00' },
      { id: 4, materiaId: 2, diaSemana: 'Miércoles', horaInicio: '08:00', horaFin: '10:30' },
    ],
    bibliografia: [
      { id: 3, materiaId: 2, nombre: 'Guía de ejercicios - Cátedra', url: null },
      { id: 4, materiaId: 2, nombre: 'Videos Clase 1 (Aula Virtual)', url: 'https://eco.mdp.edu.ar/cv/' },
    ],
  },
  {
    id: 3, nombre: 'Principios de Administración', profesor: 'Daniel Guzman (T) / Florencia Mussano (P)', estado: 'Cursando', color: '#DC2626',
    createdAt: '', updatedAt: '',
    horarios: [
      { id: 5, materiaId: 3, diaSemana: 'Lunes', horaInicio: '11:00', horaFin: '12:30' },
      { id: 6, materiaId: 3, diaSemana: 'Miércoles', horaInicio: '11:00', horaFin: '12:30' },
      { id: 7, materiaId: 3, diaSemana: 'Jueves', horaInicio: '10:00', horaFin: '12:00' },
    ],
    bibliografia: [
      { id: 5, materiaId: 3, nombre: 'Robbins & Coulter - Administración', url: null },
    ],
  },
  {
    id: 4, nombre: 'Taller Introd. Vida Universitaria (TIVU)', profesor: 'Equipo TIVU', estado: 'Cursando', color: '#D97706',
    createdAt: '', updatedAt: '',
    horarios: [],
    bibliografia: [],
  },
];

// ===================== EXÁMENES =====================
let EXAMENES: Examen[] = [
  { id: 1, materiaId: 2, fecha: addDays(18).toISOString(), tipo: 'Parcial', aula: 'Por confirmar', notas: '1er Parcial - Funciones, límites y derivadas', createdAt: '', materia: { id: 2, nombre: 'Matemática I', color: '#059669' } },
  { id: 2, materiaId: 1, fecha: addDays(25).toISOString(), tipo: 'Parcial', aula: 'Por confirmar', notas: '1er Parcial - Microeconomía básica', createdAt: '', materia: { id: 1, nombre: 'Introducción a la Economía', color: '#4F46E5' } },
  { id: 3, materiaId: 3, fecha: addDays(30).toISOString(), tipo: 'Parcial', aula: 'Por confirmar', notas: '1er Parcial - Principios de Administración', createdAt: '', materia: { id: 3, nombre: 'Principios de Administración', color: '#DC2626' } },
];

// ===================== TAREAS =====================
let TAREAS: Tarea[] = [
  { id: 1, materiaId: 2, titulo: 'Imprimir y llevar Guía de TP n° 1', descripcion: 'Sucesiones numéricas. Indispensable para la clase práctica.', fechaLimite: addDays(4).toISOString(), estado: 'Pendiente', createdAt: '', updatedAt: '', materia: { id: 2, nombre: 'Matemática I', color: '#059669' } },
  { id: 5, materiaId: 2, titulo: 'Ver Video Obligatorio: Clase 1', descripcion: 'Ver el video de la Clase 1 sobre Sucesiones en el Campus Virtual ANTES de asistir a la práctica.', fechaLimite: addDays(2).toISOString(), estado: 'Pendiente', createdAt: '', updatedAt: '', materia: { id: 2, nombre: 'Matemática I', color: '#059669' } },
  { id: 2, materiaId: 4, titulo: 'Cuestionario cierre TIVU 2026', descripcion: 'Completar el cuestionario final en la solapa de TIVU en el campus virtual.', fechaLimite: addDays(0).toISOString(), estado: 'Pendiente', createdAt: '', updatedAt: '', materia: { id: 4, nombre: 'Taller Introd. Vida Universitaria (TIVU)', color: '#D97706' } },
  { id: 3, materiaId: 1, titulo: 'Lectura: ¿Qué es la Economía?', descripcion: 'Prepararse para la primera semana con esta lectura introductoria (Unidad 1).', fechaLimite: addDays(10).toISOString(), estado: 'Pendiente', createdAt: '', updatedAt: '', materia: { id: 1, nombre: 'Introducción a la Economía', color: '#4F46E5' } },
  { id: 6, materiaId: 1, titulo: 'Conseguir Dossiers y Guía U1', descripcion: 'Pasar por fotocopiadora para comprar y llevar a clase: Dossiers de Lectura U1 y Guía de TPs U1 2025.', fechaLimite: addDays(9).toISOString(), estado: 'Pendiente', createdAt: '', updatedAt: '', materia: { id: 1, nombre: 'Introducción a la Economía', color: '#4F46E5' } },
  { id: 7, materiaId: 3, titulo: 'Seleccionar Comisión en Campus', descripcion: 'Entrar a Principios de Administración en el CV y seleccionar la Comisión 50 para destrabar el material.', fechaLimite: addDays(1).toISOString(), estado: 'Pendiente', createdAt: '', updatedAt: '', materia: { id: 3, nombre: 'Principios de Administración', color: '#DC2626' } },
];

// ===================== ASISTENCIAS =====================
let ASISTENCIAS: Asistencia[] = [];
let asistId = 1;
// Generar algunas asistencias de ejemplo para las primeras semanas
for (const mid of [1, 2, 3, 4]) {
  for (let i = 1; i <= 4; i++) {
    ASISTENCIAS.push({ id: asistId++, materiaId: mid, fecha: subDays(i * 4).toISOString(), presente: Math.random() > 0.1 });
  }
}

// ===================== APUNTES =====================
let APUNTES: Apunte[] = [
  { id: 1, materiaId: 2, titulo: 'Aviso: Paro docente semana 16-20 marzo', contenido: '# Paro Docente - Matemática I\n\n## Tu comisión (Com. 4):\n- **Lunes 16/3:** NORMAL (Teoría).\n- **Miércoles 18/3:** Es probable que no haya práctica presencial.\n\n> Se debe ver obligatoriamente el **video de la Clase 1** publicado en el aula virtual.', tipo: 'nota', url: null, createdAt: new Date().toISOString(), updatedAt: '', materia: { id: 2, nombre: 'Matemática I', color: '#059669' } },
  { id: 2, materiaId: 1, titulo: 'Aviso: Inicio de clases pospuesto', contenido: '# Introducción a la Economía\n\nTodos los integrantes de la cátedra se adhieren al **paro docente** de la semana del 16 al 20 de marzo.\n\n**Las clases inician la semana siguiente** (a partir del 23 de marzo).\n\nMail de contacto: `iale@mdp.edu.ar`', tipo: 'nota', url: null, createdAt: new Date().toISOString(), updatedAt: '', materia: { id: 1, nombre: 'Introducción a la Economía', color: '#4F46E5' } },
  { id: 5, materiaId: 3, titulo: 'Aviso: Seleccionar Comisión 50', contenido: 'En el campus de Administración (Presentación 2025) hay que seleccionar la opción de Comisión 50 para que te habiliten el material de cursada y foros.', tipo: 'nota', url: null, createdAt: new Date().toISOString(), updatedAt: '', materia: { id: 3, nombre: 'Principios de Administración', color: '#DC2626' } },
];

// ===================== EVENTOS =====================
let EVENTOS: Evento[] = [
  { id: 1, titulo: 'Paro docente - Semana del 16 al 20', fecha: addDays(3).toISOString(), descripcion: 'Adhesión parcial. Matemática Com 4 tiene clases el lunes.', color: '#EF4444', createdAt: '' },
  { id: 2, titulo: 'Inicio cursada Intro Economía', fecha: addDays(11).toISOString(), descripcion: 'Primera clase de Teoría con A. Giudice (pospuesta una semana por el paro).', color: '#4F46E5', createdAt: '' },
  { id: 3, titulo: 'Cierre Cuestionario TIVU', fecha: addDays(0).toISOString(), descripcion: 'Fecha límite para entregar evaluación del TIVU', color: '#D97706', createdAt: '' },
];

// ===================== METAS =====================
let METAS: Meta[] = [
  { id: 1, titulo: 'Aprobar las 4 materias del cuatrimestre', descripcion: 'Aprobar Intro Economía, Matemática I, Principios de Administración y TIVU', objetivo: 4, progreso: 0, cuatrimestre: '1C 2026', createdAt: '', updatedAt: '' },
  { id: 2, titulo: 'Mantener asistencia arriba del 80%', descripcion: 'Asistir regularmente a todas las clases', objetivo: 100, progreso: 90, cuatrimestre: '1C 2026', createdAt: '', updatedAt: '' },
  { id: 3, titulo: 'Completar todas las tareas a tiempo', descripcion: 'Entregar TPs, guías y cuestionarios antes de la fecha límite', objetivo: 10, progreso: 0, cuatrimestre: '1C 2026', createdAt: '', updatedAt: '' },
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
    const m: Materia = { id: uid(), nombre: data.nombre, profesor: data.profesor, estado: data.estado || 'Cursando', color: data.color || '#4F46E5', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), horarios: (data.horarios || []).map((h: any) => ({ ...h, id: uid(), materiaId: nextId })), bibliografia: (data.bibliografia || []).map((b: any) => ({ ...b, id: uid(), materiaId: nextId })) };
    MATERIAS = [...MATERIAS, m]; return m;
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
    await delay(); let r = [...EXAMENES];
    if (params?.materiaId) r = r.filter((e) => e.materiaId === params.materiaId);
    if (params?.proximos) r = r.filter((e) => new Date(e.fecha) >= new Date());
    return r.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  },
  create: async (data: any): Promise<Examen> => { await delay(); const e: Examen = { id: uid(), materiaId: data.materiaId, fecha: data.fecha, tipo: data.tipo, aula: data.aula || null, notas: data.notas || null, createdAt: new Date().toISOString(), materia: getMateriaRef(data.materiaId) }; EXAMENES = [...EXAMENES, e]; return e; },
  update: async (id: number, data: any): Promise<Examen> => { await delay(); EXAMENES = EXAMENES.map((e) => e.id === id ? { ...e, ...data, materia: getMateriaRef(data.materiaId || e.materiaId) } : e); return EXAMENES.find((e) => e.id === id)!; },
  delete: async (id: number): Promise<void> => { await delay(); EXAMENES = EXAMENES.filter((e) => e.id !== id); },
};

export const tareasAPI = {
  getAll: async (params?: { materiaId?: number; estado?: string }): Promise<Tarea[]> => {
    await delay(); let r = [...TAREAS];
    if (params?.materiaId) r = r.filter((t) => t.materiaId === params.materiaId);
    if (params?.estado) r = r.filter((t) => t.estado === params.estado);
    return r.sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime());
  },
  create: async (data: any): Promise<Tarea> => { await delay(); const t: Tarea = { id: uid(), materiaId: data.materiaId, titulo: data.titulo, descripcion: data.descripcion || null, fechaLimite: data.fechaLimite, estado: data.estado || 'Pendiente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), materia: getMateriaRef(data.materiaId) }; TAREAS = [...TAREAS, t]; return t; },
  update: async (id: number, data: any): Promise<Tarea> => { await delay(); TAREAS = TAREAS.map((t) => t.id === id ? { ...t, ...data, materia: getMateriaRef(data.materiaId || t.materiaId), updatedAt: new Date().toISOString() } : t); return TAREAS.find((t) => t.id === id)!; },
  delete: async (id: number): Promise<void> => { await delay(); TAREAS = TAREAS.filter((t) => t.id !== id); },
};

export const asistenciasAPI = {
  getResumen: async (): Promise<AsistenciaResumen[]> => {
    await delay();
    return MATERIAS.filter((m) => m.estado === 'Cursando').map((m) => {
      const asis = ASISTENCIAS.filter((a) => a.materiaId === m.id);
      const total = asis.length; const presentes = asis.filter((a) => a.presente).length;
      const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 100;
      return { materiaId: m.id, materia: m.nombre, color: m.color, total, presentes, ausentes: total - presentes, porcentaje, alerta: porcentaje < 75 };
    });
  },
  getByMateria: async (materiaId: number): Promise<AsistenciaDetalle> => {
    await delay();
    const asis = ASISTENCIAS.filter((a) => a.materiaId === materiaId).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    const total = asis.length; const presentes = asis.filter((a) => a.presente).length;
    return { asistencias: asis, total, presentes, porcentaje: total > 0 ? Math.round((presentes / total) * 100) : 100 };
  },
  create: async (data: any): Promise<Asistencia> => { await delay(); const a: Asistencia = { id: uid(), materiaId: data.materiaId, fecha: data.fecha, presente: data.presente !== undefined ? data.presente : true }; ASISTENCIAS = [...ASISTENCIAS, a]; return a; },
  update: async (id: number, data: any): Promise<Asistencia> => { await delay(); ASISTENCIAS = ASISTENCIAS.map((a) => a.id === id ? { ...a, ...data } : a); return ASISTENCIAS.find((a) => a.id === id)!; },
  delete: async (id: number): Promise<void> => { await delay(); ASISTENCIAS = ASISTENCIAS.filter((a) => a.id !== id); },
};

export const apuntesAPI = {
  getAll: async (params?: { materiaId?: number; busqueda?: string }): Promise<Apunte[]> => {
    await delay(); let r = [...APUNTES];
    if (params?.materiaId) r = r.filter((a) => a.materiaId === params.materiaId);
    if (params?.busqueda) { const q = params.busqueda.toLowerCase(); r = r.filter((a) => a.titulo.toLowerCase().includes(q) || (a.contenido || '').toLowerCase().includes(q)); }
    return r.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },
  getById: async (id: number): Promise<Apunte> => { await delay(); return APUNTES.find((a) => a.id === id)!; },
  create: async (data: any): Promise<Apunte> => { await delay(); const a: Apunte = { id: uid(), materiaId: data.materiaId, titulo: data.titulo, contenido: data.contenido || null, tipo: data.tipo || 'nota', url: data.url || null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), materia: getMateriaRef(data.materiaId) }; APUNTES = [...APUNTES, a]; return a; },
  update: async (id: number, data: any): Promise<Apunte> => { await delay(); APUNTES = APUNTES.map((a) => a.id === id ? { ...a, ...data, materia: getMateriaRef(data.materiaId || a.materiaId), updatedAt: new Date().toISOString() } : a); return APUNTES.find((a) => a.id === id)!; },
  delete: async (id: number): Promise<void> => { await delay(); APUNTES = APUNTES.filter((a) => a.id !== id); },
};

export const metasAPI = {
  getAll: async (): Promise<Meta[]> => { await delay(); return [...METAS]; },
  create: async (data: any): Promise<Meta> => { await delay(); const m: Meta = { id: uid(), titulo: data.titulo, descripcion: data.descripcion || null, objetivo: data.objetivo || 1, progreso: data.progreso || 0, cuatrimestre: data.cuatrimestre, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; METAS = [...METAS, m]; return m; },
  update: async (id: number, data: any): Promise<Meta> => { await delay(); METAS = METAS.map((m) => m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m); return METAS.find((m) => m.id === id)!; },
  delete: async (id: number): Promise<void> => { await delay(); METAS = METAS.filter((m) => m.id !== id); },
};

export const eventosAPI = {
  getAll: async (): Promise<Evento[]> => { await delay(); return [...EVENTOS].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); },
  create: async (data: any): Promise<Evento> => { await delay(); const e: Evento = { id: uid(), titulo: data.titulo, fecha: data.fecha, descripcion: data.descripcion || null, color: data.color || '#6366F1', createdAt: new Date().toISOString() }; EVENTOS = [...EVENTOS, e]; return e; },
  update: async (id: number, data: any): Promise<Evento> => { await delay(); EVENTOS = EVENTOS.map((e) => e.id === id ? { ...e, ...data } : e); return EVENTOS.find((e) => e.id === id)!; },
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
