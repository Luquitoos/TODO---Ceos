
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import TodoItem from '@/components/todos/TodoItem';
import CreateEditTodoModal from '@/components/todos/CreateEditTodoModal';
import ConfirmDeleteModal from '@/components/todos/ConfirmDeleteModal';
import ToastNotification from '@/components/ui/ToastNotification';
import authService from '@/services/authService';
import todoService from '@/services/todoService';

import {
  TrashIcon,
  ClipboardDocumentCheckIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function TodosPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Usuário');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para Modais
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteAllConfirmModal, setShowDeleteAllConfirmModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [modalError, setModalError] = useState('');

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Verificar autenticação e buscar informações do usuário e tarefas
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Verificar se o usuário está autenticado
        if (!authService.isAuthenticated()) {
          router.push('/');
          return;
        }

        // Buscar informações do usuário
        const user = authService.getCurrentUser();
        if (user && user.name) {
          setUserName(user.name);
        }

        // Buscar tarefas do usuário
        await fetchTodos();
      } catch (error) {
        console.error('Erro ao inicializar dados:', error);
        displayToast('Erro ao carregar dados. Tente novamente mais tarde.', 'error');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
    
  }, [router]);

  // Efeito para buscar tarefas quando o termo de busca mudar
  useEffect(() => {
    const searchWithDebounce = setTimeout(() => {
      handleSearch();
    }, 300);
    
    return () => clearTimeout(searchWithDebounce);
    
  }, [searchTerm]);

  // Função para buscar tarefas com base no termo de busca
  const handleSearch = async () => {
  try {
    setLoading(true);
    const fetchedTodos = await todoService.searchTodos(searchTerm);
    
    // Mapear tarefas retornadas para o formato esperado pelo frontend
    const formattedTodos = fetchedTodos.map(todo => {
      // Ajustar data para o fuso horário local para evitar deslocamentos de dia
      let dueDateObj = null;
      if (todo.dueDate) {
        dueDateObj = new Date(todo.dueDate);
        // Ajustar o fuso horário para garantir que a data local seja preservada
        dueDateObj = new Date(dueDateObj.getTime() + dueDateObj.getTimezoneOffset() * 60000);
      }
      
      let creationDateObj = new Date(todo.createdAt);
      
      return {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        // Passar o objeto Date diretamente, para que o TodoItem formate corretamente
        dueDate: dueDateObj,
        dueTime: todo.dueTime || '',
        // Incluir objeto Date e ISO string para maior flexibilidade
        dueDateISO: todo.dueDate,
        creationDate: creationDateObj,
        // Manter backward compatibility
        createdAtISO: todo.createdAt
      };
    });

    setTodos(formattedTodos);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    displayToast('Erro ao carregar tarefas', 'error');
  } finally {
    setLoading(false);
  }
};


  // Função para buscar todas as tarefas (quando não há busca)
