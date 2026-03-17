import { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { 
  Wallet, ShoppingCart, Book, Plus, Trash2, ExternalLink, 
  CheckCircle2, Circle, AlertCircle, DollarSign
} from 'lucide-react';
import { recursosAPI, materiasAPI } from '../api';
import { RecursoAcademico, Materia } from '../types';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Finanzas() {
  const [recursos, setRecursos] = useState<RecursoAcademico[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<Partial<RecursoAcademico> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [res, st, mat] = await Promise.all([
        recursosAPI.getAll(),
        recursosAPI.getStats(),
        materiasAPI.getAll()
      ]);
      setRecursos(res);
      setStats(st);
      setMaterias(mat);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecurso?.materiaId || !editingRecurso?.nombre) return;

    try {
      if (editingRecurso.id) {
        await recursosAPI.update(editingRecurso.id, editingRecurso);
      } else {
        await recursosAPI.create(editingRecurso);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este recurso?')) return;
    try {
      await recursosAPI.delete(id);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAdquirido = async (recurso: RecursoAcademico) => {
    try {
      await recursosAPI.update(recurso.id, { ...recurso, adquirido: !recurso.adquirido });
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && !recursos.length) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  const pieData = stats ? Object.entries(stats.porCategoria).map(([name, value]) => ({ name, value })) : [];
  const barData = stats ? Object.entries(stats.porMateria).map(([name, value]) => ({ name: (name as string).substring(0, 10), value })) : [];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Presupuesto Académico</h1>
          <p className="text-slate-500 font-medium">Gestioná tus recursos, libros y gastos de carrera.</p>
        </div>
        <button 
          onClick={() => { setEditingRecurso({ tipo: 'LIBRO', costo: 0, adquirido: false, progreso: 0 }); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-primary-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nuevo Recurso
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Wallet className="w-6 h-6 text-emerald-600" />}
          label="Total Invertido"
          value={`$${stats?.totalInvertido?.toLocaleString() || 0}`}
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<ShoppingCart className="w-6 h-6 text-amber-600" />}
          label="Presupuesto Pendiente"
          value={`$${stats?.totalPendiente?.toLocaleString() || 0}`}
          color="bg-amber-50"
        />
        <StatCard 
          icon={<Book className="w-6 h-6 text-indigo-600" />}
          label="Recursos Totales"
          value={recursos.length}
          color="bg-indigo-50"
        />
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-premium border border-black/5">
          <h3 className="text-lg font-black text-slate-900 mb-6">Gastos por Categoría</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-premium border border-black/5">
          <h3 className="text-lg font-black text-slate-900 mb-6">Inversión por Materia</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-[32px] shadow-premium border border-black/5 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Inventario de Materiales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Recurso</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Materia</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Costo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recursos.map((recurso) => (
                <tr key={recurso.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${recurso.adquirido ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                        <Book className={`w-5 h-5 ${recurso.adquirido ? 'text-emerald-600' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{recurso.nombre}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 rounded-full" 
                              style={{ width: `${recurso.progreso}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{recurso.progreso}% leído</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${recurso.materia?.color}20`, color: recurso.materia?.color }}>
                      {recurso.materia?.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{recurso.tipo}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-slate-900">${recurso.costo.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => toggleAdquirido(recurso)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-xl font-bold text-xs transition-all ${
                        recurso.adquirido 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {recurso.adquirido ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Adquirido
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          Pendiente
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {recurso.url && (
                        <a href={recurso.url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button 
                        onClick={() => { setEditingRecurso(recurso); setShowModal(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Plus className="w-4 h-4 rotate-45" />
                      </button>
                      <button 
                        onClick={() => handleDelete(recurso.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Reutilizable (Simplificado) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6">{editingRecurso?.id ? 'Editar' : 'Nuevo'} Recurso</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nombre</label>
                  <input 
                    type="text" required
                    className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
                    value={editingRecurso?.nombre || ''}
                    onChange={e => setEditingRecurso({...editingRecurso, nombre: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Materia</label>
                  <select 
                    required
                    className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
                    value={editingRecurso?.materiaId || ''}
                    onChange={e => setEditingRecurso({...editingRecurso, materiaId: parseInt(e.target.value)})}
                  >
                    <option value="">Seleccionar...</option>
                    {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tipo</label>
                  <select 
                    className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
                    value={editingRecurso?.tipo || 'LIBRO'}
                    onChange={e => setEditingRecurso({...editingRecurso, tipo: e.target.value as any})}
                  >
                    <option value="LIBRO">Libro</option>
                    <option value="DOSSIER">Dossier</option>
                    <option value="DIGITAL">PDF/Digital</option>
                    <option value="IMPRESION">Impresión</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Costo ($)</label>
                  <input 
                    type="number"
                    className="w-full mt-1 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
                    value={editingRecurso?.costo || 0}
                    onChange={e => setEditingRecurso({...editingRecurso, costo: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Progreso (%)</label>
                  <input 
                    type="range" min="0" max="100"
                    className="w-full mt-3 accent-primary-600"
                    value={editingRecurso?.progreso || 0}
                    onChange={e => setEditingRecurso({...editingRecurso, progreso: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4">
                <input 
                  type="checkbox" id="adquirido"
                  className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  checked={editingRecurso?.adquirido || false}
                  onChange={e => setEditingRecurso({...editingRecurso, adquirido: e.target.checked})}
                />
                <label htmlFor="adquirido" className="font-bold text-slate-700">Ya lo tengo adquirido</label>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-4 font-bold text-white bg-primary-600 rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-premium border border-black/5 flex items-center gap-6 transition-all hover:scale-[1.02]">
      <div className={`w-16 h-16 rounded-[20px] ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
