import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2.5 rounded-lg font-normal text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    // Purple accent with subtle glow
    primary: "bg-[#5E6AD2] hover:bg-[#4e5ac0] text-white shadow-[0_0_20px_-5px_rgba(94,106,210,0.4)] border border-transparent",
    // Dark surface with thin border
    secondary: "bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 border border-white/[0.08]",
    // Subtle red background
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
};