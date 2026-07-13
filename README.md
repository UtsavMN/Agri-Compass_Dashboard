# AgriCompass Showcase

> The modern operating system for agriculture in Karnataka, India.

AgriCompass Showcase is a cinematic, Apple-style interactive product tour designed to introduce users to the full AgriCompass platform. Built with a focus on immersive 3D storytelling, real-time data integration, and multi-lingual accessibility, it presents the future of intelligent farming.

![Live Platform](public/screenshots/dashboard.png)

## 🌟 Live Demo
- **Showcase Website:** [agri-compass-showcase.vercel.app](https://agri-compass-showcase.vercel.app)
- **Live Application:** [agri-compass-v3.vercel.app](https://agri-compass-v3.vercel.app)
- **Source Code (Full App):** [GitHub Repository](https://github.com/UtsavMN/Agri-Compass_Dashboard)

## 🏗 Architecture Overview

This showcase is engineered to feel like a high-end product launch, balancing rich cinematic graphics with strict performance optimizations.

### Core Stack
- **Framework:** React 18 + Vite 5 + TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Animation:** Framer Motion + GSAP + Lenis (Smooth Scrolling)
- **3D Engine:** Three.js + React Three Fiber + Drei

### Performance Optimizations
To achieve a near-perfect Lighthouse score and smooth 60 FPS rendering:
- **Code Splitting:** Heavy 3D components (`HeroSection`, `SmartFarmSection`, `CinematicIntro`) are dynamically imported via `React.lazy()` and `<Suspense>`.
- **Adaptive Rendering:** The custom `useDeviceCapability` hook dynamically scales `dpr` (device pixel ratio), reduces particle counts by 75%, and disables shadow mapping on mobile devices.
- **Motion Reduction:** Users with `prefers-reduced-motion` enabled receive a simplified, static-first experience.

## 🚀 Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/UtsavMN/agri-compass-showcase.git
   cd agri-compass-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## ☁️ Deployment Guide

This project is optimized for deployment on edge networks like Vercel or Netlify.

### Vercel Deployment
1. Connect your GitHub repository to Vercel.
2. The Vercel platform will automatically detect Vite.
3. Leave the build command as `npm run build` and output directory as `dist`.
4. Deploy! No environment variables are required for the showcase.

## 📁 Folder Structure

```
src/
├── components/
│   ├── 3d/           # React Three Fiber components (Drone, Farm, Globe)
│   ├── layout/       # Navbar, Footer
│   └── sections/     # Individual page sections (Hero, Problem, Team, etc.)
├── constants/        # Static data (techStack.ts, team.ts)
├── hooks/            # Custom React hooks (useDeviceCapability.ts)
├── pages/            # Page-level assembly (Home.tsx)
└── providers/        # Context providers (SmoothScrollProvider.tsx)
```

## 👨‍💻 Team
- **Utsav MN (Lead)** — Full Stack & System Design
- **U S Aniruddha** — Frontend & UI/UX
- **J K Naveena** — AI & Data Integration
- **Sindhoora K H** — Product & Community

## ⚠️ Known Limitations
- The 3D introductory sequence requires WebGL2 support. Older devices without hardware acceleration will automatically skip to the fallback UI.
- The Showcase uses placeholder screenshots for the live application sections. These are designed to be swapped out for animated GIFs in the future.

## 🔮 Future Improvements
- **Service Worker integration** for offline caching of 3D models.
- **Dynamic asset loading** from a CDN (Cloudinary) rather than bundling models locally.
- **Localization:** Adding a direct toggle to view the showcase entirely in Kannada.
