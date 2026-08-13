"use client";

import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useEffect, useRef } from "react";

const DEFAULT_CLASSNAME = "relative cursor-zoom-in w-full h-auto z-0";
const ZOOMED_CLASSNAME =
  "cursor-zoom-out fixed inset-0 m-auto h-[min(30rem,calc(100vh_-_2rem),calc((100vw_-_2rem)/var(--zoom-aspect-ratio)))] w-auto z-100";

// One backdrop and one set of listeners for the page, since only one image can
// be zoomed at a time. `close` is the zoomed image's toggle, or null when none.
let backdrop: HTMLDivElement | null = null;
let close: (() => void) | null = null;

function dismiss() {
  close?.();
}

function setBackdrop(shown: boolean, duration: number) {
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.className = "fixed inset-0 opacity-0 backdrop-blur-md";
    backdrop.addEventListener("click", dismiss);
    window.addEventListener("keydown", (e) => e.key === "Escape" && dismiss());
    window.addEventListener("wheel", dismiss);
    window.addEventListener("touchmove", dismiss);
    document.body.appendChild(backdrop);
  }

  backdrop.style.transition = `opacity ${duration}ms ease`;
  backdrop.style.pointerEvents = shown ? "auto" : "none";
  void backdrop.offsetWidth; // the first fade needs a laid out style to start from
  backdrop.style.opacity = shown ? "1" : "0";
}

function aspectRatioOf({
  src,
  width,
  height,
}: Pick<ImageProps, "src" | "width" | "height">) {
  if (typeof src === "object") {
    const image = "default" in src ? src.default : src;
    return image.width / image.height;
  }
  return width && height ? Number(width) / Number(height) : 1;
}

type ZoomImageProps = ImageProps & {
  aspectRatio?: number;
  duration?: number;
};

export default function ZoomImage({
  aspectRatio,
  duration = 150,
  className,
  style,
  alt,
  ...imgProps
}: ZoomImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isZoomed = useRef(false);

  const ratio = aspectRatio ?? aspectRatioOf(imgProps);

  function toggle() {
    const img = imageRef.current;
    const button = buttonRef.current;
    if (!img || !button) {
      return;
    }

    const zoomed = isZoomed.current;
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : duration;

    // z-index has to hold until the image has finished moving, or it drops
    // behind the backdrop halfway through the zoom out
    img.style.transition = zoomed ? `z-index 0ms linear ${ms}ms` : "";

    const first = img.getBoundingClientRect();
    img.className = zoomed ? DEFAULT_CLASSNAME : ZOOMED_CLASSNAME;
    const last = img.getBoundingClientRect();

    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sx = first.width / last.width || 1;
    const sy = first.height / last.height || 1;

    img.style.transformOrigin = "top left";
    img.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

    void img.offsetWidth; // flush that position so the transition starts from it

    img.style.transition = `transform ${ms}ms ease, z-index 0ms linear ${ms}ms`;
    img.style.transform = "none";

    setBackdrop(!zoomed, ms);
    close = zoomed ? null : toggle;
    button.setAttribute("aria-expanded", String(!zoomed));
    isZoomed.current = !zoomed;
  }

  useEffect(() => {
    return () => {
      if (isZoomed.current) {
        close = null;
        setBackdrop(false, 0);
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={false}
      onClick={toggle}
      style={{ aspectRatio: ratio }}
      className={cn(
        "block cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-800",
        className,
      )}
    >
      <Image
        ref={imageRef}
        alt={alt}
        unoptimized
        placeholder="blur"
        {...imgProps}
        style={
          { ...style, "--zoom-aspect-ratio": ratio } as React.CSSProperties
        }
        className={DEFAULT_CLASSNAME}
      />
    </button>
  );
}
