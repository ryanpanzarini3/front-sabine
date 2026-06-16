/**
 * Ponto de entrada da aplicação
 * Integra o App com a camada de API
 */

import { api } from './src/services/api.js';
import { httpClient } from './src/services/http.js';

// Aguardar o carregamento do app.js antes de fazer qualquer coisa
async function initializeApp() {
  // Aguardar que o objeto App e mockData estejam disponíveis no window
  await new Promise((resolve) => {
    const checkApp = setInterval(() => {
      if (window.App) {
        clearInterval(checkApp);
        resolve();
      }
    }, 100);

    // Timeout de segurança
    setTimeout(() => {
      clearInterval(checkApp);
      console.warn('App não foi carregado no tempo esperado, continuando...');
      resolve();
    }, 5000);
  });

  // Estender o App para usar API ao invés de mockData
  if (window.App) {
    const AppInstance = App; // Classe carregada pelo app.js

    // Adicionar método de carregamento de dados da API
    AppInstance.prototype.loadDataFromAPI = async function() {
      try {
        console.log('Carregando dados da API...');

        // Carregar todos os dados em paralelo
        const [tickets, users, categories, departments, slaConfigs, notifications] = await Promise.all([
          api.tickets.getAll().catch(err => {
            console.error('Erro ao carregar tickets:', err);
            return [];
          }),
          api.users.getAll().catch(err => {
            console.error('Erro ao carregar usuários:', err);
            return [];
          }),
          api.categories.getAll().catch(err => {
            console.error('Erro ao carregar categorias:', err);
            return [];
          }),
          api.departments.getAll().catch(err => {
            console.error('Erro ao carregar departamentos:', err);
            return [];
          }),
          api.slaPolicies.getAll().catch(err => {
            console.error('Erro ao carregar SLAs:', err);
            return [];
          }),
          api.notifications.getAll().catch(err => {
            console.error('Erro ao carregar notificações:', err);
            return [];
          }),
        ]);

        // Atualizar dados da instância
        this.tickets = tickets || [];
        this.users = users || [];
        this.categories = categories || [];
        this.departments = departments || [];
        this.slaConfigs = slaConfigs || [];
        this.notifications = notifications || [];

        console.log('Dados carregados com sucesso', {
          tickets: this.tickets.length,
          users: this.users.length,
          categories: this.categories.length,
          departments: this.departments.length,
          slaConfigs: this.slaConfigs.length,
          notifications: this.notifications.length,
        });

        // Re-renderizar após carregar dados
        this.render();
      } catch (error) {
        console.error('Erro ao carregar dados da API:', error);
        alert('Erro ao carregar dados da API. Usando dados locais como fallback.');
      }
    };

    // Adicionar método para salvar ticket na API
    AppInstance.prototype.saveTicketToAPI = async function(ticket) {
      try {
        if (ticket.id && this.tickets.find(t => t.id === ticket.id)) {
          // Atualizar
          await api.tickets.update(ticket.id, ticket);
        } else {
          // Criar novo
          const newTicket = await api.tickets.create(ticket);
          return newTicket;
        }
        return ticket;
      } catch (error) {
        console.error('Erro ao salvar ticket:', error);
        throw error;
      }
    };

    // Adicionar método para deletar ticket da API
    AppInstance.prototype.deleteTicketFromAPI = async function(ticketId) {
      try {
        await api.tickets.delete(ticketId);
      } catch (error) {
        console.error('Erro ao deletar ticket:', error);
        throw error;
      }
    };

    // Adicionar método para enviar mensagem na API
    AppInstance.prototype.sendMessageToAPI = async function(message) {
      try {
        return await api.ticketMessages.create(message);
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
      }
    };

    // Adicionar método para salvar usuário na API
    AppInstance.prototype.saveUserToAPI = async function(user) {
      try {
        if (user.id && this.users.find(u => u.id === user.id)) {
          // Atualizar
          await api.users.update(user.id, user);
        } else {
          // Criar novo
          const newUser = await api.users.create(user);
          return newUser;
        }
        return user;
      } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        throw error;
      }
    };

    // Adicionar método para deletar usuário da API
    AppInstance.prototype.deleteUserFromAPI = async function(userId) {
      try {
        await api.users.delete(userId);
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
      }
    };

    // Adicionar método para salvar categoria na API
    AppInstance.prototype.saveCategoryToAPI = async function(category) {
      try {
        if (category.id && this.categories.find(c => c.id === category.id)) {
          // Atualizar
          await api.categories.update(category.id, category);
        } else {
          // Criar novo
          const newCategory = await api.categories.create(category);
          return newCategory;
        }
        return category;
      } catch (error) {
        console.error('Erro ao salvar categoria:', error);
        throw error;
      }
    };

    // Adicionar método para deletar categoria da API
    AppInstance.prototype.deleteCategoryFromAPI = async function(categoryId) {
      try {
        await api.categories.delete(categoryId);
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        throw error;
      }
    };

    // Adicionar método para salvar departamento na API
    AppInstance.prototype.saveDepartmentToAPI = async function(department) {
      try {
        if (department.id && this.departments.find(d => d.id === department.id)) {
          // Atualizar
          await api.departments.update(department.id, department);
        } else {
          // Criar novo
          const newDepartment = await api.departments.create(department);
          return newDepartment;
        }
        return department;
      } catch (error) {
        console.error('Erro ao salvar departamento:', error);
        throw error;
      }
    };

    // Adicionar método para deletar departamento da API
    AppInstance.prototype.deleteDepartmentFromAPI = async function(departmentId) {
      try {
        await api.departments.delete(departmentId);
      } catch (error) {
        console.error('Erro ao deletar departamento:', error);
        throw error;
      }
    };

    // Instanciar o App - será feito automaticamente no app.js
    // Somente carregar dados quando houver um usuário logado
    if (window.app && window.app.currentUser) {
      await window.app.loadDataFromAPI();
    }
  }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Exportar api para uso global (se necessário)
window.api = api;
window.httpClient = httpClient;

export { api, httpClient };
