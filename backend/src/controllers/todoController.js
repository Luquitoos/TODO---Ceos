import todoService from '../services/todoService.js';

class TodoController {
  // Cria uma nova TODO
  async createTodo(req, res) {
    try {
      const todo = await todoService.createTodo(req.body, req.user.id);
      res.status(201).json(todo);
    } 
    catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // pega todas as TODO's
  async getTodos(req, res) {
    try {
      const todos = await todoService.getTodos(req.user.id);
      res.json(todos);
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ''Search'' das TODO's
  async searchTodos(req, res) {
    try {
      const todos = await todoService.searchTodos(req.user.id, req.query.search);
      res.json(todos);
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // atualizar a TODO
  async updateTodo(req, res) {
    try {
      const todo = await todoService.updateTodo(
        req.params.id,
        req.user.id,
        req.body
      );
      if (!todo) {
        return res.status(404).json({ message: 'TODO não encontrado' });
      }
      res.json(todo);
    } 
    catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Deletar a TODO
  async deleteTodo(req, res) {
    try {
      const todo = await todoService.deleteTodo(req.params.id, req.user.id);
      if (!todo) {
        return res.status(404).json({ message: 'TODO não encontrado' });
      }
      res.json({ message: 'TOOD deletado com sucesso' });
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Marcar todas as TODO's como concluídas ou não concluídas
  async markAllCompleted(req, res) {
    try {
      const completed = req.body.completed !== undefined ? req.body.completed : true;
      await todoService.markAllCompleted(req.user._id, completed);
      res.json({ message: 'Status de todas as tarefas atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar status de todas as tarefas:', error);
      res.status(500).json({ message: 'Erro ao atualizar status de todas as tarefas' });
    }
  }

  // Deletar todas as TODO's
  async deleteAllTodos(req, res) {
    try {
      await todoService.deleteAllTodos(req.user._id);
      res.json({ message: 'Todas as tarefas foram excluídas com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir todas as tarefas:', error);
      res.status(500).json({ message: 'Erro ao excluir todas as tarefas' });
    }
  }
}

export default new TodoController();
