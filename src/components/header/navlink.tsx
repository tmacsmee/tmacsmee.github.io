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
        className={cn("pb-1 px-7 text-white transition-colors font-medium", {
          ["text-sky-500"]: isActive,
          ["hover:text-sky-500"]: !isActive,
        })}>
        {children}
      </div>
      <div
        className={cn("h-px", {
          ["from-transparent via-sky-500 to-transparent w-full bg-gradient-to-r"]:
            isActive,
        })}
      />
    </Link>
  )
}
