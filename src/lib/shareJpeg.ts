import { decode } from "fast-png";
import { encode } from "jpeg-js";

/** Where a cover photo should sit in the 1200×630 card. Tall photos keep the top, where the face is. */
export function coverPosition(dataUrl: string) {
  const size = imageSize(dataUrl);
  if (!size) return "center top";
  return size.height > size.width ? "center top" : "center";
}

function imageSize(dataUrl: string) {
  const comma = dataUrl.indexOf(",");
  if (comma < 0) return null;
  const bytes = Buffer.from(dataUrl.slice(comma + 1), "base64");
  if (dataUrl.startsWith("data:image/png")) return pngSize(bytes);
  return jpegSize(bytes);
}

function pngSize(bytes: Buffer) {
  if (bytes.length < 24 || bytes[0] !== 0x89) return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function jpegSize(bytes: Buffer) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
    }
    const length = bytes.readUInt16BE(offset + 2);
    if (length < 2) return null;
    offset += 2 + length;
  }
  return null;
}

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
