import Navigation from "@/components/navigation";
import Shockwave from "@/components/shockwave";
import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
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
          <div className="relative mx-auto flex max-w-3xl flex-col gap-y-6 sm:max-w-238 sm:flex-row sm:gap-x-8 sm:gap-y-0 md:gap-x-12 lg:gap-x-20 xl:max-w-3xl xl:gap-x-30">
            <Navigation />
            <main className="w-full max-w-3xl">
              <ViewTransition default="crossfade">{children}</ViewTransition>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
