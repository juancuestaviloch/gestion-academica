import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const { materiaId, estado } = req.query;
    const where: any = {};

    if (materiaId) {
      where.materiaId = parseInt(materiaId as string);
    }
    if (estado) {
      where.estado = estado as string;
    }

    const tareas = await prisma.tarea.findMany({
      where,
      include: { materia: { select: { id: true, nombre: true, color: true } } },
      orderBy: { fechaLimite: 'asc' },
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Obtener una tarea por ID
router.get('/:id', async (req, res) => {
  try {
    const tarea = await prisma.tarea.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
    });
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tarea' });
  }
});

// Crear tarea
router.post('/', async (req, res) => {
  try {
    const { materiaId, titulo, descripcion, fechaLimite, estado } = req.body;
    const tarea = await prisma.tarea.create({
      data: {
        materiaId,
        titulo,
        descripcion,
        fechaLimite: new Date(fechaLimite),
        estado: estado || 'Pendiente',
      },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
    });
    res.status(201).json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// Actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const { materiaId, titulo, descripcion, fechaLimite, estado } = req.body;
    const tarea = await prisma.tarea.update({
      where: { id: parseInt(req.params.id) },
      data: {
        materiaId,
        titulo,
        descripcion,
        fechaLimite: fechaLimite ? new Date(fechaLimite) : undefined,
        estado,
      },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
    });
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    await prisma.tarea.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

export default router;
