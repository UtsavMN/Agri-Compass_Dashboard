import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const AmbientAudio = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };
    
    window.addEventListener("click", handleInteraction);
    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction);
    
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (!hasInteracted || isPlaying) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Master volume control
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.001; // Start almost silent
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

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

  return (
    <AnimatePresence>
      {!hasInteracted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="px-4 py-2 bg-[#1A0F05]/80 backdrop-blur-md border border-[#D4AF37]/20 rounded-full">
            <p className="text-[#F5F0E8]/50 text-xs font-mono tracking-[0.2em] uppercase">
              Click anywhere for cinematic audio
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
