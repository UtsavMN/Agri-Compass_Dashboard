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
