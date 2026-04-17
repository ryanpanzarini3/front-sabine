import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus, Pencil, PowerOff, Search, User } from 'lucide-react';

const ROLES = { cliente: 'Cliente', atendente: 'Atendente', admin: 'Admin' };
const ROLE_COLORS = { cliente: 'bg-blue-100 text-blue-700', atendente: 'bg-purple-100 text-purple-700', admin: 'bg-red-100 text-red-700' };

export default function Users() {
  const { users } = useApp();
  const [localUsers, setLocalUsers] = useState(users);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | {mode: 'create'|'edit', data}

  const filtered = localUsers.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const emptyForm = { name: '', email: '', role: 'cliente', department: '', status: 'ativo' };
  const [form, setForm] = useState(emptyForm);
  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  function openCreate() { setForm(emptyForm); setModal({ mode: 'create' }); }
  function openEdit(u) { setForm({ ...u }); setModal({ mode: 'edit', id: u.id }); }

  function save() {
    if (modal.mode === 'create') {
      setLocalUsers(prev => [...prev, { ...form, id: Date.now(), avatar: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }]);
    } else {
      setLocalUsers(prev => prev.map(u => u.id === modal.id ? { ...u, ...form } : u));
    }
    setModal(null);
  }

  function toggleStatus(id) {
    setLocalUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ativo' ? 'inativo' : 'ativo' } : u));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Usuários</h1>
          <p className="text-slate-500 text-sm mt-0.5">{localUsers.length} usuários cadastrados</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Novo Usuário</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuário..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Usuário', 'Email', 'Tipo', 'Departamento', 'Status', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">{u.avatar}</div>
                      <span className="font-medium text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role]}`}>{ROLES[u.role]}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.department}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => toggleStatus(u.id)} className={`p-1.5 rounded-lg hover:bg-slate-100 ${u.status === 'ativo' ? 'text-slate-500 hover:text-red-600' : 'text-slate-300 hover:text-green-600'}`}>
                        <PowerOff size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal.mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'} onClose={() => setModal(null)}>
          <form onSubmit={e => { e.preventDefault(); save(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo</label>
                <input required value={form.name} onChange={e => setF('name', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <input required type="email" value={form.email} onChange={e => setF('email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo</label>
                <select value={form.role} onChange={e => setF('role', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="cliente">Cliente</option>
                  <option value="atendente">Atendente</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Departamento</label>
                <input value={form.department} onChange={e => setF('department', e.target.value)}
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
