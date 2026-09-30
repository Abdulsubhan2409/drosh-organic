import React from "react";

export default function Logo({ className = "", mark = false, variant = "dark" }) {
  const color = variant === "light" ? "#FDFCFB" : "#121212";
  const gold = "#D4AF37";
  const green = "#2E3D32";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-8 w-8 shrink-0"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="23" stroke={gold} strokeWidth="1.2" />
        <path
          d="M24 9 C 17 18, 14 24, 24 39 C 34 24, 31 18, 24 9 Z"
          fill={green}
          opacity="0.92"
        />
        <path
          d="M24 12 L24 37"
          stroke={gold}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M24 20 C 20 22, 19 25, 24 28 M24 20 C 28 22, 29 25, 24 28"
          stroke={gold}
          strokeWidth="0.8"
          fill="none"
        />
      </svg>
      {!mark && (
        <span
          className="font-display text-xl tracking-tight leading-none"
          style={{ color }}
        >
          Drosh <span style={{ color: gold }}>Organic</span>
        </span>
      )}
    </span>
  );
}