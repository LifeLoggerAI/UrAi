'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary';
};

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-2xl transition-all';

  const variants: Record<'primary' | 'secondary' | 'tertiary', string> = {
    primary: 'bg-blue-500 text-white shadow-lg hover:bg-blue-600',
    secondary: 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20',
    tertiary: 'text-white/70 hover:text-white',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