const fetchTodos = async () => {
  try {
    setLoading(true);
    const fetchedTodos = await todoService.getAllTodos();

    // Mapear tarefas retornadas para o formato esperado pelo frontend
    const formattedTodos = fetchedTodos.map(todo => {
      // Ajustar data para o fuso horário local para evitar deslocamentos de dia
      let dueDateObj = null;
      if (todo.dueDate) {
        dueDateObj = new Date(todo.dueDate);
        // Ajustar o fuso horário para garantir que a data local seja preservada
        dueDateObj = new Date(dueDateObj.getTime() + dueDateObj.getTimezoneOffset() * 60000);
      }
      
      let creationDateObj = new Date(todo.createdAt);
      
      return {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        // Passar o objeto Date diretamente, para que o TodoItem formate corretamente
        dueDate: dueDateObj,
        dueTime: todo.dueTime || '',
        // Incluir objeto Date e ISO string para maior flexibilidade
        dueDateISO: todo.dueDate,
        creationDate: creationDateObj,
        // Manter backward compatibility
        createdAtISO: todo.createdAt
      };
    });

    setTodos(formattedTodos);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    displayToast('Erro ao carregar tarefas', 'error');
  } finally {
    setLoading(false);
  }
};

  const displayToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    // a mensagem sai depois de 5 segundos
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      displayToast('Erro ao fazer logout', 'error');
    }
  };

  // Funções CRUD para To-Dos
  const openCreateModal = () => {
    setEditingTodo(null);
    setModalError('');
    setShowCreateEditModal(true);
  };

  const openEditModal = (todo) => {
    // Preparar o formato de data para o componente de edição
    const todoForEdit = { ...todo };
    setModalError('');

    // Converter formato de data para YYYY-MM-DD esperado pelo input type="date"
    if (todo.dueDate) {
      try {
        const dateParts = todo.dueDate.split(', ')[0].split('/');
        if (dateParts.length === 3) {
          todoForEdit.dueDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }
      } catch (e) {
        console.error('Erro ao formatar data:', e);
        todoForEdit.dueDate = '';
      }
    }

    setEditingTodo(todoForEdit);
    setShowCreateEditModal(true);
  };

  const handleSaveTodo = async (todoData) => {
    try {
      setLoading(true);
      setModalError('');

      if (editingTodo) {
        // Atualizar tarefa existente
        await todoService.updateTodo(editingTodo.id, {
          title: todoData.title,
          description: todoData.description,
          dueDate: todoData.dueDate || null,
          dueTime: todoData.dueTime || null, // Adiciona dueTime ao update
        });
        displayToast('Tarefa atualizada com sucesso!', 'success');
        setShowCreateEditModal(false);
      } else {
        // Criar nova tarefa
        await todoService.createTodo({
          title: todoData.title,
          description: todoData.description,
          dueDate: todoData.dueDate || null,
          dueTime: todoData.dueTime || null, // Adiciona dueTime ao create
          completed: false,
        });
        displayToast('Tarefa criada com sucesso!', 'success');
        setShowCreateEditModal(false);
      }

      // Recarregar lista de tarefas
      await fetchTodos();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);

      // Verificar se há mensagem específica de descrição
      if (error.message && error.message.includes('Descrição')) {
        setModalError('Descrição é obrigatória');
      }
      // Verificar se há mensagem sobre validação
      else if (error.message && error.message.includes('validação')) {
        setModalError('Descrição é obrigatória');
      }
      else {
        setModalError(error.message || 'Erro ao salvar tarefa');
      }
      // Não fechamos o modal em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteTodo = (id) => {
    setItemToDeleteId(id);
    setShowDeleteConfirmModal(true);
  };

  const proceedDeleteTodo = async () => {
    try {
      setLoading(true);
      await todoService.deleteTodo(itemToDeleteId);

      setTodos(todos.filter((t) => t.id !== itemToDeleteId));
      displayToast('Tarefa excluída com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      displayToast('Erro ao excluir tarefa', 'error');
    } finally {
      setShowDeleteConfirmModal(false);
      setItemToDeleteId(null);
      setLoading(false);
    }
  };

  const requestDeleteAllTodos = () => {
    setShowDeleteAllConfirmModal(true);
  };

  const proceedDeleteAllTodos = async () => {
    try {
      setLoading(true);
      // Excluir todas as tarefas via API
      await todoService.deleteAllTodos();

      setTodos([]);
      displayToast('Todas as tarefas foram excluídas', 'success');
    } catch (error) {
      console.error('Erro ao excluir todas as tarefas:', error);
      displayToast('Erro ao excluir todas as tarefas', 'error');
    } finally {
      setShowDeleteAllConfirmModal(false);
      setLoading(false);
    }
  };

  const handleToggleAllTodos = async () => {
    try {
      setLoading(true);

      // Verificar se todas as tarefas estão marcadas como concluídas
      const allCurrentlyCompleted =
        todos.length > 0 && todos.every((todo) => todo.completed);

      // Marcar todas como concluídas/não concluídas via API
      await todoService.toggleAllTodos(!allCurrentlyCompleted);

      // Atualizar estado local
      setTodos(todos.map((todo) => ({ ...todo, completed: !allCurrentlyCompleted })));

      displayToast(
        allCurrentlyCompleted
          ? 'Todas as tarefas desmarcadas'
          : 'Todas as tarefas marcadas',
        'success'
      );
    } catch (error) {
      console.error('Erro ao atualizar status de todas as tarefas:', error);
      displayToast('Erro ao atualizar tarefas', 'error');
      // Recarregar para garantir consistência
      await fetchTodos();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodoComplete = async (id, completed) => {
    try {
      // Otimismo na interface: atualizar estado antes da resposta da API
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      // Atualizar no backend
      await todoService.toggleTodoStatus(id, completed);
    } catch (error) {
      console.error('Erro ao alterar status da tarefa:', error);
      displayToast('Erro ao alterar status da tarefa', 'error');
      // Recarregar para garantir consistência
      await fetchTodos();
    }
  };

  // Exibir mensagem de carregamento
  if (loading && todos.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
        <AppHeader
          searchTerm=""
          onSearchTermChange={() => {}}
          onLogout={handleLogout}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg text-foreground/70">Carregando tarefas...</div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <AppHeader
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchChange}
        onLogout={handleLogout}
      />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Olá, <span className="text-accent">{userName}!</span>
          </h1>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={requestDeleteAllTodos}
            title="Apagar todas as tarefas"
            className="flex items-center space-x-2 p-2.5 rounded-xl bg-input-bg text-foreground font-semibold hover:bg-opacity-80 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-background"
            disabled={loading}
          >
            <TrashIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Apagar Todas</span>
          </button>
          <button
            onClick={handleToggleAllTodos}
            title="Marcar/Desmarcar todas"
            className="flex items-center space-x-2 p-2.5 rounded-xl bg-input-bg text-foreground font-semibold hover:bg-opacity-80 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-1 focus:ring-offset-background"
            disabled={loading}
          >
            <ClipboardDocumentCheckIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Marcar/Desmarcar</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 p-2.5 pl-3 pr-4 rounded-xl bg-button-bg text-button-text font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-1 focus:ring-offset-background"
            disabled={loading}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Criar</span>
          </button>
        </div>

        <div className="space-y-4">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleTodoComplete}
                onEdit={openEditModal}
                onDelete={requestDeleteTodo}
              />
            ))
          ) : (
            <p className="text-center text-foreground/70 py-8">
              {searchTerm
                ? 'Nenhuma tarefa encontrada para sua busca.'
                : 'Você ainda não tem tarefas. Que tal criar uma?'}
            </p>
          )}
        </div>
      </main>

      <AppFooter />

      {/* Modais e Toast são renderizados aqui */}
      <CreateEditTodoModal
        isOpen={showCreateEditModal}
        onClose={() => setShowCreateEditModal(false)}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
        error={modalError}
        setError={setModalError}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={proceedDeleteTodo}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a tarefa "${
          todos.find((t) => t.id === itemToDeleteId)?.title || ''
        }"? Esta ação não pode ser desfeita.`}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteAllConfirmModal}
        onClose={() => setShowDeleteAllConfirmModal(false)}
        onConfirm={proceedDeleteAllTodos}
        title="Confirmar Exclusão Total"
        message="Tem certeza que deseja excluir TODAS as tarefas? Esta ação não pode ser desfeita."
      />
      {toast.show && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
