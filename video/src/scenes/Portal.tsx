import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { enter, exitOpacity, fadeUp } from "../components/anim";
import { brand, modules } from "../data";
import { colors, fonts, radius } from "../theme";

export const Portal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const frameIn = enter(frame, fps);
  const caption = enter(frame, fps, 8);

  return (
    <AbsoluteFill
      style={{
        background: colors.bgSubtle,
        alignItems: "center",
        justifyContent: "center",
        gap: 44,
        opacity: exitOpacity(frame, durationInFrames),
      }}
    >
      <h2 style={{ ...fadeUp(caption), fontFamily: fonts.heading, fontWeight: 800, fontSize: 64, color: colors.text, margin: 0 }}>
        Satu akun, satu saldo, banyak alat
      </h2>

      <div
        style={{
          width: 1560,
          height: 760,
          background: colors.bg,
          borderRadius: 24,
          border: `2px solid ${colors.border}`,
          boxShadow: "0 40px 80px rgba(91, 61, 245, 0.12)",
          display: "flex",
          overflow: "hidden",
          opacity: frameIn,
          transform: `translateY(${interpolate(frameIn, [0, 1], [60, 0])}px)`,
        }}
      >
        {/* Sidebar */}
        <div style={{ width: 300, borderRight: `2px solid ${colors.border}`, padding: 28, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ marginBottom: 24 }}>
            <Logo size={32} />
          </div>
          {modules.map((m) => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: radius.control, fontFamily: fonts.body, fontSize: 22, color: colors.textMuted }}>
              <Icon name={m.icon} size={24} color={colors.textMuted} />
              {m.name}
            </div>
          ))}
        </div>

        {/* Konten */}
        <div style={{ flex: 1, padding: 44, display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 40, color: colors.text }}>Halo, selamat datang</span>
            <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 26, color: colors.primary, background: colors.accent, padding: "10px 22px", borderRadius: 999 }}>
              {brand.signupBonus} kredit
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {modules.map((m, i) => {
              const s = enter(frame, fps, 18 + i * 7);
              const active = m.status === "Aktif";
              return (
                <div
                  key={m.name}
                  style={{
                    ...fadeUp(s, 24),
                    border: `2px solid ${active ? colors.primary : colors.border}`,
                    borderRadius: radius.card,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    background: colors.bg,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: radius.control, background: colors.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={m.icon} size={28} color={colors.primary} />
                    </div>
                    <span style={{ fontFamily: fonts.body, fontSize: 18, fontWeight: 500, color: colors.text, border: `2px solid ${colors.border}`, borderRadius: 999, padding: "4px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 8, background: active ? colors.success : colors.textMuted }} />
                      {m.status}
                    </span>
                  </div>
                  <span style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 28, color: colors.text }}>{m.name}</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 20, color: colors.textMuted }}>{m.tagline}</span>
                  <span style={{ alignSelf: "flex-start", fontFamily: fonts.body, fontWeight: 600, fontSize: 18, color: colors.primary, background: colors.accent, padding: "6px 14px", borderRadius: 999 }}>
                    {m.cost}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
