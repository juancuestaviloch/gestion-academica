import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  try {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const notifications = [];

    // 1. Exámenes próximos (Próximos 7 días)
    const examenes = await prisma.examen.findMany({
      where: {
        fecha: { gte: now, lte: in7Days },
      },
      include: { materia: true },
      orderBy: { fecha: 'asc' },
    });

    for (const examen of examenes) {
      const diffDays = Math.ceil((examen.fecha.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      notifications.push({
        id: `exam-${examen.id}`,
        title: 'Examen Próximo',
        desc: `${examen.tipo} de ${examen.materia.nombre}`,
        time: diffDays === 0 ? 'Hoy' : diffDays === 1 ? 'Mañana' : `En ${diffDays} días`,
        type: 'warning',
        date: examen.fecha,
      });
    }

    // 2. Tareas urgentes (Próximas 48 horas)
    const tareas = await prisma.tarea.findMany({
      where: {
        estado: { in: ['Pendiente', 'En progreso'] },
        fechaLimite: { gte: now, lte: new Date(now.getTime() + 48 * 60 * 60 * 1000) },
      },
      include: { materia: true },
    });

    for (const tarea of tareas) {
      const diffHours = Math.ceil((tarea.fechaLimite.getTime() - now.getTime()) / (1000 * 60 * 60));
      notifications.push({
        id: `task-${tarea.id}`,
        title: 'Tarea Urgente',
        desc: `${tarea.titulo} (${tarea.materia.nombre})`,
        time: diffHours <= 24 ? `En ${diffHours} horas` : 'Próximamente',
        type: 'error',
        date: tarea.fechaLimite,
      });
    }

    // 3. Clases de hoy (Próximas 2 horas)
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoyDia = diasSemana[now.getDay()];
    const currentHHMM = now.toTimeString().split(' ')[0].substring(0, 5);
    
    // Sumar 2 horas al HH:MM actual
    const plus2HoursDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const plus2HoursHHMM = plus2HoursDate.toTimeString().split(' ')[0].substring(0, 5);

    const materiasHoy = await prisma.materia.findMany({
      where: { estado: 'Cursando' },
      include: {
        horarios: {
          where: { 
            diaSemana: hoyDia,
            horaInicio: { gte: currentHHMM, lte: plus2HoursHHMM }
          },
        },
      },
    });

    for (const materia of materiasHoy) {
      for (const horario of materia.horarios) {
        notifications.push({
          id: `class-${horario.id}`,
          title: 'Clase por empezar',
          desc: `${materia.nombre} en ${(horario as any).aula || 'Aula a confirmar'}`,
          time: `A las ${horario.horaInicio}`,
          type: 'info',
          date: new Date(), // Just for sorting
        });
      }
    }

    // Ordenar todas por urgencia (las clases primero, luego tareas, luego exámenes)
    const sortedNotifications = notifications.sort((a, b) => {
      const priority: Record<string, number> = { error: 3, info: 2, warning: 1 };
      return (priority[b.type] || 0) - (priority[a.type] || 0);
    });

    res.json(sortedNotifications.slice(0, 10));
  } catch (error) {
    console.error('Error en notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

export default router;
