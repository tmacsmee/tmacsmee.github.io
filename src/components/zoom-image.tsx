"use client";

import * as Portal from "@radix-ui/react-portal";
import Image, { ImageProps } from "next/image";
import { useCallback, useEffect, useRef } from "react";

type ZoomImageProps = ImageProps & {
  aspectRatio: number;
  duration?: number;
};

const DEFAULT_CLASSNAME =
  "will-change-transform relative cursor-zoom-in w-full h-auto z-0";
const ZOOMED_CLASSNAME =
  "will-change-transform cursor-zoom-out fixed inset-0 m-auto h-120 w-auto z-100";

export default function ZoomImage({
  aspectRatio,
  duration,
  ...imgProps
}: ZoomImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const isZoomed = useRef(false);

  const toggle = useCallback(() => {
    const img = imageRef.current;
    const backdrop = backdropRef.current;
    if (!img || !backdrop) {
      return;
    }

    img.style.transition = isZoomed.current
      ? `z-index 0ms linear ${duration ?? 150}ms`
      : "";

    const first = img.getBoundingClientRect();

    img.className = isZoomed.current ? DEFAULT_CLASSNAME : ZOOMED_CLASSNAME;

    const last = img.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sx = first.width / last.width || 1;
    const sy = first.height / last.height || 1;

    img.style.transformOrigin = "top left";
    img.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    img.offsetWidth;

    img.style.transition = `transform ${
      duration ?? 150
    }ms ease, z-index 0ms linear ${duration ?? 150}ms`;
    img.style.transform = "none";

    backdrop.style.opacity = isZoomed.current ? "0" : "1";
    backdrop.style.pointerEvents = isZoomed.current ? "none" : "auto";

    isZoomed.current = !isZoomed.current;
  }, [duration]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !isZoomed.current) {
        return;
      }
      toggle();
    }

    function handleWheel() {
      if (!isZoomed.current) {
        return;
      }
      toggle();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [toggle]);

  return (
    <>
      <Portal.Root
        ref={backdropRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-0 backdrop-blur-md transition-opacity"
        onClick={toggle}
      />

      <div style={{ aspectRatio }} className={imgProps.className}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          ref={imageRef as React.RefObject<HTMLImageElement>}
          {...imgProps}
          className={DEFAULT_CLASSNAME}
          unoptimized
          placeholder="blur"
          onClick={toggle}
        />
      </div>
    </>
  );
}
