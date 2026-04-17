import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Ticket, Users, Tag, Clock, Building2, Bell, ChevronRight, X
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chamados', icon: Ticket, label: 'Chamados' },
  { to: '/usuarios', icon: Users, label: 'Usuários' },
  { to: '/categorias', icon: Tag, label: 'Categorias' },
  { to: '/sla', icon: Clock, label: 'SLA' },
  { to: '/departamentos', icon: Building2, label: 'Departamentos' },
  { to: '/notificacoes', icon: Bell, label: 'Notificações' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-30 flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Ticket size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">HelpDesk</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 px-6 py-4">
          <p className="text-xs text-slate-500 text-center">HelpDesk v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
