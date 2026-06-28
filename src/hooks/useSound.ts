import { useCallback } from 'react';
import { useSoundSettings } from '../contexts/SoundContext';

const SOUNDS = {
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-click-release-1006.mp3',
  join: 'https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3',
  correct: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chime-2253.mp3',
  incorrect: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
  start: 'https://assets.mixkit.co/sfx/preview/mixkit-game-show-suspense-waiting-667.mp3',
  // New State Sounds
  perfect: 'https://assets.mixkit.co/sfx/preview/mixkit-bright-clinks-level-up-2144.mp3',
  good: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-message-612.mp3',
  bad: 'https://assets.mixkit.co/sfx/preview/mixkit-explainer-video-game-over-1942.mp3',
  miss: 'https://assets.mixkit.co/sfx/preview/mixkit-no-hope-metal-fail-hit-2873.mp3'
};

export function useSound() {
  const { isSoundEnabled } = useSoundSettings();

  const playSound = useCallback((soundName: keyof typeof SOUNDS) => {
    if (!isSoundEnabled) return;
    
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play blocked or failed:', err));
  }, [isSoundEnabled]);

  return { playSound };
}
