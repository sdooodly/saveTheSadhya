"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GoldShimmerBorder } from "./GoldShimmerBorder";

type FrameVariant = "primary" | "accent" | "yellow";

const variantBorder: Record<FrameVariant, string> = {
  primary: "border-primary/20",
  accent: "border-accent/20",
  yellow: "border-accent/20",
};

interface WesAndersonFrameProps {
  children: ReactNode;
  variant?: FrameVariant;
  className?: string;
  padding?: string;
  shimmer?: boolean;
}

export function WesAndersonFrame({
  children,
  variant = "primary",
  className = "",
  padding = "p-8 md:p-12",
  shimmer = false,
}: WesAndersonFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative border ${variantBorder[variant]} ${padding} ${className}`}
    >
      {shimmer && <GoldShimmerBorder />}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
