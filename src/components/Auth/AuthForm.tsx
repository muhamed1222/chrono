import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AuthFormProps {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  isRegister: boolean;
  toggleMode: () => void;
  onForgotPassword: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
  isRegister,
  toggleMode,
  onForgotPassword,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="relative">
      <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-slate-800">
        <span className="text-xs text-gray-500">Email</span>
      </div>
      <Input
        type="email"
        value={email}
        onChange={onEmailChange}
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
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-gray-700"
          onClick={onForgotPassword}
        >
          Забыли пароль?
        </button>
      </div>
      <Input
        type="password"
        value={password}
        onChange={onPasswordChange}
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
          onClick={toggleMode}
          className="text-gray-900 dark:text-white font-medium hover:underline"
        >
          {isRegister ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </div>
    </div>
  </form>
);

export default AuthForm;
