/**
 * Módulos de API por recurso
 * Centraliza todas as chamadas HTTP
 */

import { httpClient } from './http.js';
import {
  fromApiUser,
  fromApiTicket,
  fromApiNotification,
  fromApiCategory,
  fromApiDepartment,
  fromApiSlaPolicy,
  fromApiUsers,
  fromApiTickets,
  fromApiNotifications,
  fromApiCategories,
  fromApiDepartments,
  fromApiSlaPolicies,
  toApiUser,
  toApiTicket,
  toApiNotification,
  toApiCategory,
  toApiDepartment,
  toApiSlaPolicy,
} from './adapters.js';

/**
 * USERS API
 */
export const usersApi = {
  async getAll() {
    try {
      const response = await httpClient.get('/users');
      return fromApiUsers(response.data);
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`/users/${id}`);
      return fromApiUser(response.data);
    } catch (error) {
      throw error;
    }
  },

  async create(user) {
    try {
      const response = await httpClient.post('/users', toApiUser(user));
      return fromApiUser(response.data);
    } catch (error) {
      throw error;
    }
  },

  async update(id, user) {
    try {
      const response = await httpClient.put(`/users/${id}`, toApiUser(user));
      return fromApiUser(response.data);
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await httpClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * TICKETS API
 */
export const ticketsApi = {
  async getAll() {
    try {
      const response = await httpClient.get('/tickets');
      return fromApiTickets(response.data);
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`/tickets/${id}`);
      return fromApiTicket(response.data);
    } catch (error) {
      throw error;
    }
  },

  async create(ticket) {
    try {
      const response = await httpClient.post('/tickets', toApiTicket(ticket));
      return fromApiTicket(response.data);
    } catch (error) {
      throw error;
    }
  },

  async update(id, ticket) {
    try {
      const response = await httpClient.put(`/tickets/${id}`, toApiTicket(ticket));
      return fromApiTicket(response.data);
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await httpClient.delete(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * TICKET MESSAGES API
 */
export const ticketMessagesApi = {
  async getAll() {
    try {
      const response = await httpClient.get('/ticket-messages');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`/ticket-messages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async create(message) {
    try {
      const response = await httpClient.post('/ticket-messages', message);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id, message) {
    try {
      const response = await httpClient.put(`/ticket-messages/${id}`, message);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await httpClient.delete(`/ticket-messages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * NOTIFICATIONS API
 */
export const notificationsApi = {
  async getAll() {
    try {
      const response = await httpClient.get('/notifications');
      return fromApiNotifications(response.data);
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`/notifications/${id}`);
      return fromApiNotification(response.data);
    } catch (error) {
      throw error;
    }
  },

  async create(notification) {
    try {
      const response = await httpClient.post('/notifications', toApiNotification(notification));
      return fromApiNotification(response.data);
    } catch (error) {
      throw error;
    }
  },

  async update(id, notification) {
    try {
      const response = await httpClient.put(`/notifications/${id}`, toApiNotification(notification));
      return fromApiNotification(response.data);
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await httpClient.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * CATEGORIES API
 */
export const categoriesApi = {
  async getAll() {
    try {
      const response = await httpClient.get('/categories');
      return fromApiCategories(response.data);
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`/categories/${id}`);
      return fromApiCategory(response.data);
    } catch (error) {
      throw error;
    }
  },

  async create(category) {
    try {
      const response = await httpClient.post('/categories', toApiCategory(category));
      return fromApiCategory(response.data);
    } catch (error) {
      throw error;
    }
  },

  async update(id, category) {
    try {
      const response = await httpClient.put(`/categories/${id}`, toApiCategory(category));
      return fromApiCategory(response.data);
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await httpClient.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * DEPARTMENTS API
 */
export const departmentsApi = {
  async getAll() {
    try {
      const response = await httpClient.get('/departments');
      return fromApiDepartments(response.data);
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`/departments/${id}`);
      return fromApiDepartment(response.data);
    } catch (error) {
      throw error;
    }
  },

  async create(department) {
    try {
      const response = await httpClient.post('/departments', toApiDepartment(department));
      return fromApiDepartment(response.data);
    } catch (error) {
      throw error;
    }
  },

  async update(id, department) {
    try {
      const response = await httpClient.put(`/departments/${id}`, toApiDepartment(department));
      return fromApiDepartment(response.data);
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await httpClient.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * SLA POLICIES API
 */
export const slaPoliciesApi = {
  async getAll() {
    try {
      const response = await httpClient.get('/sla-policies');
      return fromApiSlaPolicies(response.data);
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`/sla-policies/${id}`);
      return fromApiSlaPolicy(response.data);
    } catch (error) {
      throw error;
    }
  },

  async create(policy) {
    try {
      const response = await httpClient.post('/sla-policies', toApiSlaPolicy(policy));
      return fromApiSlaPolicy(response.data);
    } catch (error) {
      throw error;
    }
  },

  async update(id, policy) {
    try {
      const response = await httpClient.put(`/sla-policies/${id}`, toApiSlaPolicy(policy));
      return fromApiSlaPolicy(response.data);
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await httpClient.delete(`/sla-policies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Export unified API
 */
export const api = {
  users: usersApi,
  tickets: ticketsApi,
  ticketMessages: ticketMessagesApi,
  notifications: notificationsApi,
  categories: categoriesApi,
  departments: departmentsApi,
  slaPolicies: slaPoliciesApi,
};

export default api;
