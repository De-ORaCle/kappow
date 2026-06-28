import React from 'react';
import { motion } from 'motion/react';
import { Trophy, House, Repeat, Crown, ChartBar, Star } from '@phosphor-icons/react';
import { useGame } from '../contexts/GameContext';
import Card from '../components/Card';
import Button from '../components/Button';

const ResultsView: React.FC = () => {
  const { players, resetGame, syncWithRoom, gameCode, currentPlayer, playRematch } = useGame();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const podium = sortedPlayers.slice(0, 3);
  const others = sortedPlayers.slice(3);

  const getDisplayName = (player: typeof players[0]) => {
    if (player.id === currentPlayer?.id && !player.isHost) {
      return `${player.name} (YOU)`;
    }
    return player.name;
  };



  const themeVariants = [
    { variant: 'yellow', color: 'bg-kapoww-warning' },
    { variant: 'blue', color: 'bg-kapoww-blue' },
    { variant: 'purple', color: 'bg-kapoww-purple' },
  ] as const;

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center pt-16 pb-32">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 sm:opacity-40">
        <motion.img 
          src="/assets/Coin.svg" 
          animate={{ rotate: 360, y: [0, -100, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-20 left-[-10%] sm:left-[10%] w-24 sm:w-32 opacity-40 sm:opacity-100"
        />
        <motion.img 
          src="/assets/Star.svg" 
          animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-40 right-[-10%] sm:right-[15%] w-28 sm:w-40 opacity-40 sm:opacity-100"
        />
      </div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-24 z-10"
      >
        <h1 className="text-white/60 font-heading text-xl uppercase tracking-[0.6em] mb-4 drop-shadow-md">FINAL RESULTS</h1>
        <div className="relative inline-block">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
             <h2 className="text-4xl sm:text-8xl lg:text-[10rem] font-heading text-white tracking-tighter italic drop-shadow-[0_15px_0_rgba(0,0,0,0.2)]">
               VICTO<span className="text-kapoww-warning italic-none">RY!</span>
             </h2>
          </motion.div>

        </div>
      </motion.div>

      {/* Podium Section */}
      <div className="w-full max-w-6xl px-6 flex flex-col sm:flex-row items-end justify-center gap-8 mb-24 z-10">
        {/* 2nd Place */}
        {podium[1] && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-1 w-full sm:w-auto order-[2] sm:order-none"
          >
            <div className="flex flex-col items-center">
              <span className="font-heading text-4xl text-white/40 mb-6 italic">2ND</span>
              <Card variant="blue" className="w-full text-center p-8 group">
                <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-heavy font-heading text-3xl transition-transform group-hover:scale-110 group-hover:rotate-6">
                  {podium[1].name.charAt(0)}
                </div>
                <h3 className="text-xl sm:text-2xl font-heading text-white mb-2 break-words leading-tight">{getDisplayName(podium[1])}</h3>
                <p className="font-heading text-xl text-kapoww-warning italic">{podium[1].score} PTS</p>
              </Card>
            </div>
          </motion.div>
        )}

        {/* 1st Place */}
        {podium[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.8 }}
            className="flex-1 w-full sm:w-auto sm:mb-8 order-first sm:order-none"
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                 <motion.div
                   animate={{ rotate: [0, 360] }}
                   transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-0 z-0"
                 >
                    <Star size={80} weight="fill" className="text-kapoww-warning opacity-30 blur-xl scale-150" />
                 </motion.div>
                 <span className="font-heading text-6xl text-kapoww-warning italic drop-shadow-[0_4px_0_white] relative z-10">1ST</span>
              </div>
              <Card variant="yellow" className="w-full text-center px-6 py-8 sm:p-12 border-[8px] bg-white group scale-105 shadow-[0_20px_0_0_#FFEA00]">
                <div className="w-28 h-28 bg-kapoww-orange rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center border-4 border-white shadow-heavy font-heading text-5xl text-white transition-transform group-hover:scale-110 group-hover:rotate-12">
                   <Crown size={60} weight="fill" />
                </div>
                <h3 className="text-2xl sm:text-4xl font-heading text-kapoww-purple mb-3 italic break-words leading-tight">{getDisplayName(podium[0])}</h3>
                <p className="font-heading text-4xl text-kapoww-orange italic drop-shadow-sm">{podium[0].score} PTS</p>
              </Card>
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {podium[2] && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex-1 w-full sm:w-auto order-[3] sm:order-none"
          >
            <div className="flex flex-col items-center">
              <span className="font-heading text-4xl text-white/20 mb-6 italic">3RD</span>
              <Card variant="purple" className="w-full text-center p-8 group">
                <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-heavy font-heading text-3xl transition-transform group-hover:scale-110 group-hover:-rotate-6">
                  {podium[2].name.charAt(0)}
                </div>
                <h3 className="text-xl sm:text-2xl font-heading text-white mb-2 break-words leading-tight">{getDisplayName(podium[2])}</h3>
                <p className="font-heading text-xl text-kapoww-warning italic">{podium[2].score} PTS</p>
              </Card>
            </div>
          </motion.div>
        )}
      </div>

      {/* Leaderboard Table (Others) */}
      {others.length > 0 && (
         <div className="w-full max-w-4xl px-6 mb-24 z-10">
            <Card variant="dark" className="p-0 border-white/20 bg-black/30 backdrop-blur-md">
               <div className="p-8 border-b-4 border-white/10 flex items-center gap-4">
                  <ChartBar size={32} className="text-white/40" />
                  <h3 className="font-heading text-2xl text-white italic uppercase tracking-widest">THE REST OF THE SQUAD</h3>
               </div>
               <div className="p-4 flex flex-col gap-3">
                  {others.map((player, idx) => (
                    <div key={player.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border-2 border-white/5 hover:border-white/10 transition-colors">
                       <div className="flex items-center gap-6">
                          <span className="font-heading text-2xl text-white/20">{idx + 4}</span>
                          <span className="font-heading text-2xl text-white break-words">{getDisplayName(player)}</span>
                       </div>
                       <span className="font-heading text-2xl text-kapoww-warning italic">{player.score} PTS</span>
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      )}

      {/* Action Buttons */}
      <div className="max-w-4xl w-full px-6 flex flex-col sm:flex-row gap-8 z-20">
         {currentPlayer?.isHost && (
           <Button 
             fullWidth 
             size="lg" 
             variant="success" 
             onClick={playRematch}
             className="flex items-center justify-center gap-4"
           >
             <Repeat size={32} weight="bold" /> REMATCH!
           </Button>
         )}
         <Button 
           fullWidth 
           size="lg" 
           variant="outline" 
           onClick={() => {
             resetGame();
             window.location.href = '/';
           }}
           className="flex items-center justify-center gap-4"
         >
           <House size={32} weight="bold" /> HOME
         </Button>
      </div>

    </div>
  );
};

export default ResultsView;
