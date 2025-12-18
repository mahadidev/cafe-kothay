import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 shadow-xl transition-all duration-300 ${className} ${onClick ? 'cursor-pointer hover:bg-white/10' : ''}`}
    >
      {children}
    </div>
  );
};