import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Materias = lazy(() => import('./pages/Materias'));
const MateriaHub = lazy(() => import('./pages/MateriaHub'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Calendario = lazy(() => import('./pages/Calendario'));
const Examenes = lazy(() => import('./pages/Examenes'));
const Tareas = lazy(() => import('./pages/Tareas'));
const Asistencia = lazy(() => import('./pages/Asistencia'));
const Apuntes = lazy(() => import('./pages/Apuntes'));
const Videos = lazy(() => import('./pages/Videos'));
const Finanzas = lazy(() => import('./pages/Finanzas'));
const Metas = lazy(() => import('./pages/Metas'));
const FocusMode = lazy(() => import('./pages/FocusMode'));
const DegreeNavigator = lazy(() => import('./pages/DegreeNavigator'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Cargando...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/materias" element={<Materias />} />
            <Route path="/materia/:id" element={<MateriaHub />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/flashcards/:materiaId" element={<Flashcards />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/examenes" element={<Examenes />} />
            <Route path="/tareas" element={<Tareas />} />
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/apuntes" element={<Apuntes />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/finanzas" element={<Finanzas />} />
            <Route path="/metas" element={<Metas />} />
            <Route path="/focus" element={<FocusMode />} />
            <Route path="/plan" element={<DegreeNavigator />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
