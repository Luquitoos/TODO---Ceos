'use client';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Componente modal para confirmar a exclusão de um item de tarefa ou de todos os itens
 * @param {boolean} isOpen - Se o modal está visível
 * @param {function} onClose - Função a ser chamada ao fechar o modal
 * @param {function} onConfirm - Função a ser chamada ao confirmar a exclusão
 * @param {string} title - Título do modal
 * @param {string} message - Mensagem descrevendo o que será excluído
 * @returns {JSX.Element|null} - O componente modal ou nulo se não estiver visível
 */
export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  // Garantir a integração do backend: onConfirm é chamado e, em seguida, o modal é fechado
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-background p-6 rounded-2xl shadow-xl w-full max-w-md transform transition-all scale-100 opacity-100">
        <div className="flex justify-between items-center mb-1">
            {/* Espaço para evitar que o XMarkIcon se sobreponha ao título se ele for longo */}
            <span className="w-6"></span> 
            <h3 className="text-lg font-semibold text-foreground text-center flex-grow">{title}</h3>
            <button 
                onClick={onClose} 
                className="p-1 rounded-full hover:bg-input-bg text-foreground/70 hover:text-foreground"
                aria-label="Fechar"
            >
                <XMarkIcon className="h-6 w-6"/>
            </button>
        </div>
        <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mt-2 mb-4" />
            <p className="text-sm text-foreground/80 mb-6 px-2">
                {message}
            </p>
            <div className="flex justify-center space-x-3">
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-input-bg text-foreground font-semibold hover:bg-opacity-80 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleConfirm}
                    className="px-7 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                >
                    Excluir
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
