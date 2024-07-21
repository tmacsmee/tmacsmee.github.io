"use client"

import * as Dialog from "@radix-ui/react-dialog"
import Link from "next/link"
import { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"
import { navlinks } from "./header"

export default function MobileNavigation() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="group flex items-center justify-center rounded-full bg-transparent p-2 transition-colors hover:bg-slate-100 md:hidden">
        <FiMenu className="size-5 text-slate-400 transition-colors group-hover:text-sky-500" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="data-[state=closed]:animate-dialogFadeOut data-[state=open]:animate-dialogFadeIn fixed inset-0 bg-white/50 px-10 pt-28 backdrop-blur-2xl">
          <Dialog.Title className="sr-only">
            Mobile navigation menu
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Use the following links to navigate the site.
          </Dialog.Description>
          <Dialog.Close className="group absolute right-8 top-3.5 flex items-center justify-center rounded-full bg-transparent p-2 transition-colors hover:bg-slate-100">
            <FiX className="size-5 text-slate-400 transition-colors group-hover:text-sky-500" />
          </Dialog.Close>
          <nav className="flex flex-col gap-y-10">
            {navlinks.map(([child, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full text-4xl font-medium text-slate-800 transition-colors hover:text-sky-500"
                onClick={() => setOpen(false)}
              >
                {child}
              </Link>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
