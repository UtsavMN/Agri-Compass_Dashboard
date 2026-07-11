import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const FlowNode = ({
  label, icon, color = "#C9A84C", delay = 0, active = false, onClick,
}: {
  label: string; icon: string; color?: string;
  delay?: number; active?: boolean; onClick?: () => void;
}) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    onClick={onClick}
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.96 }}
    className={`relative flex flex-col items-center gap-2 cursor-pointer group`}
  >
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
        active ? "scale-110" : ""
      }`}
      style={{
        background: active ? `${color}25` : "#191610",
        border: `1.5px solid ${active ? color : "#2A2720"}`,
        boxShadow: active ? `0 0 20px ${color}35` : "none",
      }}
    >
      {icon}
    </div>
    <span className="text-xs font-mono text-[#F5F0E8]/45 group-hover:text-[#F5F0E8]/75 transition-colors whitespace-nowrap">
      {label}
    </span>
  </motion.button>
);

const FlowArrow = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    className="flex flex-col items-center gap-1 mx-1"
  >
    <motion.div
      animate={{ height: ["0%", "100%"] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: "linear", delay }}
      className="w-px bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent"
      style={{ height: 32 }}
    />
    <motion.div
      animate={{ y: [0, 4, 0] }}
      transition={{ repeat: Infinity, duration: 1.2, delay }}
      className="text-[#C9A84C]/60 text-xs"
    >
      ↓
    </motion.div>
  </motion.div>
);

const DataPacket = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    animate={{ y: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
    transition={{ repeat: Infinity, duration: 2.5, delay, ease: "linear" }}
    className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[#C9A84C] rounded-full z-10"
    style={{ boxShadow: "0 0 8px #C9A84C" }}
  />
);

export const EngineeringLabSection = () => {
  const [activeNode, setActiveNode] = useState<number | null>(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const architecture = [
    { id: 0, label: "React Frontend", icon: "⚛️", color: "#61DAFB", desc: "Vite + React + Tailwind + Zustand. Highly optimized bundle size for slow 3G networks." },
    { id: 1, label: "Java Spring Boot", icon: "🍃", color: "#6DB33F", desc: "Robust Java 17 backend. Handles complex auth flows, data processing, and API orchestration." },
    { id: 2, label: "PostgreSQL", icon: "🐘", color: "#336791", desc: "Relational database mapping users to farms, crops, and historical soil tests." },
    { id: 3, label: "Gemini AI", icon: "🧠", color: "#C9A84C", desc: "Google Gemini context-injection. Translates crop data into actionable Kannada voice prompts." }
  ];

  return (
    <section id="engineering" ref={ref} className="py-32 px-6 bg-[#080706] border-y border-[#2A2720]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
          className="text-center mb-20"
        >
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-mono mb-4">
            System Architecture
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#F5F0E8] mb-4">
            Engineering <span className="text-[#C9A84C]">Lab</span>
          </h2>
          <p className="text-[#F5F0E8]/30 max-w-xl mx-auto">
            Built for scale, reliability, and low latency. The engine behind the intelligence.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-16 items-start justify-center">
          {/* Architecture Flow */}
          <div className="flex flex-col items-center">
            {architecture.map((node, i) => (
              <div key={node.id} className="relative flex flex-col items-center">
                <FlowNode 
                  label={node.label} 
                  icon={node.icon} 
                  color={node.color} 
                  delay={0.2 * i} 
                  active={activeNode === node.id}
                  onClick={() => setActiveNode(node.id)}
                />
                {i < architecture.length - 1 && (
                  <div className="relative">
                    <FlowArrow delay={0.2 * i + 0.1} />
                    <DataPacket delay={0.2 * i} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Details Panel */}
          <div className="flex-1 max-w-lg bg-[#111008] border border-[#2A2720] rounded-2xl p-8 relative overflow-hidden" style={{ minHeight: "320px" }}>
            <AnimatePresence mode="wait">
              {activeNode !== null && (
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-5xl mb-6">{architecture[activeNode].icon}</div>
                  <h3 className="font-serif text-3xl text-[#F5F0E8] mb-4">
                    {architecture[activeNode].label}
                  </h3>
                  <p className="text-[#F5F0E8]/50 text-lg leading-relaxed">
                    {architecture[activeNode].desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tech grid background pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                 style={{ backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>
        </div>
      </div>
    </section>
  );
};
