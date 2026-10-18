import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent, type ReactNode, type RefObject } from "react";
import { ArrowUpRight, ArrowDown, Play, Pause, Menu, Phone, Mail, Globe, Asterisk, Plus, Check, MessageCircle, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Atmosphere, useScrollMotion } from "@/components/motion";
import { Services } from "@/components/services";

const navigation = [
  { label: "Home", id: "home" }, { label: "Studio", id: "about" },
  { label: "Services", id: "services" }, { label: "Work", id: "work" }, { label: "Contact", id: "contact" },
];
// Real client work. `site` projects show their screenshots (consecutive page sections) in a browser window.
const projects = [
  { variant: "automation", title: "Streamlined operations", label: "BUSINESS AUTOMATION", summary: "40+ export papers generated from one shipment record.", tags: "Jaikvin Global · React / FastAPI / PostgreSQL · In production" },
  { variant: "mobile", title: "Modern mobile experience", label: "MOBILE APPLICATIONS", summary: "Two everyday apps: My Hisab for money, Thali for meals.", tags: "My Hisab · Thali · React / Next.js · Live", links: [["My Hisab", "https://money-dun-seven.vercel.app/"], ["Thali", "https://thali-eight.vercel.app/"]], apps: [
    { name: "My Hisab", tagline: "Money, at a glance", dir: "myhisab", screens: ["Overview", "Ledger", "Borrowed & lent", "Savings"] },
    { name: "Thali", tagline: "Calories & macros", dir: "thali", screens: ["Today", "Week", "Month"] },
  ] },
  { variant: "platform", title: "Modern web platform", label: "DIGITAL PLATFORM", summary: "An immersive 3D studio site where scrolling becomes a space flight.", tags: "AVITA.TECH · React / Three.js · Live", links: [["Live site", "https://avitagraphics.netlify.app/"]], site: { dir: "space", address: "avitagraphics.netlify.app", sections: ["Launch", "Eight planets", "Mission process", "Telemetry", "Crew", "Liftoff"] } },
  { variant: "web", title: "User focused web application", label: "WEB EXPERIENCE", summary: "A trusted home for a global music publishing company.", tags: "Amishna Music · React / Vite · Live", links: [["Live site", "https://amishnamusic.com/"]], site: { dir: "amishna", address: "amishnamusic.com", sections: ["Home", "About", "Artists", "Services", "Contact"] } },
] as { variant: string; title: string; label: string; summary: string; tags: string; links?: [string, string][]; site?: { dir: string; address: string; sections: string[] }; apps?: { name: string; tagline: string; dir: string; screens: string[] }[] }[];
type Project = (typeof projects)[number];
type SiteInfo = NonNullable<Project["site"]>;
type AppInfo = NonNullable<Project["apps"]>[number];
const appShot = (app: AppInfo, index: number) => `/work/${app.dir}/${String(index + 1).padStart(2, "0")}.webp`;
const siteShot = (site: SiteInfo, index: number) => `/work/${site.dir}/${String(index + 1).padStart(2, "0")}.webp`;

