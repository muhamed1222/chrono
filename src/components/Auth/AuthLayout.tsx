import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent } from '../ui/Card';

const AuthLayout: React.FC = () => {
  const { signIn, signUp, signInWithOAuth } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const socialLogins = [
    { name: 'Google', provider: 'google' },
    { name: 'VK', provider: 'vk' },
    { name: 'Telegram', provider: 'telegram' }
  ] as const;

  const handleOAuth = async (provider: 'telegram' | 'vk' | 'google') => {
    setError('');
    setLoading(true);
    try {
      await signInWithOAuth(provider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
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
    <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
      <Card className="w-full max-w-[480px] rounded-[32px] shadow-xl backdrop-blur-[32px] bg-white dark:bg-slate-800">
        <CardContent className="p-16 flex flex-col items-center gap-10">
          <h2 className="text-3xl font-semibold text-center">
            {isRegister ? 'Создать аккаунт Chrono' : 'Войти в Chrono'}
          </h2>

          {error && (
            <div className="w-full p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="w-full space-y-6">
            <div className="space-y-2">
              {socialLogins.map((social) => (
                <Button
                  key={social.provider}
                  onClick={() => handleOAuth(social.provider)}
                  disabled={loading}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-200">
                    {isRegister ? `Зарегистрироваться через ${social.name}` : `Войти через ${social.name}`}
                  </span>
                </Button>
              ))}
            </div>

            <div className="text-center text-sm text-gray-500">
              {isRegister ? 'Или зарегистрируйтесь с помощью email' : 'Или войдите с помощью email'}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-slate-800">
                  <span className="text-xs text-gray-500">Email</span>
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-4 rounded-full border-2"
                  placeholder="chrono@example.com"
                />
              </div>

              <div className="relative">
                <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-slate-800">
                  <span className="text-xs text-gray-500">Пароль</span>
                </div>
                <div className="absolute -top-2.5 right-4 px-2 bg-white dark:bg-slate-800">
                  <button type="button" className="text-xs text-gray-500 hover:text-gray-700">
                    Забыли пароль?
                  </button>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pl-4 rounded-full border-2"
                />
              </div>

              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#222222] hover:bg-[#333333] text-white rounded-full transition-colors"
                >
                  {isRegister ? 'Зарегистрироваться' : 'Войти'}
                </Button>

                <div className="text-center space-x-1">
                  <span className="text-gray-500">
                    {isRegister ? 'Уже есть аккаунт?' : 'Нужна учетная запись?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-gray-900 dark:text-white font-medium hover:underline"
                  >
                    {isRegister ? 'Войти' : 'Зарегистрироваться'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;