import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkle, Atom, RocketLaunch, Book, VideoCamera, Globe, Trophy, DiceFive, Info, Calculator, BookOpen } from '@phosphor-icons/react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useGame } from '../contexts/GameContext';

const CATEGORIES = [
  { id: 'All', name: 'Random Mix', icon: Sparkle, color: 'text-primary' },
  { id: 'Science & Nature', name: 'Science', icon: Atom, color: 'text-blue-400' },
  { id: 'Technology', name: 'Tech', icon: RocketLaunch, color: 'text-purple-400' },
  { id: 'History', name: 'History', icon: Book, color: 'text-orange-400' },
  { id: 'Pop Culture', name: 'Pop Culture', icon: VideoCamera, color: 'text-pink-400' },
  { id: 'Geography', name: 'Geography', icon: Globe, color: 'text-green-400' },
  { id: 'Sports', name: 'Sports', icon: Trophy, color: 'text-yellow-400' },
  { id: 'Math', name: 'Math', icon: Calculator, color: 'text-red-400' },
  { id: 'English', name: 'English', icon: BookOpen, color: 'text-teal-400' },
];

import { getRandomName } from '../utils/nameGenerator';

const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const { createGame, joinGame } = useGame();
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleCategoryToggle = (id: string) => {
    if (id === 'All') {
      setSelectedCategories(['All']);
      return;
    }

    setSelectedCategories(prev => {
      const filtered = prev.filter(c => c !== 'All');
      if (filtered.includes(id)) {
        const next = filtered.filter(c => c !== id);
        return next.length === 0 ? ['All'] : next;
      } else {
        return [...filtered, id];
      }
    });
  };

  const generateRandomName = () => {
    setPlayerName(getRandomName());
  };

  const handleCreate = async () => {
    const finalName = playerName.trim() || getRandomName();
    try {
      const code = await createGame(finalName, selectedCategories);
      navigate(`/lobby/${code}`);
    } catch (err) {
      alert("Uh oh! Failed to create the room.");
    }
  };

  const handleJoin = async () => {
    if (!joinCode || isJoining) return;
    
    setIsJoining(true);
    setJoinError(null);

    // Safety timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("TIMED_OUT")), 10000);
    });

    try {
      // Simplified call for debugging
      const result = await joinGame(joinCode.toUpperCase(), playerName);
      
      if (!result.success) {
        setJoinError(result.error || "Failed to join room.");
        return;
      }
      
      navigate(`/lobby/${joinCode.toUpperCase()}`);
    } catch (err: any) {
      console.error("Join flow caught error:", err);
      // Show the actual error text for debugging
      setJoinError(`System Error: ${err.message || 'Unknown'}`);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4 py-12">
      
      {/* Decorative Assets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.img 
          src="/assets/Coin.svg" 
          animate={{ y: [0, -40, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 left-[-10%] sm:top-10 sm:left-[5%] w-24 sm:w-32 drop-shadow-2xl opacity-40 sm:opacity-80 z-0"
        />
        <motion.img 
          src="/assets/Star.svg" 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 right-[-10%] sm:bottom-20 sm:right-[5%] w-28 sm:w-36 drop-shadow-2xl opacity-40 sm:opacity-80 z-0"
        />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 z-10"
      >
        <div className="relative inline-block mb-6 pt-10">
          <motion.div
            animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="relative"
          >
            <h1 className="text-5xl sm:text-8xl lg:text-[10rem] font-heading tracking-tighter text-white italic leading-none drop-shadow-[0_8px_0_rgba(0,0,0,0.3)] sm:drop-shadow-[0_12px_0_rgba(0,0,0,0.3)]">
              Kapoww!
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 12 }}
            className="absolute -top-6 -right-6 sm:-top-8 sm:-right-16 z-20 bg-kapoww-orange text-white font-heading text-xl sm:text-2xl px-4 py-2 sm:px-6 sm:py-3 rounded-2xl border-4 border-white shadow-heavy"
          >
            FREE!
          </motion.div>
        </div>
        <p className="text-xl sm:text-3xl text-white font-heading max-w-xl mx-auto uppercase tracking-widest mt-4 drop-shadow-lg">
          Ultimate Trivia <span className="text-kapoww-orange">Showdown</span>
        </p>
      </motion.div>

      {/* Main Containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl z-10">
        
        {/* Identity & Room Selection (Left Side) */}
        <div className="flex flex-col gap-8">
          <Card variant="purple" className="h-auto px-6 sm:px-10">
            <h3 className="font-heading text-white/50 uppercase tracking-widest text-[10px] mb-4 drop-shadow-sm">Player Identity</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="USERNAME..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-black/40 border-4 border-white/20 rounded-2xl px-4 py-4 sm:px-6 sm:py-4 font-heading text-lg sm:text-xl text-white focus:border-white transition-all placeholder:text-white/30 h-14"
                />
              </div>
              <Button onClick={generateRandomName} variant="pink" size="xs" className="w-14 h-14 rounded-2xl flex shrink-0">
                  <DiceFive size={24} weight="fill" />
              </Button>
            </div>
            <p className="text-[10px] text-white/40 font-heading uppercase mt-3 ml-2 tracking-widest">
              BLANK = RANDOM LEGEND
            </p>
          </Card>

          <Card variant="yellow" className="flex flex-col gap-10">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 bg-kapoww-warning text-black rounded-2xl flex items-center justify-center border-4 border-white shadow-heavy rotate-3">
                  <RocketLaunch size={36} weight="fill" />
               </div>
               <h2 className="text-4xl font-heading text-white italic drop-shadow-md">HOST ROOM</h2>
            </div>

            <div className="space-y-6 sm:space-y-8">
               <label className="font-heading text-white/50 uppercase tracking-widest text-[10px] sm:text-xs ml-1">Choose Category</label>
               <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-5 mt-4">
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={`
                          p-3 sm:p-4 rounded-2xl border-4 font-heading text-[10px] sm:text-xs transition-all flex items-center gap-2 uppercase tracking-tighter
                          ${isSelected ? 'bg-kapoww-warning border-white text-black shadow-heavy scale-105' : 'bg-black/50 border-white/20 text-white hover:bg-black/60 hover:border-white/40'}
                        `}
                      >
                        <cat.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" weight={isSelected ? "fill" : "bold"} />
                        {cat.name}
                      </button>
                    );
                  })}
               </div>
            </div>

            <Button onClick={handleCreate} variant="success" fullWidth size="lg" className="mt-4">
              START PARTY
            </Button>
          </Card>
        </div>

         {/* Join Game Section (Right Side) */}
        <div className="flex flex-col gap-8 h-full">
          <Card variant="blue" className="flex-1 group">
             <div className="flex flex-col justify-center items-center text-center min-h-full w-full py-6 sm:py-8">
               <div className="relative z-10 w-full max-w-sm px-4 sm:px-0">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-kapoww-blue-dark text-white rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-10 border-4 border-white shadow-heavy -rotate-6 transition-transform group-hover:rotate-0">
                    <Globe className="w-10 h-10 sm:w-14 sm:h-14" weight="fill" />
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-heading text-white italic mb-6 sm:mb-10 leading-none drop-shadow-lg">JOIN THE <span className="text-kapoww-warning italic-none">ACTION!</span></h2>
                  
                  <div className="relative mb-6 sm:mb-8">
                    <input
                      type="text"
                      placeholder="ENTER CODE"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="w-full bg-white/10 border-4 border-white/30 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 text-center font-heading text-2xl sm:text-3xl tracking-[0.2em] text-white focus:border-white focus:bg-white/20 transition-all placeholder:text-white/40 shadow-inner h-14 sm:h-auto"
                    />
                  </div>
                    <AnimatePresence>
                     {joinError && (
                       <motion.div 
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         exit={{ opacity: 0, height: 0 }}
                         className="mb-4"
                       >
                         <div className="bg-kapoww-error/20 border-2 border-kapoww-error text-kapoww-error px-4 py-2 rounded-xl font-heading text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                           <Info size={16} weight="fill" />
                           {joinError}
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
   
                   <Button 
                     onClick={handleJoin} 
                     variant="secondary" 
                     fullWidth 
                     size="lg"
                     disabled={!joinCode || joinCode.length < 3 || isJoining}
                   >
                     {isJoining ? 'JOINING...' : 'JUMP IN!'}
                   </Button>
               </div>
             </div>
          </Card>
        </div>

      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 flex flex-col md:flex-row items-center gap-4 md:gap-10 text-white font-heading text-[10px] uppercase tracking-[0.5em] drop-shadow-lg text-center"
      >
        <span className="opacity-80">MULTIPLAYER</span>
        <div className="w-3 h-3 bg-kapoww-success rounded-full animate-ping hidden md:block" />
        <span className="opacity-80">PREMIUM GAMEPLAY</span>
      </motion.div>
    </div>
  );
};

export default HomeView;
