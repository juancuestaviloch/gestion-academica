import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Columns, 
  List, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  MoreVertical,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit2,
  Settings,
  Zap
} from 'lucide-react';
import { eventosAcademicosAPI, materiasAPI } from '../api';
import { EventoAcademico, Materia } from '../types';
import Modal from '../components/Modal';

const TIPOS = ['Tarea', 'Lectura', 'Trabajo Práctico', 'Parcial'] as const;
const ESTADOS = ['Pendiente', 'En progreso', 'Completado'] as const;

export default function GestorTareas() {
  const [eventos, setEventos] = useState<EventoAcademico[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMateria, setSelectedMateria] = useState<number | 'all'>('all');
  
  // Time Budget State
  const [fixedHours, setFixedHours] = useState({
    cursada: 20,
    suenoComida: 63,
    transporteOtros: 10
  });
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<EventoAcademico | null>(null);
  const [form, setForm] = useState({
    materiaId: 0,
    titulo: '',
    tipo: 'Tarea' as typeof TIPOS[number],
    fecha: '',
    estado: 'Pendiente' as typeof ESTADOS[number],
    horasEstimadas: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [evs, mats] = await Promise.all([
        eventosAcademicosAPI.getAll(),
        materiasAPI.getAll()
      ]);
      setEventos(evs);
      setMaterias(mats);
      if (mats.length > 0 && form.materiaId === 0) {
        setForm(prev => ({ ...prev, materiaId: mats[0].id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const saved = localStorage.getItem('timeBudget_fixedHours');
    if (saved) setFixedHours(JSON.parse(saved));
  }, []);

  const saveFixedHours = (newHours: typeof fixedHours) => {
    setFixedHours(newHours);
    localStorage.setItem('timeBudget_fixedHours', JSON.stringify(newHours));
    setShowBudgetSettings(false);
  };

  const sortedEventos = useMemo(() => {
    let filtered = eventos.filter(ev => 
      ev.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedMateria === 'all' || ev.materiaId === selectedMateria)
    );
    return filtered;
  }, [eventos, searchTerm, selectedMateria]);

  const proximos7Dias = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date();
    limite.setDate(hoy.getDate() + 7);
    limite.setHours(23, 59, 59, 999);
    
    return eventos
      .filter(ev => {
        const fecha = new Date(ev.fecha);
        return fecha >= hoy && fecha <= limite && ev.estado !== 'Completado';
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [eventos]);

  const statsBudget = useMemo(() => {
    const horasOcupadas = Object.values(fixedHours).reduce((a, b) => a + b, 0);
    const horasDisponibles = 168 - horasOcupadas;
    
    // Normalizar fechas para comparación (Inicio de hoy -> Fin de 7 días)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const proximaSemana = new Date();
    proximaSemana.setDate(hoy.getDate() + 7);
    proximaSemana.setHours(23, 59, 59, 999);
    
    const eventosFiltrados = eventos.filter(ev => {
      const fecha = new Date(ev.fecha);
      const enRango = fecha >= hoy && fecha <= proximaSemana;
      const pendiente = ev.estado !== 'Completado';
      return enRango && pendiente;
    });

    const horasEstimadasSemana = eventosFiltrados
      .reduce((sum, ev) => sum + (Number(ev.horasEstimadas) || 0), 0);
    
    console.log('DEBUG Budget Calculation:', {
      totalEventos: eventos.length,
      eventosFiltradosCount: eventosFiltrados.length,
      horasEstimadasSemana,
      horasDisponibles,
      rango: { hoy: hoy.toISOString(), proximaSemana: proximaSemana.toISOString() }
    });

    const porcentaje = Math.min((horasEstimadasSemana / horasDisponibles) * 100, 100);
    let color = 'bg-green-500';
    let textColor = 'text-green-600';
    let label = 'Viable';
    let sublabel = 'Tenés tiempo suficiente para estudiar.';
    
    if (porcentaje > 90) {
      color = 'bg-red-500';
      textColor = 'text-red-600';
      label = 'Sobrecarga';
      sublabel = '¡Alerta! No tenés horas suficientes para todo.';
    } else if (porcentaje > 70) {
      color = 'bg-amber-500';
      textColor = 'text-amber-600';
      label = 'Ajustado';
      sublabel = 'Estás al límite de tu capacidad.';
    }
    
    return { horasDisponibles, horasEstimadasSemana, porcentaje, color, textColor, label, sublabel };
  }, [eventos, fixedHours]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando) {
        await eventosAcademicosAPI.update(editando.id, form);
      } else {
        await eventosAcademicosAPI.create(form);
      }
      setModalOpen(false);
      setEditando(null);
      fetchData();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    try {
      await eventosAcademicosAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const updateEstado = async (ev: EventoAcademico, nuevoEstado: typeof ESTADOS[number]) => {
    try {
      await eventosAcademicosAPI.update(ev.id, { estado: nuevoEstado });
      setEventos(prev => prev.map(e => e.id === ev.id ? { ...e, estado: nuevoEstado } : e));
    } catch (error) {
      console.error('Error updating state:', error);
    }
  };

  const openEdit = (ev: EventoAcademico) => {
    setEditando(ev);
    setForm({
      materiaId: ev.materiaId,
      titulo: ev.titulo,
      tipo: ev.tipo,
      fecha: new Date(ev.fecha).toISOString().slice(0, 16),
      estado: ev.estado,
      horasEstimadas: ev.horasEstimadas || 0
    });
    setModalOpen(true);
  };

  const getUrgencyColor = (fechaStr: string) => {
    const diff = new Date(fechaStr).getTime() - new Date().getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days < 1) return 'text-red-600 bg-red-50 border-red-100';
    if (days < 3) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-blue-600 bg-blue-50 border-blue-100';
  };

  const CardEvento = ({ ev }: { ev: EventoAcademico }) => (
    <div className={`p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group ${ev.tipo === 'Parcial' ? 'ring-1 ring-red-200 bg-red-50/30' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ev.materia.color }} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{ev.materia.nombre}</span>
          </div>
          <h4 className={`font-bold text-gray-900 leading-tight mb-1 ${ev.estado === 'Completado' ? 'line-through opacity-50' : ''}`}>
            {ev.titulo}
          </h4>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              ev.tipo === 'Parcial' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {ev.tipo}
            </span>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-medium">
                {new Date(ev.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
              </span>
            </div>
            {ev.horasEstimadas > 0 && (
              <div className="flex items-center gap-1 text-primary-500">
                <Zap className="w-3 h-3" />
                <span className="text-[10px] font-bold">{ev.horasEstimadas}h</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => openEdit(ev)} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-primary-600">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDelete(ev.id)} className="p-1 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-600">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {ev.estado !== 'Completado' && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
          {ev.estado === 'Pendiente' ? (
            <button 
              onClick={() => updateEstado(ev, 'En progreso')}
              className="flex-1 text-[10px] font-bold py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Iniciar
            </button>
          ) : (
            <button 
              onClick={() => updateEstado(ev, 'Completado')}
              className="flex-1 text-[10px] font-bold py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              Finalizar
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (loading && eventos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-100 rounded-full animate-spin" />
          <div className="absolute top-0 w-12 h-12 border-4 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Gestor de Tareas</h2>
          <p className="text-gray-500 font-medium">Visualiza y organiza tus obligaciones académicas.</p>
        </div>
        <button 
          onClick={() => { setEditando(null); setForm({ ...form, titulo: '', fecha: '', horasEstimadas: 0 }); setModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Crear Nuevo Evento
        </button>
      </div>

      <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-2xl ${statsBudget.color} text-white shadow-lg shadow-current/20`}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-black text-gray-900">Presupuesto de Tiempo</h3>
                <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-100 ${statsBudget.textColor}`}>
                  {statsBudget.label}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-medium">{statsBudget.sublabel}</p>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estudio Estimado: {statsBudget.horasEstimadasSemana}h</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disponible: {statsBudget.horasDisponibles}h</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${statsBudget.color} transition-all duration-1000 ease-out`}
                style={{ width: `${statsBudget.porcentaje}%` }}
              />
            </div>
          </div>

          <button 
            onClick={() => setShowBudgetSettings(true)}
            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </section>

      {proximos7Dias.length > 0 && (
        <section className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-black text-gray-900">Urgente (Próximos 7 días)</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
            {proximos7Dias.map(ev => (
              <div key={ev.id} className={`shrink-0 w-72 p-4 rounded-2xl border ${getUrgencyColor(ev.fecha)} shadow-sm relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-current opacity-5 rounded-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{ev.materia.nombre}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white/50 rounded-full border border-current/10">{ev.tipo}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 truncate mb-3">{ev.titulo}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 opacity-70" />
                      <span className="text-xs font-bold">
                        {new Date(ev.fecha).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <button 
                      onClick={() => updateEstado(ev, 'Completado')}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:scale-110 transition-transform text-green-600"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl flex-1 w-full md:w-auto">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por título..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={selectedMateria}
              onChange={(e) => setSelectedMateria(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="bg-transparent border-none outline-none text-xs font-bold text-gray-700"
            >
              <option value="all">Todas las materias</option>
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div className="p-1 bg-gray-50 rounded-xl flex gap-1">
            <button 
              onClick={() => setView('kanban')}
              className={`p-2 rounded-lg transition-all ${view === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Columns className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {ESTADOS.map(estado => (
            <div key={estado} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    estado === 'Pendiente' ? 'bg-gray-400' :
                    estado === 'En progreso' ? 'bg-primary-500' : 'bg-green-500'
                  }`} />
                  <h3 className="font-black text-gray-700 uppercase tracking-widest text-xs">{estado}</h3>
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {sortedEventos.filter(ev => ev.estado === estado).length}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 min-h-[300px] p-2 rounded-2xl bg-gray-50/50 border border-dashed border-gray-200">
                {sortedEventos
                  .filter(ev => ev.estado === estado)
                  .map(ev => <CardEvento key={ev.id} ev={ev} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Evento</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Materia</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {sortedEventos.map(ev => (
                <tr key={ev.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`font-bold text-gray-900 ${ev.estado === 'Completado' ? 'line-through opacity-50' : ''}`}>
                        {ev.titulo}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg w-fit mt-1 ${
                        ev.tipo === 'Parcial' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {ev.tipo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ev.materia.color }} />
                      <span className="text-xs font-bold text-gray-600">{ev.materia.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900">
                        {new Date(ev.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        {new Date(ev.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={ev.estado}
                      onChange={(e) => updateEstado(ev, e.target.value as any)}
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                        ev.estado === 'Pendiente' ? 'bg-gray-50 text-gray-500 border-gray-100' :
                        ev.estado === 'En progreso' ? 'bg-primary-50 text-primary-600 border-primary-100' :
                        'bg-green-50 text-green-600 border-green-100'
                      }`}
                    >
                      {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(ev)} className="p-2 hover:bg-primary-50 rounded-xl text-primary-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ev.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedEventos.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <List className="w-12 h-12 mb-4 opacity-10" />
              <p className="font-bold">No se encontraron eventos.</p>
            </div>
          )}
        </div>
      )}

      <Modal 
        isOpen={modalOpen} 
        onClose={() => { setModalOpen(false); setEditando(null); }} 
        title={editando ? 'Editar Evento' : 'Nuevo Evento Académico'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Materia</label>
            <div className="grid grid-cols-2 gap-2">
              {materias.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setForm({ ...form, materiaId: m.id })}
                  className={`flex items-center gap-2 p-3 rounded-2xl border transition-all text-left ${
                    form.materiaId === m.id 
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/10' 
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className={`text-xs font-bold leading-tight ${form.materiaId === m.id ? 'text-primary-900' : 'text-gray-600'}`}>
                    {m.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Título del Evento</label>
            <input 
              type="text" 
              required
              placeholder="Ej: Entrega TP 1, Parcial Módulo 2..."
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Tipo</label>
              <select 
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as any })}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Estado</label>
              <select 
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value as any })}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Fecha Límite</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="datetime-local" 
                  required
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Horas Estimadas</label>
              <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="number" 
                  step="0.5"
                  min="0"
                  required
                  value={form.horasEstimadas}
                  onChange={(e) => setForm({ ...form, horasEstimadas: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-[2] px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              {editando ? 'Guardar Cambios' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={showBudgetSettings} 
        onClose={() => setShowBudgetSettings(false)} 
        title="Configurar Horarios Fijos Semanales"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500 font-medium">Define cuántas horas dedicas a estas actividades por semana para calcular tu tiempo de estudio libre.</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Cursada Semanal</label>
                <span className="text-xs font-black text-gray-900">{fixedHours.cursada}h</span>
              </div>
              <input 
                type="range" min="0" max="60" 
                value={fixedHours.cursada} 
                onChange={(e) => setFixedHours({...fixedHours, cursada: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Sueño y Comidas</label>
                <span className="text-xs font-black text-gray-900">{fixedHours.suenoComida}h</span>
              </div>
              <input 
                type="range" min="0" max="120" 
                value={fixedHours.suenoComida} 
                onChange={(e) => setFixedHours({...fixedHours, suenoComida: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Transporte y Otros</label>
                <span className="text-xs font-black text-gray-900">{fixedHours.transporteOtros}h</span>
              </div>
              <input 
                type="range" min="0" max="40" 
                value={fixedHours.transporteOtros} 
                onChange={(e) => setFixedHours({...fixedHours, transporteOtros: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          </div>

          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
            <div className="flex justify-between items-center text-primary-900">
              <span className="text-xs font-black uppercase tracking-widest">Estudio Disponible:</span>
              <span className="text-lg font-black">{168 - (fixedHours.cursada + fixedHours.suenoComida + fixedHours.transporteOtros)}h</span>
            </div>
          </div>

          <button 
            onClick={() => saveFixedHours(fixedHours)}
            className="w-full px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            Guardar Configuración
          </button>
        </div>
      </Modal>
    </div>
  );
}
