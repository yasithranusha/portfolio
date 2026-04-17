import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { BootLoader } from "@/components/motion/boot-loader";
import { siteConfig } from "@/config/site";

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
    <html lang="en" className="dark h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="scanlines min-h-full flex flex-col bg-background text-on-surface font-mono overflow-x-hidden">
        <BootLoader />
        <Navbar />
        <Sidebar />
        {/* Main canvas: sidebar offset on md+, top navbar offset, bottom footer offset */}
        <main className="md:ml-64 pt-12 pb-10 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
