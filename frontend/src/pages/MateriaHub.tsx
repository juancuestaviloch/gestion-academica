import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Video, CheckSquare, FileText, Clock, Play, 
  ExternalLink, ChevronRight, ArrowLeft, Zap, StickyNote,
  Brain
} from 'lucide-react';
import { materiasAPI, sesionesAPI } from '../api';
import { Materia, Video as VideoType, Tarea, Examen, Apunte } from '../types';

export default function MateriaHub() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [materia, setMateria] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      materiasAPI.getById(parseInt(id))
        .then(setMateria)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!materia) return <div className="text-center py-20 text-slate-500">Materia no encontrada</div>;

  const handleStartFocus = () => {
    // Podríamos pasar el ID de la materia al FocusMode vía state o query
    navigate('/focus', { state: { materiaId: materia.id } });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Contextual */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/materias')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-colors w-fit"
        >
          <ArrowLeft className="w-3 h-3" /> Volver a Materias
        </button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: materia.color }}>
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{materia.nombre}</h1>
              <p className="text-slate-500 font-medium">{materia.profesor} • {materia.anio}° Año</p>
            </div>
          </div>
          <button 
            onClick={handleStartFocus}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            <Zap className="w-4 h-4 text-primary-400" /> Iniciar Sesión Focus
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Recursos e Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Sección de Apuntes y Materiales */}
          <div className="bg-white rounded-[32px] p-8 shadow-premium border border-black/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <StickyNote className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-black text-slate-900">Apuntes y Documentos</h3>
              </div>
              <button 
                onClick={() => navigate('/apuntes')}
                className="text-xs font-bold text-primary-600 hover:underline"
              >
                Ver todos
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {materia.apuntes?.slice(0, 4).map((apunte: Apunte) => (
                <div 
                  key={apunte.id}
                  onClick={() => navigate('/apuntes')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{apunte.tipo}</p>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 truncate">{apunte.titulo}</h4>
                </div>
              ))}
              {(!materia.apuntes || materia.apuntes.length === 0) && (
                <p className="text-sm text-slate-400 italic col-span-2 text-center py-4">No hay apuntes registrados aún.</p>
              )}
            </div>
          </div>

          {/* Sección de Bibliografía y Recursos (Nuevo) */}
          <div className="bg-white rounded-[32px] p-8 shadow-premium border border-black/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-black text-slate-900">Bibliografía y Recursos</h3>
              </div>
              <button 
                onClick={() => navigate('/finanzas')}
                className="text-xs font-bold text-primary-600 hover:underline"
              >
                Gestionar Presupuesto
              </button>
            </div>
            
            <div className="space-y-4">
              {materia.recursos?.map((recurso: any) => (
                <div key={recurso.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        recurso.adquirido ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {recurso.adquirido ? 'Adquirido' : 'Pendiente'}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{recurso.nombre}</h4>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{recurso.progreso}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${recurso.progreso}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!materia.recursos || materia.recursos.length === 0) && (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-400 italic">No hay bibliografía registrada.</p>
                  <button 
                    onClick={() => navigate('/finanzas')}
                    className="mt-2 text-xs font-bold text-primary-600"
                  >
                    + Agregar primer material
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sección de Videos y Clases (Original) */}
          <div className="bg-white rounded-[32px] p-8 shadow-premium border border-black/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-xl">
                <Video className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-black text-slate-900">Clases Grabadas</h3>
            </div>
            
            <div className="space-y-3">
              {materia.videos?.slice(0, 3).map((video: VideoType) => (
                <div 
                  key={video.id}
                  onClick={() => navigate('/videos')}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all">
                      <Play className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{video.titulo}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{video.duracion || '0:00'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              ))}
              {(!materia.videos || materia.videos.length === 0) && (
                <p className="text-sm text-slate-400 italic text-center py-4">No hay videos disponibles.</p>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Pendientes y Exámenes */}
        <div className="space-y-8">
          {/* Tareas Pendientes */}
          <div className="bg-white rounded-[32px] p-8 shadow-premium border border-black/5">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-emerald-500" />
              Próximas Tareas
            </h3>
            <div className="space-y-4">
              {materia.tareas?.filter((t: Tarea) => t.estado !== 'Entregada').slice(0, 3).map((tarea: Tarea) => (
                <div key={tarea.id} className="relative pl-4 border-l-2 border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    {new Date(tarea.fechaLimite).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{tarea.titulo}</p>
                </div>
              ))}
              {(!materia.tareas || materia.tareas.filter((t: Tarea) => t.estado !== 'Entregada').length === 0) && (
                <p className="text-xs text-slate-400 italic">No hay tareas pendientes.</p>
              )}
            </div>
          </div>

          {/* Exámenes */}
          <div className="bg-white rounded-[32px] p-8 shadow-premium border border-black/5">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-500" />
              Fechas de Examen
            </h3>
            <div className="space-y-4">
              {materia.examenes?.slice(0, 2).map((examen: Examen) => (
                <div key={examen.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{examen.tipo}</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{new Date(examen.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
                    </div>
                    {examen.nota && (
                      <span className="bg-white px-2 py-1 rounded-lg text-xs font-black text-amber-700 shadow-sm border border-amber-100">
                        {examen.nota}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {(!materia.examenes || materia.examenes.length === 0) && (
                <p className="text-xs text-slate-400 italic">No hay exámenes programados.</p>
              )}
            </div>
          </div>

          {/* Widget de Flashcards (SRS) */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Brain className="w-5 h-5 text-indigo-100" />
                </div>
                <h3 className="font-black text-white">Repaso Inteligente</h3>
              </div>
              <p className="text-indigo-100 text-sm font-medium mb-6 max-w-[200px]">
                Potenciá tu memoria con el sistema de repetición espaciada.
              </p>
              <button 
                onClick={() => navigate(`/flashcards/${materia.id}`)}
                className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                Empezar Repaso <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <Brain className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
