/**
 * Camada HTTP única para requisições
 * Gerencia:
 * - Content-Type: application/json
 * - Serialização de body (JSON.stringify)
 * - Parse de resposta JSON
 * - Tratamento padronizado de erro por status HTTP
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

class HttpClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = null;

    // Recuperar token do localStorage se existir
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      this.token = savedToken;
    }
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(method, endpoint, body = null) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json().catch(() => null);

      // Tratamento padronizado de erros por status HTTP
      if (!response.ok) {
        this.handleError(response.status, data);
      }

      return {
        status: response.status,
        data,
        ok: response.ok,
      };
    } catch (error) {
      console.error(`HTTP Error (${method} ${endpoint}):`, error);
      throw {
        status: 0,
        message: 'Erro de conexão. Verifique a URL da API e CORS.',
        error,
      };
    }
  }

  handleError(status, data) {
    let errorMessage = data?.message || 'Erro desconhecido';

    switch (status) {
      case 400:
        // Erro de validação
        errorMessage = `Erro de validação: ${errorMessage}`;
        break;
      case 401:
        // Não autorizado
        errorMessage = 'Não autorizado. Faça login novamente.';
        this.setToken(null);
        break;
      case 403:
        // Proibido
        errorMessage = 'Acesso proibido.';
        break;
      case 404:
        // Recurso não encontrado
        errorMessage = 'Recurso não encontrado.';
        break;
      case 409:
        // Conflito (ex.: e-mail já cadastrado)
        errorMessage = `Conflito: ${errorMessage}`;
        break;
      case 500:
        // Erro interno do servidor
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        break;
      case 503:
        // Serviço indisponível
        errorMessage = 'Serviço indisponível. Tente novamente mais tarde.';
        break;
      default:
        errorMessage = `Erro HTTP ${status}: ${errorMessage}`;
    }

    throw {
      status,
      message: errorMessage,
      data,
    };
  }

  // Métodos convenience
  async get(endpoint) {
    return this.request('GET', endpoint);
  }

  async post(endpoint, body) {
    return this.request('POST', endpoint, body);
  }

  async put(endpoint, body) {
    return this.request('PUT', endpoint, body);
  }

  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }

  async patch(endpoint, body) {
    return this.request('PATCH', endpoint, body);
  }
}

// Singleton global
export const httpClient = new HttpClient();

export default HttpClient;
