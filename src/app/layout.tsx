import Navigation from "@/components/navigation";
import Shockwave from "@/components/shockwave";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Troy Mackenzie-Smee",
    template: "%s - Troy Mackenzie-Smee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} min-h-screen bg-background font-sans`}
      >
        <Shockwave />
        <div className="p-6 sm:p-8 sm:pt-20 md:p-12 md:pt-20 lg:pt-30">
          <div className="[--nav-gap:3rem] sm:grid sm:grid-cols-[1fr_minmax(0,var(--container-3xl))_1fr] md:[--nav-gap:4rem] lg:[--nav-gap:6rem]">
            <Navigation />
            <main>
              <ViewTransition default="crossfade">{children}</ViewTransition>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
