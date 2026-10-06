import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enter, exitOpacity, fadeUp } from "../components/anim";
import { colors, fonts } from "../theme";

const pains = ["Foto produk", "Copy marketplace", "Halaman jualan", "Ide konten harian"];
const answers = ["Bahasa Indonesia", "Bayar per hasil", "Lihat dulu, baru bayar"];

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const title = enter(frame, fps);
  const answer = enter(frame, fps, 60);

  return (
    <AbsoluteFill
      style={{
        background: colors.bgSubtle,
        padding: 160,
        justifyContent: "center",
        gap: 56,
        opacity: exitOpacity(frame, durationInFrames),
      }}
    >
      <h1 style={{ ...fadeUp(title), fontFamily: fonts.heading, fontWeight: 800, fontSize: 96, color: colors.text, margin: 0, letterSpacing: -2 }}>
        Konten jualan makan waktu?
      </h1>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {pains.map((p, i) => {
          const s = enter(frame, fps, 12 + i * 6);
          return (
            <span
              key={p}
              style={{
                ...fadeUp(s, 20),
                fontFamily: fonts.body,
                fontWeight: 500,
                fontSize: 38,
                padding: "18px 32px",
                borderRadius: 999,
                background: colors.bg,
                border: `2px solid ${colors.border}`,
                color: colors.textMuted,
              }}
            >
              {p}
            </span>
          );
        })}
      </div>
      <div style={{ ...fadeUp(answer), display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 48, color: colors.primary }}>Labs:</span>
        {answers.map((a) => (
          <span key={a} style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 44, color: colors.text }}>
            {a}
            <span style={{ color: colors.primary }}> ·</span>
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
