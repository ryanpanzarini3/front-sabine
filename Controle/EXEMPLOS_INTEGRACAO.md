# Exemplos Concretos de Integração com API

Este documento mostra exemplos reais de como modificar os métodos do `app.js` para consumir a API.

## 1. Criar Novo Ticket

### ❌ Versão Antiga (mockData - NÃO USAR MAIS)
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
  }
}
```

### ✅ Versão Nova (com API)
```javascript
async createTicket() {
  const subject = document.getElementById('form-subject').value.trim();
  const description = document.getElementById('form-description').value.trim();
  const categoryId = document.getElementById('form-category').value;
  const priority = document.getElementById('form-priority').value;

  if (!subject || !description || !categoryId) {
    alert('Preencha todos os campos obrigatórios');
    return;
  }

  try {
    // Preparar dados para enviar à API
    const newTicket = {
      subject,
      description,
      categoryId,
      priority,
      status: 'aberto',
      channel: 'portal',
      clientId: this.currentUser?.id, // Enviar ID ao invés de nome
    };

    // Chamar método que foi adicionado em main.js
    const savedTicket = await this.saveTicketToAPI(newTicket);

    // Adicionar ticket salvo à lista local
    this.tickets.unshift(savedTicket);

    // Feedback ao usuário
    alert('Ticket criado com sucesso!');

    // Fechar modal e navegar
    this.closeModal();
    this.navigateTo('tickets');
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    alert(`Erro ao criar ticket: ${error.message}`);
  }
}
```

## 2. Alterar Status ou Prioridade do Ticket

### ❌ Versão Antiga (não persiste no backend)
```javascript
// No detalhe do ticket, ao mudar status
const statusButton = document.getElementById('status-button');
statusButton.addEventListener('click', () => {
  this.currentTicket.status = 'em_andamento'; // Só muda na memória
  this.renderTicketDetail();
});
```

### ✅ Versão Nova (com API)
```javascript
async updateTicketStatus(newStatus) {
  if (!this.currentTicket) return;

  try {
    // Atualizar no backend
    const updatedTicket = {
      ...this.currentTicket,
      status: newStatus,
    };

    await this.saveTicketToAPI(updatedTicket);

    // Atualizar na memória
    this.currentTicket = updatedTicket;

    // Atualizar também na lista
    const idx = this.tickets.findIndex(t => t.id === this.currentTicket.id);
    if (idx !== -1) {
      this.tickets[idx] = updatedTicket;
    }

    // Re-renderizar
    this.renderTicketDetail();
    alert('Status atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    alert(`Erro ao atualizar status: ${error.message}`);
  }
}

// Fazer o mesmo para prioridade
async updateTicketPriority(newPriority) {
  if (!this.currentTicket) return;

  try {
    const updatedTicket = {
      ...this.currentTicket,
      priority: newPriority,
    };

    await this.saveTicketToAPI(updatedTicket);

    this.currentTicket = updatedTicket;
    const idx = this.tickets.findIndex(t => t.id === this.currentTicket.id);
    if (idx !== -1) {
      this.tickets[idx] = updatedTicket;
    }

    this.renderTicketDetail();
  } catch (error) {
    console.error('Erro ao atualizar prioridade:', error);
    alert(`Erro ao atualizar prioridade: ${error.message}`);
  }
}
```

## 3. Enviar Mensagem em Ticket

### ❌ Versão Antiga (só local)
```javascript
sendMessage() {
  const text = document.getElementById('new-message').value.trim();
  const type = document.getElementById('message-type').value;

  if (text) {
    const message = {
      userId: this.currentUser?.id,
      type,
      text,
      created_at: new Date().toISOString()
    };

    this.currentTicket.messages.push(message); // ❌ Só local
    document.getElementById('new-message').value = '';
    this.renderTicketDetail();
  }
}
```

### ✅ Versão Nova (com API)
```javascript
async sendMessage() {
  const text = document.getElementById('new-message').value.trim();
  const type = document.getElementById('message-type').value;

  if (!text) {
    alert('Digite uma mensagem');
    return;
  }

  try {
    const message = {
      ticketId: this.currentTicket.id,
      type,
      text,
      authorId: this.currentUser?.id,
    };

    // Enviar à API
    const savedMessage = await this.sendMessageToAPI(message);

    // Adicionar à lista local
    this.currentTicket.messages.push(savedMessage);

    // Limpar e re-renderizar
    document.getElementById('new-message').value = '';
    this.renderTicketDetail();
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    alert(`Erro ao enviar mensagem: ${error.message}`);
  }
}
```

## 4. Deletar Ticket

### ❌ Versão Antiga (só local)
```javascript
deleteTicket(ticketId) {
  if (confirm('Tem certeza que quer deletar este ticket?')) {
    this.tickets = this.tickets.filter(t => t.id !== ticketId); // ❌ Só local
    this.renderTicketsPage();
  }
}
```

### ✅ Versão Nova (com API)
```javascript
async deleteTicket(ticketId) {
  if (!confirm('Tem certeza que quer deletar este ticket? Esta ação não pode ser desfeita.')) {
    return;
  }

  try {
    // Deletar no backend
    await this.deleteTicketFromAPI(ticketId);

    // Remover da lista local
    this.tickets = this.tickets.filter(t => t.id !== ticketId);

    // Se era o ticket em visualização, voltar para lista
    if (this.currentTicket?.id === ticketId) {
      this.navigateTo('tickets');
    } else {
      this.renderTicketsPage();
    }

    alert('Ticket deletado com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    alert(`Erro ao deletar ticket: ${error.message}`);
  }
}
```

## 5. Criar Novo Usuário

### ❌ Versão Antiga (mockData)
```javascript
createUser() {
  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const role = document.getElementById('form-role').value;

  if (name && email && role) {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      status: 'active'
    };

    this.users.push(newUser); // ❌ Só local
    this.closeModal();
  }
}
```

### ✅ Versão Nova (com API)
```javascript
async createUser() {
  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const role = document.getElementById('form-role').value;
  const departmentId = document.getElementById('form-department').value;

  if (!name || !email || !role) {
    alert('Preencha todos os campos obrigatórios');
    return;
  }

  try {
    const newUser = {
      name,
      email,
      role,
      departmentId: departmentId || null,
      status: 'active',
    };

    const savedUser = await this.saveUserToAPI(newUser);
    this.users.push(savedUser);

    alert('Usuário criado com sucesso!');
    this.closeModal();
    this.renderUsersPage();
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
    // Tratamento específico de erros
    if (error.status === 409) {
      alert('E-mail já está cadastrado no sistema');
    } else {
      alert(`Erro ao criar usuário: ${error.message}`);
    }
  }
}
```

## 6. Deletar Usuário

### ✅ Versão Nova (com API)
```javascript
async deleteUser(userId) {
  const user = this.users.find(u => u.id === userId);
  if (!user) return;

  if (!confirm(`Deletar usuário "${user.name}"? Esta ação não pode ser desfeita.`)) {
    return;
  }

  try {
    await this.deleteUserFromAPI(userId);
    this.users = this.users.filter(u => u.id !== userId);
    this.renderUsersPage();
    alert('Usuário deletado com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    alert(`Erro ao deletar usuário: ${error.message}`);
  }
}
```

## 7. Criar Categoria

### ✅ Versão Nova (com API)
```javascript
async createCategory() {
  const name = document.getElementById('form-name').value.trim();
  const slaPolicyId = document.getElementById('form-sla').value;

  if (!name || !slaPolicyId) {
    alert('Preencha todos os campos obrigatórios');
    return;
  }

  try {
    const newCategory = {
      name,
      slaPolicyId,
    };

    const savedCategory = await this.saveCategoryToAPI(newCategory);
    this.categories.push(savedCategory);

    alert('Categoria criada com sucesso!');
    this.closeModal();
    this.renderCategoriesPage();
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    alert(`Erro ao criar categoria: ${error.message}`);
  }
}
```

## 8. Criar Departamento

### ✅ Versão Nova (com API)
```javascript
async createDepartment() {
  const name = document.getElementById('form-name').value.trim();
  const managerId = document.getElementById('form-manager').value;

  if (!name) {
    alert('Digite o nome do departamento');
    return;
  }

  try {
    const newDepartment = {
      name,
      managerId: managerId || null,
      status: 'active',
    };

    const savedDepartment = await this.saveDepartmentToAPI(newDepartment);
    this.departments.push(savedDepartment);

    alert('Departamento criado com sucesso!');
    this.closeModal();
    this.renderDepartmentsPage();
  } catch (error) {
    console.error('Erro ao criar departamento:', error);
    alert(`Erro ao criar departamento: ${error.message}`);
  }
}
```

## 9. Carregar Dados ao Fazer Login

### ❌ Versão Antiga (usa mockData)
```javascript
handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    this.currentUser = { ...user };
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.renderInitial(); // Usa this.tickets, this.users (do mockData)
  }
}
```

### ✅ Versão Nova (carrega da API)
```javascript
async handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Preencha e-mail e senha');
    return;
  }

  try {
    // Tentar fazer login (quando backend tiver autenticação)
    // const response = await httpClient.post('/auth/login', { email, password });
    // const { token, user } = response.data;
    // httpClient.setToken(token);
    // this.currentUser = user;
    
    // Por enquanto, validar contra mockData (será removido depois)
    const user = users?.find(u => u.email === email && u.password === password);

    if (!user) {
      alert('E-mail ou senha incorretos');
      return;
    }

    // Salvar usuário
    this.currentUser = { ...user };
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

    // Carregar dados da API
    await this.loadDataFromAPI();

    // Mostrar app
    this.renderInitial();
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert(`Erro ao fazer login: ${error.message}`);
  }
}
```

## 10. Padrão para Operações Assíncronas

Sempre use este padrão para operações que precisam de API:

```javascript
async operacao() {
  try {
    // 1. Validar dados
    if (!validacao) {
      alert('Mensagem de erro');
      return;
    }

    // 2. Preparar dados
    const dados = {
      campo: valor,
    };

    // 3. Chamar API
    const resultado = await this.metodoDaAPI(dados);

    // 4. Atualizar estado local
    this.colecao.push(resultado);

    // 5. Feedback ao usuário
    alert('Sucesso!');

    // 6. Atualizar UI
    this.render();
  } catch (error) {
    // 7. Tratamento de erro
    console.error('Erro:', error);
    
    // Mensagens específicas por tipo de erro
    if (error.status === 400) {
      alert('Dados inválidos: ' + error.message);
    } else if (error.status === 409) {
      alert('Conflito: ' + error.message);
    } else {
      alert(`Erro: ${error.message}`);
    }
  }
}
```

---

**Próximo passo**: Identificar todos os métodos no `app.js` que fazem operações CRUD e aplicar este mesmo padrão!
