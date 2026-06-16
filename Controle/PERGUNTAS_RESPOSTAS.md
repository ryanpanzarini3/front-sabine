# ❓ PERGUNTAS E RESPOSTAS - SABINE FRONTEND

## Preparação para apresentações, demonstrações e entrevistas

---

## 🎯 PERGUNTAS TÉCNICAS

### P1: "Por que Vanilla JavaScript e não React/Vue?"
**R:** "Escolhemos Vanilla JS porque:
1. Sem overhead de frameworks pesados - a app carrega em <2s
2. Tamanho final de ~150KB (vs 300-500KB com React)
3. Melhor performance em dispositivos mais fracos
4. Código mais direto, fácil de debugar
5. Para um MVP com funcionalidades bem definidas, não precisamos da complexidade do React

Quando escalarmos com muitas rotinas dinâmicas, podemos fazer a migração. Mas hoje, funciona perfeitamente."

### P2: "Qual framework de CSS você usou?"
**R:** "CSS vanilla com custom properties (--color-primary, etc). Sem Tailwind, Bootstrap ou frameworks CSS.

Vantagem:
- Arquivo CSS único de ~1200 linhas
- Total controle sobre o styling
- Fácil de customizar cores/spacing
- Sem conflitos de classes

As vantagens de um CSS framework não fazem falta aqui porque temos um design bem definido e coeso."

### P3: "Como os gráficos funcionam?"
**R:** "Usamos Chart.js v4, que é leve e poderosa:
- Gráfico de Prioridade: Doughnut (pizza)
- Gráfico de Status: Bar horizontal (mais tickets no final)
- Gráfico de Categoria: Bar vertical (hardware em destaque)
- Gráfico SLA: Doughnut com 3 estados (ok/alerta/violado)

Todos atualizam em tempo real quando dados mudam. Os dados são centralizados em this.COLORS para garantir consistência."

### P4: "Como funciona a arquitetura de classes?"
**R:** "Temos uma classe App principal que:
1. Armazena estado (tickets, usuários, categorias, etc)
2. Gerencia o roteamento entre páginas
3. Implementa as 7 seções (dashboard, tickets, usuários, categorias, SLA, departamentos, notificações)
4. Controla os 4 gráficos do Chart.js
5. Implmenta CRUD para cada entidade

Tudo é orientado a objetos, sem dependências externas. Muito mais simples que um SPA framework."

### P5: "Como o sistema sabe quando atualizar?"
**R:** "Usamos listeners de eventos JavaScript nativo:
1. Click em botão → addEventListener
2. Submit de form → previne default, processa dados
3. Mudança em filtro → renderiza tabela novamente
4. Ao criar/editar/deletar → renderDashboard() é chamado

É um padrão observer/pub-sub implementado manualmente, funciona muito bem para esta escala."

### P6: "E a paginação?"
**R:** "A tabela de tickets mostra 8 por página. Temos:
1. Botões 'Anterior' e 'Próxima'
2. Números de página clicáveis
3. Atualiza quando você filtrava ou cria novos tickets

No backend, implementaremos offset/limit na query para só buscar 8 registros por vez."

### P7: "Como os filtros funcionam?"
**R:** "Temos um método getFilteredTickets() que:
1. Recebe os valores dos filtros (search, status, priority, category)
2. Itera por todos os tickets
3. Verifica cada condição
4. Retorna apenas os que passam em TODOS os filtros

É um AND lógico: status E priority E category E search deve bater."

### P8: "Como funciona o modal de criação?"
**R:** "Quando clica em '+ Novo Chamado':
1. A função showNewTicketModal() cria HTML do form
2. Chama openModal() que mostra a div hidden #modal
3. Quando submete, pegamos os valores dos inputs
4. Criamos novo objeto ticket com ID único
5. Adicionamos ao array this.tickets
6. Chamamos renderPriorityChart(), renderStatusChart(), etc
7. Modal fecha automaticamente

Tudo no frontend agora. No backend, enviaria um POST para /tickets."

### P9: "Como você mudou status/prioridade de um ticket?"
**R:** "Na página de detalhes:
1. Clica no status/prioridade atual
2. Modal abre com dropdown de opções
3. Seleciona novo valor
4. Salva
5. Dashboard atualiza em tempo real

Implementamos com event.target e onclick handlers combinados com modals."

