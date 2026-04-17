import { useState } from 'react';
import { categories as initialData, slaConfigs } from '../data/mockData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus, Pencil, PowerOff, Tag } from 'lucide-react';

export default function Categories() {
  const [data, setData] = useState(initialData);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', slaId: 3, active: true });
  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  function openCreate() { setForm({ name: '', description: '', slaId: 3, active: true }); setModal({ mode: 'create' }); }
  function openEdit(d) { setForm({ ...d }); setModal({ mode: 'edit', id: d.id }); }

  function save() {
    if (modal.mode === 'create') setData(prev => [...prev, { ...form, id: Date.now(), slaId: parseInt(form.slaId) }]);
    else setData(prev => prev.map(d => d.id === modal.id ? { ...d, ...form, slaId: parseInt(form.slaId) } : d));
    setModal(null);
  }

  function toggleActive(id) {
    setData(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  }

  const getSla = (id) => slaConfigs.find(s => s.id === id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categorias</h1>
          <p className="text-slate-500 text-sm mt-0.5">{data.length} categorias cadastradas</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Nova Categoria</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Categoria', 'Descrição', 'SLA Padrão', 'Status', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(cat => {
                const sla = getSla(cat.slaId);
                return (
                  <tr key={cat.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Tag size={13} className="text-purple-600" />
                        </div>
                        <span className="font-medium text-slate-800">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{cat.description}</td>
                    <td className="px-4 py-3">
                      {sla ? (
                        <div>
                          <span className="font-medium text-slate-700">{sla.name}</span>
                          <span className="text-xs text-slate-400 block">Resp: {sla.responseTime}h / Res: {sla.resolutionTime}h</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cat.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {cat.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600"><Pencil size={14} /></button>
                        <button onClick={() => toggleActive(cat.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600"><PowerOff size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal.mode === 'create' ? 'Nova Categoria' : 'Editar Categoria'} onClose={() => setModal(null)}>
          <form onSubmit={e => { e.preventDefault(); save(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome</label>
              <input required value={form.name} onChange={e => setF('name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
              <textarea rows={3} value={form.description} onChange={e => setF('description', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SLA Padrão</label>
              <select value={form.slaId} onChange={e => setF('slaId', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {slaConfigs.map(s => <option key={s.id} value={s.id}>{s.name} (Resp: {s.responseTime}h / Res: {s.resolutionTime}h)</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setF('active', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-slate-700">Ativo</span>
            </label>
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
