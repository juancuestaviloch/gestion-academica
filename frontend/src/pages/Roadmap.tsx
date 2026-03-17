import { useState, useEffect } from 'react';
import { 
  TrendingUp, Target, Calculator, GraduationCap, 
  ChevronRight, Brain, Zap, Info, Award, BarChart3
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, AreaChart, 
  Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { dashboardAPI, materiasAPI } from '../api';
import { Materia } from '../types';

export default function Roadmap() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projectionNote, setProjectionNote] = useState<number>(8);
  const [hypotheticalGPA, setHypotheticalGPA] = useState<number>(0);

  useEffect(() => {
    Promise.all([
      materiasAPI.getAll(),
      dashboardAPI.get()
    ]).then(([mats, dash]) => {
      setMaterias(mats);
      setStats(dash.estadisticas);
      setHypotheticalGPA(dash.estadisticas.promedioGeneral);
      setLoading(false);
    });
  }, []);

  // Lógica de simulación
  useEffect(() => {
    if (!stats) return;
    // Simulamos que agregamos una nueva nota al promedio general
    // Asumimos que el promedio actual viene de N exámenes.
    // Como no tenemos el N exacto en el dashboard, usamos un peso aproximado basado en materias aprobadas.
    const pesoActual = Math.max(stats.materiasAprobadas * 2, 5); // Estimación: 2 finales/parciales por materia
    const nuevoPromedio = (stats.promedioGeneral * pesoActual + projectionNote) / (pesoActual + 1);
    setHypotheticalGPA(Math.round(nuevoPromedio * 100) / 100);
  }, [projectionNote, stats]);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  // Datos para el gráfico de radar (Simulados basados en categorías de materias reales)
  const radarData = [
    { subject: 'Administración', A: 85, full: 100 },
    { subject: 'Economía', A: 70, full: 100 },
    { subject: 'Matemática', A: 60, full: 100 },
    { subject: 'Sociales', A: 90, full: 100 },
    { subject: 'Práctica', A: 75, full: 100 },
  ];

  const carreraProgreso = Math.round((stats.materiasAprobadas / 38) * 100); // 38 materias estimadas para la carrera

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <TrendingUp className="w-10 h-10 text-indigo-600" />
          Proyección Académica
        </h1>
        <p className="text-slate-500 font-medium mt-1">Simula tu futuro y planifica tu camino a la graduación.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Simulador GPA */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Whats-If Simulator */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-100 rounded-2xl">
                  <Calculator className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Simulador "What-If"</h3>
                  <p className="text-sm text-slate-500 font-medium">¿Cómo afectará tu próxima nota al promedio?</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                      Nota Proyectada: <span className="text-indigo-600 text-lg ml-2">{projectionNote}</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="0.5"
                      value={projectionNote}
                      onChange={(e) => setProjectionNote(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-black text-slate-300 uppercase">
                      <span>1.0</span>
                      <span>5.5</span>
                      <span>10.0</span>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="text-xs font-black uppercase tracking-wider">Insight de Carrera</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      Si sacas un <span className="font-bold text-slate-900">{projectionNote}</span> en tu próximo examen, tu promedio general subirá a <span className="font-bold text-slate-900">{hypotheticalGPA}</span>.
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative">
                    <svg className="w-48 h-48">
                      <circle cx="96" cy="96" r="88" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                      <circle 
                        cx="96" cy="96" r="88" fill="none" stroke="url(#gpaGradient)" strokeWidth="12" 
                        strokeDasharray={552}
                        strokeDashoffset={552 - (552 * hypotheticalGPA / 10)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="gpaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">{hypotheticalGPA}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GPA Proyectado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart: Equilibrio Académico */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 rounded-2xl">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Equilibrio de Conocimiento</h3>
                  <p className="text-sm text-slate-500 font-medium">Tu desempeño por área de estudio.</p>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Rendimiento"
                    dataKey="A"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="#6366f1"
                    fillOpacity={0.15}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Roadmap a la Graduación */}
        <div className="space-y-8">
          
          {/* Progreso de Carrera */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
                <h3 className="font-black text-lg">Hacia el Título</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-indigo-300">Progreso Total</span>
                  <span>{carreraProgreso}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                    style={{ width: `${carreraProgreso}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Aprobadas</p>
                  <p className="text-xl font-bold">{stats.materiasAprobadas}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Restantes</p>
                  <p className="text-xl font-bold">{38 - stats.materiasAprobadas}</p>
                </div>
              </div>

              <button className="w-full py-4 bg-white text-slate-900 rounded-[20px] font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95">
                Ver Plan Académico <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <Award className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
          </div>

          {/* Logros (Gamification) */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-100">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-500" />
              Próximos Hitos
            </h3>
            
            <div className="space-y-6">
              <AchievementItem 
                title="Mitad de Camino"
                progress={(stats.materiasAprobadas / 19) * 100}
                desc="Llega a las 19 materias aprobadas."
                icon="🎓"
              />
              <AchievementItem 
                title="Promedio de Honor"
                progress={stats.promedioGeneral >= 8 ? 100 : (stats.promedioGeneral / 8) * 100}
                desc="Mantén un promedio superior a 8.0."
                icon="⭐"
              />
              <AchievementItem 
                title="Asistencia Perfecta"
                progress={stats.asistenciaPromedio}
                desc="Supera el 90% de asistencia."
                icon="🔥"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementItem({ title, progress, desc, icon }: { title: string, progress: number, desc: string, icon: string }) {
  const isDone = progress >= 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${isDone ? 'bg-amber-100' : 'bg-slate-50'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold truncate ${isDone ? 'text-slate-900' : 'text-slate-600'}`}>{title}</p>
          <p className="text-[10px] text-slate-400 font-medium leading-tight">{desc}</p>
        </div>
      </div>
      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${isDone ? 'bg-amber-500' : 'bg-slate-200'}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
