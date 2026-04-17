import { useState } from 'react';
import { departments as initialData } from '../data/mockData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus, Pencil, PowerOff } from 'lucide-react';

export default function Departments() {
  const [data, setData] = useState(initialData);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', active: true });
  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  function openCreate() { setForm({ name: '', description: '', active: true }); setModal({ mode: 'create' }); }
  function openEdit(d) { setForm({ ...d }); setModal({ mode: 'edit', id: d.id }); }

  function save() {
    if (modal.mode === 'create') setData(prev => [...prev, { ...form, id: Date.now() }]);
    else setData(prev => prev.map(d => d.id === modal.id ? { ...d, ...form } : d));
    setModal(null);
  }

  function toggleActive(id) {
    setData(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Departamentos</h1>
          <p className="text-slate-500 text-sm mt-0.5">{data.length} departamentos</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Novo Departamento</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(dept => (
          <Card key={dept.id} className={`p-5 ${!dept.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-bold text-sm">{dept.name[0]}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dept.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {dept.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <h3 className="font-semibold text-slate-800">{dept.name}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{dept.description}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => openEdit(dept)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                <Pencil size={12} /> Editar
              </button>
              <button onClick={() => toggleActive(dept.id)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                <PowerOff size={12} /> {dept.active ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode === 'create' ? 'Novo Departamento' : 'Editar Departamento'} onClose={() => setModal(null)}>
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setF('active', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300" />
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
