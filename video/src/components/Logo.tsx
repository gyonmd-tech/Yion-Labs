import { colors, fonts } from "../theme";
import { brand } from "../data";

export const Logo: React.FC<{ size: number; color?: string; markColor?: string }> = ({
  size,
  color = colors.text,
  markColor = colors.primary,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.35 }}>
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: markColor }} />
    <span style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: size * 1.05, color }}>{brand.name}</span>
  </div>
);
