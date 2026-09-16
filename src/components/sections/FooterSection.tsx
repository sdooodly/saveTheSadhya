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
      <p className="font-serif italic text-xl text-dark">
        {couple.partner1} & {couple.partner2}
      </p>
      <p className="text-muted text-xs font-sans font-light uppercase tracking-[0.2em] mt-2">
        {new Date(event.date).toLocaleDateString("en-IN", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </motion.footer>
  );
}
