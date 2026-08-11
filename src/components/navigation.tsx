"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", text: "about" },
  { href: "/projects", text: "projects" },
  { href: "/images", text: "images" },
];

export default function Navigation() {
  return (
    <nav className="sm:w-36 sm:shrink-0 xl:absolute xl:right-full xl:mr-10 xl:h-full">
      <ul className="flex sm:flex-col gap-5 sm:justify-normal justify-end sticky sm:top-20 top-6 lg:top-30">
        {links.map((link) => (
          <Navlink key={link.href} href={link.href} text={link.text} />
        ))}
      </ul>
    </nav>
  );
}

function Navlink({ href, text }: { href: string; text: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-lg transition relative",
        isActive ? "text-stone-900" : "text-stone-500 hover:blur-[1px]"
      )}
    >
      {text}
    </Link>
  );
}
