import type { Metadata, Viewport } from "next";
import { Orbitron, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { analytics, seo, site } from "@/content/site";

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

const verification: Metadata["verification"] = {
  ...(seo.googleSiteVerification ? { google: seo.googleSiteVerification } : {}),
  ...(seo.bingSiteVerification ? { other: { "msvalidate.01": seo.bingSiteVerification } } : {}),
};

// Site-wide defaults. The home page adds its canonical URL and Open Graph URL (src/app/page.tsx); the legal pages set
// their own title, description and canonical.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  applicationName: site.name,
  keywords: seo.keywords,
  authors: [{ name: seo.studio.name, url: seo.studio.url }],
  creator: seo.studio.name,
  publisher: seo.studio.name,
  category: "games",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 },
  },
  icons: {
    // Google's search-result favicon needs a square icon at a multiple of 48 px
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  verification,
  openGraph: {
    title: seo.title,
    description: seo.description,
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.motto}` }],
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
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
      <body>
        {children}
        {/* Cookie-free visitor stats (~2 KB); see `analytics` in src/content/site.ts */}
        {analytics.umamiWebsiteId && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id={analytics.umamiWebsiteId}
            data-domains={analytics.domains}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
