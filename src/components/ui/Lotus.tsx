"use client";

/**
 * Lotus flower SVG — Kerala state flower.
 * Used as decorative divider between couple names and date.
 */
export function Lotus({
  className = "",
  color = "#2D6A6A",
  accentColor = "#B8860B",
}: {
  className?: string;
  color?: string;
  accentColor?: string;
}) {
  return (
    <svg
      className={className}
      width="48"
      height="28"
      viewBox="0 0 48 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Center petal — upright */}
      <ellipse cx="24" cy="10" rx="4" ry="10" fill={color} opacity="0.2" />
      <ellipse cx="24" cy="10" rx="4" ry="10" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />

      {/* Left petals */}
      <ellipse cx="24" cy="10" rx="3.5" ry="9.5" fill={color} opacity="0.15" transform="rotate(-25 24 14)" />
      <ellipse cx="24" cy="10" rx="3.5" ry="9.5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" transform="rotate(-25 24 14)" />

      <ellipse cx="24" cy="10" rx="3" ry="8.5" fill={color} opacity="0.1" transform="rotate(-50 24 14)" />
      <ellipse cx="24" cy="10" rx="3" ry="8.5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.25" transform="rotate(-50 24 14)" />

      {/* Right petals */}
      <ellipse cx="24" cy="10" rx="3.5" ry="9.5" fill={color} opacity="0.15" transform="rotate(25 24 14)" />
      <ellipse cx="24" cy="10" rx="3.5" ry="9.5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" transform="rotate(25 24 14)" />

      <ellipse cx="24" cy="10" rx="3" ry="8.5" fill={color} opacity="0.1" transform="rotate(50 24 14)" />
      <ellipse cx="24" cy="10" rx="3" ry="8.5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.25" transform="rotate(50 24 14)" />

      {/* Center pistil */}
      <circle cx="24" cy="12" r="2.5" fill={accentColor} opacity="0.25" />
      <circle cx="24" cy="12" r="1" fill={accentColor} opacity="0.4" />

      {/* Base water line */}
      <path d="M10 22 C14 20 18 21 24 19 C30 21 34 20 38 22" stroke={color} strokeWidth="0.5" opacity="0.2" fill="none" />
    </svg>
  );
}
