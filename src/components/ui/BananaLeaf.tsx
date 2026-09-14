"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function BananaLeaf({ side = "left" }: { side?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    side === "left" ? ["-5deg", "5deg"] : ["5deg", "-5deg"]
  );

  return (
    <div
      ref={ref}
      className={`absolute top-0 bottom-0 ${side === "left" ? "left-0" : "right-0"} w-40 md:w-56 lg:w-72 pointer-events-none`}
      aria-hidden="true"
    >
      <motion.svg
        style={{ y, rotate }}
        className={`w-full h-full opacity-[0.06] ${side === "right" ? "scale-x-[-1]" : ""}`}
        viewBox="0 0 200 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M100 20 C100 20 98 300 100 580" stroke="#2D6A6A" strokeWidth="2.5" fill="none" />
        <path d="M100 60 C80 50 30 55 20 80 C15 95 40 90 100 100" fill="#2D6A6A" />
        <path d="M100 140 C75 125 25 130 15 160 C10 180 45 172 100 185" fill="#2D6A6A" />
        <path d="M100 230 C70 210 20 218 12 250 C8 270 50 260 100 275" fill="#2D6A6A" />
        <path d="M100 320 C72 305 22 312 14 345 C10 365 52 355 100 370" fill="#2D6A6A" />
        <path d="M100 410 C75 395 28 402 18 435 C14 455 55 445 100 460" fill="#2D6A6A" />
        <path d="M100 500 C80 488 35 492 25 520 C22 535 58 528 100 540" fill="#2D6A6A" />
        <path d="M100 80 C120 68 170 72 180 100 C185 118 155 112 100 120" fill="#2D6A6A" />
        <path d="M100 165 C125 150 175 155 185 185 C190 205 155 195 100 210" fill="#2D6A6A" />
        <path d="M100 255 C130 240 178 245 188 275 C192 295 150 285 100 300" fill="#2D6A6A" />
        <path d="M100 345 C128 330 176 335 186 365 C190 385 148 375 100 390" fill="#2D6A6A" />
        <path d="M100 435 C125 420 172 425 182 455 C186 475 152 465 100 480" fill="#2D6A6A" />
        <path d="M100 520 C118 510 165 514 175 540 C178 552 148 546 100 555" fill="#2D6A6A" />
      </motion.svg>
    </div>
  );
}
