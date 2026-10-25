"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
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
              stroke="#C2A876"
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
            boxShadow: "0 0 18px rgba(194,168,118,0.25), 0 4px 14px rgba(15,72,72,0.18)",
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
        className="script-line text-2xl md:text-3xl mt-1"
      >
        {name}
      </motion.span>
    </motion.div>
  );
}

/*
 * Envelope opening: the flap lifts, a little card slides out, then grows
 * into the invitation. Timings (ms) for each phase.
 */
const ENVELOPE_TIMING = { rise: 650, out: 1550, done: 2250 };

function EnvelopeOpening({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const { couple } = weddingConfig;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const [phase, setPhase] = useState<"flap" | "rise" | "out">("flap");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("rise"), ENVELOPE_TIMING.rise);
    const t2 = setTimeout(() => {
      setPhase("out");
      onReveal(); // invitation mounts underneath while the envelope fades away
    }, ENVELOPE_TIMING.out);
    const t3 = setTimeout(onDone, ENVELOPE_TIMING.done);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onReveal, onDone]);

  const opened = phase !== "flap";

  return (
    <motion.div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-paper overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "out" ? [1, 1, 0] : 1 }}
      transition={{ duration: phase === "out" ? 0.7 : 0.25, times: phase === "out" ? [0, 0.55, 1] : undefined }}
      aria-hidden="true"
    >
      <div className="kasavu-frame" />
      <motion.div
        className="relative w-[min(78vw,340px)] aspect-[3/2] [perspective:1000px]"
        initial={{ scale: 0.55, y: 60 }}
        animate={phase === "out" ? { scale: 1.06, y: 140, opacity: 0 } : { scale: 1, y: 40 }}
        transition={{ duration: phase === "out" ? 0.6 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Back of the envelope */}
        <div className="absolute inset-0 rounded-[3px] bg-[#5A1520] border border-gold" />

        {/* The card inside */}
        <motion.div
          className="absolute left-[6%] right-[6%] top-[5%] bottom-[5%] z-10 flex flex-col items-center justify-center
                     bg-paper border border-gold shadow-[0_6px_20px_rgba(15,72,72,0.18)]"
          initial={{ y: 0 }}
          animate={
            phase === "flap"
              ? { y: 0 }
              : phase === "rise"
                ? { y: "-62%" }
                : { y: "-110%", scale: 1.5, opacity: 0 }
          }
          transition={{ duration: phase === "out" ? 0.7 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={`${basePath}/monstera-leaf.png`} alt="" width={22} height={25} className="w-5 h-auto" />
          <p className="script-name text-4xl md:text-5xl mt-1 leading-none text-center">
            {couple.partner1}
            <span className="block font-serif italic text-olive text-base md:text-lg [-webkit-text-stroke:0]">
              &amp;
            </span>
            {couple.partner2}
          </p>
          <p className="text-xs tracking-[0.3em] text-cream mt-1">31 · 01 · 2027</p>
        </motion.div>

        {/* Front pocket (covers the lower card) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 z-20 w-full h-full">
          <path d="M0 0 L48 58 L0 100 Z" fill="#6E1B27" />
          <path d="M100 0 L52 58 L100 100 Z" fill="#6E1B27" />
          <path d="M0 100 L50 50 L100 100 Z" fill="#7A1F2B" />
          <path d="M0 100 L50 50 L100 100" fill="none" stroke="#C2A876" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          <rect x="0" y="0" width="100" height="100" fill="none" stroke="#C2A876" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Flap with a gold seal */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[58%] origin-top"
          style={{ zIndex: opened ? 5 : 30, transformStyle: "preserve-3d" }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: opened ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <path d="M0 0 L50 100 L100 0 Z" fill="#681A25" stroke="#C2A876" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <span
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-9 h-9 rounded-full
                       bg-[#B8995E] border border-[#E4D2A6] shadow-[0_2px_6px_rgba(0,0,0,0.25)]
                       flex items-center justify-center [backface-visibility:hidden]"
          >
            <Image src={`${basePath}/monstera-leaf.png`} alt="" width={16} height={18} className="w-3.5 h-auto opacity-90 [filter:brightness(1.6)_sepia(0.6)]" />
          </span>
        </motion.div>
      </motion.div>
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

  const [opening, setOpening] = useState(false);

  // Start the music on the tap itself (browsers only allow audio after a gesture),
  // then play the envelope animation before showing the invitation.
  const handleEnter = useCallback(() => {
    onEnter?.();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setEntered(true);
    else setOpening(true);
  }, [onEnter]);

  const reveal = useCallback(() => setEntered(true), []);
  const finishOpening = useCallback(() => setOpening(false), []);

  const envelope = opening && <EnvelopeOpening onReveal={reveal} onDone={finishOpening} />;

  if (entered)
    return (
      <>
        {children}
        {envelope}
      </>
    );

  return (
    <>
      <div className="hidden">{children}</div>

      {envelope}

      <AnimatePresence>
        {!entered && (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-6 bg-paper overflow-hidden"
          >
            {/* Monstera vine from the invite */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/monstera-vine.webp`} alt="" aria-hidden="true" className="monstera-vine" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${basePath}/leaves/corner-cluster.webp`} alt="" aria-hidden="true" className="corner-leaf" />
            <div className="kasavu-frame" aria-hidden="true" />

            {/* Ganesha from the invite */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative mb-4"
            >
              <Image
                src={`${basePath}/ganesha.png`}
                alt=""
                width={64}
                height={74}
                className="w-12 h-auto md:w-16"
                priority
              />
            </motion.div>

            {/* Heading */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative script-line text-4xl md:text-5xl"
            >
              Together with their families
            </motion.p>

            {/* Couple names */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative script-name text-6xl md:text-8xl mt-3 text-center"
            >
              {couple.partner1}
              <span className="block font-serif text-2xl md:text-3xl text-olive italic -my-1">
                &amp;
              </span>
              {couple.partner2}
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="relative script-line text-4xl md:text-5xl mt-3"
            >
              Invite you to their wedding
            </motion.p>

            {/* Childhood photos */}
            <div className="relative flex items-start gap-3 md:gap-5 mt-6">
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
              disabled={opening}
              className="relative group mt-8 focus:outline-none flex flex-col items-center gap-2"
              aria-label="Enter invitation"
            >
              <svg
                width="64"
                height="44"
                viewBox="0 0 100 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
              >
                <rect
                  x="2" y="14" width="96" height="52" rx="3"
                  fill="#7A1F2B" stroke="#C2A876" strokeWidth="1.2"
                />
                <path
                  d="M2 14 L50 44 L98 14" fill="none"
                  stroke="#C2A876" strokeWidth="1.2" strokeLinejoin="round"
                />
              </svg>
              <span className="text-ink text-lg md:text-base font-sans group-hover:text-cream transition-colors tracking-wide">
                Open invite ↗
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
