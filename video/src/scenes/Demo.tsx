import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../components/Icon";
import { enter, exitOpacity, fadeUp } from "../components/anim";
import { demo } from "../data";
import { colors, fonts, radius } from "../theme";

// Linimasa adegan (frame lokal)
const TYPE_START = 15;
const TYPE_END = 105;
const CLICK = 118;
const RESULT = 150;

const priorityStyle: Record<string, { bg: string; fg: string }> = {
  Wajib: { bg: colors.accent, fg: colors.primary },
  Sebaiknya: { bg: colors.bg, fg: colors.text },
  Nanti: { bg: colors.bgSubtle, fg: colors.textMuted },
};

const SkeletonBar: React.FC<{ width: string; height?: number }> = ({ width, height = 22 }) => (
  <div style={{ width, height, borderRadius: 8, background: colors.accent }} />
);

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const chars = Math.round(
    interpolate(frame, [TYPE_START, TYPE_END], [0, demo.idea.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const typed = demo.idea.slice(0, chars);
  const caretOn = frame < CLICK && Math.floor(frame / 15) % 2 === 0;
  const press = interpolate(frame, [CLICK, CLICK + 4, CLICK + 10], [1, 0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const loading = frame >= CLICK && frame < RESULT;
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin(frame / 8));
  const title = enter(frame, fps);

  return (
    <AbsoluteFill style={{ background: colors.bgSubtle, padding: "70px 120px", gap: 36, opacity: exitOpacity(frame, durationInFrames) }}>
      <div style={{ ...fadeUp(title), display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 60, color: colors.text, margin: 0 }}>
          Ide satu paragraf, jadi PRD satu halaman
        </h2>
        <span style={{ fontFamily: fonts.body, fontSize: 24, color: colors.textMuted }}>Ilustrasi</span>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1.25fr", background: colors.bg, borderRadius: 24, border: `2px solid ${colors.border}`, overflow: "hidden" }}>
        {/* Panel input */}
        <div style={{ padding: 44, borderRight: `2px solid ${colors.border}`, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: radius.control, background: colors.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="file-text" size={28} color={colors.primary} />
            </div>
            <span style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 34, color: colors.text }}>PRD Mini</span>
          </div>
          <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 24, color: colors.text }}>Ide produk kamu</span>
          <div style={{ minHeight: 260, border: `2px solid ${frame < CLICK ? colors.primary : colors.border}`, borderRadius: radius.control, padding: 24, fontFamily: fonts.body, fontSize: 28, lineHeight: 1.5, color: colors.text }}>
            {typed}
            <span style={{ opacity: caretOn ? 1 : 0, color: colors.primary }}>|</span>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 20, color: colors.primary, background: colors.accent, padding: "6px 14px", borderRadius: 999 }}>Gratis</span>
            <span style={{ fontFamily: fonts.body, fontSize: 22, color: colors.textMuted }}>Sisa {frame >= RESULT ? 2 : 3} dari 3 hari ini</span>
          </div>
          <div
            style={{
              transform: `scale(${press})`,
              background: colors.primary,
              opacity: loading ? 0.6 : 1,
              color: colors.primaryForeground,
              borderRadius: radius.control,
              height: 76,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 28,
            }}
          >
            {loading ? "Sedang menyusun..." : "Buat PRD"}
          </div>
        </div>

        {/* Panel hasil */}
        <div style={{ padding: 44, background: colors.bgSubtle, display: "flex", flexDirection: "column", gap: 22 }}>
          {frame < CLICK && (
            <div style={{ flex: 1, border: `2px dashed ${colors.border}`, borderRadius: radius.card, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.body, fontSize: 26, color: colors.textMuted }}>
              Hasil muncul di sini
            </div>
          )}
          {loading && (
            <div style={{ background: colors.bg, borderRadius: radius.card, border: `2px solid ${colors.border}`, padding: 36, display: "flex", flexDirection: "column", gap: 20, opacity: pulse }}>
              <SkeletonBar width="60%" height={38} />
              <SkeletonBar width="95%" />
              <SkeletonBar width="80%" />
              <SkeletonBar width="40%" height={28} />
              <SkeletonBar width="100%" height={60} />
              <SkeletonBar width="100%" height={60} />
            </div>
          )}
          {frame >= RESULT && (
            <div style={{ background: colors.bg, borderRadius: radius.card, border: `2px solid ${colors.border}`, padding: 36, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={fadeUp(enter(frame, fps, RESULT))}>
                <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 40, color: colors.text }}>{demo.productName}</div>
                <div style={{ fontFamily: fonts.body, fontSize: 24, color: colors.textMuted, marginTop: 8 }}>{demo.oneLiner}</div>
              </div>
              <div style={{ ...fadeUp(enter(frame, fps, RESULT + 8)), fontFamily: fonts.heading, fontWeight: 700, fontSize: 26, color: colors.text, marginTop: 6 }}>Fitur</div>
              {demo.features.map((f, i) => {
                const s = enter(frame, fps, RESULT + 12 + i * 6);
                const st = priorityStyle[f.priority];
                return (
                  <div key={f.name} style={{ ...fadeUp(s, 16), display: "flex", alignItems: "center", gap: 14, border: `2px solid ${colors.border}`, borderRadius: 12, padding: "14px 18px" }}>
                    <span style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 24, color: colors.text }}>{f.name}</span>
                    <span style={{ fontFamily: fonts.body, fontSize: 18, fontWeight: 500, color: st.fg, background: st.bg, border: `2px solid ${colors.border}`, borderRadius: 999, padding: "2px 12px" }}>{f.priority}</span>
                  </div>
                );
              })}
              <div style={{ ...fadeUp(enter(frame, fps, RESULT + 40)), display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
                {demo.mvp.map((item) => (
                  <span key={item} style={{ fontFamily: fonts.body, fontSize: 20, color: colors.text, background: colors.successSubtle, border: `2px solid ${colors.successBorder}`, borderRadius: 999, padding: "6px 16px" }}>
                    MVP: {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
