# 🔗 Integração Frontend - Requisitos para Backend

**Para**: Seu amigo desenvolvedor do backend
**De**: Ryan (Frontend)
**Data**: 2024-06-16
**Assunto**: Informações técnicas para integrar com o frontend

---

## 📝 Resumo Executivo

O frontend está pronto para consumir sua API. Este documento lista tudo que você precisa fazer no backend.

---

## 🔑 Informações Técnicas Básicas

### Variáveis de Ambiente (Frontend)
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Frontend rodará em
```
http://localhost:5173
```

### Backend deve estar em
```
http://localhost:8080
```

---

## 🚨 CORS (IMPORTANTE!)

Você **DEVE** configurar CORS no seu backend para aceitar requisições de:
```
http://localhost:5173
```

**Headers esperados:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 📋 Endpoints que Você Precisa Implementar

Base: `/api/v1`

### 1️⃣ USERS
```
GET    /users                 - Listar usuários
GET    /users/{id}            - Obter usuário específico
POST   /users                 - Criar usuário
PUT    /users/{id}            - Atualizar usuário
DELETE /users/{id}            - Deletar usuário
```

### 2️⃣ TICKETS
```
GET    /tickets               - Listar tickets
GET    /tickets/{id}          - Obter ticket específico
POST   /tickets               - Criar ticket
PUT    /tickets/{id}          - Atualizar ticket
DELETE /tickets/{id}          - Deletar ticket
```

### 3️⃣ TICKET MESSAGES
```
GET    /ticket-messages       - Listar mensagens
GET    /ticket-messages/{id}  - Obter mensagem
POST   /ticket-messages       - Criar mensagem
PUT    /ticket-messages/{id}  - Atualizar mensagem
DELETE /ticket-messages/{id}  - Deletar mensagem
```

### 4️⃣ NOTIFICATIONS
```
GET    /notifications         - Listar notificações
GET    /notifications/{id}    - Obter notificação
POST   /notifications         - Criar notificação
PUT    /notifications/{id}    - Atualizar notificação
DELETE /notifications/{id}    - Deletar notificação
```

### 5️⃣ CATEGORIES
```
GET    /categories            - Listar categorias
GET    /categories/{id}       - Obter categoria
POST   /categories            - Criar categoria
PUT    /categories/{id}       - Atualizar categoria
DELETE /categories/{id}       - Deletar categoria
```

### 6️⃣ DEPARTMENTS
```
GET    /departments           - Listar departamentos
GET    /departments/{id}      - Obter departamento
POST   /departments           - Criar departamento
PUT    /departments/{id}      - Atualizar departamento
DELETE /departments/{id}      - Deletar departamento
```

### 7️⃣ SLA POLICIES
```
GET    /sla-policies          - Listar políticas SLA
GET    /sla-policies/{id}     - Obter política SLA
POST   /sla-policies          - Criar política SLA
PUT    /sla-policies/{id}     - Atualizar política SLA
DELETE /sla-policies/{id}     - Deletar política SLA
```

---

## 📊 Estrutura de Dados Esperada

### USER
```json
{
  "id": "uuid-string",
  "name": "João Silva",
  "email": "joao@empresa.com",
  "role": "ADMIN | ATENDENTE | CLIENTE",
  "departmentId": "uuid-string (opcional)",
  "status": "ACTIVE | INACTIVE",
  "createdAt": "2024-06-16T10:30:00Z",
  "updatedAt": "2024-06-16T10:30:00Z"
}
```

### TICKET
```json
{
  "id": "uuid-string",
  "subject": "Computador não liga",
  "description": "Descrição detalhada...",
  "categoryId": "uuid-string",
  "priority": "CRITICA | ALTA | MEDIA | BAIXA",
  "status": "ABERTO | EM_ANDAMENTO | RESOLVIDO | FECHADO",
  "channel": "EMAIL | TELEFONE | SLACK | PORTAL",
  "clientId": "uuid-string",
  "clientName": "João Silva",
  "assigneeId": "uuid-string (opcional, pode ser null)",
  "assigneeName": "Guilherme",
  "createdAt": "2024-06-16T10:30:00Z",
  "updatedAt": "2024-06-16T10:30:00Z",
  "resolvedAt": "2024-06-16T11:30:00Z (opcional)",
  "messages": [ /* array de messages */ ],
  "slaDeadline": "2024-06-17T10:30:00Z",
  "slaFirstResponse": "1h",
  "slaResolution": "4h"
}
```

