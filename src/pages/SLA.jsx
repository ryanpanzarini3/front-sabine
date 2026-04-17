import { useState } from 'react';
import { slaConfigs as initialData } from '../data/mockData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus, Pencil, Clock } from 'lucide-react';
import { getPriorityLabel } from '../utils/helpers';

export default function SLA() {
  const [data, setData] = useState(initialData);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', priority: 'media', responseTime: 4, resolutionTime: 24 });
  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  function openCreate() { setForm({ name: '', priority: 'media', responseTime: 4, resolutionTime: 24 }); setModal({ mode: 'create' }); }
  function openEdit(d) { setForm({ ...d }); setModal({ mode: 'edit', id: d.id }); }

  function save() {
    const entry = { ...form, responseTime: parseInt(form.responseTime), resolutionTime: parseInt(form.resolutionTime) };
    if (modal.mode === 'create') setData(prev => [...prev, { ...entry, id: Date.now() }]);
    else setData(prev => prev.map(d => d.id === modal.id ? { ...d, ...entry } : d));
    setModal(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Configuração de SLA</h1>
          <p className="text-slate-500 text-sm mt-0.5">{data.length} políticas de SLA</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Nova Política</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map(sla => {
          const pri = getPriorityLabel(sla.priority);
          return (
            <Card key={sla.id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Clock size={18} className="text-slate-600" />
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${pri.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} /> {pri.label}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-3">{sla.name}</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Resposta</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-slate-800">{sla.responseTime}</span>
                    <span className="text-xs text-slate-500">horas</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full">
                  <div className={`h-1.5 rounded-full ${pri.dot}`} style={{ width: `${Math.min(100, (sla.responseTime / 10) * 100)}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Resolução</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-slate-800">{sla.resolutionTime}</span>
                    <span className="text-xs text-slate-500">horas</span>
                  </div>
                </div>
              </div>
              <button onClick={() => openEdit(sla)} className="flex items-center gap-1.5 mt-4 px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 w-full justify-center">
                <Pencil size={12} /> Editar
              </button>
            </Card>
          );
        })}
      </div>

      {modal && (
        <Modal title={modal.mode === 'create' ? 'Nova Política SLA' : 'Editar SLA'} onClose={() => setModal(null)}>
          <form onSubmit={e => { e.preventDefault(); save(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome</label>
              <input required value={form.name} onChange={e => setF('name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Prioridade</label>
              <select value={form.priority} onChange={e => setF('priority', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tempo de Resposta (horas)</label>
                <input required type="number" min="1" value={form.responseTime} onChange={e => setF('responseTime', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tempo de Resolução (horas)</label>
                <input required type="number" min="1" value={form.resolutionTime} onChange={e => setF('resolutionTime', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">{modal.mode === 'create' ? 'Criar' : 'Salvar'}</Button>
              <Button type="button" variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
