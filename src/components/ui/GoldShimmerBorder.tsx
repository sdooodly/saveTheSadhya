"use client";

import { motion } from "framer-motion";

/**
 * Animated gold foil shimmer border that frames a container.
 * A thin glowing line that pulses with a travelling highlight.
 */
export function GoldShimmerBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      {/* Top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #B8860B, #DAA520, #B8860B, transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #B8860B, #DAA520, #B8860B, transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0%", "0% 0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Left */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-px"
        style={{
          background: "linear-gradient(180deg, transparent, #B8860B, #DAA520, #B8860B, transparent)",
          backgroundSize: "100% 200%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "0% 200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Right */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-px"
        style={{
          background: "linear-gradient(180deg, transparent, #B8860B, #DAA520, #B8860B, transparent)",
          backgroundSize: "100% 200%",
        }}
        animate={{ backgroundPosition: ["0% 200%", "0% 0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
