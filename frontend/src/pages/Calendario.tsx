import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { materiasAPI, examenesAPI, tareasAPI, eventosAPI } from '../api';
import { Materia, CalendarEvent } from '../types';
import Modal from '../components/Modal';

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_MAP: Record<string, number> = {
  Domingo: 0, Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6,
};

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoForm, setEventoForm] = useState({ titulo: '', fecha: '', descripcion: '', color: '#6366F1', esParo: false });

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    const [mats, exams, tasks, evts] = await Promise.all([
      materiasAPI.getAll(),
      examenesAPI.getAll(),
      tareasAPI.getAll(),
      eventosAPI.getAll(),
    ]);
    setMaterias(mats);

    const calEvents: CalendarEvent[] = [];

    // Generar clases desde horarios de materias cursando
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    // Para vista semanal, extender rango
    const rangeStart = view === 'week' ? getWeekStart(currentDate) : startOfMonth;
    const rangeEnd = view === 'week' ? new Date(getWeekStart(currentDate).getTime() + 6 * 86400000) : endOfMonth;

    mats.filter((m: Materia) => m.estado === 'Cursando').forEach((m: Materia) => {
      m.horarios.forEach((h) => {
        const dayNum = DIAS_MAP[h.diaSemana];
        if (dayNum === undefined) return;

        const d = new Date(rangeStart);
        while (d <= rangeEnd) {
          if (d.getDay() === dayNum) {
            calEvents.push({
              id: `clase-${m.id}-${d.toISOString()}`,
              title: m.nombre,
              date: new Date(d),
              color: m.color,
              type: 'clase',
              time: `${h.horaInicio} - ${h.horaFin}`,
              aula: h.aula,
            });
          }
          d.setDate(d.getDate() + 1);
        }
      });
    });

    // Exámenes
    exams.forEach((e: any) => {
      calEvents.push({
        id: `exam-${e.id}`,
        title: `${e.tipo}: ${e.materia.nombre}`,
        date: new Date(e.fecha),
        color: e.materia.color,
        type: 'examen',
      });
    });

    // Tareas
    tasks.forEach((t: any) => {
      calEvents.push({
        id: `task-${t.id}`,
        title: `📋 ${t.titulo}`,
        date: new Date(t.fechaLimite),
        color: t.materia.color,
        type: 'tarea',
      });
    });

    // Eventos manuales
    evts.forEach((e: any) => {
      calEvents.push({
        id: `evt-${e.id}`,
        title: e.titulo,
        date: new Date(e.fecha),
        color: e.esParo ? '#DC2626' : e.color,
        type: 'evento',
        isParo: e.esParo,
      });
    });

    setEvents(calEvents);
  };

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  const navigatePrev = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
    }
  };

  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
    }
  };

  const goToday = () => setCurrentDate(new Date());

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await eventosAPI.create(eventoForm);
    setModalOpen(false);
    setEventoForm({ titulo: '', fecha: '', descripcion: '', color: '#6366F1', esParo: false });
    loadData();
  };

  const getEventsForDate = (date: Date) => events.filter((e) => isSameDay(e.date, date));

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-24 lg:h-28" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayEvents = getEventsForDate(date);
      const isToday = isSameDay(date, today);
      const isStrikeDay = dayEvents.some(e => e.isParo);

      cells.push(
        <div
          key={d}
          onClick={() => { setSelectedDate(date); }}
          className={`h-24 lg:h-28 border p-1 rounded-lg cursor-pointer transition-colors ${
            isStrikeDay 
              ? 'bg-red-50 hover:bg-red-100 border-red-200 shadow-sm shadow-red-100/50' 
              : isToday 
                ? 'bg-primary-50 hover:bg-primary-100 border-primary-200' 
                : 'border-gray-100 hover:bg-gray-50'
          }`}
        >
          <span className={`text-xs font-medium ${isStrikeDay ? 'bg-red-600 text-white px-1.5 py-0.5 rounded-full' : isToday ? 'bg-primary-600 text-white px-1.5 py-0.5 rounded-full' : 'text-gray-600'}`}>
            {d}
          </span>
          <div className="mt-1 space-y-0.5 overflow-hidden">
            {dayEvents.slice(0, 3).map((ev) => (
              <div
                key={ev.id}
                className="text-[10px] leading-tight px-1 py-0.5 rounded truncate text-white font-medium"
                style={{ backgroundColor: ev.color }}
                title={ev.title}
              >
                {ev.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <span className="text-[10px] text-gray-400">+{dayEvents.length - 3} más</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0.5">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-xs font-semibold text-gray-500 text-center py-2">
            {d}
          </div>
        ))}
        {cells}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = getWeekStart(currentDate);
    const today = new Date();
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart.getTime() + i * 86400000);
      const dayEvents = getEventsForDate(date);
      const isToday = isSameDay(date, today);
      const isStrikeDay = dayEvents.some(e => e.isParo);

      days.push(
        <div key={i} className={`flex-1 min-w-0 border-r border-gray-100 last:border-r-0 ${isStrikeDay ? 'bg-red-50/30' : isToday ? 'bg-primary-50/50' : ''}`}>
          <div className={`text-center py-3 border-b border-gray-100 ${isStrikeDay ? 'bg-red-100 border-red-200' : isToday ? 'bg-primary-100' : 'bg-gray-50'}`}>
            <p className={`text-xs font-medium ${isStrikeDay ? 'text-red-600' : 'text-gray-500'}`}>{DIAS_SEMANA[date.getDay()]}</p>
            <p className={`text-lg font-bold ${isStrikeDay ? 'text-red-700' : isToday ? 'text-primary-600' : 'text-gray-900'}`}>
              {date.getDate()}
            </p>
          </div>
          <div className="p-1.5 space-y-1">
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-1.5 rounded-lg text-white text-xs font-medium"
                style={{ backgroundColor: ev.color }}
              >
                <p className="truncate">{ev.title}</p>
                {ev.time && <p className="text-[10px] opacity-80">{ev.time}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex border border-gray-100 rounded-xl overflow-hidden min-h-[400px]">
        {days}
      </div>
    );
  };

  const monthLabel = currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  // Detalle del día seleccionado
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button onClick={navigatePrev} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-bold text-gray-900 capitalize min-w-[180px] text-center">{monthLabel}</h3>
          <button onClick={navigateNext} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={goToday} className="text-sm text-primary-600 hover:text-primary-800 font-medium px-3 py-1 rounded-lg hover:bg-primary-50">
            Hoy
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setView('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              Mes
            </button>
            <button onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              Semana
            </button>
          </div>
          <button onClick={() => { setEventoForm({ ...eventoForm, fecha: new Date().toISOString().split('T')[0] + 'T08:00' }); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Evento
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        {view === 'month' ? renderMonthView() : renderWeekView()}
      </div>

      {/* Detalle del día seleccionado */}
      {selectedDate && selectedEvents.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fade-in">
          <h4 className="font-bold text-gray-900 mb-3">
            {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h4>
          <div className="space-y-2">
            {selectedEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{ev.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {ev.time && <p className="text-xs text-gray-500">{ev.time}</p>}
                    {ev.aula && (
                      <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-medium border border-gray-300">
                        📍 {ev.aula}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  ev.type === 'clase' ? 'bg-blue-100 text-blue-700' :
                  ev.type === 'examen' ? 'bg-red-100 text-red-700' :
                  ev.type === 'tarea' ? 'bg-amber-100 text-amber-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {ev.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal nuevo evento */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Evento">
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" required value={eventoForm.titulo}
              onChange={(e) => setEventoForm({ ...eventoForm, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora</label>
            <input type="datetime-local" required value={eventoForm.fecha}
              onChange={(e) => setEventoForm({ ...eventoForm, fecha: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={eventoForm.descripcion}
              onChange={(e) => setEventoForm({ ...eventoForm, descripcion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              rows={3} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="esParo" checked={eventoForm.esParo}
              onChange={(e) => setEventoForm({ ...eventoForm, esParo: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
            <label htmlFor="esParo" className="text-sm font-medium text-red-600 cursor-pointer">
              Es un día de Paro (Se suspenden clases)
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm">
              Crear Evento
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
