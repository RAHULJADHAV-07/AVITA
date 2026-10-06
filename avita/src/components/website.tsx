import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ArrowDown, Play, Pause, Menu, Phone, Mail, Globe, CodeXml, Cloud, Settings, Layers } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export type PageName = "home" | "about" | "services" | "projects" | "contact";
const navigation: { label: string; href: string; page: PageName }[] = [
  { label: "Home", href: "/", page: "home" },
  { label: "About", href: "/about", page: "about" },
  { label: "Services", href: "/services", page: "services" },
  { label: "Work", href: "/projects", page: "projects" },
  { label: "Contact", href: "/contact", page: "contact" },
];
const services = [
  { title: "Web & Mobile Development", text: "Modern, scalable and high-performance web and mobile applications." },
  { title: "Software Engineering", text: "Custom software solutions for your business needs." },
  { title: "Cloud & Infrastructure", text: "Reliable cloud infrastructure and deployment support." },
  { title: "Digital Products", text: "Product strategy, MVPs and scalable platforms." },
  { title: "Automation & Integrations", text: "Workflow automation and third-party integrations." },
  { title: "AI / Data / Custom Solutions", text: "Tailored solutions using modern technologies." },
];
const projects = [
  { image: "project-platform", title: "Modern web platform", label: "DIGITAL PLATFORM", tags: ["Web", "Cloud"], description: services[3].text },
  { image: "project-web", title: "User focused web application", label: "WEB EXPERIENCE", tags: ["Web"], description: services[0].text },
  { image: "project-automation", title: "Streamlined operations", label: "BUSINESS AUTOMATION", tags: ["Automation", "Cloud"], description: services[4].text },
  { image: "project-mobile", title: "Modern mobile experience", label: "MOBILE APPLICATION", tags: ["Mobile"], description: services[0].text },
];

