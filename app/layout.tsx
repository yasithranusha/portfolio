import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { GlobalCursorSpotlight } from "@/components/ui/cursor-spotlight";
import { siteConfig } from "@/config/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const materialSymbols = localFont({
  src: "./fonts/MaterialSymbolsSubset.woff2",
  variable: "--font-material-symbols",
  display: "block",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name.toLowerCase().replace(/\s+/g, ""),
    template: `%s | ${siteConfig.name.toLowerCase().replace(/\s+/g, "")}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords, siteConfig.name],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         siteConfig.url,
    siteName:    siteConfig.branding,
    title:       `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
    images:      [{ url: "/logo-square.png", width: 1200, height: 1200, alt: `${siteConfig.name} — ${siteConfig.role}` }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
    creator:     `@${siteConfig.handle}`,
    site:        `@${siteConfig.handle}`,
    images:      ["/logo-square.png"],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
  other: {
    "og:logo": `${siteConfig.url}icon.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark h-full ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${materialSymbols.variable}`}>
      <body
        suppressHydrationWarning
        className="scanlines min-h-full flex flex-col bg-background text-on-surface font-mono overflow-x-hidden"
      >
        <GlobalCursorSpotlight />
        <Navbar />
        <Sidebar />
        {/* Main canvas: sidebar offset on md+, top navbar offset, bottom footer offset */}
        <main className="md:ml-64 pt-12 pb-10 min-h-screen">{children}</main>
        <Suspense><Footer /></Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
