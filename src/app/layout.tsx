import type { Metadata, Viewport } from "next";
import { Orbitron, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

// Set NEXT_PUBLIC_SITE_URL at build time (e.g. https://depthcity.com) so social previews get absolute URLs.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  icons: {
    icon: "/brand/favicon-64.png",
    apple: "/brand/apple-touch-icon.png",
  },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/media/hero-skyline-sunset-1600.webp", width: 1600, height: 900 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/media/hero-skyline-sunset-1600.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#06090f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${manrope.variable}`}>
      {/* Native scrolling: scroll-linked animations follow the page directly, with no smoothing lag. */}
      <body>{children}</body>
    </html>
  );
}