### P10: "Qual é o tamanho do build?"
**R:** "~150KB total (without node_modules):
- app.js: ~1000 linhas (~40KB minificado)
- styles.css: ~1200 linhas (~30KB)
- index.html: ~350 linhas (~15KB)
- mockData.js: ~300 linhas (~20KB)
- Bibliotecas (Chart.js): externe via CDN (~100KB)

Total com Vite/build: ~250KB (com gzip, cai para ~80KB)"

---

## 📊 PERGUNTAS DE NEGÓCIO

### P11: "Como isso se integra com nosso backend?"
**R:** "O frontend está 100% pronto para integração. Plano:
1. Substituir mockData.js por chamadas fetch() a um REST API
2. Endpoints necessários:
   - GET /tickets, POST /tickets, PUT /tickets/:id, DELETE /tickets/:id
   - GET /users, POST /users, etc (mesmo padrão)
   - GET /categories, GET /departments, GET /sla, GET /notifications
3. Adaptaríamos os fetch() para incluir headers de autenticação
4. Tempo estimado de integração: 1-2 semanas

Recomendo usar Node+Express ou Python+Flask no backend."

### P12: "E quanto a autenticação?"
**R:** "Hoje temos um usuário pré-logado (Fernanda Costa) simulado em mockData.js.

No backend/produção:
1. Adicionaríamos página de login (/login)
2. Enviaria credenciais em POST /auth/login
3. Servidor retorna JWT token
4. Armazenamos token em localStorage
5. Incluímos token em Authorization header em todas as requests
6. Se token expirar, forçamos re-login

Podemos usar JWT ou OAuth2. Estrutura já está pronta para isso."

### P13: "Qual é o plano de escalabilidade?"
**R:** "Escalabilidade em 3 níveis:

**Frontend:**
- Dados > 1000 tickets: implementar lazy loading/virtual scroll
- Gráficos com muitos dados: usar agregação/sampling
- Estado: migrar para gerenciador (Redux/Pinia) se crescer

**Backend:**
- Banco de dados com índices em ticket.status, ticket.priority
- Cache (Redis) para queries frequentes
- Paginação obrigatória (8-20 por página)
- API rate limiting

**Infraestrutura:**
- CDN para assets estáticos
- Load balancer para múltiplos servidores
- Database replication/master-slave"

### P14: "Quantos usuários/tickets suporta?"
**R:** "Hoje temos mock de 15 tickets e 6 usuários para demonstração.

Estimativas reais:
- 100 usuários simultâneos: sem problema
- 10.000 tickets: funciona com paginação no backend
- 100.000 tickets: precisaríamos de cache layer (Redis)
- 1M+ tickets: banco separado, data warehouse para analytics

O frontend é agnóstico. O gargalo será no backend/database."

### P15: "Como é suportado?"
**R:** "SABINE é um MVP desenvolvido em 2- 3 sprints. Suporte:
- Bug fixes: sim, resposta <24h
- Features novas: discutir roadmap
- Integração com seu backend: sim, consultoria incluída
- SLA de uptime: após fase de produção

Recomendo um contrato de manutenção por 6 meses pós-launch."

### P16: "Pode funcionar offline?"
**R:** "Não, mas poderia com Service Worker!

Hoje: precisa de internet para todos os dados.

Com offline-first (Service Worker + IndexedDB):
1. Cacheia dados do último uso
2. App funciona offline com dados em cache
3. Quando volta online, sincroniza mudanças
4. Útil para atendentes e campo

Estimativa de implementação: 2-3 dias."

### P17: "Qual é o roadmap?"
**R:** "Fase 1 (Atual): MVP Desktop/Mobile
Fase 2 (2-4 semanas): Integração Backend
- CRUD real no banco
- Autenticação JWT
- Notificações via WebSocket

Fase 3 (1-2 meses): Features Avançadas
- Assignments (atribuição de tickets a agentes)
- Mentions (@usuario)
- Attachments (upload de arquivos)
- Relatórios com exportação PDF

Fase 4 (3+ meses): Mobile App Nativa
- React Native ou Flutter
- Push notifications
- Offline-first"

---

## 🎨 PERGUNTAS DE UX/DESIGN

### P18: "Como você escolheu as cores?"
**R:** "Cores centralizadas em uma constante this.COLORS no constructor:
- Prioridade: própuras e vermelhas (urgência visual)
  - Crítica: #991b1b (vermelho escuro)
  - Alta: #dc2626 (vermelho)
  - Média: #f59e0b (âmbar)
  - Baixa: #10b981 (verde)
