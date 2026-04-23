
class App {
  constructor() {
    this.COLORS = {
      priority: {
        'crítica': '#991b1b',
        'alta': '#dc2626',
        'média': '#f59e0b',
        'baixa': '#10b981'
      },
      status: {
        'aberto': '#3b82f6',
        'em_andamento': '#f59e0b',
        'resolvido': '#10b981',
        'fechado': '#6b7280',
        'aguardando': '#8b5cf6'
      },
      sla: {
        'ok': '#10b981',
        'alerta': '#f59e0b',
        'violado': '#dc2626'
      }
    };

    this.tickets = [...initialTickets];
    this.notifications = [...initialNotifications];
    this.users = users;
    this.categories = categories;
    this.departments = departments;
    this.slaConfigs = slaConfigs;
    this.currentUser = currentUser;

    this.currentPage = 'dashboard';
    this.currentTicket = null;
    this.ticketPageNum = 1;
    this.ticketsPerPage = 8;

    this.filters = {
      search: '',
      status: '',
      priority: '',
      category: ''
    };

    this.priorityChartInstance = null;
    this.statusChartInstance = null;
    this.categoryChartInstance = null;
    this.slaChartInstance = null;

    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.navigateTo(page);
        this.closeSidebar();
      });
    });

   
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('sidebar');
      const menuToggle = document.getElementById('menu-toggle');
      
      if (window.innerWidth <= 768) {
        if (sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      }
    });

    document.getElementById('btn-new-ticket')?.addEventListener('click', () => {
      this.showNewTicketModal();
    });

    document.getElementById('filter-search')?.addEventListener('input', (e) => {
      this.filters.search = e.target.value;
      this.ticketPageNum = 1;
      this.renderTicketsPage();
    });

    document.getElementById('filter-status')?.addEventListener('change', (e) => {
      this.filters.status = e.target.value;
      this.ticketPageNum = 1;
      this.renderTicketsPage();
    });

    document.getElementById('filter-priority')?.addEventListener('change', (e) => {
      this.filters.priority = e.target.value;
      this.ticketPageNum = 1;
      this.renderTicketsPage();
    });

    document.getElementById('filter-category')?.addEventListener('change', (e) => {
      this.filters.category = e.target.value;
      this.ticketPageNum = 1;
      this.renderTicketsPage();
    });

    document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
      this.filters = { search: '', status: '', priority: '', category: '' };
      document.getElementById('filter-search').value = '';
      document.getElementById('filter-status').value = '';
      document.getElementById('filter-priority').value = '';
      document.getElementById('filter-category').value = '';
      this.ticketPageNum = 1;
      this.renderTicketsPage();
    });

    document.getElementById('btn-prev-page')?.addEventListener('click', () => {
      if (this.ticketPageNum > 1) {
        this.ticketPageNum--;
        this.renderTicketsPage();
      }
    });

    document.getElementById('btn-next-page')?.addEventListener('click', () => {
      const filtered = this.getFilteredTickets();
      const totalPages = Math.ceil(filtered.length / this.ticketsPerPage);
      if (this.ticketPageNum < totalPages) {
        this.ticketPageNum++;
        this.renderTicketsPage();
      }
    });

    document.getElementById('bell-btn')?.addEventListener('click', () => {
      this.navigateTo('notifications');
    });

    document.getElementById('btn-mark-all-read')?.addEventListener('click', () => {
      this.notifications.forEach(n => n.read = true);
      this.updateUnreadBadge();
      this.renderNotificationsPage();
    });

    document.querySelector('.modal-close')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal')) {
        this.closeModal();
      }
    });

    document.getElementById('btn-new-user')?.addEventListener('click', () => {
      this.showNewUserModal();
    });

    document.getElementById('btn-new-category')?.addEventListener('click', () => {
      this.showNewCategoryModal();
    });

    document.getElementById('btn-new-department')?.addEventListener('click', () => {
      this.showNewDepartmentModal();
    });

    document.getElementById('btn-back')?.addEventListener('click', () => {
      this.navigateTo('tickets');
    });

    document.getElementById('btn-send-message')?.addEventListener('click', () => {
      this.sendMessage();
    });

    document.getElementById('priority-select')?.addEventListener('change', (e) => {
      if (this.currentTicket) {
        this.currentTicket.priority = e.target.value;
        this.renderTicketDetail();
      }
    });
  }

  navigateTo(page) {
    this.currentPage = page;
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });

    document.getElementById('sidebar')?.classList.remove('open');

    this.render();
  }

  render() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    switch (this.currentPage) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'tickets':
        this.renderTicketsPage();
        break;
      case 'ticket-detail':
        this.renderTicketDetail();
        break;
      case 'users':
        this.renderUsersPage();
        break;
      case 'categories':
        this.renderCategoriesPage();
        break;
      case 'sla':
        this.renderSLAPage();
        break;
      case 'departments':
        this.renderDepartmentsPage();
        break;
      case 'notifications':
        this.renderNotificationsPage();
        break;
    }

    this.updateUnreadBadge();
  }

  renderDashboard() {
    const page = document.getElementById('dashboard-page');
    if (!page) return;

    page.classList.add('active');

    const open = this.tickets.filter(t => t.status === 'aberto').length;
    const progress = this.tickets.filter(t => t.status === 'em_andamento').length;
    const closed = this.tickets.filter(t => t.status === 'resolvido' || t.status === 'fechado').length;
    const slaViolated = this.tickets.filter(t => this.getSLAStatus(t.sla_deadline) === 'violado').length;

    document.getElementById('metric-open').textContent = open;
    document.getElementById('metric-progress').textContent = progress;
    document.getElementById('metric-closed').textContent = closed;
    document.getElementById('metric-sla-violated').textContent = slaViolated;

    this.renderPriorityChart();
    this.renderStatusChart();
    this.renderCategoryChart();
    this.renderSLAChart();
    const latestHTML = this.tickets.slice(0, 5).map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.subject}</td>
        <td>${t.client_name}</td>
        <td>${this.getPriorityBadge(t.priority)}</td>
        <td>${this.getStatusBadge(t.status)}</td>
        <td>${this.formatDate(t.created_at)}</td>
      </tr>
    `).join('');

    document.getElementById('latest-tickets').innerHTML = latestHTML;
  }

  renderPriorityChart() {
    const ctx = document.getElementById('priority-chart');
    if (!ctx) return;
    if (this.priorityChartInstance) {
      this.priorityChartInstance.destroy();
    }

    const priorities = {};
    this.tickets.forEach(t => {
      priorities[t.priority] = (priorities[t.priority] || 0) + 1;
    });

    const labels = Object.keys(priorities);
    const data = Object.values(priorities);
    const colors = labels.map(label => this.COLORS.priority[label] || '#8b5cf6');

    this.priorityChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 11 },
              padding: 10,
              usePointStyle: true,
              boxWidth: 12
            }
          }
        }
      }
    });
  }

  renderStatusChart() {
    const ctx = document.getElementById('status-chart');
    if (!ctx) return;
    if (this.statusChartInstance) {
      this.statusChartInstance.destroy();
    }


    const statuses = {};
    this.tickets.forEach(t => {
      statuses[t.status] = (statuses[t.status] || 0) + 1;
    });

    const labels = Object.keys(statuses);
    const data = Object.values(statuses);
    const colors = labels.map(label => this.COLORS.status[label] || '#6b7280');

    this.statusChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.map(l => l.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')),
        datasets: [{
          label: 'Quantidade',
          data: data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 10 }
            }
          },
          y: {
            ticks: {
              font: { size: 10 }
            }
          }
        }
      }
    });
  }

  renderCategoryChart() {
    const ctx = document.getElementById('category-chart');
    if (!ctx) return;
    if (this.categoryChartInstance) {
      this.categoryChartInstance.destroy();
    }

    const categories = {};
    this.tickets.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + 1;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#dc2626', '#8b5cf6',
      '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#6366f1'
    ];

    this.categoryChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Quantidade',
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'x',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 10 }
            }
          },
          x: {
            ticks: {
              font: { size: 9 }
            }
          }
        }
      }
    });
  }

  renderSLAChart() {
    const ctx = document.getElementById('sla-chart');
    if (!ctx) return;
    if (this.slaChartInstance) {
      this.slaChartInstance.destroy();
    }
    const slaStatuses = {
      'ok': 0,
      'alerta': 0,
      'violado': 0
    };

    this.tickets.forEach(t => {
      const status = this.getSLAStatus(t.sla_deadline);
      slaStatuses[status]++;
    });

    this.slaChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['No Prazo', 'Atenção', 'Violado'],
        datasets: [{
          data: [slaStatuses.ok, slaStatuses.alerta, slaStatuses.violado],
          backgroundColor: [this.COLORS.sla.ok, this.COLORS.sla.alerta, this.COLORS.sla.violado],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 11 },
              padding: 10,
              usePointStyle: true,
              boxWidth: 12
            }
          }
        }
      }
    });
  }

  renderTicketsPage() {
    const page = document.getElementById('tickets-page');
    if (!page) return;

    page.classList.add('active');

    const filtered = this.getFilteredTickets();
    const start = (this.ticketPageNum - 1) * this.ticketsPerPage;
    const end = start + this.ticketsPerPage;
    const paged = filtered.slice(start, end);

    const tbody = document.getElementById('tickets-tbody');
    tbody.innerHTML = paged.map(t => `
      <tr onclick="app.viewTicket('${t.id}')">  
        <td>${t.id}</td>
        <td>${t.subject}</td>
        <td>${t.client_name}</td>
        <td>${t.assignee_name}</td>
        <td>${this.getPriorityBadge(t.priority)}</td>
        <td>${this.getStatusBadge(t.status)}</td>
        <td>${this.formatDate(t.created_at)}</td>
      </tr>
    `).join('');

    const totalPages = Math.ceil(filtered.length / this.ticketsPerPage);
    const pageNumsHTML = Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
      <button class="${p === this.ticketPageNum ? 'active' : ''}" onclick="app.goToPage(${p})">${p}</button>
    `).join('');

    document.getElementById('page-numbers').innerHTML = pageNumsHTML;

    document.getElementById('btn-prev-page').disabled = this.ticketPageNum === 1;
    document.getElementById('btn-next-page').disabled = this.ticketPageNum === totalPages;
  }

  getFilteredTickets() {
    return this.tickets.filter(t => {
      const matchSearch = t.id.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                          t.subject.toLowerCase().includes(this.filters.search.toLowerCase());
      const matchStatus = !this.filters.status || t.status === this.filters.status;
      const matchPriority = !this.filters.priority || t.priority === this.filters.priority;
      const matchCategory = !this.filters.category || t.category === this.filters.category;

      return matchSearch && matchStatus && matchPriority && matchCategory;
    });
  }

  goToPage(page) {
    this.ticketPageNum = page;
    this.renderTicketsPage();
    document.querySelector('.page-content').scrollTop = 0;
  }

  viewTicket(id) {
    this.currentTicket = this.tickets.find(t => t.id === id);
    if (this.currentTicket) {
      this.currentPage = 'ticket-detail';
      this.renderTicketDetail();
    }
  }

  renderTicketDetail() {
    const page = document.getElementById('ticket-detail-page');
    if (!page || !this.currentTicket) return;

    page.classList.add('active');
    const t = this.currentTicket;
    const infoHTML = `
      <div class="ticket-info-field">
        <p>Cliente</p>
        <p>${t.client_name}</p>
      </div>
      <div class="ticket-info-field">
        <p>Atendente</p>
        <p>${t.assignee_name}</p>
      </div>
      <div class="ticket-info-field">
        <p>Categoria</p>
        <p>${t.category}</p>
      </div>
      <div class="ticket-info-field">
        <p>Canal</p>
        <p>${t.channel}</p>
      </div>
      <div class="ticket-info-field">
        <p>Criado em</p>
        <p>${this.formatDate(t.created_at)}</p>
      </div>
    `;
    document.getElementById('ticket-info').innerHTML = infoHTML;
    document.getElementById('ticket-description').textContent = t.description;
    const messagesHTML = (t.messages || []).map(m => `
      <div class="message ${m.type}">
        <div class="message-type">${m.type === 'public' ? '👤 Público' : '🔒 Interno'}</div>
        <div class="message-text">${m.text}</div>
        <div class="message-time">${this.formatDate(m.created_at)}</div>
      </div>
    `).join('');
    document.getElementById('messages-list').innerHTML = messagesHTML;
    const slaStatus = this.getSLAStatus(t.sla_deadline);
    const slaHTML = `
      <div class="ticket-info-field">
        <p>1ª Resposta</p>
        <p>${t.sla_first_response}</p>
        ${this.getSLAStatusBadge(slaStatus)}
      </div>
      <div class="ticket-info-field">
        <p>Resolução</p>
        <p>${t.sla_resolution}</p>
        ${this.getSLAStatusBadge(slaStatus)}
      </div>
    `;
    document.getElementById('sla-info').innerHTML = slaHTML;
    const statuses = ['aberto', 'em_andamento', 'resolvido', 'fechado'];
    const statusHTML = statuses.map(s => `
      <button class="btn ${t.status === s ? 'btn-primary' : 'btn-secondary'}" 
              onclick="app.updateTicketStatus('${s}')">
        ${s.charAt(0).toUpperCase() + s.slice(1)}
      </button>
    `).join('');
    document.getElementById('status-buttons').innerHTML = statusHTML;
    const prioritySelect = document.getElementById('priority-select');
    const priorities = ['critica', 'alta', 'media', 'baixa'];
    prioritySelect.innerHTML = priorities.map(p => `
      <option value="${p}" ${t.priority === p ? 'selected' : ''}>${p.charAt(0).toUpperCase() + p.slice(1)}</option>
    `).join('');
  }

  updateTicketStatus(status) {
    if (this.currentTicket) {
      this.currentTicket.status = status;
      this.renderTicketDetail();
    }
  }

  sendMessage() {
    const messageInput = document.getElementById('new-message');
    const messageType = document.getElementById('message-type').value;
    const text = messageInput.value.trim();

    if (!text || !this.currentTicket) return;

    if (!this.currentTicket.messages) {
      this.currentTicket.messages = [];
    }

    this.currentTicket.messages.push({
      userId: this.currentUser.id,
      type: messageType,
      text: text,
      created_at: new Date().toISOString()
    });

    messageInput.value = '';
    this.renderTicketDetail();
  }

  renderUsersPage() {
    const page = document.getElementById('users-page');
    if (!page) return;

    page.classList.add('active');

    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = this.users.map(u => `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>${u.department}</td>
        <td>${u.status === 'active' ? '✓ Ativo' : '✗ Inativo'}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="app.editUser('${u.id}')">Editar</button>
        </td>
      </tr>
    `).join('');
  }

  editUser(id) {
    alert(`Editar usuário ${id}`);
  }

  showNewUserModal() {
    const html = `
      <h2>Novo Usuário</h2>
      <form>
        <div class="form-group">
          <label>Nome</label>
          <input type="text" id="form-name" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="form-email" required>
        </div>
        <div class="form-group">
          <label>Departamento</label>
          <select id="form-department">
            ${this.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="app.createUser()">Criar</button>
        </div>
      </form>
    `;
    this.openModal(html);
  }

  createUser() {
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const department = document.getElementById('form-department').value;

    if (name && email) {
      this.users.push({
        id: 'user-' + Date.now(),
        name,
        email,
        role: 'atendente',
        department,
        status: 'active'
      });
      this.closeModal();
      this.renderUsersPage();
    }
  }

  renderCategoriesPage() {
    const page = document.getElementById('categories-page');
    if (!page) return;

    page.classList.add('active');

    const tbody = document.getElementById('categories-tbody');
    tbody.innerHTML = this.categories.map(c => {
      const sla = this.slaConfigs.find(s => s.id === c.sla_id);
      return `
        <tr>
          <td>${c.name}</td>
          <td>${sla ? sla.name : 'N/A'}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="app.editCategory('${c.id}')">Editar</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  editCategory(id) {
    alert(`Editar categoria ${id}`);
  }

  showNewCategoryModal() {
    const html = `
      <h2>Nova Categoria</h2>
      <form>
        <div class="form-group">
          <label>Nome</label>
          <input type="text" id="form-cat-name" required>
        </div>
        <div class="form-group">
          <label>SLA</label>
          <select id="form-cat-sla">
            ${this.slaConfigs.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="app.createCategory()">Criar</button>
        </div>
      </form>
    `;
    this.openModal(html);
  }

  createCategory() {
    const name = document.getElementById('form-cat-name').value;
    const slaId = document.getElementById('form-cat-sla').value;

    if (name) {
      this.categories.push({
        id: 'cat-' + Date.now(),
        name,
        sla_id: slaId
      });
      this.closeModal();
      this.renderCategoriesPage();
    }
  }

  renderSLAPage() {
    const page = document.getElementById('sla-page');
    if (!page) return;

    page.classList.add('active');

    const html = this.slaConfigs.map(s => `
      <div class="sla-card">
        <h3>${s.name}</h3>
        <p><strong>Resposta:</strong> ${s.response_time}</p>
        <p><strong>Resolução:</strong> ${s.resolution_time}</p>
      </div>
    `).join('');

    document.getElementById('sla-list').innerHTML = html;
  }

  renderDepartmentsPage() {
    const page = document.getElementById('departments-page');
    if (!page) return;

    page.classList.add('active');

    const tbody = document.getElementById('departments-tbody');
    tbody.innerHTML = this.departments.map(d => `
      <tr>
        <td>${d.name}</td>
        <td>${d.manager}</td>
        <td>${d.status === 'active' ? '✓ Ativo' : '✗ Inativo'}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="app.editDepartment('${d.id}')">Editar</button>
        </td>
      </tr>
    `).join('');
  }

  editDepartment(id) {
    alert(`Editar departamento ${id}`);
  }

  showNewDepartmentModal() {
    const html = `
      <h2>Novo Departamento</h2>
      <form>
        <div class="form-group">
          <label>Nome</label>
          <input type="text" id="form-dept-name" required>
        </div>
        <div class="form-group">
          <label>Gerente</label>
          <input type="text" id="form-dept-manager" required>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="app.createDepartment()">Criar</button>
        </div>
      </form>
    `;
    this.openModal(html);
  }

  createDepartment() {
    const name = document.getElementById('form-dept-name').value;
    const manager = document.getElementById('form-dept-manager').value;

    if (name && manager) {
      this.departments.push({
        id: 'dept-' + Date.now(),
        name,
        manager,
        status: 'active'
      });
      this.closeModal();
      this.renderDepartmentsPage();
    }
  }

  renderNotificationsPage() {
    const page = document.getElementById('notifications-page');
    if (!page) return;

    page.classList.add('active');

    const html = this.notifications.map(n => `
      <div class="notification-item ${n.read ? 'read' : ''} ${n.type === 'violacao_sla' ? 'danger' : 'warning'}" 
           onclick="app.openNotification('${n.id}', '${n.ticketId}')">
        <strong>${n.title}</strong>
        <p>${n.message}</p>
        <small>${this.formatDate(n.created_at)}</small>
      </div>
    `).join('');

    document.getElementById('notifications-list').innerHTML = html;
  }

  openNotification(id, ticketId) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.updateUnreadBadge();
      this.renderNotificationsPage();

      if (ticketId) {
        this.viewTicket(ticketId);
      }
    }
  }

  openModal(html) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = html;
    modal.classList.remove('hidden');
  }

  closeModal() {
    document.getElementById('modal').classList.add('hidden');
  }

  showNewTicketModal() {
    const html = `
      <h2>Novo Chamado</h2>
      <form>
        <div class="form-group">
          <label>Assunto</label>
          <input type="text" id="form-subject" required>
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <textarea id="form-description" required rows="4"></textarea>
        </div>
        <div class="form-group">
          <label>Categoria</label>
          <select id="form-category" required>
            ${this.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Prioridade</label>
          <select id="form-priority">
            <option value="media">Média</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="app.createTicket()">Criar</button>
        </div>
      </form>
    `;
    this.openModal(html);
  }

  createTicket() {
    const subject = document.getElementById('form-subject').value;
    const description = document.getElementById('form-description').value;
    const category = document.getElementById('form-category').value;
    const priority = document.getElementById('form-priority').value;

    if (subject && description && category) {
      const newTicket = {
        id: `CHM-${this.tickets.length + 1}`,
        subject,
        description,
        category,
        priority,
        status: 'aberto',
        channel: 'email',
        client_name: 'Cliente',
        assignee_name: 'Não atribuído',
        created_at: new Date().toISOString(),
        sla_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        sla_first_response: 'A responder',
        sla_resolution: 'Sem resposta',
        messages: []
      };

      this.tickets.unshift(newTicket);
      this.closeModal();
      this.renderDashboard();
      this.navigateTo('dashboard');
    }
  }

  getPriorityBadge(priority) {
    const colors = {
      critica: 'danger',
      alta: 'warning',
      media: 'primary',
      baixa: 'primary'
    };
    const labels = {
      critica: 'Crítica',
      alta: 'Alta',
      media: 'Média',
      baixa: 'Baixa'
    };
    return `<span class="table-badge badge-${colors[priority]}">${labels[priority]}</span>`;
  }

  getStatusBadge(status) {
    const colors = {
      aberto: 'primary',
      em_andamento: 'warning',
      resolvido: 'success',
      fechado: 'success'
    };
    const labels = {
      aberto: 'Aberto',
      em_andamento: 'Em Andamento',
      resolvido: 'Resolvido',
      fechado: 'Fechado'
    };
    return `<span class="table-badge badge-${colors[status]}">${labels[status]}</span>`;
  }

  getSLAStatusBadge(status) {
    const colors = {
      ok: 'success',
      alerta: 'warning',
      violado: 'danger'
    };
    const labels = {
      ok: 'OK',
      alerta: 'Alerta',
      violado: 'Violado'
    };
    return `<span class="table-badge badge-${colors[status]}">${labels[status]}</span>`;
  }

  getSLAStatus(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    const hoursLeft = diff / (1000 * 60 * 60);

    if (hoursLeft < 0) return 'violado';
    if (hoursLeft < 2) return 'alerta';
    return 'ok';
  }

  formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  updateUnreadBadge() {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('unread-badge');
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  closeSidebar() {
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar')?.classList.remove('open');
    }
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => { app = new App(); });
