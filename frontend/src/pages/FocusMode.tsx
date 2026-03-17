import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Brain } from 'lucide-react';
import { sesionesAPI } from '../api';

export default function FocusMode() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          // Cambiar modo automáticamente
          if (mode === 'study') {
            // Guardar sesión en la DB
            sesionesAPI.create({ duracion: 25 }).catch(console.error);
            setMode('break');
            setMinutes(5);
          } else {
            setMode('study');
            setMinutes(25);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'study' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-premium p-10 border border-black/5 text-center space-y-8 animate-pop-in">
        
        {/* Header de Modo */}
        <div className="flex justify-center">
          <div className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
            mode === 'study' ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'
          }`}>
            {mode === 'study' ? <Brain className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
            {mode === 'study' ? 'Tiempo de Estudio' : 'Descanso'}
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative inline-block">
          <div className="text-8xl font-black text-slate-900 tracking-tighter tabular-nums">
            {String(minutes).padStart(2, '0')}<span className="animate-pulse text-primary-500">:</span>{String(seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Frase Motivacional */}
        <p className="text-slate-500 font-medium italic">
          {mode === 'study' ? '"El éxito es la suma de pequeños esfuerzos repetidos día tras día."' : '"Descansar bien es parte del entrenamiento."'}
        </p>

        {/* Controles */}
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={resetTimer}
            className="p-4 rounded-3xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all active:scale-90"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-white shadow-xl transform transition-all active:scale-95 ${
              isActive ? 'bg-slate-900 rotate-90' : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isActive ? <Pause className="w-10 h-10 -rotate-90" /> : <Play className="w-10 h-10 ml-1" />}
          </button>

          <button 
            onClick={() => {
              setMode(mode === 'study' ? 'break' : 'study');
              setMinutes(mode === 'study' ? 5 : 25);
              setSeconds(0);
              setIsActive(false);
            }}
            className="p-4 rounded-3xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all active:scale-90"
          >
            {mode === 'study' ? <Coffee className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
          </button>
        </div>

        {/* Info Extra */}
        <div className="pt-8 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Sesiones</p>
            <p className="text-xl font-black text-slate-900">4 / 8</p>
          </div>
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Hoy</p>
            <p className="text-xl font-black text-slate-900">1h 40m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
