'use client';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function TodoItem({ todo, onToggleComplete, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // ele tenta ver o formato e como iso de data e retorna para o formato original
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // ajuda a pegar ou capturar o tempo pela data ou HH:mm/HH:mm:ss em formato string (que é o enviado para ele)
  const formatTimeFromDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    // Capturar hora local
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  //  formatar a hora (espera "HH:mm" ou "HH:mm:ss")
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [h, m] = timeString.split(':');
    if (h && m) return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    return timeString;
  };

  return (
    <div
      className={`rounded-2xl shadow-md p-4 border-l-4 transition-all duration-300 ${
        todo.completed ? 'border-green-500 opacity-60 hover:opacity-80' : 'border-yellow-500 opacity-100 hover:shadow-lg'
      }`}
      style={{ 
        backgroundColor: '#D2E3CC',
        maxWidth: '95%',
        margin: '0 auto 2rem auto', // Adicionado 2rem (32px) de margem inferior
        position: 'relative'
      }}
    >
      {/* Botões de editar e deletar no canto superior direito */}
      <div className="absolute top-3 right-3 flex space-x-2 z-10">
        <button
          onClick={() => onEdit(todo)}
          title="Editar tarefa"
          className="p-1.5 rounded-md transition-colors"
          style={{ color: '#4A8070' }}
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          title="Excluir tarefa"
          className="text-red-500 hover:text-red-700 p-1.5 rounded-md transition-colors"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Título com checkbox personalizado à esquerda */}
      <div className="flex items-start mb-3 pr-16">
        <div className="flex-shrink-0 mt-1 mr-3 relative">
          {/* Checkbox real (oculto) */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id, todo.completed)}
            className="absolute opacity-0 w-5 h-5 cursor-pointer z-10"
            aria-label={`Marcar tarefa ${todo.title} como ${todo.completed ? 'não completada' : 'completada'}`}
          />
          
          {/* Checkbox visual personalizado */}
          <div 
            className="w-5 h-5 border rounded flex items-center justify-center transition-colors"
            style={{ 
              backgroundColor: todo.completed ? '#A3D4BE' : 'white',
              borderColor: todo.completed ? '#A3D4BE' : '#ccc',
            }}
          >
            {/* Símbolo de check */}
            {todo.completed && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4"
                style={{ color: '#88897F' }}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        </div>

        <h3
          className="text-lg font-semibold break-words flex-grow"
          style={{ 
            color: '#4A8070',
            textDecoration: todo.completed ? 'line-through' : 'none',
            opacity: todo.completed ? '0.7' : '1'
          }}
        >
          {todo.title}
        </h3>
      </div>

      {/* Descrição */}
      {todo.description && (
        <p 
          className="mb-2 break-words ml-8"
          style={{ 
            color: '#467E7B',
            textDecoration: todo.completed ? 'line-through' : 'none',
            opacity: todo.completed ? '0.7' : '1'
          }}
        >
          {todo.description}
        </p>
      )}

      {/* Data de criação e prazo com horario */}
      <div className="text-sm ml-8 mb-2">
        <span style={{ color: '#3D8D7A' }}>
          {(todo.creationDate || todo.createdAt) && (
            <>
              Criada em {formatDate(todo.creationDate || todo.createdAt)}
              {/* Mostra horário de criação */}
              {((todo.creationDate || todo.createdAt) && formatTimeFromDate(todo.creationDate || todo.createdAt)) && (
                <span> {formatTimeFromDate(todo.creationDate || todo.createdAt)}</span>
              )}
            </>
          )}
          {todo.dueDate && (
            <>
              {' '}• Até {formatDate(todo.dueDate)}
              {(typeof todo.dueTime === 'string' && todo.dueTime.trim()) && (
                <span> {formatTime(todo.dueTime)}</span>
              )}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
