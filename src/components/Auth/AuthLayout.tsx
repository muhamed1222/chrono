import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const AuthLayout: React.FC = () => {
  const { signIn, signUp, signInWithOAuth } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleOAuth = async (
    provider: 'telegram' | 'vk' | 'google'
  ) => {
    setError('');
    setLoading(true);
    try {
      await signInWithOAuth(provider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            {isRegister ? 'Регистрация в Chrono' : 'Войти в Chrono'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Контент по расписанию
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-700/50 placeholder-slate-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-700/50 placeholder-slate-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
              ) : (
                isRegister ? 'Зарегистрироваться' : 'Войти'
              )}
            </button>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 rounded-md bg-slate-600 hover:bg-slate-500 text-white text-sm"
            >
              Войти через Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('telegram')}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 rounded-md bg-slate-600 hover:bg-slate-500 text-white text-sm"
            >
              Войти через Telegram
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('vk')}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 rounded-md bg-slate-600 hover:bg-slate-500 text-white text-sm"
            >
              Войти через VK
            </button>
          </div>
        <div className="text-center">
          {isRegister ? (
            <p className="text-sm text-slate-400">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                className="text-cyan-500 hover:underline"
                onClick={() => setIsRegister(false)}
              >
                Войти
              </button>
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              Нет аккаунта?{' '}
              <button
                type="button"
                className="text-cyan-500 hover:underline"
                onClick={() => setIsRegister(true)}
              >
                Зарегистрироваться
              </button>
            </p>
          )}
        </div>
      </form>
      </div>
    </div>
  );
};

export default AuthLayout;