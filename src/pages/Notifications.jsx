import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Bell, AlertTriangle, Clock, Check, CheckCheck } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const navigate = useNavigate();

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notificações</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {unread > 0 ? `${unread} não lida${unread !== 1 ? 's' : ''}` : 'Todas lidas'}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="secondary" onClick={markAllRead}>
            <CheckCheck size={16} /> Marcar todas como lidas
          </Button>
        )}
      </div>

      <Card>
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors cursor-pointer
                  ${!n.read ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'}`}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.ticketId) navigate(`/chamados/${n.ticketId}`);
                }}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5
                  ${n.type === 'violacao' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                  {n.type === 'violacao'
                    ? <AlertTriangle size={17} className="text-red-600" />
                    : <Clock size={17} className="text-yellow-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-medium ${!n.read ? 'text-slate-800' : 'text-slate-600'}`}>{n.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(n.date)}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                  {n.ticketId && (
                    <span className="inline-block mt-1 text-xs font-mono text-blue-600">{n.ticketId}</span>
                  )}
                </div>
                {n.read && (
                  <Check size={14} className="text-slate-300 flex-shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
