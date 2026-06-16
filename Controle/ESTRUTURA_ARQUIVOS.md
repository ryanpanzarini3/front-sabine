# Estrutura de Arquivos - Integração com API

Esta é a estrutura de arquivos que foi criada para integrar o frontend com o backend.

## 📁 Estrutura do Projeto

```
front-sabine/
├── .env.local                           ✅ NOVO - Configuração da API
│   └── VITE_API_BASE_URL=http://...
│
├── src/                                 ✅ NOVO - Diretório de serviços
│   ├── main.js                          ✅ NOVO - Ponto de entrada (carrega API)
│   │
│   └── services/                        ✅ NOVO - Camada de serviços
│       ├── http.js                      ✅ NOVO - Cliente HTTP
│       ├── enums.js                     ✅ NOVO - Mapeadores de enums
│       ├── adapters.js                  ✅ NOVO - Conversão DTO API/UI
│       └── api.js                       ✅ NOVO - Módulos de API
│
├── index.html                           ✅ MODIFICADO - Carrega main.js
├── app.js                               ⏳ PENDENTE - Modificar métodos
├── mockData.js                          ⏳ PENDENTE - Manter como fallback
├── styles.css
├── vite.config.js
│
├── INTEGRACAO_API.md                    ✅ NOVO - Guia completo
├── EXEMPLOS_INTEGRACAO.md               ✅ NOVO - Exemplos de código
├── CHECKLIST_IMPLEMENTACAO.md           ✅ NOVO - Checklist de progresso
├── GUIA_RAPIDO.md                       ✅ NOVO - Guia rápido
├── ESTRUTURA_ARQUIVOS.md                ✅ NOVO - Este arquivo
│
└── ... (outros arquivos do projeto)
```

## 📝 Descrição dos Arquivos Novos

### `.env.local`
Arquivo de variáveis de ambiente (NÃO é commitado no Git).

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Acessível em qualquer arquivo como:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### `src/main.js`
Ponto de entrada da aplicação. Carrega e integra a API com o App.

**O que faz:**
- Aguarda o carregamento do `app.js`
- Adiciona métodos à classe `App` para trabalhar com API
- Carrega dados da API quando usuário faz login
- Fornece métodos como `saveTicketToAPI()`, `deleteTicketFromAPI()`, etc

**Métodos adicionados:**
- `loadDataFromAPI()` - Carrega tickets, users, categories, etc
- `saveTicketToAPI(ticket)` - CREATE/UPDATE ticket
- `deleteTicketFromAPI(id)` - DELETE ticket
- `sendMessageToAPI(message)` - Enviar mensagem
- `saveUserToAPI(user)` - CREATE/UPDATE user
- `deleteUserFromAPI(id)` - DELETE user
- E mais para categories, departments, notifications

### `src/services/http.js`
Camada HTTP única para todas as requisições.

**Classe `HttpClient`:**
- `get(endpoint)` - GET request
- `post(endpoint, body)` - POST request
- `put(endpoint, body)` - PUT request
- `delete(endpoint)` - DELETE request
- `patch(endpoint, body)` - PATCH request

**Recursos:**
- Content-Type: application/json automático
- Autenticação com Bearer token
- Tratamento de erro por status HTTP (400, 401, 404, 409, 500, 503)
- Singleton global `httpClient`

### `src/services/enums.js`
Mapeadores de enums bidirecional.

**Conversão:**
```javascript
import { toBackendPriority, fromBackendPriority } from './enums.js';

// Frontend → Backend
toBackendPriority('critica')  // → 'CRITICA'

// Backend → Frontend
fromBackendPriority('CRITICA')  // → 'critica'
```

**Enums suportados:**
- TicketPriority: critica, alta, media, baixa
- TicketStatus: aberto, em_andamento, resolvido, fechado
- TicketChannel: email, telefone, slack, portal
- MessageType: public, internal
- NotificationType: alerta_sla, violacao_sla, info, success
- Status (User/Department): active, inactive
- Role: admin, atendente, cliente

### `src/services/adapters.js`
Conversão de dados entre API e UI.

**Conversão API → UI:**
```javascript
import { fromApiTicket } from './adapters.js';

const apiTicket = { id: '123', priority: 'CRITICA', ... };
const uiTicket = fromApiTicket(apiTicket);
// → { id: '123', priority: 'critica', ... }
```

**Conversão UI → API:**
```javascript
import { toApiTicket } from './adapters.js';

const uiTicket = { id: '123', priority: 'critica', ... };
const apiTicket = toApiTicket(uiTicket);
// → { id: '123', priority: 'CRITICA', ... }
```

**Adapters disponíveis:**
- `fromApiUser()`, `toApiUser()`
- `fromApiTicket()`, `toApiTicket()`
- `fromApiTicketMessage()`, `toApiTicketMessage()`
- `fromApiNotification()`, `toApiNotification()`
- `fromApiCategory()`, `toApiCategory()`
- `fromApiDepartment()`, `toApiDepartment()`
- `fromApiSlaPolicy()`, `toApiSlaPolicy()`
- E versões em batch: `fromApiUsers()`, `fromApiTickets()`, etc

