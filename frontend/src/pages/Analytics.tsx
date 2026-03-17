import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Award, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { examenesAPI, sesionesAPI, materiasAPI } from '../api';
import { Examen, Materia } from '../types';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Analytics() {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      examenesAPI.getAll(),
      sesionesAPI.getAll(),
      materiasAPI.getAll()
    ]).then(([ex, ses, mat]) => {
      setExamenes(ex);
      setSesiones(ses);
      setMaterias(mat);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  // Procesar datos para gráficos
  const examenesConNota = examenes.filter(e => e.nota !== null);
  const promedioGeneral = examenesConNota.length > 0
    ? (examenesConNota.reduce((acc, curr) => acc + (curr.nota || 0), 0) / examenesConNota.length).toFixed(2)
    : '0.00';

  const dataEvolucion = examenesConNota.map(e => ({
    nombre: e.materia.nombre.substring(0, 10),
    nota: e.nota,
    fecha: new Date(e.fecha).toLocaleDateString()
  }));

  const horasEstudioTotal = (sesiones.reduce((acc, curr) => acc + curr.duracion, 0) / 60).toFixed(1);

  const dataMaterias = materias.map(m => {
    const notasMateria = examenesConNota.filter(e => e.materiaId === m.id);
    const promedio = notasMateria.length > 0
      ? (notasMateria.reduce((acc, curr) => acc + (curr.nota || 0), 0) / notasMateria.length).toFixed(1)
      : 0;
    return { name: m.nombre.substring(0, 12), value: parseFloat(promedio as string) };
  }).filter(d => d.value > 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Award className="w-6 h-6 text-primary-600" />}
          label="Promedio General"
          value={promedioGeneral}
          color="bg-primary-50"
        />
        <StatCard 
          icon={<Clock className="w-6 h-6 text-emerald-600" />}
          label="Horas de Focus"
          value={horasEstudioTotal + 'h'}
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<BookOpen className="w-6 h-6 text-amber-600" />}
          label="Exámenes Rendidos"
          value={examenesConNota.length}
          color="bg-amber-50"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
          label="Meta Semestral"
          value="85%"
          color="bg-indigo-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Evolución de Notas */}
        <div className="bg-white p-8 rounded-[32px] shadow-premium border border-black/5">
          <h3 className="text-lg font-black text-slate-900 mb-6">Evolución de Rendimiento</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataEvolucion}>
                <defs>
                  <linearGradient id="colorNota" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="nota" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorNota)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Promedio por Materia */}
        <div className="bg-white p-8 rounded-[32px] shadow-premium border border-black/5">
          <h3 className="text-lg font-black text-slate-900 mb-6">Promedio por Materia</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataMaterias}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {dataMaterias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {examenesConNota.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
          <h4 className="text-slate-900 font-bold">Sin datos suficientes</h4>
          <p className="text-slate-500 text-sm text-center max-w-sm mt-2">
            Cargá las notas de tus exámenes en la sección de "Exámenes" para empezar a ver tus estadísticas de rendimiento.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-premium border border-black/5 flex items-center gap-4 transition-all hover:scale-[1.02]">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