### TICKET MESSAGE
```json
{
  "id": "uuid-string",
  "ticketId": "uuid-string",
  "type": "PUBLIC | INTERNAL",
  "text": "Mensagem de teste",
  "authorId": "uuid-string",
  "authorName": "Guilherme",
  "createdAt": "2024-06-16T10:30:00Z",
  "updatedAt": "2024-06-16T10:30:00Z"
}
```

### NOTIFICATION
```json
{
  "id": "uuid-string",
  "type": "ALERTA_SLA | VIOLACAO_SLA | INFO | SUCCESS",
  "title": "Novo Ticket",
  "message": "Você tem um novo ticket atribuído",
  "userId": "uuid-string",
  "ticketId": "uuid-string (opcional, pode ser null)",
  "read": false,
  "createdAt": "2024-06-16T10:30:00Z",
  "updatedAt": "2024-06-16T10:30:00Z"
}
```

### CATEGORY
```json
{
  "id": "uuid-string",
  "name": "Hardware",
  "slaPolicyId": "uuid-string",
  "createdAt": "2024-06-16T10:30:00Z",
  "updatedAt": "2024-06-16T10:30:00Z"
}
```

### DEPARTMENT
```json
{
  "id": "uuid-string",
  "name": "Suporte Técnico",
  "managerId": "uuid-string (opcional)",
  "status": "ACTIVE | INACTIVE",
  "createdAt": "2024-06-16T10:30:00Z",
  "updatedAt": "2024-06-16T10:30:00Z"
}
```

### SLA POLICY
```json
{
  "id": "uuid-string",
  "name": "SLA Crítico",
  "responseTime": "1h",
  "resolutionTime": "4h",
  "createdAt": "2024-06-16T10:30:00Z",
  "updatedAt": "2024-06-16T10:30:00Z"
}
```

---

## 🔑 Pontos Importantes

### 1. IDs são UUIDs
Todos os IDs devem ser strings UUID, não inteiros.

### 2. Enums em Maiúsculo
Os enums devem estar **SEMPRE em maiúsculo**:
- Priority: `CRITICA`, `ALTA`, `MEDIA`, `BAIXA`
- Status (Ticket): `ABERTO`, `EM_ANDAMENTO`, `RESOLVIDO`, `FECHADO`
- Channel: `EMAIL`, `TELEFONE`, `SLACK`, `PORTAL`
- Message Type: `PUBLIC`, `INTERNAL`
- Notification Type: `ALERTA_SLA`, `VIOLACAO_SLA`, `INFO`, `SUCCESS`
- Status (User/Dept): `ACTIVE`, `INACTIVE`
- Role: `ADMIN`, `ATENDENTE`, `CLIENTE`

### 3. Campos Opcionais
Estes campos podem ser `null`:
- `assigneeId` em Ticket
- `resolvedAt` em Ticket
- `ticketId` em Notification
- `managerId` em Department
- `departmentId` em User

### 4. Datas em ISO 8601
Todas as datas devem estar em formato ISO 8601:
```
2024-06-16T10:30:00Z
```

### 5. Content-Type
Sempre retorne `Content-Type: application/json`

---

## 🚨 Tratamento de Erros

O frontend espera erros estruturados assim:

### 400 - Bad Request (Validação)
```json
{
  "status": 400,
  "message": "Campos obrigatórios não preenchidos",
  "errors": {
    "email": "E-mail inválido",
    "name": "Nome é obrigatório"
  }
}
```

### 401 - Unauthorized
```json
{
  "status": 401,
  "message": "Token inválido ou expirado"
}
```

### 404 - Not Found
```json
{
  "status": 404,
  "message": "Recurso não encontrado"
}
```

### 409 - Conflict
```json
{
  "status": 409,
  "message": "E-mail já cadastrado no sistema"
}
```

