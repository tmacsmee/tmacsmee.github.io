import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"
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
  description:
    "Hi, I'm Troy, a full-stack web developer and software engineering student from Auckland, New Zealand.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} relative bg-gray-50`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative mx-auto h-full max-w-6xl">
            <div className="absolute -left-[300px] top-[200px] size-[500px] rounded-full bg-blue-300/25 blur-3xl" />
            <div className="absolute -left-[180px] top-[450px] size-[500px] rounded-full bg-indigo-300/20 blur-3xl" />
            <div className="absolute -right-[300px] bottom-[200px] size-[500px] rounded-full bg-pink-300/15 blur-3xl" />
          </div>
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col border-x border-x-slate-100 bg-white/70 px-8 shadow-xl lg:px-24">
          <Header />
          <div className="flex-1 pb-24 pt-20 md:pt-32">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
