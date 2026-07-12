import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { useAudio } from "../../hooks/useAudio";

const quickCommands = [
  { kn: "ಬೆಳಗಳ ಪಟ್ಟಿ ತೋರಿಸು",   en: "Crops Page",        icon: "🌾" },
  { kn: "ಹವಾಮಾನ ವರದಿ ತೋರಿಸು",    en: "Weather Details",   icon: "🌦" },
  { kn: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",      en: "Market Prices",     icon: "📈" },
  { kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",       en: "Gov Schemes",       icon: "🏛" },
  { kn: "ನನ್ನ ಜಮೀನು",             en: "My Farm Page",      icon: "🌱" },
  { kn: "ಕೃಷಿ ಮಿತ್ರ ಸಹಾಯ",        en: "Open AI Assistant", icon: "🤖" },
];

export const VoiceSection = () => {
  const [pulsing, setPulsing] = useState(false);
  const [activeCommand, setActiveCommand] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { playClick, playGlass } = useAudio();

  const handleMicClick = () => {
    playClick();
    setPulsing(true);
    // Cycle through commands as demo
    let i = 0;
    const interval = setInterval(() => {
      playGlass();
      setActiveCommand(i % quickCommands.length);
      i++;
      if (i > quickCommands.length) {
        clearInterval(interval);
        setPulsing(false);
        setActiveCommand(null);
      }
    }, 900);
  };

  return (
    <section ref={ref} className="py-32 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}
        >
          <p className="text-[#E5D08F] text-xs tracking-[0.3em] uppercase font-mono mb-4">
            Designed for India First
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F5F0E8] mb-4">
            Speak in Kannada.<br />
            <span className="text-[#E5D08F]">Navigate everything.</span>
          </h2>
          <p className="text-[#F5F0E8]/30 max-w-2xl mx-auto">
            Typing is a barrier for many farmers. AgriCompass removes it with
            full Kannada voice navigation. Speak naturally — the platform
            understands, responds, and takes you exactly where you need to go.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Voice UI Mock */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={LAYOUT_SPRING}
        >
          <div className="premium-card overflow-hidden p-0 w-full">
            {/* Modal header */}
            <div className="bg-[#191610] border-b border-[#2A2720] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E5D08F]/15 rounded-lg flex items-center justify-center text-base">
                  🎙
                </div>
                <div>
                  <p className="text-[#F5F0E8] text-sm font-semibold font-serif">ಧ್ವನಿ ಆಜ್ಞೆಗಳು</p>
                  <p className="text-[#F5F0E8]/30 text-xs font-mono">ಮಾತನಾಡಿ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಿ</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-[#E5D08F] text-[#0A0900] font-semibold px-2.5 py-1 rounded-md font-mono">
                  ಕನ್ನಡ
                </span>
                <span className="text-xs border border-[#2A2720] text-[#F5F0E8]/30 px-2.5 py-1 rounded-md font-mono">
                  EN
                </span>
              </div>
            </div>

            {/* Mic area */}
            <div className="px-8 py-10 text-center">
              <motion.button
                onClick={handleMicClick}
                onHoverStart={playGlass}
                whileHover={{ scale: 1.06 }}
                aria-label="Activate voice assistant"
                whileTap={{ scale: 0.94 }}
                animate={pulsing ? {
                  boxShadow: [
                    "0 0 0 0 rgba(201,168,76,0.5)",
                    "0 0 0 24px rgba(201,168,76,0)",
                    "0 0 0 0 rgba(201,168,76,0)",
                  ],
                } : {}}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="w-22 h-22 bg-[#E5D08F] rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  width: 88, height: 88,
                  boxShadow: pulsing
                    ? "0 0 50px rgba(201,168,76,0.5)"
                    : "0 0 24px rgba(201,168,76,0.18)",
                }}
              >
                <span className="text-4xl select-none">🎙</span>
              </motion.button>

              {/* Sound wave bars */}
              <div className="flex items-end justify-center gap-1 h-9 mb-5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={pulsing ? {
                      height: [4, Math.random() * 30 + 6, 4],
                    } : { height: 4 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.3 + Math.random() * 0.2,
                      delay: i * 0.035,
                    }}
                    className="w-1.5 bg-[#E5D08F] rounded-full"
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeCommand !== null ? (
                  <motion.div
                    key={activeCommand}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-center"
                  >
                    <p className="text-[#E5D08F] text-base font-serif mb-1">
                      {quickCommands[activeCommand].kn}
                    </p>
                    <p className="text-[#F5F0E8]/30 text-xs font-mono">
                      → navigating to {quickCommands[activeCommand].en}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-[#F5F0E8]/45 text-sm font-serif mb-1">
                      {pulsing ? "ನಿಮ್ಮ ಧ್ವನಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ..." : "Tap mic to demo"}
                    </p>
                    <p className="text-[#F5F0E8]/20 text-xs font-mono">
                      ಉದಾಹರಣೆ: "ಬೆಳೆಗಳ ಪಟ್ಟಿ ತೋರಿಸು"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick command grid */}
            <div className="px-6 pb-6 grid grid-cols-2 gap-2">
              {quickCommands.map((cmd, i) => (
                <motion.div
                  key={i}
                  animate={activeCommand === i ? {
                    borderColor: "rgba(201,168,76,0.5)",
                    backgroundColor: "rgba(201,168,76,0.08)",
                  } : {
                    borderColor: "#2A2720",
                    backgroundColor: "#191610",
                  }}
                  className="border rounded-lg p-3 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{cmd.icon}</span>
                    <p className="text-[#F5F0E8]/65 text-xs font-serif truncate">{cmd.kn}</p>
                  </div>
                  <p className="text-[#F5F0E8]/22 text-[10px] font-mono uppercase tracking-[0.3em] pl-5">
                    {cmd.en}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Explanation side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ ...LAYOUT_SPRING, delay: 0.2 }}
        >

          <div className="space-y-4 mb-10">
            {[
              { icon: "📱", text: "Works on any Android phone — no special hardware required" },
              { icon: "🗣", text: "Supports both Kannada (kn-IN) and English speech recognition" },
              { icon: "🧠", text: "Natural language understanding — not just rigid commands" },
              { icon: "⚡", text: "Instant navigation to any feature by voice" },
            ].map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ ...LAYOUT_SPRING, delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-lg flex-shrink-0">{point.icon}</span>
                <p className="text-[#F5F0E8]/40 text-sm leading-relaxed">{point.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-transparent border border-[#2A2720] rounded-xl p-5">
            <p className="text-[#E5D08F] text-xs font-mono uppercase tracking-[0.3em] mb-2">
              Technical Implementation
            </p>
            <p className="text-[#F5F0E8]/30 text-sm leading-relaxed">
              Built using the Web Speech API with <code className="text-[#E5D08F] text-xs">kn-IN</code> locale.
              Intent detection via Groq LLaMA3 returns navigation JSON or Kannada text responses.
              Speech synthesis uses <code className="text-[#E5D08F] text-xs">SpeechSynthesisUtterance</code> with Kannada voice.
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
};
