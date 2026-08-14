"use client";

const SPACING = 36; // px between mesh lines
const SEGMENT = 8; // px between sampled points along a line
const SPEED = 500; // px/s the wavefront travels
const LIFETIME = 2000; // ms a ripple lives for, so it dies out ~1000px from the click
const AMPLITUDE = 12; // px of peak in-plane displacement
const WAVELENGTH = 0.4; // wave packet width, as a fraction of the radius
const MIN_WAVELENGTH = 45; // px, keeps the packet sane at small radii
const MAX_WAVELENGTH = 70; // px, stops the packet smearing as it spreads
const REACH = 1.5; // how many packet widths still count as disturbed
const FALLOFF = 260; // px, radius past which the wave starts losing energy
const FADE = 1.5; // how sharply the ripple dims over its life; higher fades sooner
const RIPPLE_LIMIT = 6; // live ripples; each one adds work at every mesh vertex
const MESH = "rgba(0,0,0,0.1)";
const TAU = Math.PI * 2;
// Anything the click already means something to. A ripple under a link or a
// button reads as a second, competing response to the same press.
const INTERACTIVE =
  'a[href],button,input,select,textarea,label,summary,[role="button"],[role="link"],[contenteditable=""],[contenteditable="true"]';

type Ripple = { x: number; y: number; start: number };

type Wave = {
  x: number;
  y: number;
  radius: number;
  band: number;
  amplitude: number;
  inner: number;
  outer: number;
  innerSq: number;
  outerSq: number;
  crest: number; // where the crest sits within the inner..outer gradient
  fade: number; // envelope that eases the ripple in on birth and out on death
};

function packet(phase: number) {
  return Math.exp(-phase * phase * 2.5);
}

function wave(ripple: Ripple, now: number): Wave {
  const elapsed = now - ripple.start;
  const age = elapsed / LIFETIME;
  const radius = (SPEED * elapsed) / 1000;
  const band = Math.min(
    Math.max(WAVELENGTH * radius, MIN_WAVELENGTH),
    MAX_WAVELENGTH,
  );
  const inner = Math.max(radius - band * REACH, 0);
  const outer = radius + band * REACH;
  return {
    x: ripple.x,
    y: ripple.y,
    radius,
    band,
    amplitude:
      AMPLITUDE *
      (1 - age) ** 1.5 *
      Math.sqrt(FALLOFF / Math.max(radius, FALLOFF)),
    inner,
    outer,
    innerSq: inner * inner,
    outerSq: outer * outer,
    crest: (radius - inner) / (outer - inner),
    fade: Math.min((1 - age) ** FADE, age * 12),
  };
}

/**
 * Scratch output for `displace`, which runs for thousands of vertices a frame
 * and is the one hot loop here. Every read happens in the statement after the
 * call that filled it.
 */
const displacement = { x: 0, y: 0, disturbed: false };

function displace(waves: Wave[], x: number, y: number) {
  displacement.x = 0;
  displacement.y = 0;
  displacement.disturbed = false;

  for (const w of waves) {
    const ox = x - w.x;
    const oy = y - w.y;
    const distanceSq = ox * ox + oy * oy;
    // Outside the band the mask hides the mesh entirely, so those vertices can
    // be rejected on squared distance and keep the sqrt off the path.
    if (distanceSq < w.innerSq || distanceSq > w.outerSq) continue;
    const distance = Math.sqrt(distanceSq) || 1e-4;
    const phase = (distance - w.radius) / w.band;
    // Divide by `distance` once to normalise the radial direction.
    const push = (w.amplitude * packet(phase)) / distance;
    displacement.x += ox * push;
    displacement.y += oy * push;
    displacement.disturbed = true;
  }
}

/**
 * The stretch of one mesh line that any wave still reaches, clamped to
 * `limitFrom`..`limitTo` and snapped to the global sample grid. Culls most of
 * the canvas while the ripples are small and spread out, and little once they
 * have grown into each other. A sample of margin at each end leaves room to
 * open and close a run on an undisturbed vertex.
 */
function measureSpan(
  waves: Wave[],
  fixed: number,
  vertical: boolean,
  limitFrom: number,
  limitTo: number,
) {
  let lo = Infinity;
  let hi = -Infinity;

  for (const w of waves) {
    // Half the chord this line cuts through the wave's outer circle. A zero
    // half is kept, not skipped: a line that only grazes the circle still has
    // the one vertex on it, which `displace` counts as disturbed.
    const offset = fixed - (vertical ? w.x : w.y);
    const halfSq = w.outerSq - offset * offset;
    if (halfSq < 0) continue;
    const half = Math.sqrt(halfSq);
    const centre = vertical ? w.y : w.x;
    lo = Math.min(lo, centre - half);
    hi = Math.max(hi, centre + half);
  }

  const from = Math.max(
    Math.ceil((lo - SEGMENT) / SEGMENT) * SEGMENT,
    limitFrom,
  );
  const to = Math.min(hi + SEGMENT, limitTo);
  return {
    from,
    samples: to < from ? 0 : Math.floor((to - from) / SEGMENT) + 1,
  };
}