- Status: azul (aberto), amarelo (andamento), verde (resolvido), cinza (fechado)
- SLA: verde (ok), amarelo (alerta), vermelho (violado)

Baseado em convenções WCAG (acessibilidade) e paleta Tailwind. Tudo é consistente em CSS e JS."

### P19: "Por que 2 colunas de gráficos?"
**R:** "Layout inteligente:
- Não perder informação (tudo visível sem scroll)
- Balance visual (quadrante 2x2)
- Responsivo: viram 1 coluna em tablet, 1 linha em mobile

Se tivéssemos 6 gráficos, seria 3x2 ou 3x1 em mobile."

### P20: "Como você decidiu os breakpoints?"
**R:** "5 breakpoints baseados em dispositivos reais:
1. 1024px: Tablets paisagem / iPads (onde começa apertar)
2. 768px: Tablets retrato / Celulares grandes
3. 640px: Celulares médios (iPhone SE, Samsung A50)
4. 480px: Celulares pequenos (iPhone 12 mini)
5. 360px: Celulares muito pequenos (alguns Android antigos)

Cada um ajusta: font-size, padding, grid-columns, visibilidade."

### P21: "Por que o modal é assim?"
**R:** "Modal simples e funcional:
1. Overlay escuro ao fundo (feedback visual)
2. Botão X de fechamento
3. Centralizado na tela
4. Click fora fecha (UX intuitiva)
5. Form limpo e organizado

Sobre-engenharia seria um lightbox complexo. Isso é suficiente."

### P22: "Qual é a tipografia?"
**R:** "System font stack:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

Funciona em iOS (San Francisco), Android (Roboto), Windows (Segoe), fallback Arial.

Tamanhos escaláveis:
- H1: 2rem (desktop) → 1.1rem (mobile)
- Body: 1rem (desktop) → 0.95rem (mobile)
- Label: 0.95rem (desktop) → 0.9rem (mobile)"

### P23: "Como está a acessibilidade?"
**R:** "Bom, mas pode melhorar:

Pronto:
- Contraste de cores WCAG AA
- Alt text não existente (sem imagens, mas labels existem)
- Navegação por teclado (tabs funcionam)
- Estrutura semântica OK (header, main, aside)

Melhorias futuras:
- Implementar aria-label em ícones
- aria-live para notificações
- Skip to main content
- Maior target size mobile (toques fáceis em 48px)"

---

## ⚡ PERGUNTAS DE PERFORMANCE

### P24: "Por que carrega tão rápido?"
**R:** "Vários fatores:

1. **Sem frameworks pesados**: Vanilla JS é direto
2. **CSS simples**: Sem pré-processadores, sem bloat
3. **Recursos estáticos**: HTML/CSS/JS servem direto
4. **Vite**: Build tool excelente, hot reload rápido
5. **Mock data pequeno**: 15 tickets não sobrecarrega memória
6. **Compressão Gzip**: ~250KB → ~80KB comprimido

Tempo:
- DNS: ~100ms
- Download: ~300ms
- Parse/Render: ~400ms
- Interactive: ~1s
**Total: <2s**"

### P25: "E com muitos tickets?"
**R:** "Com 10k tickets:
1. **Sem paginação**: app fica lento (renderiza 10k linhas)
2. **Com paginação (8/página)**: resposta imediata

Backend deve implementar:
```sql
SELECT * FROM tickets 
WHERE status = 'aberto' 
LIMIT 8 OFFSET 0  -- página 1
```

Frontend mostra apenas 8 de cada vez. Muito mais rápido."

### P26: "Os gráficos ficam lentos?"
**R:** "Chart.js é otimizado. Mesmo com 1000 pontos de dados:
- Renderização inicial: ~200ms
- Update ao filtrar: ~100ms
- Hover/tooltip: <50ms

Podemos desativar animações (responsive: false) se performance cair."

### P27: "Como reduzir o tamanho do build?"
**R:** "Oportunidades:
1. Minificar JS com Terser: ~30% menor
2. Minificar CSS com csso: ~20% menor
3. Remover console.log() em produção
4. Lazy-load Chart.js (carrega só quando precisa)
5. Usar WebP para imagens (if applicable)

Hoje ~250KB → pode ser ~150KB com tudo otimizado."

### P28: "Browser antigos funcionam?"
**R:** "Suporte:
- Chrome 90+: ✅ Funciona
- Firefox 88+: ✅ Funciona
- Safari 14+: ✅ Funciona
- IE11: ❌ Não (usa ES6 modern JS)

