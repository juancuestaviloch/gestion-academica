import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Target, TrendingUp, BookOpen, CheckSquare } from 'lucide-react';
import { metasAPI, dashboardAPI } from '../api';
import { Meta, DashboardData } from '../types';
import Modal from '../components/Modal';

export default function Metas() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [stats, setStats] = useState<DashboardData['estadisticas'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Meta | null>(null);
  const [form, setForm] = useState({ titulo: '', descripcion: '', objetivo: 1, progreso: 0, cuatrimestre: '1C 2026' });

  const fetchData = async () => {
    const [m, d] = await Promise.all([metasAPI.getAll(), dashboardAPI.get()]);
    setMetas(m); setStats(d.estadisticas); setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm({ titulo: '', descripcion: '', objetivo: 1, progreso: 0, cuatrimestre: '1C 2026' }); setEditando(null); };

  const openCreate = () => { resetForm(); setModalOpen(true); };

  const openEdit = (m: Meta) => { setEditando(m); setForm({ titulo: m.titulo, descripcion: m.descripcion || '', objetivo: m.objetivo, progreso: m.progreso, cuatrimestre: m.cuatrimestre }); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (editando) await metasAPI.update(editando.id, form); else await metasAPI.create(form); setModalOpen(false); fetchData(); };

  const handleDelete = async (id: number) => { if (!confirm('¿Eliminar esta meta?')) return; await metasAPI.delete(id); fetchData(); };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Stats generales */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white"><BookOpen className="w-5 h-5" /></div><p className="text-sm text-gray-500 font-medium">Materias Aprobadas</p></div>
            <div className="flex items-end gap-2"><span className="text-3xl font-bold text-gray-900">{stats.materiasAprobadas}</span><span className="text-gray-400 text-sm mb-1">/ {stats.totalMaterias}</span></div>
            <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden"><div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${stats.totalMaterias > 0 ? (stats.materiasAprobadas / stats.totalMaterias) * 100 : 0}%` }} /></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center text-white"><CheckSquare className="w-5 h-5" /></div><p className="text-sm text-gray-500 font-medium">Tareas Completadas</p></div>
            <div className="flex items-end gap-2"><span className="text-3xl font-bold text-gray-900">{stats.tareasEntregadas}</span><span className="text-gray-400 text-sm mb-1">/ {stats.totalTareas}</span></div>
            <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden"><div className="h-full bg-success rounded-full transition-all duration-500" style={{ width: `${stats.totalTareas > 0 ? (stats.tareasEntregadas / stats.totalTareas) * 100 : 0}%` }} /></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3"><div className={`w-10 h-10 rounded-xl ${stats.asistenciaPromedio < 75 ? 'bg-danger' : 'bg-primary-500'} flex items-center justify-center text-white`}><TrendingUp className="w-5 h-5" /></div><p className="text-sm text-gray-500 font-medium">Asistencia Global</p></div>
            <div className="flex items-end gap-2"><span className="text-3xl font-bold text-gray-900">{stats.asistenciaPromedio}%</span></div>
            <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${stats.asistenciaPromedio < 75 ? 'bg-danger' : 'bg-primary-500'}`} style={{ width: `${stats.asistenciaPromedio}%` }} /></div>
          </div>
        </div>
      )}

      {/* Metas */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Metas del Cuatrimestre</h3>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 shadow-sm"><Plus className="w-4 h-4" /> Nueva Meta</button>
      </div>

      <div className="space-y-4">
        {metas.map(meta => {
          const pct = meta.objetivo > 0 ? Math.min(Math.round((meta.progreso / meta.objetivo) * 100), 100) : 0;
          const completed = pct >= 100;
          return (
            <div key={meta.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md ${completed ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completed ? 'bg-green-500 text-white' : 'bg-primary-100 text-primary-600'}`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{meta.titulo}</h4>
                    {meta.descripcion && <p className="text-sm text-gray-500 mt-0.5">{meta.descripcion}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400 px-2 py-1 bg-gray-50 rounded-lg">{meta.cuatrimestre}</span>
                  <button onClick={() => openEdit(meta)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(meta.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${completed ? 'bg-green-500' : pct >= 50 ? 'bg-primary-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className={`text-sm font-bold min-w-[60px] text-right ${completed ? 'text-green-600' : 'text-gray-700'}`}>
                  {meta.progreso}/{meta.objetivo} ({pct}%)
                </span>
              </div>
            </div>
          );
        })}
        {metas.length === 0 && <div className="text-center py-12 text-gray-400"><Target className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No hay metas definidas</p></div>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editando ? 'Editar Meta' : 'Nueva Meta'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Título</label><input type="text" required value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Aprobar 4 materias" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label><textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none" rows={2} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label><input type="number" min={1} required value={form.objetivo} onChange={e => setForm({ ...form, objetivo: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Progreso</label><input type="number" min={0} value={form.progreso} onChange={e => setForm({ ...form, progreso: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Cuatrimestre</label><input type="text" required value={form.cuatrimestre} onChange={e => setForm({ ...form, cuatrimestre: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); resetForm(); }} className="px-4 py-2 text-sm text-gray-600 font-medium rounded-xl hover:bg-gray-100">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm">{editando ? 'Guardar' : 'Crear'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
