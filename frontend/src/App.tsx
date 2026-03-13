import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Materias from './pages/Materias';
import Calendario from './pages/Calendario';
import Examenes from './pages/Examenes';
import Tareas from './pages/Tareas';
import Asistencia from './pages/Asistencia';
import Apuntes from './pages/Apuntes';
import Videos from './pages/Videos';
import Metas from './pages/Metas';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/examenes" element={<Examenes />} />
          <Route path="/tareas" element={<Tareas />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/apuntes" element={<Apuntes />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/metas" element={<Metas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
