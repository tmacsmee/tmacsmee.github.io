"use client"

import { cn } from "@/lib/utils/styling"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export default function Navlink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  const isActive = usePathname() === href

  return (
    <Link href={href} className={cn("group flex flex-col items-center")}>
      <div
        className={cn(
          "px-7 pb-1 text-sm font-medium text-slate-400 transition-colors",
          {
            ["text-sky-500"]: isActive,
            ["group-hover:text-sky-500"]: !isActive,
          },
        )}
      >
        {children}
      </div>

      <div
        className={cn(
          "h-px w-full max-w-0 bg-sky-300 transition-[max-width] duration-300",
          {
            ["max-w-[75%]"]: isActive,
          },
        )}
      />
    </Link>
  )
}
