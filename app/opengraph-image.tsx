import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#15425B",
          backgroundImage:
            "radial-gradient(circle at 82% 20%, rgba(141,227,246,0.22), transparent 55%), radial-gradient(circle at 90% 85%, rgba(244,198,107,0.18), transparent 50%)",
        }}
      >
        <svg width="88" height="88" viewBox="0 0 32 32" style={{ marginBottom: 40 }}>
          <rect x="2" y="2" width="28" height="28" rx="8" fill="#4282A4" />
          <rect x="8" y="10" width="12" height="2.6" rx="1.3" fill="#8DE3F6" />
          <rect x="8" y="15.4" width="16" height="2.6" rx="1.3" fill="#FFFFFF" fillOpacity="0.6" />
          <circle cx="23.5" cy="22.5" r="5" fill="#F4C66B" />
          <path
            d="M21.4 22.6L22.9 24.1L25.9 21"
            stroke="#15425B"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            Ideabank
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 500, color: "#8DE3F6" }}>by PiJam</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 28,
            color: "#F4F2F1",
            maxWidth: 760,
            lineHeight: 1.4,
          }}
        >
          Track a student idea through Empathize, Define, Ideate, Prototype, and Test.
        </div>
      </div>
    ),
    { ...size }
  );
}
