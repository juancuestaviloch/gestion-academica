import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todos los recursos
router.get('/', async (req, res) => {
  try {
    const { materiaId, adquirido } = req.query;
    const resources = await prisma.recursoAcademico.findMany({
      where: {
        materiaId: materiaId ? parseInt(materiaId as string) : undefined,
        adquirido: adquirido !== undefined ? adquirido === 'true' : undefined,
      },
      include: { materia: { select: { nombre: true, color: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recursos' });
  }
});

// Obtener estadísticas financieras
router.get('/stats', async (_req, res) => {
  try {
    const resources = await prisma.recursoAcademico.findMany();
    
    const totalCosto = resources.reduce((acc: number, r: any) => acc + r.costo, 0);
    const totalInvertido = resources.filter((r: any) => r.adquirido).reduce((acc: number, r: any) => acc + r.costo, 0);
    const totalPendiente = totalCosto - totalInvertido;
    
    // Gastos por categoría
    const porCategoria = resources.reduce((acc: Record<string, number>, r: any) => {
      acc[r.tipo] = (acc[r.tipo] || 0) + r.costo;
      return acc;
    }, {});

    // Gastos por materia (solo las que tienen recursos)
    const resourcesByMateria = await prisma.recursoAcademico.findMany({
      include: { materia: { select: { nombre: true } } }
    });
    
    const porMateria = resourcesByMateria.reduce((acc: Record<string, number>, r: any) => {
      const nombre = r.materia.nombre;
      acc[nombre] = (acc[nombre] || 0) + r.costo;
      return acc;
    }, {});

    res.json({
      totalCosto,
      totalInvertido,
      totalPendiente,
      porCategoria,
      porMateria
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Crear recurso
router.post('/', async (req, res) => {
  try {
    const { materiaId, nombre, tipo, costo, adquirido, progreso, url } = req.body;
    const resource = await prisma.recursoAcademico.create({
      data: {
        materiaId: parseInt(materiaId),
        nombre,
        tipo: tipo || 'OTRO',
        costo: parseFloat(costo) || 0,
        adquirido: adquirido || false,
        progreso: progreso || 0,
        url,
      },
      include: { materia: { select: { nombre: true } } },
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear recurso' });
  }
});

// Actualizar recurso
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, tipo, costo, adquirido, progreso, url, materiaId } = req.body;
    const resource = await prisma.recursoAcademico.update({
      where: { id },
      data: {
        nombre,
        tipo,
        costo: costo !== undefined ? parseFloat(costo) : undefined,
        adquirido,
        progreso,
        url,
        materiaId: materiaId ? parseInt(materiaId) : undefined,
      },
    });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar recurso' });
  }
});

// Eliminar recurso
router.delete('/:id', async (req, res) => {
  try {
    await prisma.recursoAcademico.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Recurso eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar recurso' });
  }
});

export default router;
