"use client";

import { motion } from "framer-motion";
import { weddingConfig } from "@/wedding.config";
import { formatDate } from "@/lib/dates";

export function FooterSection() {
  const { couple, event } = weddingConfig;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-10 px-4 text-center"
    >
      <p className="script-name text-[1.9rem] md:text-4xl">
        {couple.partner1} &amp; {couple.partner2}
      </p>
      <p className="text-cream text-base md:text-sm font-sans tracking-[0.12em] mt-2">
        {formatDate(event.date)}
      </p>
    </motion.footer>
  );
}
