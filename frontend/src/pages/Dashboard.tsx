import { useState, useEffect } from 'react';
import {
  Clock,
  CheckSquare,
  AlertTriangle,
  Calendar,
  Zap,
  Plus,
  MoreVertical,
  CheckCircle2,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { dashboardAPI, eventosAcademicosAPI, materiasAPI } from '../api';
import { DashboardData, EventoAcademico, Materia } from '../types';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import BulkTaskModal from '../components/BulkTaskModal';

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  const colors: any = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
          <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  // ... (existing state)
  const [data, setData] = useState<DashboardData | null>(null);
  const [eventos, setEventos] = useState<EventoAcademico[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [form, setForm] = useState({
    materiaId: 0,
    titulo: '',
    tipo: 'Tarea' as any,
    fecha: new Date().toISOString().slice(0, 16),
    estado: 'Pendiente' as any,
    horasEstimadas: 2
  });

  const fetchData = async () => {
    try {
      const [dash, evs, mats] = await Promise.all([
        dashboardAPI.get(),
        eventosAcademicosAPI.getAll(),
        materiasAPI.getAll()
      ]);
      setData(dash);
      setEventos(evs);
      setMaterias(mats);
      if (mats.length > 0 && form.materiaId === 0) {
        setForm(prev => ({ ...prev, materiaId: mats[0].id }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventosAcademicosAPI.create(form);
      setModalOpen(false);
      setForm({ ...form, titulo: '', horasEstimadas: 2 });
      fetchData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (ev: EventoAcademico) => {
    const nuevoEstado = ev.estado === 'Completado' ? 'Pendiente' : 'Completado';
    try {
      await eventosAcademicosAPI.update(ev.id, { estado: nuevoEstado });
      fetchData();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const limite = new Date();
  limite.setDate(hoy.getDate() + 7);

  const proximosEventos = eventos
    .filter(ev => {
      const fecha = new Date(ev.fecha);
      return fecha >= hoy && fecha <= limite;
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return (
    <div className="space-y-8 pb-32">
      {/* 0. Header Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <StatCard title="Promedio" value={data.estadisticas.promedioGeneral.toFixed(2)} icon={GraduationCap} color="indigo" />
        <StatCard title="Aprobadas" value={`${data.estadisticas.materiasAprobadas}/${data.estadisticas.totalMaterias}`} icon={BookOpen} color="emerald" />
        <StatCard title="Pendientes" value={proximosEventos.filter(e => e.tipo === 'Tarea' && e.estado === 'Pendiente').length.toString()} icon={CheckSquare} color="amber" />
        <StatCard title="Nómina" value={data.estadisticas.materiasCursando.toString()} icon={Calendar} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Time Budget - THE Semaphore */}
          <section className="animate-fade-in">
            <TimeBudgetLarge horasEstimadas={data.horasEstimadasSemana} />
          </section>

          {/* 3. Consolidated Action List (Tasks & Exams) */}
          <section className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> Próximos 7 Días
              </h3>
            </div>

            <div className="space-y-3">
              {proximosEventos.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-[2rem]">
                  <p className="text-slate-400 font-bold">Todo al día. 🚀</p>
                </div>
              ) : (
                proximosEventos.map((ev) => (
                  <div 
                    key={ev.id}
                    className={`group flex items-center gap-4 p-5 rounded-3xl border transition-all duration-300 ${
                      ev.estado === 'Completado' 
                        ? 'bg-slate-50/50 border-slate-100 opacity-60' 
                        : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-premium'
                    }`}
                  >
                    <button 
                      onClick={() => toggleComplete(ev)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        ev.estado === 'Completado'
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-200 text-transparent hover:border-primary-400'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ev.materia.color }} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                          {ev.materia.nombre}
                        </span>
                      </div>
                      <h4 className={`font-bold text-slate-900 truncate ${ev.estado === 'Completado' ? 'line-through' : ''}`}>
                        {ev.titulo}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-[10px] font-black uppercase ${
                        ev.tipo === 'Parcial' ? 'text-red-500' : 'text-slate-500'
                      }`}>
                        {ev.tipo}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        {new Date(ev.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* 2. Next Class / Today's Schedule */}
          {data.proximaClase && (
            <section className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 animate-fade-in-up shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Próxima Clase</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-black text-slate-900 leading-tight">{data.proximaClase.materia}</p>
                  <p className="text-primary-600 font-black mt-1">{data.proximaClase.hora}</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200 pt-4 flex items-center gap-2">
                  <BookOpen className="w-3 h-3 text-primary-500" />
                  {data.proximaClase.aulaText || 'Aula virtual'}
                </p>
                <button 
                  onClick={() => navigate(`/materia/${data.proximaClase?.materiaId}`)}
                  className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  Ir a Materia
                </button>
              </div>
            </section>
          )}

          {/* Quick Stats Summary Widget */}
          <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-slate-200">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Resumen Académico</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-white/60">Progreso Total</span>
                  <span className="text-sm font-black text-white">{Math.round((data.estadisticas.materiasAprobadas / data.estadisticas.totalMaterias) * 100)}%</span>
               </div>
               <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full" 
                    style={{ width: `${(data.estadisticas.materiasAprobadas / data.estadisticas.totalMaterias) * 100}%` }} 
                  />
               </div>
               <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-3 bg-white/5 rounded-2xl">
                     <p className="text-[10px] font-bold text-white/40 uppercase">Cursando</p>
                     <p className="text-sm font-black">{data.estadisticas.materiasCursando}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl">
                     <p className="text-[10px] font-bold text-white/40 uppercase">Créditos</p>
                     <p className="text-sm font-black">---</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB - Global Quick Add */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 items-end z-50 group">
        <button 
          onClick={() => setBulkModalOpen(true)}
          className="w-12 h-12 bg-white text-slate-600 rounded-full shadow-premium flex items-center justify-center hover:scale-110 active:scale-90 transition-all border border-slate-100 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
          title="Carga Masiva"
        >
          <Zap className="w-5 h-5 text-amber-500" />
        </button>
        <button 
          onClick={() => setModalOpen(true)}
          className="w-16 h-16 bg-primary-600 text-white rounded-full shadow-premium flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <BulkTaskModal 
        isOpen={bulkModalOpen} 
        onClose={() => setBulkModalOpen(false)} 
        materias={materias} 
        onSuccess={fetchData} 
      />

      {/* Quick Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Acción Rápida">
        <form onSubmit={handleQuickAdd} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Materia</label>
            <div className="grid grid-cols-2 gap-2">
              {materias.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setForm({ ...form, materiaId: m.id })}
                  className={`flex items-center gap-2 p-4 rounded-2xl border transition-all text-left ${
                    form.materiaId === m.id 
                      ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-500/5' 
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className={`text-xs font-bold truncate ${form.materiaId === m.id ? 'text-primary-900' : 'text-slate-600'}`}>
                    {m.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <input 
            type="text" 
            required
            autoFocus
            placeholder="¿Qué tienes que hacer?"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            className="w-full px-6 py-5 bg-slate-50 border-none rounded-[1.5rem] text-lg font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary-500/10 outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tipo</label>
              <select 
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as any })}
                className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none appearance-none"
              >
                <option value="Tarea">Tarea</option>
                <option value="Parcial">Parcial</option>
                <option value="Lectura">Lectura</option>
                <option value="Trabajo Práctico">Trabajo Práctico</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estimación (h)</label>
              <input 
                type="number" 
                step="0.5"
                value={form.horasEstimadas}
                onChange={(e) => setForm({ ...form, horasEstimadas: parseFloat(e.target.value) })}
                className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            Guardar en el Calendario
          </button>
        </form>
      </Modal>
    </div>
  );
}

function TimeBudgetLarge({ horasEstimadas }: { horasEstimadas: number }) {
  const [fixedHours] = useState(() => {
    const saved = localStorage.getItem('timeBudget_fixedHours');
    return saved ? JSON.parse(saved) : { cursada: 20, suenoComida: 63, transporteOtros: 10 };
  });

  const horasOcupadas = Object.values(fixedHours).reduce((a: number, b: any) => a + Number(b), 0);
  const horasDisponibles = 168 - horasOcupadas;
  const porcentaje = Math.min((horasEstimadas / horasDisponibles) * 100, 100);
  
  let color = 'bg-green-500';
  let textColor = 'text-green-600';
  let label = 'Viable';
  let sub = '¡Tienes tiempo suficiente! Sigue así.';
  
  if (porcentaje > 90) {
    color = 'bg-red-500';
    textColor = 'text-red-600';
    label = 'Sobrecarga';
    sub = 'Demasiadas tareas para tu tiempo libre.';
  } else if (porcentaje > 70) {
    color = 'bg-amber-500';
    textColor = 'text-amber-600';
    label = 'Ajustado';
    sub = 'Cuidado, te queda poco margen.';
  }

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 shadow-premium relative overflow-hidden group">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle cx="64" cy="64" r="58" className="stroke-slate-100 fill-none" strokeWidth="12" />
            <circle 
              cx="64" cy="64" r="58" 
              className={`${color} fill-none transition-all duration-1000 ease-out`} 
              strokeWidth="12" 
              strokeDasharray={364.4} 
              strokeDashoffset={364.4 - (364.4 * porcentaje) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900">{horasEstimadas}h</span>
            <span className="text-[10px] font-black text-slate-400">ESTUDIO</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Viabilidad Semanal</h2>
            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full bg-slate-50 ${textColor}`}>
              {label}
            </span>
          </div>
          <p className="text-slate-500 font-bold">{sub}</p>
          <p className="text-xs font-bold text-slate-400">
            {horasDisponibles}h de tiempo libre disponible esta semana.
          </p>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Zap className="w-32 h-32" />
      </div>
    </div>
  );
}
