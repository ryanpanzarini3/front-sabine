/**
 * Adapters para converter dados entre API (backend) e UI (frontend)
 * Garante que:
 * - Enums backend -> formato exibido no frontend
 * - Datas ISO -> formato da UI
 * - Campos opcionais sejam null quando vazio
 */

import {
  fromBackendPriority,
  fromBackendStatus,
  fromBackendChannel,
  fromBackendMessageType,
  fromBackendNotificationType,
  fromBackendStatusActive,
  fromBackendRole,
  toBackendPriority,
  toBackendStatus,
  toBackendChannel,
  toBackendMessageType,
  toBackendNotificationType,
  toBackendStatusActive,
  toBackendRole,
} from './enums.js';

/**
 * Helpers para datas
 */
function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}

function formatDateInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * USER ADAPTERS
 */
export function fromApiUser(apiUser) {
  if (!apiUser) return null;

  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: fromBackendRole(apiUser.role),
    department: apiUser.department,
    departmentId: apiUser.departmentId,
    status: fromBackendStatusActive(apiUser.status),
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
  };
}

export function toApiUser(frontendUser) {
  if (!frontendUser) return null;

  return {
    id: frontendUser.id,
    name: frontendUser.name,
    email: frontendUser.email,
    role: toBackendRole(frontendUser.role),
    departmentId: frontendUser.departmentId || null,
    status: toBackendStatusActive(frontendUser.status),
  };
}

/**
 * TICKET ADAPTERS
 */
export function fromApiTicket(apiTicket) {
  if (!apiTicket) return null;

  return {
    id: apiTicket.id,
    subject: apiTicket.subject,
    description: apiTicket.description,
    category: apiTicket.category,
    categoryId: apiTicket.categoryId,
    priority: fromBackendPriority(apiTicket.priority),
    status: fromBackendStatus(apiTicket.status),
    channel: fromBackendChannel(apiTicket.channel),
    clientId: apiTicket.clientId,
    client_name: apiTicket.clientName,
    assigneeId: apiTicket.assigneeId || null,
    assignee_name: apiTicket.assigneeName,
    createdAt: apiTicket.createdAt,
    updatedAt: apiTicket.updatedAt,
    resolvedAt: apiTicket.resolvedAt,
    messages: (apiTicket.messages || []).map(fromApiTicketMessage),
    sla_deadline: apiTicket.slaDeadline,
    sla_first_response: apiTicket.slaFirstResponse,
    sla_resolution: apiTicket.slaResolution,
  };
}

export function toApiTicket(frontendTicket) {
  if (!frontendTicket) return null;

  return {
    id: frontendTicket.id,
    subject: frontendTicket.subject,
    description: frontendTicket.description,
    categoryId: frontendTicket.categoryId,
    priority: toBackendPriority(frontendTicket.priority),
    status: toBackendStatus(frontendTicket.status),
    channel: toBackendChannel(frontendTicket.channel),
    clientId: frontendTicket.clientId,
    assigneeId: frontendTicket.assigneeId || null,
  };
}

/**
 * TICKET MESSAGE ADAPTERS
 */
export function fromApiTicketMessage(apiMessage) {
  if (!apiMessage) return null;

  return {
    id: apiMessage.id,
    ticketId: apiMessage.ticketId,
    type: fromBackendMessageType(apiMessage.type),
    text: apiMessage.text,
    authorId: apiMessage.authorId,
    authorName: apiMessage.authorName,
    createdAt: apiMessage.createdAt,
    updatedAt: apiMessage.updatedAt,
    userId: apiMessage.authorId, // Para compatibilidade com código antigo
  };
}

export function toApiTicketMessage(frontendMessage) {
  if (!frontendMessage) return null;

  return {
    id: frontendMessage.id,
    ticketId: frontendMessage.ticketId,
    type: toBackendMessageType(frontendMessage.type),
    text: frontendMessage.text,
    authorId: frontendMessage.authorId,
  };
}

/**
 * NOTIFICATION ADAPTERS
 */
