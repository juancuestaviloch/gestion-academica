import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todos los videos (con filtros opcionales)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { materiaId, soloPendientes } = req.query;
    
    const videos = await prisma.video.findMany({
      where: {
        ...(materiaId ? { materiaId: Number(materiaId) } : {}),
        ...(soloPendientes === 'true' ? { visto: false } : {}),
      },
      include: {
        materia: {
          select: {
            id: true,
            nombre: true,
            color: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los videos' });
  }
});

// Obtener un video por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: Number(id) },
      include: { materia: true },
    });
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el video' });
  }
});

// Crear un nuevo video
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const nuevoVideo = await prisma.video.create({
      data: {
        materiaId: Number(data.materiaId),
        titulo: data.titulo,
        url: data.url,
        duracion: data.duracion,
        visto: data.visto ?? false,
      },
      include: { materia: true }
    });
    res.status(201).json(nuevoVideo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el video' });
  }
});

// Actualizar un video
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const videoActualizado = await prisma.video.update({
      where: { id: Number(id) },
      data: {
        ...(data.materiaId && { materiaId: Number(data.materiaId) }),
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.url && { url: data.url }),
        ...(data.duracion !== undefined && { duracion: data.duracion }),
        ...(data.visto !== undefined && { visto: data.visto }),
      },
      include: { materia: true },
    });
    res.json(videoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el video' });
  }
});

// Marcar video como visto/no visto
router.patch('/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentVideo = await prisma.video.findUnique({ where: { id: Number(id) } });
    if (!currentVideo) return res.status(404).json({ error: 'Video no encontrado' });

    const toggledVideo = await prisma.video.update({
      where: { id: Number(id) },
      data: { visto: !currentVideo.visto },
      include: { materia: true },
    });
    res.json(toggledVideo);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado del video' });
  }
});

// Eliminar un video
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.video.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el video' });
  }
});

export default router;
