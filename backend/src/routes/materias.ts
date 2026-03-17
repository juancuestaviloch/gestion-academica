import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todas las materias
router.get('/', async (_req, res) => {
  try {
    const materias = await prisma.materia.findMany({
      include: { horarios: true, bibliografia: true },
      orderBy: { nombre: 'asc' },
    });
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materias' });
  }
});

// Obtener una materia por ID
router.get('/:id', async (req, res) => {
  try {
    const materia = await prisma.materia.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        horarios: true,
        bibliografia: true,
        examenes: { orderBy: { fecha: 'asc' } },
        tareas: { orderBy: { fechaLimite: 'asc' } },
        asistencias: { orderBy: { fecha: 'desc' } },
        apuntes: { orderBy: { createdAt: 'desc' } },
        videos: { orderBy: { createdAt: 'desc' } },
        flashcards: { orderBy: { proximoRepaso: 'asc' } },
      },
    });
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materia' });
  }
});

// Crear materia
router.post('/', async (req, res) => {
  try {
    const { nombre, profesor, estado, color, horarios, bibliografia } = req.body;
    const materia = await prisma.materia.create({
      data: {
        nombre,
        profesor,
        estado: estado || 'Cursando',
        color: color || '#4F46E5',
        horarios: horarios ? { create: horarios } : undefined,
        bibliografia: bibliografia ? { create: bibliografia } : undefined,
      },
      include: { horarios: true, bibliografia: true },
    });
    res.status(201).json(materia);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear materia' });
  }
});

// Actualizar materia
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, profesor, estado, color, horarios, bibliografia } = req.body;

    // Actualizar datos base
    const materia = await prisma.materia.update({
      where: { id },
      data: { nombre, profesor, estado, color },
    });

    // Si se envían horarios, reemplazar todos
    if (horarios !== undefined) {
      await prisma.horario.deleteMany({ where: { materiaId: id } });
      if (horarios.length > 0) {
        await prisma.horario.createMany({
          data: horarios.map((h: any) => ({ ...h, materiaId: id })),
        });
      }
    }

    // Si se envía bibliografía, reemplazar toda
    if (bibliografia !== undefined) {
      await prisma.bibliografia.deleteMany({ where: { materiaId: id } });
      if (bibliografia.length > 0) {
        await prisma.bibliografia.createMany({
          data: bibliografia.map((b: any) => ({ ...b, materiaId: id })),
        });
      }
    }

    const updated = await prisma.materia.findUnique({
      where: { id },
      include: { horarios: true, bibliografia: true },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar materia' });
  }
});

// Eliminar materia
router.delete('/:id', async (req, res) => {
  try {
    await prisma.materia.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Materia eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar materia' });
  }
});

export default router;