function Artwork({ name, alt = "", className = "", eager = false }: { name: string; alt?: string; className?: string; eager?: boolean }) {
  return <img src={`/artwork/${name}.webp`} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" />;
}
function Brand({ className = "" }: { className?: string }) {
  return <svg className={`brand-mark ${className}`} viewBox="0 0 132 50" role="img" aria-label="AVITA Technologies">
    <g fill="none" stroke="currentColor" strokeWidth="3.1" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4 33 17 7 30 33M10 24h14M35 8l11 25L57 8M64 11v22M73 8h22M84 9v24M99 33l13-26 13 26M105 24h14" />
    </g>
    <path d="m112 7 13 26h-4L112 15z" fill="#0568ff" />
    <path d="M62.5 12v12" stroke="#7b2dff" strokeWidth="3.1" />
    <circle cx="64" cy="5" r="2.4" fill="#952cff" />
    <text x="6" y="46" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="5.3" fontWeight="600" letterSpacing="3.2">TECHNOLOGIES</text>
  </svg>;
}
function ProjectButton({ children = "Start a project", outline = false }: { children?: ReactNode; outline?: boolean }) {
  return <a className={`button ${outline ? "button-outline" : ""}`} href="/contact">{children}<ArrowRight size={16} aria-hidden="true" /></a>;
}
function Header({ page }: { page: PageName }) {
  return <header className="site-header"><div className="container header-inner">
    <a className="brand-link" href="/" aria-label="AVITA Technologies home"><Brand /></a>
    <nav className="desktop-navigation" aria-label="Main navigation">{navigation.map(item =>
      <a key={item.page} href={item.href} aria-current={page === item.page ? "page" : undefined}>{item.label}</a>
    )}</nav>
    <div className="header-actions"><ProjectButton />
      <Sheet><SheetTrigger className="menu-trigger" aria-label="Open navigation"><Menu size={22} /></SheetTrigger>
        <SheetContent className="mobile-menu"><SheetTitle><Brand /></SheetTitle>
          <nav aria-label="Mobile navigation">{navigation.map(item =>
            <a key={item.page} href={item.href} aria-current={page === item.page ? "page" : undefined}>{item.label}<ArrowRight size={20} /></a>
          )}</nav><ProjectButton />
        </SheetContent>
      </Sheet>
    </div>
  </div></header>;
}
function SocialMarks() {
  return <div className="social-marks">
    <svg role="img" aria-label="LinkedIn" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" /><circle cx="8" cy="8" r="1" fill="currentColor" /><path d="M8 11v6m4 0v-6m0 3c0-4 5-4 5 0v3" stroke="currentColor" strokeWidth="1.5" /></svg>
    <svg role="img" aria-label="Instagram" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="17" cy="7" r="1" fill="currentColor" /></svg>
  </div>;
}
function Footer({ page }: { page: PageName }) {
  return <footer id="footer" className="site-footer"><div className="container">
    <div className="footer-main"><a className="brand-link" href="/" aria-label="AVITA Technologies home"><Brand /></a>
      <nav aria-label="Footer navigation">{navigation.map(item => <a key={item.page} href={item.href} aria-current={page === item.page ? "page" : undefined}>{item.label}</a>)}</nav>
      <ProjectButton outline />
    </div>
    <div className="footer-bottom"><p>© 2026 AVITA TECHNOLOGIES. All rights reserved.</p><span>RDJ &amp; SMK</span><SocialMarks /></div>
  </div></footer>;
}
function Manifesto({ words, className = "" }: { words: string[]; className?: string }) {
  return <div className={`manifesto ${className}`}>{words.map(word => <span key={word}>{word}</span>)}<i aria-hidden="true" /></div>;
}
function Intro() {
  const [playing, setPlaying] = useState(true);
  return <Dialog><DialogTrigger className="intro-button"><span className="play-circle"><Play size={12} fill="currentColor" /></span>Watch intro</DialogTrigger>
    <DialogContent className="intro-dialog"><DialogTitle className="sr-only">AVITA Technologies</DialogTitle><DialogDescription className="sr-only">Ideas. Engineering. Real impact.</DialogDescription>
      <div className={`intro-slides ${playing ? "" : "paused"}`}>
        <div className="intro-slide intro-light"><Artwork name="hero-prism" alt="AVITA glass prism" /><h2>Digital products.<br />Built <span className="gradient">properly.</span></h2></div>
        <div className="intro-slide"><Artwork name="about-studio" alt="AVITA studio" /><h2>Small team.<br />Serious <span className="gradient">engineering.</span></h2></div>
        <div className="intro-slide"><Artwork name="services-laptop" alt="Technology dashboard" /><h2>Technology<br />with <span className="gradient">purpose.</span></h2></div>
      </div>
      <button className="intro-pause" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause intro" : "Play intro"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
    </DialogContent>
  </Dialog>;
}
function Home() {
  const offerings = [
    { title: "Web & Mobile Development", icon: CodeXml },
    { title: "Cloud Solutions", icon: Cloud },
    { title: "Automation & Integrations", icon: Settings },
    { title: "Digital Products", icon: Layers },
  ];
  return <>
    <section className="home-hero"><div className="container hero-inner">
      <Artwork name="hero-prism" className="hero-art" alt="Faceted silver and glass sculpture with electric blue and violet reflections" eager />
      <div className="hero-copy"><p className="eyebrow">IDEAS. ENGINEERING. REAL IMPACT.</p>
        <h1>Digital<br />products.<br />Built <span className="gradient">properly.</span></h1>
        <p className="body-copy">A technology agency focused on building modern digital products, scalable platforms and smart solutions.</p>
        <div className="hero-actions"><ProjectButton>Let’s build</ProjectButton><Intro /></div>
      </div>
    </div><div className="container hero-strip">{["PRODUCT", "ENGINEERING", "AUTOMATION", "CLOUD"].map(word => <span key={word}>{word}</span>)}</div></section>
    <section className="purpose-section">
      <Artwork name="home-architecture" className="purpose-background" alt="Monolithic angular architecture above a reflective plaza, with a single figure on a raised walkway" />
      <div className="purpose-shade" />
      <div className="container purpose-inner">
        <div className="offerings"><p className="small-label">What we do</p><h2>Build. Integrate. Scale.</h2>
          <div className="offering-grid">{offerings.map(({title,icon: Icon}) => <a href="/services" key={title}><Icon size={30} strokeWidth={1.4} /><span>{title}</span></a>)}</div>
        </div>
        <div className="tomorrow"><p>Built for<br />a better tomorrow</p><span className="tomorrow-line" aria-hidden="true"><span>+</span><ArrowRight size={19} /></span></div>
        <h2 className="purpose-heading">Technology<br />with <span className="gradient">purpose.</span></h2>
        <a href="#footer" className="scroll-cue"><span /><small>Scroll</small><ArrowDown size={11} /></a>
      </div>
    </section>
  </>;
}
function About() {
  return <>
    <section className="about-section container">
      <div className="about-hero"><div className="about-visual"><Artwork name="about-interior" alt="Dark contemporary lounge with a leather chair, brass lamp and green plant" eager /><Manifesto words={["IDEAS", "PEOPLE", "TECHNOLOGY", "GROWTH"]} /></div>
        <div className="about-copy"><p className="eyebrow">ABOUT AVITA</p><h1>Small team.<br />Serious<br /><span className="gradient">engineering.</span></h1>
          <p className="body-copy">We are AVITA TECHNOLOGIES — a technology agency focused on building digital solutions that solve real-world problems.</p>
        </div>
      </div>
      <div className="about-lower"><section className="founders"><h2 className="section-title">Our Founders</h2><div className="founder-grid">
        <article className="founder"><span className="founder-initials">SMK</span><h3>Swatantra<br />Mahavir Kashiwal</h3><p>Co-Founder</p></article>
        <article className="founder"><span className="founder-initials">RDJ</span><h3>Rahul<br />Devsingh Jadhav</h3><p>Co-Founder</p></article>
      </div></section>
      <section className="process"><h2 className="section-title">How we work</h2><div className="process-grid">
        {[["Think", "We understand your goals and identify the right approach."], ["Build", "We design and develop scalable solutions."], ["Refine", "We iterate, improve and help you grow long-term."]].map(([title,text],i) => <article key={title}><span className="process-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}
      </div></section></div>
    </section>
    <section className="studio-section"><Artwork name="about-studio" alt="Glass-fronted AVITA studio with an amber-lit meeting room" /><div className="studio-overlay container"><Manifesto words={["A STUDIO", "THAT BUILDS", "REAL SOLUTIONS"]} /><Brand className="studio-brand" /></div></section>
  </>;
}
function Services() {
  return <section className="services-section"><div className="container services-layout">
    <div className="services-copy"><p className="eyebrow">OUR SERVICES</p><h1>Technology services<br />for a <span className="gradient">digital world.</span></h1>
      <div className="service-list">{services.map(({title,text},i) => <a href={`/contact?service=${encodeURIComponent(title)}`} className="service-row" key={title}>
        <span className="service-number">0{i+1}</span><div><h2>{title}</h2><p>{text}</p></div><span className="service-arrow"><ArrowRight size={15} /></span>
      </a>)}</div>
    </div>
    <div className="services-visual"><Artwork name="services-laptop" alt="Modern laptop displaying a blue and purple analytics dashboard on volcanic rock" eager /><Manifesto words={["IDEAS", "ENGINEERING", "AUTOMATION", "GROWTH"]} /><Manifesto className="services-tagline" words={["TURNING", "BUSINESS GOALS", "INTO DIGITAL", "SOLUTIONS"]} /></div>
  </div></section>;
}
function Projects() {
  const [filter,setFilter] = useState("All");
  return <section className="projects-section container"><p className="eyebrow">OUR WORK</p><h1>Projects that<br />create <span className="gradient">impact.</span></h1>
    <div className="project-filters" role="group" aria-label="Filter projects">{["All", "Web", "Mobile", "Cloud", "Automation"].map(category => <button key={category} className={filter === category ? "selected" : ""} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>
    <div className="project-grid">{projects.filter(project => filter === "All" || project.tags.includes(filter)).map(project => <Dialog key={project.image}>
      <DialogTrigger className="project-card" aria-label={`View ${project.title}`}>
        <Artwork name={project.image} alt={project.title} eager /><span className="project-shade" />
        <span className="project-copy"><span className="project-label">{project.label}</span><span className="project-title">{project.title}</span></span>
        <span className="project-open" aria-hidden="true"><ArrowRight size={18} /></span>
      </DialogTrigger>
      <DialogContent className="project-dialog"><Artwork name={project.image} alt={project.title} /><p className="eyebrow">{project.label}</p><DialogTitle>{project.title}</DialogTitle><DialogDescription>{project.description}</DialogDescription><ProjectButton /></DialogContent>
    </Dialog>)}</div>
  </section>;
}
function Contact() {
  const [status,setStatus] = useState("");
  const selectedService = new URLSearchParams(window.location.search).get("service");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Project enquiry — ${data.get("name")}`);
    const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("brief")}`);
    window.location.href = `mailto:contact@avitatechnologies.com?subject=${subject}&body=${body}`;
    setStatus("Your email draft is ready. Send it from your email app.");
  }
  return <section className="contact-section container"><div className="contact-layout">
    <div className="contact-details"><Artwork name="contact-architecture" className="contact-architecture" alt="Bright minimalist interior with a fluted graphite wall and sculptural branch" eager />
      <div className="contact-heading"><p className="eyebrow">CONTACT US</p><h1>Let’s build<br />something<br /><span className="gradient">useful.</span></h1><p className="body-copy">Have a project, idea or just want to say hello?<br />We’d love to hear from you.</p></div>
      <address className="contact-links"><div><span className="contact-icon"><Phone size={19} fill="currentColor" /></span><span className="phone-numbers"><a href="tel:9975352964">9975352964</a><a href="tel:9321756978">9321756978</a></span></div>
        <a href="mailto:contact@avitatechnologies.com"><span className="contact-icon"><Mail size={19} /></span><span>contact@avitatechnologies.com</span></a>
        <a href="https://avitatechnologies.netlify.app" target="_blank" rel="noreferrer"><span className="contact-icon"><Globe size={19} /></span><span>avitatechnologies.netlify.app</span></a>
      </address>
    </div>
    <div className="contact-form-column"><form className="contact-form" onSubmit={submit}><h2>Send us a message</h2>
      <label className="sr-only" htmlFor="contact-name">Your Name</label><input id="contact-name" name="name" placeholder="Your Name" autoComplete="name" required maxLength={120} />
      <label className="sr-only" htmlFor="contact-email">Your Email</label><input id="contact-email" name="email" type="email" placeholder="Your Email" autoComplete="email" required maxLength={254} />
      <label className="sr-only" htmlFor="contact-brief">Project Brief</label><textarea id="contact-brief" name="brief" placeholder="Project Brief" defaultValue={selectedService ? `${selectedService}\n` : ""} required rows={5} maxLength={6000} />
      <button type="submit" className="button gradient-button">Send Message<ArrowRight size={17} /></button>
      {status && <p className="form-status" role="status">{status}</p>}
    </form>
    <div className="contact-prism"><Artwork name="contact-prism" alt="Transparent silver-edged triangular glass sculpture with a deep violet center" /><Manifesto words={["GOOD", "IDEAS", "GREAT", "SOLUTIONS"]} /></div>
    </div>
  </div></section>;
}
export default function Website({page}: {page: PageName}) {
  return <><a href="#main" className="skip-link">Skip to content</a><Header page={page} /><main id="main" className={`page-${page}`}>{page === "home" ? <Home /> : page === "about" ? <About /> : page === "services" ? <Services /> : page === "projects" ? <Projects /> : <Contact />}</main><Footer page={page} /></>;
}
