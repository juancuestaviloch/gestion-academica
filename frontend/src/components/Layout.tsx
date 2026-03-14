import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  CheckSquare,
  UserCheck,
  StickyNote,
  Target,
  Menu,
  X,
  GraduationCap,
  PlaySquare,
  Bell,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/materias', label: 'Materias', icon: BookOpen },
  { path: '/calendario', label: 'Calendario', icon: Calendar },
  { path: '/examenes', label: 'Exámenes', icon: FileText },
  { path: '/tareas', label: 'Tareas', icon: CheckSquare },
  { path: '/asistencia', label: 'Asistencia', icon: UserCheck },
  { path: '/apuntes', label: 'Apuntes', icon: StickyNote },
  { path: '/videos', label: 'Videos', icon: PlaySquare },
  { path: '/metas', label: 'Metas', icon: Target },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find((item) => item.path === location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface-sidebar transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">UniTrack</h1>
            <p className="text-primary-300 text-xs">Gestión Académica</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-indigo-600 flex flex-col items-center justify-center text-white text-sm font-bold shadow-md shadow-black/20">
              JC
            </div>
            <div>
              <p className="text-white text-sm font-semibold truncate max-w-[150px]" title="Juan José Cuesta Viloch">Juan José</p>
              <p className="text-primary-300 text-xs truncate max-w-[150px]" title="Licenciatura en Administración">Lic. en Administración</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {currentPage?.label || 'Dashboard'}
            </h2>
            <p className="text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 relative">
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative transition-all active:scale-95"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
            </button>

            {/* Panel de Notificaciones Dropdown */}
            {notifOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNotifOpen(false)} 
                />
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">Notificaciones</h3>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    <NotificationItem 
                      title="Examen Próximo" 
                      desc="Parcial de Introducción a la Economía" 
                      time="En 4 días" 
                      type="warning" 
                    />
                    <NotificationItem 
                      title="Tarea Pendiente" 
                      desc="TP Matematica 1 - Integración" 
                      time="Mañana" 
                      type="error" 
                    />
                    <NotificationItem 
                      title="Clase por Empezar" 
                      desc="Matemática II empieza a las 11:00" 
                      time="En 45 min" 
                      type="info" 
                    />
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                    <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">Ver todas</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

function NotificationItem({ title, desc, time, type }: { title: string, desc: string, time: string, type: 'warning' | 'error' | 'info' }) {
  const colors = {
    warning: 'bg-amber-100 text-amber-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600'
  };

  return (
    <div className="px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
      <div className="flex gap-4">
        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${type === 'error' ? 'animate-ping bg-red-400' : 'bg-gray-300'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{title}</p>
          <p className="text-sm text-gray-500 line-clamp-2">{desc}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}
