"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { weddingConfig } from "@/wedding.config";
import { ChildhoodMemoryPopup } from "./ChildhoodMemoryPopup";

export function InvitationIntro({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [opening, setOpening] = useState(false);
  const { couple } = weddingConfig;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    if (!opening) return;

    const timer = window.setTimeout(() => setEntered(true), 2800);
    return () => window.clearTimeout(timer);
  }, [opening]);

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
            <div className="relative mt-6 overflow-visible">
              <ChildhoodMemoryPopup
                bridePhoto={`${basePath}${couple.childhoodPhotos.bride}`}
                groomPhoto={`${basePath}${couple.childhoodPhotos.groom}`}
                brideName={couple.partner1}
                groomName={couple.partner2}
                fallbackPhoto={`${basePath}${couple.photo}`}
                revealed={opening}
                placement="envelope"
              />

              <motion.button
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 2.1 }}
                onClick={() => setOpening(true)}
                disabled={opening}
                className="group block focus:outline-none"
                aria-label="Open invitation"
              >
                <svg
                  width="100"
                  height="68"
                  viewBox="0 0 100 68"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`relative z-10 transition-transform duration-300 ${opening ? "scale-95" : "group-hover:scale-105"}`}
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
                  {opening ? "A little memory" : "Tap to open"}
                </motion.p>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
