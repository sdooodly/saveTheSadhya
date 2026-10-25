"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Map, X } from "lucide-react";
import { weddingConfig } from "@/wedding.config";

/** A small "View map" link that opens the venue map in a popup. */
export function VenueMap({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  // Portalled to <body>; mounted only once first opened (the page is pre-built).
  const [everOpened, setEverOpened] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setEverOpened(true);
          setOpen(true);
        }}
        aria-haspopup="dialog"
        className={`inline-flex items-center gap-1.5 text-ink hover:text-cream transition-colors
                    underline decoration-gold underline-offset-4 ${className}`}
      >
        <Map size={15} className="shrink-0" />
        View map
      </button>

      {everOpened &&
        createPortal(
          <AnimatePresence>{open && <MapPopup onClose={() => setOpen(false)} />}</AnimatePresence>,
          document.body
        )}
    </>
  );
}

function MapPopup({ onClose }: { onClose: () => void }) {
  const { event } = weddingConfig;
  const closeRef = useRef<HTMLButtonElement>(null);

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
      aria-label={`Map of ${event.venue}`}
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
        aria-label="Close map"
      >
        <X size={18} />
      </button>

      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 24, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 16, opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center w-[min(84vw,360px)]"
      >
        {/* Arch-shaped map window */}
        <div className="w-full rounded-t-full rounded-b-md border border-gold bg-paper p-1.5 shadow-[0_10px_40px_rgba(15,72,72,0.2)]">
          <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[4px]">
            <iframe
              src={event.mapEmbedUrl}
              title={`Map showing ${event.venue}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full border-0 [filter:saturate(0.6)_sepia(0.1)]"
            />
          </div>
        </div>
        <p className="mt-4 font-serif text-2xl text-ink">{event.venue}</p>
        <p className="text-cream text-lg">{event.address}</p>
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-ink text-paper text-lg
                     hover:bg-cream transition-colors"
        >
          Open in Google Maps
          <ExternalLink size={14} className="shrink-0" />
        </a>
      </motion.div>
    </motion.div>
  );
}
