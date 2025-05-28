'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import authService from '../../services/authService';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      router.push('/todos');
    } catch (err) {
      setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start md:max-w-md lg:max-w-lg xl:max-w-xl md:pr-8 lg:pr-10 mb-12 md:mb-0">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center md:text-left w-full flex items-center justify-center md:justify-start space-x-4">
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
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 rounded-2xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-foreground focus:outline-none transition-shadow duration-150 ease-in-out shadow-sm focus:shadow-md"
            placeholder="seuemail@exemplo.com"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 rounded-2xl bg-input-bg text-foreground font-semibold placeholder-foreground/60 border-none focus:ring-2 focus:ring-foreground focus:outline-none transition-shadow duration-150 ease-in-out shadow-sm focus:shadow-md"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`w-full p-3 rounded-2xl bg-button-bg text-button-text text-base font-semibold hover:opacity-90 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background shadow-md hover:shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <Link href="/registro" legacyBehavior>
        <a className="mt-8 text-sm text-foreground font-semibold hover:text-accent transition-colors self-center md:self-start">
          Ainda não tem uma conta?
        </a>
      </Link>
    </div>
  );
}
