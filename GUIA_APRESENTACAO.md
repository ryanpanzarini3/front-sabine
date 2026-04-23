# 📚 GUIA COMPLETO - Front-Sabine (HelpDesk)
## Para Apresentação e Estudos de JSX

---

## 🎯 ÍNDICE
1. [O que é JSX?](#jsx)
2. [Visão Geral do Projeto](#visao)
3. [Faça Você Mesmo - Tutorial](#tutorial)
4. [Componentes Explicados](#componentes)
5. [Context API (Gerenciamento de Estado)](#context)
6. [Roteamento com React Router](#routing)
7. [Exemplos Práticos de Código](#exemplos)
8. [Como Rodas o Projeto](#roda)
9. [Dicas de Apresentação](#apresentacao)

---

## <a name="jsx"></a>🤔 1. O que é JSX?

### Definição
**JSX = JavaScript XML** → Sintaxe que mistura HTML dentro do JavaScript

### Exemplo Simples:
```jsx
// ❌ SEM JSX (difícil):
const element = React.createElement('h1', null, 'Olá mundo');

// ✅ COM JSX (fácil, parece HTML):
const element = <h1>Olá mundo</h1>;
```

### Por Que JSX é Legal?
```jsx
// Você pode misturar lógica JavaScript com HTML:

const name = "Maria";
const age = 25;

// HTML + JS juntos:
const component = (
  <div>
    <h1>Olá, {name}</h1>
    <p>Você tem {age} anos</p>
    {age >= 18 && <p>Liberado para dirigir!</p>}
  </div>
);
```

### Regras Importantes:
```jsx
// ✅ CERTO:
<div className="container">         // className (não class)
<input onChange={handleChange} />   // camelCase
<Component />                       // Componentes maiúsculos

// ❌ ERRADO:
<div class="container">             // ❌ class em HTML é class, em JSX é className
<div onclick={handleClick} />       // ❌ onclick → onClick
```

---

## <a name="visao"></a>🏗️ 2. Visão Geral do Projeto

### O que é?
**Front-Sabine** = Sistema de **Gestão de Chamados Técnicos** (estilo Zendesk/Jira reduzido)

### Funcionalidades:
- ✅ Criar, listar, detalhar chamados (tickets)
- ✅ Gerenciar Usuários, Categorias, Departamentos
- ✅ Calcular SLA (Service Level Agreement)
- ✅ Sistema de Notificações
- ✅ Histórico de alterações
- ✅ Filtros e Paginação

### Tipo de Projeto:
- **SPA** (Single Page Application) = tudo em uma página
- **Responsivo** = funciona em mobile, tablet, desktop
- **Sem API** = dados mockados (simulados) localmente

### Stack Usado:
```
React 19          → Framework UI
React Router 7    → Roteamento (múltiplas "páginas")
Context API       → Gerenciamento de Estado
Tailwind CSS 4    → Estilização
Vite              → Empacotador rápido
Recharts          → Gráficos
Lucide Icons      → Ícones bonitos
```

---

## <a name="tutorial"></a>🚀 3. Estrutura Pasta a Pasta

```
front-sabine/
├── src/
│   ├── App.jsx                      ← TUDO começa aqui
│   ├── main.jsx                     ← Ponto de entrada (ReactDOM.render)
│   ├── index.css                    ← Estilos globais
│   │
│   ├── context/
│   │   └── AppContext.jsx          ← 🧠 Cérebro da aplicação (estado global)
│   │
│   ├── pages/                       ← "Páginas" da aplicação (10 rotas)
│   │   ├── Login.jsx                ← Tela de login
│   │   ├── Dashboard.jsx            ← Painel inicial com gráficos
│   │   ├── TicketList.jsx           ← Tabela com todos os chamados
│   │   ├── TicketDetail.jsx         ← Detalhes de 1 chamado
│   │   ├── CreateTicket.jsx         ← Formulário para criar
│   │   ├── Users.jsx                ← CRUD de usuários
│   │   ├── Categories.jsx           ← CRUD de categorias
│   │   ├── Departments.jsx          ← CRUD de departamentos
│   │   ├── SLA.jsx                  ← Configurações de SLA
│   │   └── Notifications.jsx        ← Centro de notificações
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx           ← Template: Sidebar + Header + Outlet
│   │   │   ├── Header.jsx           ← Barra superior (logo, user, bell)
│   │   │   └── Sidebar.jsx          ← Menu lateral
│   │   └── ui/
│   │       ├── Button.jsx           ← Botões reutilizáveis
│   │       ├── Card.jsx             ← Cards (caixas brancas)
│   │       ├── Modal.jsx            ← Janelas popup
│   │       └── Badge.jsx            ← Etiquetas coloridas
│   │
│   ├── data/
│   │   └── mockData.js              ← Dados fake (tickets, users, categories)
│   │
│   └── utils/
│       └── helpers.js               ← Funções utilitárias (formatDate, getSLAStatus)
│
├── vite.config.js                   ← Configuração do empacotador
├── package.json                     ← Dependências do projeto
└── index.html                       ← HTML principal
```

---

## <a name="componentes"></a>⚙️ 4. Componentes Explicados

### A. Layout Master (Layout.jsx)
**O que faz:** Cria o layout de todas as páginas (exceto login)

```jsx
// Layout.jsx: Template que outras páginas usam
<div className="flex h-screen">
  <Sidebar />          {/* Menu à esquerda */}
  <div className="flex-1 flex flex-col">
    <Header />         {/* Barra superior */}
    <main>
      <Outlet />       {/* Aqui vai a página (Dashboard, TicketList, etc) */}
    </main>
  </div>
</div>
```

**Analogia:** Layout é como o "frame" de um site - a moldura permanece igual, só o conteúdo (Outlet) muda.

---

### B. Pages (10 maneiras diferentes de usar o sistema)

#### **Dashboard.jsx** - Painel de Controle
```jsx
// Mostra:
// 1. Métricas em cards (4 números)
// 2. Gráficos com Recharts (Bar + Pie)
// 3. Tabela dos últimos 5 chamados

export default function Dashboard() {
  const { tickets } = useApp(); // Pega dados do Context
  
  return (
    <Card>
      <div className="grid grid-cols-4 gap-4">
        <MetricCard title="Abertos" value={14} />
        <MetricCard title="Em Andamento" value={8} />
        <MetricCard title="Resolvidos" value={42} />
        <MetricCard title="SLA Violado" value={3} />
      </div>
    </Card>
  );
}
```

---

#### **TicketList.jsx** - Tabela de Chamados
```jsx
// Mostra:
// 1. Filtros (busca, status, prioridade, categoria)
// 2. Tabela com 8 colunas
// 3. Paginação (8 itens por página)

const [filters, setFilters] = useState({
  search: '',
  status: '',
  priority: '',
  category: ''
});

// Usuário digita na busca
const handleSearch = (word) => {
  setFilters(prev => ({ ...prev, search: word }));
};

// Filtra os tickets
const filtered = tickets.filter(t => 
  t.subject.includes(filters.search) &&
  (!filters.status || t.status === filters.status)
);
```

---

#### **TicketDetail.jsx** - Ver 1 Chamado
```jsx
// Mostra:
// 1. Info do chamado (descrição, categoria, cliente)
// 2. Feed de mensagens (tipo chat)
// 3. Dropdowns para alterar status/prioridade/atendente

const { id } = useParams(); // pega ID da URL
const ticket = tickets.find(t => t.id === id); // busca o ticket

// Adiciona mensagem
const handleAddMessage = (text) => {
  addMessage(id, { 
    userId: user.id, 
    type: 'public', 
    text 
  });
};
```

---

#### **CreateTicket.jsx** - Criar Novo Chamado
```jsx
// Mostra:
// 1. Formulário (subject, description, category, priority, channel)
// 2. SLA auto-calcula baseado na categoria
// 3. Ao submeter, cria ticket e redireciona

const [form, setForm] = useState({
  subject: '',
  description: '',
  category: '', // Importante! Define o SLA
  priority: 'media',
  channel: 'email'
});

// Quando seleciona categoria, calcula SLA:
const handleCategoryChange = (categoryId) => {
  const category = categories.find(c => c.id === categoryId);
  const sla = slas.find(s => s.id === category.sla_id);
  setForm(prev => ({ ...prev, category: categoryId, sla }));
};

// Submeter
const handleSubmit = () => {
  const newTicket = {
    id: `CHM-${tickets.length + 1}`,
    ...form,
    status: 'aberto',
    created_at: new Date().toISOString()
  };
  addTicket(newTicket);
  navigate(`/chamados/${newTicket.id}`); // Redireciona
};
```

---

#### **Users.jsx, Categories.jsx** - Gerenciar Dados
```jsx
// Essas páginas têm CRUD simples
// Create, Read, Update, Delete

const [items, setItems] = useState(initialUsers); // Local state
const [editingId, setEditingId] = useState(null);

// Criar
const handleAdd = (newItem) => {
  setItems([...items, { id: Date.now(), ...newItem }]);
  setShowModal(false);
};

// Editar
const handleEdit = (id, changes) => {
  setItems(items.map(item => 
    item.id === id ? { ...item, ...changes } : item
  ));
};

// Deletar
const handleDelete = (id) => {
  setItems(items.filter(item => item.id !== id));
};
```

---

### C. Componentes UI (Reutilizáveis)

#### **Button.jsx** - Botões customizados
```jsx
// Em vez de usar <button> sempre, você cria Button uma vez:
export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  ...props 
}) {
  const variants = {
    primary: 'bg-blue-600 text-white',
    danger: 'bg-red-600 text-white',
    secondary: 'bg-slate-100 text-slate-900'
  };
  
  return (
    <button className={`${variants[variant]} px-4 py-2`} {...props}>
      {children}
    </button>
  );
}

// Uso:
<Button variant="primary">Criar</Button>
<Button variant="danger">Deletar</Button>
<Button variant="secondary">Cancelar</Button>
```

---

#### **Card.jsx** - Wrapper de caixa branca
```jsx
// Todos os cards brancos usam esse componente
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// Uso:
<Card className="p-6">
  <h2>Meu conteúdo aqui</h2>
</Card>
```

---

## <a name="context"></a>🧠 5. Context API (O Coração da Aplicação)

### O Problema que Context Solve:
```
Sem Context:
─────────
App
├─ Header (precisa saber unreadCount)
├─ Sidebar (precisa saber user name)
├─ Page (precisa de tickets)
└─ Mais 10 componentes (cada um precisa de dados)

Se você passar props por cascata:
App → Header → SubComponent → SubComponent2 → SubComponent3
❌ Muito chato! "Prop Drilling"

Com Context:
────────────
AppContext.Provider (dados globais)
│
├─ Header (usa useApp() direto) ✅
├─ Sidebar (usa useApp() direto) ✅
├─ Page (usa useApp() direto) ✅
└─ Qualquer lugar (usa useApp() direto) ✅
```

### AppContext.jsx - Explicado Linha por Linha
```jsx
import { createContext, useContext, useState } from 'react';
import { initialTickets, initialNotifications, users } from '../data/mockData';
import { currentUser } from '../data/mockData';

// 1️⃣ CRIAR contexto (é como criar um container global)
const AppContext = createContext();

// 2️⃣ PROVIDER (fornecedor de dados)
export function AppProvider({ children }) {
  // Estado inicial (dados que vão ser compartilhados)
  const [tickets, setTickets] = useState(initialTickets);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // 3️⃣ AÇÕES (funções que modificam o estado)
  
  // Criar novo ticket
  const addTicket = (ticket) => {
    setTickets([ticket, ...tickets]); // novo na frente
  };
  
  // Alterar um ticket existente
  const updateTicket = (id, updates) => {
    setTickets(tickets.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };
  
  // Adicionar mensagem a um ticket
  const addMessage = (ticketId, message) => {
    setTickets(tickets.map(t => 
      t.id === ticketId 
        ? { ...t, messages: [...(t.messages || []), message] }
        : t
    ));
  };
  
  // Marcar notificação como lida
  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  // 4️⃣ COMPUTED (dados derivados - calculados)
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // 5️⃣ VALUE (o que vai ser compartilhado)
  const value = {
    // State
    tickets,
    notifications,
    user: currentUser,
    users,
    unreadCount,
    
    // Actions
    addTicket,
    updateTicket,
    addMessage,
    markNotificationRead,
    markAllRead: () => setNotifications(notifications.map(n => ({ ...n, read: true })))
  };
  
  // 6️⃣ PROVIDER (envolve a aplicação)
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// 7️⃣ HOOK CUSTOMIZADO (para usar fácil em qualquer lugar)
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}
```

---

### Como Usar Context em Um Componente:
```jsx
import { useApp } from '../context/AppContext';

export default function Header() {
  // Pega dados do Context
  const { user, unreadCount, markNotificationRead } = useApp();
  
  return (
    <header>
      <h1>Olá, {user.name}</h1>
      <button>
        🔔 Notificações ({unreadCount})
      </button>
    </header>
  );
}
```

**Analogia:** AppContext é como um "deposito central" que qualquer parte da casa pode acessar em vez de pedir para cada vizinho.

---

## <a name="routing"></a>🗺️ 6. Roteamento (React Router)

### O que é Roteamento?
Fazer o usuário sentir que ele está em "páginas diferentes" mesmo sendo uma aplicação única.

```
Sem Router:
─────────
/                   → app.html
/chamados           → chamados.html
/chamados/123       → chamado-123.html
(10 arquivos HTML diferentes)

Com Router:
────────────
/ → Dashboard.jsx
/chamados → TicketList.jsx
/chamados/123 → TicketDetail.jsx
(1 arquivo HTML, conteúdo muda)
```

### App.jsx - Estrutura de Rotas
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// ... importar mais páginas

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/front-sabine">
        {/* basename="/front-sabine" porque está no GitHub Pages em uma subpasta */}
        
        <Routes>
          {/* ROTA PÚBLICA */}
          <Route path="/login" element={<Login />} />
          
          {/* ROTAS PROTEGIDAS (com Layout) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chamados" element={<TicketList />} />
            <Route path="/chamados/novo" element={<CreateTicket />} />
            <Route path="/chamados/:id" element={<TicketDetail />} />
            {/* :id é dinâmico - pode ser "/chamados/1", "/chamados/2", etc */}
            
            <Route path="/usuarios" element={<Users />} />
            <Route path="/departamentos" element={<Departments />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/sla" element={<SLA />} />
            <Route path="/notificacoes" element={<Notifications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
```

### Navegação Entre Páginas:
```jsx
import { useNavigate, useParams } from "react-router-dom";

export default function TicketList() {
  const navigate = useNavigate();
  
  // Navegar para página
  const handleCreateNew = () => {
    navigate('/chamados/novo');
  };
  
  // Navegar com ID dinâmico
  const handleViewTicket = (id) => {
    navigate(`/chamados/${id}`);
  };
  
  return (
    <div>
      <button onClick={handleCreateNew}>Novo Chamado</button>
      <table>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id} onClick={() => handleViewTicket(ticket.id)}>
              <td>{ticket.subject}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---

export default function TicketDetail() {
  // Pega o :id da URL
  const { id } = useParams();
  const { tickets } = useApp();
  
  const ticket = tickets.find(t => t.id === id);
  
  return <h1>Ticket {ticket.subject}</h1>;
}
```

---

## <a name="exemplos"></a>💡 7. Exemplos Práticos de Código

### Exemplo 1: Criar um Botão que Atualiza um Ticket
```jsx
// Before (sem estar estruturado):
const button = document.querySelector('#update-btn');
button.addEventListener('click', () => {
  // fazer fetch, atualizar DOM manualmente, etc
});

// After (React com Context):
const { updateTicket } = useApp();

<Button onClick={() => {
  updateTicket(ticket.id, { status: 'resolvido' });
}}>
  Marcar como Resolvido
</Button>

// ✅ React faz tudo: atualiza state, re-renderiza, etc
```

---

### Exemplo 2: Listar Dados Filtrados
```jsx
// Pegar tickets do Context
const { tickets } = useApp();

// Estado local para filtros
const [search, setSearch] = useState('');
const [status, setStatus] = useState('');

// Filtrar
const filtered = tickets.filter(t => {
  const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase());
  const matchStatus = !status || t.status === status;
  return matchSearch && matchStatus;
});

return (
  <div>
    <input 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Buscar ticket..."
    />
    
    <select value={status} onChange={(e) => setStatus(e.target.value)}>
      <option value="">Todos</option>
      <option value="aberto">Aberto</option>
      <option value="em_andamento">Em Andamento</option>
      <option value="resolvido">Resolvido</option>
    </select>
    
    <table>
      <tbody>
        {filtered.map(ticket => (
          <tr key={ticket.id}>
            <td>{ticket.id}</td>
            <td>{ticket.subject}</td>
            <td>{ticket.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

---

### Exemplo 3: Formulário com SLA Auto-Calculado
```jsx
const [form, setForm] = useState({
  subject: '',
  category: '',
  priority: 'media'
});

const [slaInfo, setSlaInfo] = useState(null);

// Quando muda categoria
const handleCategoryChange = (categoryId) => {
  setForm(prev => ({ ...prev, category: categoryId }));
  
  // Busca SLA dela
  const sla = slas.find(s => s.id === categoryId);
  setSlaInfo(sla);
};

return (
  <div>
    <input
      value={form.subject}
      onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
      placeholder="Assunto"
    />
    
    <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)}>
      {categories.map(cat => <option value={cat.id}>{cat.name}</option>)}
    </select>
    
    {/* Mostra SLA auto-calculado */}
    {slaInfo && (
      <div className="bg-blue-50 p-4">
        <h3>SLA para essa categoria:
        <p>Resposta: {slaInfo.resposta}</p>
        <p>Resolução: {slaInfo.resolucao}</p>
      </div>
    )}
    
    <Button onClick={() => {
      addTicket({ ...form, status: 'aberto', created_at: new Date() });
      navigate(`/chamados/${nextId}`);
    }}>
      Criar Chamado
    </Button>
  </div>
);
```

---

### Exemplo 4: Condicional (if ternário em JSX)
```jsx
const { ticket } = useTicket(id);

return (
  <div>
    {/* Mostra ou não baseado numa condição */}
    {ticket.sla_violado ? (
      <div className="bg-red-100 text-red-900">⚠️ SLA VIOLADO</div>
    ) : (
      <div className="bg-green-100 text-green-900">✓ SLA OK</div>
    )}
    
    {/* Ou operador lógico && */}
    {ticket.status === 'resolvido' && (
      <button onClick={() => reopenTicket(ticket.id)}>Reabrir</button>
    )}
  </div>
);
```

---

### Exemplo 5: Loop com .map()
```jsx
const { tickets } = useApp();

return (
  <div>
    {/* Loop simples */}
    {tickets.map(ticket => (
      <div key={ticket.id} className="border p-4">
        <h3>{ticket.subject}</h3>
        <p>Status: {ticket.status}</p>
      </div>
    ))}
  </div>
);

// key={ticket.id} é OBRIGATÓRIO para React saber qual item atualizou
// Nunca use index como key!
```

---

## <a name="roda"></a>▶️ 8. Como Rodar o Projeto

### 1️⃣ Instalar Dependências
```bash
cd c:\Users\907598\Documents\GitHub\front-sabine
npm install
```

### 2️⃣ Rodar em Desenvolvimento
```bash
npm run dev
```
Vai abrir em `http://localhost:5173`

### 3️⃣ Login
- Email: qualquer um (não valida)
- Senha: qualquer um (não valida)
- Clica em "Entrar"

### 4️⃣ Compilar para Produção
```bash
npm run build
```
Cria pasta `/dist` com arquivos otimizados

### 5️⃣ Deploy no GitHub Pages
```bash
npm run deploy
```
Faz build + sube para branch `gh-pages` automaticamente
Acessa em: https://ryanpanzarini3.github.io/front-sabine

---

## <a name="apresentacao"></a>🎤 9. Dicas de Apresentação

### Roteiro Recomendado (15-20 minutos):

#### **1. INTRODUÇÃO (2 min)**
```
"Eu desenvolvi um sistema de gerenciamento de chamados técnicos.
Ele é como um Zendesk/Jira reduzido para lidar com suporte de TI.
Tem login, dashboard com gráficos, tabela de tickets, e gerenciamento
de usuários, categorias e SLAs."
```

---

#### **2. MOSTRAR O FUNCIONAMENTO (5 min)**
- Logar no sistema
- Ir para Dashboard (mostrar gráficos)
- Ir para Chamados (mostrar tabela)
- Clicar em um chamado (mostrar detalhes)
- Mostrar como muda status
- Ir para Notificações (mostrar bell icon)

---

#### **3. EXPLICAR A ARQUITETURA (5 min)**

**Slide 1: Stack Tecnológico**
```
React 19     → Interface do usuário
React Router → Navegação entre páginas  
Context API  → Dados compartilhados
Tailwind     → Estilos CSS
Vite         → Empacotador JavaScript
```

**Slide 2: Estrutura de Pastas**
```
/pages        → As 10 páginas (Dashboard, TicketList, etc)
/components   → Blocos reutilizáveis (Header, Button, Card)
/context      → AppContext (gerenciador de estado)
/data         → Dados simulados (não tem banco de dados)
/utils        → Funções auxiliares
```

**Slide 3: Fluxo de Dados**
```
Usuário clica em botão
        ↓
Componente chama função (ex: updateTicket)
        ↓
AppContext atualiza estado
        ↓
React re-renderiza componentes
        ↓
Tela muda automaticamente
```

---

#### **4. CONCEITOS JAVASCRIPT (3 min)**

**JSX:**
```jsx
// JSX = HTML dentro de JavaScript
const name = "Maria";
const element = <h1>Olá, {name}!</h1>;
```

**Componentes:**
```jsx
// Componente = função que retorna JSX
function Dashboard() {
  return <h1>Dashboard</h1>;
}
```

**Hooks (useState, useContext):**
```jsx
// useState = estado local
const [count, setCount] = useState(0);

// useContext = acessar Context Global
const { tickets } = useApp();
```

---

#### **5. EXEMPLO PRÁTICO - Criar Ticket (3 min)**
Mostrar código de CreateTicket.jsx:
- Formulário recebe dados (subject, category, priority)
- Ao clicar "Criar", chama addTicket()
- Isso atualiza Context
- Redireciona para /chamados/{id}

---

#### **6. CONCLUSÃO (2 min)**
```
"O projeto demonstra:
✅ Como estruturar uma React App grande
✅ Como usar Context API para gerenciar estado
✅ Como criar componentes reutilizáveis
✅ Como organizar páginas e rotas
✅ Como formatar dados e filtrar
✅ Como integrar gráficos (Recharts)

Tudo sem banco de dados ou API, apenas dados simulados."
```

---

### Perguntas que Podem Cair:

**P: Por que usar React?**
```
R: React deixa o código mais organizado, reutilizável e fácil de manter.
   Você divide a UI em componentes e reutiliza.
```

**P: Como você compartilha dados entre componentes?**
```
R: Usa Context API. Coloca um Provider na App e qualquer componente
   dentro pode acessar sem passar props por cascata.
```

**P: Por que usar Tailwind?**
```
R: Tailwind é mais rápido que escrever CSS manualmente.
   Você usa classes prontas: <div className="bg-blue-600 p-4">
```

**P: Como o roteamento funciona?**
```
R: React Router permite múltiplas "páginas" em uma SPA.
   /chamados → TicketList
   /chamados/123 → TicketDetail
   A página muda sem fazer refresh.
```

**P: Como você testaria isso?**
```
R: Com Jest (testes unitários), React Testing Library (testes de componentes)
   e Cypress (testes de integração).
```

---

### Dicas Extra:

1. **Abra o DevTools** (F12) para mostrar:
   - React Devtools (vê componentes, props, context)
   - Console (não tem erros)
   - Network (não faz nenhum request HTTP)

2. **Mostre o código** em alguns pontos:
   - AppContext.jsx (como funciona o estado global)
   - Um componente de página (como usa useApp())
   - Um componente pequeno (Card, Button)

3. **Mude dados no browser** (DevTools):
   - Abra React Devtools
   - Mude um valor no AppContext
   - Veja a tela atualizar em tempo real

4. **Fale sobre responsividade:**
   - F12 → Toggle Device Toolbar
   - Mude tamanho para mobile
   - Mostre como Sidebar "desaparece"

---

## 📎 REFERÊNCIAS RÁPIDAS

### Sintaxe JSX Importante:
```jsx
// Variáveis
const name = "Maria";
<h1>{name}</h1>

// Condicional
{status === 'aberto' && <Badge>Aberto</Badge>}
{admin ? <AdminPanel /> : <UserPanel />}

// Loop
{items.map(item => <Item key={item.id} {...item} />)}

// Eventos
<button onClick={() => handleClick()}>Click</button>
<input onChange={(e) => setValue(e.target.value)} />

// Estilos
className="bg-blue-600 text-white p-4"

// Props
<Button variant="primary" size="lg">Click</Button>

// Condicinais CSS
className={`base ${active ? 'active' : ''}`}
```

### Hooks Principais:
```jsx
// Estado
const [state, setState] = useState(initialValue);

// Efeito (quando componente monta/atualiza)
useEffect(() => {
  // rodas aqui
}, [dependencies]);

// Context
const value = useContext(Context);

// Navegação
const navigate = useNavigate();
navigate('/pagina');

// URL params
const { id } = useParams();
```

---

## 🎉 Você Está Pronto!

Agora você entende:
- ✅ O que é JSX
- ✅ Como React trabalha
- ✅ Estrutura do projeto
- ✅ Como dados fluem (Context)
- ✅ Como rotas funcionam
- ✅ Como apresentar isso

**Boa sorte na apresentação!** 🚀