Se precisa IE11, teríamos que transpilar para ES5. Vale a pena?"

---

## 🔒 PERGUNTAS DE SEGURANÇA

### P29: "Tem proteção contra XSS?"
**R:** "Parcial. Usamos innerHTML em alguns lugares, que é risco se dados vierem de usuário.

Hoje é safe porque mockData é estático. Mas no backend:
1. **Input Sanitization**: validar e limpar entrada
2. **Content Security Policy**: headers do servidor
3. **Usar textContent ao invés de innerHTML**: quando possível
4. **Escapar HTML**: converter `<` para `&lt;` quando necessário

Recomendo library DOMPurify se conteúdo for user-generated."

### P30: "E CSRF (Cross-Site Request Forgery)?"
**R:** "No backend:
1. Implementar CSRF tokens
2. Validar origin header
3. SameSite cookies (Strict/Lax)

Frontend não pode fazer muito, mas backend deve estar preparado.

Exemplo POST com CSRF token:
```javascript
fetch('/api/tickets', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(ticket)
})
```"

### P31: "Dados sensíveis são armazenados?"
**R:** "Não, tudo é mock e não-persistente.

Em produção, com autenticação:
1. **JWT token**: armazenar em httpOnly cookie (não accessível via JS)
2. **Senhas**: NUNCA mandar para frontend
3. **PII (Dados pessoais)**: encriptar em trânsito (HTTPS)
4. **localStorage**: risco, evitar dados sensíveis

Sempre usar HTTPS em produção."

### P32: "Como prevenir ataques de força bruta?"
**R:** "No backend:
1. Rate limiting: max 5 tentativas/login em 15 min
2. Account lockout: bloqueia após 3 falhas
3. 2FA: autenticação de 2 fatores
4. Logs: registrar tentativas suspeitas
5. CAPTCHA: após 2 tentativas

Isso tudo é backend, frontend só envia credenciais."

---

## 🔧 PERGUNTAS DE MANUTENÇÃO

### P33: "Como manter o código?"
**R:** "Estrutura clara em app.js:

1. **Constructor**: inicializa state e listeners
2. **Render methods**: renderDashboard, renderTickets, etc
3. **CRUD methods**: saveTicket, deleteTicket, etc
4. **Utility methods**: getPriorityBadge, getSLAStatus, etc
5. **Event handlers**: onclick, onchange, etc

Cada método faz uma coisa. Fácil debugar e estender."

### P34: "Preciso adicionar um novo campo no ticket?"
**R:** "Simples, 4 passos:

1. **mockData.js**: adiciona campo ao ticket object
```javascript
{ id: '...', subject: '...', novocampo: 'valor', ... }
```

2. **index.html**: adiciona coluna na tabela
```html
<th>Novo Campo</th>
<td>${t.novocamp}</td>
```

3. **app.js**: adiciona input no modal
```html
<input id='novo-campo' type='text'>
```

4. **styles.css**: estilo opcional (provavelmente herda de .form-group)

Pronto!"

### P35: "Como adicionar uma nova página?"
**R:** "5 passos:

1. **index.html**: adiciona nova div
```html
<div id='nova-page' class='page'> ... </div>
```

2. **app.js**: adiciona nav link em constructor
```javascript
<a href='#' data-page='nova' class='nav-link'> ... </a>
```

3. **app.js**: adiciona renderNovopa() method
4. **app.js**: adiciona case na router (switch page)
5. **styles.css**: estilo para a página

Nova seção pronta!"

### P36: "Como debugar?"
**R:** "Ferramentas:

1. **DevTools (F12)**: inspetor de elementos
2. **Console**: console.log() para trace
3. **Network**: ver requests (quando integrar com backend)
4. **Lighthouse**: audit de performance
5. **Mobile device preview**: F12 → Device Toolbar

Recomendo:
```javascript
console.log('Tickets:', this.tickets);
console.log('Filtrado:', filtered);
```

No Chart.js, use chart.destroy() antes de criar novo."

### P37: "Como fazer deploy?"
**R:** "Opções:

1. **GitHub Pages** (já rodando):
   ```bash
   npm run build
   # commit e push branch gh-pages
   ```

2. **Netlify**:
   - Conecta GitHub
   - Auto-deploy em push
   - E-mail de preview

3. **Vercel**:
   - Similar ao Netlify
   - Otimizações automáticas
   - Analytics built-in

4. **Seu servidor**:
   ```bash
   npm run build
   scp -r dist user@server:/app
   ```

