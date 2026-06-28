import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'orange' | 'blue' | 'green' | 'purple' | 'yellow' | 'dark';
  isSlant?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'dark', isSlant = false, ...props }) => {
  const getBackgroundAsset = () => {
    if (isSlant) {
      if (variant === 'orange') return '/assets/slant-orange-bg.svg';
      if (variant === 'purple') return '/assets/slant-purple-bg.svg';
      // Fallback for slants
      return '/assets/slant-purple-bg.svg';
    } else {
      if (variant === 'blue') return '/assets/bg-blue.svg';
      if (variant === 'purple') return '/assets/bg-purple.svg';
      if (variant === 'yellow') return '/assets/bg-yellow.svg';
      if (variant === 'orange') return '/assets/bg-yellow.svg'; // Fallback to yellow
      return null;
    }
  };

  const bgAsset = getBackgroundAsset();

  const variantStyles = {
    orange: 'shadow-[0_12px_0_0_#E88D0E]',
    blue: 'shadow-[0_12px_0_0_#22A094]',
    green: 'shadow-[0_12px_0_0_#4B9600]',
    purple: 'shadow-[0_12px_0_0_#7B2CBF]',
    yellow: 'shadow-[0_12px_0_0_#FFEA00]',
    dark: 'shadow-[0_12px_0_0_rgba(0,0,0,0.5)]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        damping: 20,
        stiffness: 120 
      }}
      className={`
        relative rounded-[2.5rem] border-[6px] border-white transition-all group overflow-hidden
        ${bgAsset ? 'bg-transparent' : 'bg-white'}
        ${variantStyles[variant]} 
        ${className}
      `}
      {...props}
    >
      {/* Dynamic Background Asset Layer */}
      {bgAsset && (
        <div 
          className="absolute inset-[1px] transition-transform group-hover:scale-105 duration-700 pointer-events-none rounded-[2rem]"
          style={{ 
            backgroundImage: `url(${bgAsset})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
        />
      )}

      {/* Halftone Overlay (More vibrant for light theme) */}
      <div 
        className="absolute inset-[1px] opacity-[0.08] pointer-events-none z-10 rounded-[2rem]"
        style={{ 
          backgroundImage: 'url(/assets/halftone.svg)',
          backgroundSize: '150px'
        }} 
      />

      {/* Glossy top highlight */}
      <div className="absolute inset-x-[1px] top-[1px] h-32 bg-linear-to-b from-white/20 to-transparent pointer-events-none z-10 rounded-t-[2rem]" />
      
      <div className="relative z-20 w-full min-h-full p-4 sm:p-8 md:p-10">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
