'use client';
import { useEffect } from 'react';
import {
  XMarkIcon,
  InformationCircleIcon,
  CheckCircleIcon as CheckCircleSolidHero // Renomeado para evitar conflito
} from '@heroicons/react/24/solid'; // Usando solid para ícones de status

export default function ToastNotification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Mudado para 5 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  let bgColor = 'bg-blue-500';
  let Icon = InformationCircleIcon;

  if (type === 'success') {
    bgColor = 'bg-green-500';
    Icon = CheckCircleSolidHero;
  } else if (type === 'error') {
    bgColor = 'bg-red-500';
    Icon = InformationCircleIcon; // Ou um ícone de erro
  }

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${bgColor} flex items-center space-x-3 z-50 transform transition-all duration-300 ease-out ${
        message ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Icon className="h-6 w-6 flex-shrink-0" />
      <span className="flex-grow">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg hover:bg-black/10 focus:ring-2 focus:ring-white"
        aria-label="Fechar"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
