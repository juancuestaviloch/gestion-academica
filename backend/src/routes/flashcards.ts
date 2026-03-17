import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todas las flashcards
router.get('/', async (req, res) => {
  try {
    const { materiaId } = req.query;
    const flashcards = await prisma.flashcard.findMany({
      where: materiaId ? { materiaId: parseInt(materiaId as string) } : {},
      orderBy: { proximoRepaso: 'asc' },
    });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener flashcards' });
  }
});

// Obtener tarjetas pendientes para hoy
router.get('/pendientes', async (req, res) => {
  try {
    const { materiaId } = req.query;
    const flashcards = await prisma.flashcard.findMany({
      where: {
        proximoRepaso: { lte: new Date() },
        ...(materiaId ? { materiaId: parseInt(materiaId as string) } : {}),
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pendientes' });
  }
});

// Crear flashcard
router.post('/', async (req, res) => {
  try {
    const { materiaId, pregunta, respuesta } = req.body;
    const flashcard = await prisma.flashcard.create({
      data: { materiaId, pregunta, respuesta },
    });
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear flashcard' });
  }
});

// Algoritmo SM-2 para repasar
router.post('/:id/repasar', async (req, res) => {
  try {
    const { q } = req.body; // Calidad del 0 al 5
    const id = parseInt(req.params.id);

    const card = await prisma.flashcard.findUnique({ where: { id } });
    if (!card) return res.status(404).json({ error: 'Tarjeta no encontrada' });

    let { intervalo, factorFacilidad, repasos } = card;

    // Lógica SM-2
    if (q >= 3) {
      if (repasos === 0) {
        intervalo = 1;
      } else if (repasos === 1) {
        intervalo = 6;
      } else {
        intervalo = Math.round(intervalo * factorFacilidad);
      }
      repasos++;
      factorFacilidad = factorFacilidad + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    } else {
      repasos = 0;
      intervalo = 1;
    }

    if (factorFacilidad < 1.3) factorFacilidad = 1.3;
    
    const proximoRepaso = new Date();
    proximoRepaso.setDate(proximoRepaso.getDate() + intervalo);

    const updated = await prisma.flashcard.update({
      where: { id },
      data: {
        intervalo,
        factorFacilidad,
        repasos,
        proximoRepaso
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el repaso' });
  }
});

// Eliminar flashcard
router.delete('/:id', async (req, res) => {
  try {
    await prisma.flashcard.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar flashcard' });
  }
});

export default router;
