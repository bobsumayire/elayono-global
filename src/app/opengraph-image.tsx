import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0B2A1F 0%, #124A29 60%, #187C42 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="70" height="70" viewBox="0 0 200 200">
            <path d="M96 118 C60 96 34 100 18 128 C50 108 70 122 88 138 Z" fill="#86D2A3" />
            <path d="M100 112 C74 94 54 96 40 116 C64 100 80 112 94 128 Z" fill="#4FB877" />
            <path d="M92 40 H108 V78 H140 V94 H108 V150 H92 V94 H60 V78 H92 Z" fill="#ffffff" />
            <path
              d="M100 128 C82 118 62 118 48 130 V150 C62 140 82 140 100 150 C118 140 138 140 152 150 V130 C138 118 118 118 100 128 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
            />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 800, color: "#ffffff", letterSpacing: 2 }}>
            ELAYONO GLOBAL
          </span>
        </div>
        <span style={{ marginTop: 48, fontSize: 56, fontWeight: 800, color: "#ffffff", maxWidth: 900, lineHeight: 1.15 }}>
          {siteConfig.tagline}
        </span>
        <span style={{ marginTop: 24, fontSize: 26, color: "#D6F2E1", maxWidth: 820 }}>
          {siteConfig.description}
        </span>
      </div>
    ),
    { ...size }
  );
}
