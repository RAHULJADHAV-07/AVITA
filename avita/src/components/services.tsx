import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, Code2, Command, Globe, Layers, Pause, Play, Sparkles, X } from "lucide-react";

const services = [
  { title: "Web & Mobile Development", short: "Web & Mobile", text: "Fast, intuitive experiences. Built to scale.", detail: "Experiences people love to use.", tags: ["React", "iOS / Android", "PWA"], icon: Code2 },
  { title: "Software Engineering", short: "Engineering", text: "Thoughtful architecture. Dependable software.", detail: "Strong foundations. Lasting possibilities.", tags: ["Architecture", "APIs", "Quality"], icon: Command },
  { title: "Cloud & Infrastructure", short: "Cloud", text: "A reliable foundation for what comes next.", detail: "Ready for wherever you grow.", tags: ["DevOps", "Scale", "Security"], icon: Globe },
  { title: "Digital Products", short: "Products", text: "From the first idea to a product that works.", detail: "Your next big idea, made real.", tags: ["Strategy", "UX / UI", "MVP"], icon: Layers },
  { title: "Automation & Integrations", short: "Automation", text: "Connected systems. Simpler ways of working.", detail: "Less friction. More forward motion.", tags: ["Workflows", "Integrations", "Ops"], icon: Asterisk },
  { title: "AI / Data / Custom Solutions", short: "AI & Data", text: "Practical intelligence for real business challenges.", detail: "Intelligence with a real-world purpose.", tags: ["AI agents", "Data", "Custom"], icon: Sparkles },
];
const ACCENT = services.map(() => "#b8a4ff");
const DEEP = services.map(() => "#7a52f0");
const TILT = [.1, .14, .1, .1, .16, .1];
const AUTOPLAY = 6000;
const GLYPHS = "!<>-_\\/[]{}=+*^?#AVITA01";

