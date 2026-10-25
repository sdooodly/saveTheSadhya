"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { weddingConfig } from "@/wedding.config";

/**
 * Live photo-booth "GIF": one ivory, gold-edged frame that cycles through
 * the booth pictures with a quick camera flash and a playful alternating tilt.
 * Pictures and timing live in wedding.config.ts → photoBooth.
 */
export function PhotoBooth({ className = "" }: { className?: string }) {
  const { photos, secondsPerPhoto } = weddingConfig.photoBooth;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  // Respect "reduce motion": cycle slowly, no flash or tilt.
  const intervalMs = (reduceMotion ? Math.max(secondsPerPhoto, 3) : secondsPerPhoto) * 1000;

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), intervalMs);
    return () => clearInterval(id);
  }, [photos.length, intervalMs]);

  const tilt = reduceMotion ? 0 : index % 2 === 0 ? -3 : 2.5;

  return (
    <motion.div
      animate={{ rotate: tilt }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`relative bg-paper border border-gold px-[3px] pt-[3px] pb-2.5
                  shadow-[0_2px_10px_rgba(15,72,72,0.14)] ${className}`}
      role="img"
      aria-label="Photo booth pictures of the couple"
    >
      <div className="relative w-14 h-[4.5rem] md:w-16 md:h-20 overflow-hidden">
        {/* All pictures stay mounted so switching never flickers or reloads */}
        {photos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={`${basePath}${src}`}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}

        {/* Camera flash on every new shot */}
        {!reduceMotion && (
          <motion.div
            key={index}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0 }}
            transition={{ duration: Math.min(0.35, secondsPerPhoto * 0.6), ease: "easeOut" }}
            className="absolute inset-0 bg-white pointer-events-none"
          />
        )}
      </div>
    </motion.div>
  );
}
