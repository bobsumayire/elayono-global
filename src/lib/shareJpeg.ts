import { decode } from "fast-png";
import { encode } from "jpeg-js";

export function pngToJpeg(png: ArrayBuffer) {
  const image = decode(new Uint8Array(png));
  const pixels = image.channels === 4 ? new Uint8Array(image.data) : rgba(new Uint8Array(image.data), image.channels);
  return encode({ data: pixels, width: image.width, height: image.height }, 60).data;
}

function rgba(pixels: Uint8Array, channels: number) {
  const count = pixels.length / channels;
  const out = new Uint8Array(count * 4);
  for (let index = 0; index < count; index += 1) {
    out[index * 4] = pixels[index * channels];
    out[index * 4 + 1] = pixels[index * channels + 1] ?? pixels[index * channels];
    out[index * 4 + 2] = pixels[index * channels + 2] ?? pixels[index * channels];
    out[index * 4 + 3] = 255;
  }
  return out;
}
