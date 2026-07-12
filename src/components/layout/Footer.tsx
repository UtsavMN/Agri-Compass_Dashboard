import { motion } from "framer-motion";

export const Footer = () => (
  <footer className="border-t border-[#2A2720] bg-[#0A0900] py-12 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#E5D08F]/12 border border-[#E5D08F]/25 rounded-lg
                          flex items-center justify-center text-sm">
            🌾
          </div>
          <span className="text-[#E5D08F] font-semibold font-mono text-sm tracking-[0.3em]">
            AGRI COMPASS
          </span>
        </div>

        {/* Centre */}
        <div className="text-center">
          <p className="text-[#F5F0E8]/22 text-xs font-mono">
            Built with React · Spring Boot · Three.js · Gemini AI
          </p>
          <p className="text-[#F5F0E8]/15 text-xs font-mono mt-1">
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
              whileHover={{ color: "#E5D08F" }}
              className="text-[#F5F0E8]/25 text-xs font-mono transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
