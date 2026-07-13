import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { useAudio } from "../../hooks/useAudio";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isMuted, toggleMute, playClick } = useAudio();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...LAYOUT_SPRING, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-earth-black)]/95 backdrop-blur-xl border-b border-[var(--color-glass-border,rgba(255,255,255,0.06))]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Brand — left */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-[var(--color-knowledge-gold)]/15 border border-[var(--color-knowledge-gold)]/30 rounded-lg
                          flex items-center justify-center text-sm flex-shrink-0">
            🌾
          </div>
          <span className="text-[var(--color-knowledge-gold)] font-semibold font-mono text-sm tracking-[0.3em]">
            AGRI COMPASS
          </span>
        </a>

        {/* Nav links — centre, equal spacing */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {[
            { label: "Features",    href: "#features" },
            { label: "Engineering", href: "#engineering" },
            { label: "Team",        href: "#team" },
            { label: "Vision",      href: "#vision" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[var(--color-text-tertiary)] text-sm font-mono hover:text-[var(--color-text-secondary)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA & Audio Toggle — right */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => {
              playClick();
              toggleMute();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-knowledge-gold)] transition-colors hidden md:block"
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? "🔇" : "🔊"}
          </motion.button>
          
          <motion.a
            href="https://github.com/UtsavMN/Agri-Compass_Dashboard"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-[var(--color-text-tertiary)] hover:text-white transition-colors"
            title="GitHub Repository"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </motion.a>

          <motion.a
            href="https://agri-compass-v3.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 px-4 py-1.5 md:px-5 md:py-2 bg-[var(--color-knowledge-gold)] text-[var(--color-earth-black)] text-[10px] md:text-xs font-semibold
                       font-mono rounded-lg transition-all uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(229,208,143,0.3)] hover:scale-105 active:scale-95"
          >
            Live Demo →
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
};
