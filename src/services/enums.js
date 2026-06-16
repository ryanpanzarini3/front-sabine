/**
 * Mapeadores de enums
 * Converte entre formatos do frontend e backend
 */

// TicketPriority
export const PRIORITY_ENUM = {
  critica: 'CRITICA',
  alta: 'ALTA',
  media: 'MEDIA',
  baixa: 'BAIXA',
};

export const PRIORITY_REVERSE = {
  CRITICA: 'critica',
  ALTA: 'alta',
  MEDIA: 'media',
  BAIXA: 'baixa',
};

export const PRIORITY_LABELS = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

// TicketStatus
export const STATUS_ENUM = {
  aberto: 'ABERTO',
  em_andamento: 'EM_ANDAMENTO',
  resolvido: 'RESOLVIDO',
  fechado: 'FECHADO',
};

export const STATUS_REVERSE = {
  ABERTO: 'aberto',
  EM_ANDAMENTO: 'em_andamento',
  RESOLVIDO: 'resolvido',
  FECHADO: 'fechado',
};

export const STATUS_LABELS = {
  aberto: 'Aberto',
  em_andamento: 'Em Andamento',
  resolvido: 'Resolvido',
  fechado: 'Fechado',
};

// TicketChannel
export const CHANNEL_ENUM = {
  email: 'EMAIL',
  telefone: 'TELEFONE',
  slack: 'SLACK',
  portal: 'PORTAL',
};

export const CHANNEL_REVERSE = {
  EMAIL: 'email',
  TELEFONE: 'telefone',
  SLACK: 'slack',
  PORTAL: 'portal',
};

export const CHANNEL_LABELS = {
  email: 'Email',
  telefone: 'Telefone',
  slack: 'Slack',
  portal: 'Portal',
};

// MessageType
export const MESSAGE_TYPE_ENUM = {
  public: 'PUBLIC',
  internal: 'INTERNAL',
};

export const MESSAGE_TYPE_REVERSE = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
};

export const MESSAGE_TYPE_LABELS = {
  public: 'Público',
  internal: 'Interno',
};

// NotificationType
export const NOTIFICATION_TYPE_ENUM = {
  alerta_sla: 'ALERTA_SLA',
  violacao_sla: 'VIOLACAO_SLA',
  info: 'INFO',
  success: 'SUCCESS',
};

export const NOTIFICATION_TYPE_REVERSE = {
  ALERTA_SLA: 'alerta_sla',
  VIOLACAO_SLA: 'violacao_sla',
  INFO: 'info',
  SUCCESS: 'success',
};

export const NOTIFICATION_TYPE_LABELS = {
  alerta_sla: 'Alerta SLA',
  violacao_sla: 'Violação SLA',
  info: 'Informação',
  success: 'Sucesso',
};

// Status (User/Department)
export const STATUS_ACTIVE_ENUM = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
};

export const STATUS_ACTIVE_REVERSE = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const STATUS_ACTIVE_LABELS = {
  active: 'Ativo',
  inactive: 'Inativo',
};

// Role
export const ROLE_ENUM = {
  admin: 'ADMIN',
  atendente: 'ATENDENTE',
  cliente: 'CLIENTE',
};

export const ROLE_REVERSE = {
  ADMIN: 'admin',
  ATENDENTE: 'atendente',
  CLIENTE: 'cliente',
};

export const ROLE_LABELS = {
  admin: 'Administrador',
  atendente: 'Atendente',
  cliente: 'Cliente',
};

/**
 * Funções helpers para converter enums
 */

export function toBackendPriority(frontendPriority) {
  return PRIORITY_ENUM[frontendPriority] || frontendPriority;
}

export function fromBackendPriority(backendPriority) {
  return PRIORITY_REVERSE[backendPriority] || backendPriority?.toLowerCase();
}

export function toBackendStatus(frontendStatus) {
  return STATUS_ENUM[frontendStatus] || frontendStatus;
}

export function fromBackendStatus(backendStatus) {
  return STATUS_REVERSE[backendStatus] || backendStatus?.toLowerCase();
}

export function toBackendChannel(frontendChannel) {
  return CHANNEL_ENUM[frontendChannel] || frontendChannel;
}

export function fromBackendChannel(backendChannel) {
  return CHANNEL_REVERSE[backendChannel] || backendChannel?.toLowerCase();
}

export function toBackendMessageType(frontendType) {
  return MESSAGE_TYPE_ENUM[frontendType] || frontendType;
}

export function fromBackendMessageType(backendType) {
  return MESSAGE_TYPE_REVERSE[backendType] || backendType?.toLowerCase();
}

export function toBackendNotificationType(frontendType) {
  return NOTIFICATION_TYPE_ENUM[frontendType] || frontendType;
}

export function fromBackendNotificationType(backendType) {
  return NOTIFICATION_TYPE_REVERSE[backendType] || backendType?.toLowerCase();
}

export function toBackendStatusActive(frontendStatus) {
  return STATUS_ACTIVE_ENUM[frontendStatus] || frontendStatus;
}

export function fromBackendStatusActive(backendStatus) {
  return STATUS_ACTIVE_REVERSE[backendStatus] || backendStatus?.toLowerCase();
}

export function toBackendRole(frontendRole) {
  return ROLE_ENUM[frontendRole] || frontendRole;
}

export function fromBackendRole(backendRole) {
  return ROLE_REVERSE[backendRole] || backendRole?.toLowerCase();
}
