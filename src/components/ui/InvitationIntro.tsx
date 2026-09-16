"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";
import { weddingConfig } from "@/wedding.config";

function StickerPhoto({
  src,
  alt,
  rotate,
  delay,
}: {
  src: string;
  alt: string;
  rotate: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, type: "spring", bounce: 0.3 }}
      className={`${rotate} relative`}
      style={{ filter: "drop-shadow(0 4px 12px rgba(30,47,47,0.15))" }}
    >
      <div className="w-20 h-24 md:w-28 md:h-32 relative">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 80px, 112px"
        />
      </div>
    </motion.div>
  );
}

export function InvitationIntro({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const { couple } = weddingConfig;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const bridePhoto = `${basePath}${couple.childhoodPhotos.bride}`;
  const groomPhoto = `${basePath}${couple.childhoodPhotos.groom}`;

  const handleEnter = useCallback(() => {
    setEntered(true);
  }, []);

  if (entered) return <>{children}</>;

  return (
    <>
      <div className="hidden">{children}</div>

      <AnimatePresence>
        {!entered && (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-6 bg-cream"
          >
            {/* Top line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-14 h-px bg-primary/20 origin-center mb-5"
            />

            {/* Date */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.35em] font-sans font-light"
            >
              {new Date(weddingConfig.event.date).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </motion.p>

            {/* Couple names */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="gold-foil font-serif italic text-3xl md:text-5xl mt-3 tracking-tight font-medium text-center leading-tight"
            >
              {couple.partner1}
              <span className="block font-serif text-base md:text-xl text-primary/30 italic my-0.5">
                &amp;
              </span>
              {couple.partner2}
            </motion.h1>

            {/* Sticker photos — cutouts floating side by side */}
            <div className="flex items-end gap-1 md:gap-2 mt-4">
              <StickerPhoto
                src={bridePhoto}
                alt={`${couple.partner1} as a child`}
                rotate="rotate-[-4deg]"
                delay={0.9}
              />
              <StickerPhoto
                src={groomPhoto}
                alt={`${couple.partner2} as a child`}
                rotate="rotate-[3deg]"
                delay={1.1}
              />
            </div>

            {/* "once upon a time" */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="font-serif text-[0.65rem] md:text-xs italic text-primary/40 tracking-wide mt-2"
            >
              once upon a time …
            </motion.p>

            {/* Small envelope button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.6 }}
              onClick={handleEnter}
              className="group mt-6 focus:outline-none flex flex-col items-center gap-2"
              aria-label="Enter invitation"
            >
              <svg
                width="56"
                height="38"
                viewBox="0 0 100 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
              >
                <rect
                  x="2"
                  y="14"
                  width="96"
                  height="52"
                  rx="3"
                  fill="#EDE8DF"
                  stroke="#2D6A6A"
                  strokeWidth="1.2"
                />
                <path
                  d="M2 14 L50 44 L98 14"
                  fill="none"
                  stroke="#2D6A6A"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Wax seal */}
                <circle cx="50" cy="32" r="5" fill="#B8860B" opacity="0.2" />
                <circle
                  cx="50"
                  cy="32"
                  r="3"
                  fill="none"
                  stroke="#B8860B"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </svg>
              <span className="text-muted text-[0.5rem] uppercase tracking-[0.25em] font-sans font-light group-hover:text-primary/60 transition-colors">
                Open Invitation
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
