# Checklist de Implementação - Integração Frontend x Backend

## ✅ Fase 1: Configuração da Infraestrutura (COMPLETA)

### Variáveis de Ambiente
- [x] Arquivo `.env.local` criado
- [x] `VITE_API_BASE_URL=http://localhost:8080/api/v1` configurado

### Arquivos de Serviço Criados
- [x] `src/services/http.js` - Camada HTTP com tratamento de erros
- [x] `src/services/enums.js` - Mapeadores de enums bidirecional
- [x] `src/services/adapters.js` - Conversão de dados API ↔ UI
- [x] `src/services/api.js` - Módulos de API por recurso
- [x] `src/main.js` - Ponto de entrada e inicialização

### Integração no HTML
- [x] `index.html` atualizado para carregar `main.js` como module

### Métodos Adicionados ao App (via main.js)
- [x] `loadDataFromAPI()` - Carrega dados ao fazer login
- [x] `saveTicketToAPI()`
- [x] `deleteTicketFromAPI()`
- [x] `sendMessageToAPI()`
- [x] `saveUserToAPI()`
- [x] `deleteUserFromAPI()`
- [x] `saveCategoryToAPI()`
- [x] `deleteCategoryToAPI()`
- [x] `saveDepartmentToAPI()`
- [x] `deleteDepartmentToAPI()`

### Documentação
- [x] `INTEGRACAO_API.md` - Guia completo de integração
- [x] `EXEMPLOS_INTEGRACAO.md` - Exemplos concretos de código
- [x] `CHECKLIST_IMPLEMENTACAO.md` - Este arquivo

---

## 🔧 Fase 2: Integração de Métodos no app.js (A FAZER)

### Login e Autenticação
- [ ] Modificar `handleLogin()` para carregar dados da API após login
  - [ ] Chamar `this.loadDataFromAPI()` após login bem-sucedido
  - [ ] Implementar tratamento de token (quando backend tiver autenticação)

- [ ] Modificar `handleLogout()` para limpar token
  - [ ] Chamar `httpClient.setToken(null)`
  - [ ] Limpar localStorage

### Operações com Tickets
- [ ] Modificar `createTicket()` para usar API
  - [ ] Validar campos
  - [ ] Chamar `this.saveTicketToAPI()`
  - [ ] Adicionar à lista local `this.tickets`
  - [ ] Feedback ao usuário
  - [ ] Lidar com erros (ex: email já existe → status 409)

- [ ] Modificar `updateTicketStatus()` para usar API
  - [ ] Chamar `this.saveTicketToAPI()`
  - [ ] Atualizar `this.currentTicket` e lista `this.tickets`
  - [ ] Re-renderizar

- [ ] Modificar `updateTicketPriority()` para usar API
  - [ ] Chamar `this.saveTicketToAPI()`
  - [ ] Atualizar `this.currentTicket` e lista `this.tickets`
  - [ ] Re-renderizar

- [ ] Modificar `deleteTicket()` para usar API
  - [ ] Chamar `this.deleteTicketFromAPI()`
  - [ ] Remover de `this.tickets`
  - [ ] Se era ticket em visualização, voltar para lista

- [ ] Modificar `sendMessage()` para usar API
  - [ ] Chamar `this.sendMessageToAPI()`
  - [ ] Adicionar mensagem à lista `this.currentTicket.messages`
  - [ ] Re-renderizar histórico

### Operações com Usuários
- [ ] Modificar `createUser()` para usar API
  - [ ] Validar campos (obrigatórios, email válido)
  - [ ] Chamar `this.saveUserToAPI()`
  - [ ] Adicionar à lista `this.users`
  - [ ] Feedback ao usuário
  - [ ] Lidar com erro 409 (email já existe)

- [ ] Modificar `updateUser()` para usar API (se existir)
  - [ ] Chamar `this.saveUserToAPI()`
  - [ ] Atualizar `this.users`

- [ ] Modificar `deleteUser()` para usar API
  - [ ] Chamar `this.deleteUserFromAPI()`
  - [ ] Remover de `this.users`
  - [ ] Re-renderizar

