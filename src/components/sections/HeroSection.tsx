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
  // Muhurtham 12:12–12:33 IST
  const startUtc = "20270131T064200Z";
  const endUtc = "20270131T070300Z";
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
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="w-full px-5 py-6 md:px-8 md:py-8 flex justify-center">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="max-w-lg w-full text-center"
      >
        {/* Welcome */}
        <motion.p
          variants={fadeUp}
          className="script-line text-[2.2rem] md:text-4xl"
        >
          Request the pleasure of your company
        </motion.p>

        {/* Live photo booth */}
        <motion.div variants={fadeUp} className="mt-3 flex justify-center">
          <PhotoBooth />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="script-line text-[2.2rem] md:text-4xl mt-2"
        >
          at the wedding celebration of
        </motion.p>

        {/* Couple names on a mint watercolour wash */}
        <div className="relative isolate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/mint-wash.webp`}
            alt=""
            aria-hidden="true"
            className="mint-wash"
          />
          <motion.h1 variants={fadeUp} className="script-name text-[4.4rem] md:text-7xl mt-1">
            {couple.partner1}
          </motion.h1>

          <motion.span
            variants={fadeUp}
            className="block font-serif text-xl md:text-2xl text-olive italic -my-1"
          >
            &amp;
          </motion.span>

          <motion.h1 variants={fadeUp} className="script-name text-[4.4rem] md:text-7xl">
            {couple.partner2}
          </motion.h1>
        </div>

        {/* Gold rule + monstera leaf divider, as on the invite */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-3 mb-3" aria-hidden="true">
          <span className="h-px w-16 md:w-24 bg-gold" />
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/monstera-leaf.png`}
            alt=""
            width={28}
            height={32}
            className="w-5 h-auto md:w-6"
          />
          <span className="h-px w-16 md:w-24 bg-gold" />
        </motion.div>

        {/* Date */}
        <motion.div variants={fadeUp}>
          <p className="font-serif font-medium text-ink text-[1.65rem] leading-tight md:text-2xl">
            {formattedDate}
          </p>
          <p className="font-sans text-cream text-xl md:text-lg mt-0.5">
            Muhurtham: {event.muhurthamTime}
          </p>
        </motion.div>

        {/* Venue: arch-shaped map beside the details */}
        <motion.div variants={fadeUp} className="mt-4 flex items-center justify-center gap-4 text-left">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${event.venue} in Google Maps`}
            className="group shrink-0 rounded-t-full rounded-b-md border border-gold bg-paper p-[3px]
                       shadow-[0_3px_12px_rgba(15,72,72,0.12)] transition-transform hover:-translate-y-0.5"
          >
            <div className="relative w-20 h-24 md:w-24 md:h-28 overflow-hidden rounded-t-full rounded-b-[4px]">
              {/* Oversized and centred so only the pin area shows, not Google's controls */}
              <iframe
                src={event.mapEmbedUrl}
                title={`Map showing ${event.venue}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                tabIndex={-1}
                className="absolute left-1/2 top-1/2 w-[320px] h-[360px] -translate-x-1/2 -translate-y-1/2
                           border-0 pointer-events-none [filter:saturate(0.55)_sepia(0.12)_hue-rotate(-8deg)]"
              />
            </div>
          </a>

          <div className="flex flex-col items-start gap-0.5">
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-serif text-[1.4rem] leading-tight md:text-xl text-ink hover:text-cream transition-colors"
            >
              <MapPin size={14} className="shrink-0 text-accent" />
              {event.venue}
            </a>
            <span className="text-cream text-lg md:text-base pl-5">{event.address}</span>
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 pl-5 text-ink text-lg md:text-sm underline decoration-gold underline-offset-4 hover:text-cream transition-colors"
            >
              Directions
              <ExternalLink size={11} className="shrink-0 opacity-60" />
            </a>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent text-lg md:text-sm hover:text-gold-light transition-colors mt-1"
            >
              <CalendarPlus size={14} className="shrink-0" />
              Add to calendar
            </a>
          </div>
        </motion.div>

        {/* Dress code */}
        <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:gap-6">
          <p className="script-line text-[2.2rem] md:text-4xl w-full md:w-auto">Dress code</p>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#B5403A] border border-accent/20" />
            <span className="w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#8B2E2A] border border-accent/20" />
            <span className="w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#D4604A] border border-accent/20" />
            <span className="text-cream text-lg md:text-sm ml-1">Groom</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#3A7D7B] border border-accent/20" />
            <span className="w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#2E5C8A] border border-accent/20" />
            <span className="w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#4A8C6F] border border-accent/20" />
            <span className="text-cream text-lg md:text-sm ml-1">Bride</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div variants={fadeUp} className="mt-4 flex flex-col items-center">
          <motion.button
            onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center group cursor-pointer focus:outline-none p-1"
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
