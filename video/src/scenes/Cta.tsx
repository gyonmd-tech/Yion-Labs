import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo } from "../components/Logo";
import { enter, fadeUp } from "../components/anim";
import { brand } from "../data";
import { colors, fonts, radius } from "../theme";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = enter(frame, fps);
  const b = enter(frame, fps, 10);
  const c = enter(frame, fps, 20);

  return (
    <AbsoluteFill style={{ background: colors.primary, alignItems: "center", justifyContent: "center", gap: 44 }}>
      <div style={fadeUp(a)}>
        <Logo size={88} color={colors.primaryForeground} markColor={colors.primaryForeground} />
      </div>
      <h2 style={{ ...fadeUp(b), fontFamily: fonts.heading, fontWeight: 800, fontSize: 84, color: colors.primaryForeground, margin: 0, textAlign: "center" }}>
        {brand.signupBonus} kredit gratis untuk pengguna baru
      </h2>
      <div
        style={{
          ...fadeUp(c),
          background: colors.bg,
          color: colors.primary,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 40,
          padding: "26px 64px",
          borderRadius: radius.control,
        }}
      >
        Coba gratis
      </div>
    </AbsoluteFill>
  );
};
