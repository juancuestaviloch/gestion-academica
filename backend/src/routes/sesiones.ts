import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todas las sesiones de estudio
router.get('/', async (req, res) => {
  try {
    const { materiaId } = req.query;
    const where: any = {};
    if (materiaId) where.materiaId = parseInt(materiaId as string);

    const sesiones = await prisma.sesionEstudio.findMany({
      where,
      include: { materia: { select: { nombre: true, color: true } } },
      orderBy: { fecha: 'desc' },
    });
    res.json(sesiones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sesiones de estudio' });
  }
});

// Guardar una nueva sesión
router.post('/', async (req, res) => {
  try {
    const { materiaId, duracion } = req.body;
    const sesion = await prisma.sesionEstudio.create({
      data: {
        materiaId: materiaId ? parseInt(materiaId) : null,
        duracion: parseInt(duracion),
      },
    });
    res.status(201).json(sesion);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar sesión de estudio' });
  }
});

export default router;
