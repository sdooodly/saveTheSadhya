"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, Minus, CheckCircle } from "lucide-react";
import { weddingConfig } from "@/wedding.config";
import { Confetti } from "@/components/ui";

interface RSVPFormData {
  name: string;
  attending: "yes" | "no" | "";
  plusOnes: number;
  plusOneNames: string[];
  message: string;
}

const initialForm: RSVPFormData = {
  name: "",
  attending: "",
  plusOnes: 0,
  plusOneNames: [],
  message: "",
};

export function RSVPSection() {
  const [form, setForm] = useState<RSVPFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { rsvp } = weddingConfig;

  function update<K extends keyof RSVPFormData>(key: K, value: RSVPFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePlusOneChange(count: number) {
    const clamped = Math.max(0, Math.min(count, rsvp.maxPlusOnes));
    const names = [...form.plusOneNames];
    while (names.length < clamped) names.push("");
    update("plusOnes", clamped);
    update("plusOneNames", names.slice(0, clamped));
  }

  function updatePlusOneName(index: number, value: string) {
    const names = [...form.plusOneNames];
    names[index] = value;
    update("plusOneNames", names);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const res = await fetch(`${basePath}/api/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        if (form.attending === "yes") {
          setShowConfetti(true);
        }
      }
    } catch {
      setSubmitted(true);
      if (form.attending === "yes") setShowConfetti(true);
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase =
    "w-full px-4 py-3 bg-cream border border-primary/20 rounded-sm font-sans text-sm font-light text-dark " +
    "placeholder:text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 " +
    "transition-colors";

  const buttonBase =
    "px-6 py-3 rounded-sm font-sans text-sm font-semibold uppercase tracking-wider transition-all";

  return (
    <section className="w-full px-5 py-12 md:px-8 md:py-16 flex justify-center">
      <Confetti active={showConfetti} />

      <div className="max-w-md w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-serif italic text-3xl md:text-4xl text-dark tracking-tight font-medium">
            RSVP
          </h2>
          <p className="mt-2 text-muted font-sans font-light text-sm">
            Kindly respond by{" "}
            {new Date(rsvp.deadline).toLocaleDateString("en-IN", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </motion.div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <CheckCircle className="mx-auto text-accent mb-4" size={40} />
              <h3 className="font-serif italic text-2xl text-dark mb-2">
                Thank You, {form.name}!
              </h3>
              <p className="text-muted text-sm font-light">
                {form.attending === "yes"
                  ? "We can't wait to celebrate with you!"
                  : "We'll miss you! Thank you for letting us know."}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="rsvp-name"
                  className="block text-muted text-xs uppercase tracking-[0.2em] font-sans font-light mb-2"
                >
                  Your Name
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  className={inputBase}
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>

              {/* Attendance */}
              <fieldset>
                <legend className="block text-muted text-xs uppercase tracking-[0.2em] font-sans font-light mb-3">
                  Will You Attend?
                </legend>
                <div className="flex gap-3">
                  {(["yes", "no"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => update("attending", option)}
                      className={`${buttonBase} flex-1 border ${
                        form.attending === option
                          ? "bg-primary text-cream border-primary"
                          : "bg-transparent text-dark border-primary/20 hover:border-primary/40"
                      }`}
                    >
                      {option === "yes" ? "Joyfully Accept" : "Regretfully Decline"}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Additional guests */}
              <AnimatePresence>
                {form.attending === "yes" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <span className="block text-muted text-xs uppercase tracking-[0.2em] font-sans font-light mb-3">
                        Additional Guests
                      </span>
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          type="button"
                          onClick={() => handlePlusOneChange(form.plusOnes - 1)}
                          className="w-11 h-11 flex items-center justify-center border border-primary/20 rounded-sm text-primary hover:bg-primary/5 transition-colors"
                          aria-label="Remove guest"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-serif text-lg text-dark w-6 text-center">
                          {form.plusOnes}
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePlusOneChange(form.plusOnes + 1)}
                          className="w-11 h-11 flex items-center justify-center border border-primary/20 rounded-sm text-primary hover:bg-primary/5 transition-colors"
                          aria-label="Add guest"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {form.plusOneNames.map((name, i) => (
                        <input
                          key={i}
                          type="text"
                          className={`${inputBase} mt-2`}
                          placeholder={`Guest ${i + 1} name`}
                          value={name}
                          onChange={(e) => updatePlusOneName(i, e.target.value)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Note — only when declining */}
              <AnimatePresence>
                {form.attending === "no" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <label
                      htmlFor="rsvp-message"
                      className="block text-muted text-xs uppercase tracking-[0.2em] font-sans font-light mb-2"
                    >
                      A Note for the Couple
                    </label>
                    <textarea
                      id="rsvp-message"
                      rows={3}
                      className={`${inputBase} resize-none`}
                      placeholder="We'll miss you, but leave a note..."
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={!form.attending || submitting}
                className={`${buttonBase} w-full flex items-center justify-center gap-2 bg-primary text-cream hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Send size={14} />
                {submitting ? "Sending…" : "Send RSVP"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
