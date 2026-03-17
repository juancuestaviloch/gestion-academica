import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todos los exámenes (ordenados por fecha)
router.get('/', async (req, res) => {
  try {
    const { materiaId, proximos } = req.query;
    const where: any = {};

    if (materiaId) {
      where.materiaId = parseInt(materiaId as string);
    }

    if (proximos === 'true') {
      where.fecha = { gte: new Date() };
    }

    const examenes = await prisma.examen.findMany({
      where,
      include: { materia: { select: { id: true, nombre: true, color: true } } },
      orderBy: { fecha: 'asc' },
    });
    res.json(examenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener exámenes' });
  }
});

// Obtener un examen por ID
router.get('/:id', async (req, res) => {
  try {
    const examen = await prisma.examen.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
    });
    if (!examen) {
      return res.status(404).json({ error: 'Examen no encontrado' });
    }
    res.json(examen);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener examen' });
  }
});

// Crear examen
router.post('/', async (req, res) => {
  try {
    const { materiaId, fecha, tipo, aula, notas, nota } = req.body;
    const examen = await prisma.examen.create({
      data: {
        materiaId,
        fecha: new Date(fecha),
        tipo,
        aula,
        notas,
        nota: nota !== undefined ? parseFloat(nota) : undefined,
      },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
    });
    res.status(201).json(examen);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear examen' });
  }
});

// Actualizar examen
router.put('/:id', async (req, res) => {
  try {
    const { materiaId, fecha, tipo, aula, notas, nota } = req.body;
    const examen = await prisma.examen.update({
      where: { id: parseInt(req.params.id) },
      data: {
        materiaId,
        fecha: fecha ? new Date(fecha) : undefined,
        tipo,
        aula,
        notas,
        nota: nota !== undefined ? parseFloat(nota) : undefined,
      },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
    });
    res.json(examen);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar examen' });
  }
});

// Eliminar examen
router.delete('/:id', async (req, res) => {
  try {
    await prisma.examen.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Examen eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar examen' });
  }
});

export default router;
