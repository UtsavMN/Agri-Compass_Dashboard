import { motion } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
interface KeynoteScreenshotProps {
  src: string;
  alt: string;
  tilt?: "left" | "right" | "straight" | "flat";
}

export const KeynoteScreenshot = ({ src, alt, tilt = "straight" }: KeynoteScreenshotProps) => {
  // Define the perspective transform based on the tilt
  let transform = "perspective(1200px) rotateX(4deg)";
  
  if (tilt === "left") {
    transform = "perspective(1200px) rotateX(4deg) rotateY(4deg) rotateZ(-1deg)";
  } else if (tilt === "right") {
    transform = "perspective(1200px) rotateX(4deg) rotateY(-4deg) rotateZ(1deg)";
  } else if (tilt === "flat") {
    transform = "none";
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto flex justify-center items-center p-4 md:p-8 pointer-events-none">
      
      {/* Massive soft ground shadow (under the element) */}
      {tilt !== "flat" && (
        <div 
          className="absolute inset-x-12 bottom-0 h-[20%] bg-black/80 blur-3xl rounded-[100%]"
          style={{ transform: "translateY(50%)" }}
        />
      )}

      {/* The 3D container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={LAYOUT_SPRING}
        style={{ transform }}
        className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#1A0F05]/60 backdrop-blur-3xl border border-white/10 pointer-events-auto"
      >
        {/* Apple-style Browser Chrome */}
        <div className="bg-[#111]/80 px-4 py-3 flex items-center gap-2 border-b border-white/5 backdrop-blur-md">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57] border border-black/20" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FEBC2E] border border-black/20" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#28C840] border border-black/20" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white/5 border border-white/5 rounded-md px-10 md:px-24 py-1 text-[10px] md:text-xs text-[#F5F0E8]/40 font-mono text-center shadow-inner">
              agri-compass-v3.vercel.app
            </div>
          </div>
        </div>

        {/* The Image Wrapper */}
        <div className="relative flex items-center justify-center min-h-[300px]">
          {src ? (
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-auto block"
              loading="lazy"
            />
          ) : (
            <div className="text-[#F5F0E8]/30 font-mono text-sm py-32 px-12 text-center border-2 border-dashed border-[#F5F0E8]/10 rounded-xl m-8">
              Screenshot coming soon
            </div>
          )}
          
          {/* Glass Reflection Gradient overlay (Keynote style diagonal glare) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none mix-blend-overlay" />
          
          {/* Subtle inner shadow to give depth to the screen */}
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};
