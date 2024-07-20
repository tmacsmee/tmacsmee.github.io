import Link from "next/link"
import { navlinks } from "../header/header"
import Logo from "../svg/logo"

export default function Footer() {
  return (
    <footer>
      <div className="absolute inset-x-0 mx-auto h-px w-screen max-w-6xl bg-slate-100" />
      <div className="pb-8 pt-8">
        <Link href="/about" className="group inline-block size-6">
          <Logo className="size-full fill-slate-300 transition-colors group-hover:fill-sky-500" />
        </Link>
        <div className="flex items-end justify-between text-sm">
          <nav className="mt-6 flex gap-x-8">
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
          <span className="text-slate-400">
            &copy; {new Date().getFullYear()} Troy Mackenzie-Smee
          </span>
        </div>
      </div>
    </footer>
  )
}
