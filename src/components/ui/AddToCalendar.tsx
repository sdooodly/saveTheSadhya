"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { googleCalendarUrl } from "@/lib/calendar";
import { ICS_PATH, weddingCalendarEvent } from "@/lib/event";

const GOOGLE_URL = googleCalendarUrl(weddingCalendarEvent());
const ICS_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${ICS_PATH}`;

/**
 * "Add to calendar" → the guest picks their calendar. No device guessing.
 *
 * Google Calendar opens in the same tab on phones: phones hand the event to the
 * Calendar app, and a new tab would be left behind empty. On computers it opens
 * in a new tab so the invitation stays open.
 */
export function AddToCalendar({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const menuId = useId();
  // Open upwards when there isn't room below (small phones).
  const [above, setAbove] = useState(false);
  const MENU_HEIGHT = 170;

  function toggle() {
    if (!open && wrapper.current) {
      const r = wrapper.current.getBoundingClientRect();
      setAbove(window.innerHeight - r.bottom < MENU_HEIGHT + 16 && r.top > MENU_HEIGHT + 16);
    }
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
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

  const item =
    "block w-full px-4 py-3 text-left text-lg md:text-base text-cream hover:bg-paper-alt focus:bg-paper-alt focus:outline-none transition-colors";

  return (
    <div ref={wrapper} className={`relative inline-flex flex-col items-center ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex items-center gap-1.5 text-accent hover:text-gold-light transition-colors"
      >
        <CalendarPlus size={15} className="shrink-0" aria-hidden="true" />
        Add to calendar
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: above ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: above ? 4 : -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${above ? "bottom-full mb-2" : "top-full mt-2"} z-30 w-60 overflow-hidden rounded-sm border border-gold/60
                       bg-paper shadow-[0_8px_24px_rgba(74,40,10,0.16)] divide-y divide-gold/30`}
          >
            <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" onClick={openGoogle} className={item}>
              Google Calendar
            </a>
            <a href={ICS_URL} download="gayathri-anand-wedding.ics" onClick={() => setOpen(false)} className={item}>
              Apple Calendar
            </a>
            <a href={ICS_URL} download="gayathri-anand-wedding.ics" onClick={() => setOpen(false)} className={item}>
              Outlook
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
