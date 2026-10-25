import type { Metadata } from "next";
import localFont from "next/font/local";
import { weddingConfig } from "@/wedding.config";
import "./globals.css";

// Trailing slash so relative paths (like the preview image) resolve under the site's sub-path.
const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/`;

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
    type: "website",
    url: siteUrl,
    siteName: weddingConfig.meta.title,
    title: weddingConfig.meta.title,
    description: weddingConfig.meta.description,
    images: [
      {
        url: new URL(weddingConfig.meta.ogImage, siteUrl).toString(),
        width: 1200,
        height: 630,
        alt: weddingConfig.meta.description,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: weddingConfig.meta.title,
    description: weddingConfig.meta.description,
    images: [new URL(weddingConfig.meta.ogImage, siteUrl).toString()],
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
