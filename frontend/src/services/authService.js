import axios from 'axios';

// URL base para a API - usa a variável de ambiente ou fallback para desenvolvimento
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ceos_todo_token';
const USER_KEY = 'ceos_todo_user';

console.log('API URL being used:', API_URL); // log usado para debug, voce nao vai ver na pratica

class AuthService {
  constructor() {
    this.http = axios.create({
      baseURL: API_URL,
      withCredentials: false, 
      timeout: 10000, // 10 segundos tentanto conectar
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // Fazer login
  async login(email, password) {
    try {
      console.log('Attempting login to:', `${API_URL}/auth/login`);
      const response = await this.http.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro de login detalhado:', error);
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
      
      if (error.response) {
        throw new Error(error.response?.data?.message || 'Credenciais inválidas');
      } else {
        throw new Error('Falha ao fazer login. Verifique sua conexão com a internet.');
      }
    }
  }

  // Registrar novo usuário
  async register(name, email, password, confirmPassword) {
    try {
      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      
      console.log('Attempting registration to:', `${API_URL}/auth/register`);
      const response = await this.http.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar detalhado:', error);
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
      
      if (error.response) {
        throw new Error(error.response?.data?.message || 'Este email já pode estar em uso');
      } else {
        throw new Error('Falha ao registrar usuário. Verifique sua conexão com a internet.');
      }
    }
  }

  // Fazer logout
  async logout() {
    try {
      const token = this.getToken();
      
      if (token) {
        await this.http.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  // Verificar se o usuário está autenticado
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  }

  // Obter token
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  // Obter dados do usuário atual
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Configurar cabeçalho de autorização para outras chamadas à API
  setAuthHeader() {
    const token = this.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  // Verificar se o token está válido com o servidor
  async validateToken() {
    try {
      const token = this.getToken();
      if (!token) return false;
      
      const response = await this.http.get('/auth/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.valid;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }

  // Obter cabeçalho de autorização para uso nas requisições
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Exporta uma instância do serviço
export default new AuthService();
