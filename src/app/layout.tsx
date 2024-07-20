import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"
import { Theme, ThemePanel } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <Theme>
          <ThemePanel />
          <div className="min-h-screen bg-gray-900">
            <main className="max-w-6xl flex flex-col bg-slate-900 shadow-xl border-x border-x-slate-800 min-h-screen mx-auto px-24">
              <Header />
              {children}
              <Footer />
            </main>
          </div>
        </Theme>
      </body>
    </html>
  )
}
