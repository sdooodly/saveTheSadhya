"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";
import { weddingConfig } from "@/wedding.config";

/*
 * Scribble ring data — each photo gets a set of hand-drawn wobbly loops
 * that orbit at different speeds. Fully asymmetric, nothing is a perfect circle.
 */
const RING_SETS = [
  // Set for bride photo
  [
    { scale: 0.88, cx: -3, cy: 2,  d: "M50,4 C68,2 88,18 92,40 C96,62 82,86 60,92 C38,98 12,84 4,62 C-4,40 16,10 50,4",  dash: "8 6",  dur: "18s", w: 1.0, opacity: 0.5  },
    { scale: 0.78, cx: 4,  cy: -3, d: "M46,2 C72,0 94,22 94,50 C94,78 72,96 46,96 C20,96 -2,78 2,48 C6,18 20,4 46,2",    dash: "4 8",  dur: "24s", w: 0.7, opacity: 0.3  },
    { scale: 0.95, cx: 1,  cy: 4,  d: "M52,6 C76,8 90,28 88,54 C86,80 66,96 42,92 C18,88 2,68 6,42 C10,16 28,4 52,6",    dash: "12 5", dur: "14s", w: 0.8, opacity: 0.4  },
  ],
  // Set for groom photo
  [
    { scale: 0.92, cx: 3,  cy: -2, d: "M48,2 C74,6 96,26 92,52 C88,78 64,98 40,94 C16,90 -4,66 4,40 C12,14 22,-2 48,2",  dash: "6 10", dur: "20s", w: 1.0, opacity: 0.5  },
    { scale: 0.80, cx: -4, cy: 3,  d: "M54,4 C78,10 92,32 88,58 C84,84 58,98 34,90 C10,82 -2,56 8,32 C18,8 30,-2 54,4",  dash: "3 7",  dur: "16s", w: 0.7, opacity: 0.35 },
    { scale: 0.86, cx: 2,  cy: -4, d: "M42,6 C66,0 92,20 94,46 C96,72 78,94 52,96 C26,98 4,80 2,54 C0,28 18,12 42,6",    dash: "10 4", dur: "22s", w: 0.8, opacity: 0.3  },
  ],
];

function StickerPhoto({
  src,
  alt,
  name,
  rotate,
  delay,
  blobId,
}: {
  src: string;
  alt: string;
  name: string;
  rotate: string;
  delay: number;
  blobId: number;
}) {
  const rings = RING_SETS[blobId] ?? RING_SETS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8, rotate: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, type: "spring", bounce: 0.35 }}
      className={`${rotate} flex flex-col items-center`}
    >
      <div className="relative w-28 h-28 md:w-36 md:h-36">
        {/* Multiple scribble rings — each slightly offset, rotating independently */}
        {rings.map((ring, i) => (
          <motion.svg
            key={i}
            className="absolute pointer-events-none"
            viewBox="-4 -4 104 104"
            fill="none"
            aria-hidden="true"
            style={{
              width: `${ring.scale * 100}%`,
              height: `${ring.scale * 100}%`,
              top: `${(1 - ring.scale) * 50 + ring.cy}%`,
              left: `${(1 - ring.scale) * 50 + ring.cx}%`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: parseFloat(ring.dur), repeat: Infinity, ease: "linear" }}
          >
            <path
              d={ring.d}
              stroke="#CDA24E"
              strokeWidth={ring.w}
              fill="none"
              opacity={ring.opacity}
              strokeDasharray={ring.dash}
              strokeLinecap="round"
            />
          </motion.svg>
        ))}

        {/* Photo — circular clip, slightly inset so rings extend beyond */}
        <div
          className="absolute inset-[8%] rounded-full overflow-hidden"
          style={{
            boxShadow: "0 0 20px rgba(205,162,78,0.15), 0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover brightness-110 contrast-105"
            sizes="(max-width: 768px) 112px, 144px"
          />
        </div>
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.4 }}
        className="text-accent/80 text-xs md:text-sm font-sans font-light tracking-wide mt-2"
      >
        {name}
      </motion.span>
    </motion.div>
  );
}

export function InvitationIntro({
  children,
  onEnter,
}: {
  children: React.ReactNode;
  onEnter?: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const { couple } = weddingConfig;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const bridePhoto = `${basePath}${couple.childhoodPhotos.bride}`;
  const groomPhoto = `${basePath}${couple.childhoodPhotos.groom}`;

  const handleEnter = useCallback(() => {
    setEntered(true);
    onEnter?.();
  }, [onEnter]);

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
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-6 bg-teal"
          >
            {/* Heading */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-cream/70 text-xs md:text-sm tracking-[0.2em] font-sans font-light"
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
              <span className="block font-serif text-base md:text-xl text-accent/50 italic my-0.5">
                &amp;
              </span>
              {couple.partner2}
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="text-cream/60 text-xs md:text-sm tracking-[0.15em] font-sans font-light mt-2"
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
                blobId={0}
              />
              <StickerPhoto
                src={groomPhoto}
                alt={`${couple.partner2} as a child`}
                name={couple.partner2}
                rotate="rotate-[3deg]"
                delay={1.4}
                blobId={1}
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
                  fill="#15494A" stroke="#CDA24E" strokeWidth="0.8"
                />
                <path
                  d="M2 14 L50 44 L98 14" fill="none"
                  stroke="#CDA24E" strokeWidth="0.8" strokeLinejoin="round"
                />
              </svg>
              <span className="text-accent/70 text-xs font-sans font-light group-hover:text-accent transition-colors tracking-wide">
                Open invite ↗
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
