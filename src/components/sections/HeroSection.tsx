"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, CalendarPlus } from "lucide-react";
import { weddingConfig } from "@/wedding.config";
import { Lotus } from "@/components/ui";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function buildCalendarUrl() {
  const { event, couple } = weddingConfig;
  const startUtc = "20270131T023000Z";
  const endUtc = "20270131T073000Z";
  const title = encodeURIComponent(
    `${couple.partner1} & ${couple.partner2} — ${event.title}`
  );
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://savethesadhya.com";
  const details = encodeURIComponent(
    `Muhurtham: ${event.muhurthamTime}\n\nRSVP & Details: ${siteUrl}`
  );
  const location = encodeURIComponent(`${event.venue}, ${event.address}`);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}&sf=true`;
}

export function HeroSection() {
  const { couple, event } = weddingConfig;
  const couplePhoto = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${couple.photo}`;
  const calendarUrl = buildCalendarUrl();

  const weddingDate = new Date(event.date);
  const formattedDate = weddingDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="w-full px-5 py-12 md:px-8 md:py-20 flex justify-center">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="max-w-lg w-full text-center"
      >
        {/* Warm welcome */}
        <motion.p
          variants={fadeUp}
          className="text-muted text-xs md:text-sm uppercase tracking-[0.25em] font-sans font-light"
        >
          Request the pleasure of your company
        </motion.p>

        {/* Couple photo — larger circle */}
        {couple.photo && (
          <motion.div variants={fadeUp} className="mt-7 flex justify-center">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-primary/10 shadow-[0_4px_24px_rgba(30,47,47,0.1)]">
              <Image
                src={couplePhoto}
                alt={`${couple.partner1} and ${couple.partner2}`}
                width={176}
                height={176}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </motion.div>
        )}

        {/* Couple names */}
        <motion.h1
          variants={fadeUp}
          className="gold-foil font-serif italic text-4xl md:text-6xl mt-6 tracking-tight leading-[1.1] font-medium"
        >
          {couple.partner1}
        </motion.h1>

        <motion.span
          variants={fadeUp}
          className="block font-serif text-base md:text-lg text-primary/30 italic my-1"
        >
          &amp;
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="gold-foil font-serif italic text-4xl md:text-6xl tracking-tight leading-[1.1] font-medium"
        >
          {couple.partner2}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-muted text-xs md:text-sm uppercase tracking-[0.2em] font-sans font-light mt-2"
        >
          at the wedding celebration of
        </motion.p>

        {/* Lotus divider */}
        <motion.div variants={fadeUp} className="flex justify-center mt-6 mb-8">
          <Lotus className="w-10 h-6 md:w-12 md:h-7" />
        </motion.div>

        {/* Date & muhurtham */}
        <motion.div variants={fadeUp}>
          <p className="font-sans font-light text-dark text-sm md:text-base tracking-[0.08em]">
            {formattedDate}
          </p>
          <p className="font-sans font-light text-muted text-xs md:text-sm mt-1.5 tracking-wider">
            Muhurtham · {event.muhurthamTime}
          </p>
        </motion.div>

        {/* Venue */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-1.5">
          <MapPin size={16} className="text-primary/40" />
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-lg md:text-xl text-primary hover:text-accent transition-colors
                       inline-flex items-center gap-1.5"
          >
            {event.venue}
            <ExternalLink size={12} className="shrink-0 opacity-30" />
          </a>
          <p className="text-muted text-xs md:text-sm font-light">{event.address}</p>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary/60 text-xs md:text-sm font-sans
                       tracking-wider hover:text-accent transition-colors mt-2"
          >
            <CalendarPlus size={12} className="shrink-0" />
            Add to Calendar
          </a>
        </motion.div>

        {/* Dress code */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-3">
          <p className="text-muted text-xs md:text-sm font-sans font-light tracking-wide">
            Dress Code
          </p>
          <div className="flex gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#B5403A] border border-dark/10" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#8B2E2A] border border-dark/10" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#D4604A] border border-dark/10" />
              </div>
              <p className="text-muted text-xs md:text-sm font-light">Groom</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#3A7D7B] border border-dark/10" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#2E5C8A] border border-dark/10" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#4A8C6F] border border-dark/10" />
              </div>
              <p className="text-muted text-xs md:text-sm font-light">Bride</p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeUp}
          className="mt-12 flex flex-col items-center gap-1.5"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="14" height="20" viewBox="0 0 16 24" fill="none" className="text-primary/20">
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1" />
              <motion.circle
                cx="8" cy="7" r="1.5" fill="currentColor"
                animate={{ cy: [7, 12, 7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
