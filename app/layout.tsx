import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BootLoader } from "@/components/motion/boot-loader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: `KERNEL_CONSOLE // ${siteConfig.name}`,
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
    <html lang="en" className="h-full antialiased dark">
      <body className="scanlines min-h-full flex flex-col bg-background text-on-surface font-mono">
        <BootLoader />
        <Navbar />
        <main className="flex-1 pt-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
