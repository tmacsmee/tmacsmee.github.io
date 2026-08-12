"use client";

import { useEffect, useRef } from "react";

/**
 * The page background is treated as a stretched mesh. A click sends a wave
 * packet travelling outward from the click point; every mesh vertex it passes
 * is pushed along the radius, so the grid bunches and spreads like a rubber
 * sheet. The mesh is only revealed where the wave is currently disturbing it,
 * which keeps the page clean at rest.
 */
const SPACING = 36; // px between mesh lines
const SEGMENT = 8; // px between sampled points along a line
const SPEED = 500; // px/s the wavefront travels
const LIFETIME = 1000; // ms a ripple lives for, so it dies out ~500px from the click
const AMPLITUDE = 12; // px of peak in-plane displacement
const WAVELENGTH = 0.4; // wave packet width, as a fraction of the radius
const MIN_WAVELENGTH = 45; // px, keeps the packet sane at small radii
const MAX_WAVELENGTH = 70; // px, stops the packet smearing as it spreads
const REACH = 1.5; // how many packet widths still count as disturbed
const FALLOFF = 260; // px, radius past which the wave starts losing energy
const MESH = "rgba(28,25,23,0.1)";

type Ripple = { x: number; y: number; start: number };

/**
 * A single crest: every vertex the front reaches is pushed outward, then
 * relaxes as it passes. An oscillating packet here would read as two fronts.
 */
function packet(phase: number) {
  return Math.exp(-phase * phase * 2.5);
}

