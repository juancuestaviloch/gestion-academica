import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todos los apuntes (con búsqueda global)
router.get('/', async (req, res) => {
  try {
    const { materiaId, busqueda } = req.query;
    const where: any = {};

    if (materiaId) {
      where.materiaId = parseInt(materiaId as string);
    }

    if (busqueda) {
      where.OR = [
        { titulo: { contains: busqueda as string } },
        { contenido: { contains: busqueda as string } },
      ];
    }

    const apuntes = await prisma.apunte.findMany({
      where,
      include: { materia: { select: { id: true, nombre: true, color: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(apuntes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener apuntes' });
  }
});

// Obtener un apunte por ID
router.get('/:id', async (req, res) => {
  try {
    const apunte = await prisma.apunte.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
    });
    if (!apunte) {
      return res.status(404).json({ error: 'Apunte no encontrado' });
    }
    res.json(apunte);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener apunte' });
  }
});

// Crear apunte
router.post('/', async (req, res) => {
  try {
    const { materiaId, titulo, contenido, tipo, url } = req.body;
    const apunte = await prisma.apunte.create({
      data: {
        materiaId,
        titulo,
        contenido,
        tipo: tipo || 'nota',
        url,
      },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
    });
    res.status(201).json(apunte);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear apunte' });
  }
});

// Actualizar apunte
router.put('/:id', async (req, res) => {
  try {
    const { materiaId, titulo, contenido, tipo, url } = req.body;
    const apunte = await prisma.apunte.update({
      where: { id: parseInt(req.params.id) },
      data: { materiaId, titulo, contenido, tipo, url },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
    });
    res.json(apunte);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar apunte' });
  }
});

// Eliminar apunte
router.delete('/:id', async (req, res) => {
  try {
    await prisma.apunte.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Apunte eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar apunte' });
  }
});

export default router;
