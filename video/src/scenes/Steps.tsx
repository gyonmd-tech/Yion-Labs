import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enter, exitOpacity, fadeUp } from "../components/anim";
import { brand } from "../data";
import { colors, fonts } from "../theme";

const steps = [
  { title: "Daftar gratis", body: `Langsung dapat ${brand.signupBonus} kredit untuk mencoba.` },
  { title: "Pilih modul, isi form", body: "Biaya kredit terlihat sebelum kamu menekan tombol." },
  { title: "Ambil hasil yang cocok", body: "Semua hasil tersimpan di Library akunmu." },
];

export const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: colors.bg, padding: 160, justifyContent: "center", gap: 64, opacity: exitOpacity(frame, durationInFrames) }}>
      <h2 style={{ ...fadeUp(enter(frame, fps)), fontFamily: fonts.heading, fontWeight: 800, fontSize: 72, color: colors.text, margin: 0 }}>
        Cara kerjanya
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 56 }}>
        {steps.map((s, i) => (
          <div key={s.title} style={{ ...fadeUp(enter(frame, fps, 10 + i * 10)), display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ width: 84, height: 84, borderRadius: 84, background: colors.primary, color: colors.primaryForeground, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.heading, fontWeight: 800, fontSize: 40 }}>
              {i + 1}
            </div>
            <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 44, color: colors.text }}>{s.title}</div>
            <div style={{ fontFamily: fonts.body, fontSize: 30, lineHeight: 1.45, color: colors.textMuted }}>{s.body}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
