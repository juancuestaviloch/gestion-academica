import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  GraduationCap,
  Bell,
  Zap,
  LayoutGrid,
  Wallet,
  Wrench,
  Menu,
  X,
  ChevronLeft,
  MoreHorizontal
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Hoy', icon: LayoutDashboard },
  { path: '/materias', label: 'Materias', icon: BookOpen },
  { path: '/calendario', label: 'Calendario', icon: Calendar },
  { path: '/apuntes', label: 'Pizarrón', icon: StickyNote },
  { path: '/plan', label: 'Plan de Estudios', icon: LayoutGrid },
  { path: '/focus', label: 'Focus Mode', icon: Zap },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/flashcards', label: 'Flashcards', icon: Brain },
  { path: '/asistencia', label: 'Asistencia', icon: UserCheck },
  { path: '/finanzas', label: 'Presupuesto', icon: Wallet },
  { path: '/herramientas', label: 'Herramientas', icon: Wrench },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    notificacionesAPI.getAll().then(setNotificaciones).catch(console.error);
    const interval = setInterval(() => {
      notificacionesAPI.getAll().then(setNotificaciones).catch(console.error);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isHome = location.pathname === '/';
  const currentPage = navItems.find((item) => item.path === location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Desktop/Mobile */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-50 border-r border-slate-100 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-slate-900 font-black text-sm tracking-tight leading-none truncate">UniTrack</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gestión Central</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all group ${
                    isActive
                      ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-100'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                  }`
                }
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-slate-900' : 'group-hover:scale-110'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="flex items-center gap-3 px-2 py-3 rounded-2xl bg-white ring-1 ring-slate-100">
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">
               JC
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">Juan José</p>
                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">Plan 2024</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 lg:px-10 py-4 flex items-center justify-between shrink-0 leading-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            {!isHome && (
              <button 
                onClick={() => navigate(-1)}
                className="hidden sm:flex p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="text-slate-900 font-black text-sm sm:text-base tracking-tight truncate leading-none">
                {currentPage?.label || 'Panel'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2.5 rounded-2xl text-slate-400 hover:bg-slate-50 relative transition-all active:scale-95 border border-transparent hover:border-slate-100"
            >
              <Bell className="w-5 h-5" />
              {notificaciones.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary-600 border-2 border-white rounded-full" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 pb-32 lg:pb-12 animate-fade-in">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation (Always simplified) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-8 py-4 flex items-center justify-between pb-safe-offset-4">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
            <LayoutDashboard className="w-6 h-6 shrink-0" />
          </NavLink>
          <NavLink to="/materias" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
            <BookOpen className="w-6 h-6 shrink-0" />
          </NavLink>
          <NavLink to="/calendario" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
            <Calendar className="w-6 h-6 shrink-0" />
          </NavLink>
          <NavLink to="/plan" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
             <LayoutGrid className="w-6 h-6 shrink-0" />
          </NavLink>
        </div>
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
