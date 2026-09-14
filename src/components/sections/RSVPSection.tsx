"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, Minus, CheckCircle } from "lucide-react";
import { weddingConfig } from "@/wedding.config";
import { SectionHeading, WesAndersonFrame, Confetti } from "@/components/ui";

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
      const res = await fetch("/api/rsvp", {
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
    "w-full px-4 py-3 bg-cream border border-primary/30 rounded-sm font-sans text-sm font-light text-dark " +
    "placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 " +
    "transition-colors";

  const buttonBase =
    "px-6 py-3 rounded-sm font-sans text-sm font-semibold uppercase tracking-wider transition-all";

  return (
    <section className="px-3 py-4 md:px-4 md:py-8">
      <Confetti active={showConfetti} />

      <SectionHeading
        label="Be Our Guest"
        title="RSVP"
        subtitle={`Kindly respond by ${new Date(rsvp.deadline).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}.`}
      />

      <WesAndersonFrame
        variant="primary"
        className="max-w-xl mx-auto bg-cream/90 backdrop-blur-sm"
        padding="p-6 md:p-10"
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="mx-auto text-accent mb-4" size={48} />
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
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label htmlFor="rsvp-name" className="retro-label mb-2">
                  Your Name
                </label>
                <input id="rsvp-name" type="text" required className={inputBase} placeholder="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>

              {/* Attendance */}
              <fieldset>
                <legend className="retro-label mb-3">Will You Attend?</legend>
                <div className="flex gap-3">
                  {(["yes", "no"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => update("attending", option)}
                      className={`${buttonBase} flex-1 border ${
                        form.attending === option
                          ? "bg-primary text-cream border-primary"
                          : "bg-transparent text-dark border-primary/30 hover:border-primary"
                      }`}
                    >
                      {option === "yes" ? "Joyfully Accept" : "Regretfully Decline"}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Additional guests — only when accepting */}
              <AnimatePresence>
                {form.attending === "yes" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5 overflow-hidden"
                  >
                    <div>
                      <span className="retro-label mb-3 block">Additional Guests</span>
                      <div className="flex items-center gap-3 mb-3">
                        <button type="button" onClick={() => handlePlusOneChange(form.plusOnes - 1)} className="w-10 h-10 flex items-center justify-center border border-primary/30 rounded-sm text-primary hover:bg-primary/10 transition-colors" aria-label="Remove guest"><Minus size={16} /></button>
                        <span className="font-serif text-xl text-dark w-8 text-center">{form.plusOnes}</span>
                        <button type="button" onClick={() => handlePlusOneChange(form.plusOnes + 1)} className="w-10 h-10 flex items-center justify-center border border-primary/30 rounded-sm text-primary hover:bg-primary/10 transition-colors" aria-label="Add guest"><Plus size={16} /></button>
                      </div>
                      {form.plusOneNames.map((name, i) => (
                        <input key={i} type="text" className={`${inputBase} mt-2`} placeholder={`Guest ${i + 1} name`} value={name} onChange={(e) => updatePlusOneName(i, e.target.value)} />
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
                    <label htmlFor="rsvp-message" className="retro-label mb-2">A Note for the Couple</label>
                    <textarea id="rsvp-message" rows={3} className={`${inputBase} resize-none`} placeholder="We'll miss you, but leave a note..." value={form.message} onChange={(e) => update("message", e.target.value)} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={!form.attending || submitting}
                className={`${buttonBase} w-full flex items-center justify-center gap-2 bg-primary text-cream hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send size={16} />
                {submitting ? "Sending…" : "Send RSVP"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </WesAndersonFrame>
    </section>
  );
}
