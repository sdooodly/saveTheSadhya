"use client";

import { motion } from "framer-motion";
import { weddingConfig } from "@/wedding.config";

export function FooterSection() {
  const { couple, event } = weddingConfig;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-10 px-4 text-center"
    >
      <p className="font-serif italic text-xl text-accent">
        {couple.partner1} & {couple.partner2}
      </p>
      <p className="text-cream/50 text-xs font-sans font-light tracking-[0.15em] mt-2">
        {new Date(event.date).toLocaleDateString("en-IN", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </motion.footer>
  );
}
