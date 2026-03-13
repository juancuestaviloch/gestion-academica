import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Filter, CheckSquare } from 'lucide-react';
import { tareasAPI, materiasAPI } from '../api';
import { Tarea, Materia } from '../types';
import Modal from '../components/Modal';

const ESTADOS = ['Pendiente', 'En progreso', 'Entregada'] as const;

export default function Tareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Tarea | null>(null);
  const [filtroMateria, setFiltroMateria] = useState<number | ''>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [form, setForm] = useState({
    materiaId: 0, titulo: '', descripcion: '', fechaLimite: '', estado: 'Pendiente' as string,
  });

  const fetchData = async () => {
    const [t, m] = await Promise.all([
      tareasAPI.getAll({
        materiaId: filtroMateria ? Number(filtroMateria) : undefined,
        estado: filtroEstado || undefined,
      }),
      materiasAPI.getAll(),
    ]);
    setTareas(t);
    setMaterias(m);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filtroMateria, filtroEstado]);

  const resetForm = () => {
    setForm({ materiaId: materias[0]?.id || 0, titulo: '', descripcion: '', fechaLimite: '', estado: 'Pendiente' });
    setEditando(null);
  };

  const openCreate = () => {
    resetForm();
    setForm((f) => ({ ...f, materiaId: materias[0]?.id || 0 }));
    setModalOpen(true);
  };

  const openEdit = (t: Tarea) => {
    setEditando(t);
    setForm({
      materiaId: t.materiaId,
      titulo: t.titulo,
      descripcion: t.descripcion || '',
      fechaLimite: new Date(t.fechaLimite).toISOString().slice(0, 16),
      estado: t.estado,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editando) {
      await tareasAPI.update(editando.id, form);
    } else {
      await tareasAPI.create(form);
    }
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    await tareasAPI.delete(id);
    fetchData();
  };

  const cambiarEstado = async (tarea: Tarea, nuevoEstado: string) => {
    await tareasAPI.update(tarea.id, { estado: nuevoEstado });
    fetchData();
  };

  function diasHasta(fecha: string) {
    const diff = Math.ceil((new Date(fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Vencida';
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';
    return `${diff} días`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const estadoColors: Record<string, string> = {
    'Pendiente': 'bg-amber-100 text-amber-700 border-amber-200',
    'En progreso': 'bg-blue-100 text-blue-700 border-blue-200',
    'Entregada': 'bg-green-100 text-green-700 border-green-200',
  };

  const estadoIcons: Record<string, string> = {
    'Pendiente': '⏳',
    'En progreso': '🔄',
    'Entregada': '✅',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-gray-500">{tareas.length} tareas</p>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Nueva Tarea
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        <select value={filtroMateria}
          onChange={(e) => setFiltroMateria(e.target.value ? parseInt(e.target.value) : '')}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Todas las materias</option>
          {materias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        <select value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        {(filtroMateria || filtroEstado) && (
          <button onClick={() => { setFiltroMateria(''); setFiltroEstado(''); }}
            className="text-xs text-primary-600 hover:text-primary-800 font-medium">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista de tareas */}
      <div className="space-y-3">
        {tareas.map((tarea) => {
          const diasRestantes = Math.ceil((new Date(tarea.fechaLimite).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const vencida = diasRestantes < 0 && tarea.estado !== 'Entregada';
          const urgente = diasRestantes >= 0 && diasRestantes <= 2 && tarea.estado !== 'Entregada';

          return (
            <div key={tarea.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                vencida ? 'border-red-200' : urgente ? 'border-amber-200' : 'border-gray-100'
              }`}>
              <div className="flex items-center">
                <div className="w-1.5 shrink-0 min-h-[72px]" style={{ backgroundColor: tarea.materia.color }} />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={`font-bold text-gray-900 ${tarea.estado === 'Entregada' ? 'line-through opacity-60' : ''}`}>
                          {tarea.titulo}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${estadoColors[tarea.estado]}`}>
                          {estadoIcons[tarea.estado]} {tarea.estado}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{tarea.materia.nombre}</p>
                      {tarea.descripcion && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{tarea.descripcion}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-bold ${
                        vencida ? 'text-red-600' : urgente ? 'text-amber-600' : tarea.estado === 'Entregada' ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {tarea.estado === 'Entregada' ? '✓ Entregada' : diasHasta(tarea.fechaLimite)}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(tarea.fechaLimite).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    {/* Cambio rápido de estado */}
                    <div className="flex gap-1">
                      {ESTADOS.map((e) => (
                        <button key={e} onClick={() => cambiarEstado(tarea, e)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                            tarea.estado === e
                              ? estadoColors[e]
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}>
                          {e}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(tarea)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(tarea.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {tareas.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay tareas que coincidan con los filtros</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editando ? 'Editar Tarea' : 'Nueva Tarea'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" required value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
              <select value={form.materiaId} onChange={(e) => setForm({ ...form, materiaId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                {materias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
              <input type="datetime-local" required value={form.fechaLimite}
                onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); resetForm(); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm">
              {editando ? 'Guardar' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


