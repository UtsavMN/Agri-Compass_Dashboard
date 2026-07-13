import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { useAudio } from "../../hooks/useAudio";
import { Typography } from "../primitives/Typography";
import { GlassPanel } from "../primitives/GlassPanel";
import { Button } from "../primitives/Button";
import { Container } from "../primitives/Container";

// ─── LOCATION DATA ────────────────────────────────────────────────────────────
const farmLocations = [
  {
    id:"greenhouse",
    icon:"🌱",
    name:"Smart Greenhouse",
    tagline:"Crop Recommendation Engine",
    color:"#7EC47E",
    description:"Enter your soil NPK values and watch the AI recommend the crop most likely to succeed on your land. Real-time confidence scoring.",
    interactive:"npk-sliders",
    keyFact:"92% recommendation accuracy for Karnataka soil types",
  },
  {
    id:"soillab",
    icon:"🧪",
    name:"Soil Intelligence Lab",
    tagline:"Fertilizer Optimization",
    color:"#E5D08F",
    description:"Visualise your soil health as a vitality score. Get exact fertilizer quantities — not estimates. Chemistry, not guesswork.",
    interactive:"soil-vitality",
    keyFact:"Calculates Urea, DAP and MOP quantities to the nearest 0.1 kg",
  },
  {
    id:"weatherstation",
    icon:"🌦",
    name:"Weather Station",
    tagline:"Hyper-local Forecasting",
    color:"#F5F0E8",
    description:"Live animated weather from OpenWeather. See how humidity, wind, and rain predictions translate into farming advisories.",
    interactive:"weather-cards",
    keyFact:"District-level forecasts for all 31 Karnataka districts",
  },
  {
    id:"market",
    icon:"🏪",
    name:"Digital Mandi",
    tagline:"Live Market Intelligence",
    color:"#6090E0",
    description:"Real-time APMC prices from Data.gov.in. Compare your crop's current price vs MSP. Interactive profitability charts.",
    interactive:"price-chart",
    keyFact:"Prices updated daily from official government mandi data",
  },
  {
    id:"aicentre",
    icon:"🤖",
    name:"AI Knowledge Centre",
    tagline:"Krishi Mitra — Gemini AI",
    color:"#E5D08F",
    description:"Ask any farming question in Kannada or English. Powered by Google Gemini with farm-specific context injected server-side.",
    interactive:"ai-chat",
    keyFact:"Responds in Kannada — personalised to your district and crop",
  },
  {
    id:"voicetower",
    icon:"🎤",
    name:"Voice Navigation Tower",
    tagline:"Kannada Voice Commands",
    color:"#E0C060",
    description:"No typing needed. Speak naturally in Kannada. The app understands, responds, and navigates — on any Android phone.",
    interactive:"voice-wave",
    keyFact:"9 navigation destinations accessible entirely by voice",
  },
  {
    id:"community",
    icon:"🏡",
    name:"Farmer Community Hub",
    tagline:"Kisan Feed & Direct Messages",
    color:"#7EC47E",
    description:"A real social platform. Share knowledge. Follow farmers in your district. Chat in real-time via WebSocket messaging.",
    interactive:"community-feed",
    keyFact:"Real-time feed with follow priority — your network first",
  },
  {
    id:"library",
    icon:"📚",
    name:"Knowledge Library",
    tagline:"Step-by-Step Cultivation Guides",
    color:"#E5D08F",
    description:"Detailed crop guides covering land preparation, sowing, irrigation, fertilizer schedules, pest control, and harvesting.",
    interactive:"crop-timeline",
    keyFact:"30+ Karnataka crops with ICAR-aligned cultivation guides",
  },
];

