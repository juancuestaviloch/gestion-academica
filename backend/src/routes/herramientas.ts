import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener historial de cálculos
router.get('/', async (req, res) => {
  try {
    const calculos = await prisma.calculo.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(calculos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cálculos' });
  }
});

// Guardar un nuevo cálculo
router.post('/', async (req, res) => {
  try {
    const { nombre, tipo, formula, entradas, resultado } = req.body;
    const calculo = await prisma.calculo.create({
      data: {
        nombre,
        tipo,
        formula,
        entradas: JSON.stringify(entradas),
        resultado
      }
    });
    res.status(201).json(calculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el cálculo' });
  }
});

// Eliminar un cálculo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.calculo.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el cálculo' });
  }
});

export default router;