export default function Shockwave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // The mesh is drawn in full, then cut back to the disturbed region with
    // this mask, so overlapping ripples each reveal their own band.
    const mask = document.createElement("canvas");
    const context = canvas?.getContext("2d");
    const maskContext = mask.getContext("2d");
    if (!canvas || !context || !maskContext) return;

    // Re-bound without the nullable type so the draw helpers below can use them.
    const ctx: CanvasRenderingContext2D = context;
    const maskCtx: CanvasRenderingContext2D = maskContext;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ripples: Ripple[] = [];
    let frame: number | null = null;
    let width = 0;
    let height = 0;
    let left = 0;
    let top = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Measure the canvas itself rather than the window: the scrollbar gutter
      // keeps it narrower than `innerWidth`, and sizing the buffer from the
      // window would stretch the drawing sideways, away from the pointer.
      const rect = ctx.canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      left = rect.left;
      top = rect.top;
      for (const surface of [ctx.canvas, maskCtx.canvas]) {
        surface.width = Math.round(width * dpr);
        surface.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /** Where the wavefront has got to, and how strong it still is. */
    function shape(ripple: Ripple, now: number) {
      const age = (now - ripple.start) / LIFETIME;
      const radius = (SPEED * (now - ripple.start)) / 1000;
      const band = Math.min(
        Math.max(WAVELENGTH * radius, MIN_WAVELENGTH),
        MAX_WAVELENGTH,
      );
      // Dies down over its life, and loses height as the front stretches over
      // an ever longer circumference.
      const amplitude =
        AMPLITUDE *
        (1 - age) ** 1.5 *
        Math.min(1, Math.sqrt(FALLOFF / Math.max(radius, 1)));
      const inner = Math.max(radius - band * REACH, 0);
      const outer = radius + band * REACH;
      return { age, radius, band, amplitude, inner, outer };
    }

    /** In-plane displacement of a mesh vertex, summed over live ripples. */
    function displace(x: number, y: number, now: number) {
      let dx = 0;
      let dy = 0;
      for (const ripple of ripples) {
        const { radius, band, amplitude } = shape(ripple, now);
        const ox = x - ripple.x;
        const oy = y - ripple.y;
        const distance = Math.hypot(ox, oy) || 0.0001;
        const phase = (distance - radius) / band;
        if (phase < -REACH || phase > REACH) continue;
        const offset = amplitude * packet(phase);
        dx += (ox / distance) * offset;
        dy += (oy / distance) * offset;
      }
      return [dx, dy] as const;
    }

    function draw(now: number) {
      ctx.clearRect(0, 0, width, height);
      maskCtx.clearRect(0, 0, width, height);
      maskCtx.globalCompositeOperation = "lighter";

      // Only the annulus each ripple currently occupies has to be redrawn.
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const ripple of ripples) {
        const { age, radius, inner, outer } = shape(ripple, now);
        minX = Math.min(minX, ripple.x - outer);
        minY = Math.min(minY, ripple.y - outer);
        maxX = Math.max(maxX, ripple.x + outer);
        maxY = Math.max(maxY, ripple.y + outer);

        // Position of the crest within the gradient, which starts at `inner`.
        const crest = (radius - inner) / (outer - inner);
        const fade = Math.min(1, (1 - age) * 2.2) * Math.min(1, age * 12);

        const reveal = maskCtx.createRadialGradient(
          ripple.x,
          ripple.y,
          inner,
          ripple.x,
          ripple.y,
          outer,
        );
        reveal.addColorStop(0, "rgba(255,255,255,0)");
        reveal.addColorStop(crest, `rgba(255,255,255,${fade})`);
        reveal.addColorStop(1, "rgba(255,255,255,0)");
        maskCtx.fillStyle = reveal;
        maskCtx.beginPath();
        maskCtx.arc(ripple.x, ripple.y, outer, 0, Math.PI * 2);
        maskCtx.fill();

        // One soft shadow sitting on the crest gives the sheet some depth where
        // the mesh lines are too sparse to read on their own. Keep it to a
        // single band, or it reads as a second wavefront.
        const sheen = ctx.createRadialGradient(
          ripple.x,
          ripple.y,
          inner,
          ripple.x,
          ripple.y,
          outer,
        );
        sheen.addColorStop(0, "rgba(0,0,0,0)");
        sheen.addColorStop(crest, `rgba(0,0,0,${0.025 * fade})`);
        sheen.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = sheen;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, outer, 0, Math.PI * 2);
        ctx.fill();
      }

      minX = Math.max(Math.floor(minX), 0);
      minY = Math.max(Math.floor(minY), 0);
      maxX = Math.min(Math.ceil(maxX), width);
      maxY = Math.min(Math.ceil(maxY), height);

      ctx.beginPath();
      for (
        let x = Math.ceil(minX / SPACING) * SPACING;
        x <= maxX;
        x += SPACING
      ) {
        for (let y = minY; y <= maxY; y += SEGMENT) {
          const [dx, dy] = displace(x, y, now);
          if (y === minY) ctx.moveTo(x + dx, y + dy);
          else ctx.lineTo(x + dx, y + dy);
        }
      }
      for (
        let y = Math.ceil(minY / SPACING) * SPACING;
        y <= maxY;
        y += SPACING
      ) {
        for (let x = minX; x <= maxX; x += SEGMENT) {
          const [dx, dy] = displace(x, y, now);
          if (x === minX) ctx.moveTo(x + dx, y + dy);
          else ctx.lineTo(x + dx, y + dy);
        }
      }
      ctx.strokeStyle = MESH;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    }

    function tick() {
      const now = performance.now();
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].start >= LIFETIME) ripples.splice(i, 1);
      }
      if (ripples.length === 0) {
        ctx.clearRect(0, 0, width, height);
        frame = null;
        return;
      }
      draw(now);
      frame = requestAnimationFrame(tick);
    }

    function handleClick(event: MouseEvent) {
      if (reducedMotion.matches) return;
      ripples.push({
        x: event.clientX - left,
        y: event.clientY - top,
        start: performance.now(),
      });
      if (frame === null) frame = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // A canvas is a replaced element: without an explicit `h-full w-full` it lays
  // out at its intrinsic (attribute) size instead of filling the inset box.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
