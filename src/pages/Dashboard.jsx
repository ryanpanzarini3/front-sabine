import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { getSLAStatus, getSLALabel, getPriorityLabel, getStatusLabel, formatDate } from '../utils/helpers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Ticket, AlertTriangle, CheckCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { tickets } = useApp();
  const navigate = useNavigate();

  const open = tickets.filter(t => t.status === 'aberto').length;
  const inProgress = tickets.filter(t => t.status === 'em_andamento').length;
  const closed = tickets.filter(t => ['resolvido', 'fechado'].includes(t.status)).length;
  const violated = tickets.filter(t => getSLAStatus(t.slaResolutionDeadline) === 'violado' && !['resolvido','fechado'].includes(t.status)).length;

  const priorityData = [
    { name: 'Crítica', value: tickets.filter(t => t.priority === 'critica').length, color: '#ef4444' },
    { name: 'Alta', value: tickets.filter(t => t.priority === 'alta').length, color: '#f97316' },
    { name: 'Média', value: tickets.filter(t => t.priority === 'media').length, color: '#eab308' },
    { name: 'Baixa', value: tickets.filter(t => t.priority === 'baixa').length, color: '#22c55e' },
  ];

  const statusData = [
    { name: 'Aberto', value: tickets.filter(t => t.status === 'aberto').length, color: '#3b82f6' },
    { name: 'Em Andamento', value: tickets.filter(t => t.status === 'em_andamento').length, color: '#8b5cf6' },
    { name: 'Aguardando', value: tickets.filter(t => t.status === 'aguardando').length, color: '#eab308' },
    { name: 'Resolvido', value: tickets.filter(t => t.status === 'resolvido').length, color: '#22c55e' },
    { name: 'Fechado', value: tickets.filter(t => t.status === 'fechado').length, color: '#94a3b8' },
  ];

  const metrics = [
    { label: 'Chamados Abertos', value: open, icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Em Andamento', value: inProgress, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { label: 'Resolvidos/Fechados', value: closed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'SLA Violado', value: violated, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  ];

  const recent = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Visão geral dos chamados e SLA</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, color, bg, border }) => (
          <Card key={label} className={`p-5 border ${border}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${bg}`}>
                <Icon size={20} className={color} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
              <TrendingUp size={12} />
              <span>Total de {tickets.length} chamados</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Chamados por Prioridade</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Bar dataKey="value" name="Chamados" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Chamados por Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent tickets */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-700">Chamados Recentes</h3>
          <button
            onClick={() => navigate('/chamados')}
            className="text-blue-600 text-sm hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">ID</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Assunto</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Prioridade</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">SLA</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Abertura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map(ticket => {
                const slaStatus = getSLAStatus(ticket.slaResolutionDeadline);
                const sla = getSLALabel(slaStatus);
                const pri = getPriorityLabel(ticket.priority);
                const sta = getStatusLabel(ticket.status);
                return (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/chamados/${ticket.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{ticket.id}</td>
                    <td className="px-5 py-3 font-medium text-slate-800 max-w-xs">
                      <span className="line-clamp-1">{ticket.subject}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${pri.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
                        {pri.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${sta.color}`}>{sta.label}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sla.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sla.dot}`} />
                        {sla.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{formatDate(ticket.openedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
