import { useState } from 'react';
import { Materia } from '../types';
import { eventosAcademicosAPI } from '../api';
import Modal from './Modal';
import { Zap, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BulkTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  materias: Materia[];
  onSuccess: () => void;
}

export default function BulkTaskModal({ isOpen, onClose, materias, onSuccess }: BulkTaskModalProps) {
  const [materiaId, setMateriaId] = useState<number>(materias[0]?.id || 0);
  const [tipo, setTipo] = useState<string>('Tarea');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 16));
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const titulos = rawText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    
    if (titulos.length === 0) {
      setToast({ message: 'Escribe o pega al menos una línea de texto.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const result = await eventosAcademicosAPI.bulkCreate({
        materiaId,
        tipo,
        fecha,
        titulos
      });

      setToast({ message: `¡Se crearon ${result.count} tareas exitosamente!`, type: 'success' });
      setRawText('');
      setTimeout(() => {
        onSuccess();
        onClose();
        setToast(null);
      }, 2000);
    } catch (error) {
      console.error('Bulk creation error:', error);
      setToast({ message: 'Error al crear tareas en lote.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Carga Masiva de Tareas">
      <form onSubmit={handleBulkCreate} className="space-y-6">
        {toast && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
            toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-bold">{toast.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Materia Destino</label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {materias.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMateriaId(m.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                    materiaId === m.id 
                      ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-500/5' 
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className={`text-xs font-bold truncate ${materiaId === m.id ? 'text-primary-900' : 'text-slate-600'}`}>
                    {m.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tipo Común</label>
              <select 
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none"
              >
                <option value="Tarea">Tarea</option>
                <option value="Lectura">Lectura</option>
                <option value="Trabajo Práctico">Trabajo Práctico</option>
                <option value="Parcial">Parcial</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Fecha Límite (Común)</label>
              <input 
                type="datetime-local"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Pega tu lista aquí (cada línea será una tarea)
          </label>
          <textarea
            required
            rows={8}
            placeholder={"Ej:\nGuía 1 - Ejercicios 1 a 10\nLectura Capítulo 4\nRepaso para el parcial..."}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full px-6 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-medium placeholder:text-slate-300 focus:ring-4 focus:ring-primary-500/10 outline-none resize-none"
          />
          <p className="text-[10px] font-bold text-slate-400 mt-2 px-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Se ignorarán las líneas vacías automáticamente.
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <BookOpen className="w-5 h-5" />
              Generar Tareas Masivamente
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
