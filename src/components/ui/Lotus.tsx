"use client";

/**
 * Decorative gold divider — ornamental flourish.
 * Used between couple names and event details.
 */
export function Lotus({
  className = "",
  color = "#CDA24E",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      width="80"
      height="16"
      viewBox="0 0 80 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left curl */}
      <path
        d="M12 8 C12 8 16 2 24 4 C28 5 30 8 30 8"
        stroke={color}
        strokeWidth="0.7"
        opacity="0.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M16 12 C16 12 20 6 28 7"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Center diamond */}
      <path
        d="M36 8 L40 4 L44 8 L40 12 Z"
        fill={color}
        opacity="0.4"
      />
      <path
        d="M38 8 L40 6 L42 8 L40 10 Z"
        fill={color}
        opacity="0.6"
      />

      {/* Right curl — mirrored */}
      <path
        d="M68 8 C68 8 64 2 56 4 C52 5 50 8 50 8"
        stroke={color}
        strokeWidth="0.7"
        opacity="0.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M64 12 C64 12 60 6 52 7"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Thin lines extending out */}
      <line x1="4" y1="8" x2="30" y2="8" stroke={color} strokeWidth="0.3" opacity="0.2" />
      <line x1="50" y1="8" x2="76" y2="8" stroke={color} strokeWidth="0.3" opacity="0.2" />
    </svg>
  );
}
