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
    const { materiaId, titulo, tipo, fecha, estado, horasEstimadas } = req.body;
    const evento = await prisma.eventoAcademico.create({
      data: {
        materiaId,
        titulo,
        tipo,
        fecha: new Date(fecha),
        estado: estado || 'Pendiente',
        horasEstimadas: horasEstimadas ? parseFloat(horasEstimadas) : 0
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
    const { titulo, tipo, fecha, estado, horasEstimadas } = req.body;
    const evento = await prisma.eventoAcademico.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        tipo,
        fecha: fecha ? new Date(fecha) : undefined,
        estado,
        horasEstimadas: horasEstimadas !== undefined ? parseFloat(horasEstimadas) : undefined
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

// Crear múltiples eventos en lote
router.post('/bulk', async (req, res) => {
  try {
    const { materiaId, tipo, fecha, estado, horasEstimadas, titulos } = req.body;
    
    if (!titulos || !Array.isArray(titulos) || titulos.length === 0) {
      return res.status(400).json({ error: 'Se requiere una lista de títulos' });
    }

    const data = titulos.map(titulo => ({
      materiaId,
      titulo: titulo.trim(),
      tipo,
      fecha: new Date(fecha),
      estado: estado || 'Pendiente',
      horasEstimadas: horasEstimadas ? parseFloat(horasEstimadas) : 0
    }));

    const result = await prisma.eventoAcademico.createMany({
      data,
      skipDuplicates: true
    });

    res.status(201).json({ count: result.count });
  } catch (error) {
    console.error('Error in bulk create:', error);
    res.status(500).json({ error: 'Error al crear eventos en lote' });
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
