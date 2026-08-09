import { PokeballFilled } from "@/components/pokeball";
import { CirclePoundSterling, Layers, Plug } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Projects",
};

const projects: {
  id: number;
  icon: React.ReactNode;
  name: React.ReactNode;
  description: string;
  href: string;
}[] = [
  {
    id: 0,
    icon: <Layers className="size-16 text-white mix-blend-overlay" />,
    name: "Hub-Aware HNSW",
    description: "A hub-aware HNSW index for efficient similarity search.",
    href: "https://github.com/tmacsmee/part-4-project",
  },
  {
    id: 1,
    icon: (
      <CirclePoundSterling className="size-16 text-white mix-blend-overlay" />
    ),
    name: "Coin Detector",
    description: "Detects coins in images using computer vision.",
    href: "https://github.com/tmacsmee/coin-detector",
  },
  {
    id: 2,
    icon: <PokeballFilled className="size-16 text-white mix-blend-overlay" />,
    name: "Pokémon Expert Agent",
    description: "An expert agent for Pokémon Showdown",
    href: "https://github.com/tmacsmee/pokemon-expert-agent",
  },
  {
    id: 3,
    icon: <PokeballFilled className="size-16 text-white mix-blend-overlay" />,
    name: "Pokémon Reinforcement Learning Agent",
    description: "A reinforcement learning agent for Pokémon Showdown",
    href: "https://github.com/tmacsmee/pokemon-rl-agent",
  },
  {
    id: 4,
    icon: <Plug className="size-16 text-white mix-blend-overlay" />,
    name: "Sockchat",
    description: "A command line chat application using sockets.",
    href: "https://github.com/tmacsmee/sockchat",
  },
];

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-6">Some stuff I&apos;ve worked on.</p>

      <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(({ id, icon, name, description, href }) => (
          <li key={id}>
            <Link
              href={href}
              target="_blank"
              className="flex h-full flex-col border border-neutral-300 transition hover:shadow-sm"
            >
              <div className="flex h-32 items-center justify-center bg-linear-to-br from-neutral-600 to-black">
                {icon}
              </div>
              <div className="p-3">
                <h2 className="font-medium">{name}</h2>
                <p className="text-sm text-neutral-800">{description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
