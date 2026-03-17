import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Lock, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Layers,
  Info,
  Zap,
  LayoutGrid
} from 'lucide-react';
import { materiasAPI } from '../api';
import { Materia } from '../types';

interface SubjectNode extends Materia {
  status: 'Aprobada' | 'Cursando' | 'Habilitada' | 'Bloqueada';
  dependenciesMet: boolean;
}

export default function DegreeNavigator() {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  useEffect(() => {
    materiasAPI.getAll()
      .then(setMaterias)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  // Lógica de cálculo de estados
  const subjectsWithStatus: SubjectNode[] = materias.map(m => {
    const prerequisites = m.prerequisites || [];
    const dependenciesMet = prerequisites.every(p => {
      const fullP = materias.find(mat => mat.id === p.id);
      return fullP?.estado === 'Aprobada';
    });

    let status: SubjectNode['status'] = 'Bloqueada';
    if (m.estado === 'Aprobada') status = 'Aprobada';
    else if (m.estado === 'Cursando') status = 'Cursando';
    else if (dependenciesMet) status = 'Habilitada';

    return { ...m, status, dependenciesMet };
  });

  const years = [1, 2, 3, 4, 5];
  const semesters = ['1er Cuatrimestre', '2do Cuatrimestre'];

  const getSubjectColor = (status: SubjectNode['status']) => {
    switch (status) {
      case 'Aprobada': return 'bg-emerald-500 text-white border-emerald-600';
      case 'Cursando': return 'bg-blue-500 text-white border-blue-600';
      case 'Habilitada': return 'bg-white text-slate-900 border-slate-200 hover:border-primary-400';
      case 'Bloqueada': return 'bg-slate-50 text-slate-400 border-slate-100 opacity-60';
      default: return 'bg-white';
    }
  };

  const getSubjectIcon = (status: SubjectNode['status']) => {
    switch (status) {
      case 'Aprobada': return <CheckCircle2 className="w-4 h-4" />;
      case 'Cursando': return <Zap className="w-4 h-4 animate-pulse" />;
      case 'Habilitada': return <Circle className="w-4 h-4 text-primary-400" />;
      case 'Bloqueada': return <Lock className="w-4 h-4" />;
    }
  };

  const selectedData = subjectsWithStatus.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Plan de Estudios</h1>
          <p className="text-slate-500 font-medium">Navegador interactivo de carrera y correlatividades</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-xl">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <span className="text-[10px] font-black text-emerald-700 uppercase">Aprobada</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-xl">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             <span className="text-[10px] font-black text-blue-700 uppercase">Cursando</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-xl">
             <div className="w-2 h-2 rounded-full bg-slate-300" />
             <span className="text-[10px] font-black text-slate-500 uppercase">Bloqueada</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Curriculo Grid */}
        <div className="xl:col-span-3 space-y-12">
          {years.map(year => (
            <div key={year} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                  {year}
                </div>
                <h2 className="text-xl font-black text-slate-900">{year}° Año de Carrera</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {semesters.map(semester => (
                  <div key={semester} className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">{semester}</h3>
                    <div className="space-y-3">
                      {subjectsWithStatus
                        .filter(s => s.anio === year && s.cuatrimestre === semester)
                        .map(subject => (
                          <div
                            key={subject.id}
                            onClick={() => setSelectedSubject(subject.id)}
                            className={`
                              relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer shadow-sm
                              ${getSubjectColor(subject.status)}
                              ${selectedSubject === subject.id ? 'ring-4 ring-primary-500/20 scale-[1.02] z-10' : ''}
                            `}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm leading-tight truncate">{subject.nombre}</h4>
                                <p className={`text-[10px] font-bold uppercase mt-1 ${subject.status === 'Habilitada' ? 'text-primary-600' : 'opacity-60'}`}>
                                  {subject.status}
                                </p>
                              </div>
                              <div className="shrink-0 ml-2">
                                {getSubjectIcon(subject.status)}
                              </div>
                            </div>
                            
                            {/* Visualización de dependencias si está seleccionado */}
                            {selectedSubject === subject.id && (
                              <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full hidden lg:block">
                                <ChevronRight className="w-6 h-6 text-primary-500 animate-bounce-x" />
                              </div>
                            )}
                          </div>
                        ))}
                      {subjectsWithStatus.filter(s => s.anio === year && s.cuatrimestre === semester).length === 0 && (
                        <div className="p-4 rounded-2xl border-2 border-dashed border-slate-100 text-center">
                          <p className="text-[10px] font-bold text-slate-300 uppercase">Sin materias registradas</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Panel Lateral */}
        <div className="xl:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-premium border border-black/5 min-h-[400px]">
              {selectedData ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: selectedData.color }}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 leading-tight">{selectedData.nombre}</h3>
                      <p className="text-xs text-slate-500">{selectedData.anio}° Año • {selectedData.cuatrimestre}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Correlativas (Prerrequisitos)
                      </p>
                      <div className="space-y-2">
                        {selectedData.prerequisites && selectedData.prerequisites.length > 0 ? (
                          selectedData.prerequisites.map(p => (
                            <div key={p.id} className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-700">{p.nombre}</span>
                              <CheckCircle2 className={`w-3 h-3 ${materias.find(m => m.id === p.id)?.estado === 'Aprobada' ? 'text-emerald-500' : 'text-slate-300'}`} />
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">No tiene correlativas.</p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Destraba a
                      </p>
                      <div className="space-y-2">
                        {selectedData.unlockedBy && selectedData.unlockedBy.length > 0 ? (
                          selectedData.unlockedBy.map(u => (
                            <div key={u.id} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              <ChevronRight className="w-3 h-3 text-primary-400" />
                              {u.nombre}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">No destraba otras materias directamente.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/materia/${selectedData.id}`)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    Ver Hub de Materia <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                    <LayoutGrid className="w-8 h-8 text-slate-200" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Seleccioná una materia</h3>
                    <p className="text-xs text-slate-400 max-w-[200px] mt-1">Hacé clic en cualquier cuadrado del plan para ver sus correlatividades e impacto.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExternalLink({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