### 500 - Server Error
```json
{
  "status": 500,
  "message": "Erro interno do servidor"
}
```

---

## ✅ Checklist para Backend

### Endpoints
- [ ] GET /users
- [ ] GET /users/{id}
- [ ] POST /users
- [ ] PUT /users/{id}
- [ ] DELETE /users/{id}
- [ ] GET /tickets
- [ ] GET /tickets/{id}
- [ ] POST /tickets
- [ ] PUT /tickets/{id}
- [ ] DELETE /tickets/{id}
- [ ] GET /ticket-messages
- [ ] GET /ticket-messages/{id}
- [ ] POST /ticket-messages
- [ ] PUT /ticket-messages/{id}
- [ ] DELETE /ticket-messages/{id}
- [ ] GET /notifications
- [ ] GET /notifications/{id}
- [ ] POST /notifications
- [ ] PUT /notifications/{id}
- [ ] DELETE /notifications/{id}
- [ ] GET /categories
- [ ] GET /categories/{id}
- [ ] POST /categories
- [ ] PUT /categories/{id}
- [ ] DELETE /categories/{id}
- [ ] GET /departments
- [ ] GET /departments/{id}
- [ ] POST /departments
- [ ] PUT /departments/{id}
- [ ] DELETE /departments/{id}
- [ ] GET /sla-policies
- [ ] GET /sla-policies/{id}
- [ ] POST /sla-policies
- [ ] PUT /sla-policies/{id}
- [ ] DELETE /sla-policies/{id}

### CORS
- [ ] Aceitar `http://localhost:5173`
- [ ] Aceitar métodos: GET, POST, PUT, DELETE, PATCH, OPTIONS
- [ ] Aceitar headers: Content-Type, Authorization

### Estrutura de Dados
- [ ] Todos os campos retornam no formato especificado
- [ ] Enums são retornados em maiúsculo
- [ ] Datas são ISO 8601
- [ ] IDs são UUIDs
- [ ] Campos opcionais podem ser null

### Erros
- [ ] 400 para validação
- [ ] 401 para autenticação
- [ ] 404 para recurso não encontrado
- [ ] 409 para conflito (ex: email duplicado)
- [ ] 500 para erro do servidor
- [ ] Mensagem de erro sempre em `message`

---

## 🧪 Como Testar

### Com Postman/Insomnia
```bash
# Criar usuário
POST http://localhost:8080/api/v1/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "role": "ATENDENTE",
  "status": "ACTIVE"
}
```

### Com cURL
```bash
curl -X GET http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json"
```

### No Frontend
O frontend já tem cliente HTTP pronto. Quando você implementar os endpoints, será possível:
1. Fazer login
2. Ver tickets carregados
3. Criar novo ticket
4. Editar status/prioridade
5. Deletar ticket
6. Etc.

---

## 📞 Comunicação

### Próximos Passos
1. Implementar os endpoints acima
2. Testar com Postman/Insomnia
3. Confirmar CORS está funcionando
4. Avisar quando estiver pronto

### Se Tiver Dúvidas
- Pergunte sobre a estrutura de dados
- Pergunte sobre validações necessárias
- Pergunte sobre relacionamentos

---

## 📚 Referência Rápida

| Recurso | Endpoints | Métodos |
|---------|-----------|---------|
| Users | /users | GET, POST, PUT, DELETE |
| Tickets | /tickets | GET, POST, PUT, DELETE |
| Messages | /ticket-messages | GET, POST, PUT, DELETE |
| Notifications | /notifications | GET, POST, PUT, DELETE |
| Categories | /categories | GET, POST, PUT, DELETE |
| Departments | /departments | GET, POST, PUT, DELETE |
| SLA Policies | /sla-policies | GET, POST, PUT, DELETE |

**Total de Endpoints**: 35
**Todos em**: `/api/v1/`

---

## 🎯 Prioridade de Implementação (Sugerida)

1. **Alta Prioridade**: Users + Tickets (são os cores)
2. **Média Prioridade**: Categories + Departments + Messages
3. **Baixa Prioridade**: Notifications + SLA Policies

---

**Boa sorte com o backend! 🚀**

Se precisar de esclarecimentos, é só chamar.
