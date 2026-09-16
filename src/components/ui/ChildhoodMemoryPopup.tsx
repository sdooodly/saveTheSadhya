"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ChildhoodMemoryPopupProps {
  bridePhoto: string;
  groomPhoto: string;
  brideName: string;
  groomName: string;
  fallbackPhoto: string;
  revealed?: boolean;
  placement?: "hero" | "envelope";
}

function MemoryPhoto({
  src,
  alt,
  fallbackPhoto,
}: {
  src: string;
  alt: string;
  fallbackPhoto: string;
}) {
  return (
    <div className="w-[4.5rem] md:w-24 bg-cream p-1.5 pb-5 shadow-[0_5px_14px_rgba(30,47,47,0.18)]">
      <Image
        src={src}
        alt={alt}
        width={96}
        height={120}
        className="aspect-[4/5] w-full object-cover"
        onError={(event) => {
          event.currentTarget.src = fallbackPhoto;
        }}
      />
    </div>
  );
}

export function ChildhoodMemoryPopup({
  bridePhoto,
  groomPhoto,
  brideName,
  groomName,
  fallbackPhoto,
  revealed = true,
  placement = "hero",
}: ChildhoodMemoryPopupProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20, scale: 0.82, rotate: -4 }}
      animate={revealed ? { opacity: 1, y: 0, scale: 1, rotate: -3 } : { opacity: 0, y: 36, scale: 0.7, rotate: -1 }}
      transition={{ delay: placement === "hero" ? 2.6 : 0, duration: 0.8, type: "spring", bounce: 0.35 }}
      className={`pointer-events-none absolute z-20 origin-bottom-right ${
        placement === "hero"
          ? "right-2 top-3 md:right-10 md:top-8"
          : "bottom-[4.25rem] left-1/2 -translate-x-1/2"
      }`}
      aria-label="A childhood memory of the couple"
    >
      <div className="relative flex items-end gap-1.5 md:gap-2">
        <div className="rotate-[-7deg]">
          <MemoryPhoto
            src={bridePhoto}
            alt={`${brideName} as a child`}
            fallbackPhoto={fallbackPhoto}
          />
        </div>
        <div className="mb-1 rotate-[6deg]">
          <MemoryPhoto
            src={groomPhoto}
            alt={`${groomName} as a child`}
            fallbackPhoto={fallbackPhoto}
          />
        </div>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[0.65rem] italic text-primary/70">
          once upon a time
        </span>
      </div>
    </motion.aside>
  );
}