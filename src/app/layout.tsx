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
          {/* --nav-column is the space reserved for the nav plus its gap
              (--nav-width is an allowance for the widest link, not a measured
              value; if the links outgrow it the gap gives way, see navigation).
              --main-inset is where main starts: centred while there is room for
              it, then pinned at the nav column, at which point the space on the
              right runs out and main shrinks with the viewport. */}
          <div className="relative [--main-inset:max(calc((100%-var(--container-3xl))/2),var(--nav-column))] [--nav-column:calc(var(--nav-width)+var(--nav-gap))] [--nav-gap:2rem] [--nav-width:4rem] md:[--nav-gap:3rem] lg:[--nav-gap:6rem]">
            <Navigation />
            <main className="mx-auto max-w-3xl sm:mr-0 sm:ml-(--main-inset)">
              <ViewTransition default="crossfade">{children}</ViewTransition>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
