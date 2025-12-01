import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  color = 'bg-orange-400', 
  className = '',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${color} 
        text-white font-bold py-4 px-8 rounded-3xl 
        shadow-[0_10px_0_rgb(0,0,0,0.2)] 
        active:shadow-[0_5px_0_rgb(0,0,0,0.2)] 
        active:translate-y-1 
        transition-all 
        text-2xl md:text-4xl
        flex items-center justify-center gap-3
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};
