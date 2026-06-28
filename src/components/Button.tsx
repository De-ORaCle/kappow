import React from 'react';
import { motion } from 'motion/react';
import { useSound } from '../hooks/useSound';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'purple' | 'pink';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  onClick,
  disabled,
  ...props 
}) => {
  const { playSound } = useSound();

  const handlePointerDown = () => {
    if (!disabled) playSound('click');
  };

  const variants = {
    primary: 'game-button-3d',
    secondary: 'game-button-blue-3d',
    success: 'game-button-success-3d',
    pink: 'relative px-10 py-4 bg-kapoww-pink text-white font-heading text-xl rounded-3xl border-4 border-white shadow-[0_8px_0_0_#C90056] transition-all duration-100 hover:-translate-y-1 active:translate-y-1 active:shadow-none hover:brightness-110 active:brightness-95',
    purple: 'relative px-10 py-4 bg-kapoww-purple text-white font-heading text-xl rounded-3xl border-4 border-white shadow-[0_8px_0_0_#7B2CBF] transition-all duration-100 hover:-translate-y-1 active:translate-y-1 active:shadow-none hover:brightness-110 active:brightness-95',
    outline: 'border-4 border-white hover:bg-white/20 text-white font-heading rounded-3xl transition-all shadow-heavy hover:-translate-y-1 active:translate-y-1 active:shadow-none'
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-6 py-2 text-sm',
    md: 'px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-xl',
    lg: 'px-8 py-4 sm:px-14 sm:py-6 text-xl sm:text-2xl'
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, rotate: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98, rotate: 1 } : {}}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${disabled ? 'opacity-50 cursor-not-allowed filter grayscale' : ''}
        ${className}
        overflow-hidden
      `}
      {...props}
    >
      {/* Glossy Shine Overlay (Diagonal Top-Left) */}
      {!disabled && variant !== 'outline' && (
        <div 
          className="absolute inset-[1px] pointer-events-none z-20 rounded-[inherit]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)'
          }}
        />
      )}

      {/* Internal Bottom Shadow/Bevel look */}
      {!disabled && variant !== 'outline' && (
        <div className="absolute inset-x-[1px] bottom-[1px] h-2 bg-black/10 z-10 pointer-events-none rounded-b-[inherit]" />
      )}

      <div className="relative z-30 flex items-center justify-center gap-3 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
        {children}
      </div>
    </motion.button>
  );
};

export default Button;
