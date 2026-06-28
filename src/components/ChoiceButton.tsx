import React from 'react';
import { motion } from 'motion/react';
import { useSound } from '../hooks/useSound';

interface ChoiceButtonProps {
  choice: string;
  index: number;
  selected: boolean;
  correct?: boolean | null;
  disabled?: boolean;
  onClick: () => void;
}

const ARROW_ASSETS = [
  { base: 'arrow-red-left', color: 'bg-kapoww-error' },
  { base: 'arrow-blue-diagonalleft', color: 'bg-kapoww-blue' },
  { base: 'arrow-green-diagonalright', color: 'bg-kapoww-green' },
  { base: 'arrow-orange-right', color: 'bg-kapoww-orange' }
];

const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  choice,
  index,
  selected,
  correct,
  disabled,
  onClick
}) => {
  const { playSound } = useSound();
  const assetInfo = ARROW_ASSETS[index % ARROW_ASSETS.length];
  
  // Decide which SVG to show based on state
  let state = 'default';
  if (selected) state = 'active';
  if (correct === true) state = 'perfect';
  if (correct === false && selected) state = 'miss';

  const assetPath = `/assets/${assetInfo.base}-${state}.svg`;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -4, rotate: index % 2 === 0 ? 1 : -1 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 0 } : {}}
      onClick={() => {
        if (!disabled) {
          playSound('click');
          onClick();
        }
      }}
      disabled={disabled}
      className={`
        relative w-full p-4 sm:p-5 text-left rounded-2xl sm:rounded-[2rem] border-4 transition-all duration-200
        flex items-center gap-6 group overflow-hidden shadow-heavy
        ${correct === true ? 'border-white bg-kapoww-success shadow-[0_8px_0_0_#4B9600]' : 
          correct === false && selected ? 'border-white bg-kapoww-error shadow-[0_8px_0_0_#C90056]' :
          selected ? `border-white ${assetInfo.color} shadow-heavy` : 'border-white bg-white text-kapoww-purple hover:bg-white/90'}
        ${disabled && !selected && correct === null ? 'opacity-40 grayscale-[0.8]' : 'opacity-100'}
      `}
    >
      {/* Glossy Shine Overlay */}
      {!disabled && (
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)'
          }}
        />
      )}

      {/* Choice Icon (Arrow Asset) */}
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 z-30">
        <motion.img
          key={assetPath}
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          src={assetPath}
          alt={`Choice ${index}`}
          className="w-full h-full object-contain drop-shadow-md"
        />
        
        {/* Letter Label (Digitalt Font) */}
        <div className="absolute -top-2 -left-2 w-10 h-10 rounded-xl bg-white text-black font-heading text-xl flex items-center justify-center shadow-lg transform -rotate-12 border-4 border-black/5">
          {String.fromCharCode(65 + index)}
        </div>
      </div>

      <span className={`text-xl sm:text-2xl font-heading tracking-tight flex-1 z-30 leading-tight drop-shadow-sm ${!selected && correct === null ? 'text-kapoww-purple' : 'text-white'}`}>
        {choice}
      </span>
      
      {correct === true && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: [1.2, 1] }}
          className="w-14 h-14 z-40 drop-shadow-xl"
        >
          <img src="/assets/status-perfect.svg" alt="Perfect" className="w-full h-full" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default ChoiceButton;
