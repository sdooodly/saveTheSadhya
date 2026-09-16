"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { weddingConfig } from "@/wedding.config";

export function FooterSection() {
  const { couple, event } = weddingConfig;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-10 px-4 text-center"
    >
      <p className="font-serif italic text-xl text-dark">
        {couple.partner1} & {couple.partner2}
      </p>
      <p className="text-muted text-xs font-sans font-light uppercase tracking-[0.2em] mt-2">
        {new Date(event.date).toLocaleDateString("en-IN", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      {/* Venue QR */}
      <div className="flex justify-center mt-8">
        <div className="flex flex-col items-center gap-2">
          <div className="p-2 bg-white rounded-sm border border-primary/15">
            <QRCodeSVG
              value={event.mapUrl}
              size={72}
              bgColor="#FFFFFF"
              fgColor="#1E2F2F"
              level="M"
            />
          </div>
          <span className="text-muted text-[0.55rem] uppercase tracking-wider font-sans">
            Scan for Venue Map
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
