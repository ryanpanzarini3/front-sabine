# Guia Rápido: Como Usar a API Integrada

Este arquivo é um guia rápido para começar a integrar a API nos métodos do `app.js`.

## 1️⃣ Antes de Começar

- [ ] Certifique-se de que o backend está rodando em `http://localhost:8080`
- [ ] Certifique-se de que o frontend está rodando em `http://localhost:5173`
- [ ] Verifique se há erros de CORS no console (F12)

## 2️⃣ Como Acessar a API

Todos os métodos de API estão disponíveis em `window.api`:

```javascript
// Dentro de qualquer método do App:
await api.tickets.getAll();
await api.tickets.getById(id);
await api.tickets.create(ticket);
await api.tickets.update(id, ticket);
await api.tickets.delete(id);

// E assim para outros recursos:
api.users, api.categories, api.departments, api.notifications, etc
```

## 3️⃣ Padrão Básico para Modificar um Método

### Exemplo: Modificar `createTicket()`

**Passo 1**: Abrir `app.js` e encontrar o método

```bash
Ctrl+F > "createTicket" 
```

**Passo 2**: Adicionar `async` e try/catch

```javascript
// ANTES
createTicket() {
  // ... código
}

// DEPOIS
async createTicket() {
  try {
    // ... seu código aqui
  } catch (error) {
    console.error('Erro:', error);
    alert(`Erro: ${error.message}`);
  }
}
```

**Passo 3**: Substituir operações locais por chamadas à API

```javascript
// ❌ NÃO FAÇA ISSO
this.tickets.push(newTicket);

// ✅ FAÇA ISSO
const savedTicket = await this.saveTicketToAPI(newTicket);
this.tickets.push(savedTicket);
```

**Passo 4**: Adicionar feedback e re-renderizar

```javascript
alert('Ticket criado com sucesso!');
this.closeModal();
this.renderTicketsPage();
```

## 4️⃣ Métodos Já Preparados no App

Os seguintes métodos foram **adicionados** ao App (via `main.js`) e podem ser chamados:

```javascript
// Carregar todos os dados da API
await this.loadDataFromAPI();

// Tickets
await this.saveTicketToAPI(ticket);      // POST ou PUT
await this.deleteTicketFromAPI(ticketId); // DELETE

// Mensagens
await this.sendMessageToAPI(message);

// Usuários
await this.saveUserToAPI(user);
await this.deleteUserFromAPI(userId);

// Categorias
await this.saveCategoryToAPI(category);
await this.deleteCategoryFromAPI(categoryId);

// Departamentos
await this.saveDepartmentToAPI(department);
await this.deleteDepartmentFromAPI(departmentId);
```

## 5️⃣ Exemplo Prático Completo

Vamos modificar o método `createTicket()`:

### Antes (com mockData)
```javascript
createTicket() {
  const subject = document.getElementById('form-subject').value.trim();
  const description = document.getElementById('form-description').value.trim();
  const categoryId = document.getElementById('form-category').value;
  const priority = document.getElementById('form-priority').value;

  if (subject && description && categoryId) {
    const nextNum = String(this.tickets.length + 1).padStart(3, '0');
    const newTicket = {
      id: `CHM-${nextNum}`,
      subject,
      description,
      category: categoryName,
      priority,
      status: 'aberto',
      channel: 'portal',
      client_name: this.currentUser?.name || 'Cliente',
      assignee_name: 'Não atribuído',
      created_at: new Date().toISOString(),
      messages: []
    };

    this.tickets.unshift(newTicket); // ❌ Só local
    this.closeModal();
    this.navigateTo('tickets');
  }
}
```

