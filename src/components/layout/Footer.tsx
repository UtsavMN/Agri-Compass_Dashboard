import { motion } from "framer-motion";

export const Footer = () => (
  <footer className="border-t border-[var(--color-glass-border,rgba(255,255,255,0.06))] bg-[var(--color-earth-black)] py-12 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[var(--color-knowledge-gold)]/12 border border-[var(--color-knowledge-gold)]/25 rounded-lg
                          flex items-center justify-center text-sm">
            🌾
          </div>
          <span className="text-[var(--color-knowledge-gold)] font-semibold font-mono text-sm tracking-[0.3em]">
            AGRI COMPASS
          </span>
        </div>

        {/* Centre */}
        <div className="text-center">
          <p className="text-[var(--color-text-muted)] text-xs font-mono">
            Built with React · Spring Boot · Three.js · Gemini AI
          </p>
          <p className="text-[var(--color-text-tertiary)] opacity-50 text-xs font-mono mt-1">
            © 2025 AgriCompass · Empowering Karnataka's Farmers
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-5">
          {[
            { label: "Live App", href: "https://agri-compass-v3.vercel.app" },
            { label: "GitHub", href: "https://github.com/UtsavMN/Agri-compass_v3" },
          ].map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ color: "var(--color-knowledge-gold)" }}
              className="text-[var(--color-text-muted)] text-xs font-mono transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
