"use client";

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
const LIFETIME = 2000; // ms a ripple lives for, so it dies out ~500px from the click
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

type Ripple = { x: number; y: number; start: number };

/** One ripple frozen at an instant: everything a frame needs to draw it. */
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

type Box = { minX: number; minY: number; maxX: number; maxY: number };

/**
 * A single crest: every vertex the front reaches is pushed outward, then
 * relaxes as it passes. An oscillating packet here would read as two fronts.
 */
function packet(phase: number) {
  return Math.exp(-phase * phase * 2.5);
}

/** Where the wavefront has got to, and how strong it still is. */
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
    // Dies down over its life, and loses height as the front stretches over an
    // ever longer circumference.
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
 * and so must not allocate a result for each one. Every read happens in the
 * statement after the call that filled it.
 */
const displacement = { x: 0, y: 0, disturbed: false };

/** In-plane displacement of a mesh vertex, summed over the live waves. */
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

/** Scratch output for `measureSpan`, on the same terms as `displacement`. */
const span = { from: 0, samples: 0 };

/**
 * The stretch of one mesh line that any wave still reaches, clamped to
 * `limitFrom`..`limitTo` and snapped to the global sample grid. Lines no wave
 * reaches come back empty, which is most of them once the redrawn region is the
 * hull of several ripples rather than one. A sample of margin at each end
 * leaves room to open and close a run on an undisturbed vertex.
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
    // Half the chord the wave's outer circle cuts out of this line. Zero is
    // kept rather than skipped: a line that only grazes the circle still has
    // the one vertex on it, and `displace` counts that vertex as disturbed.
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
  span.from = from;
  span.samples = to < from ? 0 : Math.floor((to - from) / SEGMENT) + 1;
}

/**
 * Strokes one mesh line, walking `samples` points from (`startX`, `startY`)
 * along (`stepX`, `stepY`), and skipping the stretches no wave is touching —
 * for a wave well clear of its origin that is most of the line. Each visible run
 * is extended by the sample either side of it so the stroke runs out to where
 * the mask has faded to nothing.
 */
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

/** Strokes the mesh across `box` as one path, so it takes a single stroke. */
function traceMesh(ctx: CanvasRenderingContext2D, waves: Wave[], box: Box) {
  // Lines and sample points both sit on fixed grids, so vertices stay put from
  // frame to frame instead of crawling as the redrawn region grows.
  const firstSampleX = Math.ceil(box.minX / SEGMENT) * SEGMENT;
  const firstSampleY = Math.ceil(box.minY / SEGMENT) * SEGMENT;

  ctx.beginPath();

  for (
    let x = Math.ceil(box.minX / SPACING) * SPACING;
    x <= box.maxX;
    x += SPACING
  ) {
    measureSpan(waves, x, true, firstSampleY, box.maxY);
    if (span.samples === 0) continue;
    traceLine(ctx, waves, x, span.from, 0, SEGMENT, span.samples);
  }

  for (
    let y = Math.ceil(box.minY / SPACING) * SPACING;
    y <= box.maxY;
    y += SPACING
  ) {
    measureSpan(waves, y, false, firstSampleX, box.maxX);
    if (span.samples === 0) continue;
    traceLine(ctx, waves, span.from, y, SEGMENT, 0, span.samples);
  }

  ctx.strokeStyle = MESH;
  ctx.lineWidth = 1;
  ctx.stroke();
}

/** Fills the annulus a wave occupies, fading out towards both edges. */
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

/** The region the live waves cover, clamped to the canvas. */
function boundWaves(waves: Wave[], width: number, height: number, box: Box) {
  box.minX = Infinity;
  box.minY = Infinity;
  box.maxX = -Infinity;
  box.maxY = -Infinity;

  for (const w of waves) {
    box.minX = Math.min(box.minX, w.x - w.outer);
    box.minY = Math.min(box.minY, w.y - w.outer);
    box.maxX = Math.max(box.maxX, w.x + w.outer);
    box.maxY = Math.max(box.maxY, w.y + w.outer);
  }

  box.minX = Math.max(box.minX, 0);
  box.minY = Math.max(box.minY, 0);
  box.maxX = Math.min(box.maxX, width);
  box.maxY = Math.min(box.maxY, height);
}

/**
 * The visible canvas, plus the offscreen mask the mesh is cut back with. The
 * two are always sized and transformed together.
 */
type Surfaces = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mask: HTMLCanvasElement;
  maskCtx: CanvasRenderingContext2D;
};

/**
 * Starts listening for clicks and animating the ripples they leave, and returns
 * the teardown. Kept out of the component so the surfaces arrive already
 * checked: the effect does the null handling once, at the boundary.
 */
function runShockwave({ canvas, ctx, mask, maskCtx }: Surfaces) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ripples: Ripple[] = [];
  const box: Box = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
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
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    left = rect.left;
    top = rect.top;
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

    // Only the annuli the waves currently occupy have to be redrawn.
    boundWaves(waves, width, height, box);

    for (const w of waves) {
      paintBand(maskCtx, w, "255,255,255", w.fade);
      // One soft shadow sitting on the crest gives the sheet some depth where
      // the mesh lines are too sparse to read on their own. Keep it to a
      // single band, or it reads as a second wavefront.
      paintBand(ctx, w, "0,0,0", 0.025 * w.fade);
    }

    traceMesh(ctx, waves, box);

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
    // Clicks can arrive faster than ripples expire, and each live one is
    // another pass over every vertex, so retire the oldest to bound the work.
    if (ripples.length >= RIPPLE_LIMIT) ripples.shift();
    ripples.push({
      x: event.clientX - left,
      y: event.clientY - top,
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

/**
 * Ref callback rather than an effect: the setup owns a DOM node and nothing
 * else, so hanging it off that node's own lifetime drops the ref indirection
 * and hands the element over already non-null. Declared at module scope so the
 * reference is stable and React never tears down and re-attaches on a render.
 */
function attach(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  // The mesh is drawn in full, then cut back to the disturbed region with this
  // mask, so overlapping ripples each reveal their own band.
  const mask = document.createElement("canvas");
  const maskCtx = mask.getContext("2d");
  // Return a cleanup on every path, even the do-nothing one: React only falls
  // back to calling the ref a second time with `null` when it doesn't get one,
  // and this callback does not take null.
  if (!ctx || !maskCtx) return () => {};

  return runShockwave({ canvas, ctx, mask, maskCtx });
}

export default function Shockwave() {
  // A canvas is a replaced element: without an explicit `h-full w-full` it lays
  // out at its intrinsic (attribute) size instead of filling the inset box.
  return (
    <canvas
      ref={attach}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