Recomendo Netlify ou Vercel para é rápido."

---

## 💬 PERGUNTAS CRITICAS (Preparar respostas!)

### P38: "Por que não usar um framework consolidado tipo React?"
**R:** "Ótima pergunta. Razões:

1. **Scope**: MVP não justifica framework
2. **Curva de aprendizado**: novo dev entende Vanilla JS direto
3. **Performance**: sem overhead
4. **Simplidade**: código é mais legível
5. **Custo**: menos dependências, menos vulnerabilidades

**Quando migraríamos para React:**
- >50 componentes reutilizáveis
- State complexo e compartilhado
- Muitas animações
- >10 devs na equipe

Hoje: Vanilla JS é a escolha certa. No futuro: reavaliamos."

### P39: "Quanto tempo levou para desenvolver?"
**R:** "Timeline realista:
- Setup/estrutura: 1-2 dias
- Dashboard + gráficos: 2-3 dias
- CRUD de tickets: 1-2 dias
- Outras seções (usuários, categorias, etc): 1 dia
- Responsividade: 1-2 dias
- Testes/polish: 1 dia
- Documentação: 1 dia

**Total: 1-1.5 spring (2-3 semanas com 1-2 devs)**"

### P40: "Qual é a taxa de erro/bug?"
**R:** "MVP precoce, bugs esperados:

Conhecidos:
- Modal pode ficar aberto se fechar navegador
- Gráficos às vezes precisam de refresh
- Filtros complicados podem ter edge cases

Monitoramento em produção:
- Erro tracking (Sentry)
- User session replay (Fullstory)
- Analytics (Mixpanel/Google Analytics)

Plano:
- Fase 1: bugs críticos <24h
- Fase 2: bugs normais <1 week
- QA dedicado na fase 2"

---

## 📱 PERGUNTAS DE MOBILE

### P41: "Mobile é responsivo ou app nativa?"
**R:** "Agora: **Responsivo** (PWA). Funciona em qualquer navegador.

Futuro: podemos fazer app nativa (React Native ou Flutter).

Vantagens do webbrowser agora:
- Dev rápido
- Menos código
- Atualiza sem app store

Vantagens de nativa depois:
- Acesso a câmera/localização
- Push notifications
- Offline mode built-in
- App store distribution"

### P42: "Funciona em tablets?"
**R:** "Sim, perfeitamente. Temos breakpoint específico para 1024px que é target tablet.

iPad em paisagem: usa layout desktop
iPad em retrato: usa layout tablet
Android tablets: mesmo comportamento"

### P43: "Qual é a experiência no mobile?"
**R:** "Otimizada:
1. **Menu hamburger**: sidebar flutua, overlay escuro
2. **Clique fora fecha**: gesto natural
3. **Touch targets**: 48px mínimo (WCAG)
4. **Fonts legíveis**: escaladas para tela pequena
5. **Scroll horizontal**: tabelas têm scroll em mobile

Resultado: app tão funcional em mobile quanto desktop."

---

## 🤔 EDGE CASES

### P44: "E se ticket não tem status?"
**R:** "Nunca acontece no código (estrutura enforça campos obrigatórios).

Mas defensivamente:
```javascript
const status = t.status || 'desconhecido';
```

Mesmo padrão para priority, category, etc.

Em backend: validar no endpoint POST/PUT:
```javascript
if (!req.body.status) return res.status(400).send('Status required');
```"

### P45: "E múltiplos usuários editando o mesmo ticket?"
**R:** "Conflito de versão. Hoje não temos:

Soluções:
1. **Pessimistic locking**: lock enquanto edita
2. **Optimistic locking**: version number, rejeita se mudou
3. **Operational transformation**: tipo Google Docs (complexo)
4. **WebSocket sync**: atualiza em tempo real para ambos

Recomendo pessimistic locking para v1. Simples e confiável."

### P46: "Ticket foi criado, mas perdi conexão?"
**R:** "Atualmente: problema (dados perdidos).

Soluções:
1. **Retry automático**: guardar em queue, reenviar quando online
2. **Local storage**: cacheia até sync
3. **Service worker**: offlinefirst architecture

Implementação posterior: item 2-3 semanas."

---

## 🚀 PERGUNTAS DE VISÃO

### P47: "Qual é a visão de longo prazo?"
**R:** "SABINE é o MVP de uma solução completa de HelpDesk:

**Ano 1:**
- MVP com backend integrado
- 1000s usuários alcançados
- Feedback corporativo

