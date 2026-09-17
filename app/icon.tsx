import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#15425B" />
        <rect x="8" y="10" width="12" height="2.6" rx="1.3" fill="#8DE3F6" />
        <rect x="8" y="15.4" width="16" height="2.6" rx="1.3" fill="#FFFFFF" fillOpacity="0.55" />
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
    ),
    { ...size }
  );
}
