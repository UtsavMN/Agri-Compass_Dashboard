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
          ? "bg-[#0A0900]/95 backdrop-blur-xl border-b border-[#2A2720]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Brand — left */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-[#E5D08F]/15 border border-[#E5D08F]/30 rounded-lg
                          flex items-center justify-center text-sm flex-shrink-0">
            🌾
          </div>
          <span className="text-[#E5D08F] font-semibold font-mono text-sm tracking-[0.3em]">
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
              className="text-[#F5F0E8]/45 text-sm font-mono hover:text-[#F5F0E8]/80 transition-colors"
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
            className="text-[#F5F0E8]/50 hover:text-[#E5D08F] transition-colors"
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? "🔇" : "🔊"}
          </motion.button>
          
          <motion.a
            href="https://agri-compass-v3.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 px-5 py-2 bg-[#E5D08F] text-[#0A0900] text-xs font-semibold
                       font-mono rounded-lg transition-all uppercase tracking-[0.3em]"
          >
            Open App →
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
};
