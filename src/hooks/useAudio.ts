import { create } from 'zustand';
import { audio } from '../utils/audioEngine';

interface AudioState {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playGlass: () => void;
  playTransition: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  isMuted: true,
  toggleMute: () => {
    set((state) => {
      const newMuted = !state.isMuted;
      if (newMuted) {
        audio.stopAmbience();
      } else {
        audio.startAmbience();
      }
      return { isMuted: newMuted };
    });
  },
  playClick: () => {
    if (!get().isMuted) audio.playClick();
  },
  playGlass: () => {
    if (!get().isMuted) audio.playGlass();
  },
  playTransition: () => {
    if (!get().isMuted) audio.playTransition();
  },
}));
