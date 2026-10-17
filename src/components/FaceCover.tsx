"use client";

import { useEffect, useRef, useState } from "react";
import { faceBoxFromPixels, objectPosition, type FaceBox } from "@/lib/faceFocus";

type FaceCoverProps = {
  src: string;
  alt: string;
  className?: string;
};

type FaceDetectorLike = {
  detect: (source: CanvasImageSource) => Promise<{ boundingBox: DOMRectReadOnly }[]>;
};

export default function FaceCover({ src, alt, className = "" }: FaceCoverProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const faceRef = useRef<FaceBox | null>(null);
  const [position, setPosition] = useState("center top");

  function place() {
    const image = imageRef.current;
    const frame = image?.parentElement;
    if (!image || !frame || !image.naturalWidth) return;
    const rect = frame.getBoundingClientRect();
    const next = faceRef.current
      ? objectPosition(faceRef.current, image.naturalWidth, image.naturalHeight, rect.width, rect.height)
      : image.naturalHeight > image.naturalWidth
        ? "center top"
        : "center";
    setPosition((current) => (current === next ? current : next));
  }

  async function analyze() {
    const image = imageRef.current;
    if (!image?.naturalWidth) return;
    faceRef.current = (await detectWithBrowser(image)) ?? boxFromCanvas(image);
    place();
  }

  useEffect(() => {
    const image = imageRef.current;
    const frame = image?.parentElement;
    if (!frame) return;
    if (image?.complete) void analyze();
    const observer = new ResizeObserver(() => place());
    observer.observe(frame);
    return () => observer.disconnect();
    // Re-bind when the photo changes. analyze/place read refs, not render state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      onLoad={() => void analyze()}
      style={{ objectPosition: position, transformOrigin: position }}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

async function detectWithBrowser(image: HTMLImageElement): Promise<FaceBox | null> {
  const Detector = (window as Window & { FaceDetector?: new (options?: { fastMode?: boolean; maxDetectedFaces?: number }) => FaceDetectorLike }).FaceDetector;
  if (!Detector) return null;
  try {
    const faces = await new Detector({ fastMode: true, maxDetectedFaces: 8 }).detect(image);
    if (faces.length === 0) return null;
    const left = Math.min(...faces.map((face) => face.boundingBox.x)) / image.naturalWidth;
    const top = Math.min(...faces.map((face) => face.boundingBox.y)) / image.naturalHeight;
    const right = Math.max(...faces.map((face) => face.boundingBox.x + face.boundingBox.width)) / image.naturalWidth;
    const bottom = Math.max(...faces.map((face) => face.boundingBox.y + face.boundingBox.height)) / image.naturalHeight;
    if (right - left < 0.02 || bottom - top < 0.02) return null;
    return { left, top, right, bottom };
  } catch {
    return null;
  }
}

function boxFromCanvas(image: HTMLImageElement): FaceBox | null {
  const width = 160;
  const height = Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * width));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(image, 0, 0, width, height);
  try {
    return faceBoxFromPixels(context.getImageData(0, 0, width, height).data, width, height);
  } catch {
    return null;
  }
}
