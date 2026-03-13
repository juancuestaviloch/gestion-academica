import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { examenesAPI, materiasAPI } from '../api';
import { Examen, Materia } from '../types';
import Modal from '../components/Modal';

const TIPOS = ['Parcial', 'Final', 'Recuperatorio'] as const;

export default function Examenes() {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Examen | null>(null);
  const [form, setForm] = useState({
    materiaId: 0, fecha: '', tipo: 'Parcial' as string, aula: '', notas: '',
  });

  const fetchData = async () => {
    const [ex, mat] = await Promise.all([examenesAPI.getAll(), materiasAPI.getAll()]);
    setExamenes(ex);
    setMaterias(mat);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ materiaId: materias[0]?.id || 0, fecha: '', tipo: 'Parcial', aula: '', notas: '' });
    setEditando(null);
  };

  const openCreate = () => {
    resetForm();
    setForm((f) => ({ ...f, materiaId: materias[0]?.id || 0 }));
    setModalOpen(true);
  };

  const openEdit = (ex: Examen) => {
    setEditando(ex);
    const fechaLocal = new Date(ex.fecha);
    setForm({
      materiaId: ex.materiaId,
      fecha: fechaLocal.toISOString().slice(0, 16),
      tipo: ex.tipo,
      aula: ex.aula || '',
      notas: ex.notas || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editando) {
      await examenesAPI.update(editando.id, form);
    } else {
      await examenesAPI.create(form);
    }
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este examen?')) return;
    await examenesAPI.delete(id);
    fetchData();
  };

  function diasHasta(fecha: string) {
    const diff = Math.ceil((new Date(fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Pasado';
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';
    return `En ${diff} días`;
  }

  function esProximo(fecha: string) {
    const diff = Math.ceil((new Date(fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const tipoColors: Record<string, string> = {
    Parcial: 'bg-blue-100 text-blue-700',
    Final: 'bg-red-100 text-red-700',
    Recuperatorio: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-500">{examenes.length} exámenes registrados</p>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo Examen
        </button>
      </div>

      {/* Alerta para exámenes próximos */}
      {examenes.some((e) => esProximo(e.fecha)) && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            Tenés exámenes en los próximos 7 días. ¡Revisá tu preparación!
          </p>
        </div>
      )}

      <div className="space-y-3">
        {examenes.map((examen) => {
          const proximo = esProximo(examen.fecha);
          const pasado = new Date(examen.fecha) < new Date();
          return (
            <div key={examen.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                proximo ? 'border-amber-200 ring-1 ring-amber-100' : pasado ? 'border-gray-100 opacity-60' : 'border-gray-100'
              }`}>
              <div className="flex items-center">
                <div className="w-1.5 h-full min-h-[80px] shrink-0" style={{ backgroundColor: examen.materia.color }} />
                <div className="flex-1 p-4 flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{examen.materia.nombre}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tipoColors[examen.tipo]}`}>
                        {examen.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(examen.fecha).toLocaleDateString('es-AR', {
                        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                    {examen.aula && <p className="text-xs text-gray-400 mt-0.5">📍 {examen.aula}</p>}
                    {examen.notas && <p className="text-xs text-gray-400 mt-0.5">📝 {examen.notas}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${
                      proximo ? 'text-amber-600' : pasado ? 'text-gray-400' : 'text-primary-600'
                    }`}>
                      {diasHasta(examen.fecha)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(examen)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(examen.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editando ? 'Editar Examen' : 'Nuevo Examen'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
            <select value={form.materiaId} onChange={(e) => setForm({ ...form, materiaId: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              {materias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora</label>
              <input type="datetime-local" required value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aula / Modalidad</label>
            <input type="text" value={form.aula}
              onChange={(e) => setForm({ ...form, aula: e.target.value })}
              placeholder="Ej: Aula 301, Virtual"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observaciones</label>
            <textarea value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); resetForm(); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm">
              {editando ? 'Guardar' : 'Crear Examen'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
