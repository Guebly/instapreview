"use client";

/**
 * VerifiedBadge
 * Renders the correct Instagram / Meta verified checkmark.
 *
 * blue → Meta Verified (standard) — circle #3797f0 + white ✓
 * gold → Meta Verified (businesses / notable) — circle #f0b429 + white ✓
 */

interface Props {
  type: "blue" | "gold";
  size?: number;
}

export default function VerifiedBadge({ type, size = 16 }: Props) {
  const color = type === "gold" ? "#f0b429" : "#3797f0";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={type === "gold" ? "Meta Verified (ouro)" : "Conta verificada"}
      style={{ flexShrink: 0, display: "inline-block" }}
    >
      {/* Outer circle */}
      <circle cx="20" cy="20" r="20" fill={color} />
      {/* Checkmark — same proportions as Instagram's SVG */}
      <path
        d="M11.5 20.5 L17.5 26.5 L29 15"
        stroke="white"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
