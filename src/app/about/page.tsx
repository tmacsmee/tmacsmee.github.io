import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { IconType } from "react-icons"
import { FaGithub, FaLinkedin } from "react-icons/fa6"
import { FiInstagram } from "react-icons/fi"
import Me from "../../../public/me.png"

export const metadata: Metadata = {
  title: "About | Troy Mackenzie-Smee",
}

const socialIcons: [string, IconType][] = [
  ["https://github.com/tmacsmee", FaGithub],
  ["https://www.instagram.com/troy_ms", FiInstagram],
  ["https://www.linkedin.com/in/troy-mackenzie-smee-51812a226/", FaLinkedin],
]

export default function AboutPage() {
  return (
    <>
      <main className="flex flex-col items-center gap-y-12 md:flex-row md:gap-y-0">
        <div className="flex-[0.80]">
          <h1 className="mt-6 text-4xl font-bold text-slate-800 md:text-5xl">
            Troy Mackenzie-Smee
          </h1>
          <h2 className="mt-2 text-2xl font-medium text-slate-600">
            Full-stack developer.
          </h2>
          <p className="mt-12 text-slate-600">
            Hi, I&apos;m Troy, a full-stack web developer and software
            engineering student from Auckland, New Zealand.
          </p>
          <hr className="mt-8 border-t-slate-100" />
          <div className="mt-4 flex gap-x-5">
            {socialIcons.map(([url, Icon]) => (
              <Link
                key={url}
                href={url}
                target="_blank"
                className="group size-6"
              >
                <Icon className="size-full text-slate-300 transition-colors group-hover:text-sky-500" />
              </Link>
            ))}
          </div>
        </div>
        <div className="relative mx-auto aspect-[2238/2703] w-full max-w-[270px] overflow-clip rounded-bl-[4px] rounded-br-[50px] rounded-tl-[50px] rounded-tr-[4px] shadow-2xl shadow-blue-400/30">
          <Image src={Me} alt="A picture of me" placeholder="blur" fill />
        </div>
      </main>
    </>
  )
}
