import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo } from "../components/Logo";
import { enter, exitOpacity, fadeUp } from "../components/anim";
import { brand } from "../data";
import { colors, fonts } from "../theme";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const logo = enter(frame, fps);
  const tagline = enter(frame, fps, 15);

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        opacity: exitOpacity(frame, durationInFrames),
      }}
    >
      <div style={{ transform: `scale(${0.8 + 0.2 * logo})`, opacity: logo }}>
        <Logo size={120} />
      </div>
      <p style={{ ...fadeUp(tagline), fontFamily: fonts.body, fontSize: 44, color: colors.textMuted, margin: 0 }}>
        {brand.tagline}
      </p>
    </AbsoluteFill>
  );
};
