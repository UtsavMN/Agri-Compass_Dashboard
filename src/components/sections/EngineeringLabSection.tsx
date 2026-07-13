import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { useAudio } from "../../hooks/useAudio";
import { Typography } from "../primitives/Typography";
import { GlassPanel } from "../primitives/GlassPanel";
import { Button } from "../primitives/Button";
import { Container } from "../primitives/Container";


// ─── ANIMATED FLOW NODE ────────────────────────────────────────────────────────
const FlowNode = ({
  label, icon, color ="#E5D08F", delay = 0, active = false, onClick,
}: {
  label: string; icon: string; color?: string;
  delay?: number; active?: boolean; onClick?: () => void;
}) => {
  const { playGlass } = useAudio();
  return (
    <GlassPanel
      as={motion.button}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...LAYOUT_SPRING, delay }}
      onClick={onClick}
      onHoverStart={playGlass}
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center gap-2 cursor-pointer group w-full p-4 border-none bg-transparent ${active ? 'bg-white/5' : ''}`}
      aria-pressed={active}
      aria-label={`Select ${label} node`}
      interaction={active ? 'none' : 'hover'}
    >
      {/* LARGER nodes — was 56px, now 64px */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
          active ? "scale-110" : ""
        }`}
        style={{
          background: active ? `color-mix(in srgb, ${color} 22%, transparent)` : "var(--color-earth-black)",
          border: `1.5px solid ${active ? color : "var(--color-glass-border,rgba(255,255,255,0.06))"}`,
          boxShadow: active ? `0 0 24px color-mix(in srgb, ${color} 35%, transparent)` : "none",
        }}
      >
        {icon}
      </div>
      {/* Label is ALWAYS visible, not just on hover */}
      <Typography variant="micro" className={`whitespace-nowrap transition-colors ${active ? 'text-white' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'}`}>
        {label}
      </Typography>
    </GlassPanel>
  );
}

// ─── ANIMATED CONNECTOR LINE ──────────────────────────────────────────────────
const FlowArrow = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ ...LAYOUT_SPRING, delay }}
    className="flex flex-row items-center mx-1"
  >
    <motion.div
      animate={{ width: ["0%","100%"] }}
      transition={{ repeat: Infinity, duration: 1.8, ease:"linear", delay }}
      className="h-px bg-gradient-to-r from-transparent via-[var(--color-knowledge-gold)] to-transparent"
      style={{ width: 32 }}
    />
    <motion.div
      animate={{ x: [0, 4, 0] }}
      transition={{ repeat: Infinity, duration: 1.2, delay }}
      className="text-[var(--color-knowledge-gold)]/60 text-xs ml-1"
    >
      →
    </motion.div>
  </motion.div>
);