function traceLine(
  ctx: CanvasRenderingContext2D,
  waves: Wave[],
  startX: number,
  startY: number,
  stepX: number,
  stepY: number,
  samples: number,
) {
  let prevX = 0;
  let prevY = 0;
  let started = false;
  let drawing = false;

  for (let i = 0; i < samples; i++) {
    // Stepped off the start rather than accumulated, so the sample grid cannot
    // drift away from the grid the other lines are sampled on.
    const x = startX + stepX * i;
    const y = startY + stepY * i;
    displace(waves, x, y);
    const px = x + displacement.x;
    const py = y + displacement.y;

    if (displacement.disturbed) {
      if (!drawing) {
        // Open the run on the previous, undisturbed sample so the stroke
        // reaches the edge of the band rather than stopping short of it.
        if (started) ctx.moveTo(prevX, prevY);
        else ctx.moveTo(px, py);
        drawing = true;
      }
      ctx.lineTo(px, py);
    } else if (drawing) {
      ctx.lineTo(px, py);
      drawing = false;
    }

    prevX = px;
    prevY = py;
    started = true;
  }
}

/**
 * Strokes every line into one path, so the mesh takes a single stroke. Both
 * grids start at the origin, so vertices stay put from frame to frame instead
 * of crawling.
 */
function traceMesh(
  ctx: CanvasRenderingContext2D,
  waves: Wave[],
  width: number,
  height: number,
) {
  ctx.beginPath();

  for (let x = 0; x <= width; x += SPACING) {
    const span = measureSpan(waves, x, true, 0, height);
    if (span.samples === 0) continue;
    traceLine(ctx, waves, x, span.from, 0, SEGMENT, span.samples);
  }

  for (let y = 0; y <= height; y += SPACING) {
    const span = measureSpan(waves, y, false, 0, width);
    if (span.samples === 0) continue;
    traceLine(ctx, waves, span.from, y, SEGMENT, 0, span.samples);
  }

  ctx.strokeStyle = MESH;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function paintBand(
  target: CanvasRenderingContext2D,
  w: Wave,
  rgb: string,
  alpha: number,
) {
  const gradient = target.createRadialGradient(
    w.x,
    w.y,
    w.inner,
    w.x,
    w.y,
    w.outer,
  );
  gradient.addColorStop(0, `rgba(${rgb},0)`);
  gradient.addColorStop(w.crest, `rgba(${rgb},${alpha})`);
  gradient.addColorStop(1, `rgba(${rgb},0)`);
  target.fillStyle = gradient;
  // Punch out the disc inside `inner`: the gradient is fully transparent there,
  // so rasterising it is wasted fill.
  target.beginPath();
  target.arc(w.x, w.y, w.outer, 0, TAU);
  target.moveTo(w.x + w.inner, w.y);
  target.arc(w.x, w.y, w.inner, 0, TAU, true);
  target.fill();
}

/** The visible canvas and its mask are always sized and transformed together. */
type Surfaces = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mask: HTMLCanvasElement;
  maskCtx: CanvasRenderingContext2D;
};

/**
 * Starts listening for clicks and animating the ripples they leave, and returns
 * the teardown. Kept out of `attach` so the surfaces arrive already checked.
 */
function runShockwave({ canvas, ctx, mask, maskCtx }: Surfaces) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ripples: Ripple[] = [];
  let frame: number | null = null;
  let width = 0;
  let height = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Measure the canvas rather than the window: the scrollbar gutter keeps it
    // narrower than `innerWidth`, and sizing the buffer from the window would
    // stretch the drawing sideways, away from the pointer.
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    for (const surface of [canvas, mask]) {
      surface.width = Math.round(width * dpr);
      surface.height = Math.round(height * dpr);
    }
    // Resizing the backing store resets all context state, so everything that
    // outlives a frame has to be reapplied here.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    maskCtx.globalCompositeOperation = "lighter"; // overlapping reveals add up
  }

  function draw(waves: Wave[]) {
    ctx.clearRect(0, 0, width, height);
    maskCtx.clearRect(0, 0, width, height);

    for (const w of waves) {
      paintBand(maskCtx, w, "255,255,255", w.fade);
      // One soft shadow sitting on the crest gives the sheet some depth where
      // the mesh lines are too sparse to read on their own.
      paintBand(ctx, w, "0,0,0", 0.025 * w.fade);
    }

    traceMesh(ctx, waves, width, height);

    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(mask, 0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
  }

  function tick() {
    const now = performance.now();
    // Ripples are appended in order of birth, so the expired ones are always
    // at the front.
    while (ripples.length > 0 && now - ripples[0].start >= LIFETIME)
      ripples.shift();

    if (ripples.length === 0) {
      ctx.clearRect(0, 0, width, height);
      frame = null;
      return;
    }

    draw(ripples.map((ripple) => wave(ripple, now)));
    frame = requestAnimationFrame(tick);
  }

  function handleClick(event: MouseEvent) {
    if (reducedMotion.matches) return;
    // `closest` rather than a check on the target itself, so a click landing on
    // the icon or text inside a control still counts as a click on the control.
    const target = event.target;
    if (target instanceof Element && target.closest(INTERACTIVE)) return;
    // Clicks can arrive faster than ripples expire, so retire the oldest.
    if (ripples.length >= RIPPLE_LIMIT) ripples.shift();
    // The canvas is fixed at the viewport origin, so client coords are already
    // canvas coords.
    ripples.push({
      x: event.clientX,
      y: event.clientY,
      start: performance.now(),
    });
    if (frame === null) frame = requestAnimationFrame(tick);
  }

  // Watching the canvas rather than the window also catches the width change
  // when a scrollbar appears or disappears.
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener("click", handleClick);

  return function stop() {
    observer.disconnect();
    window.removeEventListener("click", handleClick);
    if (frame !== null) cancelAnimationFrame(frame);
  };
}

function attach(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  const mask = document.createElement("canvas");
  const maskCtx = mask.getContext("2d");

  if (!ctx || !maskCtx) return () => {};

  return runShockwave({ canvas, ctx, mask, maskCtx });
}

export default function Shockwave() {
  return (
    <canvas
      ref={attach}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
