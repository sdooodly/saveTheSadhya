"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";
import { weddingConfig } from "@/wedding.config";

function StickerPhoto({
  src,
  alt,
  name,
  rotate,
  delay,
}: {
  src: string;
  alt: string;
  name: string;
  rotate: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8, rotate: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, type: "spring", bounce: 0.35 }}
      className={`${rotate} flex flex-col items-center`}
      style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.3))" }}
    >
      <div
        className="w-20 h-28 md:w-28 md:h-36 relative"
        style={{
          maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 65%, transparent 100%)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-top"
          sizes="(max-width: 768px) 80px, 112px"
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.4 }}
        className="text-accent/70 text-[0.6rem] md:text-xs font-sans font-light tracking-wide -mt-2"
      >
        {name}
      </motion.span>
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
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-6 bg-emerald"
          >
            {/* Heading */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-cream/60 text-xs md:text-sm tracking-[0.2em] font-sans font-light"
            >
              Together with their families
            </motion.p>

            {/* Couple names */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="gold-foil font-serif italic text-3xl md:text-5xl mt-2 tracking-tight font-medium text-center leading-tight"
            >
              {couple.partner1}
              <span className="block font-serif text-base md:text-xl text-accent/40 italic my-0.5">
                &amp;
              </span>
              {couple.partner2}
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="text-cream/50 text-xs md:text-sm tracking-[0.15em] font-sans font-light mt-2"
            >
              Invite you to their wedding
            </motion.p>

            {/* Childhood photos */}
            <div className="flex items-start gap-3 md:gap-5 mt-6">
              <StickerPhoto
                src={bridePhoto}
                alt={`${couple.partner1} as a child`}
                name={couple.partner1}
                rotate="rotate-[-4deg]"
                delay={1.2}
              />
              <StickerPhoto
                src={groomPhoto}
                alt={`${couple.partner2} as a child`}
                name={couple.partner2}
                rotate="rotate-[3deg]"
                delay={1.4}
              />
            </div>

            {/* Envelope button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.6 }}
              onClick={handleEnter}
              className="group mt-8 focus:outline-none flex flex-col items-center gap-2"
              aria-label="Enter invitation"
            >
              <svg
                width="52"
                height="36"
                viewBox="0 0 100 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
              >
                <rect
                  x="2" y="14" width="96" height="52" rx="3"
                  fill="#1A5C4A" stroke="#C9A84C" strokeWidth="0.8"
                />
                <path
                  d="M2 14 L50 44 L98 14" fill="none"
                  stroke="#C9A84C" strokeWidth="0.8" strokeLinejoin="round"
                />
              </svg>
              <span className="text-accent/60 text-xs font-sans font-light group-hover:text-accent transition-colors tracking-wide">
                Open invite ↗
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
