"use client";

import { animated, useSpring } from "@react-spring/web";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";

export function ProjectCard({
  icon,
  name,
  description,
  href,
  image,
}: {
  icon: React.ReactNode;
  name: React.ReactNode;
  description: string;
  href: string;
  image: StaticImageData;
}) {
  const [hovered, setHovered] = useState(false);

  const iconSpring = useSpring({
    scale: hovered ? 1.05 : 1,
    config: { tension: 400, friction: 16 },
  });

  return (
    <li
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a href={href} target="_blank" className="flex flex-col gap-y-3">
        <div className="relative flex h-40 items-center justify-center lg:h-56">
          <Image
            src={image}
            alt={"placeholder"}
            fill
            className="rounded-lg object-cover"
          />
          <animated.div
            style={iconSpring}
            className="relative z-10 flex size-16 items-center justify-center rounded-lg bg-white/10 backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:bg-linear-to-br before:from-white/80 before:from-40% before:via-white/10 before:to-white/40 before:to-60% before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:mask-exclude before:[mask-clip:content-box,border-box] before:p-px"
          >
            {icon}
          </animated.div>
        </div>

        <div className="flex flex-col gap-y-1">
          <h2 className="text-sm font-semibold text-neutral-800 transition group-hover:text-black md:text-base">
            {name}
          </h2>
          <p className="text-xs text-neutral-600 md:text-sm">{description}</p>
        </div>
      </a>
    </li>
  );
}
