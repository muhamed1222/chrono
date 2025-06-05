import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getSupabase } from '../../lib/supabase';
import { Card, CardContent } from '../ui/Card';
import SocialLoginButtons, { SocialLogin } from './SocialLoginButtons';
import AuthForm from './AuthForm';
import ForgotPasswordModal from './ForgotPasswordModal';

const socialLogins: readonly SocialLogin[] = [
  { name: 'Google', provider: 'google' },
  { name: 'VK', provider: 'vk' },
  { name: 'Telegram', provider: 'telegram' },
] as const;

const AuthLayout: React.FC = () => {
  const { signIn, signUp, signInWithOAuth } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

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

  const handleResetPassword = async (resetEmail: string) => {
    const { error } = await getSupabase().auth.resetPasswordForEmail(resetEmail);
    if (error) throw error;
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
            <SocialLoginButtons
              socialLogins={socialLogins}
              onOAuth={handleOAuth}
              loading={loading}
              isRegister={isRegister}
            />

            <div className="text-center text-sm text-gray-500">
              {isRegister ? 'Или зарегистрируйтесь с помощью email' : 'Или войдите с помощью email'}
            </div>

            <AuthForm
              email={email}
              password={password}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onSubmit={handleSubmit}
              loading={loading}
              isRegister={isRegister}
              toggleMode={() => setIsRegister(!isRegister)}
              onForgotPassword={() => setResetOpen(true)}
            />
          </div>
        </CardContent>
      </Card>
      <ForgotPasswordModal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        onReset={handleResetPassword}
      />
    </div>
  );
};

export default AuthLayout;
