import { AbsoluteFill, Series } from "remotion";
import { Cta } from "./scenes/Cta";
import { Demo } from "./scenes/Demo";
import { Intro } from "./scenes/Intro";
import { Portal } from "./scenes/Portal";
import { Problem } from "./scenes/Problem";
import { Steps } from "./scenes/Steps";
import { colors } from "./theme";

// Durasi per adegan (frame, 30 fps). Total = 900 frame = 30 detik.
export const SCENES = { intro: 90, problem: 120, portal: 210, demo: 270, steps: 120, cta: 90 } as const;
export const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0);

export const LabsPromo: React.FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <Series>
      <Series.Sequence durationInFrames={SCENES.intro}>
        <Intro />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.problem}>
        <Problem />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.portal}>
        <Portal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.demo}>
        <Demo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.steps}>
        <Steps />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.cta}>
        <Cta />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
