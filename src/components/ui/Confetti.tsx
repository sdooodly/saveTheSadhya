"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  drift: number;
  rotation: number;
  scale: number;
  delay: number;
  color: string;
}

const PETAL_COLORS = [
  "#E8C4C4", // blush
  "#D4A89A", // dusty rose
  "#C9B99A", // champagne
  "#B8C4B8", // sage
  "#D4C5A9", // wheat
];

function createPetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    drift: (Math.random() - 0.5) * 30,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    delay: Math.random() * 0.6,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  }));
}

export function Confetti({ active }: { active: boolean }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (active) {
      setPetals(createPetals(24));
      const timer = setTimeout(() => setPetals([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {petals.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              left: `${p.x}%`,
              top: "-3%",
              rotate: 0,
              scale: 0,
              opacity: 0.8,
            }}
            animate={{
              top: "105%",
              left: `${p.x + p.drift}%`,
              rotate: p.rotation,
              scale: p.scale,
              opacity: [0.8, 0.7, 0.5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3.5 + Math.random(),
              delay: p.delay,
              ease: "easeOut",
            }}
            className="absolute"
          >
            {/* Simple oval petal */}
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <ellipse
                cx="7"
                cy="10"
                rx="5"
                ry="9"
                fill={p.color}
                opacity="0.7"
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
