"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { weddingConfig } from "@/wedding.config";
import {
  WesAndersonFrame,
  BananaLeaf,
  Lotus,
} from "@/components/ui";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.4 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroSection() {
  const { couple, event, appName } = weddingConfig;
  const couplePhoto = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${couple.photo}`;

  const weddingDate = new Date(event.date);
  const formattedDate = weddingDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="flex items-center justify-center px-3 py-4 md:px-4 md:py-8 flex-1 w-full relative overflow-hidden">
      <div className="hidden md:block">
        <BananaLeaf side="left" />
        <BananaLeaf side="right" />
      </div>

      <WesAndersonFrame
        variant="primary"
        className="max-w-2xl w-full bg-cream/90 backdrop-blur-sm text-center relative z-10"
        padding="px-5 py-6 md:px-14 md:py-12"
        shimmer
      >
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="text-muted text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.3em] font-sans font-light"
          >
            {appName}
          </motion.p>

          <motion.p
            variants={item}
            className="font-sans font-light text-muted text-[0.55rem] md:text-xs uppercase tracking-[0.25em] mt-3 md:mt-5"
          >
            Together with their families
          </motion.p>

          {couple.photo && (
            <motion.div variants={item} className="my-3 md:my-5 flex justify-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border border-primary/20 shadow-sm">
                <Image
                  src={couplePhoto}
                  alt={`${couple.partner1} and ${couple.partner2}`}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </motion.div>
          )}

          <motion.h1
            variants={item}
            className="gold-foil font-serif italic text-4xl md:text-7xl mt-1 tracking-tight leading-[1.1] font-medium"
          >
            {couple.partner1}
          </motion.h1>

          <motion.span
            variants={item}
            className="block font-serif text-base md:text-xl text-primary/40 italic my-1"
          >
            &amp;
          </motion.span>

          <motion.h1
            variants={item}
            className="gold-foil font-serif italic text-4xl md:text-7xl mb-3 md:mb-4 tracking-tight leading-[1.1] font-medium"
          >
            {couple.partner2}
          </motion.h1>

          <motion.div variants={item} className="flex justify-center mb-2 md:mb-3">
            <Lotus className="w-10 h-6 md:w-12 md:h-7" />
          </motion.div>

          <motion.p
            variants={item}
            className="font-sans font-light text-muted text-[0.65rem] md:text-sm uppercase tracking-[0.15em] md:tracking-[0.2em]"
          >
            {formattedDate}
          </motion.p>

          <motion.p
            variants={item}
            className="font-sans font-light text-muted text-[0.6rem] md:text-xs mt-0.5 tracking-wider"
          >
            {event.time}
          </motion.p>

          <motion.p
            variants={item}
            className="font-sans font-light text-dark/70 text-[0.65rem] md:text-sm mt-2 md:mt-3"
          >
            {event.venue}, {event.address}
          </motion.p>
        </motion.div>
      </WesAndersonFrame>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <span className="text-muted/50 text-[0.5rem] uppercase tracking-[0.3em] font-sans font-light">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            className="text-primary/25"
          >
            {/* Mouse/scroll shape */}
            <rect
              x="1"
              y="1"
              width="14"
              height="22"
              rx="7"
              stroke="currentColor"
              strokeWidth="1"
            />
            <motion.circle
              cx="8"
              cy="7"
              r="1.5"
              fill="currentColor"
              animate={{ cy: [7, 12, 7] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
