import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { asistenciasAPI, materiasAPI } from '../api';
import { AsistenciaResumen, AsistenciaDetalle, Materia } from '../types';
import Modal from '../components/Modal';

export default function Asistencia() {
  const [resumen, setResumen] = useState<AsistenciaResumen[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMateria, setSelectedMateria] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<AsistenciaDetalle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ materiaId: 0, fecha: '', presente: true });

  const fetchData = async () => {
    const [r, m] = await Promise.all([asistenciasAPI.getResumen(), materiasAPI.getAll()]);
    setResumen(r);
    setMaterias(m.filter((mat: Materia) => mat.estado === 'Cursando'));
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const selectMateria = async (materiaId: number) => {
    setSelectedMateria(materiaId);
    const d = await asistenciasAPI.getByMateria(materiaId);
    setDetalle(d);
  };

  const registrarAsistencia = async (e: React.FormEvent) => {
    e.preventDefault();
    await asistenciasAPI.create(form);
    setModalOpen(false);
    fetchData();
    if (selectedMateria) selectMateria(selectedMateria);
  };

  const eliminarAsistencia = async (id: number) => {
    await asistenciasAPI.delete(id);
    fetchData();
    if (selectedMateria) selectMateria(selectedMateria);
  };

  const togglePresente = async (id: number, presente: boolean) => {
    await asistenciasAPI.update(id, { presente: !presente });
    fetchData();
    if (selectedMateria) selectMateria(selectedMateria);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-500">Registro de asistencia por materia</p>
        <button onClick={() => {
          setForm({ materiaId: materias[0]?.id || 0, fecha: new Date().toISOString().slice(0, 10), presente: true });
          setModalOpen(true);
        }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Registrar Asistencia
        </button>
      </div>

      {/* Resumen por materia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumen.map((r) => (
          <div key={r.materiaId}
            onClick={() => selectMateria(r.materiaId)}
            className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all hover:shadow-md ${
              selectedMateria === r.materiaId ? 'ring-2 ring-primary-400 border-primary-200' : 'border-gray-100'
            } ${r.alerta ? 'ring-1 ring-red-200' : ''}`}>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                <h3 className="font-bold text-gray-900">{r.materia}</h3>
              </div>
              {r.alerta && (
                <div className="flex items-center gap-1 text-red-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Bajo 75%</span>
                </div>
              )}
            </div>

            {/* Barra de porcentaje */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Asistencia</span>
                <span className={`text-lg font-bold ${r.alerta ? 'text-red-600' : 'text-primary-600'}`}>
                  {r.porcentaje}%
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    r.alerta ? 'bg-red-500' : r.porcentaje >= 90 ? 'bg-green-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${r.porcentaje}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                {r.presentes} presentes
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                {r.ausentes} ausentes
              </span>
              <span className="text-gray-400">({r.total} clases)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detalle de materia seleccionada */}
      {detalle && selectedMateria && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">
              Registro detallado - {resumen.find((r) => r.materiaId === selectedMateria)?.materia}
            </h3>
          </div>
          <div className="p-4">
            {detalle.asistencias.length === 0 ? (
              <p className="text-center text-gray-400 py-6">No hay registros de asistencia</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {detalle.asistencias.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <button onClick={() => togglePresente(a.id, a.presente)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          a.presente ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-500 hover:bg-red-200'
                        }`}>
                        {a.presente ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(a.fecha).toLocaleDateString('es-AR', {
                            weekday: 'long', day: 'numeric', month: 'long',
                          })}
                        </p>
                        <p className={`text-xs ${a.presente ? 'text-green-600' : 'text-red-500'}`}>
                          {a.presente ? 'Presente' : 'Ausente'}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => eliminarAsistencia(a.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal registrar asistencia */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Asistencia">
        <form onSubmit={registrarAsistencia} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
            <select value={form.materiaId} onChange={(e) => setForm({ ...form, materiaId: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              {materias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de la clase</label>
            <input type="date" required value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">¿Asistió?</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setForm({ ...form, presente: true })}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                  form.presente ? 'bg-green-100 text-green-700 ring-2 ring-green-300' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                ✅ Presente
              </button>
              <button type="button" onClick={() => setForm({ ...form, presente: false })}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                  !form.presente ? 'bg-red-100 text-red-700 ring-2 ring-red-300' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                ❌ Ausente
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 font-medium rounded-xl hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm">
              Registrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
