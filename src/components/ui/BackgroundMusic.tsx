"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FADE_DURATION_MS = 3000; // 3s gentle volume ramp
const MAX_VOLUME = 0.35; // keep it soothing, not blasting
const FADE_STEPS = 60;

interface BackgroundMusicProps {
  src: string;
  /** When true, begin playback with a gentle fade-in */
  play: boolean;
}

export function BackgroundMusic({ src, play }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  // Gradual volume fade-in so it doesn't jolt the listener
  const fadeIn = useCallback((audio: HTMLAudioElement) => {
    audio.volume = 0;
    let step = 0;
    const interval = FADE_DURATION_MS / FADE_STEPS;

    const timer = setInterval(() => {
      step++;
      const progress = step / FADE_STEPS;
      // Ease-out curve for a natural swell
      audio.volume = Math.min(MAX_VOLUME * (1 - Math.pow(1 - progress, 3)), MAX_VOLUME);

      if (step >= FADE_STEPS) clearInterval(timer);
    }, interval);
  }, []);

  useEffect(() => {
    if (!play || started) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0;

    audio
      .play()
      .then(() => {
        setStarted(true);
        fadeIn(audio);
      })
      .catch(() => {
        // Browser blocked autoplay — that's ok, user can unmute manually
      });
  }, [play, started, fadeIn]);

  // Handle mute/unmute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !started) return;
    audio.muted = muted;
  }, [muted, started]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />

      {/* Floating mute/unmute button — bottom-right, subtle */}
      <AnimatePresence>
        {started && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={toggleMute}
            className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full
                       bg-teal-light/80 backdrop-blur-sm border border-accent/20
                       flex items-center justify-center
                       text-accent/70 hover:text-accent hover:border-accent/40
                       transition-colors shadow-lg"
            aria-label={muted ? "Unmute music" : "Mute music"}
          >
            {muted ? (
              /* Muted icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              /* Playing icon — speaker with waves */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
