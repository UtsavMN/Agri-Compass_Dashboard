export const UI_SPRING = { 
  type: "spring" as const, 
  stiffness: 400, 
  damping: 25, 
  mass: 1 
};

export const LAYOUT_SPRING = { 
  type: "spring" as const, 
  stiffness: 250, 
  damping: 25, 
  mass: 1 
};

export const ATMOSPHERIC_SPRING = { 
  type: "spring" as const, 
  stiffness: 100, 
  damping: 20, 
  mass: 1 
};
