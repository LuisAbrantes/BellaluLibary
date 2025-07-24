import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('Conta criada com sucesso! Verifique seu email para confirmar.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          onLoginSuccess?.();
        }
      }
    } catch {
      setError('Erro inesperado ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pink-400 mb-2">
            Biblioteca BellaLu
          </h1>
          <p className="text-gray-400 text-lg">
            {isSignUp ? 'Crie sua conta para começar' : 'Bem-vindo! Faça login para continuar.'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg border border-pink-500 p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl text-pink-400 font-semibold mb-4">
              {isSignUp ? 'Cadastrar-se' : 'Entrar'}
            </h2>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-pink-300 mb-2">
                Seu email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-pink-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                placeholder="Digite seu email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-pink-300 mb-2">
                Sua senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-pink-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                placeholder={isSignUp ? 'Crie uma senha' : 'Digite sua senha'}
                minLength={6}
                required
              />
              {isSignUp && (
                <p className="mt-1 text-xs text-gray-400">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex items-center justify-center px-4 py-3 
                bg-pink-500 text-white rounded-lg font-medium
                hover:bg-pink-600 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Criando conta...' : 'Entrando...'}</span>
                </div>
              ) : (
                <span>{isSignUp ? 'Criar minha conta' : 'Entrar'}</span>
              )}
            </button>
          </form>

          {/* Toggle between Login/Signup */}
          <div className="text-center pt-4 border-t border-gray-700">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMessage(null);
                setEmail('');
                setPassword('');
              }}
              className="text-pink-400 hover:text-pink-300 text-sm underline"
            >
              {isSignUp 
                ? 'Já tem uma conta? Faça login' 
                : 'Não tem conta? Cadastre-se'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            Ao {isSignUp ? 'se cadastrar' : 'fazer login'}, você concorda com nossos termos de uso.
          </div>
        </div>
      </div>
    </div>
  );
}
