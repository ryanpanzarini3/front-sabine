import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getSLAStatus, getSLALabel, getPriorityLabel, getStatusLabel, formatDate } from '../utils/helpers';
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 8;

export default function TicketList() {
  const { tickets, users } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);

  const filtered = tickets.filter(t => {
    const matchSearch = !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const matchStatus = !filterStatus || t.status === filterStatus;
    const matchPriority = !filterPriority || t.priority === filterPriority;
    const matchCategory = !filterCategory || t.category === filterCategory;
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getUserName = (id) => users.find(u => u.id === id)?.name || '—';

  function resetFilters() {
    setSearch(''); setFilterStatus(''); setFilterPriority(''); setFilterCategory('');
    setPage(1);
  }

  const categories = [...new Set(tickets.map(t => t.category))];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chamados</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length} chamado{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => navigate('/chamados/novo')}>
          <Plus size={16} /> Novo Chamado
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por ID ou assunto..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Todos os status</option>
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="aguardando">Aguardando</option>
            <option value="resolvido">Resolvido</option>
            <option value="fechado">Fechado</option>
          </select>
          <select value={filterPriority} onChange={e => { setFilterPriority(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Todas as prioridades</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
          <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Todas as categorias</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(search || filterStatus || filterPriority || filterCategory) && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>Limpar filtros</Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['ID', 'Assunto', 'Cliente', 'Atendente', 'Prioridade', 'Status', 'SLA', 'Abertura'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Filter size={32} className="mx-auto mb-2 opacity-40" />
                    Nenhum chamado encontrado
                  </td>
                </tr>
              ) : paginated.map(ticket => {
                const slaStatus = getSLAStatus(ticket.slaResolutionDeadline);
                const sla = getSLALabel(slaStatus);
                const pri = getPriorityLabel(ticket.priority);
                const sta = getStatusLabel(ticket.status);
                return (
                  <tr key={ticket.id} onClick={() => navigate(`/chamados/${ticket.id}`)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors group">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{ticket.id}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="font-medium text-slate-800 line-clamp-1 group-hover:text-blue-700">{ticket.subject}</span>
                      <span className="text-xs text-slate-400 block">{ticket.category}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{getUserName(ticket.clientId)}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{getUserName(ticket.attendantId)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${pri.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} /> {pri.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${sta.color}`}>{sta.label}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sla.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${sla.dot}`} /> {sla.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">{formatDate(ticket.openedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors
                    ${p === page ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
