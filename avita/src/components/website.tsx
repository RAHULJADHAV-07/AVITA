import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ArrowDown, Play, Pause, Menu, Phone, Mail, Globe, Asterisk, Code2, Layers, Sparkles, Command, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Atmosphere, useScrollMotion } from "@/components/motion";
import { Services } from "@/components/services";

const navigation = [
  { label: "Home", id: "home" }, { label: "Studio", id: "about" },
  { label: "Services", id: "services" }, { label: "Work", id: "work" }, { label: "Contact", id: "contact" },
];
const projects = [
  { variant: "platform", title: "Modern web platform", label: "DIGITAL PLATFORM", description: "A considered platform experience, with a clear interface and room to grow.", tags: "Product design / Web / Cloud" },
  { variant: "mobile", title: "Modern mobile experience", label: "MOBILE APPLICATION", description: "A focused mobile experience that puts useful features within reach.", tags: "Mobile / Product design" },
  { variant: "automation", title: "Streamlined operations", label: "BUSINESS AUTOMATION", description: "Connected workflows that make everyday operations simpler.", tags: "Automation / Integrations" },
  { variant: "web", title: "User focused web application", label: "WEB EXPERIENCE", description: "A connected web experience designed around the people who use it.", tags: "Web / Engineering" },
];

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
              <p className="menu-contact"><a href="mailto:contact@avitatechnologies.com">contact@avitatechnologies.com</a><a href="tel:+919975352964">+91 99753 52964</a></p>
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
          <p className="eyebrow hero-eyebrow"><span className="status-dot" />INDEPENDENT TECHNOLOGY STUDIO</p>
          <h1 id="home-title"><span className="hero-line"><span>Digital products.</span></span><span className="hero-line"><span>Built <em>differently.</em></span></span></h1>
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
            <p className="body-copy">We’re AVITA TECHNOLOGIES. An independent technology studio building useful digital products, scalable platforms and smarter ways of working.</p>
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
            <ul className="founder-list">{[{ initials: "SMK", name: "Swatantra Mahavir Kashiwal" }, { initials: "RDJ", name: "Rahul Devsingh Jadhav" }].map((founder, index) => <li className="founder" key={founder.initials}>
              <span className="founder-initials" aria-hidden="true"><span>{founder.initials}</span></span><div><p className="founder-role">CO-FOUNDER</p><h4>{founder.name}</h4></div><span className="founder-index" aria-hidden="true">0{index + 1}</span>
            </li>)}</ul>
          </aside>
        </figure>
      </div>
      <Principles />
    </div>
  </section>;
}
function ProductPreview({ variant }: { variant: string }) {
  if (variant === "mobile") return <div className="product-preview preview-mobile" aria-hidden="true"><span className="preview-background-type">IN MOTION</span><div className="mobile-orbit" /><div className="phone phone-back"><div className="phone-notch" /><span className="phone-time">9:41</span><div className="phone-back-content"><span>YOUR NEXT<br />GOOD HABIT.</span><Asterisk size={80} strokeWidth={1} /><small>Make space for what matters.</small></div></div><div className="phone phone-front"><div className="phone-notch" /><span className="phone-time">9:41</span><div className="phone-content"><div className="phone-greeting">A little better,<br /><strong>every day.</strong></div><span className="app-date">YOUR DAILY OVERVIEW</span><div className="activity-circle"><span>72<small>%</small></span></div><p className="phone-caption">You’re making progress.</p><div className="phone-stat-row"><span><small>FOCUS TIME</small><strong>2h 40m</strong></span><span><small>COMPLETED</small><strong>8 tasks</strong></span></div><div className="phone-task"><span className="task-check">✓</span><span>Make something great<small>Today’s intention</small></span><ArrowUpRight size={17} /></div><div className="phone-nav"><Layers size={18} /><Asterisk size={18} /><Plus size={18} /></div></div></div></div>;
  if (variant === "automation") return <div className="product-preview preview-automation" aria-hidden="true"><span className="preview-background-type">LESS FRICTION.</span><div className="workflow-window"><div className="preview-toolbar"><span className="window-dots"><i /><i /><i /></span><span>Flow / Workflow builder</span><span>•••</span></div><div className="workflow-heading"><span><small>YOUR WORKSPACE</small><strong>Everything, connected.</strong></span><span className="workflow-live"><i />LIVE</span></div><div className="workflow-diagram"><svg viewBox="0 0 600 220" preserveAspectRatio="none"><path d="M105 110H230Q250 110 250 65V55H420M250 110Q250 165 280 165H420" fill="none" stroke="#a6dcb2" strokeWidth="2" strokeDasharray="5 5" /></svg><div className="workflow-node node-trigger"><div><Command size={23} /></div><strong>New request</strong><small>Trigger</small></div><div className="workflow-node node-action"><div><Sparkles size={23} /></div><strong>Enrich with AI</strong><small>Process</small></div><div className="workflow-node node-result"><div><Layers size={23} /></div><strong>Sync to workspace</strong><small>Action</small></div></div><div className="workflow-bottom"><span><i />All systems connected</span><span>RUN WORKFLOW <ArrowRight size={14} /></span></div></div></div>;
  if (variant === "web") return <div className="product-preview preview-web" aria-hidden="true"><div className="web-window"><div className="preview-toolbar"><span className="window-dots"><i /><i /><i /></span><span>atlas / explore</span><span>•••</span></div><div className="web-preview-nav"><strong>atlas<span>®</span></strong><span>Discover&nbsp;&nbsp;&nbsp; Collections&nbsp;&nbsp;&nbsp; Journal</span><ArrowUpRight size={20} /></div><div className="web-preview-body"><span className="eyebrow">LESS SCROLLING. MORE LIVING.</span><strong>Find your<br /><em>somewhere.</em></strong><div className="web-landscape"><span className="landscape-sun" /><span className="landscape-hill hill-one" /><span className="landscape-hill hill-two" /><span className="landscape-hill hill-three" /></div><div className="web-search"><span>Your next adventure starts here</span><ArrowRight size={18} /></div></div></div><span className="preview-corner-label">EXPERIENCES WITH A POINT OF VIEW.</span></div>;
  return <div className="product-preview preview-platform" aria-hidden="true"><span className="preview-background-type">BUILT TO GROW.</span><div className="dashboard-window"><div className="preview-toolbar"><span className="window-dots"><i /><i /><i /></span><span>nexus / workspace</span><span>•••</span></div><div className="dashboard-layout"><aside className="dashboard-sidebar"><strong><Asterisk size={20} />nexus</strong><span className="sidebar-selected"><Layers size={12} /> Overview</span><span><Code2 size={12} /> Projects</span><span><Globe size={12} /> Analytics</span><span><Command size={12} /> Workspace</span><div className="sidebar-avatar">AV<span>Your workspace<small>Pro plan</small></span></div></aside><div className="dashboard-content"><div className="dashboard-heading"><span><small>YOUR WORKSPACE, AT A GLANCE</small><strong>Good things are growing.</strong></span><span className="dashboard-date">This month ↗</span></div><div className="dashboard-stats"><div><small>Total revenue</small><strong>₹2,84,520</strong><span>↗ 12.8%</span></div><div><small>Active projects</small><strong>24</strong><span>↗ 6 this month</span></div><div><small>Growth</small><strong>32.4%</strong><span>↗ Looking good</span></div></div><div className="dashboard-chart"><div><strong>Performance overview</strong><span>↗ Steady progress</span></div><svg viewBox="0 0 500 155" preserveAspectRatio="none"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b8a4ff" stopOpacity=".45" /><stop offset="1" stopColor="#b8a4ff" stopOpacity="0" /></linearGradient></defs><path d="M0 130C40 130 40 95 80 105S145 65 190 80 230 45 280 55 335 15 370 35 445 10 500 5V155H0Z" fill="url(#chart-fill)" /><path d="M0 130C40 130 40 95 80 105S145 65 190 80 230 45 280 55 335 15 370 35 445 10 500 5" fill="none" stroke="#9e85f5" strokeWidth="3" /></svg><div className="chart-months"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span></div></div><div className="dashboard-bottom"><span><i />All systems operational</span><span>Built for your next chapter.</span></div></div></div></div></div>;
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
    <div className="work-heading reveal"><h2 id="work-title">Made to work.<br /><span className="lavender">Made to matter.</span></h2><div><p className="body-copy">A few ways we bring ideas to life.</p><span className="eyebrow work-note">CONCEPTS / DESIGN + ENGINEERING</span></div></div>
    <div className="project-grid" ref={grid}>{projects.map((project, index) => <Dialog key={project.variant}><article className={`project-card reveal project-${project.variant}`}>
      <DialogTrigger className="project-image" aria-label={`View ${project.title}`}><div className="project-visual-inner"><ProductPreview variant={project.variant} /></div><span className="project-open"><ArrowUpRight size={25} aria-hidden="true" /><span>EXPLORE</span></span></DialogTrigger>
      <div className="project-info"><p className="project-label"><span>0{index + 1}</span>{project.label}</p><DialogTrigger className="project-title">{project.title}<ArrowUpRight size={23} aria-hidden="true" /></DialogTrigger><p className="project-tags">{project.tags}</p></div>
    </article><DialogContent className="project-dialog"><ProductPreview variant={project.variant} /><p className="eyebrow">{project.label} / CONCEPT EXPLORATION</p><DialogTitle>{project.title}</DialogTitle><DialogDescription>{project.description}</DialogDescription><DialogClose asChild><a className="button" href="#contact">Build something like this<ArrowUpRight size={18} /></a></DialogClose></DialogContent></Dialog>)}</div>
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
    const subject = encodeURIComponent(`Project enquiry — ${data.get("name")}`);
    const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("brief")}`);
    window.location.href = `mailto:contact@avitatechnologies.com?subject=${subject}&body=${body}`;
    setStatus("Your email draft is ready. Send it from your email app.");
  }
  return <section id="contact" className="contact-section light-section" data-theme="light" aria-labelledby="contact-title"><div className="container contact-grid">
    <div className="contact-intro reveal"><SectionLabel number="04">YOUR NEXT CHAPTER</SectionLabel>
      <h2 id="contact-title">Got a <span className="serif-word">what if?</span><br />Let’s make it real.</h2>
      <p className="contact-lead">Good things start with a conversation. A project, a possibility, or a quick hello — we’d love to hear what’s on your mind.</p>
      <address className="contact-cards">
        <a className="contact-card" href="mailto:contact@avitatechnologies.com"><span className="contact-icon"><Mail size={18} /></span><span><small>DROP US A LINE</small><strong>contact@avitatechnologies.com</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
        <div className="contact-card"><span className="contact-icon"><Phone size={18} /></span><span><small>LET’S TALK</small><strong><a href="tel:+919975352964">+91 99753 52964</a><span aria-hidden="true"> · </span><a href="tel:+919321756978">+91 93217 56978</a></strong></span></div>
        <a className="contact-card" href="https://avitatechnologies.netlify.app" target="_blank" rel="noreferrer"><span className="contact-icon"><Globe size={18} /></span><span><small>FIND US ONLINE</small><strong>avitatechnologies.netlify.app</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
      </address>
    </div>
    <form className="contact-form contact-panel reveal" onSubmit={submit}><div className="contact-panel-head"><h3>Tell us about your idea.</h3><Asterisk className="contact-star" size={48} strokeWidth={1.4} aria-hidden="true" /></div><div className="form-top-row"><label htmlFor="contact-name">Your Name<input id="contact-name" name="name" placeholder="Full name" autoComplete="name" required maxLength={120} /></label><label htmlFor="contact-email">Your Email<input id="contact-email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required maxLength={254} /></label></div><div className="form-field"><label htmlFor="contact-brief">Project Brief</label><textarea id="contact-brief" name="brief" placeholder="What would you like to build?" value={brief} onChange={event => setBrief(event.target.value)} required rows={3} maxLength={6000} /></div><div className="form-bottom"><p className="form-note">Your idea. Our next conversation.<br />Opens a draft in your email app.</p><button type="submit" className="button">Let’s make it happen<span className="button-icon"><ArrowUpRight size={22} /></span></button></div>{status && <p className="form-status" role="status">{status}</p>}</form>
  </div></section>;
}
const footerServices = ["Web & Mobile", "Software Engineering", "Cloud & Infrastructure", "Digital Products", "Automation", "AI & Data"];
function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-grid">
      <div className="footer-brand"><a href="#home" className="brand-link" aria-label="AVITA Technologies home"><Brand /></a><p>Independent minds.<br />Extraordinary possibilities.</p></div>
      <div className="footer-pitch"><p className="footer-title">HAVE AN IDEA?</p><p className="footer-pitch-title">Let’s build it <span className="serif-word">together.</span></p><a className="footer-pitch-mail" href="mailto:contact@avitatechnologies.com">contact@avitatechnologies.com<ArrowUpRight size={18} aria-hidden="true" /></a><a className="button footer-cta" href="#contact">Start a project<span className="button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></a></div>
      <nav aria-label="Footer"><p className="footer-title">EXPLORE</p><ul>{navigation.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ul></nav>
      <div className="footer-capabilities"><p className="footer-title">CAPABILITIES</p><ul>{footerServices.map(item => <li key={item}><a href="#services">{item}</a></li>)}</ul></div>
      <div className="footer-contact"><p className="footer-title">CONTACT</p><ul><li><a href="mailto:contact@avitatechnologies.com">contact@avitatechnologies.com</a></li><li><a href="tel:+919975352964">+91 99753 52964</a></li><li><a href="tel:+919321756978">+91 93217 56978</a></li><li><a href="https://avitatechnologies.netlify.app" target="_blank" rel="noreferrer">avitatechnologies.netlify.app</a></li></ul></div>
    </div>
    <div className="footer-bottom"><p>© 2026 AVITA TECHNOLOGIES · RDJ &amp; SMK</p><p>IDEAS. ENGINEERING. REAL IMPACT.</p><a className="back-top" href="#home">Back to top<span><ArrowUpRight size={18} /></span></a></div>
  </div><span className="footer-wordmark" aria-hidden="true">AVITA</span></footer>;
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