/* Particle shapes: every shape has COUNT points normalised to a radius of 1. */
type Vec = [number, number, number];
const COUNT = 1900;
function random(seed: number) {
  return () => { seed |= 0; seed = seed + 0x6d2b79f5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
type Draw = (ctx: CanvasRenderingContext2D) => void;
/* Paints an icon on a 400px canvas and turns it into an extruded particle solid: dense front and back faces plus side walls. */
function extrude(draw: Draw, rand: () => number, depth = .13): Vec[] | null {
  const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = canvas.height = 400;
  if (!ctx) return null;
  ctx.fillStyle = ctx.strokeStyle = "#fff"; ctx.lineCap = ctx.lineJoin = "round";
  draw(ctx);
  const data = ctx.getImageData(0, 0, 400, 400).data, on = (x: number, y: number) => x >= 0 && y >= 0 && x < 400 && y < 400 && data[(y * 400 + x) * 4 + 3] > 128;
  const fill: [number, number][] = [], edge: [number, number][] = [];
  for (let y = 0; y < 400; y += 2) for (let x = 0; x < 400; x += 2) if (on(x, y)) (on(x - 3, y) && on(x + 3, y) && on(x, y - 3) && on(x, y + 3) ? fill : edge).push([x, y]);
  if (!fill.length || !edge.length) return null;
  return Array.from({ length: COUNT }, (_, i) => {
    const side = i % 10 < 5, [x, y] = side ? edge[Math.floor(rand() * edge.length)] : fill[Math.floor(rand() * fill.length)];
    const z = side ? (rand() * 2 - 1) * depth : (i % 2 ? depth : -depth) + (rand() - .5) * .03;
    return [(x - 200) / 160, -(y - 200) / 160, z];
  });
}
const drawCode: Draw = ctx => { ctx.font = '700 170px "Space Grotesk", Arial, sans-serif'; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("</>", 200, 212); };
const drawBraces: Draw = ctx => { ctx.font = '700 230px "Space Grotesk", Arial, sans-serif'; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("{ }", 200, 196); };
const drawCloud: Draw = ctx => {
  [[128, 236, 68], [205, 182, 92], [282, 228, 72]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });
  ctx.beginPath(); ctx.roundRect(70, 222, 270, 82, 41); ctx.fill();
  ctx.globalCompositeOperation = "destination-out"; ctx.lineWidth = 26;
  ctx.beginPath(); ctx.moveTo(205, 286); ctx.lineTo(205, 182); ctx.moveTo(165, 220); ctx.lineTo(205, 180); ctx.lineTo(245, 220); ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
};
const drawBulb: Draw = ctx => {
  ctx.lineWidth = 34;
  ctx.beginPath(); ctx.arc(200, 150, 104, Math.PI * .78, Math.PI * 2.22); ctx.lineTo(244, 282); ctx.lineTo(156, 282); ctx.closePath(); ctx.stroke();
  [306, 342].forEach(y => { ctx.beginPath(); ctx.roundRect(150, y - 12, 100, 24, 12); ctx.fill(); });
  ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(176, 250); ctx.lineTo(176, 182); ctx.lineTo(200, 160); ctx.lineTo(224, 182); ctx.lineTo(224, 250); ctx.stroke();
};
const drawSync: Draw = ctx => {
  const arrow = (from: number, to: number) => {
    ctx.lineWidth = 32; ctx.beginPath(); ctx.arc(200, 200, 122, from * Math.PI, to * Math.PI); ctx.stroke();
    const a = to * Math.PI, x = 200 + Math.cos(a) * 122, y = 200 + Math.sin(a) * 122, tx = -Math.sin(a), ty = Math.cos(a), nx = Math.cos(a), ny = Math.sin(a);
    ctx.beginPath(); ctx.moveTo(x + tx * 78, y + ty * 78); ctx.lineTo(x + nx * 64, y + ny * 64); ctx.lineTo(x - nx * 64, y - ny * 64); ctx.closePath(); ctx.fill();
  };
  arrow(1.1, 1.72); arrow(.1, .72);
};
const drawAI: Draw = ctx => {
  ctx.font = '700 230px "Space Grotesk", Arial, sans-serif'; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("AI", 180, 222);
  ctx.beginPath(); const x = 330, y = 88, r = 56;
  ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
};
const DRAWINGS = [drawCode, drawBraces, drawCloud, drawBulb, drawSync, drawAI];
const NEEDS_FONT = [0, 1, 5];
function sphere(rand: () => number): Vec[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const y = 1 - (i / COUNT) * 2, r = Math.sqrt(1 - y * y), phi = i * 2.399963 + rand() * .01;
    return [Math.cos(phi) * r, y, Math.sin(phi) * r];
  });
}
function normalise(shape: Vec[]) {
  const max = Math.max(...shape.map(([x, y, z]) => Math.hypot(x, y, z)));
  return shape.map(([x, y, z]) => [x / max, y / max, z / max] as Vec);
}
let shapeCache: Vec[][] | null = null, fontsReady = false;
const build = (i: number) => normalise(extrude(DRAWINGS[i], random(7 + i), i === 0 ? .16 : .13) || sphere(random(i)));
function getShapes() {
  if (!shapeCache) shapeCache = DRAWINGS.map((_, i) => NEEDS_FONT.includes(i) && document.fonts.status !== "loaded" ? sphere(random(i)) : build(i));
  if (!fontsReady && document.fonts.status === "loaded") { NEEDS_FONT.forEach(i => { shapeCache![i] = build(i); }); fontsReady = true; }
  return shapeCache;
}
const sprites = new Map<string, HTMLCanvasElement>();
function sprite(color: string) {
  let canvas = sprites.get(color);
  if (canvas) return canvas;
  canvas = document.createElement("canvas"); canvas.width = canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) { const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, color); g.addColorStop(.25, color); g.addColorStop(1, "transparent"); ctx.fillStyle = g; ctx.fillRect(0, 0, 32, 32); }
  sprites.set(color, canvas);
  return canvas;
}
const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

