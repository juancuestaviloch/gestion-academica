import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todos los eventos académicos
router.get('/', async (req, res) => {
  try {
    const { materiaId } = req.query;
    const eventos = await prisma.eventoAcademico.findMany({
      where: materiaId ? { materiaId: parseInt(materiaId as string) } : {},
      include: {
        materia: {
          select: {
            nombre: true,
            color: true
          }
        }
      },
      orderBy: { fecha: 'asc' }
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// Crear un nuevo evento
router.post('/', async (req, res) => {
  try {
    const { materiaId, titulo, tipo, fecha, estado } = req.body;
    const evento = await prisma.eventoAcademico.create({
      data: {
        materiaId,
        titulo,
        tipo,
        fecha: new Date(fecha),
        estado: estado || 'Pendiente'
      },
      include: {
        materia: true
      }
    });
    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

// Actualizar un evento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, tipo, fecha, estado } = req.body;
    const evento = await prisma.eventoAcademico.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        tipo,
        fecha: fecha ? new Date(fecha) : undefined,
        estado
      },
      include: {
        materia: true
      }
    });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

// Eliminar un evento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.eventoAcademico.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

export default router;
