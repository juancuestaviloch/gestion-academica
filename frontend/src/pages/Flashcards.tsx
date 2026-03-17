import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Brain, ChevronLeft, ChevronRight, 
  RotateCcw, Check, X, Info, GraduationCap,
  BookOpen, Sparkles
} from 'lucide-react';
import { flashcardsAPI, materiasAPI } from '../api';
import { Materia } from '../types';

export default function Flashcards() {
  const { materiaId } = useParams<{ materiaId?: string }>();
  const navigate = useNavigate();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [filteredCards, setFilteredCards] = useState<any[]>([]);
  const [selectedMateria, setSelectedMateria] = useState<number | 'all'>(materiaId ? parseInt(materiaId) : 'all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({ pregunta: '', respuesta: '', materiaId: 0 });
  
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    Promise.all([
      materiasAPI.getAll(),
      flashcardsAPI.getAll()
    ]).then(([mats, cards]) => {
      setMaterias(mats);
      setFlashcards(cards);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedMateria === 'all') {
      setFilteredCards(flashcards);
    } else {
      setFilteredCards(flashcards.filter(c => c.materiaId === selectedMateria));
    }
  }, [selectedMateria, flashcards]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.materiaId || !newCard.pregunta || !newCard.respuesta) return;
    const card = await flashcardsAPI.create(newCard);
    setFlashcards([...flashcards, card]);
    setNewCard({ pregunta: '', respuesta: '', materiaId: newCard.materiaId });
    setShowAddModal(false);
  };

  const handleReview = async (quality: number) => {
    const card = filteredCards[currentIndex];
    const updated = await flashcardsAPI.repasar(card.id, quality);
    
    // Actualizar lista local
    setFlashcards(flashcards.map(c => c.id === card.id ? updated : c));
    
    // Siguiente tarjeta
    if (currentIndex < filteredCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
    } else {
      setIsStudyMode(false);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {!isStudyMode ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Brain className="w-10 h-10 text-indigo-600" />
                Mazos de Repaso
              </h1>
              <p className="text-slate-500 font-medium mt-1">Memorización activa con repetición espaciada (SRS).</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl font-bold text-sm hover:border-indigo-600 hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" /> Nueva Tarjeta
              </button>
              <button 
                onClick={() => filteredCards.length > 0 && setIsStudyMode(true)}
                disabled={filteredCards.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" /> Iniciar Sesión de Repaso
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedMateria('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedMateria === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
            >
              Todas las Materias
            </button>
            {materias.map(m => (
              <button 
                key={m.id}
                onClick={() => setSelectedMateria(m.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedMateria === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
              >
                {m.nombre}
              </button>
            ))}
          </div>

          {/* Grid de Tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <div key={card.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-premium group hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    {new Date(card.proximoRepaso).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white" 
                    style={{ backgroundColor: materias.find(m => m.id === card.materiaId)?.color || '#6366f1' }}
                  >
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight min-h-[3rem]">{card.pregunta}</h3>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                      {card.repasos} repasos
                    </span>
                    <button 
                      onClick={() => flashcardsAPI.delete(card.id).then(() => setFlashcards(flashcards.filter(c => c.id !== card.id)))}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredCards.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-slate-300">
                  <Brain className="w-8 h-8" />
                </div>
                <p className="text-slate-400 font-medium">No hay tarjetas registradas para esta materia.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Modo Repaso */
        <div className="max-w-xl mx-auto space-y-10 py-10">
          <div className="flex items-center justify-between">
            <button onClick={() => setIsStudyMode(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" /> Finalizar Sesión
            </button>
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {currentIndex + 1} / {filteredCards.length}
            </span>
          </div>

          {/* Flashcard Flip Container */}
          <div 
            className="group perspective"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-80 transition-all duration-500 preserve-3d cursor-pointer ${isFlipped ? 'my-rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-[3rem] shadow-2xl border-4 border-slate-50 p-10 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Pregunta</span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{filteredCards[currentIndex].pregunta}</h2>
                <div className="absolute bottom-6 text-slate-300 flex items-center gap-2 text-xs font-bold animate-pulse">
                  <RotateCcw className="w-3 h-3" /> Toca para voltear
                </div>
              </div>
              
              {/* Back */}
              <div className="absolute inset-0 backface-hidden my-rotate-y-180 bg-indigo-600 rounded-[3rem] shadow-2xl p-10 flex flex-col items-center justify-center text-center text-white">
                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-4">Respuesta</span>
                <p className="text-xl font-bold leading-relaxed">{filteredCards[currentIndex].respuesta}</p>
              </div>
            </div>
          </div>

          {/* Calificación del Repaso */}
          <div className={`transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <p className="text-center text-sm font-bold text-slate-500 mb-6">¿Qué tan bien recordabas esto?</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Olvidado', val: 0, color: 'hover:bg-red-500', text: 'text-red-500' },
                { label: 'Difícil', val: 3, color: 'hover:bg-amber-500', text: 'text-amber-500' },
                { label: 'Bien', val: 4, color: 'hover:bg-blue-500', text: 'text-blue-500' },
                { label: 'Fácil', val: 5, color: 'hover:bg-emerald-500', text: 'text-emerald-500' },
              ].map(q => (
                <button 
                  key={q.val}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReview(q.val);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all group ${q.color} hover:text-white`}
                >
                  <span className={`text-xs font-black uppercase tracking-tighter group-hover:text-white ${q.text}`}>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Tarjeta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-scale-in">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Crear Nueva Tarjeta</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Materia</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-500"
                  value={newCard.materiaId || ''}
                  onChange={(e) => setNewCard({ ...newCard, materiaId: parseInt(e.target.value) })}
                  required
                >
                  <option value="">Seleccionar Materia...</option>
                  {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pregunta / Frente</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-500 placeholder:text-slate-300"
                  placeholder="Ej: ¿Qué es el Costo de Oportunidad?"
                  value={newCard.pregunta}
                  onChange={(e) => setNewCard({ ...newCard, pregunta: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Respuesta / Reverso</label>
                <textarea 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-500 placeholder:text-slate-300 min-h-[100px]"
                  placeholder="La alternativa a la que se renuncia al tomar una decisión económica."
                  value={newCard.respuesta}
                  onChange={(e) => setNewCard({ ...newCard, respuesta: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">Guardar Tarjeta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for Flip Card */}
      <style>{`
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .my-rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
