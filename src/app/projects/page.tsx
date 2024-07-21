import ProjectCard from "@/components/projects/ProjectCard"
import { BiSolidBoltCircle } from "react-icons/bi"
import { FiGlobe } from "react-icons/fi"
import { PiHexagonDuotone, PiPencilCircleDuotone } from "react-icons/pi"
import { RiMoneyDollarCircleFill } from "react-icons/ri"
import { TbHexagons } from "react-icons/tb"

type Project = {
  title: string
  description: string
  href: string
  icon: React.ReactElement
}

const projects: Project[] = [
  {
    title: "Coin detection",
    description: "Detects, locates, identifies, and counts NZ coins.",
    href: "https://github.com/tmacsmee/coin-detection",
    icon: <RiMoneyDollarCircleFill />,
  },
  {
    title: "Quick, Draw!",
    description:
      "A drawing game that uses machine learning to guess what you're drawing.",
    href: "https://github.com/tmacsmee/quick-draw",
    icon: <PiPencilCircleDuotone className="text-amber-500" />,
  },
  {
    title: "Zapp",
    description: "A game that helps students focus during lectures.",
    href: "https://github.com/tmacsmee/zapp",
    icon: <BiSolidBoltCircle className="text-yellow-400" />,
  },
  {
    title: "Personal website",
    description: "This website, built with Next.js and Tailwind CSS.",
    href: "https://github.com/tmacsmee/tmacsmee.github.io",
    icon: <FiGlobe className="size-[30px] text-sky-400" />,
  },
  {
    title: "Hexasphere.ts",
    description:
      "Generate hexagonal grids on a sphere using TypeScript. Based on Hexasphere.js.",
    href: "https://github.com/tmacsmee/hexasphere.ts",
    icon: <PiHexagonDuotone className="size-[30px] text-teal-400" />,
  },
]

export default function ProjectsPage() {
  return (
    <main>
      <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">
        Projects
      </h1>
      <p className="mt-6 text-slate-600">
        The stuff I&apos;ve worked on and the stuff I&apos;m working on.
      </p>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(({ title, description, href, icon }) => (
          <ProjectCard
            key={title}
            title={title}
            description={description}
            href={href}
            icon={icon}
          />
        ))}
      </div>
    </main>
  )
}
