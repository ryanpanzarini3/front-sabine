# 🎫 HelpDesk — Sistema de Gerenciamento de Chamados

MVP de um sistema de HelpDesk completo com dashboard analytics, gerenciamento de tickets, controle de SLA e autenticação de usuários.

🔗 **Demo ao vivo:** [ryanpanzarini3.github.io/front-sabine](https://ryanpanzarini3.github.io/front-sabine)

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológico](#stack-tecnológico)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Deploy](#deploy)
- [Usuários de Teste](#usuários-de-teste)
- [SLA Configurado](#sla-configurado)
- [Capturas de Tela](#capturas-de-tela)

---

## Visão Geral

**HelpDesk** é um sistema de suporte técnico desenvolvido como MVP (Mínimo Produto Viável), com foco em performance, responsividade e experiência do usuário. Toda a lógica é em Vanilla JavaScript — sem frameworks pesados — e os dados são simulados via mock, deixando o sistema pronto para integração com qualquer backend.

---

## Funcionalidades

### 📊 Dashboard
- 4 métricas em tempo real: Abertos, Em Andamento, Resolvidos/Fechados e SLA Violado
- 4 gráficos interativos (Chart.js):
  - Distribuição por **Prioridade** (Doughnut)
  - Distribuição por **Status** (Horizontal Bar)
  - Volume por **Categoria** (Vertical Bar)
  - **Status de SLA** — No Prazo / Em Atenção / Violado (Doughnut)
- Tabela dos 5 chamados mais recentes

### 🎫 Gerenciamento de Tickets
- Listagem com paginação (8 tickets por página)
- Filtros em tempo real por texto (ID, assunto, cliente), status, prioridade e categoria
- Criação de novo ticket via modal
- Visualização de detalhes completos com histórico de mensagens
- Edição de status e prioridade
- Indicador visual de SLA (no prazo / atenção / violado)

### 🔐 Autenticação
- Login com email e senha
- Persistência de sessão via `localStorage`
- Controle de perfis: **admin**, **atendente** e **cliente**

### 📱 Responsividade
- 5 breakpoints: desktop (1920px+), laptop, tablet (768px), mobile (480px), mobile pequeno (360px)
- Compatível com Chrome, Firefox, Safari e Edge

---

## Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Vanilla JavaScript (ES Modules) |
| Gráficos | Chart.js |
| Build | Vite |
| Estilos | CSS3 puro com variáveis CSS |
| Deploy | GitHub Pages (`gh-pages`) |

---

## Estrutura do Projeto

```
front-sabine/
├── index.html          # HTML principal (SPA)
├── app.js              # Toda a lógica da aplicação
├── mockData.js         # Dados simulados (tickets, usuários, SLA, etc.)
├── styles.css          # Estilos responsivos
├── vite.config.js      # Configuração do Vite
├── package.json        # Dependências e scripts
└── README.md           # Este arquivo
```

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js 18+

```bash
# 1. Clone o repositório
git clone https://github.com/ryanpanzarini3/front-sabine.git
cd front-sabine

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:5173`

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Gera build de produção em `/dist` |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run deploy` | Faz build e publica no GitHub Pages |

---

## Deploy

O deploy é feito automaticamente para o GitHub Pages com:

```bash
npm run deploy
```

O script executa `vite build` e em seguida `gh-pages -d dist`, publicando o conteúdo da pasta `dist` na branch `gh-pages`.

A URL base está configurada como `/front-sabine/` no `vite.config.js`.

---

## Usuários de Teste

| Nome | E-mail | Senha | Perfil |
|------|--------|-------|--------|
| Ryan Panzarini | ryanpanzarini@empresa.com | admin123 | Admin |
| Guilherme Rafaelo | guilhermerafa@empresa.com | 123456 | Atendente |
| Carlos Souza | carlos@empresa.com | 123456 | Atendente |
| Luquinha Delas | luquinhadelas@cliente.com | 123456 | Cliente |
| Maria Oliveira | maria@cliente.com | 123456 | Cliente |

---

## SLA Configurado

| Nível | Tempo de Resposta | Tempo de Resolução |
|-------|------------------|--------------------|
| Crítico | 1h | 4h |
| Alta | 2h | 8h |
| Média | 4h | 24h |
| Baixa | 8h | 72h |

---

## Categorias de Tickets

- **Hardware** — SLA Alta
- **Software** — SLA Média
- **Rede** — SLA Crítico
- **Acesso** — SLA Média
- **Outros** — SLA Baixa
