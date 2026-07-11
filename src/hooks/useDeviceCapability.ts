import { useMemo } from "react";

export const useDeviceCapability = () => {
  return useMemo(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const hasWebGL = !!gl;

    return {
      isMobile,
      prefersReducedMotion,
      hasWebGL,
      shouldRender3D: hasWebGL && !prefersReducedMotion,
      particleCount: isMobile ? 60 : 250,
      shadowMapSize: isMobile ? 512 : 2048,
    };
  }, []);
};
