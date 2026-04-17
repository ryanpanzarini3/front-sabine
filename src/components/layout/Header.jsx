import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Header({ onMenuClick }) {
  const { user, unreadCount } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 lg:px-6 h-16 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar chamados..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-lg border border-transparent focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
        />
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button
        onClick={() => navigate('/notificacoes')}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* User */}
      <div className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
          {user.avatar}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-800 leading-tight">{user.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
        </div>
        <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
      </div>
    </header>
  );
}
