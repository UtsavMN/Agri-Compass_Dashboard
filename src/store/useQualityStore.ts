import { create } from "zustand";

export type QualityProfile = "ultra" | "high" | "medium" | "low" | "mobile";

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
    dpr: 1.2,
    bloom: 1.2,
    volumetricFog: true,
    shadowMapSize: 2048,
    particleCount: 200,
    butterflyCount: 2,
    leafDensity: 1.0,
    windComplexity: "full",
  },
  high: {
    dpr: 1.0,
    bloom: 1.0,
    volumetricFog: true,
    shadowMapSize: 1024,
    particleCount: 150,
    butterflyCount: 1,
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
  },
  mobile: {
    dpr: 1.0,
    bloom: 0,
    volumetricFog: false,
    shadowMapSize: 512,
    particleCount: 30,
    butterflyCount: 0,
    leafDensity: 0.1,
    windComplexity: "simple",
  }
};

const PROFILES: QualityProfile[] = ["ultra", "high", "medium", "low", "mobile"];

// Guess initial profile based on hardware
const getInitialProfile = (): QualityProfile => {
  if (typeof window === "undefined") return "high";
  
  const isMobileOS = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isMobileWidth = window.innerWidth < 768;
  const isMobile = isMobileOS || isMobileWidth;
  
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  
  if (isMobile) {
    return "mobile";
  }
  
  return hardwareConcurrency >= 8 ? "ultra" : (hardwareConcurrency > 4 ? "high" : "medium");
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
