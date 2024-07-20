import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"
import { Theme, ThemePanel } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Troy Mackenzie-Smee",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <Theme>
          {/* <ThemePanel /> */}
          <div className="isolate min-h-screen bg-gray-50">
            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col border-x border-x-slate-100 bg-white/70 px-8 shadow-xl lg:px-24">
              <div className="absolute -left-[300px] top-[200px] -z-10 size-[500px] rounded-full bg-blue-300/25 blur-3xl" />
              <div className="absolute -left-[180px] top-[450px] -z-10 size-[500px] rounded-full bg-indigo-300/20 blur-3xl" />
              <div className="absolute -right-[300px] bottom-[200px] -z-10 size-[500px] rounded-full bg-pink-300/15 blur-3xl" />
              <Header />
              <div className="flex-1 pb-16 pt-28 md:pt-40">{children}</div>
              <Footer />
            </div>
          </div>
        </Theme>
      </body>
    </html>
  )
}
