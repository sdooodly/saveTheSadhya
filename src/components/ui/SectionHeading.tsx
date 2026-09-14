"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ label, title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-6 md:mb-10"
    >
      {label && <span className="retro-label mb-4">{label}</span>}
      <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-dark mt-4 tracking-tight font-medium">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted font-sans font-light text-sm md:text-base max-w-md mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
