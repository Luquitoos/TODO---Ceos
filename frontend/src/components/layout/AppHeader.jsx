'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AppHeader({ searchTerm, onSearchTermChange, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Efeito debounce para entrada de pesquisa (evita que a função seja chamada toda hora, tipo um delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
  }, [debouncedSearchTerm]);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-background shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <a
          href="https://ceosjr.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <Image
            src="/ceostodo_icon.svg"
            alt="CEOS To-Do Icon"
            width={36}
            height={40}
            priority
          />
        </a>

        <div className="flex-1 px-4 sm:px-8 md:px-12 lg:px-16 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-foreground/70" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              value={searchTerm}
              onChange={onSearchTermChange}
              className="block w-full p-2.5 pl-10 rounded-2xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-foreground focus:outline-none shadow-sm"
              placeholder="Pesquisar tarefas..."
              autoComplete="off"
            />
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="p-2 rounded-full bg-input-bg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Menu do usuário"
          >
            <UserCircleIcon className="h-7 w-7 text-foreground" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                Sair
              </button>
              {/* aqui seria se fosse para adicionar mais opções, mas não interesava mais */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
