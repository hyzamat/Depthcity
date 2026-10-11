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

// Absolute base for social previews and canonical links; NEXT_PUBLIC_SITE_URL overrides it (e.g. for a staging host).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://depthcity.hizarc.com";

const title = `${site.name}: ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  openGraph: {
    title,
    description: site.description,
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.motto}` }],
    type: "website",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/brand/og.jpg"],
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
