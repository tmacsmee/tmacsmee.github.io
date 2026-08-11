import { PokeballFilled } from "@/components/pokeball";
import { ProjectCard } from "@/components/project-card";
import Title from "@/components/title";
import GradientPokemonRL from "@/static/mesh-351.png";
import GradientHnsw from "@/static/mesh-360.png";
import GradientPokemonExpert from "@/static/mesh-577.png";
import GradientSockchat from "@/static/mesh-62.png";
import GradientCoin from "@/static/mesh-982.png";
import { CircleDollarSign, Layers, Plug } from "lucide-react";
import { Metadata } from "next";
import { StaticImageData } from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Projects",
};

const iconClassName =
  "size-16 text-white/85 mix-blend-overlay transition-colors group-hover:text-white";

const projects: {
  id: number;
  icon: React.ReactNode;
  name: React.ReactNode;
  description: string;
  href: string;
  image: StaticImageData;
}[] = [
  {
    id: 0,
    icon: <Layers className={iconClassName} />,
    name: "Hub-Aware HNSW",
    description: "A hub-aware HNSW index for efficient similarity search.",
    href: "https://github.com/tmacsmee/part-4-project",
    image: GradientHnsw,
  },
  {
    id: 1,
    icon: <CircleDollarSign className={iconClassName} />,
    name: "Coin Detector",
    description: "Detects coins in images using computer vision.",
    href: "https://github.com/tmacsmee/coin-detector",
    image: GradientCoin,
  },
  {
    id: 2,
    icon: <PokeballFilled className={iconClassName} />,
    name: "Pokémon Expert Agent",
    description: "An expert agent for Pokémon Showdown",
    href: "https://github.com/tmacsmee/pokemon-expert-agent",
    image: GradientPokemonExpert,
  },
  {
    id: 3,
    icon: <PokeballFilled className={iconClassName} />,
    name: "Pokémon RL Agent",
    description: "A reinforcement learning agent for Pokémon Showdown",
    href: "https://github.com/tmacsmee/pokemon-rl-agent",
    image: GradientPokemonRL,
  },
  {
    id: 4,
    icon: <Plug className={iconClassName} />,
    name: "Sockchat",
    description: "A command line chat application using sockets.",
    href: "https://github.com/tmacsmee/sockchat",
    image: GradientSockchat,
  },
];

export default function ProjectsPage() {
  return (
    <div>
      <Title>Projects</Title>

      <ul className="mt-6 grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(({ id, icon, name, description, href, image }) => (
          <ProjectCard
            key={id}
            icon={icon}
            name={name}
            description={description}
            href={href}
            image={image}
          />
        ))}
      </ul>
    </div>
  );
}
