import { useState, useRef } from"react";
import { motion, useInView, AnimatePresence } from"framer-motion";
import { LAYOUT_SPRING } from"../../constants/springs";
import { useAudio } from"../../hooks/useAudio";

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
    <div className="space-y-5">
      {[
        { key:"n" as const, label:"Nitrogen (N)", color:"#7EC47E" },
        { key:"p" as const, label:"Phosphorus (P)", color:"#E5D08F" },
        { key:"k" as const, label:"Potassium (K)", color:"#6090E0" },
      ].map(({ key, label, color }) => (
        <div key={key}>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-mono text-[#F5F0E8]/45">{label}</span>
            <span className="text-xs font-mono" style={{ color }}>{npk[key]} kg/acre</span>
          </div>
          <input
            type="range" min={10} max={100} value={npk[key]}
            onChange={(e) => setNpk((prev) => ({ ...prev, [key]: +e.target.value }))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${color} ${npk[key]}%, #2A2720 ${npk[key]}%)` }}
            aria-label={`Adjust ${label}`}
          />
        </div>
      ))}

      <motion.div
        key={rec.crop}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-4 mt-2"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#F5F0E8] font-semibold">Recommended: {rec.crop}</p>
          <span className="text-[#7EC47E] text-sm font-mono font-bold">{rec.score}%</span>
        </div>
        <div className="w-full h-1 bg-[#2A2720] rounded-full mb-2">
          <motion.div
            className="h-full bg-[#7EC47E] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${rec.score}%` }}
            transition={LAYOUT_SPRING}
          />
        </div>
        <p className="text-[#F5F0E8]/35 text-xs">{rec.reason}</p>
      </motion.div>
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
            <circle cx="40" cy="40" r="30" fill="none" stroke="#2A2720" strokeWidth="6" />
            <motion.circle
              cx="40" cy="40" r="30"
              fill="none" stroke="#E5D08F" strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 30}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - score / 100) }}
              transition={LAYOUT_SPRING}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[#E5D08F] font-semibold text-lg font-mono">{score}</p>
          </div>
        </div>
        <div>
          <p className="text-[#F5F0E8]/60 text-sm font-semibold">Soil Health Vitality</p>
          <p className="text-[#7EC47E] text-xs">Good Condition — 72% Balance</p>
        </div>
      </div>

      {/* Deficits + recommendations */}
      {deficits.map((d, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
          className="premium-card p-3"
        >
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-[#F5F0E8]/55 text-xs">{d.nutrient} deficit: {d.deficit} kg/acre</p>
            <span className="text-xs font-mono font-bold" style={{ color: d.color }}>{d.qty}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <p className="text-[#F5F0E8]/28 text-xs">{d.product} recommended</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── AI CHAT DEMO ─────────────────────────────────────────────────────────────
const demoConversations = [
  {
    question:"ರಾಗಿ ಬೆಳೆಗೆ ಎಷ್ಟು ನೀರು ಬೇಕು?",
    questionEn:"How much water does Ragi need?",
    answer:"ರಾಗಿ ಬೆಳೆಗೆ ಮಳೆ ಆಶ್ರಿತ ಕೃಷಿಗೆ 450–600 mm ನೀರು ಸಾಕು. ಮೊದಲ 4 ವಾರ ನೆಲ ಒದ್ದೆ ಇರಲಿ. ಹೂ ಬಿಡುವಾಗ ನೀರಿನ ಕೊರತೆ ಆಗದಂತೆ ಗಮನಿಸಿ.",
    answerEn:"Ragi needs 450–600mm for rainfed cultivation. Keep soil moist for the first 4 weeks. Never let water stress occur during flowering.",
  },
  {
    question:"ಹತ್ತಿ ಬೆಲೆ ಯಾವಾಗ ಹೆಚ್ಚಾಗುತ್ತದೆ?",
    questionEn:"When do cotton prices peak?",
    answer:"ಹತ್ತಿ ಬೆಲೆ ಸಾಮಾನ್ಯವಾಗಿ ಡಿಸೆಂಬರ್-ಜನವರಿಯಲ್ಲಿ ಹೆಚ್ಚಾಗುತ್ತದೆ. ಕಡಿಮೆ ಆವಕ ಮತ್ತು ಹೆಚ್ಚು ಬೇಡಿಕೆ ಕಾರಣ. Market Prices ಪುಟದಲ್ಲಿ ಪ್ರತಿದಿನ ಮಂಡಿ ಬೆಲೆ ನೋಡಿ.",
    answerEn:"Cotton prices typically peak Dec–Jan due to lower supply and higher demand. Check the Market Prices page daily for live mandi rates.",
  },
  {
    question:"PM-KISAN ಗೆ ಅರ್ಜಿ ಹೇಗೆ ಹಾಕಬೇಕು?",
    questionEn:"How do I apply for PM-KISAN?",
    answer:"PM-KISAN ಅಡಿಯಲ್ಲಿ ₹6,000/ವರ್ಷ ಸಿಗುತ್ತದೆ. ಅರ್ಜಿ ಹಾಕಲು: ಹತ್ತಿರದ ಕೃಷಿ ಕಚೇರಿ ಅಥವಾ CSC ಕೇಂದ್ರಕ್ಕೆ ಹೋಗಿ. Aadhaar ಮತ್ತು ಭೂ ದಾಖಲೆ ತೆಗೆದುಕೊಂಡು ಹೋಗಿ. Gov Schemes ಪುಟದಲ್ಲಿ ಹೆಚ್ಚಿನ ವಿವರ ನೋಡಿ.",
    answerEn:"PM-KISAN gives ₹6,000/year. Apply at your nearest agriculture office or CSC centre. Bring Aadhaar and land records. Check Gov Schemes page for details.",
  },
];

const AIChatDemo = () => {
  const [activeQ, setActiveQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [typing, setTyping] = useState(false);

  const handleQuestion = (i: number) => {
    setActiveQ(i);
    setShowAnswer(false);
    setTyping(true);
    setTimeout(() => { setTyping(false); setShowAnswer(true); }, 1800);
  };

  return (
    <div className="space-y-4">
      {/* Question buttons */}
      <div className="space-y-2">
        <p className="text-[#F5F0E8]/25 text-xs font-mono uppercase tracking-[0.3em] mb-3">
          Sample questions — click to ask
        </p>
        {demoConversations.map((conv, i) => (
          <motion.button
            key={i}
            onClick={() => handleQuestion(i)}
            whileHover={{ borderColor:"rgba(201,168,76,0.4)" }}
            aria-label={`Ask AI: ${conv.questionEn}`}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5D08F] ${
              activeQ === i
                ?""
                :"border-[#2A2720] hover:bg-[#191610]"
            }`}
          >
            <p className="text-[#F5F0E8]/60 font-serif mb-0.5">{conv.question}</p>
            <p className="text-[#F5F0E8]/22 font-mono text-[10px]">{conv.questionEn}</p>
          </motion.button>
        ))}
      </div>

      <div className="premium-card p-4 min-h-[100px]" role="status" aria-live="polite">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-md flex items-center justify-center text-xs" aria-hidden="true">🤖</div>
          <p className="text-[#E5D08F] text-xs font-mono">Krishi Mitra AI</p>
          {typing && (
            <div className="flex gap-1 ml-2" aria-label="Krishi Mitra is typing" aria-busy="true">
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  className="w-1 h-1 rounded-full"
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
              transition={LAYOUT_SPRING}>
              <p className="text-[#F5F0E8]/65 text-sm font-serif leading-relaxed mb-2">
                {demoConversations[activeQ].answer}
              </p>
              <p className="text-[#F5F0E8]/25 text-xs leading-relaxed italic">
                {demoConversations[activeQ].answerEn}
              </p>
            </motion.div>
          )}
          {!showAnswer && !typing && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[#F5F0E8]/20 text-xs font-mono">
              Click a question above to see Krishi Mitra respond in Kannada
            </motion.p>
          )}
        </AnimatePresence>
      </div>
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
        <motion.div key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
          className="premium-card p-4"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold text-[#E5D08F]" aria-hidden="true">
              {post.avatar}
            </div>
            <div>
              <p className="text-[#F5F0E8]/70 text-xs font-semibold">{post.user}</p>
              <p className="text-[#F5F0E8]/25 text-[10px] font-mono">📍 {post.district} · {post.time}</p>
            </div>
          </div>
          <p className="text-[#F5F0E8]/50 text-xs leading-relaxed mb-3">"{post.content}"</p>
          <div className="flex gap-4 text-[10px] text-[#F5F0E8]/25 font-mono">
            <span>❤ {post.likes}</span>
            <span>💬 {post.comments}</span>
          </div>
        </motion.div>
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
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#E5D08F]/40 to-transparent" />
      <div className="space-y-3 pl-12">
        {stages.map((stage, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
            className="relative"
          >
            <div className="absolute -left-7 w-5 h-5 rounded-full bg-[#111008] border flex items-center justify-center text-xs" aria-hidden="true">
              {stage.icon}
            </div>
            <div className="premium-card px-3 py-2.5">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[#F5F0E8]/65 text-xs font-semibold">{stage.label}</p>
                <span className="text-[10px] font-mono text-[#E5D08F]/50">{stage.days}</span>
              </div>
              <p className="text-[#F5F0E8]/28 text-xs leading-relaxed">{stage.detail}</p>
            </div>
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
      <div className="premium-card p-4">
        <p className="text-[10px] font-mono text-[#F5F0E8]/50 uppercase tracking-[0.3em] mb-1">
          Current · Shivamogga
        </p>
        <p className="text-[#F5F0E8] text-3xl font-semibold font-mono">28°C</p>
        <p className="text-[#F5F0E8] text-xs">Partly Cloudy · Humidity 67%</p>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="premium-card p-2 text-center">
            <p className="text-[10px] font-mono text-[#F5F0E8]/30">{d.day}</p>
            <p className="text-lg my-1" aria-hidden="true">{d.icon}</p>
            <p className="text-[#F5F0E8]/55 text-xs font-mono">{d.temp}</p>
            <p className="text-[#F5F0E8]/60 text-[9px] font-mono">{d.rain}</p>
          </div>
        ))}
      </div>

      <div className="premium-card border p-3">
        <p className="text-[9px] font-mono text-[#7EC47E]/50 uppercase tracking-[0.3em] mb-1">
          AI Farming Advisory
        </p>
        <p className="text-[#F5F0E8]/50 text-xs leading-relaxed">
          ⚡ Heavy rain Friday–Saturday. Delay pesticide application by 3 days.
          Harvest window open Monday morning.
        </p>
      </div>
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
      <p className="text-[10px] font-mono text-[#F5F0E8]/25 uppercase tracking-[0.3em]">
        Live Shivamogga Mandi · Today
      </p>
      {crops.map((crop, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: i * 0.08 }}
          className="flex items-center gap-3 premium-card px-3 py-2.5"
        >
          <p className="text-[#F5F0E8]/55 text-xs flex-1">{crop.name}</p>
          <div className="text-right">
            <p className="text-[#F5F0E8] text-xs font-mono font-semibold">
              ₹{crop.price.toLocaleString()}/Q
            </p>
            {crop.msp > 0 && (
              <p className="text-[10px] font-mono text-[#F5F0E8]/25">
                MSP ₹{crop.msp.toLocaleString()}
              </p>
            )}
          </div>
          <span className={`text-xs font-mono font-bold flex-shrink-0 ${
            crop.trend.startsWith("+") ?"text-[#7EC47E]" :"text-[#E06060]"
          }`}>
            {crop.trend}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// ─── VOICE WAVE DEMO ──────────────────────────────────────────────────────────
const VoiceWaveDemo = () => {
  const [active, setActive] = useState(false);
  const commands = ["ಮಾರ್ಕೆಟ್ ಬೆಲೆ","ಹವಾಮಾನ","ನನ್ನ ತೋಟ","ಸ್ಕೀಮ್","ಬೆಳೆ","ಸಮುದಾಯ"];

  return (
    <div className="text-center space-y-5">
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

      <p className="text-[#F5F0E8]/35 text-xs font-mono" role="status" aria-live="polite">
        {active ?"Listening in Kannada..." :"Tap to demo voice"}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {commands.map((cmd, i) => (
          <div key={i} className="premium-card py-2 px-2 text-center">
            <p className="text-[#F5F0E8]/45 text-xs font-serif">{cmd}</p>
          </div>
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
    <section ref={ref} className="relative py-32 bg-transparent z-10">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <p className="text-[#E5D08F] text-xs tracking-[0.3em] uppercase font-mono mb-4">
            Interactive Smart Farm
          </p>
          <h2 className="text-display-2 mb-4">
            Explore the platform.<br />
            <span className="text-[#E5D08F]">Without logging in.</span>
          </h2>
          <p className="text-[#F5F0E8]/30 max-w-xl mx-auto">
            Eight interactive demonstrations. Each one teaches you exactly what AgriCompass does.
          </p>
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
              className={`p-3 rounded-xl text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5D08F] ${
                active === i
                  ?"border"
                  :"border border-[#2A2720] hover:hover:"
              }`}>
              <div className="text-2xl mb-1" aria-hidden="true">{loc.icon}</div>
              <div className="text-[8px] text-[#F5F0E8]/28 font-mono uppercase leading-tight hidden md:block truncate">
                {loc.name}
              </div>
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
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-4xl" aria-hidden="true">{farmLocations[active].icon}</span>
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.3em] mb-0.5"
                    style={{ color: farmLocations[active].color }}>
                    {farmLocations[active].tagline}
                  </p>
                  <h3 className="font-serif text-3xl text-[#F5F0E8]">
                    {farmLocations[active].name}
                  </h3>
                </div>
              </div>
              <p className="text-[#F5F0E8]/45 text-base leading-relaxed mb-6">
                {farmLocations[active].description}
              </p>
              <div className="premium-card rounded-xl px-4 py-3 mb-6"
                style={{ borderColor: `${farmLocations[active].color}22` }}>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-1"
                  style={{ color: `${farmLocations[active].color}88` }}>
                  Key fact
                </p>
                <p className="text-[#F5F0E8]/55 text-sm">{farmLocations[active].keyFact}</p>
              </div>
              <a href="https://agri-compass-v3.vercel.app" target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#E5D08F] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5D08F] border px-5 py-2.5 rounded-lg hover:hover:transition-all">
                Try live →
              </a>
            </div>

            <div className="premium-card p-6">
              <p className="text-[10px] font-mono text-[#F5F0E8]/25 uppercase tracking-[0.3em] mb-5">
                Interactive demo
              </p>
              <InteractiveContent type={farmLocations[active].interactive} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
