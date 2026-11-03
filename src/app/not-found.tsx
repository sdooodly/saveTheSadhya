import Link from "next/link";
import { weddingConfig } from "@/wedding.config";

// Shown for mistyped links, e.g. a truncated URL pasted from WhatsApp.
export default function NotFound() {
  const { couple } = weddingConfig;
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <p className="script-name text-6xl">
        {couple.partner1} &amp; {couple.partner2}
      </p>
      <p className="mt-4 text-cream text-xl">This page could not be found.</p>
      <Link
        href="/"
        className="mt-6 text-ink text-xl underline decoration-gold underline-offset-[6px] hover:decoration-ink"
      >
        Open the invitation
      </Link>
    </main>
  );
}
