import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SpeakerWaveIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

const SpeakerXMarkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 19.25L6.75 8.75m10.5 0L6.75 19.25M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const AmbientAudio = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      // Play synchronously on first tap to satisfy mobile browser policies
      if (audioRef.current && !isMuted) {
        audioRef.current.volume = 0.5;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.log("Audio play prevented:", e));
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasInteracted, isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
      }
    } else {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      if (audioRef.current) {
        if (nextMuted) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
        }
      }
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src="https://cdn.freesound.org/previews/515/515234_11100366-lq.mp3" 
        loop 
      />
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div className="px-4 py-2 bg-[#1A0F05]/80 backdrop-blur-md border border-[var(--color-knowledge-gold)]/30 rounded-full shadow-lg">
              <p className="text-[var(--color-text-primary)] text-xs font-mono tracking-[0.2em] uppercase opacity-80">
                Click anywhere for audio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Audio Toggle Button */}
      <button 
        onClick={toggleMute}
        className="fixed bottom-6 left-6 z-[100] w-12 h-12 flex items-center justify-center rounded-full bg-black/40 border border-[var(--color-glass-border,rgba(255,255,255,0.06))] backdrop-blur-md text-[var(--color-knowledge-gold)] hover:bg-white/10 transition-all group"
        aria-label="Toggle Audio"
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="w-5 h-5 opacity-50 group-hover:opacity-100" />
        ) : (
          <SpeakerWaveIcon className="w-5 h-5 opacity-80 group-hover:opacity-100" />
        )}
      </button>
    </>
  );
};
