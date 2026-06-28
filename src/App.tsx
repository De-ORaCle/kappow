import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import LobbyView from './views/LobbyView';
import GameView from './views/GameView';
import ResultsView from './views/ResultsView';
import { GameProvider, useGame } from './contexts/GameContext';

/**
 * Automatically navigates users to the correct page based on the 
 * synchronized game status from Supabase.
 */
function SyncNavigator() {
  const { status, gameCode } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isRoomPath = location.pathname.match(/\/(lobby|game|results)\//);

    // Only redirect to home if we are genuinely not in a game context and not on a room path
    if (status === 'home' && location.pathname !== '/' && !isRoomPath) {
      navigate('/');
    } else if (status === 'lobby' && gameCode && !location.pathname.includes(`/lobby/${gameCode}`)) {
      navigate(`/lobby/${gameCode}`);
    } else if (status === 'playing' && gameCode && !location.pathname.includes(`/game/${gameCode}`)) {
      navigate(`/game/${gameCode}`);
    } else if (status === 'results' && gameCode && !location.pathname.includes(`/results/${gameCode}`)) {
      navigate(`/results/${gameCode}`);
    }
  }, [status, gameCode, navigate, location.pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <SyncNavigator />
        <Layout>
          <div className="flex-1 flex flex-col pt-12 pb-24">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/lobby/:code" element={<LobbyView />} />
              <Route path="/game/:code" element={<GameView />} />
              <Route path="/results/:code" element={<ResultsView />} />
              <Route path="*" element={<HomeView />} />
            </Routes>
          </div>
        </Layout>
      </GameProvider>
    </BrowserRouter>
  );
}
