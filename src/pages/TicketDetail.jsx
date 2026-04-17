import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getSLAStatus, getSLALabel, getPriorityLabel, getStatusLabel, formatDate, timeAgo } from '../utils/helpers';
import {
  ArrowLeft, Send, Lock, Globe, Paperclip, User, Clock, AlertTriangle,
  Check, ChevronDown, Calendar
} from 'lucide-react';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, users, user, updateTicket, addMessage } = useApp();

  const ticket = tickets.find(t => t.id === id);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('public');
  const [showHistory, setShowHistory] = useState(true);

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Chamado não encontrado.</p>
        <Button onClick={() => navigate('/chamados')} className="mt-4">Voltar</Button>
      </div>
    );
  }

  const getUser = (uid) => users.find(u => u.id === uid);
  const client = getUser(ticket.clientId);
  const attendant = getUser(ticket.attendantId);

  const slaResponseStatus = getSLAStatus(ticket.slaResponseDeadline);
  const slaResolutionStatus = getSLAStatus(ticket.slaResolutionDeadline);
  const slaRes = getSLALabel(slaResolutionStatus);
  const slaRsp = getSLALabel(slaResponseStatus);
  const pri = getPriorityLabel(ticket.priority);
  const sta = getStatusLabel(ticket.status);

  function sendMessage() {
    if (!message.trim()) return;
    addMessage(ticket.id, { userId: user.id, type: msgType, text: message });
    setMessage('');
  }

  function changeStatus(status) {
    const historyEntry = { id: ticket.history.length + 1, type: 'status', from: ticket.status, to: status, userId: user.id, date: new Date().toISOString() };
    updateTicket(ticket.id, {
      status,
      history: [...ticket.history, historyEntry],
      ...(status === 'fechado' || status === 'resolvido' ? { closedAt: new Date().toISOString() } : {}),
    });
  }

  function changeAttendant(attendantId) {
    const newAttendant = getUser(parseInt(attendantId));
    if (!newAttendant) return;
    const historyEntry = { id: ticket.history.length + 1, type: 'atribuicao', from: attendant?.name, to: newAttendant.name, userId: user.id, date: new Date().toISOString() };
    updateTicket(ticket.id, { attendantId: parseInt(attendantId), history: [...ticket.history, historyEntry] });
  }

  function changePriority(priority) {
    updateTicket(ticket.id, { priority });
  }

  const statusOptions = [
    { value: 'aberto', label: 'Aberto' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'aguardando', label: 'Aguardando' },
    { value: 'resolvido', label: 'Resolvido' },
    { value: 'fechado', label: 'Fechado' },
  ];

  const priorityOptions = [
    { value: 'critica', label: 'Crítica' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Média' },
    { value: 'baixa', label: 'Baixa' },
  ];

  const attendants = users.filter(u => u.role === 'atendente' || u.role === 'admin');

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/chamados')} className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-slate-400">{ticket.id}</span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${sta.color}`}>{sta.label}</span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${pri.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} /> {pri.label}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mt-0.5">{ticket.subject}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_280px] gap-5">
        {/* LEFT: Ticket info */}
        <div className="space-y-4">
          <Card className="p-4 space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Informações</h3>

            <div>
              <p className="text-xs text-slate-400 mb-1">Descrição</p>
              <p className="text-sm text-slate-700 leading-relaxed">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-1">Categoria</p>
                <p className="font-medium text-slate-700">{ticket.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Canal</p>
                <p className="font-medium text-slate-700 capitalize">{ticket.channel}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1">Cliente</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">
                  {client?.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{client?.name}</p>
                  <p className="text-xs text-slate-400">{client?.email}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* SLA */}
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">SLA</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={14} />
                  <span>1ª Resposta</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${slaRsp.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${slaRsp.dot}`} /> {slaRsp.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 pl-5">Prazo: {formatDate(ticket.slaResponseDeadline)}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <AlertTriangle size={14} />
                  <span>Resolução</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${slaRes.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${slaRes.dot}`} /> {slaRes.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 pl-5">Prazo: {formatDate(ticket.slaResolutionDeadline)}</p>
            </div>
          </Card>

          {/* Dates */}
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Datas</h3>
            {[
              { label: 'Abertura', value: ticket.openedAt },
              { label: '1ª Resposta', value: ticket.firstResponseAt },
              { label: 'Fechamento', value: ticket.closedAt },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5"><Calendar size={13} />{label}</span>
                <span className="text-slate-700 font-medium text-xs">{formatDate(value)}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* CENTER: Chat */}
        <Card className="flex flex-col min-h-[500px]">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">Interações</h3>
            <p className="text-xs text-slate-400">{ticket.messages.length} mensagem{ticket.messages.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {ticket.messages.map(msg => {
              const sender = getUser(msg.userId);
              const isInternal = msg.type === 'internal';
              const isMe = msg.userId === user.id;
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 
                    ${isMe ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {sender?.avatar || '?'}
                  </div>
                  <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs font-medium text-slate-700">{sender?.name}</span>
                      {isInternal && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Lock size={9} /> Interno
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{timeAgo(msg.createdAt)}</span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed 
                      ${isInternal
                        ? 'bg-amber-50 border border-amber-200 text-amber-900'
                        : isMe
                          ? 'bg-blue-600 text-white rounded-tr-sm'
                          : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply box */}
          <div className="border-t border-slate-100 p-4 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setMsgType('public')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${msgType === 'public' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}>
                <Globe size={13} /> Pública
              </button>
              <button
                onClick={() => setMsgType('internal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${msgType === 'internal' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-100'}`}>
                <Lock size={13} /> Interna
              </button>
            </div>
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={msgType === 'internal' ? 'Nota interna (equipe)...' : 'Responder ao cliente...'}
                rows={3}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-col gap-2">
                <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 border border-slate-200">
                  <Paperclip size={16} />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* RIGHT: Controls */}
        <div className="space-y-4">
          <Card className="p-4 space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Controles</h3>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Atribuir Atendente</label>
              <select
                value={ticket.attendantId || ''}
                onChange={e => changeAttendant(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Sem atendente</option>
                {attendants.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Status</label>
              <div className="grid grid-cols-1 gap-1.5">
                {statusOptions.map(opt => {
                  const s = getStatusLabel(opt.value);
                  return (
                    <button key={opt.value} onClick={() => changeStatus(opt.value)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-colors
                        ${ticket.status === opt.value ? `${s.color} border-current` : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {opt.label}
                      {ticket.status === opt.value && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Prioridade</label>
              <div className="grid grid-cols-2 gap-1.5">
                {priorityOptions.map(opt => {
                  const p = getPriorityLabel(opt.value);
                  return (
                    <button key={opt.value} onClick={() => changePriority(opt.value)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors
                        ${ticket.priority === opt.value ? `${p.color} border-current` : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} /> {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* History */}
          <Card className="p-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between font-semibold text-slate-700 text-sm uppercase tracking-wide"
            >
              Histórico
              <ChevronDown size={16} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </button>
            {showHistory && (
              <div className="mt-3 space-y-3">
                {ticket.history.slice().reverse().map(entry => {
                  const actor = getUser(entry.userId);
                  return (
                    <div key={entry.id} className="flex gap-2.5">
                      <div className="relative flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          {entry.type === 'status' ? <AlertTriangle size={11} className="text-slate-500" /> : <User size={11} className="text-slate-500" />}
                        </div>
                        <div className="w-0.5 flex-1 bg-slate-100 mt-1" />
                      </div>
                      <div className="pb-3 min-w-0">
                        <p className="text-xs text-slate-700">
                          {entry.type === 'status' ? (
                            <>Status alterado para <span className="font-medium">{getStatusLabel(entry.to).label}</span></>
                          ) : (
                            <>Atribuído a <span className="font-medium">{entry.to}</span></>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          por {actor?.name} · {timeAgo(entry.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Attachments */}
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Anexos</h3>
            {ticket.attachments.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                <Paperclip size={20} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">Nenhum anexo</p>
                <button className="mt-2 text-xs text-blue-600 hover:underline">Adicionar arquivo</button>
              </div>
            ) : (
              ticket.attachments.map((att, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Paperclip size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-700 flex-1 truncate">{att.name}</span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
