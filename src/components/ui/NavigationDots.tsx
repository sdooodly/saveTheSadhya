"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "invitation", label: "Invitation" },
  { id: "rsvp", label: "RSVP" },
];

export function NavigationDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3"
      aria-label="Section navigation"
    >
      {SECTIONS.map((section, i) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          className="group relative flex items-center"
          aria-label={`Go to ${section.label}`}
          aria-current={active === i ? "true" : undefined}
        >
          {/* Label tooltip */}
          <span
            className="absolute right-6 px-2 py-1 text-[0.6rem] font-sans uppercase tracking-wider
                       text-cream bg-dark/80 rounded-sm opacity-0 group-hover:opacity-100
                       transition-opacity whitespace-nowrap pointer-events-none"
          >
            {section.label}
          </span>

          {/* Dot */}
          <motion.span
            animate={{
              scale: active === i ? 1 : 0.6,
              backgroundColor: active === i ? "#2D6A6A" : "#7A8078",
            }}
            transition={{ duration: 0.3 }}
            className="block w-2.5 h-2.5 rounded-full border border-primary/30"
          />
        </button>
      ))}
    </nav>
  );
}
