import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Token dari docs/design-system.md (sama dengan app/globals.css).
export const colors = {
  primary: "#5B3DF5",
  primaryForeground: "#FFFFFF",
  bg: "#FFFFFF",
  bgSubtle: "#F7F6FB",
  accent: "#EFEBFE",
  text: "#14121F",
  textMuted: "#6B6880",
  border: "#E6E4F0",
  success: "#12A150",
  successSubtle: "#E8F6EE",
  successBorder: "#BFE6CF",
  warning: "#E8A200",
} as const;

// Font di-host sendiri (public/fonts, lisensi SIL OFL), tidak dimuat dari CDN.
const fontFiles = [
  { family: "Inter", weight: "400", file: "inter-latin-400-normal.woff2" },
  { family: "Inter", weight: "500", file: "inter-latin-500-normal.woff2" },
  { family: "Inter", weight: "600", file: "inter-latin-600-normal.woff2" },
  { family: "Plus Jakarta Sans", weight: "700", file: "plus-jakarta-sans-latin-700-normal.woff2" },
  { family: "Plus Jakarta Sans", weight: "800", file: "plus-jakarta-sans-latin-800-normal.woff2" },
];

for (const f of fontFiles) {
  void loadFont({ family: f.family, weight: f.weight, url: staticFile(`fonts/${f.file}`), format: "woff2" });
}

export const fonts = {
  heading: "'Plus Jakarta Sans', sans-serif",
  body: "Inter, sans-serif",
} as const;

export const radius = { card: 16, control: 10 } as const;

export const VIDEO = { width: 1920, height: 1080, fps: 30 } as const;