// ─── NPK SLIDER INTERACTIVE ──────────────────────────────────────────────────
const NPKInteractive = () => {
  const [npk, setNpk] = useState({ n: 45, p: 30, k: 25 });

  const getRecommendation = () => {
    if (npk.n > 60) return { crop:"Maize", score: 94, reason:"High nitrogen suits maize perfectly" };
    if (npk.p > 50) return { crop:"Sugarcane", score: 91, reason:"High phosphorus supports root growth" };
    if (npk.k > 40) return { crop:"Cotton", score: 89, reason:"High potassium strengthens cotton fibres" };
    if (npk.n < 30) return { crop:"Groundnut", score: 87, reason:"Groundnut fixes its own nitrogen" };
    return { crop:"Ragi", score: 92, reason:"Balanced NPK — ideal for Karnataka's hardy millet" };
  };

  const rec = getRecommendation();

  return (
    <div className="space-y-6">
      {[
        { key:"n" as const, label:"Nitrogen (N)", color:"#7EC47E" },
        { key:"p" as const, label:"Phosphorus (P)", color:"#E5D08F" },
        { key:"k" as const, label:"Potassium (K)", color:"#6090E0" },
      ].map(({ key, label, color }) => (
        <div key={key}>
          <div className="flex justify-between mb-1.5">
            <Typography variant="micro" color="secondary">{label}</Typography>
            <Typography variant="micro" style={{ color }}>{npk[key]} kg/acre</Typography>
          </div>
          <input
            type="range" min={10} max={100} value={npk[key]}
            onChange={(e) => setNpk((prev) => ({ ...prev, [key]: +e.target.value }))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${color} ${npk[key]}%, var(--color-earth-black) ${npk[key]}%)` }}
            aria-label={`Adjust ${label}`}
          />
        </div>
      ))}

      <GlassPanel
        as={motion.div}
        key={rec.crop}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 mt-2"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between mb-2">
          <Typography variant="body-md" color="primary" className="font-semibold">Recommended: {rec.crop}</Typography>
          <Typography variant="micro" className="text-[var(--color-growth-green)] font-bold">{rec.score}%</Typography>
        </div>
        <div className="w-full h-1 bg-[var(--color-earth-black)] rounded-full mb-2">
          <motion.div
            className="h-full bg-[var(--color-growth-green)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${rec.score}%` }}
            transition={LAYOUT_SPRING}
          />
        </div>
        <Typography variant="caption" color="muted">{rec.reason}</Typography>
      </GlassPanel>
    </div>
  );
};

// ─── SOIL VITALITY INTERACTIVE ────────────────────────────────────────────────
const SoilVitalityInteractive = () => {
  const [score] = useState(90);
  const deficits = [
    { nutrient:"Nitrogen", deficit: 29, product:"Urea", qty:"21.7 kg", color:"#7EC47E" },
    { nutrient:"Phosphorus", deficit: 9, product:"DAP", qty:"8.1 kg", color:"#E5D08F" },
    { nutrient:"Potassium", deficit: 9, product:"MOP", qty:"6.2 kg", color:"#6090E0" },
  ];

  return (
    <div className="space-y-4">
      {/* Vitality circle */}
      <div className="flex items-center gap-6">
        <div className="relative w-20 h-20 flex-shrink-0" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label="Soil Health Vitality">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="40" cy="40" r="30" fill="none" stroke="var(--color-earth-black)" strokeWidth="6" />
            <motion.circle
              cx="40" cy="40" r="30"
              fill="none" stroke="var(--color-knowledge-gold)" strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 30}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - score / 100) }}
              transition={LAYOUT_SPRING}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Typography variant="body-lg" color="gold" className="font-semibold font-mono">{score}</Typography>
          </div>
        </div>
        <div>
          <Typography variant="caption" className="font-semibold block" color="secondary">Soil Health Vitality</Typography>
          <Typography variant="micro" className="text-[var(--color-growth-green)]">Good Condition — 72% Balance</Typography>
        </div>
      </div>

      {/* Deficits + recommendations */}
      {deficits.map((d, i) => (
        <GlassPanel
          as={motion.div}
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
          className="p-3"
        >
          <div className="flex justify-between items-center mb-1.5">
            <Typography variant="micro" color="secondary">{d.nutrient} deficit: {d.deficit} kg/acre</Typography>
            <span className="text-xs font-mono font-bold" style={{ color: d.color }}>{d.qty}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <Typography variant="caption" className="!text-[10px]" color="muted">{d.product} recommended</Typography>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
};

// ─── AI CHAT DEMO ─────────────────────────────────────────────────────────────
const demoConversations = [
  {
    question: "ರಾಗಿ ಬೆಳೆಗೆ ಎಷ್ಟು ನೀರು ಬೇಕು?",
    questionEn: "How much water does Ragi need?",
    answer: "ರಾಗಿ ಬೆಳೆಗೆ ಮಳೆ ಆಶ್ರಿತ ಕೃಷಿಗೆ 450–600 mm ನೀರು ಸಾಕು. ಮೊದಲ 4 ವಾರ ನೆಲ ಒದ್ದೆ ಇರಲಿ. ಹೂ ಬಿಡುವಾಗ ನೀರಿನ ಕೊರತೆ ಆಗದಂತೆ ಗಮನಿಸಿ.",
    answerEn: "Ragi needs 450–600mm for rainfed cultivation. Keep soil moist for the first 4 weeks. Never let water stress occur during flowering.",
    evidence: "Based on ICAR Ragi Cultivation Guidelines & your local soil moisture sensor readings."
  },
  {
    question: "ಹತ್ತಿ ಬೆಲೆ ಯಾವಾಗ ಹೆಚ್ಚಾಗುತ್ತದೆ?",
    questionEn: "When do cotton prices peak?",
    answer: "ಹತ್ತಿ ಬೆಲೆ ಸಾಮಾನ್ಯವಾಗಿ ಡಿಸೆಂಬರ್-ಜನವರಿಯಲ್ಲಿ ಹೆಚ್ಚಾಗುತ್ತದೆ. ಕಡಿಮೆ ಆವಕ ಮತ್ತು ಹೆಚ್ಚು ಬೇಡಿಕೆ ಕಾರಣ. Market Prices ಪುಟದಲ್ಲಿ ಪ್ರತಿದಿನ ಮಂಡಿ ಬೆಲೆ ನೋಡಿ.",
    answerEn: "Cotton prices typically peak Dec–Jan due to lower supply and higher demand. Check the Market Prices page daily for live mandi rates.",
    evidence: "Derived from 5-year historical APMC data for Shivamogga Mandi."
  },
  {
    question: "PM-KISAN ಗೆ ಅರ್ಜಿ ಹೇಗೆ ಹಾಕಬೇಕು?",
    questionEn: "How do I apply for PM-KISAN?",
    answer: "PM-KISAN ಅಡಿಯಲ್ಲಿ ₹6,000/ವರ್ಷ ಸಿಗುತ್ತದೆ. ಅರ್ಜಿ ಹಾಕಲು: ಹತ್ತಿರದ ಕೃಷಿ ಕಚೇರಿ ಅಥವಾ CSC ಕೇಂದ್ರಕ್ಕೆ ಹೋಗಿ. Aadhaar ಮತ್ತು ಭೂ ದಾಖಲೆ ತೆಗೆದುಕೊಂಡು ಹೋಗಿ. Gov Schemes ಪುಟದಲ್ಲಿ ಹೆಚ್ಚಿನ ವಿವರ ನೋಡಿ.",
    answerEn: "PM-KISAN gives ₹6,000/year. Apply at your nearest agriculture office or CSC centre. Bring Aadhaar and land records. Check Gov Schemes page for details.",
    evidence: "Verified via pmkisan.gov.in official portal API."
  },
];

const AIChatDemo = () => {
  const [activeQ, setActiveQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [typing, setTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [displayedTextEn, setDisplayedTextEn] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleQuestion = (i: number) => {
    setActiveQ(i);
    setShowAnswer(false);
    setDisplayedText("");
    setDisplayedTextEn("");
    setShowFollowUp(false);
    setTyping(true);
    setTimeout(() => { setTyping(false); setShowAnswer(true); }, 1200);
  };

  useEffect(() => {
    if (!showAnswer) return;
    
    const fullKn = demoConversations[activeQ].answer;
    const fullEn = demoConversations[activeQ].answerEn;
    let knIndex = 0;
    let enIndex = 0;
    
    const intervalKn = setInterval(() => {
      setDisplayedText(fullKn.slice(0, knIndex));
      knIndex++;
      if (knIndex > fullKn.length) {
        clearInterval(intervalKn);
        const intervalEn = setInterval(() => {
          setDisplayedTextEn(fullEn.slice(0, enIndex));
          enIndex++;
          if (enIndex > fullEn.length) {
            clearInterval(intervalEn);
            setTimeout(() => setShowFollowUp(true), 400);
          }
        }, 15);
      }
    }, 30);
    
    return () => { clearInterval(intervalKn); };
  }, [showAnswer, activeQ]);

  return (
    <div className="space-y-4">
      {/* Question buttons */}
      <div className="space-y-2">
        <Typography variant="micro" color="muted" className="uppercase tracking-[0.3em] mb-3 block">
          Sample questions — click to ask
        </Typography>
        {demoConversations.map((conv, i) => (
          <motion.button
            key={i}
            onClick={() => handleQuestion(i)}
            disabled={typing || (showAnswer && !showFollowUp)}
            whileHover={{ borderColor: "rgba(201,168,76,0.4)" }}
            aria-label={`Ask AI: ${conv.questionEn}`}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-knowledge-gold)] ${
              activeQ === i
                ? "border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.08)]"
                : "border-[var(--color-glass-border,rgba(255,255,255,0.06))] hover:bg-white/5"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Typography variant="caption" color="secondary" className="font-serif mb-0.5 block">{conv.question}</Typography>
            <Typography variant="caption" color="muted" className="!text-[10px] block">{conv.questionEn}</Typography>
          </motion.button>
        ))}
      </div>

      <GlassPanel className="p-4 min-h-[100px] flex flex-col" role="status" aria-live="polite">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-md flex items-center justify-center text-xs" aria-hidden="true">🤖</div>
          <Typography variant="micro" color="gold">Krishi Mitra AI</Typography>
          {typing && (
            <div className="flex gap-1 ml-2" aria-label="Krishi Mitra is typing" aria-busy="true">
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  className="w-1 h-1 rounded-full bg-[var(--color-knowledge-gold)]"
                />
              ))}
            </div>
          )}
        </div>
        <AnimatePresence mode="wait">
          {showAnswer && (
            <motion.div key={activeQ}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={LAYOUT_SPRING}
              className="flex-1 flex flex-col"
            >
              <Typography variant="caption" color="secondary" className="font-serif leading-relaxed mb-2 block">
                {displayedText}
                {displayedText.length < demoConversations[activeQ].answer.length && (
                  <span className="inline-block w-1.5 h-3 ml-1 bg-[var(--color-knowledge-gold)] animate-pulse" />
                )}
              </Typography>
              <Typography variant="caption" color="muted" className="!text-[10px] leading-relaxed italic mb-4 block">
                {displayedTextEn}
                {displayedText.length === demoConversations[activeQ].answer.length && displayedTextEn.length < demoConversations[activeQ].answerEn.length && (
                  <span className="inline-block w-1.5 h-3 ml-1 bg-[var(--color-knowledge-gold)] animate-pulse" />
                )}
              </Typography>
              
              {showFollowUp && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-3 border-t border-[var(--color-glass-border,rgba(255,255,255,0.06))]"
                >
                  <div className="flex items-start gap-2 mb-4 p-2.5 rounded bg-[var(--color-earth-black)]/50 border border-[var(--color-glass-border,rgba(255,255,255,0.06))]">
                    <span className="text-[10px] bg-[var(--color-knowledge-gold)]/10 text-[var(--color-knowledge-gold)] px-1.5 py-0.5 rounded font-mono uppercase tracking-widest mt-0.5">Evidence</span>
                    <Typography variant="caption" color="muted" className="!text-[10px] italic">{demoConversations[activeQ].evidence}</Typography>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Typography variant="micro" color="muted" className="uppercase tracking-[0.2em] w-full mb-1 block !text-[9px]">Suggested Follow-ups</Typography>
                    <button className="px-3 py-1.5 rounded-full border border-[var(--color-knowledge-gold)]/20 text-[var(--color-text-muted)] text-xs hover:bg-[var(--color-knowledge-gold)]/10 hover:text-[var(--color-knowledge-gold)] hover:border-[var(--color-knowledge-gold)]/40 transition-all font-serif">
                      ಹೆಚ್ಚಿನ ವಿವರ ಕೊಡಿ (Give more details)
                    </button>
                    <button className="px-3 py-1.5 rounded-full border border-[var(--color-knowledge-gold)]/20 text-[var(--color-text-muted)] text-xs hover:bg-[var(--color-knowledge-gold)]/10 hover:text-[var(--color-knowledge-gold)] hover:border-[var(--color-knowledge-gold)]/40 transition-all font-serif">
                      ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆ ಎಲ್ಲಿದೆ? (Nearest market?)
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          {!showAnswer && !typing && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Typography variant="caption" color="muted" className="!text-[10px] block">
                Click a question above to see Krishi Mitra respond in Kannada
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>
    </div>
  );
};

// ─── COMMUNITY FEED DEMO ──────────────────────────────────────────────────────
const CommunityFeedDemo = () => {
  const posts = [
    { user:"Ravi Kumar", district:"Shivamogga", avatar:"R", time:"2h ago",
      content:"Ragi harvest looking excellent this season! Mandi price at ₹3,846/Q today.", likes: 12, comments: 4 },
    { user:"U S Aniruddha", district:"Dakshina Kannada", avatar:"A", time:"4h ago",
      content:"Cotton prices rising in Dharwad mandi. Holding stock for 2 more weeks.", likes: 8, comments: 2 },
    { user:"Naveena J K", district:"Hassan", avatar:"N", time:"6h ago",
      content:"Tried the NPK soil analysis tool — recommended sugarcane and yield was 20% higher!", likes: 24, comments: 7 },
  ];

  return (
    <div className="space-y-3">
      {posts.map((post, i) => (
        <GlassPanel
          as={motion.div}
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
          className="p-4"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-full border border-[var(--color-glass-border,rgba(255,255,255,0.06))] flex items-center justify-center text-xs font-semibold text-[var(--color-knowledge-gold)]" aria-hidden="true">
              {post.avatar}
            </div>
            <div>
              <Typography variant="caption" className="font-semibold block" color="secondary">{post.user}</Typography>
              <Typography variant="caption" className="!text-[10px] block" color="muted">📍 {post.district} · {post.time}</Typography>
            </div>
          </div>
          <Typography variant="caption" color="secondary" className="leading-relaxed mb-3 block">"{post.content}"</Typography>
          <div className="flex gap-4">
            <Typography variant="caption" className="!text-[10px]" color="muted">❤ {post.likes}</Typography>
            <Typography variant="caption" className="!text-[10px]" color="muted">💬 {post.comments}</Typography>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
};

// ─── CROP TIMELINE DEMO ───────────────────────────────────────────────────────
const CropTimelineDemo = () => {
  const stages = [
    { icon:"🌱", label:"Land Preparation", days:"Day 1-15", detail:"Plough 20-25cm deep. Apply FYM 5 tonnes/acre." },
    { icon:"🌾", label:"Sowing", days:"Day 16-20", detail:"Seed rate 4-5 kg/acre. Row spacing 22.5 cm." },
    { icon:"💧", label:"Irrigation", days:"Day 21-45", detail:"Light irrigation every 8-10 days. Avoid waterlogging." },
    { icon:"🧪", label:"Fertilizer", days:"Day 30-35", detail:"Top dress with 21.7 kg Urea/acre at tillering stage." },
    { icon:"🐛", label:"Pest Control", days:"Day 40-60", detail:"Monitor for shoot fly. Spray Chlorpyrifos if needed." },
    { icon:"🌟", label:"Harvest", days:"Day 95-110", detail:"Harvest when 80% grain hard. Expected 8-12 q/acre." },
  ];

  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-knowledge-gold)]/40 to-transparent" />
      <div className="space-y-3 pl-12">
        {stages.map((stage, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
            className="relative"
          >
            <div className="absolute -left-7 w-5 h-5 rounded-full bg-[var(--color-earth-black)] border border-[var(--color-glass-border,rgba(255,255,255,0.06))] flex items-center justify-center text-xs" aria-hidden="true">
              {stage.icon}
            </div>
            <GlassPanel className="px-3 py-2.5">
              <div className="flex items-center justify-between mb-0.5">
                <Typography variant="caption" className="font-semibold" color="secondary">{stage.label}</Typography>
                <Typography variant="caption" className="!text-[10px]" color="gold">{stage.days}</Typography>
              </div>
              <Typography variant="caption" color="muted" className="leading-relaxed block">{stage.detail}</Typography>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── WEATHER DEMO ─────────────────────────────────────────────────────────────
const WeatherDemo = () => {
  const days = [
    { day:"Today", icon:"⛅", temp:"28°", rain:"12%" },
    { day:"Fri", icon:"🌧", temp:"24°", rain:"78%" },
    { day:"Sat", icon:"🌧", temp:"22°", rain:"85%" },
    { day:"Sun", icon:"⛅", temp:"26°", rain:"30%" },
    { day:"Mon", icon:"☀", temp:"30°", rain:"5%" },
  ];

  return (
    <div className="space-y-4">
      <GlassPanel className="p-4">
        <Typography variant="micro" color="muted" className="uppercase tracking-[0.3em] mb-1 block">
          Current · Shivamogga
        </Typography>
        <Typography variant="heading-1" className="!text-3xl font-mono block">28°C</Typography>
        <Typography variant="caption" color="secondary" className="block">Partly Cloudy · Humidity 67%</Typography>
      </GlassPanel>

      <div className="grid grid-cols-5 gap-1.5">
        {days.map((d, i) => (
          <GlassPanel key={i} className="p-2 text-center">
            <Typography variant="caption" className="!text-[10px] block" color="muted">{d.day}</Typography>
            <p className="text-lg my-1" aria-hidden="true">{d.icon}</p>
            <Typography variant="caption" color="secondary" className="block font-mono">{d.temp}</Typography>
            <Typography variant="caption" color="muted" className="!text-[9px] block font-mono">{d.rain}</Typography>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel className="p-3">
        <Typography variant="micro" className="uppercase tracking-[0.3em] mb-1 block text-[var(--color-growth-green)]/60">
          AI Farming Advisory
        </Typography>
        <Typography variant="caption" color="muted" className="leading-relaxed block">
          ⚡ Heavy rain Friday–Saturday. Delay pesticide application by 3 days.
          Harvest window open Monday morning.
        </Typography>
      </GlassPanel>
    </div>
  );
};

// ─── PRICE CHART DEMO ─────────────────────────────────────────────────────────
const PriceChartDemo = () => {
  const crops = [
    { name:"Cotton", price: 6620, msp: 6080, trend:"+2.1%", color:"#E5D08F" },
    { name:"Ragi", price: 3846, msp: 3846, trend:"+0.8%", color:"#7EC47E" },
    { name:"Tomato", price: 1800, msp: 0, trend:"-5.4%", color:"#E06060" },
    { name:"Onion", price: 1400, msp: 0, trend:"+1.8%", color:"#E5D08F" },
  ];

  return (
    <div className="space-y-2.5">
      <Typography variant="micro" color="muted" className="uppercase tracking-[0.3em] block">
        Live Shivamogga Mandi · Today
      </Typography>
      {crops.map((crop, i) => (
        <GlassPanel
          as={motion.div}
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: i * 0.08 }}
          className="flex items-center gap-3 px-3 py-2.5"
        >
          <Typography variant="caption" color="secondary" className="flex-1">{crop.name}</Typography>
          <div className="text-right">
            <Typography variant="caption" color="primary" className="font-mono font-semibold block">
              ₹{crop.price.toLocaleString()}/Q
            </Typography>
            {crop.msp > 0 && (
              <Typography variant="caption" color="muted" className="!text-[10px] block">
                MSP ₹{crop.msp.toLocaleString()}
              </Typography>
            )}
          </div>
          <span className={`text-xs font-mono font-bold flex-shrink-0 ${
            crop.trend.startsWith("+") ? "text-[var(--color-growth-green)]" : "text-[var(--color-alert-amber)]"
          }`}>
            {crop.trend}
          </span>
        </GlassPanel>
      ))}
    </div>
  );
};

// ─── VOICE WAVE DEMO ──────────────────────────────────────────────────────────
const VoiceWaveDemo = () => {
  const [active, setActive] = useState(false);
  const commands = ["ಮಾರ್ಕೆಟ್ ಬೆಲೆ","ಹವಾಮಾನ","ನನ್ನ ತೋಟ","ಸ್ಕೀಮ್","ಬೆಳೆ","ಸಮುದಾಯ"];

  return (
    <div className="text-center space-y-6">
      <motion.button
        onClick={() => setActive(!active)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={active ? {
          boxShadow: ["0 0 0 0 rgba(201,168,76,0.4)","0 0 0 20px rgba(201,168,76,0)","0 0 0 0 rgba(201,168,76,0)"],
        } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        aria-label="Toggle voice navigation demo"
        aria-pressed={active}
        className="w-16 h-16 bg-[#E5D08F] rounded-full flex items-center justify-center mx-auto text-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0900] focus-visible:ring-[#E5D08F]"
        style={{ boxShadow: active ?"0 0 40px rgba(201,168,76,0.5)" :"0 0 20px rgba(201,168,76,0.15)" }}
      >
        🎙
      </motion.button>

      <div className="flex items-end justify-center gap-1 h-8" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div key={i}
            animate={active ? { height: [3, Math.random() * 26 + 5, 3] } : { height: 3 }}
            transition={{ repeat: Infinity, duration: 0.3 + Math.random() * 0.2, delay: i * 0.03 }}
            className="w-1.5 bg-[#E5D08F] rounded-full"
          />
        ))}
      </div>

      <Typography variant="micro" color="muted" className="block mt-6" role="status" aria-live="polite">
        {active ? "Listening in Kannada..." : "Tap to demo voice"}
      </Typography>

      <div className="grid grid-cols-3 gap-2 mt-6">
        {commands.map((cmd, i) => (
          <GlassPanel key={i} className="py-2 px-2 text-center">
            <Typography variant="caption" color="secondary" className="font-serif">{cmd}</Typography>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};

// ─── INTERACTIVE COMPONENT ROUTER ─────────────────────────────────────────────
const InteractiveContent = ({ type }: { type: string }) => {
  switch (type) {
    case"npk-sliders": return <NPKInteractive />;
    case"soil-vitality": return <SoilVitalityInteractive />;
    case"weather-cards": return <WeatherDemo />;
    case"price-chart": return <PriceChartDemo />;
    case"ai-chat": return <AIChatDemo />;
    case"voice-wave": return <VoiceWaveDemo />;
    case"community-feed": return <CommunityFeedDemo />;
    case"crop-timeline": return <CropTimelineDemo />;
    default: return null;
  }
};

// ─── MAIN SMART FARM SECTION ──────────────────────────────────────────────────
export const SmartFarmSection = () => {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-60px" });
  const { playClick, playGlass } = useAudio();

  return (
    <section ref={ref} className="relative bg-transparent z-10">
      <Container maxWidth="xl" paddingY="xl" className="text-center">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            Interactive Smart Farm
          </Typography>
          <div className="mb-4">
            <Typography variant="display-2">
              Explore the platform.<br />
              <span className="text-[var(--color-knowledge-gold)]">Without logging in.</span>
            </Typography>
          </div>
          <Typography variant="body-md" color="muted" className="max-w-xl mx-auto">
            Eight interactive demonstrations. Each one teaches you exactly what AgriCompass does.
          </Typography>
        </motion.div>

        {/* Location tabs — icon grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-12" role="tablist">
          {farmLocations.map((loc, i) => (
            <motion.button key={loc.id} onClick={() => { playClick(); setActive(i); }}
              onHoverStart={playGlass}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
              role="tab"
              aria-selected={active === i}
              aria-controls={`panel-${loc.id}`}
              className={`p-3 rounded-xl text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-knowledge-gold)] ${
                active === i
                  ? "border border-[var(--color-knowledge-gold)]/30 bg-[var(--color-knowledge-gold)]/5"
                  : "border border-[var(--color-glass-border,rgba(255,255,255,0.06))] hover:bg-white/5"
              }`}>
              <div className="text-2xl mb-1" aria-hidden="true">{loc.icon}</div>
              <Typography variant="micro" className="uppercase leading-tight hidden md:block truncate" color="muted">
                {loc.name}
              </Typography>
            </motion.button>
          ))}
        </div>

        {/* Active location */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            id={`panel-${farmLocations[active].id}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={LAYOUT_SPRING}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
          >
            {/* Info side */}
            <div className="text-left">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-4xl" aria-hidden="true">{farmLocations[active].icon}</span>
                <div>
                  <Typography variant="micro" className="uppercase tracking-[0.3em] mb-0.5 block" style={{ color: farmLocations[active].color }}>
                    {farmLocations[active].tagline}
                  </Typography>
                  <Typography variant="heading-1" className="font-serif !text-3xl">
                    {farmLocations[active].name}
                  </Typography>
                </div>
              </div>
              <Typography variant="body-md" color="secondary" className="leading-relaxed mb-6 block">
                {farmLocations[active].description}
              </Typography>
              <GlassPanel className="rounded-xl px-4 py-3 mb-6" style={{ borderColor: `color-mix(in srgb, ${farmLocations[active].color} 22%, transparent)` }}>
                <Typography variant="micro" className="uppercase tracking-[0.3em] mb-1 block" style={{ color: `color-mix(in srgb, ${farmLocations[active].color} 88%, transparent)` }}>
                  Key fact
                </Typography>
                <Typography variant="caption" color="secondary">{farmLocations[active].keyFact}</Typography>
              </GlassPanel>
              <a href="https://agri-compass-v3.vercel.app" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost">
                  Try live →
                </Button>
              </a>
            </div>

            <GlassPanel className="p-6 text-left">
              <Typography variant="micro" color="muted" className="uppercase tracking-[0.3em] mb-6 block">
                Interactive demo
              </Typography>
              <InteractiveContent type={farmLocations[active].interactive} />
            </GlassPanel>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
};
