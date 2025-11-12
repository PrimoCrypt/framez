export const colors = {
  background: {
    primary: "#000000",
    secondary: "#1a1a1a",
    tertiary: "#0f0f0f",
  },
  
  text: {
    primary: "#FFFFF0", 
    secondary: "#E6E6D4", 
    muted: "#B8B8A8", 
    inverse: "#000000", 
  },
  
  accent: {
    gold: "#FFD700",
    goldLight: "#FFE44D",
    goldDark: "#CCAA00",
  },
	
  button: {
    primary: {
      background: "#FFD700",
      text: "#FFFFF0",
      pressed: "#CCAA00",
    },
    secondary: {
      background: "transparent",
      border: "#FFD700",
      text: "#FFD700",
      pressed: "#1a1a1a",
    },
  },
  
  border: {
    default: "#333333",
    accent: "#FFD700",
    muted: "#1a1a1a",
  },
  
  status: {
    error: "#FF4444",
    success: "#44FF44",
    warning: "#FFAA00",
    info: "#44AAFF",
  },
} as const;

export type Colors = typeof colors;