type Layout = (width: number, height: number) => { cx: number; cy: number; size: number };
function particleField(canvas: HTMLCanvasElement, host: HTMLElement, index: number, layout: Layout, stage = false) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { show() {}, destroy() {} };
  const stride = stage ? 1 : 3, n = Math.floor(COUNT / stride), FOV = 4.5;
  const pick = (shape: Vec[]) => stride === 1 ? shape : Array.from({ length: n }, (_, i) => shape[i * stride]);
  let shapes = getShapes().map(pick);
  const rand = random(11);
  const current = new Float32Array(n * 3), push = new Float32Array(n * 2), screen = new Float32Array(n * 2), scatter = new Float32Array(n * 3), delay = new Float32Array(n);
  for (let i = 0; i < n; i++) { for (let k = 0; k < 3; k++) { current[i * 3 + k] = shapes[index][i][k]; scatter[i * 3 + k] = (rand() - .5) * 2.6; } delay[i] = rand(); }
  const sets = ACCENT.map((color, i) => [sprite(color), sprite("#f6f3ff"), sprite(DEEP[i])]);
  const dust = stage ? Array.from({ length: 70 }, () => ({ x: rand(), y: rand(), s: .2 + rand() * .8, r: .5 + rand() * 1.2 })) : [];
  const plexus = stage ? new Float32Array(Math.ceil(n / 14) * 2) : null;
  const shocks: { x: number; y: number; start: number }[] = [];
  const pointer = { x: -9999, y: -9999, tx: 0, ty: 0, sx: 0, sy: 0 };
  let from = index, to = index, start = 0, width = 1, height = 1, scale = 1, frame = 0, visible = false, dirty = true, rotation = rand() * 6, last = performance.now();
  void document.fonts.ready.then(() => { shapes = getShapes().map(pick); dirty = true; });

  function draw(now: number) {
    const motion = document.documentElement.dataset.motion === "on", dt = Math.min(now - last, 50) / 16.67;
    last = now;
    const local = from === to || !motion ? 1 : smooth(0, 1, (now - start) / 1500);
    pointer.sx += (pointer.tx - pointer.sx) * (motion ? .05 * dt : 1); pointer.sy += (pointer.ty - pointer.sy) * (motion ? .05 * dt : 1);
    if (motion) rotation += (stage ? .0045 : .006) * dt;
    const { cx, cy, size } = layout(width, height);
    const ry = Math.sin(rotation) * .55 + pointer.sx * .5, rx = TILT[from] + (TILT[to] - TILT[from]) * local + pointer.sy * .35;
    const cosY = Math.cos(ry), sinY = Math.sin(ry), cosX = Math.cos(rx), sinX = Math.sin(rx);
    const a = shapes[from], b = shapes[to], ease = motion ? Math.min(1, .075 * dt) : 1;

    ctx!.setTransform(scale, 0, 0, scale, 0, 0);
    if (stage && motion) { ctx!.globalCompositeOperation = "destination-out"; ctx!.fillStyle = "rgba(0,0,0,.6)"; ctx!.fillRect(0, 0, width, height); }
    else ctx!.clearRect(0, 0, width, height);
    ctx!.globalCompositeOperation = "lighter";
    const tint = local < .5 ? from : to;
    if (stage) {
      ctx!.fillStyle = ACCENT[tint];
      dust.forEach(d => {
        if (motion) { d.y -= .00035 * d.s * dt; if (d.y < 0) d.y = 1; }
        ctx!.globalAlpha = .18 + d.s * .3;
        ctx!.fillRect(d.x * width + Math.sin(rotation * 2 + d.y * 9) * 12, d.y * height, d.r, d.r);
      });
      ctx!.globalAlpha = .5; ctx!.strokeStyle = ACCENT[tint]; ctx!.lineWidth = 1; ctx!.setLineDash([2, 9]); ctx!.lineDashOffset = -rotation * 60;
      ctx!.beginPath(); ctx!.ellipse(cx, cy + size * 1.08, size * 1.15, size * .2, 0, 0, Math.PI * 2); ctx!.stroke();
      ctx!.globalAlpha = .22; ctx!.setLineDash([]); ctx!.beginPath(); ctx!.ellipse(cx, cy + size * 1.08, size * .8, size * .13, 0, 0, Math.PI * 2); ctx!.stroke();
    }
    let p = 0;
    for (let i = 0; i < n; i++) {
      const t = from === to ? 1 : smooth(delay[i] * .35, .65 + delay[i] * .35, local), burst = motion ? Math.sin(t * Math.PI) : 0, j = i * 3;
      for (let k = 0; k < 3; k++) current[j + k] += (a[i][k] + (b[i][k] - a[i][k]) * t + scatter[j + k] * burst - current[j + k]) * ease;
      const x1 = current[j] * cosY - current[j + 2] * sinY, z1 = current[j] * sinY + current[j + 2] * cosY;
      const y2 = current[j + 1] * cosX - z1 * sinX, z2 = current[j + 1] * sinX + z1 * cosX, depth = FOV / (FOV + z2);
      let px = cx + x1 * size * depth, py = cy - y2 * size * depth;
      const dx = px - pointer.x, dy = py - pointer.y, d2 = dx * dx + dy * dy, reach = stage ? 14000 : 3200;
      if (motion && d2 < reach) { const f = (1 - d2 / reach) * (stage ? 2.6 : 1.6) * dt, d = Math.sqrt(d2) || 1; push[i * 2] += dx / d * f; push[i * 2 + 1] += dy / d * f; }
      push[i * 2] *= .92; push[i * 2 + 1] *= .92;
      px += push[i * 2]; py += push[i * 2 + 1]; screen[i * 2] = px; screen[i * 2 + 1] = py;
      const r = (stage ? Math.max(.8, Math.min(1.9, size / 120)) : 1.4) * depth * (i % 9 === 0 ? 1.8 : 1);
      ctx!.globalAlpha = Math.max(.1, Math.min(1, (stage ? .2 : .3) + (1 - z2) * (stage ? .3 : .4))) * (stage && size < 160 ? .7 : 1);
      ctx!.drawImage(sets[t < .5 ? from : to][i % 9 === 0 ? 1 : i % 5 === 0 ? 2 : 0], px - r * 2, py - r * 2, r * 4, r * 4);
      if (plexus && i % 14 === 0) { plexus[p++] = px; plexus[p++] = py; }
    }
    if (plexus) {
      const reachLine = (size * .28) ** 2;
      ctx!.strokeStyle = ACCENT[tint]; ctx!.lineWidth = .6;
      for (let i = 0; i < p; i += 2) for (let k = i + 2; k < p; k += 2) {
        const dx = plexus[i] - plexus[k], dy = plexus[i + 1] - plexus[k + 1], d2 = dx * dx + dy * dy;
        if (d2 < reachLine) { ctx!.globalAlpha = (1 - d2 / reachLine) * .3; ctx!.beginPath(); ctx!.moveTo(plexus[i], plexus[i + 1]); ctx!.lineTo(plexus[k], plexus[k + 1]); ctx!.stroke(); }
      }
    }
    for (let s = shocks.length - 1; s >= 0; s--) {
      const age = (now - shocks[s].start) / 900;
      if (age > 1) { shocks.splice(s, 1); continue; }
      ctx!.globalAlpha = (1 - age) * .7; ctx!.strokeStyle = ACCENT[tint]; ctx!.lineWidth = 1.5;
      ctx!.beginPath(); ctx!.arc(shocks[s].x, shocks[s].y, 20 + age * 260, 0, Math.PI * 2); ctx!.stroke();
    }
    ctx!.globalAlpha = 1; ctx!.globalCompositeOperation = "source-over";
    dirty = false;
  }
  function tick(now: number) {
    if (!visible || document.hidden) { frame = 0; return; }
    if (dirty || document.documentElement.dataset.motion === "on") draw(now);
    frame = requestAnimationFrame(tick);
  }
  function resume() { if (visible && !document.hidden && !frame) { last = performance.now(); frame = requestAnimationFrame(tick); } }
  const resize = new ResizeObserver(([entry]) => {
    width = entry.contentRect.width; height = entry.contentRect.height; scale = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale); dirty = true; draw(performance.now());
  });
  resize.observe(canvas);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
  observer.observe(canvas);
  const onMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top;
    pointer.tx = pointer.x / rect.width - .5; pointer.ty = pointer.y / rect.height - .5;
  };
  const onLeave = () => { pointer.x = pointer.y = -9999; pointer.tx = pointer.ty = 0; };
  const onDown = (event: PointerEvent) => {
    if (!stage || (event.target as HTMLElement).closest("a, button") || document.documentElement.dataset.motion !== "on") return;
    const rect = canvas.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
    shocks.push({ x, y, start: performance.now() });
    for (let i = 0; i < n; i++) {
      const dx = screen[i * 2] - x, dy = screen[i * 2 + 1] - y, d = Math.hypot(dx, dy) || 1, f = 70 * Math.exp(-d / 170);
      push[i * 2] += dx / d * f; push[i * 2 + 1] += dy / d * f;
    }
  };
  host.addEventListener("pointermove", onMove); host.addEventListener("pointerleave", onLeave); host.addEventListener("pointerdown", onDown);
  document.addEventListener("visibilitychange", resume);
  return {
    show(next: number) { if (next === to) return; from = to; to = next; start = performance.now(); dirty = true; },
    destroy() { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); host.removeEventListener("pointerdown", onDown); document.removeEventListener("visibilitychange", resume); },
  };
}

