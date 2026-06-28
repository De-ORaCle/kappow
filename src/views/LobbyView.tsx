import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams } from 'react-router-dom';
import { Users, Crown, RocketLaunch, ShareNetwork, PlayCircle, Sparkle, User, ArrowLeft } from '@phosphor-icons/react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useGame } from '../contexts/GameContext';

import { getRandomName } from '../utils/nameGenerator';

const LobbyView: React.FC = () => {
  const { code } = useParams();
  const { gameCode, players, currentPlayer, startGame, joinGame, sessionId, syncWithRoom, resetGame } = useGame();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [playerName, setPlayerName] = useState(sessionStorage.getItem('kapoww_player_name') || '');
  const [isJoining, setIsJoining] = useState(false);

  const getDisplayName = (player: typeof players[0]) => {
    if (player.id === currentPlayer?.id && !player.isHost) {
      return `${player.name} (YOU)`;
    }
    return player.name;
  };

  useEffect(() => {
    if (code && !sessionId) {
      syncWithRoom(code);
    }
  }, [code, sessionId, syncWithRoom]);

  useEffect(() => {
    if (!currentPlayer && code) {
      setShowJoinModal(true);
    } else {
      setShowJoinModal(false);
    }
  }, [currentPlayer, code]);

  const handleJoin = async () => {
    if (!code) return;
    setIsJoining(true);
    const finalName = await joinGame(code, playerName.trim());
    
    if (finalName && finalName.toLowerCase() !== playerName.trim().toLowerCase() && playerName.trim() !== "") {
      alert(`Name taken! You've been dubbed: ${finalName}`);
    }
    
    setIsJoining(false);
    setShowJoinModal(false);
  };

  const generateRandomName = () => {
    setPlayerName(getRandomName());
  };

  const formattedCode = (code || gameCode);

  const teamVariants = [
    { variant: 'orange', color: 'bg-kapoww-orange' },
    { variant: 'blue', color: 'bg-kapoww-blue' },
    { variant: 'purple', color: 'bg-kapoww-purple' },
    { variant: 'green', color: 'bg-kapoww-green' },
    { variant: 'yellow', color: 'bg-kapoww-warning' },
    { variant: 'pink', color: 'bg-kapoww-pink' },
  ] as const;

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-start p-6 pt-12 overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <motion.img 
          src="/assets/Star.svg" 
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-[5%] w-48 opacity-20"
        />
        <motion.img 
          src="/assets/Coin.svg" 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-40 left-[8%] w-32 opacity-20"
        />
      </div>

      {/* Top Nav Control */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-16 z-20">
          <Button variant="outline" size="sm" onClick={() => { resetGame(); window.location.href = '/'; }}>
             <ArrowLeft weight="bold" /> LEAVE
          </Button>
          <div className="bg-white px-6 py-2 rounded-full border-4 border-white shadow-heavy text-kapoww-purple font-heading text-xs tracking-[0.3em] uppercase italic">
            LOBBY LIVE
          </div>
      </div>

      {/* Room Identity Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center z-10 mb-20"
      >
        <h1 className="text-white/60 font-heading text-xl uppercase tracking-[0.4em] mb-4 drop-shadow-md">ROOM CODE</h1>
        <Card variant="blue" className="px-4 py-6 sm:px-16 sm:py-10 relative">
           <motion.h2 
             initial={{ scale: 0.8 }}
             animate={{ scale: 1 }}
             className={`font-heading text-white tracking-[0.1em] flex gap-8 items-center justify-center drop-shadow-2xl italic break-all ${formattedCode.length > 6 ? 'text-4xl sm:text-7xl md:text-9xl' : 'text-5xl sm:text-8xl md:text-9xl'}`}
           >
             {formattedCode}
           </motion.h2>
           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-2 bg-kapoww-warning shadow-heavy" />
        </Card>
        
        <div className="mt-12 flex items-center justify-center gap-8">
           <Button variant="outline" size="sm" className="group" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
           }}>
              <ShareNetwork size={20} weight="bold" /> COPY LINK
           </Button>
           <div className="flex items-center gap-4 font-heading text-3xl text-white">
              <Users size={32} weight="fill" className="text-kapoww-warning" />
              {players.length}
           </div>
        </div>
      </motion.div>

      {/* Players Collection */}
      <div className="w-full max-w-6xl z-10 mb-20">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-8">
          <h3 className="text-4xl font-heading text-white italic drop-shadow-lg">THE PACK</h3>
          {currentPlayer?.isHost && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full sm:w-auto"
            >
              <Button onClick={startGame} size="lg" variant="success" className="w-full sm:w-auto px-16 shadow-heavy">
                LET'S RUMBLE!
              </Button>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {players.map((player, idx) => {
              const theme = teamVariants[idx % teamVariants.length];
              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ y: -10, rotate: idx % 2 === 0 ? 2 : -2 }}
                >
                  <Card 
                    variant={theme.variant as any} 
                    className="h-auto py-6 px-4 sm:p-5 group overflow-hidden"
                  >
                    <div className="flex flex-col items-center justify-center min-h-full w-full">
                      <div className={`
                        w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-heading mb-4 border-4 border-white shadow-heavy transition-all group-hover:scale-110 group-hover:rotate-6
                        ${player.isHost ? 'bg-kapoww-orange text-white' : 'bg-white/20 text-white'}
                      `}>
                        {player.isHost ? <Crown size={32} weight="fill" /> : player.name.charAt(0)}
                      </div>
                      <p className="text-base font-heading text-white tracking-tight leading-tight w-full text-center drop-shadow-md line-clamp-2 break-words whitespace-normal">
                        {getDisplayName(player).trim()}
                      </p>
                      <p className="font-heading text-[10px] uppercase tracking-[0.2em] text-white/50 mt-2">
                        {player.isHost ? 'CAPTAIN' : 'CHALLENGER'}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {players.length < 12 && (
            <div className="h-64 border-8 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-white/20">
               <Users size={60} weight="bold" />
               <span className="font-heading text-xs uppercase tracking-widest italic opacity-50">Waiting...</span>
            </div>
          )}
        </div>
      </div>

      {/* Join Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-kapoww-purple/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl px-4"
            >
              <Card variant="blue" className="py-10 px-8 text-center group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-kapoww-blue-dark text-white rounded-[2.5rem] border-4 border-white shadow-heavy flex items-center justify-center mx-auto mb-8 rotate-6 transition-transform group-hover:rotate-0">
                  <User className="w-10 h-10 sm:w-12 sm:h-12" weight="fill" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-heading text-white italic mb-6 drop-shadow-lg">PICK YOUR <span className="text-kapoww-warning italic-none">NAME!</span></h2>
                
                <div className="flex gap-4 mb-8 px-4 sm:px-12">
                  <input
                    type="text"
                    placeholder="ENTER YOUR NAME..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="flex-1 bg-white/10 border-4 border-white/30 rounded-2xl px-6 py-5 font-heading text-2xl text-white focus:border-white focus:bg-white/20 transition-all text-center uppercase placeholder:text-white/40 shadow-inner"
                  />
                </div>

                <div className="px-4 sm:px-12 flex flex-col gap-4">
                   <Button onClick={handleJoin} variant="success" fullWidth size="lg" disabled={isJoining || !playerName.trim()}>
                     {isJoining ? 'PREPARING...' : "LFG!"}
                   </Button>
                   <Button onClick={generateRandomName} variant="outline" fullWidth size="md" className="opacity-70 hover:opacity-100">
                      RANDOMIZE
                   </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentPlayer?.isHost && currentPlayer && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 bg-kapoww-warning text-black border-4 border-white px-6 py-4 sm:px-16 sm:py-6 rounded-[3rem] shadow-heavy"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-6">
             <div className="w-4 h-4 sm:w-5 sm:h-5 bg-black rounded-full animate-ping shrink-0" />
             <p className="font-heading italic text-lg sm:text-2xl tracking-tight uppercase text-center">HOST STARTING SOON...</p>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default LobbyView;
