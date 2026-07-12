import { create } from "zustand";

export type QualityProfile = "ultra" | "high" | "medium" | "low";

export interface QualitySettings {
  dpr: number;
  bloom: number;
  volumetricFog: boolean;
  shadowMapSize: number;
  particleCount: number; 
  butterflyCount: number;
  leafDensity: number;
  windComplexity: "full" | "simple" | "none";
}

const PROFILE_SETTINGS: Record<QualityProfile, QualitySettings> = {
  ultra: {
    dpr: 1.5,
    bloom: 1.4,
    volumetricFog: true,
    shadowMapSize: 4096,
    particleCount: 400,
    butterflyCount: 3,
    leafDensity: 1.0,
    windComplexity: "full",
  },
  high: {
    dpr: 1.2,
    bloom: 1.0,
    volumetricFog: true,
    shadowMapSize: 2048,
    particleCount: 300,
    butterflyCount: 2,
    leafDensity: 0.8,
    windComplexity: "full",
  },
  medium: {
    dpr: 1.0,
    bloom: 0.8,
    volumetricFog: false,
    shadowMapSize: 1024,
    particleCount: 150,
    butterflyCount: 1,
    leafDensity: 0.5,
    windComplexity: "simple",
  },
  low: {
    dpr: 0.8,
    bloom: 0,
    volumetricFog: false,
    shadowMapSize: 0,
    particleCount: 50,
    butterflyCount: 0,
    leafDensity: 0.3,
    windComplexity: "none",
  }
};

const PROFILES: QualityProfile[] = ["ultra", "high", "medium", "low"];

// Guess initial profile based on hardware
const getInitialProfile = (): QualityProfile => {
  if (typeof window === "undefined") return "high";
  const isMobile = window.innerWidth < 768;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  
  if (isMobile) {
    return hardwareConcurrency > 4 ? "medium" : "low";
  }
  return hardwareConcurrency >= 8 ? "ultra" : "high";
};

interface QualityState {
  profile: QualityProfile;
  settings: QualitySettings;
  stepUp: () => void;
  stepDown: () => void;
}

export const useQualityStore = create<QualityState>((set) => ({
  profile: getInitialProfile(),
  settings: PROFILE_SETTINGS[getInitialProfile()],
  
  stepUp: () => set((state) => {
    const currentIndex = PROFILES.indexOf(state.profile);
    if (currentIndex > 0) {
      const newProfile = PROFILES[currentIndex - 1];
      console.log(`[PerformanceMonitor] Stepping UP quality to: ${newProfile}`);
      return { profile: newProfile, settings: PROFILE_SETTINGS[newProfile] };
    }
    return state;
  }),
  
  stepDown: () => set((state) => {
    const currentIndex = PROFILES.indexOf(state.profile);
    if (currentIndex < PROFILES.length - 1) {
      const newProfile = PROFILES[currentIndex + 1];
      console.log(`[PerformanceMonitor] Stepping DOWN quality to: ${newProfile}`);
      return { profile: newProfile, settings: PROFILE_SETTINGS[newProfile] };
    }
    return state;
  })
}));