### Depois (com API)
```javascript
async createTicket() {
  const subject = document.getElementById('form-subject').value.trim();
  const description = document.getElementById('form-description').value.trim();
  const categoryId = document.getElementById('form-category').value;
  const priority = document.getElementById('form-priority').value;

  // Validação
  if (!subject || !description || !categoryId) {
    alert('Preencha todos os campos obrigatórios');
    return;
  }

  try {
    // Preparar dados para API
    const newTicket = {
      subject,
      description,
      categoryId,           // ✅ ID da categoria
      priority,
      status: 'aberto',
      channel: 'portal',
      clientId: this.currentUser?.id,  // ✅ ID do cliente
    };

    // Chamar API
    const savedTicket = await this.saveTicketToAPI(newTicket);

    // Atualizar lista local
    this.tickets.unshift(savedTicket);

    // Feedback
    alert('Ticket criado com sucesso!');

    // Navegar
    this.closeModal();
    this.navigateTo('tickets');
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    alert(`Erro ao criar ticket: ${error.message}`);
  }
}
```

## 6️⃣ Checklist Antes de Commitar

Quando terminar de modificar um método:

- [ ] Está usando `async/await`?
- [ ] Tem `try/catch`?
- [ ] Está validando os dados?
- [ ] Está chamando `saveTicketToAPI()`, `deleteTicketFromAPI()`, etc?
- [ ] Está atualizando `this.tickets`, `this.users`, etc?
- [ ] Está mostrando feedback ao usuário?
- [ ] Está re-renderizando a UI?
- [ ] Testou no navegador?
- [ ] Verificou o console para erros?

## 7️⃣ Erros Comuns

### ❌ Erro: "Cannot read property 'id' of undefined"
```javascript
// ERRADO - categoryId pode ser undefined
const newTicket = { categoryId }; // ❌

// CORRETO - validar antes
if (!categoryId) {
  alert('Selecione uma categoria');
  return;
}
const newTicket = { categoryId }; // ✅
```

### ❌ Erro: "this.saveTicketToAPI is not a function"
```javascript
// ERRADO - saveTicketToAPI só existe se main.js foi carregado
await this.saveTicketToAPI(newTicket); // ❌

// CORRETO - verificar se existe
if (!this.saveTicketToAPI) {
  alert('API não foi inicializada');
  return;
}
// OU usar api global
const savedTicket = await window.api.tickets.create(newTicket); // ✅
```

### ❌ Erro: CORS Policy Blocked
```
Access to XMLHttpRequest at 'http://localhost:8080/api/v1/tickets'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solução**: Configurar CORS no backend para aceitar `http://localhost:5173`

## 8️⃣ Como Debugar

### Ver requisições
1. Abrir DevTools (F12)
2. Ir para aba Network
3. Fazer a operação
4. Ver a requisição HTTP
5. Verificar status (200, 400, 409, 500, etc)
6. Ver response JSON

### Ver logs
```javascript
// Adicionar logs antes de chamar API
console.log('Salvando ticket:', newTicket);

const savedTicket = await this.saveTicketToAPI(newTicket);

console.log('Ticket salvo:', savedTicket);
```

### Ver erros
```javascript
// main.js já faz alguns logs, mas você pode adicionar mais
try {
  await this.saveTicketToAPI(newTicket);
} catch (error) {
  console.error('Status:', error.status);      // 400, 409, 500, etc
  console.error('Mensagem:', error.message);   // Mensagem de erro
  console.error('Dados:', error.data);         // Dados do erro
}
```

## 9️⃣ Próximos Passos

1. Escolher um método simples para começar (ex: `createCategory`)
2. Seguir o padrão de exemplo
3. Testar no navegador
4. Se funcionar, passar para próximo método
5. Se não funcionar, debugar seguindo as dicas acima

## 🔟 Recursos

- [INTEGRACAO_API.md](INTEGRACAO_API.md) - Guia completo
- [EXEMPLOS_INTEGRACAO.md](EXEMPLOS_INTEGRACAO.md) - Exemplos de código
- [CHECKLIST_IMPLEMENTACAO.md](CHECKLIST_IMPLEMENTACAO.md) - Checklist de tudo
- [src/services/api.js](src/services/api.js) - Módulos de API
- [src/services/enums.js](src/services/enums.js) - Conversão de enums
- [src/main.js](src/main.js) - Inicialização

---

Boa sorte! 🚀 Qualquer dúvida, consulte os arquivos de documentação ou o console do navegador.
