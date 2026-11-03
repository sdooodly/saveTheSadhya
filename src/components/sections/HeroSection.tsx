"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { weddingConfig } from "@/wedding.config";
import { AddToCalendar, PhotoBooth } from "@/components/ui";
import { formatLongDate } from "@/lib/dates";

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

export function HeroSection() {
  const { couple, event } = weddingConfig;
  const formattedDate = formatLongDate(event.date);

  return (
    <section className="w-full px-5 py-6 md:px-8 md:py-8 flex justify-center">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="max-w-lg w-full text-center"
      >
        {/* Live photo booth (only when photos are set in wedding.config.ts) */}
        {weddingConfig.photoBooth.photos.length > 0 && (
          <motion.div variants={fadeUp} className="mt-3 flex justify-center">
            <PhotoBooth />
          </motion.div>
        )}

        {/* Couple names on a mint watercolour wash */}
        <div className="relative isolate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/mint-wash.webp`}
            alt=""
            aria-hidden="true"
            className="mint-wash"
          />
          <motion.h1 variants={fadeUp} className="script-name text-[5rem] md:text-8xl">
            {couple.partner1}
          </motion.h1>

          <motion.span
            variants={fadeUp}
            className="block font-serif text-[1.65rem] md:text-3xl text-olive italic -my-1.5"
          >
            &amp;
          </motion.span>

          <motion.h1 variants={fadeUp} className="script-name text-[5rem] md:text-8xl">
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
          <p className="font-serif text-ink text-[1.75rem] leading-tight md:text-[1.9rem]">
            {formattedDate}
          </p>
          <p className="font-sans text-cream text-xl mt-1">
            Muhurtham: {event.muhurthamTime}
          </p>
        </motion.div>

        {/* Venue: the name itself opens Google Maps */}
        <motion.div variants={fadeUp} className="mt-4 flex flex-col items-center">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${event.venue}, ${event.address}: open in Google Maps`}
            className="group inline-flex items-center gap-1.5 font-serif text-xl leading-tight text-ink
                       underline decoration-gold decoration-1 underline-offset-[6px] hover:decoration-ink transition-colors"
          >
            <MapPin size={17} className="shrink-0 text-gold" aria-hidden="true" />
            {event.venue}
          </a>
          <p className="mt-1 text-cream text-lg leading-tight">{event.address}</p>
          <div className="mt-2 flex items-center justify-center text-lg md:text-base">
            <AddToCalendar />
          </div>
        </motion.div>

        {/* Call to action: a clear, bouncing prompt to RSVP */}
        <motion.div variants={fadeUp} className="mt-5 flex flex-col items-center">
          <button
            type="button"
            onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
            className="group flex flex-col items-center gap-1.5 focus:outline-none"
            aria-label="Scroll to RSVP section"
          >
            <span className="script-line text-[2.2rem] md:text-4xl leading-none">Please RSVP</span>
            <motion.span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper
                         shadow-[0_4px_14px_rgba(122,16,6,0.30)] group-hover:bg-dark
                         group-focus-visible:ring-2 group-focus-visible:ring-gold group-focus-visible:ring-offset-2"
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 7.5 L10 12.5 L15 7.5" />
              </svg>
            </motion.span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
