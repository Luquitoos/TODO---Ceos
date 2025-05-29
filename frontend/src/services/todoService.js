import axios from 'axios';
import authService from './authService';

// URL base para a API - usa a variável de ambiente ou fallback para desenvolvimento
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class TodoService {
  constructor() {
    this.http = axios.create({
      baseURL: API_URL,
      withCredentials: false, // Evitar problemas de CORS
      timeout: 10000, // 10 segundos de timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Interceptor para adicionar o token em todas as requisições
    this.http.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Obter todas as tarefas
  async getTodos() {
    try {
      console.log('Buscando tarefas em:', `${API_URL}/todos`);
      const response = await this.http.get('/todos');
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao buscar tarefas:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Não foi possível conectar ao servidor para buscar tarefas');
      }
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente');
      }
      throw new Error('Erro ao carregar tarefas: ' + (error.response?.data?.message || error.message));
    }
  }

  // Alias para getTodos, usado no componente TodosPage
  async getAllTodos() {
    return this.getTodos();
  }

  // Buscar tarefas por termo de busca via API
  async searchTodos(searchTerm) {
    try {
      // Se o termo de busca estiver vazio, retorna todas as tarefas
      if (!searchTerm) {
        return this.getTodos();
      }
      // Busca por API
      const response = await this.http.get(`/todos/search?search=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao buscar tarefas:', error);
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente');
      }
      throw new Error('Erro ao buscar tarefas: ' + (error.response?.data?.message || error.message));
    }
  }

  // Criar uma nova tarefa
  async createTodo(todoData) {
    try {
      const response = await this.http.post('/todos', todoData);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao criar tarefa:', error);
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente');
      }
      throw new Error('Erro ao criar tarefa: ' + (error.response?.data?.message || error.message));
    }
  }

  // Atualizar uma tarefa existente
  async updateTodo(todoId, updateData) {
    try {
      const response = await this.http.put(`/todos/${todoId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao atualizar tarefa:', error);
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente');
      }
      throw new Error('Erro ao atualizar tarefa: ' + (error.response?.data?.message || error.message));
    }
  }

  // Alternar status de uma tarefa (concluída/não concluída)
  async toggleTodoStatus(todoId, currentStatus) {
    try {
      const response = await this.http.put(`/todos/${todoId}`, {
        completed: !currentStatus
      });
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao alterar status da tarefa:', error);
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente');
      }
      throw new Error('Erro ao alterar status da tarefa: ' + (error.response?.data?.message || error.message));
    }
  }

  // Excluir uma tarefa
  async deleteTodo(todoId) {
    try {
      const response = await this.http.delete(`/todos/${todoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao excluir tarefa:', error);
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente');
      }
      throw new Error('Erro ao excluir tarefa: ' + (error.response?.data?.message || error.message));
    }
  }

  // Marcar todas as tarefas como concluídas ou não concluídas
  async toggleAllTodos(completed) {
    try {
      const response = await this.http.put('/todos/mark-all', { completed });
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao atualizar status de todas as tarefas:', error);
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente');
      }
      throw new Error('Erro ao atualizar status de todas as tarefas: ' + (error.response?.data?.message || error.message));
    }
  }

  // Excluir todas as tarefas
  async deleteAllTodos() {
    try {
      const response = await this.http.delete('/todos');
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao excluir todas as tarefas:', error);
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente');
      }
      throw new Error('Erro ao excluir todas as tarefas: ' + (error.response?.data?.message || error.message));
    }
  }
}

// Exporta uma instância do serviço
export default new TodoService();
