import { interpolate, spring } from "remotion";

/** Muncul dari bawah dengan pegas; 0 -> 1. */
export function enter(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 20 });
}

export function fadeUp(progress: number, distance = 30): React.CSSProperties {
  return { opacity: progress, transform: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)` };
}

/** Pudar keluar di akhir adegan. */
export function exitOpacity(frame: number, duration: number, length = 10) {
  return interpolate(frame, [duration - length, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
