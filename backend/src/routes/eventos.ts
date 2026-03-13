import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const where: any = {};

    if (desde && hasta) {
      where.fecha = {
        gte: new Date(desde as string),
        lte: new Date(hasta as string),
      };
    }

    const eventos = await prisma.evento.findMany({
      where,
      orderBy: { fecha: 'asc' },
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// Crear evento
router.post('/', async (req, res) => {
  try {
    const { titulo, fecha, descripcion, color, esParo } = req.body;
    const evento = await prisma.evento.create({
      data: {
        titulo,
        fecha: new Date(fecha),
        descripcion,
        color: color || '#6366F1',
        esParo: esParo || false,
      },
    });
    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

// Actualizar evento
router.put('/:id', async (req, res) => {
  try {
    const { titulo, fecha, descripcion, color, esParo } = req.body;
    const evento = await prisma.evento.update({
      where: { id: parseInt(req.params.id) },
      data: {
        titulo,
        fecha: fecha ? new Date(fecha) : undefined,
        descripcion,
        color,
        esParo: esParo !== undefined ? esParo : undefined,
      },
    });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

// Eliminar evento
router.delete('/:id', async (req, res) => {
  try {
    await prisma.evento.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Evento eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

export default router;