function Brand({ light = false }: { light?: boolean }) {
  const color = light ? "#141417" : "#f1f0eb";
  return <svg className="brand-mark" viewBox="0 0 132 50" role="img" aria-label="AVITA Technologies">
    <g fill="none" stroke={color} strokeWidth="3.1" strokeLinecap="square" strokeLinejoin="miter"><path d="M4 33 17 7 30 33M10 24h14M35 8l11 25L57 8M64 11v22M73 8h22M84 9v24M99 33l13-26 13 26M105 24h14" /></g>
    <path d="m112 7 13 26h-4L112 15z" fill="#b8a4ff" /><path d="M62.5 12v12" stroke="#b8a4ff" strokeWidth="3.1" /><circle cx="64" cy="5" r="2.4" fill="#b8a4ff" />
    <text x="6" y="46" fill={color} fontFamily="Arial, sans-serif" fontSize="5.3" fontWeight="600" letterSpacing="3.2">TECHNOLOGIES</text>
  </svg>;
}
function magneticMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse" || document.documentElement.dataset.motion !== "on") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${(event.clientX - rect.left - rect.width / 2) * .13}px`);
  event.currentTarget.style.setProperty("--my", `${(event.clientY - rect.top - rect.height / 2) * .13}px`);
}
function magneticReset(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--mx", "0px"); event.currentTarget.style.setProperty("--my", "0px");
}
function ProjectButton({ children = "Let’s talk", className = "" }: { children?: ReactNode; className?: string }) {
  return <a className={`button ${className}`} href="#contact" onPointerMove={magneticMove} onPointerLeave={magneticReset}>
    <span>{children}</span><span className="button-icon"><ArrowUpRight size={20} aria-hidden="true" /></span>
  </a>;
}
function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <p className="eyebrow section-label"><span className="section-number">{number}</span><span>{children}</span></p>;
}
function Header() {
  const destination = useRef<string | null>(null);
  const [active, setActive] = useState("home");
  const [light, setLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let frame = 0;
    let anchorFrame = 0;
    let mounted = true;
    function update() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const sections = navigation.map(({ id }) => document.getElementById(id)).filter((section): section is HTMLElement => !!section);
        const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 94;
        const atBottom = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
        const current = atBottom ? sections.at(-1) : [...sections].reverse().find(section => section.getBoundingClientRect().top <= headerHeight + 24) ?? sections[0];
        if (current) { setActive(current.id); setLight(current.dataset.theme === "light"); }
        setScrolled(scrollY > 20);
      });
    }
    function resize() { if (innerWidth > 960) setOpen(false); update(); }
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", resize);
    const initialSection = navigation.find(item => window.location.hash === `#${item.id}`);
    if (initialSection) void document.fonts.ready.then(() => {
      if (!mounted || window.location.hash !== `#${initialSection.id}`) return;
      anchorFrame = requestAnimationFrame(() => document.getElementById(initialSection.id)?.scrollIntoView({ behavior: "instant", block: "start" }));
    });
    return () => { mounted = false; cancelAnimationFrame(frame); cancelAnimationFrame(anchorFrame); window.removeEventListener("scroll", update); window.removeEventListener("resize", resize); };
  }, []);
  function finishNavigation(event: Event) {
    const id = destination.current;
    if (!id) return;
    event.preventDefault(); destination.current = null;
    window.setTimeout(() => {
      const section = document.getElementById(id);
      if (section) { section.tabIndex = -1; section.focus({ preventScroll: true }); section.scrollIntoView({ block: "start" }); }
    }, 0);
  }
  return <header className={`site-header ${light ? "header-light" : ""} ${active === "contact" ? "header-contact" : ""} ${scrolled ? "header-scrolled" : ""}`}>
    <div className="scroll-progress" aria-hidden="true" />
    <div className="container header-inner">
      <a className="brand-link" href="#home" aria-label="AVITA Technologies home"><Brand light={light} /></a>
      <nav className="desktop-navigation" aria-label="Main navigation">{navigation.map((item, index) =>
        <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}><span className="nav-index" aria-hidden="true">0{index + 1}</span>{item.label}</a>
      )}</nav>
      <div className="header-actions"><ProjectButton />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="menu-trigger" aria-label="Open navigation"><span className="menu-trigger-label" aria-hidden="true">Menu</span><Menu size={20} /></SheetTrigger>
          <SheetContent className="mobile-menu" onCloseAutoFocus={finishNavigation}>
            <SheetTitle><Brand /></SheetTitle><SheetDescription className="sr-only">Navigate the AVITA website</SheetDescription>
            <p className="eyebrow menu-label">IDEAS. ENGINEERING. REAL IMPACT.</p>
            <nav aria-label="Mobile navigation">{navigation.map((item, index) => <SheetClose key={item.id} asChild>
              <a style={{ "--n": index } as CSSProperties} href={`#${item.id}`} onClick={() => { destination.current = item.id; }} aria-current={active === item.id ? "location" : undefined}><span><small aria-hidden="true">0{index + 1}</small>{item.label}</span><ArrowUpRight size={24} /></a>
            </SheetClose>)}</nav>
            <div className="menu-footer">
              <SheetClose asChild><a href="#contact" className="button" onClick={() => { destination.current = "contact"; }}>Start a project<span className="button-icon"><ArrowUpRight size={18} /></span></a></SheetClose>
              <p className="menu-contact"><a href="mailto:contact@avitatechnologies.com">contact@avitatechnologies.com</a><a href="tel:+919130153071">+91 91301 53071</a></p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>;
}
function Intro() {
  const [playing, setPlaying] = useState(true);
  return <Dialog><DialogTrigger className="intro-button"><span className="play-circle"><Play size={12} fill="currentColor" /></span>Meet the studio</DialogTrigger>
    <DialogContent className="intro-dialog"><DialogTitle className="sr-only">AVITA studio introduction</DialogTitle><DialogDescription className="sr-only">An animated introduction to our ideas, engineering and approach.</DialogDescription>
      <div className={`intro-slides ${playing ? "" : "paused"}`}>
        {[["Ideas.", "Everything starts with a possibility."], ["Engineering.", "Care in every detail. Purpose in every decision."], ["Real impact.", "Digital products. Built differently."]].map(([title, copy], index) => <div className="intro-slide" key={title} style={{ "--slide-index": index } as CSSProperties}>
          <img src="/artwork/hero-sculpture-v3.webp" alt="" width="1254" height="1254" /><div><p className="eyebrow">AVITA TECHNOLOGIES / 0{index + 1}</p><h2>{title}</h2><p>{copy}</p></div>
        </div>)}
      </div>
      <button className="intro-pause" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause intro" : "Play intro"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
    </DialogContent>
  </Dialog>;
}
function Home({ motion, toggleMotion }: { motion: boolean; toggleMotion: () => void }) {
  const scene = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLElement>) {
    if (!motion || event.pointerType !== "mouse" || !scene.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    scene.current.style.setProperty("--rx", `${(event.clientY - rect.top - rect.height / 2) / rect.height * -9}deg`);
    scene.current.style.setProperty("--ry", `${(event.clientX - rect.left - rect.width / 2) / rect.width * 12}deg`);
  }
  function reset() { scene.current?.style.setProperty("--rx", "0deg"); scene.current?.style.setProperty("--ry", "0deg"); }
  return <section id="home" className="home-section" data-replay aria-labelledby="home-title" onPointerMove={move} onPointerLeave={reset}>
    <Atmosphere enabled={motion} /><div className="hero-grid" aria-hidden="true" /><div className="hero-glow" aria-hidden="true" />
    <div className="container">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="status-dot" />SOFTWARE STUDIO · ANDHERI, MUMBAI</p>
          <h1 id="home-title"><span className="sr-only">AVITA Technologies, software development company in Andheri West, Mumbai. </span><span className="hero-line"><span>Digital products.</span></span><span className="hero-line"><span>Built <em>differently.</em></span></span></h1>
          <div className="hero-description"><span className="hero-copy-line" aria-hidden="true" /><p>We turn ambitious ideas into digital experiences.<br className="desktop-break" /> Considered design. Serious engineering. Nothing ordinary.</p></div>
          <div className="hero-actions"><ProjectButton>Build with us</ProjectButton><Intro /></div>
        </div>
        <div className="hero-visual" ref={scene} aria-label="Interactive chrome sculpture">
          <div className="orbital-scene"><div className="orbit orbit-one" aria-hidden="true"><i /></div><div className="orbit orbit-two" aria-hidden="true"><i /></div>
            <div className="sculpture-parallax" data-parallax><img className="hero-sculpture" src="/artwork/hero-sculpture-v3.webp" alt="Floating liquid-chrome triangular sculpture with violet reflections" width="1254" height="1254" fetchPriority="high" loading="eager" /></div>
            <span className="scene-coordinate scene-coordinate-top" aria-hidden="true">AV / 01<br />IDEAS INTO REALITY</span>
          </div>
        </div>
      </div>
      <div className="hero-bottom"><ol className="hero-disciplines" aria-label="Disciplines">{["DESIGN", "ENGINEERING", "INTELLIGENCE"].map((discipline, index) => <li key={discipline}><span>0{index + 1}</span>{discipline}</li>)}</ol>
        <a href="#about" className="scroll-link"><span className="scroll-arrow"><ArrowDown size={15} /></span><span>SCROLL TO EXPLORE</span></a>
        <div className="hero-bottom-end"><span className="hero-tagline"><Plus size={12} aria-hidden="true" />FORM. FUNCTION. FORWARD.</span><button className="motion-toggle" aria-label={motion ? "Pause motion" : "Enable motion"} aria-pressed={!motion} onClick={toggleMotion}>{motion ? <Pause size={13} /> : <Play size={13} />}<span>{motion ? "MOTION ON" : "MOTION OFF"}</span></button></div>
      </div>
    </div>
    <div className="marquee" aria-label="Ideas, engineering, real impact"><div className="marquee-track" aria-hidden="true">{[0, 1, 2, 3].map(i => <div className="marquee-set" key={i}><span>IDEAS</span><Asterisk /><span className="outline-text">ENGINEERING</span><Asterisk /><span>REAL IMPACT</span><Asterisk /></div>)}</div></div>
  </section>;
}
const principles = [
  { title: "Curiosity before assumptions", tag: "Understand", copy: "We ask questions, understand the people using your product and find the problem worth solving before deciding what to build." },
  { title: "Design and engineering, together", tag: "Connect", copy: "We connect how a product feels with how it works. The interface, the architecture and the smallest interactions get the same attention." },
  { title: "A shared journey", tag: "Collaborate", copy: "We make space for honest conversations, clear decisions and feedback as the work takes shape. Your idea stays at the centre of the process." },
];
function Principles() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => {
      if (document.documentElement.dataset.motion === "on") setActive(index => (index + 1) % principles.length);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [active, paused]);
  const principle = principles[active];
  return <div className="studio-principles reveal" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <Asterisk className="principles-star" size={340} strokeWidth={.6} aria-hidden="true" />
    <div className="studio-principles-heading">
      <p className="eyebrow">WHAT GUIDES US</p><h3>Care in every <span className="serif-word">detail.</span></h3>
      <div className="principle-stage" id="principle-panel" role="tabpanel" aria-labelledby={`principle-tab-${active}`} key={active}>
        <span className="principle-big-number" aria-hidden="true">0{active + 1}</span>
        <div><p className="principle-tag">{principle.tag.toUpperCase()}</p><p className="principle-copy">{principle.copy}</p></div>
      </div>
      <div className="studio-belief"><Asterisk size={22} aria-hidden="true" /><p>Small by choice. Ambitious by nature.</p></div>
    </div>
    <div className="studio-principle-list" role="tablist" aria-label="Our principles">{principles.map((item, index) => <button type="button" role="tab" id={`principle-tab-${index}`} aria-selected={active === index} aria-controls="principle-panel" className={`studio-principle ${active === index ? "is-active" : ""}`} key={item.title} onClick={() => setActive(index)} onPointerEnter={() => setActive(index)}>
      <span className="studio-principle-number">0{index + 1}</span><span className="studio-principle-title">{item.title}</span><ArrowUpRight size={22} aria-hidden="true" />
      <span className="studio-principle-progress" aria-hidden="true"><i className={paused ? "is-paused" : ""} /></span>
    </button>)}</div>
  </div>;
}
function About() {
  return <section id="about" className="about-section light-section" data-theme="light" aria-labelledby="about-title">
    <div className="container">
      <div className="studio-section-top"><SectionLabel number="01">THE STUDIO</SectionLabel><span className="eyebrow studio-side-note">INDEPENDENT BY DESIGN</span></div>
      <div className="studio-hero">
        <div className="about-layout reveal">
          <h2 id="about-title"><span className="studio-title-line">Small team.</span><span className="studio-title-line">Big thinking.</span><span className="studio-title-line studio-title-accent">Serious execution.<svg className="studio-swoosh" viewBox="0 0 600 30" preserveAspectRatio="none" aria-hidden="true"><path d="M4 21C120 7 262 3 382 11s176 13 214 1" pathLength="1" /></svg></span></h2>
          <div className="about-story">
            <p className="large-copy">Good ideas deserve exceptional engineering.</p>
            <p className="body-copy">We’re AVITA Technologies, an independent software development company in Andheri West, Mumbai, building useful digital products, scalable platforms and smarter ways of working.</p>
            <p className="body-copy">From the first sketch to the final line of code, we bring curiosity, craft and a shared belief in building things properly.</p>
            <a className="text-link" href="#services">Explore our capabilities<ArrowUpRight size={20} aria-hidden="true" /></a>
          </div>
        </div>
        <figure className="studio-image-block reveal">
          <div className="studio-banner"><img src="/artwork/about-studio.webp" alt="Architectural visualization of a warmly lit creative workspace, with a shared table and plants" width="1536" height="1024" loading="lazy" decoding="async" data-parallax />
            <figcaption className="studio-image-caption"><small className="eyebrow">ROOM FOR BIG IDEAS</small><strong>A shared ambition.</strong></figcaption>
          </div>
          <div className="studio-badge" aria-hidden="true">
            <svg viewBox="0 0 120 120"><defs><path id="studio-badge-path" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs><text><textPath href="#studio-badge-path">INDEPENDENT BY DESIGN • SMALL BY CHOICE • </textPath></text></svg>
            <span><Asterisk size={26} strokeWidth={1.6} /></span>
          </div>
          <aside className="studio-people" aria-labelledby="people-title">
            <h3 id="people-title" className="eyebrow"><span />THE PEOPLE BEHIND THE IDEAS</h3>
            <ul className="founder-list">{founders.map((founder, index) => <li className={`founder${founder.timeline ? " has-profile" : ""}`} key={founder.initials}>
              <span className="founder-initials" aria-hidden="true"><span>{founder.initials}</span></span><div><p className="founder-role">CO-FOUNDER</p><h4>{founder.name}</h4>{founder.timeline && <span className="founder-more" aria-hidden="true">View profile<ArrowUpRight size={12} /></span>}</div><span className="founder-index" aria-hidden="true">0{index + 1}</span>
              {founder.timeline && <FounderProfile founder={founder} />}
            </li>)}</ul>
          </aside>
        </figure>
      </div>
      <Principles />
    </div>
  </section>;
}
// Autopilot tour of the real Jaikvin Global app. Each screen zooms into its focus spots ([x%, y%, zoom] + caption),
// pulls back, then the cursor clicks the control (target, x% / y%) that leads to the next screen.
type JgFocus = [number, number, number, string];
const jgTour: { file: string; name: string; target: [number, number]; focus: JgFocus[] }[] = [
  { file: "01", name: "Sign in", target: [75.7, 57.5], focus: [[75.7, 50, 2.1, "JWT sign-in, bcrypt passwords and lockout after failed attempts"]] },
  { file: "02", name: "Dashboard", target: [20.8, 3.7], focus: [[6, 34, 1.9, "Boxes and volume still pending, per supplier and PO"], [70, 74, 1.9, "Dispatch status of every invoice at a glance"]] },
  { file: "04", name: "Purchase orders", target: [13.5, 18.2], focus: [[8, 50, 1.9, "Every purchase order with its delivery progress"], [60, 48, 1.9, "Which suppliers are still pending, per PO"]] },
  { file: "03", name: "Buyers summary", target: [34.2, 3.7], focus: [[6, 48, 1.9, "Item-wise quantities across all POs, entered only once"], [80, 20, 2.3, "Export to Excel or PDF in one click"]] },
  { file: "05", name: "Pre-shipment", target: [56.5, 3.7], focus: [[48, 42, 1.6, "Three-step shipment: vehicle, container, BL"], [84, 82, 1.9, "Save once, and every paper for this invoice is ready"]] },
  { file: "06", name: "Setup", target: [94, 3.7], focus: [[20, 30, 1.9, "Ports, packaging and payment terms, configured without code"], [24, 76, 1.9, "Choose the item order every document prints in"]] },
];
// Export papers generated from one shipment record; the first ten burst out of the window on the Save step.
const jgDocs = [["PDF", "Commercial invoice"], ["XLSX", "Packing list"], ["DOCX", "VGM declaration"], ["PDF", "Shipping bill"], ["XLSX", "Export value declaration"], ["PDF", "Proforma invoice"], ["DOCX", "Bank letter"], ["PDF", "SDF form"], ["DOCX", "Shipping agent letter"], ["XLSX", "Costing sheet"], ["PDF", "Certificate of origin"], ["DOCX", "SCOMET declaration"]];
const jgBurst = [[-33, -31, -11], [31, -33, 9], [-38, -6, -5], [37, -8, 7], [-34, 21, -9], [35, 19, 6], [-12, -40, -3], [11, -42, 4], [-16, 37, 5], [17, 36, -6]];
const jgShot = (index: number) => `/work/jg/${jgTour[index % jgTour.length].file}.webp`;
const jgTimings = { enter: 500, focus: 2300, out: 650, move: 900, click: 300, swap: 850 };
type JgPhase = keyof typeof jgTimings;
const jgStepTime = (index: number) => jgTimings.enter + jgTour[index].focus.length * jgTimings.focus + jgTimings.out + jgTimings.move + jgTimings.click + jgTimings.swap;
function AutomationPreview() {
  const stage = useRef<HTMLDivElement>(null), windowRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<JgPhase>("enter");
  const [spot, setSpot] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    // Plays only while on screen and while site motion is on.
    const element = stage.current, root = document.documentElement;
    if (!element) return;
    let visible = false;
    const update = () => setRunning(visible && root.dataset.motion === "on");
    // Warm every screen before the tour reaches it, so no step flashes an empty window.
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { jgTour.forEach((_, i) => { new Image().src = jgShot(i); }); preload.disconnect(); } }, { rootMargin: "600px" });
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: .25 });
    preload.observe(element);
    const motion = new MutationObserver(update);
    intersection.observe(element); motion.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    return () => { preload.disconnect(); intersection.disconnect(); motion.disconnect(); };
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (phase === "enter") { setSpot(0); setPhase("focus"); }
      else if (phase === "focus") { if (spot + 1 < jgTour[step].focus.length) setSpot(spot + 1); else setPhase("out"); }
      else if (phase === "out") setPhase("move");
      else if (phase === "move") setPhase("click");
      else if (phase === "click") setPhase("swap");
      else { setStep(value => (value + 1) % jgTour.length); setSpot(0); setPhase("enter"); }
    }, jgTimings[phase]);
    return () => window.clearTimeout(timer);
  }, [running, phase, step, spot]);
  const count = jgTour.length, next = (step + 1) % count, current = jgTour[step];
  const focus = current.focus[Math.min(spot, current.focus.length - 1)];
  const zoomed = phase === "focus";
  const [x, y] = phase === "focus" ? [focus[0] + 3, focus[1] + 5] : phase === "enter" ? jgTour[(step + count - 1) % count].target : current.target;
  const burst = step === 4 && ((phase === "focus" && spot === 1) || phase === "out");
  function tilt(event: PointerEvent<HTMLDivElement>) {
    const element = windowRef.current;
    if (!element || event.pointerType !== "mouse" || document.documentElement.dataset.motion !== "on") return;
    const box = event.currentTarget.getBoundingClientRect(), dx = (event.clientX - box.left) / box.width - .5, dy = (event.clientY - box.top) / box.height - .5;
    element.style.rotate = `${-dy} ${dx} 0 ${(Math.hypot(dx, dy) * 16).toFixed(2)}deg`;
    element.style.setProperty("--gx", `${((dx + .5) * 100).toFixed(1)}%`); element.style.setProperty("--gy", `${((dy + .5) * 100).toFixed(1)}%`);
  }
  const camera = { transformOrigin: `${focus[0]}% ${focus[1]}%`, transform: `scale(${zoomed ? focus[2] : 1})` };
  return <div className={`product-preview preview-automation${running ? " is-running" : ""}`} aria-hidden="true" ref={stage} onPointerMove={tilt} onPointerLeave={() => windowRef.current?.style.removeProperty("rotate")}>
    <span className="preview-background-type">LESS FRICTION.</span>
    <div className="jg-window jg-ghost"><div className="preview-toolbar"><span className="window-dots"><i /><i /><i /></span></div><img src={jgShot(next)} alt="" width="2400" height="1334" loading="lazy" decoding="async" /></div>
    <div className="jg-window jg-main" ref={windowRef}>
      <div className="preview-toolbar"><span className="window-dots"><i /><i /><i /></span><span>Jaikvin Global / <b key={step}>{current.name}</b></span><span className="jg-live"><i />AUTOPILOT</span></div>
      <div className="jg-screen">
        <div className={`jg-camera${zoomed ? " zoomed" : ""}`} style={camera}>
          <img src={jgShot(step)} alt="" width="2400" height="1334" loading="lazy" decoding="async" />
          {phase === "swap" && <div className="jg-slices">{Array.from({ length: 7 }, (_, i) => <span key={i} style={{ "--i": i, backgroundImage: `url(${jgShot(next)})` } as CSSProperties} />)}</div>}
          <span className={`jg-target${phase === "move" || phase === "click" ? " on" : ""}`} style={{ left: `${current.target[0]}%`, top: `${current.target[1]}%` }} />
          {phase === "click" && <span className="jg-ripple" style={{ left: `${x}%`, top: `${y}%` }} />}
          <span className={`jg-cursor${phase === "click" ? " pressed" : ""}`} style={{ left: `${x}%`, top: `${y}%`, "--z": zoomed ? focus[2] : 1 } as CSSProperties}><svg viewBox="0 0 24 24"><path d="M5 3l14 8.2-6.1 1.3 3.6 6.8-2.9 1.5-3.6-6.9L5 18.3z" /></svg></span>
        </div>
        {zoomed && <span className="jg-caption" key={`${step}-${spot}`}><i>{String(step + 1).padStart(2, "0")}</i>{focus[3]}</span>}
      </div>
      <div className="jg-progress">{jgTour.map((item, i) => <span key={item.file} className={i < step ? "done" : i === step ? "active" : ""}><i key={i === step ? `run-${step}` : "idle"} style={{ "--d": `${jgStepTime(i)}ms` } as CSSProperties} /></span>)}</div>
    </div>
    {burst && <div className={`jg-burst${phase === "out" ? " leaving" : ""}`}>
      {jgBurst.map(([dx, dy, turn], i) => <span key={i} className={`jg-doc doc-${jgDocs[i][0].toLowerCase()}`} style={{ "--i": i, "--dx": dx, "--dy": dy, "--turn": `${turn}deg` } as CSSProperties}><b>{jgDocs[i][0]}</b>{jgDocs[i][1]}</span>)}
      <span className="jg-burst-count"><strong className="count-up" style={{ "--to": 40 } as CSSProperties}>+</strong><span>papers from<br />one record</span></span>
    </div>}
  </div>;
}
function SiteWindow({ site, page = 0, className = "" }: { site: SiteInfo; page?: number; className?: string }) {
  return <div className={`site-window ${className}`}><div className="preview-toolbar"><span className="window-dots"><i /><i /><i /></span><span className="site-address"><Globe size={10} />{site.address}</span><span>•••</span></div>
    <div className="site-viewport"><img src={siteShot(site, page)} alt="" width="1600" height="900" loading="lazy" decoding="async" /></div></div>;
}
function AppPhone({ app, screen = 0, className = "" }: { app: AppInfo; screen?: number; className?: string }) {
  return <div className={`app-phone app-${app.dir} ${className}`}><div className="app-screen"><img src={appShot(app, screen)} alt="" width="720" height="1600" loading="lazy" decoding="async" /></div><span className="app-tag"><i />{app.name}<small>{app.tagline}</small></span></div>;
}
// Founders with a `timeline` open a profile dialog. Drop a photo at the `photo` path; until then the initials show.
type Founder = { initials: string; name: string; photo?: string; headline?: string; timeline?: [string, string, string][] };
const founders: Founder[] = [
  { initials: "SMK", name: "Swatantra Mahavir Kashiwal" },
  { initials: "RDJ", name: "Rahul Devsingh Jadhav", photo: "/team/rahul.webp", headline: "Co-founder and software developer. Rahul turns ideas into working products, from the first screen to the last line of backend code.", timeline: [
    ["NOW", "Software Developer", "Samraj Music Right Management"],
    ["CO-FOUNDER", "AVITA Technologies", "Designing and engineering products for our clients"],
    ["EDUCATION", "Bachelor of Engineering, Information Technology", "Vasantdada Patil Pratishthan's College of Engineering and Visual Arts"],
    ["TRAINING", "Full Stack Web Development course", "LivetechINDIA"],
  ] },
];
function FounderPhoto({ founder }: { founder: Founder }) {
  const [failed, setFailed] = useState(!founder.photo);
  return <div className="profile-photo">{failed ? <span className="profile-initials" aria-hidden="true">{founder.initials}</span> : <img src={founder.photo} alt={`Portrait of ${founder.name}`} width="800" height="1000" loading="lazy" decoding="async" onError={() => setFailed(true)} />}</div>;
}
function FounderProfile({ founder }: { founder: Founder }) {
  return <Dialog><DialogTrigger className="founder-open" aria-label={`View profile of ${founder.name}`} />
    <DialogContent className="founder-dialog">
      <FounderPhoto founder={founder} />
      <div className="profile-body">
        <p className="eyebrow">CO-FOUNDER / AVITA TECHNOLOGIES</p>
        <DialogTitle>{founder.name}</DialogTitle>
        <DialogDescription>{founder.headline}</DialogDescription>
        <ol className="profile-timeline">{founder.timeline!.map(([tag, title, place]) => <li key={title}><small>{tag}</small><strong>{title}</strong><span>{place}</span></li>)}</ol>
        <DialogClose asChild><a className="button" href="#contact">Work with {founder.name.split(" ")[0]}<ArrowUpRight size={18} /></a></DialogClose>
      </div>
    </DialogContent></Dialog>;
}
function ProductPreview({ project }: { project: Project }) {
  if (project.apps) return <div className="product-preview preview-apps" aria-hidden="true"><span className="preview-background-type">DAILY HABITS.</span>{project.apps.map((app, i) => <AppPhone key={app.dir} app={app} className={`app-phone-${i}`} />)}</div>;
  if (project.variant === "automation") return <div className="product-preview preview-automation preview-still" aria-hidden="true"><span className="preview-background-type">LESS FRICTION.</span><div className="jg-window jg-main"><div className="preview-toolbar"><span className="window-dots"><i /><i /><i /></span><span>Jaikvin Global / <b>Export system</b></span><span>•••</span></div><img src={jgShot(0)} alt="" width="2400" height="1334" loading="lazy" decoding="async" /></div></div>;
  if (!project.site) return null;
  return <div className={`product-preview preview-site preview-${project.variant}`} aria-hidden="true"><span className="preview-background-type">{project.variant === "web" ? "EVERY STREAM." : "LEAVES ORBIT."}</span><SiteWindow site={project.site} page={project.variant === "web" ? 2 : 1} className="site-ghost" /><SiteWindow site={project.site} /></div>;
}
type CaseInfo = { eyebrow: string; title: string; client: string; summary: string; brief: [string, string]; stats: string[][]; built: string[]; stack: [string, string[]]; result: [string, string] };
const cases: Record<string, CaseInfo> = {
  automation: {
    eyebrow: "BUSINESS AUTOMATION / CASE STUDY", title: "Export Operations Platform", client: "for Jaikvin Global",
    summary: "A full-stack web app that runs a pipe-fittings export business, from the buyer's purchase order to the final shipping papers.",
    brief: ["The problem", "Every shipment needed 40+ papers typed by hand in Excel, with the same figures keyed in again and again."],
    stats: [["40+", "papers per shipment"], ["1", "record they come from"], ["v7.3", "live in production"]],
    built: ["40+ export and customs papers in one click, as PDF, Excel or Word", "Our own XLSX and DOCX writers, with live Excel formulas", "Orders, packing, shipments, invoicing and costing, all linked", "Columns, ports, banks and tax rules set from a Setup screen", "JWT sign-in, role permissions, lockout and an audit log", "Versioned releases with in-app \u201cWhat's new\u201d notes"],
    stack: ["Tech stack", ["React 18", "Vite", "React Query", "FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "nginx"]],
    result: ["Impact", "A shipment's papers now take minutes instead of hours, and every one shows the same figures."],
  },
  platform: {
    eyebrow: "DIGITAL PLATFORM / CASE STUDY", title: "AVITA.TECH: Beyond Orbit", client: "for AVITA Technology",
    summary: "An immersive studio website where scrolling becomes a space flight: from a 3D Earth over Mumbai, past eight planets, to the launch pad.",
    brief: ["The brief", "Make an IT agency's services memorable, so they read like a journey instead of another grid of cards."],
    stats: [["8", "planets, one per service"], ["5", "mission stages"], ["3D", "rendered live in the browser"]],
    built: ["A real-time 3D Earth hero that opens over Mumbai, India", "Scroll to travel: eight planets, each presenting one service", "A launch countdown for the process: Discover, Design, Build, Launch, Operate", "Mission-control telemetry for projects, clients and systems", "A crew deck with 3D astronauts introducing the team", "A flight HUD for altitude, velocity and status, with smooth scrolling"],
    stack: ["Tech stack", ["React", "Three.js", "WebGL", "Lenis", "Vite", "Netlify"]],
    result: ["The result", "A list of services becomes a flight people want to finish, and the studio stands apart from every card grid."],
  },
  mobile: {
    eyebrow: "MOBILE APPLICATIONS / CASE STUDY", title: "My Hisab & Thali", client: "Two everyday apps, built mobile-first",
    summary: "Two installable apps people keep on their home screen: My Hisab tracks money in and out, Thali tracks Indian food calories and macros.",
    brief: ["The brief", "Make daily tracking quick enough to do in seconds, with the numbers that matter on the very first screen."],
    stats: [["2", "apps, one design language"], ["v2.5", "My Hisab, live"], ["v4.2", "Thali, live"]],
    built: ["My Hisab: balance in hand across UPI, bank and cash, at a glance", "My Hisab: a searchable ledger, borrowed & lent, and savings goals", "My Hisab: an installable PWA that feels like a native app", "Thali: daily calories and macros against a personal target", "Thali: week and month charts, streaks and a weight trend", "Thali: targets from BMR and TDEE, meal reminders, Google sign-in"],
    stack: ["Tech stack", ["React", "Vite", "PWA", "Next.js", "Recharts", "Vercel"]],
    result: ["The result", "Logging takes seconds, and each app answers its big question first: how much do I have, and how much have I eaten?"],
  },
  web: {
    eyebrow: "WEB EXPERIENCE / CASE STUDY", title: "Amishna Music", client: "Music publishing & royalty management",
    summary: "A website for a music publishing and royalty administration company that supports composers, authors, singers and publishers worldwide.",
    brief: ["The brief", "Explain a complex service, publishing administration and royalty collection, in plain words, and earn a creator's trust at first glance."],
    stats: [["5", "pages, Home to Contact"], ["8", "royalty societies featured"], ["1", "clear next step for creators"]],
    built: ["An editorial look in maroon and gold that feels premium and trusted", "A hero that states the offer and leads to \u201cRegister your music\u201d", "A trust strip with IPRS, ASCAP, BMI, PRS, MLC, SoundExchange and more", "An artist roster page with warm, cinematic photography", "Services mapped out: publishing, PRO, fingerprinting, cue sheets, royalties", "Fully responsive, with a contact page that promises a reply in 24 hours"],
    stack: ["Tech stack", ["React", "React Router", "Vite", "Responsive design"]],
    result: ["The result", "Creators understand the offer in seconds and have one obvious next step: register their music."],
  },
};
function CasePanel({ info, links = [] }: { info: CaseInfo; links?: [string, string][] }) {
  return <div className="case-panel">
    <p className="eyebrow">{info.eyebrow}</p>
    <DialogTitle>{info.title}<small>{info.client}</small></DialogTitle>
    <DialogDescription className="case-summary">{info.summary}</DialogDescription>
    <p className="case-problem"><span>{info.brief[0]}</span>{info.brief[1]}</p>
    <dl className="case-stats">{info.stats.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <h3 className="case-heading">What we built</h3>
    <ul className="case-built">{info.built.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
    <h3 className="case-heading">{info.stack[0]}</h3>
    <ul className="case-stack">{info.stack[1].map(item => <li key={item}>{item}</li>)}</ul>
    <p className="case-impact"><span>{info.result[0]}</span>{info.result[1]}</p>
    <div className="case-actions">
      {links.map(([label, url]) => <a key={url} className="button case-live" href={url} target="_blank" rel="noreferrer">{links.length > 1 ? `Open ${label}` : "Visit live site"}<ArrowUpRight size={18} /></a>)}
      <DialogClose asChild><a className={links.length ? "case-secondary" : "button"} href="#contact">Build something like this<ArrowUpRight size={links.length ? 16 : 18} /></a></DialogClose>
    </div>
  </div>;
}
// Tours play only while on screen and while site motion is on.
function useTourRunning(stage: RefObject<HTMLDivElement | null>) {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const element = stage.current, root = document.documentElement;
    if (!element) return;
    let visible = false;
    const update = () => setRunning(visible && root.dataset.motion === "on");
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: .25 });
    const motion = new MutationObserver(update);
    intersection.observe(element); motion.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    return () => { intersection.disconnect(); motion.disconnect(); };
  }, [stage]);
  return running;
}
function PhoneTour({ apps }: { apps: AppInfo[] }) {
  // Both phones flip through their screens, half a beat apart; tall pages pan down while they hold.
  const stage = useRef<HTMLDivElement>(null), running = useTourRunning(stage);
  const [beat, setBeat] = useState(0);
  useEffect(() => { apps.forEach(app => app.screens.forEach((_, i) => { new Image().src = appShot(app, i); })); }, [apps]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setBeat(value => value + 1), 1600);
    return () => window.clearTimeout(timer);
  }, [running, beat]);
  return <div className={`product-preview tour-stage tour-apps${running ? " is-running" : ""}`} aria-hidden="true" ref={stage}>
    {apps.map((app, i) => {
      const screen = Math.floor((beat + i) / 2) % app.screens.length;
      return <div key={app.dir} className={`app-phone app-${app.dir} app-phone-${i} tour-phone`}>
        <div className="app-screen">{app.screens.map((name, j) => <img key={name} className={j === screen ? "on" : ""} src={appShot(app, j)} alt="" width="720" height="1600" loading="lazy" decoding="async" />)}</div>
        <span className="app-tag"><i />{app.name}<small key={screen}>{app.screens[screen]}</small></span>
      </div>;
    })}
  </div>;
}
function SiteTour({ project }: { project: Project }) {
  // The live site plays itself: hold on each section, glide to the next, rewind at the end.
  const site = project.site!, stage = useRef<HTMLDivElement>(null), running = useTourRunning(stage);
  const [section, setSection] = useState(0);
  useEffect(() => { site.sections.forEach((_, i) => { new Image().src = siteShot(site, i); }); }, [site]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setSection(value => (value + 1) % site.sections.length), section === site.sections.length - 1 ? 3200 : 2600);
    return () => window.clearTimeout(timer);
  }, [running, section, site]);
  return <div className={`product-preview tour-stage tour-${project.variant}${running ? " is-running" : ""}`} aria-hidden="true" ref={stage}>
    <div className="site-window tour-window">
      <div className="preview-toolbar"><span className="window-dots"><i /><i /><i /></span><span className="site-address"><Globe size={11} />{site.address}<em>/{site.sections[section].toLowerCase().replace(/ /g, "-")}</em></span><span className="jg-live"><i />LIVE</span></div>
      <div className="site-viewport"><div className={`site-track${section === 0 ? " rewind" : ""}`} style={{ transform: `translate3d(0, ${-section * 100}%, 0)` }}>{site.sections.map((name, i) => <img key={name} src={siteShot(site, i)} alt="" width="1600" height="900" loading="lazy" decoding="async" />)}</div>
        <span className="tour-chip" key={section}><i>{String(section + 1).padStart(2, "0")}</i>{site.sections[section]}</span>
        <span className="tour-wheel"><i /></span>
      </div>
      <div className="jg-progress">{site.sections.map((name, i) => <span key={name} className={i < section ? "done" : i === section ? "active" : ""}><i key={i === section ? `run-${section}` : "idle"} style={{ "--d": `${section === site.sections.length - 1 ? 3200 : 2600}ms` } as CSSProperties} /></span>)}</div>
    </div>
  </div>;
}
function Projects() {
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Below 960px previews render at their designed width and scale down, so nothing is cropped.
    const element = grid.current, card = element?.querySelector<HTMLElement>(".project-image");
    if (!element || !card) return;
    const resize = new ResizeObserver(() => element.style.setProperty("--pz", (card.offsetWidth / 640).toFixed(4)));
    resize.observe(card);
    return () => resize.disconnect();
  }, []);
  return <section id="work" className="work-section" aria-labelledby="work-title"><div className="container"><SectionLabel number="03">PRODUCT EXPLORATIONS</SectionLabel>
    <div className="work-heading reveal"><h2 id="work-title">Made to work.<br /><span className="lavender">Made to matter.</span></h2><div><p className="body-copy">A few ways we bring ideas to life.</p><span className="eyebrow work-note">REAL CLIENT WORK / DESIGN + ENGINEERING</span></div></div>
    <div className="project-grid" ref={grid}>{projects.map((project, index) => {
      const info = cases[project.variant];
      return <Dialog key={project.variant}><article className={`project-card reveal project-${project.variant}`}>
        <DialogTrigger className="project-image" aria-label={`View ${project.title}`}><div className="project-visual-inner"><ProductPreview project={project} /></div><span className="project-open"><ArrowUpRight size={25} aria-hidden="true" /><span>EXPLORE</span></span></DialogTrigger>
        <div className="project-info"><p className="project-label"><span>0{index + 1}</span>{project.label}</p><DialogTrigger className="project-title">{project.title}<ArrowUpRight size={23} aria-hidden="true" /></DialogTrigger><p className="project-summary">{project.summary}</p><p className="project-tags">{project.tags}</p>
          <div className="project-actions"><DialogTrigger className="project-action">{info ? "Case study" : "Explore"}<ArrowUpRight size={14} aria-hidden="true" /></DialogTrigger>{project.links?.map(([label, url]) => <a key={url} className="project-action project-action-live" href={url} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></div>
      </article>{info ? <DialogContent className={`project-dialog project-dialog-case case-${project.variant}`}><div className="case-stage">{project.apps ? <PhoneTour apps={project.apps} /> : project.site ? <SiteTour project={project} /> : <AutomationPreview />}</div><CasePanel info={info} links={project.links} /></DialogContent>
        : <DialogContent className="project-dialog"><ProductPreview project={project} /><p className="eyebrow">{project.label} / CONCEPT EXPLORATION</p><DialogTitle>{project.title}</DialogTitle><DialogDescription>{project.summary}</DialogDescription><DialogClose asChild><a className="button" href="#contact">Build something like this<ArrowUpRight size={18} /></a></DialogClose></DialogContent>}</Dialog>;
    })}</div>
  </div></section>;
}
function Process() {
  return <section className="process-section" aria-labelledby="process-title"><div className="container"><div className="process-heading"><p className="eyebrow">NO MYSTERY. JUST GOOD WORK.</p><h2 id="process-title">The way forward.</h2></div><div className="process-grid">{[["Think", "Get curious. Ask better questions. Understand what really matters."], ["Build", "Connect thoughtful design with engineering that goes the distance."], ["Refine", "Test the details. Learn from people. Make a good thing better."]].map(([title, text], index) => <article className="reveal" key={title}><span className="process-number">0{index + 1}</span><h3>{title}<ArrowUpRight size={25} /></h3><p>{text}</p></article>)}</div></div></section>;
}
function Contact({ selectedService }: { selectedService: string }) {
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => { if (selectedService) setBrief(value => value ? `${value}\n\nInterested in: ${selectedService}` : `Interested in: ${selectedService}\n`); }, [selectedService]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    // Sends the enquiry as a ready-to-send WhatsApp message to the studio number.
    const text = `Hi AVITA Technologies,\n\n*Subject:* ${data.get("subject")}\n*Name:* ${data.get("name")}\n*Email:* ${data.get("email")}\n\n*Project brief:*\n${data.get("brief")}`;
    const url = `https://wa.me/919130153071?text=${encodeURIComponent(text)}`;
    if (!window.open(url, "_blank", "noopener")) window.location.href = url;
    setStatus("WhatsApp is opening with your message. Just press send.");
  }
  return <section id="contact" className="contact-section light-section" data-theme="light" aria-labelledby="contact-title"><div className="container contact-grid">
    <div className="contact-intro reveal"><SectionLabel number="04">YOUR NEXT CHAPTER</SectionLabel>
      <h2 id="contact-title">Got a <span className="serif-word">what if?</span><br />Let’s make it real.</h2>
      <p className="contact-lead">Good things start with a conversation. A project, a possibility, or a quick hello — we’d love to hear what’s on your mind.</p>
      <address className="contact-cards">
        <a className="contact-card" href="mailto:contact@avitatechnologies.com"><span className="contact-icon"><Mail size={18} /></span><span><small>DROP US A LINE</small><strong>contact@avitatechnologies.com</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
        <a className="contact-card" href="https://www.google.com/maps/search/?api=1&query=Plot+No+49+Manish+Nagar+Andheri+West+Mumbai+400053" target="_blank" rel="noreferrer"><span className="contact-icon"><MapPin size={18} /></span><span><small>VISIT US</small><strong>Plot No. 49, Manish Nagar, Andheri West, Mumbai 400053</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
        <div className="contact-card"><span className="contact-icon"><Phone size={18} /></span><span><small>LET’S TALK</small><strong><a href="tel:+919130153071">+91 91301 53071</a></strong></span></div>
      </address>
    </div>
    <form className="contact-form contact-panel reveal" onSubmit={submit}><div className="contact-panel-head"><h3>Tell us about your idea.</h3><Asterisk className="contact-star" size={48} strokeWidth={1.4} aria-hidden="true" /></div><div className="form-top-row"><label htmlFor="contact-name">Your Name<input id="contact-name" name="name" placeholder="Full name" autoComplete="name" required maxLength={120} /></label><label htmlFor="contact-email">Your Email<input id="contact-email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required maxLength={254} /></label></div><label htmlFor="contact-subject">Subject<input id="contact-subject" name="subject" placeholder="e.g. A new website for my business" required maxLength={160} /></label><div className="form-field"><label htmlFor="contact-brief">Project Brief</label><textarea id="contact-brief" name="brief" placeholder="What would you like to build?" value={brief} onChange={event => setBrief(event.target.value)} required rows={3} maxLength={6000} /></div><div className="form-bottom"><p className="form-note">Your idea. Our next conversation.<br />Opens WhatsApp with your message ready to send.</p><button type="submit" className="button">Send on WhatsApp<span className="button-icon"><MessageCircle size={21} /></span></button></div>{status && <p className="form-status" role="status">{status}</p>}</form>
  </div></section>;
}
const footerServices = ["Web & Mobile", "Software Engineering", "Cloud & Infrastructure", "Digital Products", "Automation", "AI & Data"];
const footerWork = [["My Hisab", "https://money-dun-seven.vercel.app/"], ["Thali", "https://thali-eight.vercel.app/"], ["AVITA.TECH", "https://avitagraphics.netlify.app/"], ["Amishna Music", "https://amishnamusic.com/"]];
function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-cta">
      <div><p className="footer-status"><i />AVAILABLE FOR NEW PROJECTS</p><h2 className="footer-headline">Have an idea?<br />Let’s build it <span className="serif-word">together.</span></h2></div>
      <div className="footer-cta-actions">
        <a className="button" href="#contact">Start a project<span className="button-icon"><ArrowUpRight size={20} aria-hidden="true" /></span></a>
        <a className="footer-whatsapp" href="https://wa.me/919130153071" target="_blank" rel="noreferrer"><MessageCircle size={18} aria-hidden="true" />Chat on WhatsApp</a>
      </div>
    </div>
    <div className="footer-grid">
      <div className="footer-brand"><a href="#home" className="brand-link" aria-label="AVITA Technologies home"><Brand /></a><p>Independent minds.<br />Extraordinary possibilities.</p><p className="footer-origin"><MapPin size={13} aria-hidden="true" />Andheri West, Mumbai, India</p></div>
      <nav aria-label="Footer"><p className="footer-title">EXPLORE</p><ul>{navigation.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ul></nav>
      <div><p className="footer-title">CAPABILITIES</p><ul>{footerServices.map(item => <li key={item}><a href="#services">{item}</a></li>)}</ul></div>
      <div><p className="footer-title">SELECTED WORK</p><ul><li><a href="#work">Jaikvin Global</a></li>{footerWork.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={13} aria-hidden="true" /></a></li>)}</ul></div>
      <div className="footer-contact"><p className="footer-title">CONTACT</p><ul><li><a href="mailto:contact@avitatechnologies.com">contact@avitatechnologies.com</a></li><li><a href="tel:+919130153071">+91 91301 53071</a></li><li><a href="https://wa.me/919130153071" target="_blank" rel="noreferrer">WhatsApp<ArrowUpRight size={13} aria-hidden="true" /></a></li><li><a href="https://www.google.com/maps/search/?api=1&query=Plot+No+49+Manish+Nagar+Andheri+West+Mumbai+400053" target="_blank" rel="noreferrer" className="footer-address">Plot No. 49, Manish Nagar,<br />Andheri West, Mumbai 400053</a></li></ul></div>
    </div>
    <div className="footer-bottom"><p>© 2026 AVITA TECHNOLOGIES · RDJ &amp; SMK</p><p>IDEAS. ENGINEERING. REAL IMPACT.</p><a className="back-top" href="#home">Back to top<span><ArrowUpRight size={18} aria-hidden="true" /></span></a></div>
  </div></footer>;
}
export default function Website() {
  const [selectedService, setSelectedService] = useState("");
  const [motion, setMotion] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    function change(event: MediaQueryListEvent) { setMotion(!event.matches); }
    query.addEventListener("change", change); return () => query.removeEventListener("change", change);
  }, []);
  useScrollMotion(motion);
  return <><a href="#main" className="skip-link">Skip to content</a><Header /><main id="main"><Home motion={motion} toggleMotion={() => setMotion(value => !value)} /><About /><Services selectService={setSelectedService} /><Projects /><Process /><Contact selectedService={selectedService} /></main><Footer /></>;
}
