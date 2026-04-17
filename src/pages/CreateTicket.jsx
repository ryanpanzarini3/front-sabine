import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { categories, slaConfigs } from '../data/mockData';
import { ArrowLeft, Ticket } from 'lucide-react';

let idCounter = 7;

export default function CreateTicket() {
  const { addTicket, user } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'media',
    channel: 'sistema',
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const selectedCategory = categories.find(c => c.name === form.category);
  const sla = selectedCategory ? slaConfigs.find(s => s.id === selectedCategory.slaId) : null;

  function handleSubmit(e) {
    e.preventDefault();
    const now = new Date();
    const id = `CHM-00${idCounter++}`;
    const ticket = {
      id,
      subject: form.subject,
      description: form.description,
      category: form.category,
      priority: form.priority,
      status: 'aberto',
      channel: form.channel,
      clientId: user.id,
      attendantId: null,
      departmentId: 1,
      slaResponseDeadline: sla ? new Date(now.getTime() + sla.responseTime * 3600000).toISOString() : null,
      slaResolutionDeadline: sla ? new Date(now.getTime() + sla.resolutionTime * 3600000).toISOString() : null,
      openedAt: now.toISOString(),
      firstResponseAt: null,
      closedAt: null,
      messages: [{ id: 1, userId: user.id, type: 'public', text: form.description, createdAt: now.toISOString() }],
      attachments: [],
      history: [{ id: 1, type: 'status', from: null, to: 'aberto', userId: user.id, date: now.toISOString() }],
    };
    addTicket(ticket);
    navigate(`/chamados/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/chamados')} className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Novo Chamado</h1>
          <p className="text-slate-500 text-sm">Preencha as informações abaixo</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assunto *</label>
            <input
              required
              value={form.subject}
              onChange={e => set('subject', e.target.value)}
              placeholder="Descreva brevemente o problema..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição *</label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Descreva detalhadamente o problema, incluindo passos para reproduzir, mensagens de erro, etc."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Categoria *</label>
              <select required value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Selecione...</option>
                {categories.filter(c => c.active).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Prioridade</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Canal de contato</label>
            <div className="flex gap-2 flex-wrap">
              {['sistema', 'email', 'telefone', 'chat'].map(ch => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => set('channel', ch)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize
                    ${form.channel === ch ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* SLA Preview */}
          {sla && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-700 mb-2">SLA Aplicado: {sla.name}</p>
              <div className="grid grid-cols-2 gap-3 text-sm text-blue-600">
                <div>
                  <span className="text-xs block text-blue-500">Prazo de Resposta</span>
                  <span className="font-medium">{sla.responseTime}h</span>
                </div>
                <div>
                  <span className="text-xs block text-blue-500">Prazo de Resolução</span>
                  <span className="font-medium">{sla.resolutionTime}h</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit">
              <Ticket size={16} /> Abrir Chamado
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/chamados')}>Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
