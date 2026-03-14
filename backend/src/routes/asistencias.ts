import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener resumen de asistencias por materia
router.get('/resumen', async (req, res) => {
  try {
    const materias = await prisma.materia.findMany({
      where: { estado: 'Cursando' },
      include: { asistencias: true },
      orderBy: { nombre: 'asc' },
    });

    const resumen = materias.map((m) => {
      const total = m.asistencias.length;
      const presentes = m.asistencias.filter((a) => a.presente).length;
      const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 100;
      return {
        materiaId: m.id,
        materia: m.nombre,
        color: m.color,
        total,
        presentes,
        ausentes: total - presentes,
        porcentaje,
        alerta: porcentaje < 75,
      };
    });

    res.json(resumen);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen de asistencias' });
  }
});

// Obtener detalle de asistencias de una materia
router.get('/materia/:materiaId', async (req, res) => {
  try {
    const { materiaId } = req.params;
    const asistencias = await prisma.asistencia.findMany({
      where: { materiaId: parseInt(materiaId) },
      orderBy: { fecha: 'desc' },
    });
    
    const total = asistencias.length;
    const presentes = asistencias.filter((a) => a.presente).length;
    const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 100;

    res.json({ asistencias, total, presentes, porcentaje });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalle de asistencias' });
  }
});

// Registrar asistencia
router.post('/', async (req, res) => {
  try {
    const { materiaId, fecha, presente } = req.body;
    const asistencia = await prisma.asistencia.create({
      data: {
        materiaId,
        fecha: new Date(fecha),
        presente: presente !== undefined ? presente : true,
      },
    });
    res.status(201).json(asistencia);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
});

// Actualizar asistencia
router.put('/:id', async (req, res) => {
  try {
    const { presente } = req.body;
    const asistencia = await prisma.asistencia.update({
      where: { id: parseInt(req.params.id) },
      data: { presente },
    });
    res.json(asistencia);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar asistencia' });
  }
});

// Eliminar asistencia
router.delete('/:id', async (req, res) => {
  try {
    await prisma.asistencia.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Asistencia eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar asistencia' });
  }
});

export default router;