function useScramble(text: string) {
  const [output, setOutput] = useState(text);
  useEffect(() => {
    if (document.documentElement.dataset.motion !== "on") { setOutput(text); return; }
    let frame = 0; const start = performance.now();
    const tick = (now: number) => {
      const progress = (now - start) / 650;
      setOutput(text.split("").map((char, i) => char === " " || progress > i / text.length + .15 ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(""));
      if (progress < 1.2) frame = requestAnimationFrame(tick); else setOutput(text);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text]);
  return output;
}

const cardLayout: Layout = (width, height) => ({ cx: width / 2, cy: height / 2, size: Math.min(width, height) * .36 });
const stageLayout: Layout = (width, height) => {
  if (width > 960) { const left = width * .44, top = 90, bottom = height - 160; return { cx: (left + width) / 2, cy: (top + bottom) / 2 - 10, size: Math.min(width - left, bottom - top) * .36 }; }
  const top = 70, bottom = height * .46;
  return { cx: width / 2, cy: (top + bottom) / 2, size: Math.min(width, bottom - top) * .34 };
};

function ServiceCard({ index, open }: { index: number; open: (index: number) => void }) {
  const card = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const service = services[index];
  useEffect(() => {
    if (!card.current || !canvas.current) return;
    const field = particleField(canvas.current, card.current, index, cardLayout);
    return field.destroy;
  }, [index]);
  function spotlight(event: ReactPointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }
  return <article ref={card} className="svc-card reveal" style={{ "--accent": ACCENT[index] } as CSSProperties} onPointerMove={spotlight}>
    <canvas ref={canvas} className="svc-card-canvas" aria-hidden="true" />
    <div className="svc-card-top"><span>0{index + 1}</span><button type="button" className="svc-card-arrow" onClick={() => open(index)} aria-label={`Explore ${service.title} in 3D`}><ArrowUpRight size={16} aria-hidden="true" /></button></div>
    <div className="svc-card-body">
      <h3>{service.title}</h3>
      <p className="svc-card-text">{service.text}</p>
      <ul className="svc-card-tags">{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    </div>
  </article>;
}

function Explorer({ active, setActive, onStart, onCloseAutoFocus }: { active: number; setActive: (index: number) => void; onStart: (title: string) => void; onCloseAutoFocus: (event: Event) => void }) {
  const content = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const field = useRef<ReturnType<typeof particleField> | null>(null);
  const wheel = useRef({ total: 0, lock: 0 }), touch = useRef({ x: 0, y: 0 });
  const [playing, setPlaying] = useState(() => document.documentElement.dataset.motion === "on");
  const service = services[active], Icon = service.icon, title = useScramble(service.title);
  const step = (direction: number) => setActive((active + direction + services.length) % services.length);

  useEffect(() => {
    if (!content.current || !canvas.current) return;
    field.current = particleField(canvas.current, content.current, active, stageLayout, true);
    return () => { field.current?.destroy(); field.current = null; };
  }, []); // Created once per opening; later changes go through show().
  useEffect(() => { field.current?.show(active); }, [active]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive((active + 1) % services.length), AUTOPLAY);
    return () => window.clearTimeout(timer);
  }, [active, playing, setActive]);

  return <DialogPrimitive.Content ref={content} className={`explorer ${playing ? "is-playing" : ""}`} style={{ "--accent": ACCENT[active] } as CSSProperties} onCloseAutoFocus={onCloseAutoFocus}
    onWheel={event => {
      const now = performance.now(), w = wheel.current;
      if (now - w.lock < 900) { w.lock = now - 400; return; }
      w.total += event.deltaY + event.deltaX;
      if (Math.abs(w.total) > 40) { step(Math.sign(w.total)); w.total = 0; w.lock = now; }
    }}
    onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
    onTouchEnd={event => {
      const dx = event.changedTouches[0].clientX - touch.current.x, dy = event.changedTouches[0].clientY - touch.current.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 50) step(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : (dy < 0 ? 1 : -1));
    }}
    onKeyDown={event => {
      if (["ArrowRight", "ArrowDown"].includes(event.key)) { event.preventDefault(); step(1); }
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); step(-1); }
    }}>
    <canvas ref={canvas} className="explorer-canvas" aria-hidden="true" />
    <div className="explorer-ghost" aria-hidden="true"><span key={active}>{service.short} · {service.short} · {service.short} · </span></div>
    <span className="explorer-number" aria-hidden="true" key={`n${active}`}>0{active + 1}</span>

    <div className="explorer-bar">
      <p className="eyebrow">AVITA / CAPABILITIES IN 3D</p>
      <div className="explorer-bar-actions">
        <button type="button" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause autoplay" : "Play autoplay"}>{playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}<span>{playing ? "AUTOPLAY" : "PAUSED"}</span></button>
        <DialogPrimitive.Close className="explorer-close" aria-label="Close explorer"><X size={20} aria-hidden="true" /></DialogPrimitive.Close>
      </div>
    </div>

    <div className="explorer-copy" aria-live="polite">
      <p className="eyebrow explorer-kicker"><span><Icon size={14} strokeWidth={1.8} aria-hidden="true" /></span>CAPABILITY 0{active + 1} / 0{services.length}</p>
      <DialogPrimitive.Title asChild><h3><span className="sr-only">{service.title}</span><span aria-hidden="true">{title}</span></h3></DialogPrimitive.Title>
      <DialogPrimitive.Description asChild><p className="sr-only">Explore AVITA’s six capabilities. Scroll, swipe or use the arrow keys to move between them.</p></DialogPrimitive.Description>
      <div className="explorer-copy-body" key={active}>
        <p className="explorer-text">{service.text}</p>
        <p className="explorer-note">{service.detail}</p>
        <ul className="explorer-tags">{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <a href="#contact" className="service-cta" onClick={event => { event.preventDefault(); onStart(service.title); }}>Start a project<span><ArrowUpRight size={18} aria-hidden="true" /></span></a>
      </div>
    </div>

    <div className="explorer-foot">
      <p className="explorer-hint eyebrow" aria-hidden="true">SCROLL · SWIPE · ← → · CLICK TO SHOCK</p>
      <div className="explorer-nav">
        <button type="button" className="explorer-arrow" onClick={() => step(-1)} aria-label="Previous capability"><ArrowLeft size={18} aria-hidden="true" /></button>
        <div className="explorer-tabs">
          {services.map((item, index) => <button type="button" key={item.title} className={active === index ? "is-active" : index < active ? "is-done" : ""} style={{ "--accent": ACCENT[index] } as CSSProperties} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)}>
            <i aria-hidden="true" key={active === index ? `a${active}` : "i"} /><span>0{index + 1}</span><strong>{item.short}</strong>
          </button>)}
        </div>
        <button type="button" className="explorer-arrow" onClick={() => step(1)} aria-label="Next capability"><ArrowRight size={18} aria-hidden="true" /></button>
      </div>
    </div>
  </DialogPrimitive.Content>;
}