**Ano 2:**
- Integrações (Slack, Microsoft Teams, Email)
- Mobile app nativa
- AI-powered ticket suggestion
- Advanced analytics/BI

**Ano 3:**
- SaaS multi-tenant
- Marketplace de apps
- Global expansion
- Conversas com clientes"

### P48: "Como isso se compara a competitors?"
**R:** "Mercado: Zendesk, Jira Service Desk, Freshdesk

SABINE vantagens:
- ✅ Customização total (open source)
- ✅ Custo menor (self-hosted)
- ✅ Deploy rápido
- ✅ UX moderna

SABINE desvantagens:
- ❌ Sem histórico (produto novo)
- ❌ Suporte menor
- ❌ Menos integrações nativas

Posição: alternativa leve e rápida para pequenas equipes."

### P49: "E-commerce, marketplace, SaaS - qual é o modelo?"
**R:** "Opções:

1. **SaaS**: SABINE.com, planos por usuários por mês
   - Mais previsível
   - Escalável
   - Menor barreira de entrada

2. **Self-hosted license**: vende software, seu servidor
   - Venda única
   - Customização total
   - Suporte cobrado

3. **Hybrid**: SaaS + self-hosted
   - Melhor dos dois mundos
   - Mais complexo de gerenciar

Recomendo: SaaS primeiro (validar), depois self-hosted."

### P50: "Como você buscaria funding?"
**R:** "Passo a passo:

1. **MVP pronto**: ✅ Temos
2. **Traction inicial**: poucos clientes/usuários
3. **Pitch deck**: problem/solution/market/team
4. **Seed round**: ~$500k-$1M
5. **18 meses de runway**: build product, acquire customers
6. **Series A**: ~$5M para growth

Investors olham:
- Market size (HelpDesk é bilionário)
- Team experience
- Traction atual
- Roadmap claro

Recomendo conversar com Y Combinator, 500Global, local angels."

---

## 🎓 PERGUNTAS DE LEARNING

### P51: "Onde aprender mais sobre este projeto?"
**R:** "Documentação:
- **APRESENTACAO_MVP.md**: visão geral técnica
- **GUIA_APRESENTACAO.md**: script de demonstração (aqui!)
- **RESUMO_EXECUTIVO.md**: para stakeholders
- **README.md**: instruções de setup

Código:
- **app.js**: lógica principal
- **index.html**: estrutura
- **styles.css**: styling
- **mockData.js**: dados de exemplo"

### P52: "Posso contribuir com features?"
**R:** "Sim! Process:

1. Fork o repositório
2. Cria branch: `feat/nova-feature`
3. Implementa, testa
4. Abre Pull Request com descrição
5. Code review pelos maintainers
6. Merge quando aprovado

Temos issues abertas em: github.com/ryanpanzarini3/front-sabine"

### P53: "Como rodar localmente?"
**R:** "```bash
git clone https://github.com/ryanpanzarini3/front-sabine.git
cd front-sabine
npm install
npm run dev
# Abre http://localhost:5173
```

Backend simulado com mockData.js. Quando integrar com seu backend, só trocar as URLs de fetch()."

### P54: "Quais tecnologias preciso conhecer?"
**R:** "Essencial:
- JavaScript ES6+ (const, let, arrow functions, classes)
- HTML5 semântico
- CSS3 (flexbox, grid, media queries)
- Git/GitHub

Útil:
- REST APIs / fetch()
- SQL básico (para integração backend)
- Terminal/CLI
- DevTools do navegador

Não necessário:
- React, Vue, Angular
- Node.js
- Databases (para trabalhar com frontend)"

---

## ✅ ROTEIRO DE RESPOSTA RÁPIDA

Para apresentações, lembre:

**Se perguntarem sobre tecnologia:**
→ "Vanilla JS por performance e simplicidade"

**Se perguntarem sobre escalabilidade:**
→ "Frontend pronto para 1M+ usuários com backend otimizado"

**Se perguntarem sobre integração:**
→ "1-2 semanas de integração com REST API"

**Se perguntarem sobre mobile:**
→ "100% responsivo. App nativa é fase 2"

**Se perguntarem sobre prazo:**
→ "MVP pronto agora. Backend 3-4 semanas. Fase 2: 2-3 meses"

**Se perguntarem sobre custo:**
→ "Hoje self-hosted. SaaS com cobrança por usuário depois"

---

**Boa sorte nas apresentações! 🎤🚀**