### `src/services/api.js`
Módulos de API por recurso.

**Estrutura:**
```javascript
import { api } from './services/api.js';

// Tickets
await api.tickets.getAll();
await api.tickets.getById(id);
await api.tickets.create(ticket);
await api.tickets.update(id, ticket);
await api.tickets.delete(id);

// Users
await api.users.getAll();
// ... etc

// Categories, Departments, Notifications, TicketMessages, SlaPolicies
// Mesmo padrão para todos
```

**Todos os adapters são aplicados automaticamente.**

## 📖 Documentação

### `INTEGRACAO_API.md`
Guia completo de integração. Inclui:
- O que foi implementado
- Como acessar a API
- Enums mapeados
- Próximos passos de integração
- Checklist final

### `EXEMPLOS_INTEGRACAO.md`
Exemplos concretos de código. Inclui:
- Antes (mockData) e Depois (API) para cada operação
- 10 exemplos práticos (create, update, delete, etc)
- Padrão recomendado para operações assíncronas

### `CHECKLIST_IMPLEMENTACAO.md`
Checklist visual de todo o progresso. Inclui:
- ✅ Fase 1: Infraestrutura (100% completa)
- 🔧 Fase 2: Integração de métodos (0%, a fazer)
- 🧪 Fase 3: Testes (0%, a fazer)
- Status geral do projeto
- Dicas importantes
- Próximas tarefas

### `GUIA_RAPIDO.md`
Guia rápido para começar. Inclui:
- Como acessar a API
- Padrão básico para modificar métodos
- Exemplo prático completo
- Checklist antes de commitar
- Erros comuns e soluções
- Como debugar

### `ESTRUTURA_ARQUIVOS.md`
Este arquivo! Descrição de todos os arquivos.

## 🔧 Como Modificar um Método

1. Abrir `app.js`
2. Encontrar o método (ex: `createTicket`)
3. Adicionar `async` no início: `async createTicket() {`
4. Envolver código em `try/catch`
5. Substituir operações locais por chamadas à API:
   ```javascript
   // ❌ Não fazer isso
   this.tickets.push(newTicket);
   
   // ✅ Fazer isso
   const savedTicket = await this.saveTicketToAPI(newTicket);
   this.tickets.push(savedTicket);
   ```
6. Adicionar feedback e re-renderizar
7. Testar no navegador
8. Verificar console para erros

## 🚀 Próximos Passos

1. [ ] Ler `GUIA_RAPIDO.md` para entender o padrão
2. [ ] Escolher um método simples (ex: `createCategory`)
3. [ ] Seguir `EXEMPLOS_INTEGRACAO.md` para o tipo de operação
4. [ ] Modificar método em `app.js`
5. [ ] Testar no navegador
6. [ ] Repetir para outros métodos
7. [ ] Usar `CHECKLIST_IMPLEMENTACAO.md` para rastrear progresso

## 📱 Fluxo de Dados

```
User → HTML Form
  ↓
app.js Method (ex: createTicket)
  ↓
saveTicketToAPI() (em main.js)
  ↓
api.tickets.create() (em api.js)
  ↓
toApiTicket() adapter (em adapters.js)
  ↓
httpClient.post() (em http.js)
  ↓
Backend API (http://localhost:8080/api/v1/tickets)
  ↓
Response JSON
  ↓
fromApiTicket() adapter (em adapters.js)
  ↓
Update this.tickets
  ↓
Re-render UI
  ↓
Show success message
```

## 🔗 Relacionamentos entre Arquivos

```
index.html
  ├─→ app.js (classe App)
  └─→ main.js (type="module")
        └─→ src/services/api.js
              ├─→ src/services/http.js
              ├─→ src/services/enums.js
              └─→ src/services/adapters.js
                    ├─→ src/services/enums.js
                    └─→ src/services/http.js
```

## ✅ Checklist de Arquivos Criados

- [x] `.env.local` - Variáveis de ambiente
- [x] `src/main.js` - Ponto de entrada
- [x] `src/services/http.js` - Cliente HTTP
- [x] `src/services/enums.js` - Mapeadores de enums
- [x] `src/services/adapters.js` - Adaptadores DTO
- [x] `src/services/api.js` - Módulos de API
- [x] `INTEGRACAO_API.md` - Guia completo
- [x] `EXEMPLOS_INTEGRACAO.md` - Exemplos de código
- [x] `CHECKLIST_IMPLEMENTACAO.md` - Checklist de progresso
- [x] `GUIA_RAPIDO.md` - Guia rápido
- [x] `ESTRUTURA_ARQUIVOS.md` - Este arquivo

---

**Nota:** Todos os novos arquivos em `src/` usam ES Modules (import/export) e são carregados via `src/main.js` como type="module".
