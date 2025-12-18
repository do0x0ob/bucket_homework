export const COLORS = {
  background: "#f5f5f0",
  primary: "#f4d03f",
  success: "#52b788",
  danger: "#d62828",
  black: "#000",
  white: "#fff",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
  },
} as const;

export const SHADOWS = {
  retro: "2px 2px 0px 0px",
  retroLarge: "4px 4px 0px 0px",
  inset: "inset 2px 2px 0px 0px",
} as const;

export const BORDERS = {
  default: "2px",
  black: `2px solid ${COLORS.black}`,
} as const;

