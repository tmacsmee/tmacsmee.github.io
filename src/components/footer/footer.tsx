import Link from "next/link"
import { navlinks } from "../header/header"
import Logo from "../svg/logo"

export default function Footer() {
  return (
    <footer className="">
      <div className="max-w-6xl w-screen absolute inset-x-0 mx-auto bg-slate-800 h-px" />
      <div className="pt-8 pb-8">
        <Link href="/about" className="group">
          <Logo className="size-6 fill-slate-400 transition-colors group-hover:fill-sky-500" />
        </Link>
        <div className="text-sm flex justify-between items-end">
          <nav className="gap-x-8 flex mt-6">
            {navlinks.map(([child, href]) => (
              <Link
                key={href}
                href={href}
                className="text-slate-400 font-medium hover:text-sky-500">
                {child}
              </Link>
            ))}
          </nav>
          <span className="text-slate-500">
            &copy; {new Date().getFullYear()} Troy Mackenzie-Smee
          </span>
        </div>
      </div>
    </footer>
  )
}
