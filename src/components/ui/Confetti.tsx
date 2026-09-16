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
  type: "petal" | "dot";
}

/* Kerala wedding palette — gold, teal, warm accents */
const PETAL_COLORS = [
  "#DAA520", // gold
  "#B8860B", // dark gold / accent
  "#3A7D7B", // teal
  "#2D5A5A", // deep teal
  "#B5403A", // groom red
  "#D4A373", // warm sandalwood
  "#E4C87A", // kasavu gold (mundu border)
  "#C9B99A", // champagne
];

function createPetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    drift: (Math.random() - 0.5) * 40,
    rotation: Math.random() * 540,
    scale: 0.4 + Math.random() * 0.6,
    delay: Math.random() * 0.8,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    type: Math.random() > 0.3 ? "petal" : "dot",
  }));
}

export function Confetti({ active }: { active: boolean }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (active) {
      setPetals(createPetals(32));
      const timer = setTimeout(() => setPetals([]), 4500);
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
              top: "-4%",
              rotate: 0,
              scale: 0,
              opacity: 0.9,
            }}
            animate={{
              top: "108%",
              left: `${p.x + p.drift}%`,
              rotate: p.rotation,
              scale: p.scale,
              opacity: [0.9, 0.8, 0.5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3 + Math.random() * 1.5,
              delay: p.delay,
              ease: "easeOut",
            }}
            className="absolute"
          >
            {p.type === "petal" ? (
              /* Leaf-shaped petal — nod to banana leaf / flower petals */
              <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
                <path
                  d="M8 0 C12 4, 15 10, 8 22 C1 10, 4 4, 8 0Z"
                  fill={p.color}
                  opacity="0.65"
                />
              </svg>
            ) : (
              /* Small dot — like rice grains */
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <circle cx="3" cy="3" r="2.5" fill={p.color} opacity="0.5" />
              </svg>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