export function Services({ selectService }: { selectService: (service: string) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const toContact = useRef(false);
  const section = useRef<HTMLElement>(null), grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Pushes the first row of cards to the bottom of the screen, so a navbar jump shows exactly three cards.
    function fit() {
      const element = grid.current, card = element?.firstElementChild as HTMLElement | null;
      if (!element || !card || !section.current) return;
      element.style.setProperty("--fold", "0px");
      if (innerWidth <= 1100) return;
      let bottom = card.offsetHeight, node: HTMLElement | null = card;
      while (node && node !== section.current) { bottom += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
      const header = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 94;
      element.style.setProperty("--fold", `${Math.max(0, innerHeight - header - bottom - 28)}px`);
    }
    fit(); void document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  function openAt(index: number) { setActive(index); setOpen(true); }
  return <section id="services" ref={section} className="services-section" aria-labelledby="services-title">
    <div className="container">
      <div className="services-top"><p className="eyebrow section-label"><span className="section-number">02</span><span>OUR CAPABILITIES</span></p><span className="eyebrow services-count">06 DISCIPLINES / ONE TEAM</span></div>
      <div className="services-heading reveal">
        <h2 id="services-title"><span className="kinetic-line"><span>From <em className="serif-word">what if</em></span></span><span className="kinetic-line"><span>to what’s <span className="lavender">next.</span></span></span></h2>
        <div className="services-intro"><p className="body-copy">The right mix of strategy, design and technology. Built around your next big move.</p><a href="#contact" className="services-intro-link">Not sure where to start? <strong>Let’s talk</strong><ArrowUpRight size={16} aria-hidden="true" /></a></div>
      </div>
      <div className="svc-grid" ref={grid}>{services.map((service, index) => <ServiceCard key={service.title} index={index} open={openAt} />)}</div>
      <div className="svc-more reveal">
        <p className="svc-more-text"><span>3D</span> See every capability come to life, one by one.</p>
        <button type="button" className="button svc-explore" onClick={() => openAt(0)}>Explore in 3D<span className="button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></button>
      </div>
    </div>
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="explorer-overlay" />
        <Explorer active={active} setActive={setActive} onStart={title => { selectService(title); toContact.current = true; setOpen(false); }} onCloseAutoFocus={event => {
          if (!toContact.current) return;
          event.preventDefault(); toContact.current = false;
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }} />
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  </section>;
}