// ─── NODE DETAIL PANEL ────────────────────────────────────────────────────────
const nodeDetails: Record<string, {
  title: string; description: string; tech: string[]; responsibilities: string[];
}> = {
  farmer: {
    title:"Farmer (End User)",
    description:"The farmer interacts with AgriCompass through a mobile browser. The app is designed to be mobile-first, accessible in Kannada, and usable on low-end Android devices.",
    tech: ["Mobile Browser","PWA-ready","Kannada voice input"],
    responsibilities: ["Voice commands","Form inputs","Community posts","Profile management"],
  },
  frontend: {
    title:"React 18 Frontend",
    description:"A TypeScript React application built with Vite. Uses Zustand for state, React Query for server state, Framer Motion for animations, and Tailwind CSS for styling.",
    tech: ["React 18","TypeScript","Vite","Tailwind CSS","Framer Motion","Zustand","React Query"],
    responsibilities: ["UI rendering","State management","API calls","Voice navigation","Real-time WebSocket updates"],
  },
  api: {
    title:"REST API Layer",
    description:"All frontend requests go through a unified REST API. Every endpoint is protected by JWT authentication. CORS is configured to only allow the Vercel frontend domain.",
    tech: ["REST","HTTP/HTTPS","JSON","CORS"],
    responsibilities: ["Request routing","CORS enforcement","Rate limiting","Response formatting"],
  },
  backend: {
    title:"Spring Boot 3 Backend",
    description:"Enterprise Java backend running on Java 17. Follows MVC architecture with Controllers, Services, and Repositories. Secured by Spring Security with JWT validation.",
    tech: ["Spring Boot 3","Java 17","Maven","Spring Security","Spring MVC","Hibernate"],
    responsibilities: ["Business logic","JWT validation","Data processing","API orchestration","Email notifications"],
  },
  auth: {
    title:"Clerk Authentication",
    description:"Clerk handles user identity. JWTs are issued on login and validated by Spring Security on every request. The JWT subject (Clerk user ID) becomes the primary key for all user data.",
    tech: ["Clerk","JWT","OAuth2","Spring Security"],
    responsibilities: ["User login","JWT issuance","Token refresh","Session management"],
  },
  database: {
    title:"Turso Database",
    description:"Edge SQLite database hosted by Turso. Provides global low-latency reads. All user data, farm data, posts, messages, and follows are stored here.",
    tech: ["Turso","SQLite","LibSQL","JDBC"],
    responsibilities: ["User profiles","Farm data","Community posts","Messages","Follows"],
  },
  apis: {
    title:"External APIs",
    description:"AgriCompass integrates with three live data sources: OpenWeather for meteorological data, Data.gov.in for APMC mandi prices, and Google Gemini for AI advisory.",
    tech: ["OpenWeather API","Data.gov.in","Gemini AI","Gmail SMTP"],
    responsibilities: ["Weather data","Mandi prices","AI responses","Email notifications"],
  },
  ai: {
    title:"Gemini AI Engine",
    description:"Google Gemini powers the Krishi Mitra chatbot. Prompts are constructed server-side to include farm context. Responses are streamed back to the frontend in Kannada or English.",
    tech: ["Google Gemini","Prompt engineering","Spring Boot service","Streaming"],
    responsibilities: ["Contextual farm advice","Kannada responses","Crop recommendations","Disease guidance"],
  },
};

const architectureFlow = [
  { id:"farmer", label:"Farmer", icon:"🚜" },
  { id:"frontend", label:"React Frontend", icon:"⚛" },
  { id:"api", label:"REST API", icon:"🔗" },
  { id:"backend", label:"Spring Boot", icon:"☕" },
  { id:"auth", label:"Clerk Auth", icon:"🔐" },
  { id:"database", label:"Turso DB", icon:"🗄" },
  { id:"apis", label:"External APIs", icon:"🌐" },
  { id:"ai", label:"Gemini AI", icon:"🤖" },
];

