import Todo from '../models/Todo.js';

class TodoService {
  async createTodo(todoData, userId) {
    const todo = new Todo({
      title: todoData.title,
      description: todoData.description,
      dueDate: todoData.dueDate,
      dueTime: todoData.dueTime, // Incluído!
      completed: todoData.completed || false,
      user: userId,
      createdAt: new Date()
    });
    return await todo.save();
  }

  async getTodos(userId) {
    return await Todo.find({ user: userId }).sort({ createdAt: -1 });
  }

  async searchTodos(userId, searchTerm) {
    if (!searchTerm) {
      return await this.getTodos(userId);
    }
    // Usando regex para buscar tarefas que começam com as letras digitadas
    // O operador '^' assegura que a busca é pelo início do título
    // A opção 'i' torna a busca case-insensitive (ignora maiúsculas/minúsculas)
    return await Todo.find({
      user: userId,
      title: { $regex: `^${searchTerm}`, $options: 'i' }
    }).sort({ createdAt: -1 });
  }

  async updateTodo(todoId, userId, updateData) {
    // Inclui dueTime se fornecido em updateData
    const update = { ...updateData };
    if (typeof updateData.dueTime !== 'undefined') {
      update.dueTime = updateData.dueTime;
    }
    return await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      update,
      { new: true }
    );
  }

  async deleteTodo(todoId, userId) {
    return await Todo.findOneAndDelete({ _id: todoId, user: userId });
  }

  async markAllCompleted(userId, completed = true) {
    // Permite definir se marca como completado (true) ou não completado (false)
    return await Todo.updateMany(
      { user: userId },
      { completed: completed }
    );
  }

  async deleteAllTodos(userId) {
    return await Todo.deleteMany({ user: userId });
  }
}

export default new TodoService();
