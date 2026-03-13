import express from 'express';
import cors from 'cors';
import materiasRouter from './routes/materias';
import examenesRouter from './routes/examenes';
import tareasRouter from './routes/tareas';
import asistenciasRouter from './routes/asistencias';
import apuntesRouter from './routes/apuntes';
import metasRouter from './routes/metas';
import eventosRouter from './routes/eventos';
import dashboardRouter from './routes/dashboard';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/materias', materiasRouter);
app.use('/api/examenes', examenesRouter);
app.use('/api/tareas', tareasRouter);
app.use('/api/asistencias', asistenciasRouter);
app.use('/api/apuntes', apuntesRouter);
app.use('/api/metas', metasRouter);
app.use('/api/eventos', eventosRouter);
app.use('/api/dashboard', dashboardRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
