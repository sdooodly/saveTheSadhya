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
  rotate,
}: {
  src: string;
  alt: string;
  fallbackPhoto: string;
  rotate: string;
}) {
  return (
    <motion.div
      className={`${rotate} bg-white p-1.5 pb-6 shadow-[0_4px_20px_rgba(30,47,47,0.15)] rounded-[2px]`}
      whileHover={{ scale: 1.05, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-20 md:w-28 aspect-[4/5] overflow-hidden rounded-[1px] bg-secondary">
        <Image
          src={src}
          alt={alt}
          width={112}
          height={140}
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.src = fallbackPhoto;
          }}
        />
      </div>
    </motion.div>
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
      initial={{ opacity: 0, y: 24, scale: 0.85 }}
      animate={
        revealed
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 36, scale: 0.7 }
      }
      transition={{
        delay: placement === "hero" ? 2.6 : 0.1,
        duration: 0.9,
        type: "spring",
        bounce: 0.3,
      }}
      className={`pointer-events-auto z-20 ${
        placement === "hero"
          ? "absolute right-2 top-3 md:right-10 md:top-8 origin-bottom-right"
          : "relative mb-4"
      }`}
      aria-label="A childhood memory of the couple"
    >
      {/* Glass backdrop */}
      <div className="relative rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(30,47,47,0.12)] p-4 md:p-5">
        <div className="flex items-end gap-3 md:gap-4 justify-center">
          <MemoryPhoto
            src={bridePhoto}
            alt={`${brideName} as a child`}
            fallbackPhoto={fallbackPhoto}
            rotate="rotate-[-5deg]"
          />
          <MemoryPhoto
            src={groomPhoto}
            alt={`${groomName} as a child`}
            fallbackPhoto={fallbackPhoto}
            rotate="rotate-[4deg] translate-y-1"
          />
        </div>

        {/* Caption */}
        <p className="text-center mt-3 font-serif text-[0.7rem] md:text-xs italic text-primary/60 tracking-wide">
          once upon a time …
        </p>
      </div>
    </motion.aside>
  );
}
