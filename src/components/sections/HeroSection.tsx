"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, CalendarPlus } from "lucide-react";
import { weddingConfig } from "@/wedding.config";
import { PhotoBooth, VenueMap } from "@/components/ui";

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

        {/* Venue: one line, with a small map link (opens a popup) and calendar link */}
        <motion.div variants={fadeUp} className="mt-4 flex flex-col items-center">
          <p className="inline-flex items-center gap-1.5 font-serif text-[1.4rem] leading-tight md:text-xl text-ink">
            <MapPin size={15} className="shrink-0 text-accent" />
            {event.venue}
          </p>
          <p className="text-cream text-lg md:text-base leading-tight">{event.address}</p>
          <div className="mt-2 flex items-center justify-center gap-5 text-lg md:text-base">
            <VenueMap />
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent hover:text-gold-light transition-colors"
            >
              <CalendarPlus size={15} className="shrink-0" />
              Add to calendar
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div variants={fadeUp} className="mt-6 flex flex-col items-center">
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