- [ ] Modificar `editUser()` para usar API (se existir)
  - [ ] Chamar `this.saveUserToAPI()` com dados atualizados

### Operações com Categorias
- [ ] Modificar `createCategory()` para usar API
  - [ ] Validar campos (nome, SLA policy)
  - [ ] Chamar `this.saveCategoryToAPI()`
  - [ ] Adicionar à lista `this.categories`
  - [ ] Feedback ao usuário

- [ ] Modificar `updateCategory()` para usar API (se existir)
  - [ ] Chamar `this.saveCategoryToAPI()`
  - [ ] Atualizar `this.categories`

- [ ] Modificar `deleteCategory()` para usar API
  - [ ] Chamar `this.deleteCategoryToAPI()`
  - [ ] Remover de `this.categories`
  - [ ] Re-renderizar

### Operações com Departamentos
- [ ] Modificar `createDepartment()` para usar API
  - [ ] Validar campos (nome)
  - [ ] Chamar `this.saveDepartmentToAPI()`
  - [ ] Adicionar à lista `this.departments`
  - [ ] Feedback ao usuário

- [ ] Modificar `updateDepartment()` para usar API (se existir)
  - [ ] Chamar `this.saveDepartmentToAPI()`
  - [ ] Atualizar `this.departments`

- [ ] Modificar `deleteDepartment()` para usar API
  - [ ] Chamar `this.deleteDepartmentFromAPI()`
  - [ ] Remover de `this.departments`
  - [ ] Re-renderizar

### Operações com Notificações
- [ ] Verificar se há operações CRUD com notificações
- [ ] Se houver, seguir o mesmo padrão

### Operações com SLA Policies
- [ ] Verificar se há operações CRUD com SLA policies
- [ ] Se houver, seguir o mesmo padrão

---

## 🧪 Fase 3: Testes (A FAZER)

### Configuração Inicial
- [ ] Backend rodando em `http://localhost:8080`
- [ ] Frontend rodando em `http://localhost:5173` (npm run dev)
- [ ] CORS configurado no backend para aceitar frontend
- [ ] Sem erros de CORS no console do navegador

### Testes Funcionais
- [ ] **Dashboard**: Carrega tickets, usuários, categorias ao fazer login
  - [ ] Métricas mostram números corretos
  - [ ] Gráficos mostram dados da API

- [ ] **Tickets**:
  - [ ] [ ] Listar tickets da API funciona
  - [ ] [ ] Criar novo ticket funciona
  - [ ] [ ] Editar status de ticket funciona
  - [ ] [ ] Editar prioridade de ticket funciona
  - [ ] [ ] Deletar ticket funciona
  - [ ] [ ] Filtros funcionam com dados da API
  - [ ] [ ] Visualizar detalhe do ticket funciona

- [ ] **Mensagens de Ticket**:
  - [ ] [ ] Enviar mensagem pública funciona
  - [ ] [ ] Enviar mensagem interna funciona
  - [ ] [ ] Histórico de mensagens mostra dados corretos
  - [ ] [ ] Mensagens aparecem em tempo real (ou após atualizar página)

- [ ] **Usuários**:
  - [ ] [ ] Listar usuários da API funciona
  - [ ] [ ] Criar novo usuário funciona
  - [ ] [ ] Editar usuário funciona (se implementado)
  - [ ] [ ] Deletar usuário funciona
  - [ ] [ ] Erro 409 (email já existe) é tratado corretamente

- [ ] **Categorias**:
  - [ ] [ ] Listar categorias da API funciona
  - [ ] [ ] Criar nova categoria funciona
  - [ ] [ ] Editar categoria funciona (se implementado)
  - [ ] [ ] Deletar categoria funciona

- [ ] **Departamentos**:
  - [ ] [ ] Listar departamentos da API funciona
  - [ ] [ ] Criar novo departamento funciona
  - [ ] [ ] Editar departamento funciona (se implementado)
  - [ ] [ ] Deletar departamento funciona

