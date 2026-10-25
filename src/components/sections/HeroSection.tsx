"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, CalendarPlus } from "lucide-react";
import { weddingConfig } from "@/wedding.config";
import { PhotoBooth } from "@/components/ui";

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
  const startUtc = "20270131T060000Z";
  const endUtc = "20270131T073000Z";
  const title = encodeURIComponent(
    `${couple.partner1} & ${couple.partner2}'s wedding`
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
        {/* Welcome */}
        <motion.p
          variants={fadeUp}
          className="text-cream/60 text-xs md:text-sm tracking-[0.2em] font-sans font-light"
        >
          Request the pleasure of your company
        </motion.p>

        {/* Live photo booth */}
        <motion.div variants={fadeUp} className="mt-8 flex justify-center">
          <PhotoBooth />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-cream/50 text-xs md:text-sm tracking-[0.15em] font-sans font-light mt-8"
        >
          at the wedding celebration of
        </motion.p>

        {/* Couple names */}
        <motion.h1
          variants={fadeUp}
          className="gold-foil font-serif italic text-4xl md:text-6xl mt-4 tracking-tight leading-[1.1] font-medium"
        >
          {couple.partner1}
        </motion.h1>

        <motion.span
          variants={fadeUp}
          className="block font-serif text-base md:text-lg text-olive italic my-1"
        >
          &amp;
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="gold-foil font-serif italic text-4xl md:text-6xl tracking-tight leading-[1.1] font-medium"
        >
          {couple.partner2}
        </motion.h1>

        {/* Gold rule + monstera leaf divider, as on the invite */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-6 mb-8" aria-hidden="true">
          <span className="h-px w-16 md:w-24 bg-gold" />
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/monstera-leaf.png`}
            alt=""
            width={28}
            height={32}
            className="w-6 h-auto md:w-7"
          />
          <span className="h-px w-16 md:w-24 bg-gold" />
        </motion.div>

        {/* Date */}
        <motion.div variants={fadeUp}>
          <p className="font-sans font-light text-cream text-sm md:text-base tracking-[0.08em]">
            {formattedDate}
          </p>
          <p className="font-sans font-light text-cream/60 text-xs md:text-sm mt-1.5 tracking-wider">
            Muhurtham · {event.muhurthamTime}
          </p>
        </motion.div>

        {/* Venue */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-1.5">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <MapPin size={16} className="text-accent/50 group-hover:text-accent transition-colors" />
            <span className="font-serif text-lg md:text-xl text-accent group-hover:text-gold-light transition-colors
                       inline-flex items-center gap-1.5">
              {event.venue}
              <ExternalLink size={12} className="shrink-0 opacity-40" />
            </span>
            <span className="text-cream/60 text-xs md:text-sm font-light group-hover:text-cream/80 transition-colors">{event.address}</span>
          </a>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent/70 text-xs md:text-sm font-sans
                       tracking-wider hover:text-accent transition-colors mt-2"
          >
            <CalendarPlus size={12} className="shrink-0" />
            Add to calendar
          </a>
        </motion.div>

        {/* Dress code */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-3">
          <p className="text-cream/60 text-xs md:text-sm font-sans font-light tracking-wide">
            Dress code
          </p>
          <div className="flex gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#B5403A] border border-accent/20" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#8B2E2A] border border-accent/20" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#D4604A] border border-accent/20" />
              </div>
              <p className="text-cream/70 text-xs md:text-sm font-light">Groom</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#3A7D7B] border border-accent/20" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#2E5C8A] border border-accent/20" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#4A8C6F] border border-accent/20" />
              </div>
              <p className="text-cream/70 text-xs md:text-sm font-light">Bride</p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeUp}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <motion.button
            onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
            aria-label="Scroll to RSVP section"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-accent/50 group-hover:text-accent transition-colors">
              <path d="M2 2 L10 9 L18 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
