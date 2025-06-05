import React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`rounded-lg bg-white dark:bg-slate-800 shadow ${className}`} {...props} />
));
Card.displayName = 'Card';

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`p-4 ${className}`} {...props} />
));
CardContent.displayName = 'CardContent';

export default Card;
