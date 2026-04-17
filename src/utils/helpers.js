export function getSLAStatus(deadline) {
  if (!deadline) return 'ok';
  const now = new Date();
  const d = new Date(deadline);
  const diff = d - now;
  if (diff < 0) return 'violado';
  if (diff < 2 * 3600000) return 'alerta';
  return 'ok';
}

export function getSLALabel(status) {
  if (status === 'violado') return { label: 'Atrasado', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
  if (status === 'alerta') return { label: 'Próximo', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' };
  return { label: 'No Prazo', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
}

export function getPriorityLabel(p) {
  const map = {
    critica: { label: 'Crítica', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    alta: { label: 'Alta', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
    media: { label: 'Média', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    baixa: { label: 'Baixa', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  };
  return map[p] || map.baixa;
}

export function getStatusLabel(s) {
  const map = {
    aberto: { label: 'Aberto', color: 'bg-blue-100 text-blue-700' },
    em_andamento: { label: 'Em Andamento', color: 'bg-purple-100 text-purple-700' },
    aguardando: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-700' },
    resolvido: { label: 'Resolvido', color: 'bg-green-100 text-green-700' },
    fechado: { label: 'Fechado', color: 'bg-slate-100 text-slate-600' },
  };
  return map[s] || map.aberto;
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}
