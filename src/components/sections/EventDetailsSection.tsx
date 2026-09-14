"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Shirt, CalendarPlus, ExternalLink } from "lucide-react";
import { weddingConfig } from "@/wedding.config";
import { SectionHeading, WesAndersonFrame } from "@/components/ui";

const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function DetailCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col items-center text-center gap-3"
    >
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className="retro-label">{label}</span>
      <div className="text-dark font-sans font-light text-sm md:text-base leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}

function buildCalendarUrl() {
  const { event, couple } = weddingConfig;
  const startUtc = "20270131T023000Z";
  const endUtc = "20270131T073000Z";
  const title = encodeURIComponent(
    `${couple.partner1} & ${couple.partner2} — ${event.title}`
  );
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://savethesadhya.com";
  const details = encodeURIComponent(
    `Muhurtham: ${event.muhurthamTime}\n\nYou are cordially invited to the wedding celebration of ${couple.partner1} & ${couple.partner2}.\n\nRSVP & Details: ${siteUrl}`
  );
  const location = encodeURIComponent(`${event.venue}, ${event.address}`);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}&sf=true`;
}

export function EventDetailsSection() {
  const { event, dressCode } = weddingConfig;
  const calendarUrl = buildCalendarUrl();

  return (
    <section className="px-3 py-4 md:px-4 md:py-8">
      <SectionHeading
        label="The Details"
        title={event.title}
        subtitle="An auspicious morning of traditions, blessings, and a grand feast."
      />

      <WesAndersonFrame
        variant="accent"
        className="max-w-3xl mx-auto bg-cream/80 backdrop-blur-sm"
        padding="p-6 md:p-10"
      >
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8"
        >
          {/* Venue */}
          <DetailCard icon={<MapPin size={20} />} label="Venue">
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-lg text-primary hover:text-accent transition-colors
                         inline-flex items-center gap-1.5 underline underline-offset-2 decoration-primary/30
                         hover:decoration-accent/50"
            >
              {event.venue}
              <ExternalLink size={14} className="shrink-0" />
            </a>
            <p className="text-muted text-sm">{event.address}</p>
          </DetailCard>

          {/* Timing — with Nilavilakku */}
          <DetailCard icon={<Clock size={20} />} label="Timing">
            <p className="font-serif italic text-lg">Muhurtham</p>
            <p className="text-muted text-sm">{event.muhurthamTime}</p>
            <p className="mt-1 text-muted text-xs">{event.time}</p>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-primary text-xs font-semibold
                         uppercase tracking-wider hover:text-accent transition-colors
                         underline underline-offset-2 decoration-primary/30 hover:decoration-accent/50"
            >
              <CalendarPlus size={14} className="shrink-0" />
              Add to Calendar
            </a>
          </DetailCard>

          {/* Dress Code */}
          <DetailCard icon={<Shirt size={20} />} label="Dress Code">
            <div className="space-y-3">
              <div className="border border-groom-red/30 rounded-sm p-3 bg-groom-red/5">
                <span className="text-groom-red text-xs font-semibold uppercase tracking-wider block mb-2">
                  Groom&apos;s Side
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#B5403A] border border-dark/10" />
                  <span className="w-5 h-5 rounded-full bg-[#8B2E2A] border border-dark/10" />
                  <span className="w-5 h-5 rounded-full bg-[#D4604A] border border-dark/10" />
                </div>
                <p className="text-muted text-xs mt-2">{dressCode.groomSideNote}</p>
              </div>

              <div className="border border-bride-teal/30 rounded-sm p-3 bg-bride-teal/5">
                <span className="text-bride-teal text-xs font-semibold uppercase tracking-wider block mb-2">
                  Bride&apos;s Side
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#3A7D7B] border border-dark/10" />
                  <span className="w-5 h-5 rounded-full bg-[#2E5C8A] border border-dark/10" />
                  <span className="w-5 h-5 rounded-full bg-[#4A8C6F] border border-dark/10" />
                </div>
                <p className="text-muted text-xs mt-2">{dressCode.brideSideNote}</p>
              </div>
            </div>
          </DetailCard>
        </motion.div>
      </WesAndersonFrame>
    </section>
  );
}
