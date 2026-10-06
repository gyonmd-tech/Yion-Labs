import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);

// Opsional: pakai Chromium yang sudah terpasang (mis. di CI) lewat env.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
