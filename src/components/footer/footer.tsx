import Link from "next/link"
import { navlinks } from "../header/header"
import Logo from "../svg/logo"

export default function Footer() {
  return (
    <footer>
      <div className="absolute inset-x-0 mx-auto h-px w-screen max-w-6xl bg-slate-100" />
      <div className="flex flex-col items-center pb-12 pt-8 text-[13px] sm:flex-row sm:items-start sm:justify-between">
        <nav className="flex gap-x-8">
          {navlinks.map(([child, href]) => (
            <Link
              key={href}
              href={href}
              className="font-medium text-slate-400 hover:text-sky-500"
            >
              {child}
            </Link>
          ))}
        </nav>
        <span className="mt-4 text-center text-slate-400 sm:mt-0">
          &copy; {new Date().getFullYear()} Troy Mackenzie-Smee
        </span>
      </div>
    </footer>
  )
}
