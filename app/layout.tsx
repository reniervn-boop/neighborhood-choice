import type { Metadata } from "next";
import { Geist, Anton, Creepster } from "next/font/google";
import { Providers } from "./providers";
import BottomNav from "@/components/BottomNav";
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#111111",
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
      <body className="min-h-full flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