export function fromApiNotification(apiNotification) {
  if (!apiNotification) return null;

  return {
    id: apiNotification.id,
    type: fromBackendNotificationType(apiNotification.type),
    title: apiNotification.title,
    message: apiNotification.message,
    userId: apiNotification.userId,
    ticketId: apiNotification.ticketId || null,
    read: apiNotification.read || false,
    createdAt: apiNotification.createdAt,
    updatedAt: apiNotification.updatedAt,
  };
}

export function toApiNotification(frontendNotification) {
  if (!frontendNotification) return null;

  return {
    id: frontendNotification.id,
    type: toBackendNotificationType(frontendNotification.type),
    title: frontendNotification.title,
    message: frontendNotification.message,
    userId: frontendNotification.userId,
    ticketId: frontendNotification.ticketId || null,
    read: frontendNotification.read || false,
  };
}

/**
 * CATEGORY ADAPTERS
 */
export function fromApiCategory(apiCategory) {
  if (!apiCategory) return null;

  return {
    id: apiCategory.id,
    name: apiCategory.name,
    sla_id: apiCategory.slaPolicyId,
    slaPolicyId: apiCategory.slaPolicyId,
    createdAt: apiCategory.createdAt,
    updatedAt: apiCategory.updatedAt,
  };
}

export function toApiCategory(frontendCategory) {
  if (!frontendCategory) return null;

  return {
    id: frontendCategory.id,
    name: frontendCategory.name,
    slaPolicyId: frontendCategory.slaPolicyId,
  };
}

/**
 * DEPARTMENT ADAPTERS
 */
export function fromApiDepartment(apiDepartment) {
  if (!apiDepartment) return null;

  return {
    id: apiDepartment.id,
    name: apiDepartment.name,
    manager: apiDepartment.manager || apiDepartment.managerId,
    managerId: apiDepartment.managerId,
    status: fromBackendStatusActive(apiDepartment.status),
    createdAt: apiDepartment.createdAt,
    updatedAt: apiDepartment.updatedAt,
  };
}

export function toApiDepartment(frontendDepartment) {
  if (!frontendDepartment) return null;

  return {
    id: frontendDepartment.id,
    name: frontendDepartment.name,
    managerId: frontendDepartment.managerId,
    status: toBackendStatusActive(frontendDepartment.status),
  };
}

/**
 * SLA POLICY ADAPTERS
 */
export function fromApiSlaPolicy(apiPolicy) {
  if (!apiPolicy) return null;

  return {
    id: apiPolicy.id,
    name: apiPolicy.name,
    response_time: apiPolicy.responseTime || apiPolicy.response_time,
    resolution_time: apiPolicy.resolutionTime || apiPolicy.resolution_time,
    responseTime: apiPolicy.responseTime,
    resolutionTime: apiPolicy.resolutionTime,
    createdAt: apiPolicy.createdAt,
    updatedAt: apiPolicy.updatedAt,
  };
}

export function toApiSlaPolicy(frontendPolicy) {
  if (!frontendPolicy) return null;

  return {
    id: frontendPolicy.id,
    name: frontendPolicy.name,
    responseTime: frontendPolicy.responseTime || frontendPolicy.response_time,
    resolutionTime: frontendPolicy.resolutionTime || frontendPolicy.resolution_time,
  };
}

/**
 * Batch adapters (para arrays)
 */
export function fromApiUsers(apiUsers) {
  return (apiUsers || []).map(fromApiUser);
}

export function fromApiTickets(apiTickets) {
  return (apiTickets || []).map(fromApiTicket);
}

export function fromApiNotifications(apiNotifications) {
  return (apiNotifications || []).map(fromApiNotification);
}

export function fromApiCategories(apiCategories) {
  return (apiCategories || []).map(fromApiCategory);
}

export function fromApiDepartments(apiDepartments) {
  return (apiDepartments || []).map(fromApiDepartment);
}

export function fromApiSlaPolicies(apiPolicies) {
  return (apiPolicies || []).map(fromApiSlaPolicy);
}
