import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          borderRadius: 14,
        }}
      >
        <svg width="52" height="52" viewBox="0 0 200 200">
          <path d="M96 118 C60 96 34 100 18 128 C50 108 70 122 88 138 Z" fill="#86D2A3" />
          <path d="M100 112 C74 94 54 96 40 116 C64 100 80 112 94 128 Z" fill="#4FB877" />
          <path d="M132 34 C138 46 136 58 124 66 C130 54 128 46 118 40 C124 36 128 34 132 34 Z" fill="#239A54" />
          <path d="M124 66 C130 72 138 74 146 70 C140 78 128 80 120 74 Z" fill="#239A54" />
          <path d="M92 40 H108 V78 H140 V94 H108 V150 H92 V94 H60 V78 H92 Z" fill="#239A54" />
          <path
            d="M100 128 C82 118 62 118 48 130 V150 C62 140 82 140 100 150 C118 140 138 140 152 150 V130 C138 118 118 118 100 128 Z"
            fill="#ffffff"
            stroke="#146536"
            strokeWidth="4"
          />
          <path d="M18 176 C48 140 80 150 100 150 C120 150 152 140 182 176 Z" fill="#0D331D" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
