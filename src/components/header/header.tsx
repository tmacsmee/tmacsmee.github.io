import Link from "next/link"
import { FaGithub } from "react-icons/fa6"
import Logo from "../svg/logo"
import Navlink from "./navlink"

export const navlinks = [
  ["About", "/about"],
  ["Blog", "/blog"],
  ["Projects", "/projects"],
]

export default function Header() {
  return (
    <header className="max-w-6xl px-24 fixed inset-x-0 mx-auto h-16 flex items-center justify-between">
      <Link href="/about" className="group">
        <Logo className="size-6 fill-slate-300 transition-colors group-hover:fill-sky-500" />
      </Link>
      <nav className="flex">
        {navlinks.map(([child, href]) => (
          <Navlink key={href} href={href}>
            {child}
          </Navlink>
        ))}
      </nav>
      <Link href="https://github.com/tmacsmee" target="_blank">
        <FaGithub className="size-6 text-slate-400 hover hover:text-sky-500 transition-colors" />
      </Link>
    </header>
  )
}
