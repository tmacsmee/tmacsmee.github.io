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
    <nav className="sm:shrink-0">
      <ul className="sticky top-6 flex justify-end gap-5 sm:top-20 sm:flex-col sm:justify-normal lg:top-30">
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
        "relative text-base tracking-tighter transition lg:text-lg",
        isActive ? "text-stone-900" : "text-stone-500 hover:blur-[1px]",
      )}
    >
      {text}
    </Link>
  );
}
