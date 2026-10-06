import { Composition } from "remotion";
import { LabsPromo, TOTAL_FRAMES } from "./LabsPromo";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="LabsPromo"
    component={LabsPromo}
    durationInFrames={TOTAL_FRAMES}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
