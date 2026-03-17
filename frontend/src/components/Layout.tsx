import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notificacionesAPI } from '../api';
import {
  LayoutDashboard,
  BarChart3,
  Brain,
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
  Zap,
  TrendingUp,
  LayoutGrid,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/flashcards', label: 'Flashcards', icon: Brain },
  { path: '/materias', label: 'Materias', icon: BookOpen },
  { path: '/calendario', label: 'Calendario', icon: Calendar },
  { path: '/examenes', label: 'Exámenes', icon: FileText },
  { path: '/tareas', label: 'Tareas', icon: CheckSquare },
  { path: '/asistencia', label: 'Asistencia', icon: UserCheck },
  { path: '/apuntes', label: 'Apuntes', icon: StickyNote },
  { path: '/videos', label: 'Videos', icon: PlaySquare },
  { path: '/metas', label: 'Metas', icon: Target },
  { path: '/roadmap', label: 'Proyección', icon: TrendingUp },
  { path: '/plan', label: 'Plan de Estudios', icon: LayoutGrid },
  { path: '/focus', label: 'Focus', icon: Zap },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    notificacionesAPI.getAll().then(setNotificaciones).catch(console.error);
    // Refrezcar cada 5 minutos
    const interval = setInterval(() => {
      notificacionesAPI.getAll().then(setNotificaciones).catch(console.error);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface-sidebar transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full lg:translate-x-0'
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
                  `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-600/20 text-white translate-x-1'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary-400' : ''}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute left-0 w-1 h-5 bg-primary-500 rounded-full animate-fade-in" />
                    )}
                  </>
                )}
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
          <div className="flex-1 lg:flex-none">
            <h2 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight truncate">
              {currentPage?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-2 mt-0.5 opacity-60">
              <Calendar className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              <p className="text-[10px] lg:text-xs font-medium capitalize">
                {new Date().toLocaleDateString('es-AR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative transition-all active:scale-95"
            >
              <Bell className="w-5 h-5 lg:w-6 h-6" />
              {notificaciones.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
              )}
            </button>
            
            {/* ... (Panel de Notificaciones queda igual) ... */}
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="animate-fade-in max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Bottom Navigation (Solo Mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200 px-6 py-3 flex items-center justify-between pb-safe">
          {/* Dashboard, Materias, Calendario, Focus, Tareas */}
          {[navItems[0], navItems[1], navItems[2], navItems[9], navItems[4]].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-bold">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-primary-600 rounded-full animate-pop-in" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* FAB (Botón de Acción Rápida - Floating Action Button) */}
        <button className="lg:hidden fixed right-6 bottom-24 w-14 h-14 rounded-full bg-primary-600 text-white shadow-premium flex items-center justify-center active:scale-90 transition-all z-40">
          <GraduationCap className="w-6 h-6" />
        </button>
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
