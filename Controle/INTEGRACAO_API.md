# Guia de Integração Frontend x Backend

## ✅ O que foi implementado

### 1. Configuração de Variáveis de Ambiente
- ✅ Arquivo `.env.local` criado com `VITE_API_BASE_URL=http://localhost:8080/api/v1`

### 2. Camada HTTP Única (`src/services/http.js`)
- ✅ Classe `HttpClient` com métodos `get()`, `post()`, `put()`, `delete()`
- ✅ Tratamento padronizado de erros por status HTTP (400, 401, 404, 409, 500, 503)
- ✅ Suporte para autenticação com Bearer token
- ✅ Singleton global `httpClient` pronto para uso

### 3. Mapeadores de Enums (`src/services/enums.js`)
- ✅ Conversão bidirecional de todos os enums:
  - `TicketPriority`: crítica ↔ CRITICA, alta ↔ ALTA, media ↔ MEDIA, baixa ↔ BAIXA
  - `TicketStatus`: aberto ↔ ABERTO, em_andamento ↔ EM_ANDAMENTO, etc
  - `TicketChannel`: email ↔ EMAIL, telefone ↔ TELEFONE, slack ↔ SLACK, portal ↔ PORTAL
  - `MessageType`: public ↔ PUBLIC, internal ↔ INTERNAL
  - `NotificationType`: alerta_sla ↔ ALERTA_SLA, violacao_sla ↔ VIOLACAO_SLA, info ↔ INFO, success ↔ SUCCESS
  - `DepartmentStatus/UserStatus`: active ↔ ACTIVE, inactive ↔ INACTIVE
  - `Role`: admin ↔ ADMIN, atendente ↔ ATENDENTE, cliente ↔ CLIENTE

### 4. Adapters de DTO (`src/services/adapters.js`)
- ✅ Conversão de dados API → UI: `fromApiUser()`, `fromApiTicket()`, etc
- ✅ Conversão de dados UI → API: `toApiUser()`, `toApiTicket()`, etc
- ✅ Suporte para campos relacionados por UUID (categoryId, clientId, assigneeId, etc)
- ✅ Conversão de enums automaticamente
- ✅ Batch adapters para arrays: `fromApiUsers()`, `fromApiTickets()`, etc

### 5. Módulos de API por Recurso (`src/services/api.js`)
- ✅ `api.users` - GET, GET{id}, POST, PUT, DELETE
- ✅ `api.tickets` - GET, GET{id}, POST, PUT, DELETE
- ✅ `api.ticketMessages` - GET, GET{id}, POST, PUT, DELETE
- ✅ `api.notifications` - GET, GET{id}, POST, PUT, DELETE
- ✅ `api.categories` - GET, GET{id}, POST, PUT, DELETE
- ✅ `api.departments` - GET, GET{id}, POST, PUT, DELETE
- ✅ `api.slaPolicies` - GET, GET{id}, POST, PUT, DELETE

### 6. Inicialização e Integração (`src/main.js`)
- ✅ Arquivo `main.js` como ponto de entrada
- ✅ Carregamento automático de dados da API quando usuário está logado
- ✅ Métodos adicionados ao App:
  - `loadDataFromAPI()` - Carrega todos os dados da API
  - `saveTicketToAPI()` - Cria ou atualiza ticket
  - `deleteTicketFromAPI()` - Deleta ticket
  - `sendMessageToAPI()` - Envia mensagem de ticket
  - `saveUserToAPI()` - Cria ou atualiza usuário
  - `deleteUserFromAPI()` - Deleta usuário
  - `saveCategoryToAPI()` - Cria ou atualiza categoria
  - `deleteCategoryToAPI()` - Deleta categoria
  - `saveDepartmentToAPI()` - Cria ou atualiza departamento
  - `deleteDepartmentToAPI()` - Deleta departamento

## 📝 Próximos Passos

Para completar a integração, você precisa modificar os métodos do `app.js` que tratam criação, edição e exclusão de dados. Aqui estão as áreas que precisam ser atualizadas:

### 1. Salvar Novo Ticket
**Local**: Encontrar o método `showNewTicketModal()` ou `handleCreateTicket()` no `app.js`

**Antes** (usando dados locais):
```javascript
const newTicket = {
  id: 'CHM-' + (this.tickets.length + 1).toString().padStart(3, '0'),
  subject: formData.subject,
  // ... outros campos
};
this.tickets.push(newTicket);
this.render();
```

**Depois** (usando API):
```javascript
try {
  const newTicket = {
    subject: formData.subject,
    description: formData.description,
    categoryId: formData.categoryId,
    priority: formData.priority,
    status: 'aberto',
    channel: formData.channel,
    clientId: formData.clientId,
  };
  
  const savedTicket = await this.saveTicketToAPI(newTicket);
  this.tickets.push(savedTicket);
  this.closeModal();
  this.render();
} catch (error) {
  alert(`Erro ao criar ticket: ${error.message}`);
}
```

### 2. Atualizar Ticket (Status, Prioridade)
**Local**: Encontrar o método que atualiza status ou prioridade (ex: no detalhe do ticket)

**Depois** (usando API):
```javascript
try {
  const updatedTicket = {
    ...this.currentTicket,
    status: newStatus, // ou priority: newPriority
  };
  
  await this.saveTicketToAPI(updatedTicket);
  this.currentTicket = updatedTicket;
  this.render();
} catch (error) {
  alert(`Erro ao atualizar ticket: ${error.message}`);
}
```

### 3. Deletar Ticket
**Local**: Encontrar o método que deleta ticket

**Depois** (usando API):
```javascript
try {
  await this.deleteTicketFromAPI(ticketId);
  this.tickets = this.tickets.filter(t => t.id !== ticketId);
  this.render();
} catch (error) {
  alert(`Erro ao deletar ticket: ${error.message}`);
}
```

