"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Falling monstera leaves — shown when a guest RSVPs "yes".
 * Leaves are watercolour monstera leaves (public/leaves).
 * (Kept the `Confetti` name so existing imports keep working.)
 */

// Whole monstera leaves: four drawn, two cut from the invite painting.
const LEAVES = [
  "/leaves/monstera-1.png",
  "/leaves/monstera-2.png",
  "/leaves/monstera-3.png",
  "/leaves/monstera-4.png",
  "/leaves/monstera-5.png",
  "/leaves/monstera-6.png",
];

interface Leaf {
  id: number;
  src: string;
  x: number; // start, % of width
  sway: number; // side-to-side swing, px
  drift: number; // overall sideways drift, %
  spin: number; // total rotation, deg
  size: number; // px
  delay: number; // s
  duration: number; // s
}

function createLeaves(count: number): Leaf[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    src: LEAVES[i % LEAVES.length],
    x: Math.random() * 100,
    sway: 30 + Math.random() * 50,
    drift: (Math.random() - 0.5) * 30,
    spin: (Math.random() - 0.5) * 360,
    size: 22 + Math.random() * 30,
    delay: Math.random() * 1.6,
    duration: 4.5 + Math.random() * 2.5,
  }));
}

export function Confetti({ active }: { active: boolean }) {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = setTimeout(() => setLeaves(createLeaves(reduce ? 8 : 26)), 0);
    const end = setTimeout(() => setLeaves([]), 8500);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {leaves.map((l) => (
          <motion.div
            key={l.id}
            className="absolute"
            style={{ left: `${l.x}%`, top: "-8%", width: l.size }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{
              top: "108%",
              left: `${l.x + l.drift}%`,
              x: [0, l.sway, -l.sway * 0.7, l.sway * 0.5, 0],
              rotate: [0, l.spin * 0.4, l.spin * 0.7, l.spin],
              opacity: [0, 1, 1, 0.9, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: l.duration, delay: l.delay, ease: "easeIn" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}${l.src}`} alt="" draggable={false} className="w-full h-auto" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
