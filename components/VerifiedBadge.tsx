"use client";

/**
 * VerifiedBadge — pixel-accurate Instagram / Meta verified checkmark
 * blue = #3797f0 (Instagram standard)
 * gold = #f0b429 (Meta Verified business)
 */
interface Props { type: "blue" | "gold"; size?: number; }

export default function VerifiedBadge({ type, size = 16 }: Props) {
  const bg = type === "gold" ? "#f0b429" : "#3797f0";
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", flexShrink: 0, verticalAlign: "middle" }}
      aria-label={type === "gold" ? "Meta Verified (ouro)" : "Conta verificada"}
    >
      {/* IG badge shape: rounded star / shield — simplified as circle for fidelity */}
      <circle cx="12" cy="12" r="11" fill={bg} />
      {/* White checkmark — same proportions as Instagram's badge */}
      <polyline
        points="7.5,12.5 10.5,15.5 16.5,9.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
