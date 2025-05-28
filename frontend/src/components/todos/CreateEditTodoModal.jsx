import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CreateEditTodoModal({ isOpen, onClose, onSave, editingTodo = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [error, setError] = useState('');

  // Limpar erro após 5 segundos
  useEffect(() => {
    let errorTimer;
    if (error) {
      errorTimer = setTimeout(() => {
        setError('');
      }, 5000); // 5 segundos
    }
    return () => {
      clearTimeout(errorTimer);
    };
  }, [error]);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
      // Handle dueDate in format YYYY-MM-DD if present
      if (editingTodo.dueDate) {
        // Accepts both DD/MM/YYYY and YYYY-MM-DD
        if (editingTodo.dueDate.includes('/')) {
          // Convert DD/MM/YYYY to YYYY-MM-DD
          const dateParts = editingTodo.dueDate.split(', ')[0].split('/');
          if (dateParts.length === 3) {
            setDueDate(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
          } else {
            setDueDate('');
          }
        } else {
          setDueDate(editingTodo.dueDate);
        }
      } else {
        setDueDate('');
      }
      setDueTime(editingTodo.dueTime || '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
    }
    setError('');
  }, [editingTodo, isOpen]);

  // Corrigido: Data local correta para min no input
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    // Format HH:MM
    let h = now.getHours();
    let m = now.getMinutes();
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setError('Título é obrigatório.');
      return;
    }

    if (!description.trim()) {
      setError('Descrição é obrigatória');
      return;
    }

    if (dueDate) {
      const todayDate = getTodayDate();
      if (dueDate < todayDate) {
        setError('O prazo não pode ser menor que hoje.');
        return;
      }

      // Verifica se hora foi preenchida se data foi preenchida
      if (!dueTime) {
        setError('Se escolher uma data de prazo, precisa escolher um horário também.');
        return;
      }

      // Se data é hoje, hora deve ser maior que agora
      if (dueDate === todayDate) {
        const nowTime = getCurrentTime();
        if (dueTime <= nowTime) {
          setError('Se o prazo é hoje, o horário precisa ser superior ao horário atual.');
          return;
        }
      }
    }

    const todoData = {
      id: editingTodo?.id,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate : null,
      dueTime: dueDate && dueTime ? dueTime : null,
    };

    onSave(todoData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-background p-6 rounded-2xl shadow-xl w-full max-w-lg transform transition-all scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            {editingTodo ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-input-bg text-foreground/70 hover:text-foreground">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded animate-fadeIn">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="todoTitleModal" className="block text-sm font-semibold mb-1.5 text-foreground">Título</label>
            <input
              type="text"
              id="todoTitleModal"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-accent focus:outline-none shadow-sm"
              placeholder="Digite o título da tarefa"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="todoDescriptionModal" className="block text-sm font-semibold mb-1.5 text-foreground">Descrição</label>
            <textarea
              id="todoDescriptionModal"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="3"
              className="w-full p-3 rounded-xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-accent focus:outline-none shadow-sm"
              placeholder="Digite a descrição da tarefa"
            ></textarea>
          </div>
          <div className="mb-8 flex gap-4 items-end">
            <div className="w-2/3">
              <label htmlFor="todoDueDateModal" className="block text-sm font-semibold mb-1.5 text-foreground">Prazo de Término (opcional)</label>
              <input
                type="date"
                min={getTodayDate()}
                id="todoDueDateModal"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-accent focus:outline-none shadow-sm"
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="todoDueTimeModal" className="block text-sm font-semibold mb-1.5 text-foreground">Horário</label>
              <input
                type="time"
                id="todoDueTimeModal"
                value={dueTime}
                disabled={!dueDate}
                min={dueDate === getTodayDate() ? getCurrentTime() : undefined}
                onChange={e => setDueTime(e.target.value)}
                className="w-full p-3 rounded-xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-accent focus:outline-none shadow-sm"
                placeholder="hh:mm"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-input-bg text-foreground font-semibold hover:bg-opacity-80 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-button-bg text-button-text font-semibold hover:opacity-90 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
            >
              {editingTodo ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
