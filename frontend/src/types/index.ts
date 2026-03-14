export interface Horario {
  id?: number;
  materiaId?: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  aula?: string | null;
  tipo?: string | null;
  profesor?: string | null;
}

export interface Bibliografia {
  id?: number;
  materiaId?: number;
  nombre: string;
  url?: string | null;
}

export interface Materia {
  id: number;
  nombre: string;
  profesor: string;
  estado: 'Cursando' | 'Aprobada' | 'Pendiente';
  color: string;
  anio: number;
  cuatrimestre: string;
  createdAt: string;
  updatedAt: string;
  horarios: Horario[];
  bibliografia: Bibliografia[];
}

export interface Examen {
  id: number;
  materiaId: number;
  fecha: string;
  tipo: 'Parcial' | 'Final' | 'Recuperatorio';
  aula?: string | null;
  notas?: string | null;
  createdAt: string;
  materia: { id: number; nombre: string; color: string };
}

export interface Tarea {
  id: number;
  materiaId: number;
  titulo: string;
  descripcion?: string | null;
  fechaLimite: string;
  estado: 'Pendiente' | 'En progreso' | 'Entregada';
  createdAt: string;
  updatedAt: string;
  materia: { id: number; nombre: string; color: string };
}

export interface Asistencia {
  id: number;
  materiaId: number;
  fecha: string;
  presente: boolean;
}

export interface AsistenciaResumen {
  materiaId: number;
  materia: string;
  color: string;
  total: number;
  presentes: number;
  ausentes: number;
  porcentaje: number;
  alerta: boolean;
}

export interface AsistenciaDetalle {
  asistencias: Asistencia[];
  total: number;
  presentes: number;
  porcentaje: number;
}

export interface Apunte {
  id: number;
  materiaId: number;
  titulo: string;
  contenido?: string | null;
  tipo: 'nota' | 'link' | 'archivo' | 'canvas';
  url?: string | null;
  createdAt: string;
  updatedAt: string;
  materia: { id: number; nombre: string; color: string };
}

export interface Evento {
  id: number;
  titulo: string;
  fecha: string;
  descripcion?: string | null;
  color: string;
  esParo?: boolean;
  createdAt: string;
}

export interface Meta {
  id: number;
  titulo: string;
  descripcion?: string | null;
  objetivo: number;
  progreso: number;
  cuatrimestre: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  clasesHoy: {
    materiaId: number;
    materia: string;
    color: string;
    horarios: { horaInicio: string; horaFin: string }[];
  }[];
  examenesProximos: Examen[];
  tareasUrgentes: Tarea[];
  eventosHoy: Evento[];
  videosPendientes: Video[];
  estadisticas: {
    totalMaterias: number;
    materiasCursando: number;
    materiasAprobadas: number;
    materiasPendientes: number;
    totalTareas: number;
    tareasEntregadas: number;
    asistenciaPromedio: number;
    rachaEstudio: number;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color: string;
  type: 'clase' | 'examen' | 'tarea' | 'evento';
  time?: string;
  isParo?: boolean;
  aula?: string | null;
  tipoClase?: string | null;
  profesor?: string | null;
  description?: string;
}

export interface Video {
  id: number;
  materiaId: number;
  titulo: string;
  url: string;
  duracion?: string | null;
  visto: boolean;
  createdAt: string;
  materia: { id: number; nombre: string; color: string };
}
