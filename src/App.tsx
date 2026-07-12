import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { CustomCursor } from "./components/layout/CustomCursor";
import { GlobalGrain } from "./components/layout/GlobalGrain";

const NotFound = () => (
  <div className="min-h-screen bg-[#0A0900] flex flex-col items-center justify-center">
    <p className="text-[#E5D08F] font-mono text-6xl mb-4">404</p>
    <p className="text-[#F5F0E8]/30 text-sm font-mono mb-8">Page not found</p>
    <a href="/" className="text-[#E5D08F] text-sm border border-[#E5D08F]/30 px-5 py-2.5 rounded-lg">
      Go home →
    </a>
  </div>
);

export default function App() {
  // Performant delegated event listener for mouse glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.premium-card') as HTMLElement;
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    // passive: true improves scrolling performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <GlobalGrain />
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
