import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const baseClasses =
  'appearance-none block w-full px-3 py-2 border border-slate-700 bg-slate-700/50 placeholder-slate-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent';

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => (
  <input ref={ref} className={`${baseClasses} ${className}`} {...props} />
));

Input.displayName = 'Input';

export default Input;
