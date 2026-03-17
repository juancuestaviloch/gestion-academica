import { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  FileText,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Flame,
  GraduationCap,
} from 'lucide-react';
import { dashboardAPI } from '../api';
import { DashboardData } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { clasesHoy, examenesProximos, tareasUrgentes, estadisticas } = data;

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  function diasHasta(fecha: string) {
    const diff = Math.ceil(
      (new Date(fecha).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';
    return `En ${diff} días`;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Materias Cursando"
          value={estadisticas.materiasCursando}
          color="bg-primary-500"
          sub={`${estadisticas.materiasAprobadas} aprobadas de ${estadisticas.totalMaterias}`}
          className="animate-fade-in animate-stagger-1"
        />
        <StatCard
          icon={<GraduationCap className="w-5 h-5" />}
          label="Promedio General"
          value={estadisticas.promedioGeneral || '-.--'}
          color="bg-indigo-600"
          sub="Basado en finales y parciales"
          className="animate-fade-in animate-stagger-2"
        />
        <StatCard
          icon={<CheckSquare className="w-5 h-5" />}
          label="Tareas Completadas"
          value={`${estadisticas.tareasEntregadas}/${estadisticas.totalTareas}`}
          color="bg-success"
          sub={`${estadisticas.totalTareas - estadisticas.tareasEntregadas} pendientes`}
          className="animate-fade-in animate-stagger-3"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-white" />}
          label="Racha de Estudio"
          value={`${estadisticas.rachaEstudio} días`}
          color={estadisticas.rachaEstudio > 0 ? 'bg-orange-500' : 'bg-slate-400'}
          sub={
            estadisticas.rachaEstudio > 2
              ? '🔥 ¡Excelente ritmo!'
              : estadisticas.rachaEstudio > 0
              ? '👍 ¡A seguir así!'
              : 'Empieza hoy tu racha'
          }
          className="animate-fade-in animate-stagger-4"
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Exámenes Próximos"
          value={examenesProximos.length}
          color="bg-warning"
          sub="En los próximos 7 días"
          className="animate-fade-in animate-stagger-4"
        />
      </div>

      {/* Seccion Proactiva: Próxima Clase */}
      {data.proximaClase && (
        <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-100">Próximo Evento</span>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="w-6 h-6" /> {data.proximaClase.materia}
              </h2>
              <p className="text-primary-100 opacity-90">
                Empieza hoy a las <span className="font-bold">{data.proximaClase.hora}</span> en <span className="font-bold">{data.proximaClase.aulaText || 'Aula a confirmar'}</span>
              </p>
            </div>
            <button 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full font-semibold transition-all border border-white/20"
              onClick={() => navigate(`/materia/${data.proximaClase?.materiaId}`)}
            >
              Ver detalles de cursada
            </button>
          </div>
          <div className="absolute right-0 top-0 -mr-8 -mt-8 opacity-10">
            <Clock className="w-48 h-48 rotate-12" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clases de hoy */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            <h3 className="font-bold text-gray-900">Clases de Hoy</h3>
          </div>
          <div className="p-4 space-y-3">
            {clasesHoy.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No hay clases hoy 🎉</p>
            ) : (
              clasesHoy.map((clase, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/materia/${clase.materiaId}`)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:bg-white hover:border-primary-100 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="w-1 h-12 rounded-full shrink-0"
                    style={{ backgroundColor: clase.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{clase.materia}</p>
                    <p className="text-sm text-gray-500">
                      {clase.horarios.map((h) => `${h.horaInicio} - ${h.horaFin}`).join(', ')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exámenes próximos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-bold text-gray-900">Exámenes Próximos</h3>
          </div>
          <div className="p-4 space-y-3">
            {examenesProximos.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                No hay exámenes en los próximos 7 días
              </p>
            ) : (
              examenesProximos.map((examen) => (
                <div
                  key={examen.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:bg-white hover:border-warning-100 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-fade-in"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: examen.materia.color }}
                  >
                    {examen.tipo.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{examen.materia.nombre}</p>
                    <p className="text-sm text-gray-500">
                      {examen.tipo} · {examen.aula || 'Sin aula'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-primary-600">
                      {diasHasta(examen.fecha)}
                    </p>
                    <p className="text-xs text-gray-400">{formatFecha(examen.fecha)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tareas urgentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-danger" />
            <h3 className="font-bold text-gray-900">Tareas Pendientes Urgentes</h3>
          </div>
          <div className="p-4">
            {tareasUrgentes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                No hay tareas pendientes urgentes 🎉
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tareasUrgentes.map((tarea) => {
                  const diasRestantes = Math.ceil(
                    (new Date(tarea.fechaLimite).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  const urgente = diasRestantes <= 2;
                  return (
                    <div
                      key={tarea.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                        urgente
                          ? 'border-red-200 bg-red-50 hover:bg-red-100'
                          : 'border-gray-100 bg-gray-50 hover:border-primary-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div
                          className="w-2 h-2 rounded-full mt-2 shrink-0"
                          style={{ backgroundColor: tarea.materia.color }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {tarea.titulo}
                          </p>
                          <p className="text-xs text-gray-500">{tarea.materia.nombre}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            tarea.estado === 'En progreso'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {tarea.estado}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            urgente ? 'text-red-600' : 'text-gray-500'
                          }`}
                        >
                          {diasHasta(tarea.fechaLimite)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  sub,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  sub: string;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-premium p-6 group hover:-translate-y-1.5 hover:shadow-premium-hover hover:border-primary-200 transition-all duration-500 cursor-pointer overflow-hidden relative ${className}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-black/5`}>
          {icon}
        </div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      <p className="text-[11px] font-medium text-slate-400 mt-2">{sub}</p>
    </div>
  );
}
