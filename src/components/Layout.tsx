import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightning, Info, WifiHigh, WifiSlash, X } from '@phosphor-icons/react';
import { isSupabaseConfigured } from '../lib/supabase';
import Button from './Button';
import Card from './Card';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-kapoww-purple">
      
      {/* Global Background Asset */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/bg-purple.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <header className={`relative z-50 flex items-center justify-between pointer-events-auto transition-all ${window.location.pathname === '/game' ? 'p-2' : 'p-6'}`}>
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href = '/'}>
          <span className="text-2xl sm:text-4xl font-heading tracking-tighter text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] sm:drop-shadow-[0_6px_0_rgba(0,0,0,0.3)]">Kapoww!</span>
        </div>
        
        <div className={`flex items-center gap-4 bg-black/20 backdrop-blur-md p-1.5 rounded-2xl border-4 border-white/10 ${window.location.pathname === '/game' ? 'scale-75 origin-top-right' : ''}`}>
          <button 
            onClick={() => setShowInstructions(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-4 border-white text-kapoww-purple shadow-heavy hover:scale-110 active:scale-95 transition-all"
          >
            <Info size={20} weight="bold" />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>

      <footer className="relative z-20 p-12 text-center">
         <p className="text-white/70 font-heading text-[10px] uppercase tracking-[0.4em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
           &copy; 2026 KAPOWW BY VERSIONPHI &bull; THE ULTIMATE SQUAD EXPERIENCE
         </p>
      </footer>

      {/* Subtle Halftone Global Texture */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] bg-[url('/assets/halftone.svg')] bg-[length:200px]" />

      {/* Setup Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-kapoww-purple/90 backdrop-blur-md"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card variant="purple" className="p-8 sm:p-10 relative overflow-visible">
                 <button 
                   onClick={() => setShowInstructions(false)}
                   className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-kapoww-orange text-white border-4 border-white shadow-heavy flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-20"
                 >
                   <X size={24} weight="bold" />
                 </button>

                 <div className="text-center mb-8">
                   <h2 className="text-5xl sm:text-7xl font-heading mb-2 text-white drop-shadow-lg italic">HOW TO <span className="text-kapoww-warning italic-none">PLAY</span></h2>
                   <p className="text-white/60 font-heading uppercase tracking-[0.3em] text-sm italic">Master the art of trivia</p>
                 </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    {[
                      { step: '01', title: 'IDENTIFY', desc: "Choose a legendary name or let the dice decide." },
                      { step: '02', title: 'ORCHESTRATE', desc: "Host a lobby with your category or join a squad." },
                      { step: '03', title: 'DOMINATE', desc: "Answer correctly and fast. Speed earns extra points!" }
                    ].map((item, i) => (
                      <div key={i} className="flex md:flex-col items-center md:text-center p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white/10 border-4 border-white/20 transition-colors group gap-4 md:gap-2">
                        <span className="font-heading text-3xl sm:text-5xl text-white/20 group-hover:text-white/40 transition-colors shrink-0">{item.step}</span>
                        <div className="flex flex-col">
                          <h3 className="text-xl sm:text-2xl font-heading text-white mb-1 md:mb-2 text-left md:text-center leading-none">{item.title}</h3>
                          <p className="text-white/60 text-[10px] sm:text-sm font-heading leading-tight sm:leading-relaxed uppercase tracking-tighter text-left md:text-center">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                 <Button variant="success" fullWidth size="lg" onClick={() => setShowInstructions(false)}>
                   LET'S DO THIS!
                 </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
