import { useEffect, useRef } from "react";

export function Atmosphere({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let frame = 0;
    let visible = true;
    let width = 1;
    let height = 1;
    let lastTime = 0;
    let elapsed = 0;
    const dots = Array.from({ length: 42 }, (_, i) => ({
      x: ((i * 73 + 19) % 101) / 101,
      y: ((i * 47 + 7) % 97) / 97,
      phase: i * 1.73,
      radius: i % 5 === 0 ? 1.7 : .8,
    }));
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      dots.forEach(dot => {
        const x = dot.x * width + Math.sin(elapsed * .13 + dot.phase) * 16;
        const y = dot.y * height + Math.cos(elapsed * .1 + dot.phase) * 22;
        ctx.beginPath();
        ctx.arc(x, y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 175, 255, ${.18 + (Math.sin(elapsed * .5 + dot.phase) + 1) * .12})`;
        ctx.fill();
        if (dot.radius > 1) {
          ctx.strokeStyle = "rgba(190, 175, 255, .16)";
          ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y);
          ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke();
        }
      });
    }
    function tick(time: number) {
      if (!visible || document.hidden || !enabled) { frame = 0; lastTime = 0; return; }
      elapsed += lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
      lastTime = time;
      draw();
      frame = requestAnimationFrame(tick);
    }
    function resume() {
      if (enabled && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    }
    const resize = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      width = rect.width; height = rect.height;
      const scale = Math.min(devicePixelRatio, 1.5);
      canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0); draw(); resume();
    });
    resize.observe(canvas);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; resume(); });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", resume);
    draw(); resume();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", resume); };
  }, [enabled]);
  return <canvas ref={canvasRef} className="hero-atmosphere" aria-hidden="true" />;
}

export function useScrollMotion(enabled: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = enabled ? "on" : "off";
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    // Reveals replay: they reset once an element leaves the screen and animate again when it returns.
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle("is-visible", entry.isIntersecting)), { threshold: .08 });
    reveals.forEach(element => observer.observe(element));
    // Entrance animations inside [data-replay] restart whenever that block scrolls back into view.
    const replay = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle("is-away", !entry.isIntersecting)));
    document.querySelectorAll<HTMLElement>("[data-replay]").forEach(element => replay.observe(element));
    let frame = 0;
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    function update() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const distance = document.documentElement.scrollHeight - innerHeight;
        root.style.setProperty("--scroll-progress", `${distance > 0 ? scrollY / distance : 0}`);
        parallax.forEach(element => {
          const rect = element.getBoundingClientRect();
          const shift = enabled && innerWidth > 960 ? Math.max(-35, Math.min(35, (innerHeight / 2 - rect.top - rect.height / 2) * .06)) : 0;
          element.style.setProperty("--parallax", `${shift}px`);
        });
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => { observer.disconnect(); replay.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [enabled]);
}
