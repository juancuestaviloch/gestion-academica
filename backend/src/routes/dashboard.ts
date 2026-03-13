import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Dashboard: obtener resumen general
router.get('/', async (_req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Días de la semana en español
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoyDia = diasSemana[now.getDay()];

    // Clases de hoy (basado en horarios de materias cursando)
    const materiasConHorarios = await prisma.materia.findMany({
      where: { estado: 'Cursando' },
      include: {
        horarios: {
          where: { diaSemana: hoyDia },
        },
      },
    });
    const clasesHoy = materiasConHorarios
      .filter((m) => m.horarios.length > 0)
      .map((m) => ({
        materiaId: m.id,
        materia: m.nombre,
        color: m.color,
        horarios: m.horarios.map((h) => ({
          horaInicio: h.horaInicio,
          horaFin: h.horaFin,
        })),
      }));

    // Exámenes próximos (7 días)
    const examenesProximos = await prisma.examen.findMany({
      where: {
        fecha: { gte: now, lte: in7Days },
      },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
      orderBy: { fecha: 'asc' },
    });

    // Tareas urgentes (pendientes o en progreso, ordenadas por fecha límite)
    const tareasUrgentes = await prisma.tarea.findMany({
      where: {
        estado: { in: ['Pendiente', 'En progreso'] },
        fechaLimite: { gte: todayStart },
      },
      include: { materia: { select: { id: true, nombre: true, color: true } } },
      orderBy: { fechaLimite: 'asc' },
      take: 5,
    });

    // Estadísticas generales
    const totalMaterias = await prisma.materia.count();
    const materiasCursando = await prisma.materia.count({ where: { estado: 'Cursando' } });
    const materiasAprobadas = await prisma.materia.count({ where: { estado: 'Aprobada' } });
    const materiasPendientes = await prisma.materia.count({ where: { estado: 'Pendiente' } });

    const totalTareas = await prisma.tarea.count();
    const tareasEntregadas = await prisma.tarea.count({ where: { estado: 'Entregada' } });

    // Asistencia promedio global
    const todasAsistencias = await prisma.asistencia.findMany();
    const totalAsistencias = todasAsistencias.length;
    const presentes = todasAsistencias.filter((a) => a.presente).length;
    const asistenciaPromedio = totalAsistencias > 0 ? Math.round((presentes / totalAsistencias) * 100) : 100;

    // Cálculo de Racha de Estudio (Streaks) basándose en interacciones de los últimos meses
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [actTareas, actAsist, actApuntes] = await Promise.all([
      prisma.tarea.findMany({ where: { estado: 'Entregada', updatedAt: { gte: last30Days } }, select: { updatedAt: true } }),
      prisma.asistencia.findMany({ where: { presente: true, fecha: { gte: last30Days } }, select: { fecha: true } }),
      prisma.apunte.findMany({ where: { createdAt: { gte: last30Days } }, select: { createdAt: true } })
    ]);

    const activeDates = new Set<string>();
    [...actTareas.map(t => t.updatedAt), ...actAsist.map(a => a.fecha), ...actApuntes.map(a => a.createdAt)].forEach(d => {
      activeDates.add(new Date(d).toISOString().split('T')[0]);
    });

    let rachaEstudio = 0;
    let checkDate = new Date();
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (activeDates.has(dateStr)) {
        rachaEstudio++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Permitimos que hoy no tenga actividad sin perder la racha de ayer
        if (rachaEstudio === 0 && checkDate.toISOString().split('T')[0] === now.toISOString().split('T')[0]) {
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Eventos de hoy
    const eventosHoy = await prisma.evento.findMany({
      where: {
        fecha: { gte: todayStart, lte: todayEnd },
      },
      orderBy: { fecha: 'asc' },
    });

    res.json({
      clasesHoy,
      examenesProximos,
      tareasUrgentes,
      eventosHoy,
      estadisticas: {
        totalMaterias,
        materiasCursando,
        materiasAprobadas,
        materiasPendientes,
        totalTareas,
        tareasEntregadas,
        asistenciaPromedio,
        rachaEstudio,
      },
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({ error: 'Error al obtener datos del dashboard' });
  }
});

export default router;
