
import { Leaf, FlaskConical, TrendingUp, CloudSun, Bot, Mic, Users, Landmark } from 'lucide-react';

export const features = [
  {
    id: "crops", icon: <Leaf />, title: "Crop Intelligence", subtitle: "AI-powered recommendations",
    description: "Enter soil NPK values, district, and season. AgriCompass recommends crops most likely to succeed on your specific land — with AI confidence scores and full profitability forecasts.",
    screenshot: "/screenshots/crops.png", color: "#7EC47E",
    stats: ["85%+ accuracy", "30+ Karnataka crops", "All 31 districts"],
  },
  {
    id: "fertilizer", icon: <FlaskConical />, title: "Fertilizer Optimizer", subtitle: "Precision soil nutrition",
    description: "Not guesswork — chemistry. Enter soil deficits. Get exact quantities: 21.7 kg Urea, 8.1 kg DAP, 6.2 kg MOP. Soil Health Vitality Score reveals exactly where you stand.",
    screenshot: "/screenshots/fertilizer.png", color: "#E5D08F",
    stats: ["N-P-K analysis", "Soil vitality score", "Cost optimised"],
  },
  {
    id: "market", icon: <TrendingUp />, title: "Live Mandi Prices", subtitle: "Know your market before harvest",
    description: "Real-time APMC mandi prices from Data.gov.in. MSP vs market comparison. Interactive profitability charts. Sell when it matters most — not when traders decide.",
    screenshot: "/screenshots/market.png", color: "#6090E0",
    stats: ["Data.gov.in live", "MSP comparison", "Trend charts"],
  },
  {
    id: "weather", icon: <CloudSun />, title: "Weather & Advisory", subtitle: "Farm-specific forecasts",
    description: "Hyper-local 5-day forecasts powered by OpenWeather. Humidity, wind, visibility, pressure. Farming advisories that tell you WHAT TO DO — not just what the weather is.",
    screenshot: "/screenshots/weather.png", color: "#F5F0E8",
    stats: ["5-day forecast", "OpenWeather API", "Farm advisories"],
  },
  {
    id: "ai", icon: <Bot />, title: "Krishi Mitra AI", subtitle: "Gemini-powered farm advisor",
    description: "Ask anything in Kannada or English. Get personalised advice for your specific farm, crop, and situation. Powered by Google Gemini — agricultural intelligence on demand.",
    screenshot: "/screenshots/ai.png", color: "#E5D08F",
    stats: ["Google Gemini", "Kannada + English", "Contextual advice"],
  },
  {
    id: "voice", icon: <Mic />, title: "Voice Navigation", subtitle: "ಮಾತನಾಡಿ, navigate ಮಾಡಿ",
    description: "Speak naturally in Kannada. AgriCompass understands and navigates. Designed for farmers who find typing a barrier. No special hardware — works on any Android phone.",
    screenshot: "/screenshots/voice.png", color: "#E0C060",
    stats: ["kn-IN locale", "Natural language", "Any Android phone"],
  },
  {
    id: "community", icon: <Users />, title: "Kisan Community", subtitle: "Learn from your neighbours",
    description: "A social platform for farmers. Share knowledge, prices, and experiences. Follow system, real-time direct messaging, and community feed filtered by district.",
    screenshot: "/screenshots/community.png", color: "#7EC47E",
    stats: ["Real-time feed", "District filtering", "Direct messaging"],
  },
  {
    id: "schemes", icon: <Landmark />, title: "Government Schemes", subtitle: "Your benefits, found for you",
    description: "PM-KISAN, Raitha Siri, PMFBY — filtered to match YOUR land size, caste category, and district. Eligibility matching. Application guides. Never miss a benefit.",
    screenshot: "/screenshots/schemes.png", color: "#E5D08F",
    stats: ["25+ schemes", "Eligibility filter", "Application guides"],
  },
];
