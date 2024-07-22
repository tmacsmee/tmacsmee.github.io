import Link from "next/link"
import { FaGithub } from "react-icons/fa6"
import Logo from "../svg/logo"
import MobileNavigation from "./mobile-navigation"
import Navlink from "./navlink"

export const navlinks = [
  ["About", "/about"],
  ["Writing", "/writing"],
  ["Projects", "/projects"],
]

export default function Header() {
  return (
    <header className="absolute inset-x-0 mx-auto flex h-16 max-w-6xl items-center justify-between px-8 lg:px-24">
      <Link href="/about" className="group">
        <Logo className="size-6 fill-slate-300 transition-colors group-hover:fill-sky-500" />
      </Link>
      <nav className="hidden md:flex">
        {navlinks.map(([child, href]) => (
          <Navlink key={href} href={href}>
            {child}
          </Navlink>
        ))}
      </nav>
      <Link
        href="https://github.com/tmacsmee"
        target="_blank"
        className="hidden md:flex"
      >
        <FaGithub className="hover size-6 text-slate-400 transition-colors hover:text-sky-500" />
      </Link>

      <MobileNavigation />
    </header>
  )
}
