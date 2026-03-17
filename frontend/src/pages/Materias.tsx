import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, BookMarked, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { materiasAPI } from '../api';
import { Materia } from '../types';
import Modal from '../components/Modal';

const COLORS = [
  '#4F46E5', '#059669', '#DC2626', '#D97706', '#7C3AED',
  '#0891B2', '#DB2777', '#65A30D', '#EA580C', '#4338CA',
];

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const ESTADOS = ['Cursando', 'Aprobada', 'Pendiente'] as const;
const FILTROS = ['Todas', 'Cursando', 'Pendiente', 'Aprobada'] as const;

export default function Materias() {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Materia | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('Todas');
  const [form, setForm] = useState({
    nombre: '',
    profesor: '',
    estado: 'Cursando' as string,
    color: '#4F46E5',
    anio: 1,
    cuatrimestre: '1er Cuatrimestre',
    horarios: [] as { diaSemana: string; horaInicio: string; horaFin: string; aula: string; tipo: string }[],
    bibliografia: [] as { nombre: string; url: string }[],
  });

  const fetchMaterias = async () => {
    const data = await materiasAPI.getAll();
    setMaterias(data);
    setLoading(false);
  };

  useEffect(() => { fetchMaterias(); }, []);

  const resetForm = () => {
    setForm({
      nombre: '', profesor: '', estado: 'Cursando', color: '#4F46E5',
      anio: 1, cuatrimestre: '1er Cuatrimestre',
      horarios: [], bibliografia: [],
    });
    setEditando(null);
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };

  const openEdit = (m: Materia) => {
    setEditando(m);
    setForm({
      nombre: m.nombre,
      profesor: m.profesor,
      estado: m.estado,
      color: m.color,
      anio: m.anio,
      cuatrimestre: m.cuatrimestre,
      horarios: m.horarios.map((h) => ({
        diaSemana: h.diaSemana,
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        aula: h.aula || '',
        tipo: h.tipo || 'Teoría'
      })),
      bibliografia: m.bibliografia.map((b) => ({ nombre: b.nombre, url: b.url || '' })),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editando) {
      await materiasAPI.update(editando.id, form);
    } else {
      await materiasAPI.create(form);
    }
    setModalOpen(false);
    resetForm();
    fetchMaterias();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta materia y todos sus datos asociados?')) return;
    await materiasAPI.delete(id);
    fetchMaterias();
  };

  const addHorario = () => {
    setForm({
      ...form,
      horarios: [...form.horarios, { diaSemana: 'Lunes', horaInicio: '08:00', horaFin: '10:00', aula: '', tipo: 'Teoría' }]
    });
  };

  const removeHorario = (i: number) => {
    setForm({ ...form, horarios: form.horarios.filter((_, idx) => idx !== i) });
  };

  const updateHorario = (i: number, field: string, value: string) => {
    const horarios = [...form.horarios];
    (horarios[i] as any)[field] = value;
    setForm({ ...form, horarios });
  };

  const addBibliografia = () => {
    setForm({ ...form, bibliografia: [...form.bibliografia, { nombre: '', url: '' }] });
  };

  const removeBibliografia = (i: number) => {
    setForm({ ...form, bibliografia: form.bibliografia.filter((_, idx) => idx !== i) });
  };

  const updateBibliografia = (i: number, field: string, value: string) => {
    const bibliografia = [...form.bibliografia];
    (bibliografia[i] as any)[field] = value;
    setForm({ ...form, bibliografia });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const estadoColors: Record<string, string> = {
    Cursando: 'bg-blue-100 text-blue-700',
    Aprobada: 'bg-green-100 text-green-700',
    Pendiente: 'bg-amber-100 text-amber-700',
  };

  const filteredMaterias = filtroEstado === 'Todas'
    ? materias
    : materias.filter(m => m.estado === filtroEstado);

  // Group by anio + cuatrimestre
  const grouped = filteredMaterias.reduce((acc, m) => {
    const key = `${m.anio}|${m.cuatrimestre}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {} as Record<string, Materia[]>);

  // Sort groups by anio asc, cuatrimestre asc
  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
    const [aYear, aCuat] = a.split('|');
    const [bYear, bCuat] = b.split('|');
    if (aYear !== bYear) return Number(aYear) - Number(bYear);
    return aCuat.localeCompare(bCuat);
  });

  const cursandoCount = materias.filter(m => m.estado === 'Cursando').length;
  const pendienteCount = materias.filter(m => m.estado === 'Pendiente').length;
  const aprobadaCount = materias.filter(m => m.estado === 'Aprobada').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-50 text-blue-600"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> {cursandoCount} Cursando</span>
            <span className="flex items-center gap-2 px-2 py-1 rounded-lg bg-amber-50 text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" /> {pendienteCount} Pendientes</span>
            <span className="flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> {aprobadaCount} Aprobadas</span>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nueva Materia
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap bg-slate-100 p-1 rounded-2xl w-fit">
        {FILTROS.map(f => (
          <button
            key={f}
            onClick={() => setFiltroEstado(f)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              filtroEstado === f
                ? 'bg-white text-slate-900 shadow-premium'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grouped Materias */}
      {sortedGroups.map(([key, groupMaterias]) => {
        const [anio, cuatrimestre] = key.split('|');
        return (
          <div key={key} className="space-y-4 pt-4 animate-fade-in">
            <div className="flex items-center gap-3 px-1">
              <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 tracking-tight">
                  {anio}° Año — <span className="text-primary-600">{cuatrimestre}</span>
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  {groupMaterias.length} materia{groupMaterias.length > 1 ? 's' : ''} registradas
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupMaterias.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/materia/${m.id}`)}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-premium overflow-hidden group hover:-translate-y-1.5 hover:shadow-premium-hover transition-all duration-500 cursor-pointer flex flex-col"
                >
                  <div className="h-2 w-full" style={{ backgroundColor: m.color }} />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-primary-600 transition-colors truncate">{m.nombre}</h3>
                        <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-slate-200 rounded-full" /> {m.profesor}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${estadoColors[m.estado]}`}>
                        {m.estado}
                      </span>
                    </div>

                    {/* Horarios */}
                    {m.horarios.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {m.horarios.map((h, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 group-hover:border-primary-100 transition-colors"
                          >
                            <Clock className="w-3 h-3 text-slate-400" />
                            {h.diaSemana.substring(0, 3)} {h.horaInicio}
                            {h.aula && <span className="text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded ml-1">📍{h.aula}</span>}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Expandir bibliografía */}
                    {m.bibliografia.length > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === m.id ? null : m.id); }}
                        className="flex items-center gap-2 text-[10px] text-primary-600 hover:text-primary-800 font-bold uppercase tracking-widest mb-4 bg-primary-50 w-fit px-3 py-1.5 rounded-lg transition-all"
                      >
                        <BookMarked className="w-3 h-3" />
                        {m.bibliografia.length} RECURSOS
                        {expandedId === m.id ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                      </button>
                    )}

                    {expandedId === m.id && (
                      <div className="space-y-1 mb-3 animate-fade-in py-1">
                        {m.bibliografia.map((b, i) => (
                          <div key={i} className="text-[10px] text-gray-600 pl-4 border-l border-gray-100 ml-1">
                            {b.url ? (
                              <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-800 truncate block">
                                {b.nombre}
                              </a>
                            ) : (
                              <span className="truncate block">{b.nombre}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-50 mt-auto">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(m); }}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}


      {/* Modal crear/editar */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editando ? 'Editar Materia' : 'Nueva Materia'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text" required value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Ej: Algoritmos y Estructuras de Datos"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
              <input
                type="text" required value={form.profesor}
                onChange={(e) => setForm({ ...form, profesor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Ej: Dr. Carlos Méndez"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <select
                value={form.anio}
                onChange={(e) => setForm({ ...form, anio: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}° Año</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuatrimestre</label>
              <select
                value={form.cuatrimestre}
                onChange={(e) => setForm({ ...form, cuatrimestre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="1er Cuatrimestre">1er Cuatrimestre</option>
                <option value="2do Cuatrimestre">2do Cuatrimestre</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                    className={`w-8 h-8 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Horarios</label>
              <button type="button" onClick={addHorario} className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                + Agregar horario
              </button>
            </div>
            {form.horarios.map((h, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <select value={h.diaSemana} onChange={(e) => updateHorario(i, 'diaSemana', e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500">
                  {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="time" value={h.horaInicio} onChange={(e) => updateHorario(i, 'horaInicio', e.target.value)}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                <span className="text-gray-400 text-sm">a</span>
                <input type="time" value={h.horaFin} onChange={(e) => updateHorario(i, 'horaFin', e.target.value)}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 w-24" />
                <input type="text" value={h.aula} onChange={(e) => updateHorario(i, 'aula', e.target.value)}
                  placeholder="Aula"
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 w-24" />
                <select value={h.tipo} onChange={(e) => updateHorario(i, 'tipo', e.target.value)}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="Teoría">Teoría</option>
                  <option value="Práctica">Práctica</option>
                  <option value="Teórico-Práctico">Teórico-Práctico</option>
                </select>
                <button type="button" onClick={() => removeHorario(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Bibliografía */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Bibliografía</label>
              <button type="button" onClick={addBibliografia} className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                + Agregar recurso
              </button>
            </div>
            {form.bibliografia.map((b, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input type="text" value={b.nombre} onChange={(e) => updateBibliografia(i, 'nombre', e.target.value)}
                  placeholder="Nombre del recurso"
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                <input type="url" value={b.url} onChange={(e) => updateBibliografia(i, 'url', e.target.value)}
                  placeholder="URL (opcional)"
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                <button type="button" onClick={() => removeBibliografia(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => { setModalOpen(false); resetForm(); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
              {editando ? 'Guardar Cambios' : 'Crear Materia'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
