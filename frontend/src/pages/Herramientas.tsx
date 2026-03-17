import { useState, useEffect } from 'react';
import { 
  Wrench, Calculator, LineChart, Sigma, Hash, 
  Save, Trash2, History, ChevronRight, Info,
  DollarSign, Percent, Clock, Plus, X
} from 'lucide-react';
import { herramientasAPI } from '../api';
import { Calculo } from '../types';

type Tab = 'financiera' | 'estadistica' | 'matematica';

export default function Herramientas() {
  const [activeTab, setActiveTab] = useState<Tab>('financiera');
  const [historial, setHistorial] = useState<Calculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Estados para Calculadoras
  const [van, setVan] = useState({ tasa: '', flujos: [''] });
  const [interes, setInteres] = useState({ capital: '', tasa: '', tiempo: '' });
  const [stats, setStats] = useState({ datos: '' });
  const [resolvente, setResolvente] = useState({ a: '', b: '', c: '' });
  const [reglaTres, setReglaTres] = useState({ a: '', b: '', c: '' });

  useEffect(() => {
    loadHistorial();
  }, []);

  const loadHistorial = async () => {
    try {
      const data = await herramientasAPI.getHistorial();
      setHistorial(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (nombre: string, tipo: string, formula: string, entradas: any, resultado: number) => {
    setSaveLoading(true);
    try {
      await herramientasAPI.guardarCalculo({
        nombre,
        tipo: tipo as any,
        formula,
        entradas: JSON.stringify(entradas),
        resultado
      });
      loadHistorial();
    } catch (error) {
      console.error(error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await herramientasAPI.deleteCalculo(id);
      setHistorial(historial.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // --- Lógica de Cálculos ---
  
  // Financiera: VAN
  const calcularVAN = () => {
    const r = parseFloat(van.tasa) / 100;
    if (isNaN(r)) return 0;
    let total = 0;
    van.flujos.forEach((f, i) => {
      const valor = parseFloat(f);
      if (!isNaN(valor)) {
        total += valor / Math.pow(1 + r, i);
      }
    });
    return total;
  };

  // Financiera: Interés Compuesto
  const calcularInteresCompuesto = () => {
    const c = parseFloat(interes.capital);
    const r = parseFloat(interes.tasa) / 100;
    const t = parseFloat(interes.tiempo);
    if (isNaN(c) || isNaN(r) || isNaN(t)) return 0;
    return c * Math.pow(1 + r, t);
  };

  // Estadística: Cálculos
  const calcularStats = () => {
    const numeros = stats.datos.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    if (numeros.length === 0) return { media: 0, mediana: 0, desv: 0 };
    
    const media = numeros.reduce((a, b) => a + b, 0) / numeros.length;
    
    const sorted = [...numeros].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const mediana = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    
    const varianza = numeros.reduce((a, b) => a + Math.pow(b - media, 2), 0) / numeros.length;
    const desv = Math.sqrt(varianza);
    
    return { media, mediana, desv };
  };

  // Matemática: Resolvente
  const calcularResolvente = () => {
    const a = parseFloat(resolvente.a);
    const b = parseFloat(resolvente.b);
    const c = parseFloat(resolvente.c);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return null;
    const disc = b * b - 4 * a * c;
    if (disc < 0) return 'Sin raíces reales';
    const x1 = (-b + Math.sqrt(disc)) / (2 * a);
    const x2 = (-b - Math.sqrt(disc)) / (2 * a);
    return `x1: ${x1.toFixed(2)}, x2: ${x2.toFixed(2)}`;
  };

  // Matemática: Regla de Tres
  const calcularReglaTres = () => {
    const a = parseFloat(reglaTres.a);
    const b = parseFloat(reglaTres.b);
    const c = parseFloat(reglaTres.c);
    if (!a || isNaN(a) || isNaN(b) || isNaN(c)) return 0;
    return (c * b) / a;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-20 animate-fade-in">
      {/* Principal: Calculadoras */}
      <div className="flex-1 space-y-8">
        <header>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Wrench className="w-10 h-10 text-primary-600" />
            Career Toolbox
          </h1>
          <p className="text-slate-500 font-medium mt-1">Herramientas de precisión para Administración, Economía y Matemática.</p>
        </header>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
          {[
            { id: 'financiera', label: 'Financiera', icon: DollarSign },
            { id: 'estadistica', label: 'Estadística', icon: BarChart3 },
            { id: 'matematica', label: 'Matemática', icon: Hash },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as Tab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === t.id 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeTab === 'financiera' && (
            <>
              {/* VPN / VAN */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => handleSave('Cálculo VAN', 'FINANCIERA', 'VAN', van, calcularVAN())}
                    disabled={saveLoading}
                    className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Valor Actual Neto (VAN)</h3>
                  <p className="text-sm text-slate-500">Evalúa la rentabilidad de un proyecto.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Tasa de Descuento (%)</label>
                    <input 
                      type="number" 
                      value={van.tasa}
                      onChange={(e) => setVan({ ...van, tasa: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none transition-all"
                      placeholder="Ej: 15"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Flujos de Caja (Año 0 a N)</label>
                    {van.flujos.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          type="number"
                          value={f}
                          onChange={(e) => {
                            const newFlujos = [...van.flujos];
                            newFlujos[i] = e.target.value;
                            setVan({ ...van, flujos: newFlujos });
                          }}
                          className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none transition-all"
                          placeholder={i === 0 ? "Inversión inicial (negativo)" : `Año ${i}`}
                        />
                        {i > 1 && (
                          <button 
                            onClick={() => setVan({ ...van, flujos: van.flujos.filter((_, idx) => idx !== i) })}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      onClick={() => setVan({ ...van, flujos: [...van.flujos, ''] })}
                      className="flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 p-2"
                    >
                      <Plus className="w-4 h-4" /> Agregar Año
                    </button>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400">Resultado</span>
                  <span className="text-2xl font-black text-emerald-600">${calcularVAN().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Interés Compuesto */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => handleSave('Interés Compuesto', 'FINANCIERA', 'CI', interes, calcularInteresCompuesto())}
                    disabled={saveLoading}
                    className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Interés Compuesto</h3>
                  <p className="text-sm text-slate-500">Calcula el crecimiento exponencial.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Capital Inicial</label>
                    <input 
                      type="number" 
                      value={interes.capital}
                      onChange={(e) => setInteres({ ...interes, capital: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Tasa Anual (%)</label>
                      <input 
                        type="number" 
                        value={interes.tasa}
                        onChange={(e) => setInteres({ ...interes, tasa: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Tiempo (Años)</label>
                      <input 
                        type="number" 
                        value={interes.tiempo}
                        onChange={(e) => setInteres({ ...interes, tiempo: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400">Monto Final</span>
                  <span className="text-2xl font-black text-blue-600">${calcularInteresCompuesto().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'estadistica' && (
            <div className="col-span-full bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <Sigma className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => handleSave('Análisis Estadístico', 'ESTADISTICA', 'DESC', stats, calcularStats().media)}
                  disabled={saveLoading}
                  className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                >
                  <Save className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Análisis Descriptivo</h3>
                <p className="text-sm text-slate-500">Ingresa una serie de números separados por coma.</p>
              </div>
              <textarea 
                value={stats.datos}
                onChange={(e) => setStats({ datos: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 font-bold focus:border-primary-500 outline-none transition-all min-h-[120px] resize-none"
                placeholder="Ej: 10, 15, 20, 25, 30"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Media</p>
                  <p className="text-2xl font-black text-slate-900">{calcularStats().media.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Mediana</p>
                  <p className="text-2xl font-black text-slate-900">{calcularStats().mediana.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Desv. Estándar</p>
                  <p className="text-2xl font-black text-slate-900">{calcularStats().desv.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matematica' && (
            <>
              {/* Resolvente */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                    <Hash className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => handleSave('Ecuación Cuadrática', 'MATEMATICA', 'RES', resolvente, 0)}
                    disabled={saveLoading}
                    className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Ecuación Cuadrática</h3>
                  <p className="text-sm text-slate-500">ax² + bx + c = 0</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">A</label>
                    <input type="number" value={resolvente.a} onChange={(e) => setResolvente({ ...resolvente, a: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">B</label>
                    <input type="number" value={resolvente.b} onChange={(e) => setResolvente({ ...resolvente, b: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">C</label>
                    <input type="number" value={resolvente.c} onChange={(e) => setResolvente({ ...resolvente, c: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none" />
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400">Raíces</span>
                  <span className="text-lg font-black text-amber-600">{calcularResolvente() || 'Calculando...'}</span>
                </div>
              </div>

              {/* Regla de Tres */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center">
                    <Percent className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Regla de Tres Simple</h3>
                  <p className="text-sm text-slate-500">A es a B, como C es a X.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input type="number" placeholder="A" value={reglaTres.a} onChange={(e) => setReglaTres({ ...reglaTres, a: e.target.value })} className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none" />
                    <span className="text-slate-400 font-bold">→</span>
                    <input type="number" placeholder="B" value={reglaTres.b} onChange={(e) => setReglaTres({ ...reglaTres, b: e.target.value })} className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-4">
                    <input type="number" placeholder="C" value={reglaTres.c} onChange={(e) => setReglaTres({ ...reglaTres, c: e.target.value })} className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold focus:border-primary-500 outline-none" />
                    <span className="text-slate-400 font-bold">→</span>
                    <div className="flex-1 bg-indigo-50 border-2 border-indigo-100 rounded-xl px-4 py-3 font-black text-indigo-600 text-center">
                      {calcularReglaTres().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lateral: Historial */}
      <div className="w-full xl:w-80 shrink-0">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium sticky top-8 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center gap-3">
            <History className="w-5 h-5 text-primary-600" />
            <h2 className="font-black text-slate-900">Historial Reciente</h2>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-10 text-center">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : historial.length === 0 ? (
              <div className="p-10 text-center text-slate-300 space-y-2">
                <Calculator className="w-8 h-8 mx-auto" />
                <p className="text-xs font-bold">Sin cálculos guardados</p>
              </div>
            ) : (
              historial.map((c) => (
                <div key={c.id} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors group relative">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                        c.tipo === 'FINANCIERA' ? 'bg-emerald-100 text-emerald-600' :
                        c.tipo === 'ESTADISTICA' ? 'bg-purple-100 text-purple-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {c.tipo}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{c.nombre}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Fórmula: {c.formula}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(c.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-black text-primary-600">${c.resultado.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-300 font-bold">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icono faltante en import
function BarChart3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
