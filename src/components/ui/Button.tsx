import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'link';
};

const baseClasses =
  'rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2',
  secondary: 'bg-slate-600 hover:bg-slate-500 text-white px-4 py-2',
  link: 'p-0 text-cyan-500 hover:underline bg-transparent',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={`${baseClasses} ${variant ? variantClasses[variant] : ''} ${className}`}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export default Button;
