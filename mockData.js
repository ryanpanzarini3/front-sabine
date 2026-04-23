const users = [
  { id: 'user-1', name: 'Ana Lima', email: 'ana@empresa.com', role: 'atendente', department: 'Suporte Técnico', status: 'active' },
  { id: 'user-2', name: 'Carlos Souza', email: 'carlos@empresa.com', role: 'atendente', department: 'Suporte Técnico', status: 'active' },
  { id: 'user-3', name: 'Fernanda Costa', email: 'fernanda@empresa.com', role: 'admin', department: 'TI', status: 'active' },
  { id: 'user-4', name: 'João Silva', email: 'joao@cliente.com', role: 'cliente', department: 'Externo', status: 'active' },
  { id: 'user-5', name: 'Maria Oliveira', email: 'maria@cliente.com', role: 'cliente', department: 'Externo', status: 'active' },
  { id: 'user-6', name: 'Pedro Alves', email: 'pedro@cliente.com', role: 'cliente', department: 'Externo', status: 'inactive' },
];

const departments = [
  { id: 'dept-1', name: 'Suporte Técnico', manager: 'Ana Lima', status: 'active' },
  { id: 'dept-2', name: 'TI', manager: 'Fernanda Costa', status: 'active' },
  { id: 'dept-3', name: 'Financeiro', manager: 'João Silva', status: 'active' },
  { id: 'dept-4', name: 'Comercial', manager: 'Maria Oliveira', status: 'inactive' },
];

const slaConfigs = [
  { id: 'sla-1', name: 'SLA Crítico', response_time: '1h', resolution_time: '4h' },
  { id: 'sla-2', name: 'SLA Alta', response_time: '2h', resolution_time: '8h' },
  { id: 'sla-3', name: 'SLA Média', response_time: '4h', resolution_time: '24h' },
  { id: 'sla-4', name: 'SLA Baixa', response_time: '8h', resolution_time: '72h' },
];

const categories = [
  { id: 'cat-1', name: 'Hardware', sla_id: 'sla-2' },
  { id: 'cat-2', name: 'Software', sla_id: 'sla-3' },
  { id: 'cat-3', name: 'Rede', sla_id: 'sla-1' },
  { id: 'cat-4', name: 'Acesso', sla_id: 'sla-3' },
  { id: 'cat-5', name: 'Outros', sla_id: 'sla-4' },
];

const currentUser = {
  id: 'user-fernanda',
  name: 'Fernanda Costa',
  email: 'fernanda@empresa.com',
  role: 'admin',
  department: 'TI'
};

const hoursAgo = (h) => new Date(Date.now() - h * 3600000).toISOString();

const initialTickets = [
  {
    id: 'CHM-001',
    subject: 'Computador não liga após atualização do Windows',
    description: 'Após realizar a atualização do Windows Update ontem à noite, o computador não consegue mais inicializar.',
    category: 'Hardware',
    priority: 'alta',
    status: 'aberto',
    channel: 'email',
    client_name: 'João Silva',
    assignee_name: 'Ana Lima',
    created_at: hoursAgo(3),
    sla_deadline: hoursAgo(-6),
    sla_first_response: '1h (SLA Alta)',
    sla_resolution: '8h (SLA Alta)',
    messages: [
      { userId: 'user-4', type: 'public', text: 'Computador não inicia após atualização', created_at: hoursAgo(3) },
      { userId: 'user-1', type: 'public', text: 'Vou analisar o problema. Tente desligar e ligar novamente.', created_at: hoursAgo(2.5) }
    ]
  },
  {
    id: 'CHM-002',
    subject: 'Sem acesso ao sistema ERP',
    description: 'Usuário não consegue acessar o sistema ERP com suas credenciais de login.',
    category: 'Acesso',
    priority: 'media',
    status: 'em_andamento',
    channel: 'telefone',
    client_name: 'Maria Oliveira',
    assignee_name: 'Carlos Souza',
    created_at: hoursAgo(5),
    sla_deadline: hoursAgo(-19),
    sla_first_response: '4h (SLA Média)',
    sla_resolution: '24h (SLA Média)',
    messages: [
      { userId: 'user-5', type: 'public', text: 'Não consegui acessar o ERP desde ontem', created_at: hoursAgo(5) },
      { userId: 'user-2', type: 'internal', text: 'Verificar com TI sobre reposicionamento de perms', created_at: hoursAgo(4.5) }
    ]
  },
  {
    id: 'CHM-003',
    subject: 'Internet lenta na zona sul',
    description: 'A conexão de internet está muito lenta afetando toda a filial da zona sul.',
    category: 'Rede',
    priority: 'critica',
    status: 'em_andamento',
    channel: 'email',
    client_name: 'Pedro Alves',
    assignee_name: 'Fernanda Costa',
    created_at: hoursAgo(2),
    sla_deadline: hoursAgo(-2),
    sla_first_response: '1h (SLA Crítico)',
    sla_resolution: '4h (SLA Crítico)',
    messages: []
  },
  {
    id: 'CHM-004',
    subject: 'Licença do Microsoft Office expirada',
    description: 'A licença do Microsoft Office expirou e não consigo mais usar os programas.',
    category: 'Software',
    priority: 'media',
    status: 'resolvido',
    channel: 'slack',
    client_name: 'João Silva',
    assignee_name: 'Ana Lima',
    created_at: hoursAgo(24),
    sla_deadline: hoursAgo(0),
    sla_first_response: '4h (SLA Média)',
    sla_resolution: '24h (SLA Média)',
    messages: []
  },
  {
    id: 'CHM-005',
    subject: 'Monitor não funciona após queda de energia',
    description: 'Monitor deixou de funcionar após uma queda de energia na empresa.',
    category: 'Hardware',
    priority: 'alta',
    status: 'aberto',
    channel: 'email',
    client_name: 'Maria Oliveira',
    assignee_name: 'Não atribuído',
    created_at: hoursAgo(1),
    sla_deadline: hoursAgo(-7),
    sla_first_response: '2h (SLA Alta)',
    sla_resolution: '8h (SLA Alta)',
    messages: []
  },
  {
    id: 'CHM-006',
    subject: 'Solicitação de novos softwares de design',
    description: 'Necessário instalar software de design gráfico no computador.',
    category: 'Software',
    priority: 'baixa',
    status: 'fechado',
    channel: 'email',
    client_name: 'Pedro Alves',
    assignee_name: 'Carlos Souza',
    created_at: hoursAgo(48),
    sla_deadline: hoursAgo(24),
    sla_first_response: '8h (SLA Baixa)',
    sla_resolution: '72h (SLA Baixa)',
    messages: []
  }
];

const initialNotifications = [
  { id: 'notif-1', title: 'Alerta SLA', message: 'Ticket CHM-003 próximo ao limite de SLA', type: 'alerta_sla', read: false, created_at: hoursAgo(0.5), ticketId: 'CHM-003' },
  { id: 'notif-2', title: 'Violação SLA', message: 'Ticket CHM-001 violou o SLA de resposta', type: 'violacao_sla', read: false, created_at: hoursAgo(0.1), ticketId: 'CHM-001' },
  { id: 'notif-3', title: 'Alerta SLA', message: 'Ticket CHM-005 próximo ao limite de SLA', type: 'alerta_sla', read: true, created_at: hoursAgo(2), ticketId: 'CHM-005' },
];
