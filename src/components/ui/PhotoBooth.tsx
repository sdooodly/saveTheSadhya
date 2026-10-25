"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { weddingConfig } from "@/wedding.config";

/*
 * Soft green-ivory grade so any photo sits with the watercolours.
 * Applied as a CSS filter plus two light overlays (see <Tint />).
 */
const TINT_FILTER =
  "[filter:sepia(0.22)_saturate(0.8)_hue-rotate(-14deg)_contrast(1.03)_brightness(1.03)]";

function Tint() {
  return (
    <>
      <span className="absolute inset-0 bg-[#2F6B5C]/15 mix-blend-soft-light pointer-events-none" />
      <span className="absolute inset-0 bg-[#FCFBF7]/10 mix-blend-screen pointer-events-none" />
    </>
  );
}

/**
 * Live photo-booth "GIF": a small ivory, gold-edged print that cycles through
 * the booth pictures with a quick camera flash and a playful alternating tilt.
 * Tapping it opens the full four-photo strip.
 * Pictures and timing live in wedding.config.ts → photoBooth.
 */
export function PhotoBooth({ className = "" }: { className?: string }) {
  const { photos, secondsPerPhoto } = weddingConfig.photoBooth;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  // The strip is portalled to <body>; mount the portal only once it is first opened.
  const [everOpened, setEverOpened] = useState(false);

  // Respect "reduce motion": cycle slowly, no flash or tilt.
  const intervalMs = (reduceMotion ? Math.max(secondsPerPhoto, 3) : secondsPerPhoto) * 1000;

  useEffect(() => {
    if (photos.length < 2 || open) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), intervalMs);
    return () => clearInterval(id);
  }, [photos.length, intervalMs, open]);

  const tilt = reduceMotion ? 0 : index % 2 === 0 ? -3 : 2.5;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => {
          setEverOpened(true);
          setOpen(true);
        }}
        animate={{ rotate: tilt }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className={`relative block bg-paper border border-gold px-[3px] pt-[3px] pb-2.5 cursor-pointer
                    shadow-[0_2px_10px_rgba(15,72,72,0.14)] focus:outline-none
                    focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${className}`}
        aria-label="Open the photo booth strip"
        aria-haspopup="dialog"
      >
        <span className="relative block w-14 h-[4.5rem] md:w-16 md:h-20 overflow-hidden">
          {/* All pictures stay mounted so switching never flickers or reloads */}
          {photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={`${basePath}${src}`}
              alt=""
              draggable={false}
              className={`absolute inset-0 w-full h-full object-cover ${TINT_FILTER}`}
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
          <Tint />

          {/* Camera flash on every new shot */}
          {!reduceMotion && (
            <motion.span
              key={index}
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 0 }}
              transition={{ duration: Math.min(0.35, secondsPerPhoto * 0.6), ease: "easeOut" }}
              className="absolute inset-0 bg-white pointer-events-none"
            />
          )}
        </span>
      </motion.button>

      {everOpened &&
        createPortal(
          <AnimatePresence>
            {open && <BoothStrip photos={photos} basePath={basePath} onClose={() => setOpen(false)} />}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

/** Full-screen view of the four-photo strip, "printing" out from the top. */
function BoothStrip({
  photos,
  basePath,
  onClose,
}: {
  photos: readonly string[];
  basePath: string;
  onClose: () => void;
}) {
  const { couple, event } = weddingConfig;
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const stripDate = new Date(event.date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    closeRef.current?.focus();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photo booth strip"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-paper/85 backdrop-blur-sm p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 md:top-8 md:right-8 w-10 h-10 flex items-center justify-center
                   rounded-full border border-gold bg-paper text-ink hover:bg-paper-alt transition-colors
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label="Close photo strip"
      >
        <X size={18} />
      </button>

      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? { opacity: 0 } : { y: -80, rotate: 0, clipPath: "inset(0 0 100% 0)" }}
        animate={reduceMotion ? { opacity: 1 } : { y: 0, rotate: -2, clipPath: "inset(0 0 0% 0)" }}
        exit={{ opacity: 0, y: 30, transition: { duration: 0.2 } }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="bg-paper border border-gold p-2.5 pb-3 shadow-[0_10px_40px_rgba(15,72,72,0.22)]
                   w-[min(52vw,210px)] max-h-full flex flex-col"
      >
        <div className="flex flex-col gap-2 min-h-0">
          {photos.map((src, i) => (
            <div key={src} className="relative aspect-[3/4] overflow-hidden max-h-[19vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}${src}`}
                alt={`Photo booth picture ${i + 1} of ${photos.length}`}
                className={`absolute inset-0 w-full h-full object-cover ${TINT_FILTER}`}
                draggable={false}
              />
              <Tint />
            </div>
          ))}
        </div>
        <p className="script-name text-2xl text-center mt-2 leading-none whitespace-nowrap">
          {couple.partner1} &amp; {couple.partner2}
        </p>
        <p className="text-center text-xs tracking-[0.25em] text-cream mt-1">{stripDate}</p>
      </motion.div>
    </motion.div>
  );
}