- [ ] **Notificações**:
  - [ ] [ ] Listar notificações da API funciona (se implementado)
  - [ ] [ ] Badge de notificações não lidas funciona

### Testes de Erro
- [ ] Erro 400 (validação): mensagem amigável é exibida
- [ ] Erro 401 (não autorizado): usuário é deslogado e redirecionado para login
- [ ] Erro 404 (recurso não encontrado): mensagem apropriada é exibida
- [ ] Erro 409 (conflito): mensagem específica é exibida (ex: email já existe)
- [ ] Erro 500 (servidor): mensagem apropriada é exibida
- [ ] Erro de CORS: verificar console e configurar CORS no backend
- [ ] Timeout/conexão perdida: mensagem informativa ao usuário

### Testes de Enums
- [ ] Enums de prioridade renderizam corretamente (critica, alta, media, baixa)
- [ ] Enums de status renderizam corretamente (aberto, em_andamento, resolvido, fechado)
- [ ] Enums de channel renderizam corretamente (email, telefone, slack, portal)
- [ ] Enums de message type renderizam corretamente (public, internal)
- [ ] Enums de notification type renderizam corretamente

### Testes de Relacionamentos
- [ ] IDs de relacionamento são enviados corretamente (categoryId, clientId, assigneeId, etc)
- [ ] Dados relacionados são exibidos corretamente (ex: nome da categoria aparece)
- [ ] Campos opcionais (assigneeId, ticketId) podem ser null

---

## 📋 Ordem Recomendada de Implementação

1. [ ] Modificar `handleLogin()` para carregar dados da API
2. [ ] Modificar `createTicket()` para usar API
3. [ ] Modificar `updateTicketStatus()` para usar API
4. [ ] Modificar `updateTicketPriority()` para usar API
5. [ ] Modificar `sendMessage()` para usar API
6. [ ] Modificar `deleteTicket()` para usar API
7. [ ] Modificar `createUser()` para usar API
8. [ ] Modificar `createCategory()` para usar API
9. [ ] Modificar `createDepartment()` para usar API
10. [ ] Implementar update/delete para usuários
11. [ ] Implementar update/delete para categorias
12. [ ] Implementar update/delete para departamentos
13. [ ] Executar testes completos
14. [ ] Remover mockData do fluxo principal (manter como fallback apenas)

---

## 🎯 Status Geral

### Infraestrutura: ✅ 100% COMPLETA
- Camada HTTP implementada
- Enums mapeados
- Adapters de DTO implementados
- Módulos de API criados
- Integração no HTML feita
- Métodos auxiliares adicionados ao App

### Integração de Métodos: 🔧 0% (NÃO INICIADO)
- Nenhum método do app.js foi modificado ainda
- Todos os 20+ métodos de CRUD precisam ser atualizados

### Testes: 🔧 0% (NÃO INICIADO)
- Testes funcionais ainda não começaram
- Testes de erro ainda não foram feitos

---

## 📞 Dicas Importantes

1. **Sempre usar async/await** para operações com API
2. **Sempre ter try/catch** em torno de chamadas de API
3. **Sempre validar dados** antes de enviar
4. **Sempre atualizar estado local** após sucesso da API
5. **Sempre mostrar feedback** ao usuário (sucesso ou erro)
6. **Sempre re-renderizar UI** após mudança de dados
7. **Sempre usar IDs em relacionamentos** (não nomes)
8. **Sempre converter enums** (adapters fazem automaticamente)
9. **Sempre verificar console** para erros de CORS ou outros
10. **Sempre testar com backend rodando** antes de colocar em produção

---

## 🚀 Próximas Tarefas

1. **Ler o resto do app.js** para encontrar TODOS os métodos de CRUD
2. **Listar todos os métodos** que precisam ser atualizados
3. **Implementar um por um** seguindo o padrão de exemplo
4. **Testar cada um** antes de passar para o próximo
5. **Executar testes completos** da aplicação
6. **Remover mockData** do fluxo principal quando tudo estiver funcionando

---

Boa sorte com a integração! 🚀
