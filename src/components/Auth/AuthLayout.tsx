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
    { name: 'Google', icon: 'https://c.animaapp.com/6u07ka4v/img/frame.svg', provider: 'google' },
    { name: 'VK', icon: 'https://c.animaapp.com/6u07ka4v/img/frame-1.svg', provider: 'vk' },
    { name: 'Telegram', icon: 'https://c.animaapp.com/6u07ka4v/img/frame-2.svg', provider: 'telegram' },
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
    <div className="bg-[#222222] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-neutral-shade04-100 w-full max-w-[1440px] h-[1024px] flex items-center justify-center">
        <Card className="w-[480px] rounded-[32px] shadow-depth-light backdrop-blur-[32px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(32px)_brightness(100%)] bg-theme-backgrounds-surface2">
          <CardContent className="flex flex-col items-center justify-center gap-10 p-16">
            <h2 className="self-stretch font-h-4 font-[number:var(--h-4-font-weight)] text-theme-text-primary text-[length:var(--h-4-font-size)] text-center tracking-[var(--h-4-letter-spacing)] leading-[var(--h-4-line-height)] [font-style:var(--h-4-font-style)]">
              {isRegister ? 'Создать аккаунт Chrono' : 'Войти в Chrono'}
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded w-full text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col items-start gap-6 w-full">
              <div className="flex flex-col items-start gap-1 w-full">
                {socialLogins.map((social) => (
                  <Button
                    key={social.name}
                    variant="secondary"
                    disabled={loading}
                    onClick={() => handleOAuth(social.provider)}
                    className="h-12 w-full justify-center gap-2 px-7 py-3.5 bg-theme-backgrounds-surface1 rounded-[90px] hover:bg-theme-backgrounds-surface1/90"
                  >
                    <div className="relative w-6 h-6">
                      <img className="absolute w-5 h-5 top-0.5 left-0.5" alt={`${social.name} icon`} src={social.icon} />
                    </div>
                    <span className="font-button font-[number:var(--button-font-weight)] text-theme-text-secondary text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] whitespace-nowrap [font-style:var(--button-font-style)]">
                      {isRegister ? `Зарегистрироваться через ${social.name}` : `Войти через ${social.name}`}
                    </span>
                  </Button>
                ))}
              </div>

              <div className="w-full text-center font-caption-2 font-[number:var(--caption-2-font-weight)] text-theme-text-tertiary text-[length:var(--caption-2-font-size)] tracking-[var(--caption-2-letter-spacing)] leading-[var(--caption-2-line-height)] [font-style:var(--caption-2-font-style)]">
                {isRegister
                  ? 'Или зарегистрируйтесь с помощью электронной почты'
                  : 'Или войдите в систему с помощью электронной почты'}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4 w-full">
                <div className="relative w-full">
                  <div className="absolute z-10 -top-1 left-6 px-1 bg-theme-backgrounds-surface2">
                    <span className="font-caption-2 font-[number:var(--caption-2-font-weight)] text-theme-text-primary text-[length:var(--caption-2-font-size)] text-center tracking-[var(--caption-2-letter-spacing)] leading-[var(--caption-2-line-height)] [font-style:var(--caption-2-font-style)]">
                      Email
                    </span>
                  </div>
                  <Input
                    className="h-12 rounded-[48px] border-[1.5px] border-theme-stroke-subtle pl-7 font-body-2 font-[number:var(--body-2-font-weight)] text-theme-text-tertiary text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] [font-style:var(--body-2-font-style)]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                  />
                </div>

                <div className="relative w-full">
                  <div className="flex justify-between absolute z-10 w-full">
                    <div className="absolute -top-1 left-6 px-1 bg-theme-backgrounds-surface2">
                      <span className="font-caption-2 font-[number:var(--caption-2-font-weight)] text-theme-text-primary text-[length:var(--caption-2-font-size)] text-center tracking-[var(--caption-2-letter-spacing)] leading-[var(--caption-2-line-height)] [font-style:var(--caption-2-font-style)]">
                        Пароль
                      </span>
                    </div>
                    <div className="absolute -top-1 right-6 px-1 bg-theme-backgrounds-surface2">
                      <span className="font-caption-2 font-[number:var(--caption-2-font-weight)] text-theme-text-secondary text-[length:var(--caption-2-font-size)] text-center tracking-[var(--caption-2-letter-spacing)] leading-[var(--caption-2-line-height)] cursor-pointer [font-style:var(--caption-2-font-style)]">
                        Забыли пароль?
                      </span>
                    </div>
                  </div>
                  <Input
                    type="password"
                    className="h-12 rounded-[48px] border-[1.5px] border-theme-stroke-stroke2 pl-7"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col items-center gap-4 w-full mt-4">
                  <Button type="submit" disabled={loading} className="w-full h-12 rounded-[90px] bg-[#222222] text-white hover:bg-[#222222]/90">
                    {isRegister ? 'Зарегистрироваться' : 'Войти'}
                  </Button>

                  <div className="flex items-center gap-1">
                    {isRegister ? (
                      <>
                        <span className="font-body-2 font-[number:var(--body-2-font-weight)] text-theme-text-secondary text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] [font-style:var(--body-2-font-style)]">
                          Уже есть аккаунт?
                        </span>
                        <span
                          className="font-body-2 font-[number:var(--body-2-font-weight)] text-theme-text-primary text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] cursor-pointer [font-style:var(--body-2-font-style)]"
                          onClick={() => setIsRegister(false)}
                        >
                          Войти
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-body-2 font-[number:var(--body-2-font-weight)] text-theme-text-secondary text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] [font-style:var(--body-2-font-style)]">
                          Нужна учетная запись?
                        </span>
                        <span
                          className="font-body-2 font-[number:var(--body-2-font-weight)] text-theme-text-primary text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] cursor-pointer [font-style:var(--body-2-font-style)]"
                          onClick={() => setIsRegister(true)}
                        >
                          Зарегестрироваться
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
