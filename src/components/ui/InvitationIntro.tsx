"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { weddingConfig } from "@/wedding.config";

export function InvitationIntro({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const { couple } = weddingConfig;

  if (entered) return <>{children}</>;

  return (
    <>
      <div className="hidden">{children}</div>

      <AnimatePresence>
        {!entered && (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[70] bg-cream flex flex-col items-center justify-center px-6"
          >
            {/* Together with families */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-muted text-[0.65rem] md:text-xs uppercase tracking-[0.3em] font-sans font-light text-center"
            >
              Together with their families
            </motion.p>

            {/* Couple names */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="gold-foil font-serif italic text-3xl md:text-5xl mt-4 tracking-tight font-medium text-center"
            >
              {couple.partner1} & {couple.partner2}
            </motion.h1>

            {/* Invite line */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3 }}
              className="text-muted text-[0.65rem] md:text-xs uppercase tracking-[0.25em] font-sans font-light mt-3"
            >
              Invite you to their wedding
            </motion.p>

            {/* Thin line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.7 }}
              className="w-12 h-px bg-primary/30 mt-5 origin-center"
            />

            {/* Envelope — flies in, click to enter */}
            <motion.button
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 2.1 }}
              onClick={() => setEntered(true)}
              className="mt-6 group focus:outline-none"
              aria-label="Open invitation"
            >
              <svg
                width="100"
                height="68"
                viewBox="0 0 100 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-105"
              >
                <rect x="2" y="14" width="96" height="52" rx="2" fill="#EDE8DF" stroke="#2D6A6A" strokeWidth="1" />
                <path d="M2 14 L50 44 L98 14" fill="none" stroke="#2D6A6A" strokeWidth="1" strokeLinejoin="round" />
                <path d="M2 66 L38 40" stroke="#2D6A6A" strokeWidth="0.4" opacity="0.15" />
                <path d="M98 66 L62 40" stroke="#2D6A6A" strokeWidth="0.4" opacity="0.15" />
              </svg>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8, duration: 0.5 }}
                className="text-muted text-[0.55rem] uppercase tracking-[0.2em] font-sans mt-2 text-center font-light"
              >
                Tap to open
              </motion.p>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
