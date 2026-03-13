import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todas las metas
router.get('/', async (_req, res) => {
  try {
    const metas = await prisma.meta.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(metas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener metas' });
  }
});

// Obtener una meta por ID
router.get('/:id', async (req, res) => {
  try {
    const meta = await prisma.meta.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!meta) {
      return res.status(404).json({ error: 'Meta no encontrada' });
    }
    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener meta' });
  }
});

// Crear meta
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, objetivo, progreso, cuatrimestre } = req.body;
    const meta = await prisma.meta.create({
      data: {
        titulo,
        descripcion,
        objetivo: objetivo || 1,
        progreso: progreso || 0,
        cuatrimestre,
      },
    });
    res.status(201).json(meta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear meta' });
  }
});

// Actualizar meta
router.put('/:id', async (req, res) => {
  try {
    const { titulo, descripcion, objetivo, progreso, cuatrimestre } = req.body;
    const meta = await prisma.meta.update({
      where: { id: parseInt(req.params.id) },
      data: { titulo, descripcion, objetivo, progreso, cuatrimestre },
    });
    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar meta' });
  }
});

// Eliminar meta
router.delete('/:id', async (req, res) => {
  try {
    await prisma.meta.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Meta eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar meta' });
  }
});

export default router;
