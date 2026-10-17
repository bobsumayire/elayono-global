export type FaceBox = {
  /** Fractions of the image, from 0 to 1. */
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/**
 * Object-position that keeps a face inside a cover crop.
 * When the frame is shorter than the face, the top of the face stays in view
 * so the head is not the part that gets cut off.
 */
export function objectPosition(
  box: FaceBox,
  imageWidth: number,
  imageHeight: number,
  frameWidth: number,
  frameHeight: number,
): string {
  if (frameWidth < 1 || frameHeight < 1 || imageWidth < 1 || imageHeight < 1) return "center top";
  const scale = Math.max(frameWidth / imageWidth, frameHeight / imageHeight);
  const x = axisPosition(box.left, box.right, frameWidth, imageWidth * scale);
  const y = axisPosition(box.top, box.bottom, frameHeight, imageHeight * scale);
  return `${x}% ${y}%`;
}

function axisPosition(start: number, end: number, frame: number, displayed: number): number {
  const windowFraction = frame / displayed;
  if (windowFraction >= 0.999) return 50;
  const margin = Math.min(0.03, Math.max(0, end - start) * 0.2);
  const regionStart = Math.max(0, start - margin);
  const regionEnd = Math.min(1, end + margin * 0.25);
  const span = Math.max(0, regionEnd - regionStart);
  let visibleStart = windowFraction >= span ? regionStart - (windowFraction - span) / 2 : regionStart;
  visibleStart = Math.min(Math.max(visibleStart, 0), Math.max(0, 1 - windowFraction));
  const position = (visibleStart * displayed) / (displayed - frame);
  return Math.round(Math.min(1, Math.max(0, position)) * 1000) / 10;
}

/** Largest skin region nearest the top of the photo. Hands lower in the frame are ignored. */
export function faceBoxFromPixels(pixels: Uint8ClampedArray, width: number, height: number): FaceBox | null {
  if (width < 2 || height < 2) return null;
  const rows: number[][] = Array.from({ length: height }, () => []);
  let skinCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      if (!isSkin(pixels[index], pixels[index + 1], pixels[index + 2])) continue;
      rows[y].push(x);
      skinCount++;
    }
  }
  if (skinCount < width * height * 0.01) return null;

  const minRow = Math.max(4, Math.round(width * 0.04));
  const active = rows.map((xs) => xs.length >= minRow);
  const closed = active.slice();
  for (let y = 0; y < height; y++) {
    if (closed[y]) continue;
    let previous = -1;
    let next = -1;
    for (let i = y - 1; i >= 0; i--) if (active[i]) { previous = i; break; }
    for (let i = y + 1; i < height; i++) if (active[i]) { next = i; break; }
    if (previous >= 0 && next >= 0 && next - previous <= 4) closed[y] = true;
  }

  const runs: { start: number; end: number; count: number }[] = [];
  let start = -1;
  for (let y = 0; y <= height; y++) {
    const on = y < height && closed[y];
    if (on && start < 0) start = y;
    if (!on && start >= 0) {
      let count = 0;
      for (let i = start; i < y; i++) count += rows[i].length;
      runs.push({ start, end: y, count });
      start = -1;
    }
  }
  if (runs.length === 0) return null;
  const biggest = Math.max(...runs.map((run) => run.count));
  const candidates = runs.filter((run) => run.count >= biggest * 0.35);
  const chosen = candidates.reduce((top, run) => (run.start < top.start ? run : top));
  const xs = rows.slice(chosen.start, chosen.end).flat().sort((a, b) => a - b);
  if (xs.length < 8) return null;
  const left = xs[Math.floor(xs.length * 0.08)] / width;
  const right = xs[Math.min(xs.length - 1, Math.ceil(xs.length * 0.92))] / width;
  return {
    left,
    top: chosen.start / height,
    right: Math.max(right, left + 0.02),
    bottom: chosen.end / height,
  };
}

function isSkin(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15 && max - min > 15;
  const dark = r > 45 && g > 28 && b > 15 && r > g && r >= b && max - min > 10 && Math.abs(r - g) > 8 && r - b > 8;
  return light || dark;
}
