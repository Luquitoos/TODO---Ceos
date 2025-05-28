'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import authService from '../../services/authService';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await authService.register(name, email, password, confirmPassword);
      router.push('/todos');
    } catch (err) {
      setError(err.message || 'Falha ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start md:max-w-md lg:max-w-lg xl:max-w-xl md:pr-8 lg:pr-10 mb-12 md:mb-0">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center md:text-left w-full flex flex-col items-center md:flex-row md:items-center md:justify-start md:space-x-4 space-y-2 md:space-y-0">
        <span>Bem-vindo ao</span>
        <Image
          src="/ceostodo_logotype.svg"
          alt="CEOS to-do"
          width={200}
          height={42}
          className="inline-block"
        />
      </h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded w-full">
          {error}
        </div>
      )}
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold mb-1.5">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="w-full p-3 rounded-2xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-foreground focus:outline-none transition-shadow duration-150 ease-in-out shadow-sm focus:shadow-md"
              placeholder="Seu nome completo"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="senhaRegister" className="block text-sm font-semibold mb-1.5">
              Senha
            </label>
            <input
              type="password"
              id="senhaRegister"
              name="senha"
              className="w-full p-3 rounded-2xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-foreground focus:outline-none transition-shadow duration-150 ease-in-out shadow-sm focus:shadow-md"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="emailRegister" className="block text-sm font-semibold mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="emailRegister"
              name="email"
              className="w-full p-3 rounded-2xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-foreground focus:outline-none transition-shadow duration-150 ease-in-out shadow-sm focus:shadow-md"
              placeholder="seuemail@exemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-semibold mb-1.5">
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              className="w-full p-3 rounded-2xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-foreground focus:outline-none transition-shadow duration-150 ease-in-out shadow-sm focus:shadow-md"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-3 rounded-2xl bg-button-bg text-button-text text-base font-semibold hover:opacity-90 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
      <Link href="/" legacyBehavior>
        <a className="mt-8 text-sm text-foreground font-semibold hover:text-accent transition-colors self-center md:self-start">
          Já tem uma conta?
        </a>
      </Link>
    </div>
  );
}