### 4. Enviar Mensagem de Ticket
**Local**: Encontrar o método `sendMessage()` no `app.js`

**Depois** (usando API):
```javascript
try {
  const message = {
    ticketId: this.currentTicket.id,
    type: messageType, // 'public' ou 'internal'
    text: messageText,
    authorId: this.currentUser.id,
  };
  
  const savedMessage = await this.sendMessageToAPI(message);
  this.currentTicket.messages.push(savedMessage);
  this.renderTicketDetail();
} catch (error) {
  alert(`Erro ao enviar mensagem: ${error.message}`);
}
```

### 5. Salvar Novo Usuário
**Local**: Encontrar `showNewUserModal()` ou `handleCreateUser()`

**Depois** (usando API):
```javascript
try {
  const newUser = {
    name: formData.name,
    email: formData.email,
    role: formData.role,
    departmentId: formData.departmentId,
    status: 'active',
  };
  
  const savedUser = await this.saveUserToAPI(newUser);
  this.users.push(savedUser);
  this.closeModal();
  this.render();
} catch (error) {
  alert(`Erro ao criar usuário: ${error.message}`);
}
```

### 6. Deletar Usuário
**Local**: Encontrar o método que deleta usuário

**Depois** (usando API):
```javascript
try {
  await this.deleteUserFromAPI(userId);
  this.users = this.users.filter(u => u.id !== userId);
  this.render();
} catch (error) {
  alert(`Erro ao deletar usuário: ${error.message}`);
}
```

### 7. Salvar Categoria
**Local**: Encontrar `showNewCategoryModal()` ou `handleCreateCategory()`

**Depois** (usando API):
```javascript
try {
  const newCategory = {
    name: formData.name,
    slaPolicyId: formData.slaPolicyId,
  };
  
  const savedCategory = await this.saveCategoryToAPI(newCategory);
  this.categories.push(savedCategory);
  this.closeModal();
  this.render();
} catch (error) {
  alert(`Erro ao criar categoria: ${error.message}`);
}
```

### 8. Deletar Categoria
**Local**: Encontrar o método que deleta categoria

**Depois** (usando API):
```javascript
try {
  await this.deleteCategoryFromAPI(categoryId);
  this.categories = this.categories.filter(c => c.id !== categoryId);
  this.render();
} catch (error) {
  alert(`Erro ao deletar categoria: ${error.message}`);
}
```

### 9. Salvar Departamento
**Local**: Encontrar `showNewDepartmentModal()` ou `handleCreateDepartment()`

**Depois** (usando API):
```javascript
try {
  const newDepartment = {
    name: formData.name,
    managerId: formData.managerId,
    status: 'active',
  };
  
  const savedDepartment = await this.saveDepartmentToAPI(newDepartment);
  this.departments.push(savedDepartment);
  this.closeModal();
  this.render();
} catch (error) {
  alert(`Erro ao criar departamento: ${error.message}`);
}
```

### 10. Deletar Departamento
**Local**: Encontrar o método que deleta departamento

**Depois** (usando API):
```javascript
try {
  await this.deleteDepartmentFromAPI(departmentId);
  this.departments = this.departments.filter(d => d.id !== departmentId);
  this.render();
} catch (error) {
  alert(`Erro ao deletar departamento: ${error.message}`);
}
```

## 🔑 Pontos Importantes

1. **IDs em Relacionamentos**: Sempre enviar UUIDs dos relacionamentos (ex: `categoryId` ao invés de `category`)
2. **Enums**: Os adapters fazem a conversão automaticamente
3. **Null para Opcionais**: Campos como `assigneeId`, `ticketId` podem ser `null`
4. **Datas**: Usar ISO 8601 (ex: `2024-06-16T10:30:00Z`)
5. **Tratamento de Erro**: Cada chamada com try/catch capturando erro.message
6. **CORS**: Configurar no backend para aceitar `http://localhost:5173`

## 🧪 Testando a Integração

1. Iniciar o backend em `http://localhost:8080`
2. Iniciar o frontend com `npm run dev` (que rodará em `http://localhost:5173`)
3. Verificar no console do navegador se há erros de CORS
4. Fazer login
5. Testar operações CRUD em cada página
6. Verificar Network tab para confirmar requisições corretas

## 📋 Checklist Final

- [ ] Backend rodando em `http://localhost:8080/api/v1`
- [ ] Sem erros de CORS no browser
- [ ] Dashboard carrega tickets da API (ao fazer login)
- [ ] Criar ticket novo funciona e envia para API
- [ ] Editar status/prioridade do ticket funciona
- [ ] Deletar ticket funciona
- [ ] Enviar mensagem no ticket funciona
- [ ] CRUD de usuários funciona
- [ ] CRUD de categorias funciona
- [ ] CRUD de departamentos funciona
- [ ] Enums renderizam corretamente (sem erro de parse)

## 🆘 Troubleshooting

### Erro: "Access to XMLHttpRequest has been blocked by CORS policy"
- **Solução**: Configurar CORS no backend para aceitar `http://localhost:5173`

### Erro: "404 - endpoint não encontrado"
- **Solução**: Verificar se a URL da API está correta em `.env.local`
- **Solução**: Verificar se o endpoint existe no backend

### Erro: "Unauthorized" (401)
- **Solução**: Implementar autenticação no backend ou remover temporariamente validação de token

### Dados não carregam após login
- **Solução**: Verificar console do browser para ver erros específicos
- **Solução**: Verificar se `loadDataFromAPI()` está sendo chamado

---

Qualquer dúvida sobre a integração, consulte os arquivos criados em `src/services/`.
