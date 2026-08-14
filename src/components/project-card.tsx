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
      className="group transition will-change-transform active:scale-95 active:opacity-90"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a href={href} target="_blank" className="flex flex-col gap-y-3">
        <div className="relative flex h-40 items-center justify-center lg:h-54">
          <Image
            src={image}
            alt={"placeholder"}
            fill
            placeholder="blur"
            className="rounded-lg object-cover"
          />
          <animated.div
            style={iconSpring}
            className="relative z-10 flex size-16 items-center justify-center rounded-lg bg-white/8 backdrop-blur-xs will-change-transform"
          >
            <div className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-br from-white/80 from-40% via-white/10 to-white/40 to-60% mask-b-to-white mask-exclude [mask-clip:content-box,border-box] p-px"></div>
            {icon}
          </animated.div>
        </div>

        <div className="flex flex-col gap-y-1">
          <div>
            <h2 className="text-sm font-semibold text-stone-800 transition group-hover:text-black md:text-base">
              {name}
            </h2>
          </div>
          <p className="text-xs text-stone-600 md:text-sm">{description}</p>
        </div>
      </a>
    </li>
  );
}
