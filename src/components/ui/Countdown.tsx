"use client";

import { useEffect, useState } from "react";
import { weddingConfig } from "@/wedding.config";

const UNITS = [
  { label: "Days", ms: 86_400_000 },
  { label: "Hours", ms: 3_600_000 },
  { label: "Minutes", ms: 60_000 },
  { label: "Seconds", ms: 1_000 },
] as const;

function split(remaining: number) {
  let rest = remaining;
  return UNITS.map((u) => {
    const value = Math.floor(rest / u.ms);
    rest -= value * u.ms;
    return { label: u.label, value };
  });
}

/** Live countdown to the muhurtham (time in wedding.config.ts → event.startsAt). */
export function Countdown({ className = "" }: { className?: string }) {
  const target = new Date(weddingConfig.event.startsAt).getTime();
  // Rendered only in the browser: the site is pre-built, so a build-time
  // "now" would be stale and cause a mismatch.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return <div className={`h-[4.5rem] ${className}`} aria-hidden="true" />;

  const remaining = target - now;

  if (remaining <= 0) {
    return (
      <p className={`script-name text-4xl md:text-5xl ${className}`}>
        {remaining > -86_400_000 ? "Today’s the day" : "Just married"}
      </p>
    );
  }

  const parts = split(remaining);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-start justify-center gap-1.5 md:gap-5" role="timer" aria-live="off">
        {parts.map((p, i) => (
          <div key={p.label} className="flex items-start gap-1.5 md:gap-5">
            <div className="flex flex-col items-center min-w-[3.6rem] md:min-w-[3.25rem]">
              <span className="font-serif text-3xl md:text-4xl text-ink tabular-nums leading-none">
                {String(p.value).padStart(i === 0 ? 1 : 2, "0")}
              </span>
              <span className="mt-1.5 text-[0.65rem] md:text-xs uppercase tracking-[0.12em] md:tracking-[0.18em] text-cream/60">
                {p.label}
              </span>
            </div>
            {i < parts.length - 1 && (
              <span className="font-serif text-2xl md:text-3xl text-gold leading-none" aria-hidden="true">
                ·
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 font-serif italic text-base md:text-lg text-cream/70">to go</p>
    </div>
  );
}
