import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-4">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            {isRegister ? 'Регистрация в Chrono' : 'Войти в Chrono'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Контент по расписанию
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
          <Button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
            ) : (
              isRegister ? 'Зарегистрироваться' : 'Войти'
            )}
          </Button>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              variant="secondary"
              className="w-full flex justify-center"
            >
              Войти через Google
            </Button>
            <Button
              type="button"
              onClick={() => handleOAuth('telegram')}
              disabled={loading}
              variant="secondary"
              className="w-full flex justify-center"
            >
              Войти через Telegram
            </Button>
            <Button
              type="button"
              onClick={() => handleOAuth('vk')}
              disabled={loading}
              variant="secondary"
              className="w-full flex justify-center"
            >
              Войти через VK
            </Button>
          </div>
        <div className="text-center">
          {isRegister ? (
            <p className="text-sm text-slate-400">
              Уже есть аккаунт?{' '}
              <Button
                type="button"
                variant="link"
                onClick={() => setIsRegister(false)}
              >
                Войти
              </Button>
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              Нет аккаунта?{' '}
              <Button
                type="button"
                variant="link"
                onClick={() => setIsRegister(true)}
              >
                Зарегистрироваться
              </Button>
            </p>
          )}
        </div>
      </form>
      </div>
    </div>
  );
};

export default AuthLayout;