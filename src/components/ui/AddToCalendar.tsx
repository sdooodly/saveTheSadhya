"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { googleCalendarUrl } from "@/lib/calendar";
import { ICS_PATH, weddingCalendarEvent } from "@/lib/event";

const GOOGLE_URL = googleCalendarUrl(weddingCalendarEvent());
const ICS_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${ICS_PATH}`;
const ICS_NAME = "gayathri-anand-wedding.ics";

/**
 * "Add to calendar" → the same line turns into "Google · Apple · Outlook",
 * like a line printed on the card. No box, no layout jump. No device guessing.
 *
 * Google Calendar opens in the same tab on phones: phones hand the event to the
 * Calendar app, and a new tab would be left behind empty. On computers it opens
 * in a new tab so the invitation stays open.
 */
export function AddToCalendar({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const firstChoice = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstChoice.current?.focus({ preventScroll: true });
    const onDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openGoogle(e: React.MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    if (window.matchMedia("(pointer: coarse)").matches) {
      e.preventDefault();
      window.location.assign(GOOGLE_URL);
    }
  }

  const choice =
    "px-1 py-1 text-ink underline decoration-gold decoration-1 underline-offset-[5px] hover:decoration-ink focus:outline-none focus-visible:decoration-ink focus-visible:decoration-2 transition-colors";
  const dot = (
    <span className="text-gold select-none" aria-hidden="true">
      ·
    </span>
  );

  return (
    <div ref={wrapper} className={`relative h-8 flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="trigger"
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1.5 text-accent hover:text-gold-light transition-colors"
          >
            <CalendarPlus size={15} className="shrink-0" aria-hidden="true" />
            Add to calendar
          </motion.button>
        ) : (
          <motion.nav
            key="choices"
            aria-label="Add to calendar"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2.5 whitespace-nowrap"
          >
            <a
              ref={firstChoice}
              href={GOOGLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={openGoogle}
              className={choice}
            >
              Google
            </a>
            {dot}
            <a href={ICS_URL} download={ICS_NAME} onClick={() => setOpen(false)} className={choice}>
              Apple
            </a>
            {dot}
            <a href={ICS_URL} download={ICS_NAME} onClick={() => setOpen(false)} className={choice}>
              Outlook
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
