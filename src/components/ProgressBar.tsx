import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showLabels?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, color = 'bg-kapoww-orange', showLabels = false }) => {
  const percentage = Math.max(0, Math.min(100, (current / total) * 100));

  return (
    <div className="w-full flex flex-col gap-2">
      {showLabels && (
        <div className="flex justify-between items-end px-1">
          <span className="font-heading text-xs text-white/40 uppercase tracking-widest">Progress</span>
          <span className="font-heading text-2xl text-kapoww-warning italic">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-8 bg-black/20 rounded-full overflow-hidden border-4 border-white shadow-heavy relative">
        <motion.div
           className={`h-full ${color} rounded-full relative z-10`}
           initial={{ width: '100%' }}
           animate={{ width: `${percentage}%` }}
           transition={{ duration: 0.1, ease: 'linear' }}
        >
           {/* Glossy Overlay */}
           <div className="absolute inset-0 bg-linear-to-b from-white/40 to-transparent pointer-events-none" />
           <div className="absolute inset-x-0 bottom-0 h-2 bg-black/10 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
