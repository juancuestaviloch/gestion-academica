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
} from 'lucide-react';
import { dashboardAPI } from '../api';
import { DashboardData } from '../types';

export default function Dashboard() {
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
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Materias Cursando"
          value={estadisticas.materiasCursando}
          color="bg-primary-500"
          sub={`${estadisticas.materiasAprobadas} aprobadas de ${estadisticas.totalMaterias}`}
        />
        <StatCard
          icon={<CheckSquare className="w-5 h-5" />}
          label="Tareas Completadas"
          value={`${estadisticas.tareasEntregadas}/${estadisticas.totalTareas}`}
          color="bg-success"
          sub={`${estadisticas.totalTareas - estadisticas.tareasEntregadas} pendientes`}
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-white" />}
          label="Racha de Estudio"
          value={`${estadisticas.rachaEstudio} días`}
          color={estadisticas.rachaEstudio > 0 ? 'bg-orange-500' : 'bg-gray-400'}
          sub={
            estadisticas.rachaEstudio > 2
              ? '🔥 ¡Excelente ritmo!'
              : estadisticas.rachaEstudio > 0
              ? '👍 ¡A seguir así!'
              : 'Empieza hoy tu racha'
          }
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Exámenes Próximos"
          value={examenesProximos.length}
          color="bg-warning"
          sub="En los próximos 7 días"
        />
      </div>

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
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer"
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
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer"
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  sub: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 group hover:-translate-y-1 hover:shadow-xl hover:border-primary-100 transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          {icon}
        </div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
