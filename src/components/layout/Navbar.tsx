import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0900]/90 backdrop-blur-xl border-b border-[#2A2720]"
          : "bg-transparent"
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#C9A84C]/15 border border-[#C9A84C]/30 rounded-lg flex items-center justify-center text-sm" aria-hidden="true">
            🌾
          </div>
          <span className="text-[#C9A84C] font-semibold font-mono text-sm tracking-wider">
            AGRI COMPASS
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "Engineering", href: "#engineering" },
            { label: "Team", href: "#team" },
            { label: "Vision", href: "#vision" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[#F5F0E8]/40 text-sm hover:text-[#F5F0E8] transition-colors font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0900] rounded"
              aria-label={`Navigate to ${item.label} section`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <motion.a
          href="https://agri-compass-v3.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(201,168,76,0.3)" }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 bg-[#C9A84C] text-[#0A0900] text-sm font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0900]"
          aria-label="Open live application in a new tab"
        >
          Open App →
        </motion.a>
      </div>
    </motion.nav>
  );
};
