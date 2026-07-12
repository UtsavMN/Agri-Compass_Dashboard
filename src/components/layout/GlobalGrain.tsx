export const GlobalGrain = () => {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none mix-blend-overlay opacity-30">
      <svg className="absolute inset-0 w-full h-full opacity-50">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};
