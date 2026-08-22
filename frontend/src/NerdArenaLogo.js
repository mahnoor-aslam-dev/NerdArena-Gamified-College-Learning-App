import React from "react";

export default function NerdArenaLogo({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        {/* Orange to Light Pink Gradient */}
        <linearGradient id="nerdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff8a52" />
          <stop offset="50%" stopColor="#ff6b81" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        <linearGradient id="shieldInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f3f0fe" />
        </linearGradient>

        <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#ff8a52" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Hexagon Badge */}
      <path
        d="M50 6 L88 26 V74 L50 94 L12 74 V26 Z"
        fill="url(#nerdGrad)"
        filter="url(#badgeGlow)"
      />

      {/* Inner White Shield */}
      <path
        d="M50 14 L82 31 V69 L50 86 L18 69 V31 Z"
        fill="url(#shieldInner)"
      />

      {/* Stylized 'N' Arena Emblem */}
      <path
        d="M34 68 V32 L46 32 L58 54 V32 L68 32 V68 L56 68 L44 46 V68 Z"
        fill="url(#nerdGrad)"
      />

      {/* Gaming Lightning Accent inside Logo */}
      <path
        d="M52 22 L58 36 L48 40 L56 54 L44 38 L50 34 Z"
        fill="#ff8a52"
      />
    </svg>
  );
}