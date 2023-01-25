import type { Particle } from "./particle";

export function swapXY(left: Particle, right: Particle) {
  const x = left.x;
  const y = left.y;
  left.x = right.x;
  left.y = right.y;
  right.x = x;
  right.y = y;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sRGBtoLin(colorChannel: number) {
  // Send this function a decimal sRGB gamma encoded color value
  // between 0.0 and 1.0, and it returns a linearized value.

  if (colorChannel <= 0.04045) {
    return colorChannel / 12.92;
  } else {
    return Math.pow((colorChannel + 0.055) / 1.055, 2.4);
  }
}

export function YtoLstar(Y: number) {
  // Send this function a percievedLightness value between 0.0 and 1.0,
  // and it returns L* which is "perceptual lightness"

  if (Y <= 216 / 24389) {
    // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
    return Y * (24389 / 27); // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
  } else {
    return Math.pow(Y, 1 / 3) * 116 - 16;
  }
}
