export const Footer = () => (
  <footer className="bg-[#080706] border-t border-[#2A2720] py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#C9A84C]/15 border border-[#C9A84C]/30 rounded-lg flex items-center justify-center text-sm">
          🌾
        </div>
        <span className="text-[#C9A84C] font-semibold font-mono tracking-widest text-sm">
          AGRI COMPASS
        </span>
      </div>
      
      <p className="text-[#F5F0E8]/30 text-xs font-mono text-center md:text-left">
        Built for the farmers of Karnataka. Designed by passionate engineers.
      </p>
      
      <div className="flex gap-6">
        <a href="https://agri-compass-v3.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#F5F0E8]/40 hover:text-[#C9A84C] text-sm font-mono transition-colors">
          Live App
        </a>
        <a href="https://github.com/UtsavMN/Agri-compass_v3.git" target="_blank" rel="noopener noreferrer" className="text-[#F5F0E8]/40 hover:text-[#C9A84C] text-sm font-mono transition-colors">
          GitHub
        </a>
      </div>
    </div>
  </footer>
);
