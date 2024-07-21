import { cn } from "@/lib/utils/styling"
import Link from "next/link"
import { cloneElement, ReactElement } from "react"
import { IconType } from "react-icons"
import { FiArrowUpRight } from "react-icons/fi"
import { RiMoneyDollarCircleFill } from "react-icons/ri"

interface ProjectCardProps {
  title: string
  description: string
  href: string
  icon: ReactElement
}

export default function ProjectCard({
  title,
  description,
  href,
  icon,
}: ProjectCardProps) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group rounded-md border border-slate-200 bg-white px-5 py-5 shadow-sm transition duration-300 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex size-10 items-center justify-center rounded-full border border-slate-200 p-px">
        {cloneElement(icon, {
          className: cn("text-sky-700 size-full", icon.props.className),
        })}
      </div>
      <div className="mt-3 flex items-center">
        <h2 className="text-lg font-medium">{title}</h2>
        <FiArrowUpRight className="ml-1.5 text-slate-300 transition-colors duration-300 group-hover:text-slate-400" />
      </div>
      <p className="mt-1.5 text-sm text-slate-500">{description}</p>
    </Link>
  )
}
