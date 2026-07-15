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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };
    
    // Scroll does NOT unlock Web Audio API in modern browsers. Only explicit user gestures.
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (!hasInteracted || isPlaying) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      
      // If the browser suspended it, resume it
      if (ctx.state === 'suspended') {
         ctx.resume();
      }

      // Master volume control
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.001; // Start almost silent
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Drone base (Deep rumble)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = 43.65; // F1
      
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = 65.41; // C2
      
      // Subtle organic texture
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.1; // Very slow modulation

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 2; // modulation depth
      lfo.connect(lfoGain);
      lfoGain.connect(osc2.frequency);

      // Lowpass filter to muffle it and make it cinematic
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 200;
      filter.Q.value = 1;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();
      lfo.start();

      // Fade in over 10 seconds
      masterGain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 10);
      setIsPlaying(true);
      
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
    
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [hasInteracted, isPlaying]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger other click handlers
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    if (audioCtxRef.current && masterGainRef.current) {
      const ctx = audioCtxRef.current;
      const gain = masterGainRef.current;
      if (isMuted) {
         if (ctx.state === 'suspended') ctx.resume();
         gain.gain.setTargetAtTime(0.15, ctx.currentTime, 0.5);
         setIsMuted(false);
      } else {
         gain.gain.setTargetAtTime(0.001, ctx.currentTime, 0.5);
         setIsMuted(true);
      }
    } else {
       // If clicked before initialized, it will initialize muted
       setIsMuted(!isMuted);
    }
  };

  return (
    <>
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
