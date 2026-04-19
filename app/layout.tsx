import type { Metadata } from "next";
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
  src: "./fonts/MaterialSymbolsOutlined.woff2",
  variable: "--font-material-symbols",
});

export const metadata: Metadata = {
  title: {
    default: `KERNEL_CONSOLE // ${siteConfig.name.toUpperCase().replace(" ", "_")}`,
    template: `%s // KERNEL_CONSOLE`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
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
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
