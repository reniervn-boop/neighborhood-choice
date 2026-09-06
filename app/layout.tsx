import type { Metadata, Viewport } from "next";
import { Geist, Anton, Creepster } from "next/font/google";
import { Providers } from "./providers";
import BottomNav from "@/components/BottomNav";
import DesktopNav from "@/components/DesktopNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400", // Anton only has one weight — it's inherently bold/display
});

const creepster = Creepster({
  variable: "--font-creepster",
  subsets: ["latin"],
  weight: "400", // Creepster is a single-weight display font for Halloween
});

export const metadata: Metadata = {
  title: "SX7RA — Sundowner Ext. 7",
  description: "Sundowner Ext. 7 Residents Association — suburb reporting, noticeboard and community app",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // Required for env(safe-area-inset-*) to resolve to anything but 0 on iOS.
  // Without it the translucent status bar overlaps the header and the home
  // indicator overlaps the bottom nav once the app is installed to the homescreen.
  viewportFit: "cover",
  themeColor: "#060709",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${anton.variable} ${creepster.variable} h-full antialiased`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SX7RA" />
      </head>
      <body className="min-h-full" style={{ backgroundColor: 'var(--background)' }}>
        <Providers>
          <DesktopNav />
          <div className="lg:pl-64 flex flex-col min-h-dvh">
            {children}
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
