import React from 'react';
import Button from '../ui/Button';

export interface SocialLogin {
  name: string;
  provider: 'telegram' | 'vk' | 'google';
}

interface SocialLoginButtonsProps {
  socialLogins: readonly SocialLogin[];
  onOAuth: (provider: SocialLogin['provider']) => void;
  loading: boolean;
  isRegister: boolean;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  socialLogins,
  onOAuth,
  loading,
  isRegister,
}) => (
  <div className="space-y-2">
    {socialLogins.map((social) => (
      <Button
        key={social.provider}
        onClick={() => onOAuth(social.provider)}
        disabled={loading}
        className="w-full h-12 flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors"
      >
        <span className="text-gray-700 dark:text-gray-200">
          {isRegister
            ? `Зарегистрироваться через ${social.name}`
            : `Войти через ${social.name}`}
        </span>
      </Button>
    ))}
  </div>
);

export default SocialLoginButtons;
