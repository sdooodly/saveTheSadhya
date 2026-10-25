import type { Metadata } from "next";
import localFont from "next/font/local";
import { weddingConfig } from "@/wedding.config";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Same typefaces as the printed invite, self-hosted (SIL Open Font License).
const garamond = localFont({
  variable: "--font-garamond",
  display: "swap",
  src: [
    { path: "../fonts/eb-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/eb-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/eb-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/eb-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
});

const italianno = localFont({
  variable: "--font-italianno",
  display: "swap",
  src: [{ path: "../fonts/italianno-latin-400-normal.woff2", weight: "400", style: "normal" }],
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
    <html lang="en" className={`${garamond.variable} ${italianno.variable}`}>
      <body className="min-h-screen bg-teal text-cream font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
