import { Materia, Examen, Tarea, AsistenciaResumen, AsistenciaDetalle, Apunte, Evento, Meta, DashboardData, Video, Asistencia } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`Error fetching ${endpoint}: ${res.statusText}`);
  }
  return res.json();
}

// ===================== API REAL =====================

export const materiasAPI = {
  getAll: () => fetchAPI<Materia[]>('/materias'),
  getById: (id: number) => fetchAPI<Materia>(`/materias/${id}`),
  create: (data: any) => fetchAPI<Materia>('/materias', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI<Materia>(`/materias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/materias/${id}`, { method: 'DELETE' }),
};

export const examenesAPI = {
  getAll: (params?: { materiaId?: number; proximos?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.materiaId) query.append('materiaId', params.materiaId.toString());
    if (params?.proximos) query.append('proximos', 'true');
    return fetchAPI<Examen[]>(`/examenes?${query.toString()}`);
  },
  create: (data: any) => fetchAPI<Examen>('/examenes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI<Examen>(`/examenes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/examenes/${id}`, { method: 'DELETE' }),
};

export const tareasAPI = {
  getAll: (params?: { materiaId?: number; estado?: string }) => {
    const query = new URLSearchParams();
    if (params?.materiaId) query.append('materiaId', params.materiaId.toString());
    if (params?.estado) query.append('estado', params.estado);
    return fetchAPI<Tarea[]>(`/tareas?${query.toString()}`);
  },
  create: (data: any) => fetchAPI<Tarea>('/tareas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI<Tarea>(`/tareas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/tareas/${id}`, { method: 'DELETE' }),
};

export const asistenciasAPI = {
  getResumen: () => fetchAPI<AsistenciaResumen[]>('/asistencias/resumen'),
  getByMateria: (materiaId: number) => fetchAPI<AsistenciaDetalle>(`/asistencias/materia/${materiaId}`),
  create: (data: any) => fetchAPI<Asistencia>('/asistencias', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI<Asistencia>(`/asistencias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/asistencias/${id}`, { method: 'DELETE' }),
};

export const apuntesAPI = {
  getAll: (params?: { materiaId?: number; busqueda?: string }) => {
    const query = new URLSearchParams();
    if (params?.materiaId) query.append('materiaId', params.materiaId.toString());
    if (params?.busqueda) query.append('busqueda', params.busqueda);
    return fetchAPI<Apunte[]>(`/apuntes?${query.toString()}`);
  },
  getById: (id: number) => fetchAPI<Apunte>(`/apuntes/${id}`),
  create: (data: any) => fetchAPI<Apunte>('/apuntes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI<Apunte>(`/apuntes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/apuntes/${id}`, { method: 'DELETE' }),
};

export const metasAPI = {
  getAll: () => fetchAPI<Meta[]>('/metas'),
  create: (data: any) => fetchAPI<Meta>('/metas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI<Meta>(`/metas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/metas/${id}`, { method: 'DELETE' }),
};

export const eventosAPI = {
  getAll: () => fetchAPI<Evento[]>('/eventos'),
  create: (data: any) => fetchAPI<Evento>('/eventos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI<Evento>(`/eventos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/eventos/${id}`, { method: 'DELETE' }),
};

export const videosAPI = {
  getAll: (params?: { materiaId?: number; soloPendientes?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.materiaId) query.append('materiaId', params.materiaId.toString());
    if (params?.soloPendientes) query.append('soloPendientes', 'true');
    return fetchAPI<Video[]>(`/videos?${query.toString()}`);
  },
  getById: (id: number) => fetchAPI<Video>(`/videos/${id}`),
  create: (data: any) => fetchAPI<Video>('/videos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI<Video>(`/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleVisto: (id: number) => fetchAPI<Video>(`/videos/${id}/toggle`, { method: 'PATCH' }),
  delete: (id: number) => fetchAPI<void>(`/videos/${id}`, { method: 'DELETE' }),
};

export const dashboardAPI = {
  get: () => fetchAPI<DashboardData>('/dashboard'),
};

export const notificacionesAPI = {
  getAll: () => fetchAPI<any[]>('/notificaciones'),
};

export const sesionesAPI = {
  getAll: (materiaId?: number) => fetchAPI<any[]>(`/sesiones${materiaId ? `?materiaId=${materiaId}` : ''}`),
  create: (data: { materiaId?: number; duracion: number }) => fetchAPI<any>('/sesiones', { method: 'POST', body: JSON.stringify(data) }),
};
export const flashcardsAPI = {
  getAll: (materiaId?: number) => fetchAPI<any[]>(`/flashcards${materiaId ? `?materiaId=${materiaId}` : ''}`),
  getPendientes: (materiaId?: number) => fetchAPI<any[]>(`/flashcards/pendientes${materiaId ? `?materiaId=${materiaId}` : ''}`),
  create: (data: { materiaId: number; pregunta: string; respuesta: string }) => fetchAPI<any>('/flashcards', { method: 'POST', body: JSON.stringify(data) }),
  repasar: (id: number, q: number) => fetchAPI<any>(`/flashcards/${id}/repasar`, { method: 'POST', body: JSON.stringify({ q }) }),
  delete: (id: number) => fetchAPI<void>(`/flashcards/${id}`, { method: 'DELETE' }),
};
