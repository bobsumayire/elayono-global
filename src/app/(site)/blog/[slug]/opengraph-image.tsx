import { ImageResponse } from "next/og";
import { getPublishedPost } from "@/lib/cms/read";
import { SHARE_FALLBACK, articleShareSource } from "@/lib/share";
import { loadArticlePhoto } from "@/lib/sharePhoto";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Elayono Global";

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  const source = post ? articleShareSource(post) : SHARE_FALLBACK;
  const id = Buffer.from(source).toString("base64url").replace(/=+$/, "").slice(0, 48);
  return [{ id, alt, size, contentType }];
}

export default async function ArticleShareImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  const photo = await loadArticlePhoto(post ? articleShareSource(post) : "/photos/hero-news.jpg");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0b2a1f",
        }}
      >
        {photo ? (
          <img src={photo} alt="" width={1200} height={630} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 220,
            display: "flex",
            background: "linear-gradient(to top, rgba(11,42,31,0.78), rgba(11,42,31,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 40,
            bottom: 36,
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#ffffff",
            borderRadius: 20,
            padding: "14px 26px 14px 16px",
            boxShadow: "0 12px 28px rgba(11,42,31,0.35)",
          }}
        >
          <svg width="72" height="72" viewBox="0 0 200 200">
            <path d="M96 118 C60 96 34 100 18 128 C50 108 70 122 88 138 Z" fill="#86D2A3" />
            <path d="M100 112 C74 94 54 96 40 116 C64 100 80 112 94 128 Z" fill="#4FB877" />
            <path d="M132 34 C138 46 136 58 124 66 C130 54 128 46 118 40 C124 36 128 34 132 34 Z" fill="#239a54" />
            <path d="M124 66 C130 72 138 74 146 70 C140 78 128 80 120 74 Z" fill="#239a54" />
            <path d="M92 40 H108 V78 H140 V94 H108 V150 H92 V94 H60 V78 H92 Z" fill="#239a54" />
            <path
              d="M100 128 C82 118 62 118 48 130 V150 C62 140 82 140 100 150 C118 140 138 140 152 150 V130 C138 118 118 118 100 128 Z"
              fill="#ffffff"
              stroke="#146536"
              strokeWidth="4"
            />
            <path d="M100 128 V150" stroke="#146536" strokeWidth="4" />
            <path d="M18 176 C48 140 80 150 100 150 C120 150 152 140 182 176 Z" fill="#0d331d" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#0b2a1f", letterSpacing: 1.4 }}>ELAYONO GLOBAL</span>
            <span style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: "#187c42", letterSpacing: 2.2 }}>
              ONE FAMILY · ONE FAITH
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
