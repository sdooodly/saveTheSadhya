import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { weddingConfig } from "@/wedding.config";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: weddingConfig.meta.title,
  description: weddingConfig.meta.description,
  openGraph: {
    title: weddingConfig.meta.title,
    description: weddingConfig.meta.description,
    images: [weddingConfig.meta.ogImage],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-cream text-dark font-sans font-light antialiased">
        {children}
      </body>
    </html>
  );
}
