"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FADE_DURATION_MS = 3000; // gentle volume ramp
const MAX_VOLUME = 0.35; // soothing, not blasting
const FADE_STEPS = 60;

export const MUSIC_ELEMENT_ID = "bg-music";

/**
 * Start the music. Call this directly inside a tap/click handler: iPhones only
 * allow audio to start from within the user's gesture, not from a later effect.
 */
export function startMusic() {
  const audio = document.getElementById(MUSIC_ELEMENT_ID) as HTMLAudioElement | null;
  if (!audio) return;
  audio.volume = 0;
  audio.play().catch(() => {
    // Blocked or failed — the play button stays available.
  });
}

interface BackgroundMusicProps {
  src: string;
  /** True once the guest has opened the invitation: shows the play/pause button. */
  show: boolean;
}

export function BackgroundMusic({ src, show }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);

  const fadeIn = useCallback((audio: HTMLAudioElement) => {
    if (fadeTimer.current) clearInterval(fadeTimer.current);
    audio.volume = 0;
    let step = 0;
    fadeTimer.current = setInterval(() => {
      step++;
      const progress = step / FADE_STEPS;
      audio.volume = Math.min(MAX_VOLUME * (1 - Math.pow(1 - progress, 3)), MAX_VOLUME);
      if (step >= FADE_STEPS && fadeTimer.current) clearInterval(fadeTimer.current);
    }, FADE_DURATION_MS / FADE_STEPS);
  }, []);

  // Keep the button in sync with the real audio state, and fade in on every start.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => {
      setPlaying(true);
      fadeIn(audio);
    };
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      if (fadeTimer.current) clearInterval(fadeTimer.current);
    };
  }, [fadeIn]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  return (
    <>
      {/* preload="none": the track only downloads once the guest opens the invitation */}
      <audio id={MUSIC_ELEMENT_ID} ref={audioRef} src={src} preload="none" loop />

      <AnimatePresence>
        {show && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={toggle}
            className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full
                       bg-teal-light/80 backdrop-blur-sm border border-accent/20
                       flex items-center justify-center
                       text-accent hover:text-gold-light hover:border-accent/40
                       transition-colors shadow-lg"
            aria-label={playing ? "Pause music" : "Play music"}
            aria-pressed={playing}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