// ─── SYSTEM ARCHITECTURE ──────────────────────────────────────────────────────
const SystemArchitecture = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const { playClick } = useAudio();

  return (
    <div className="flex flex-col items-center gap-12 w-full">

      {/* Flow diagram — horizontal pipeline */}
      <div className="flex flex-row overflow-x-auto justify-start lg:justify-center items-center gap-2 w-full max-w-full pb-6 px-4 scrollbar-hide" role="group" aria-label="Architecture Flow">
        {architectureFlow.map((node, i) => (
          <div key={node.id} className="flex flex-row items-center flex-shrink-0">
            <div className="w-32">
              <FlowNode
                label={node.label}
                icon={node.icon}
                delay={i * 0.08}
                active={activeNode === node.id}
                onClick={() => {
                  playClick();
                  setActiveNode(activeNode === node.id ? null : node.id);
                }}
              />
            </div>
            {i < architectureFlow.length - 1 && (
              <div className="hidden md:flex relative w-12 flex-col items-center justify-center">
                <FlowArrow delay={i * 0.15} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-3xl" aria-live="polite">
        <AnimatePresence mode="wait">
          {activeNode ? (
            <GlassPanel
              as={motion.div}
              key={activeNode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={LAYOUT_SPRING}
              className="p-8"
              role="region"
              aria-label={`${nodeDetails[activeNode]?.title} details`}
            >
              <Typography variant="heading-1" className="mb-3">
                {nodeDetails[activeNode]?.title}
              </Typography>
              <div className="mb-6">
                <Typography variant="caption" color="secondary" className="leading-relaxed block">
                  {nodeDetails[activeNode]?.description}
                </Typography>
              </div>

              <div className="mb-6">
                <Typography variant="micro" color="gold" className="uppercase tracking-[0.3em] mb-3 block">
                  Technologies
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {nodeDetails[activeNode]?.tech.map((t) => (
                    <Button variant="chip" as="span" key={t} className="pointer-events-none opacity-80">
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Typography variant="micro" color="gold" className="uppercase tracking-[0.3em] mb-3 block">
                  Responsibilities
                </Typography>
                <ul className="space-y-1.5">
                  {nodeDetails[activeNode]?.responsibilities.map((r) => (
                    <li key={r} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-tertiary)] flex-shrink-0" />
                      <Typography variant="caption" color="secondary">{r}</Typography>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassPanel>
          ) : (
            <GlassPanel
              as={motion.div}
              className="p-8 text-center flex flex-col items-center justify-center"
              style={{ minHeight: 200 }}
            >
              <div className="text-5xl mb-4 mt-8">👆</div>
              <Typography variant="micro" color="muted" className="mb-8">
                Click any node to explore its role in the architecture
              </Typography>
            </GlassPanel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── AUTH JOURNEY ─────────────────────────────────────────────────────────────
const AuthJourney = () => {
  const steps = [
    { icon:"🚜", label:"Farmer opens app", detail:"Browser loads React app from Vercel CDN" },
    { icon:"🔑", label:"Clerk Login", detail:"Clerk modal — email / Google / phone OTP" },
    { icon:"🎟", label:"JWT Generated", detail:"Clerk issues signed JWT with user ID as subject" },
    { icon:"🛡", label:"Spring Security", detail:"Backend validates JWT signature against Clerk's issuer URI" },
    { icon:"🔓", label:"Security Context", detail:"Authenticated user stored in Spring Security context" },
    { icon:"🗄", label:"Database Sync", detail:"User profile fetched or created in Turso" },
    { icon:"📊", label:"Dashboard Access", detail:"All protected endpoints now accessible for this session" },
  ];

  return (
    <div className="relative">
      {/* Horizontal flow on desktop */}
      <div className="flex flex-col md:flex-row items-start gap-0 overflow-x-auto pb-4">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...LAYOUT_SPRING, delay: i * 0.12 }}
              className="flex flex-col items-center text-center max-w-[120px]"
            >
              <div className="w-12 h-12 bg-[var(--color-earth-black)] border border-[var(--color-glass-border,rgba(255,255,255,0.06))] rounded-xl
                              flex items-center justify-center text-xl mb-2
                              hover:hover:transition-all cursor-default shadow-lg">
                {step.icon}
              </div>
              <Typography variant="micro" className="leading-tight mb-1" color="secondary">{step.label}</Typography>
              <Typography variant="caption" className="!text-[9px] leading-tight" color="muted">{step.detail}</Typography>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="md:w-8 md:h-px w-px h-6 relative mx-2 flex-shrink-0">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[var(--color-knowledge-gold)]/40 to-[var(--color-knowledge-gold)]/10"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── DATABASE EXPLORER ────────────────────────────────────────────────────────
const entities = [
  {
    name:"user_profiles", icon:"👤", color:"#E5D08F",
    fields: ["clerk_user_id (PK)","full_name","username_handle","district","language","profile_picture_url","onboarding_completed"],
    relations: ["→ farms","→ community_posts","→ follows","→ conversations"],
    purpose:"Core user identity. Extends Clerk authentication with farm-specific profile data.",
  },
  {
    name:"farms", icon:"🌾", color:"#7EC47E",
    fields: ["id (PK)","clerk_user_id (FK)","farm_name","acres","district","soil_type","current_crop","npk_n","npk_p","npk_k"],
    relations: ["← user_profiles"],
    purpose:"Each farmer can have multiple farm sectors with soil data and crop tracking.",
  },
  {
    name:"community_posts", icon:"📝", color:"#6090E0",
    fields: ["id (PK)","clerk_user_id (FK)","content","category","district","likes_count","created_at"],
    relations: ["← user_profiles","→ post_likes","→ post_comments"],
    purpose:"Community broadcasts with category filtering (Crops, Market, Weather, Soil).",
  },
  {
    name:"messages", icon:"💬", color:"#E0C060",
    fields: ["id (PK)","conversation_id (FK)","sender_id (FK)","content","read_at","created_at"],
    relations: ["← conversations","← user_profiles"],
    purpose:"Real-time direct messages delivered via WebSocket STOMP protocol.",
  },
  {
    name:"follows", icon:"🤝", color:"#E5D08F",
    fields: ["follower_id (PK+FK)","following_id (PK+FK)","created_at"],
    relations: ["← user_profiles (x2)"],
    purpose:"Bidirectional follow system. Followed users' posts get higher feed priority.",
  },
  {
    name:"conversations", icon:"🗨", color:"#7EC47E",
    fields: ["id (PK)","participant_one (FK)","participant_two (FK)","created_at"],
    relations: ["← user_profiles (x2)","→ messages"],
    purpose:"DM conversation thread between two farmers. UNIQUE constraint prevents duplicates.",
  },
];

const DatabaseExplorer = () => {
  const [activeEntity, setActiveEntity] = useState<typeof entities[0] | null>(null);
  const { playClick, playGlass } = useAudio();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Entity grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {entities.map((entity, i) => (
          <GlassPanel
            as={motion.button}
            key={entity.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...LAYOUT_SPRING, delay: i * 0.08 }}
            onClick={() => { playClick(); setActiveEntity(entity); }}
            onHoverStart={playGlass}
            whileHover={{ y: -4, borderColor: `${entity.color}55` }}
            className={`p-4 text-left transition-all duration-300 ${
              activeEntity?.name === entity.name
                ? `border-[${entity.color}]/50 bg-[${entity.color}]/10 scale-105 shadow-[0_0_20px_${entity.color}20]`
                : "hover:scale-105"
            }`}
            interaction="hover"
          >
            <div className="text-2xl mb-2">{entity.icon}</div>
            <Typography variant="micro" color="secondary" className="leading-tight">{entity.name}</Typography>
          </GlassPanel>
        ))}
      </div>

      {/* Detail */}
      <AnimatePresence mode="wait">
        {activeEntity ? (
          <GlassPanel
            as={motion.div}
            key={activeEntity.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={LAYOUT_SPRING}
            className="p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{activeEntity.icon}</span>
              <div>
                <Typography variant="body-md" color="primary" className="font-semibold font-mono leading-tight">{activeEntity.name}</Typography>
                <Typography variant="caption" color="gold">Turso · SQLite</Typography>
              </div>
            </div>
            <Typography variant="caption" color="muted" className="leading-relaxed mb-6 block">{activeEntity.purpose}</Typography>

            <Typography variant="micro" color="gold" className="uppercase tracking-[0.3em] mb-2 block">Fields</Typography>
            <div className="space-y-1 mb-6">
              {activeEntity.fields.map((f) => (
                <Typography key={f} variant="micro" color="muted" className="block">{f}</Typography>
              ))}
            </div>

            <Typography variant="micro" color="gold" className="uppercase tracking-[0.3em] mb-2 block">Relations</Typography>
            {activeEntity.relations.map((r) => (
              <Typography key={r} variant="micro" className="text-[var(--color-growth-green)]/60 block">{r}</Typography>
            ))}
          </GlassPanel>
        ) : (
          <GlassPanel
            as={motion.div}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-8 flex items-center justify-center"
          >
            <Typography variant="micro" color="muted" className="text-center">
              Click an entity to explore its structure
            </Typography>
          </GlassPanel>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── API PIPELINE ─────────────────────────────────────────────────────────────
const pipelines = [
  {
    name:"Gemini AI",
    icon:"🤖",
    color:"#E5D08F",
    flow: ["Farmer question (Kannada/English)","Spring Boot service","Prompt construction + farm context","Gemini API call","Response in Kannada/English","Frontend display"],
    detail:"Prompts are constructed server-side to include the farmer's district, soil type, and current crop context. API keys never exposed to the frontend.",
  },
  {
    name:"OpenWeather",
    icon:"🌦",
    color:"#F5F0E8",
    flow: ["User's district","Backend WeatherController","OpenWeather API call","5-day forecast parsing","Farming advisory generation","Dashboard display"],
    detail:"Responses are cached for 1 hour to avoid rate limits. Farming advisories are generated server-side based on temperature, humidity, and wind conditions.",
  },
  {
    name:"Data.gov.in",
    icon:"📈",
    color:"#7EC47E",
    flow: ["User's district","MarketController","Data.gov.in APMC API","District name mapping","Price parsing + formatting","Market prices display"],
    detail:"District names are mapped between modern Karnataka names and Data.gov.in's legacy spellings (e.g., Shivamogga → Shimoga). Falls back to state-level data if district data is unavailable.",
  },
  {
    name:"WebSocket",
    icon:"⚡",
    color:"#E0C060",
    flow: ["Farmer A sends message","STOMP /app/chat.send","MessageController","Save to Turso","Push to /user/{id}/queue","Farmer B receives instantly"],
    detail:"Real-time messaging via STOMP over WebSocket. Spring Boot acts as the message broker. Messages are persisted to Turso and delivered with optimistic UI updates on the sender side.",
  },
];

const APIPipeline = () => {
  const [active, setActive] = useState(0);
  const { playClick, playGlass } = useAudio();

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="API Pipelines">
        {pipelines.map((p, i) => (
          <button key={p.name} onClick={() => { playClick(); setActive(i); }}
            onMouseEnter={playGlass}
            role="tab"
            aria-selected={active === i}
            aria-controls={`pipeline-panel-${i}`}
            id={`pipeline-tab-${i}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-knowledge-gold)] ${
              active === i
                ? "bg-[var(--color-knowledge-gold)] text-[var(--color-earth-black)] font-semibold"
                : "border border-[var(--color-glass-border,rgba(255,255,255,0.06))] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            }`}>
            <span>{p.icon}</span>{p.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={LAYOUT_SPRING}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          role="tabpanel"
          id={`pipeline-panel-${active}`}
          aria-labelledby={`pipeline-tab-${active}`}
        >
          {/* Flow steps */}
          <div className="space-y-2">
            {pipelines[active].flow.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...LAYOUT_SPRING, delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono flex-shrink-0"
                    style={{ borderColor: pipelines[active].color, color: pipelines[active].color }}>
                    {i + 1}
                  </div>
                  {i < pipelines[active].flow.length - 1 && (
                    <motion.div className="w-px h-4 mt-1"
                      style={{ background: `${pipelines[active].color}40` }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} />
                  )}
                </div>
                <Typography variant="caption" color="secondary">{step}</Typography>
              </motion.div>
            ))}
          </div>

          {/* Detail */}
          <GlassPanel className="p-6 h-fit">
            <Typography variant="micro" color="gold" className="uppercase tracking-[0.3em] mb-3 block">
              Implementation Detail
            </Typography>
            <Typography variant="caption" color="muted" className="leading-relaxed block">
              {pipelines[active].detail}
            </Typography>
          </GlassPanel>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── DEPLOYMENT ARCHITECTURE ──────────────────────────────────────────────────
const DeploymentDiagram = () => {
  const layers = [
    { label:"Vercel CDN", sublabel:"React 18 Frontend", icon:"▲", color:"#F5F0E8" },
    { label:"Clerk", sublabel:"Authentication & JWT", icon:"🔐", color:"#6C47FF" },
    { label:"Render", sublabel:"Spring Boot Backend", icon:"☁", color:"#E5D08F" },
    { label:"Turso", sublabel:"Edge SQLite Database", icon:"🗄", color:"#F5F0E8" },
    { label:"External APIs", sublabel:"Gemini · OpenWeather · Data.gov.in", icon:"🌐", color:"#E5D08F" },
  ];

  return (
    <div className="flex flex-col items-center gap-0 max-w-sm mx-auto">
      {layers.map((layer, i) => (
        <div key={layer.label} className="flex flex-col items-center w-full">
          <GlassPanel
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
            className="w-full px-6 py-4 flex items-center gap-4 hover:scale-105 transition-all duration-300"
            interaction="hover"
          >
            <div className="text-2xl w-10 text-center">{layer.icon}</div>
            <div>
              <Typography variant="body-md" color="primary" className="font-semibold">{layer.label}</Typography>
              <Typography variant="micro" color="muted">{layer.sublabel}</Typography>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full animate-pulse"
              style={{ background: layer.color }} />
          </GlassPanel>
          {i < layers.length - 1 && (
            <div className="h-6 w-px relative">
              <motion.div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-knowledge-gold) 60%, transparent), transparent)" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── MAIN ENGINEERING LAB SECTION ─────────────────────────────────────────────
const engTabs = [
  { id:"architecture", label:"System Architecture", icon:"🏗" },
  { id:"auth", label:"Auth Journey", icon:"🔐" },
  { id:"database", label:"Database", icon:"🗄" },
  { id:"apis", label:"API Pipelines", icon:"⚡" },
  { id:"deployment", label:"Deployment", icon:"☁" },
];

export const EngineeringLabSection = () => {
  const [activeTab, setActiveTab] = useState("architecture");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { playClick, playGlass } = useAudio();

  return (
    <section id="engineering" ref={ref} className="relative bg-transparent">
      <Container maxWidth="xl" paddingY="xl">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            Engineering Lab
          </Typography>
          <div className="mb-4">
            <Typography variant="display-2">
              How it{" "}
              <span className="text-[var(--color-knowledge-gold)]">works inside.</span>
            </Typography>
          </div>
          <Typography variant="body-md" color="muted" className="max-w-xl mx-auto">
            For recruiters, engineers, and technical judges. Explore the architecture that powers AgriCompass.
          </Typography>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-12" role="tablist" aria-label="Engineering Lab Topics">
          {engTabs.map((tab) => (
            <motion.button key={tab.id} onClick={() => { playClick(); setActiveTab(tab.id); }}
              onHoverStart={playGlass}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`eng-tabpanel-${tab.id}`}
              id={`eng-tab-${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-knowledge-gold)] ${
                activeTab === tab.id
                  ? "bg-[var(--color-knowledge-gold)] text-[var(--color-earth-black)] font-semibold shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                  : "border border-[var(--color-glass-border,rgba(255,255,255,0.06))] text-[var(--color-text-muted)] font-mono hover:text-[var(--color-text-secondary)]"
              }`}>
              <span>{tab.icon}</span>{tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={LAYOUT_SPRING}
              role="tabpanel"
              id={`eng-tabpanel-${activeTab}`}
              aria-labelledby={`eng-tab-${activeTab}`}>
            {activeTab ==="architecture" && <SystemArchitecture />}
            {activeTab ==="auth" && <AuthJourney />}
            {activeTab ==="database" && <DatabaseExplorer />}
            {activeTab ==="apis" && <APIPipeline />}
              {activeTab ==="deployment" && <DeploymentDiagram />}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
