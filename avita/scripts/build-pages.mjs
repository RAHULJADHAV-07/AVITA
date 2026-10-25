// Generates the static service and location pages into dist/ after `vite build`.
// Each page is plain HTML (no JavaScript needed), so search engines read the full content,
// and it reuses the site's built stylesheet so it looks like the rest of the site.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const site = "https://avitatechnologies.com";
const today = new Date().toISOString().slice(0, 10);
const phone = { display: "+91 91301 53071", tel: "+919130153071", schema: "+91-9130153071" };
const email = "contact@avitatechnologies.com";
const whatsapp = "https://wa.me/919130153071";
const maps = "https://www.google.com/maps/search/?api=1&query=Plot+No+49+Manish+Nagar+Andheri+West+Mumbai+400053";
const address = { street: "Plot No. 49, Manish Nagar, Andheri West", city: "Mumbai", region: "Maharashtra", postal: "400053" };

const work = {
  jg: { name: "Jaikvin Global", kind: "Export operations platform", text: "A full-stack web app that runs an export business end to end and generates 40+ customs and shipping papers as PDF, Excel and Word from one shipment record. In production, now on v7.3.", image: "/work/jg/02.webp", href: "/#work", cta: "See the case study" },
  amishna: { name: "Amishna Music", kind: "Company website", text: "A premium, fully responsive website for a music publishing and royalty management company, built to explain a complex service and earn trust at first glance.", image: "/work/amishna/01.webp", href: "https://amishnamusic.com/", cta: "Visit amishnamusic.com" },
  space: { name: "AVITA.TECH", kind: "Immersive 3D website", text: "A studio website where scrolling becomes a space flight, with a real-time 3D Earth and eight planets rendered live in the browser with Three.js.", image: "/work/space/01.webp", href: "https://avitagraphics.netlify.app/", cta: "Visit the live site" },
  myhisab: { name: "My Hisab", kind: "Money tracking app", text: "An installable mobile-first app for daily money: balance across UPI, bank and cash, a searchable ledger, borrowed and lent, and savings goals.", image: "/work/myhisab/01.webp", href: "https://money-dun-seven.vercel.app/", cta: "Open My Hisab" },
  thali: { name: "Thali", kind: "Calorie and macro tracker", text: "A mobile-first tracker for Indian food with daily targets from BMR and TDEE, week and month charts, streaks and a weight trend.", image: "/work/thali/01.webp", href: "https://thali-eight.vercel.app/", cta: "Open Thali" },
};

const steps = [
  ["Understand", "We start by listening. What you do, who uses it, and the problem worth solving, before anything is designed."],
  ["Design", "Screens, flows and structure shaped around the people who will use them, agreed with you before we build."],
  ["Build", "Clean, tested engineering in short steps, so you see working software early and often."],
  ["Launch and support", "We deploy, monitor and keep improving, so the product stays fast, secure and useful after launch."],
];

const pages = [
  {
    slug: "services/website-development-mumbai", short: "Website development",
    title: "Website Development Company in Mumbai | AVITA Technologies",
    description: "Website design and development in Mumbai by AVITA Technologies, Andheri West. Fast, responsive, SEO-ready business websites and web apps built with React.",
    eyebrow: "WEBSITE DEVELOPMENT · MUMBAI", h1: ["Website development", "company in Mumbai."],
    lead: "We design and build fast, responsive websites for businesses in Mumbai and across India, from a sharp company site to a full web application.",
    intro: ["Your website is often the first conversation a customer has with your business. We make sure it says the right thing: clear about what you do, quick to load on any phone, and easy to find on Google.", "Every site is designed and engineered by our own team in Andheri West, with clean code you own, built to grow with your business instead of being rebuilt every two years."],
    offers: [["Business and company websites", "A clear, premium website that explains what you do and turns visitors into enquiries."], ["Web applications", "Portals, dashboards and tools that run in the browser, from login to reports."], ["Landing pages", "Focused pages for a product, launch or campaign, built to convert."], ["Website redesign", "A modern rebuild of an outdated site, keeping what works and fixing what doesn't."], ["SEO-ready by default", "Fast load times, proper titles, structured data and a sitemap, so Google understands your site."], ["Interactive and 3D experiences", "Motion and real-time 3D when it helps tell your story, never at the cost of speed."]],
    work: ["amishna", "space"],
    stack: ["React", "Next.js", "Vite", "TypeScript", "Three.js", "Netlify", "Vercel"],
    faq: [["How much does a website cost in Mumbai?", "It depends on the number of pages, features and content. Tell us what you need and we will reply with a clear estimate before any work starts."], ["Will my website work on mobile phones?", "Yes. Every site we build is responsive and tested on phones, tablets and desktops."], ["Can you redesign my existing website?", "Yes. We can rebuild an existing site on a modern stack while keeping your content and your search rankings in mind."], ["Do you help with SEO?", "Every site ships with the technical basics: fast loading, clean page titles and descriptions, structured data, a sitemap and mobile-friendly design."]],
    service: "Website design and development",
  },
  {
    slug: "services/mobile-app-development-mumbai", short: "Mobile app development",
    title: "Mobile App Development Company in Mumbai | AVITA Technologies",
    description: "Mobile app development in Mumbai by AVITA Technologies, Andheri West. Mobile-first web apps and installable PWAs for Android and iPhone, designed and built in-house.",
    eyebrow: "MOBILE APPS · MUMBAI", h1: ["Mobile app development", "company in Mumbai."],
    lead: "We design and build mobile apps people keep on their home screen: quick to open, simple to use, and built around the one thing users came to do.",
    intro: ["A good app answers its big question on the first screen. We design every flow so the most important action takes seconds, and the numbers that matter are right where the user looks first.", "We build mobile-first web apps and installable PWAs that work on Android and iPhone from a single codebase, so you reach every user without paying to build everything twice."],
    offers: [["Mobile-first web apps", "Apps designed for the phone first, that also work beautifully on a laptop."], ["Installable PWAs", "Add to home screen, full-screen like a native app, fast on any connection."], ["App UI and UX design", "Screens, flows and a design language that feels effortless to use."], ["Dashboards and tracking", "Charts, streaks, goals and history that make daily data easy to read."], ["Sign-in and accounts", "Secure login, including Google sign-in, with each user's data kept private."], ["Ongoing updates", "Versioned releases with new features and fixes after launch."]],
    work: ["myhisab", "thali"],
    stack: ["React", "Next.js", "Vite", "PWA", "Recharts", "Vercel"],
    faq: [["Do you build apps for both Android and iPhone?", "Yes. We build mobile-first web apps and installable PWAs that run on both from one codebase."], ["What is a PWA?", "A progressive web app installs from the browser to the home screen and opens full screen like a native app, without going through an app store."], ["Can you design the app as well as build it?", "Yes. Design and engineering happen in the same team, so what you approve is what gets built."], ["How long does it take to build an app?", "It depends on the features. We agree on a first version that solves the core problem, ship it, then improve it in steps."]],
    service: "Mobile app development",
  },
  {
    slug: "services/custom-software-development-mumbai", short: "Custom software",
    title: "Custom Software Development in Mumbai | AVITA Technologies",
    description: "Custom software development in Mumbai by AVITA Technologies, Andheri West. Business software, internal tools, APIs and full-stack platforms built around how you work.",
    eyebrow: "CUSTOM SOFTWARE · MUMBAI", h1: ["Custom software", "development in Mumbai."],
    lead: "Off-the-shelf tools make you change how you work. We build software around how your business already works, then make it faster.",
    intro: ["When spreadsheets, copy-paste and manual paperwork start slowing a team down, custom software pays for itself. We map how your work actually flows, then build one system where every figure is entered once and used everywhere.", "We handle the full stack: the interface your team uses, the backend and database behind it, security, and deployment, with documentation so the software stays maintainable."],
    offers: [["Business management systems", "Orders, inventory, invoicing, costing and reports, linked in one place."], ["Internal tools and portals", "Admin panels and team tools that replace scattered spreadsheets."], ["APIs and integrations", "Connect your software to the services and systems you already use."], ["Document generation", "Invoices, forms and reports produced automatically as PDF, Excel or Word."], ["Roles and security", "Role-based permissions, secure sign-in, rate limiting and an audit log."], ["Modernising old systems", "Move a legacy tool to a modern, maintainable stack without losing data."]],
    work: ["jg"],
    stack: ["React", "TypeScript", "Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "nginx"],
    faq: [["Why choose custom software instead of an off-the-shelf tool?", "Off-the-shelf tools fit an average business. Custom software fits yours, removes duplicate data entry and grows as you do."], ["Will I own the code?", "Yes. You own the software we build for you."], ["Can you work with our existing data?", "Yes. We can import data from spreadsheets or older systems as part of the project."], ["Do you provide support after launch?", "Yes. We release updates in versions and keep improving the software as your needs change."]],
    service: "Custom software development",
  },
  {
    slug: "services/business-automation-mumbai", short: "Business automation",
    title: "Business Automation Software in Mumbai | AVITA Technologies",
    description: "Business process automation in Mumbai by AVITA Technologies, Andheri West. Automate paperwork, documents, workflows and reports so your team stops retyping data.",
    eyebrow: "BUSINESS AUTOMATION · MUMBAI", h1: ["Business automation", "software in Mumbai."],
    lead: "If your team types the same figures into five different documents, we can make that one click.",
    intro: ["Manual paperwork is slow, and every time a number is retyped, a mistake can slip in. We automate the repetitive parts of your operations so documents, reports and updates come straight from one source of truth.", "For one export business we replaced hours of manual Excel work per shipment with a platform that generates 40+ customs and shipping papers from a single record."],
    offers: [["Automatic document generation", "Invoices, packing lists, declarations and letters, built from your data in one click."], ["Workflow automation", "Approvals, status updates and hand-offs that move on their own."], ["Excel and Word output", "Files in your own layouts, with live Excel formulas where you need them."], ["Dashboards and reports", "Live views of pending work, dispatch status and totals, without manual reports."], ["Integrations", "Connect the tools you already use so data flows between them automatically."], ["Configurable without code", "Admins change columns, sequences and rules from a settings screen."]],
    work: ["jg"],
    stack: ["Python", "FastAPI", "PostgreSQL", "React", "React Query", "Docker"],
    faq: [["What kind of work can be automated?", "Anything repetitive and rule-based: documents, reports, data entry between systems, reminders and status updates."], ["Can the documents match our existing formats?", "Yes. We reproduce your own layouts so customers, banks and agents receive the papers they already expect."], ["Is our data secure?", "We build in secure sign-in, role-based permissions, account lockout and an audit log of who changed what."], ["Do we need to change how our team works?", "No. We automate your existing process first, then suggest improvements."]],
    service: "Business process automation",
  },
  {
    slug: "services/cloud-devops-mumbai", short: "Cloud and DevOps",
    title: "Cloud & DevOps Services in Mumbai | AVITA Technologies",
    description: "Cloud and DevOps services in Mumbai by AVITA Technologies, Andheri West. Hosting, deployment, Docker, databases and monitoring that keep your software fast and secure.",
    eyebrow: "CLOUD & DEVOPS · MUMBAI", h1: ["Cloud and DevOps", "services in Mumbai."],
    lead: "Great software needs a reliable home. We set up hosting, deployments and databases that stay fast, secure and ready to grow.",
    intro: ["We deploy and run the software we build, so it is set up properly from day one: automatic deployments, HTTPS, backups and a database that can handle growth.", "If you already have an app, we can move it to modern hosting, containerise it with Docker, and make releases routine instead of risky."],
    offers: [["Hosting and deployment", "Modern hosting with automatic deploys from your code repository."], ["Docker and containers", "Package your app so it runs the same everywhere."], ["Managed databases", "PostgreSQL set up with backups and room to scale."], ["Security basics done right", "HTTPS, security headers, rate limiting and safe handling of secrets."], ["Performance and caching", "Faster load times through caching, image optimisation and a CDN."], ["Monitoring and updates", "Keep an eye on uptime and errors, and ship fixes quickly."]],
    work: ["jg", "space"],
    stack: ["Docker", "nginx", "PostgreSQL (Neon)", "Netlify", "Vercel", "Linux"],
    faq: [["Can you move my existing website or app to new hosting?", "Yes. We plan the move so there is no data loss and minimal downtime."], ["Do you set up HTTPS and domains?", "Yes. We configure your domain, HTTPS certificates and redirects."], ["What happens when traffic grows?", "We set up hosting and databases that can scale, and cache what can be cached."], ["Do you look after the software after launch?", "Yes. We can monitor, update and improve it on an ongoing basis."]],
    service: "Cloud and DevOps services",
  },
  {
    slug: "services/ai-data-solutions-mumbai", short: "AI and data",
    title: "AI & Data Solutions in Mumbai | AVITA Technologies",
    description: "AI and data solutions in Mumbai by AVITA Technologies, Andheri West. Practical AI features, data cleaning, dashboards and analytics for real business problems.",
    eyebrow: "AI & DATA · MUMBAI", h1: ["AI and data", "solutions in Mumbai."],
    lead: "Practical intelligence for real business problems: clean data, clear dashboards and AI features that save your team time.",
    intro: ["Most businesses already have valuable data, spread across spreadsheets and systems. We clean it, bring it together and turn it into numbers you can act on.", "Where AI genuinely helps, such as summarising, classifying or answering questions from your own documents, we build it into your workflow, with people kept in control."],
    offers: [["Data cleaning and migration", "Turn messy spreadsheets into reliable, structured data."], ["Dashboards and analytics", "Charts and reports that show what is happening at a glance."], ["AI assistants and agents", "Tools that summarise, draft, classify or answer questions from your data."], ["Smart automation", "Let software handle sorting, tagging and routine decisions."], ["Calculations and targets", "Formula-driven targets and projections, like Thali's BMR and TDEE engine."], ["Custom AI integrations", "Add AI features to the software you already use."]],
    work: ["thali", "jg"],
    stack: ["Python", "PostgreSQL", "React", "Recharts", "LLM APIs"],
    faq: [["Do we need a lot of data to use AI?", "Not always. Many useful AI features work on the documents and data you already have."], ["Is our data kept private?", "Yes. We design AI features so your data is only used for your business."], ["Can you build dashboards from our spreadsheets?", "Yes. We can clean and connect your existing spreadsheets and turn them into live dashboards."], ["Will AI replace our team?", "No. We build AI to remove repetitive work so your team can focus on decisions."]],
    service: "AI and data solutions",
  },
  {
    slug: "software-company-andheri", short: "IT company in Andheri",
    title: "Software & IT Company in Andheri West, Mumbai | AVITA Technologies",
    description: "AVITA Technologies is a software and IT company in Andheri West, Mumbai. Websites, mobile apps, custom software and automation for businesses near Andheri and across Mumbai.",
    eyebrow: "ANDHERI WEST · MUMBAI 400053", h1: ["Software and IT company", "in Andheri West, Mumbai."],
    lead: "AVITA Technologies is an independent software studio at Manish Nagar, Andheri West, designing and building websites, apps and business software.",
    intro: ["We work with businesses in Andheri, Juhu, Versova, Lokhandwala, Jogeshwari, Goregaon and across Mumbai, as well as clients elsewhere in India. Being close by makes it easy to meet, understand your business, and work together face to face when it helps.", "Our small team covers the whole journey: design, frontend and backend engineering, hosting and ongoing support, so you have one partner instead of several vendors."],
    offers: [["Websites", "Fast, responsive company websites that rank and convert."], ["Mobile apps", "Mobile-first apps and installable PWAs for Android and iPhone."], ["Custom software", "Business systems, portals and internal tools built around your work."], ["Business automation", "Documents, reports and workflows that run themselves."], ["Cloud and DevOps", "Hosting, deployments and databases set up properly."], ["AI and data", "Dashboards, clean data and practical AI features."]],
    work: ["jg", "amishna", "myhisab"],
    stack: ["React", "Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker", "Three.js"],
    faq: [["Where is AVITA Technologies located?", "Plot No. 49, Manish Nagar, Andheri West, Mumbai 400053."], ["Do you only work with businesses in Andheri?", "No. We work with businesses across Mumbai and India, and we are always happy to meet clients near Andheri in person."], ["What services do you offer?", "Websites, mobile apps, custom software, business automation, cloud and DevOps, and AI and data solutions."], ["How do I start a project?", `Send us a message on WhatsApp at ${phone.display}, email ${email}, or use the form on our website.`]],
    service: "Software development",
    local: true,
  },
];

const services = pages.filter(page => page.slug.startsWith("services/"));
const hub = {
  slug: "services", short: "Services",
  title: "Software Development Services in Mumbai | AVITA Technologies",
  description: "Software development services by AVITA Technologies in Andheri West, Mumbai: website development, mobile apps, custom software, business automation, cloud and AI.",
  eyebrow: "SERVICES · ANDHERI, MUMBAI", h1: ["Software development", "services in Mumbai."],
  lead: "Everything you need to take an idea to a working product, designed and engineered by one team in Andheri West, Mumbai.",
  hub: true,
};

const icon = {
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  chat: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
  pin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
};
const brand = (color = "#f1f0eb") => `<svg class="brand-mark" viewBox="0 0 132 50" role="img" aria-label="AVITA Technologies"><g fill="none" stroke="${color}" stroke-width="3.1" stroke-linecap="square" stroke-linejoin="miter"><path d="M4 33 17 7 30 33M10 24h14M35 8l11 25L57 8M64 11v22M73 8h22M84 9v24M99 33l13-26 13 26M105 24h14"/></g><path d="m112 7 13 26h-4L112 15z" fill="#b8a4ff"/><path d="M62.5 12v12" stroke="#b8a4ff" stroke-width="3.1"/><circle cx="64" cy="5" r="2.4" fill="#b8a4ff"/><text x="6" y="46" fill="${color}" font-family="Arial, sans-serif" font-size="5.3" font-weight="600" letter-spacing="3.2">TECHNOLOGIES</text></svg>`;
const esc = text => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = page => `${site}/${page.slug}/`;
const external = href => href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";

const organization = {
  "@type": "ProfessionalService", "@id": `${site}/#organization`, name: "AVITA Technologies", url: `${site}/`,
  logo: `${site}/icon-512.png`, image: `${site}/og-image.jpg`, email, telephone: phone.schema,
  address: { "@type": "PostalAddress", streetAddress: address.street, addressLocality: address.city, addressRegion: address.region, postalCode: address.postal, addressCountry: "IN" },
  areaServed: [{ "@type": "Place", name: "Andheri, Mumbai" }, { "@type": "City", name: "Mumbai" }, { "@type": "Country", name: "India" }],
};

function schema(page) {
  const crumbs = [{ name: "Home", item: `${site}/` }];
  if (page.slug.startsWith("services/")) crumbs.push({ name: "Services", item: `${site}/services/` });
  crumbs.push({ name: page.short, item: url(page) });
  const graph = [
    organization,
    { "@type": "WebPage", "@id": `${url(page)}#webpage`, url: url(page), name: page.title, description: page.description, inLanguage: "en-IN", isPartOf: { "@id": `${site}/#website` }, about: { "@id": `${site}/#organization` } },
    { "@type": "BreadcrumbList", itemListElement: crumbs.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: crumb.item })) },
  ];
  if (page.service) graph.push({ "@type": "Service", name: page.service, serviceType: page.service, description: page.description, url: url(page), provider: { "@id": `${site}/#organization` }, areaServed: [{ "@type": "City", name: "Mumbai" }, { "@type": "Country", name: "India" }] });
  if (page.faq) graph.push({ "@type": "FAQPage", mainEntity: page.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  if (page.hub) graph.push({ "@type": "ItemList", itemListElement: services.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.service, url: url(item) })) });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/</g, "\\u003c");
}

const header = `<header class="site-header header-scrolled page-header"><div class="container header-inner">
  <a class="brand-link" href="/" aria-label="AVITA Technologies home">${brand()}</a>
  <nav class="desktop-navigation" aria-label="Main navigation">${[["Home", "/"], ["Studio", "/#about"], ["Services", "/services/"], ["Work", "/#work"], ["Contact", "/#contact"]].map(([label, href], i) => `<a href="${href}"><span class="nav-index" aria-hidden="true">0${i + 1}</span>${label}</a>`).join("")}</nav>
  <div class="header-actions"><a class="button" href="/#contact"><span>Let’s talk</span><span class="button-icon">${icon.arrow}</span></a></div>
</div></header>`;

const footerWork = [["Jaikvin Global", "/#work"], ["My Hisab", work.myhisab.href], ["Thali", work.thali.href], ["AVITA.TECH", work.space.href], ["Amishna Music", work.amishna.href]];
const footer = `<footer class="site-footer"><div class="container">
  <div class="footer-cta">
    <div><p class="footer-status"><i></i>AVAILABLE FOR NEW PROJECTS</p><h2 class="footer-headline">Have an idea?<br>Let’s build it <span class="serif-word">together.</span></h2></div>
    <div class="footer-cta-actions"><a class="button" href="/#contact">Start a project<span class="button-icon">${icon.arrow}</span></a><a class="footer-whatsapp" href="${whatsapp}" target="_blank" rel="noreferrer">${icon.chat}Chat on WhatsApp</a></div>
  </div>
  <div class="footer-grid">
    <div class="footer-brand"><a href="/" class="brand-link" aria-label="AVITA Technologies home">${brand()}</a><p>Independent minds.<br>Extraordinary possibilities.</p><p class="footer-origin">${icon.pin}Andheri West, Mumbai, India</p></div>
    <nav class="footer-explore" aria-label="Footer"><p class="footer-title">EXPLORE</p><ul>${[["Home", "/"], ["Studio", "/#about"], ["Services", "/services/"], ["Work", "/#work"], ["Contact", "/#contact"]].map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul></nav>
    <div class="footer-capabilities"><p class="footer-title">SERVICES</p><ul>${pages.map(p => `<li><a href="/${p.slug}/">${esc(p.short)}</a></li>`).join("")}</ul></div>
    <div class="footer-work"><p class="footer-title">SELECTED WORK</p><ul>${footerWork.map(([l, h]) => `<li><a href="${h}"${external(h)}>${l}${h.startsWith("http") ? icon.arrow.replace(/18/g, "13") : ""}</a></li>`).join("")}</ul></div>
    <div class="footer-contact"><p class="footer-title">CONTACT</p><ul><li><a href="mailto:${email}"><span>${email}</span></a></li><li><a href="tel:${phone.tel}"><span>${phone.display}</span></a></li><li><a href="${whatsapp}" target="_blank" rel="noreferrer"><span>WhatsApp</span></a></li><li><a href="${maps}" target="_blank" rel="noreferrer" class="footer-address"><span>Plot No. 49, Manish Nagar,<br>Andheri West, Mumbai 400053</span></a></li></ul></div>
  </div>
  <div class="footer-bottom"><p>© ${today.slice(0, 4)} AVITA TECHNOLOGIES · RDJ &amp; SMK</p><p>IDEAS. ENGINEERING. REAL IMPACT.</p><a class="back-top" href="#top">Back to top<span>${icon.arrow}</span></a></div>
</div></footer>`;

function body(page) {
  const crumbs = [["Home", "/"], ...(page.slug.startsWith("services/") ? [["Services", "/services/"]] : []), [page.short, null]];
  const hero = `<section class="pg-hero"><div class="container">
    <nav class="pg-crumbs" aria-label="Breadcrumb"><ol>${crumbs.map(([l, h]) => h ? `<li><a href="${h}">${esc(l)}</a></li>` : `<li aria-current="page">${esc(l)}</li>`).join("")}</ol></nav>
    <p class="eyebrow pg-eyebrow"><span class="status-dot"></span>${page.eyebrow}</p>
    <h1>${page.h1[0]}<br><span class="lavender">${page.h1[1]}</span></h1>
    <p class="pg-lead">${esc(page.lead)}</p>
    <div class="pg-actions"><a class="button" href="/#contact"><span>Start a project</span><span class="button-icon">${icon.arrow}</span></a><a class="pg-ghost" href="${whatsapp}" target="_blank" rel="noreferrer">${icon.chat}Chat on WhatsApp</a></div>
    <ul class="pg-facts"><li>${icon.pin}Based in Andheri West, Mumbai</li><li>${icon.check}Design and engineering in one team</li><li>${icon.check}Real products live in production</li></ul>
  </div></section>`;
  if (page.hub) return hero + `<section class="pg-section"><div class="container"><h2 class="pg-h2">What we do</h2><div class="pg-grid pg-hub">${pages.map(p => `<a class="pg-card pg-link-card" href="/${p.slug}/"><h3>${esc(p.h1.join(" ").replace(/\.$/, ""))}</h3><p>${esc(p.lead)}</p><span class="pg-more">Learn more${icon.arrow}</span></a>`).join("")}</div></div></section>`
    + `<section class="pg-section pg-steps-wrap"><div class="container"><h2 class="pg-h2">How we work</h2><ol class="pg-steps">${steps.map(([t, d], i) => `<li><span>0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol></div></section>`;
  const projects = page.work.map(key => work[key]);
  return hero
    + `<section class="pg-section"><div class="container pg-intro"><h2 class="pg-h2">${page.local ? "Your software partner, close to home." : "Built properly, from the first screen."}</h2><div>${page.intro.map(p => `<p>${esc(p)}</p>`).join("")}</div></div></section>`
    + `<section class="pg-section"><div class="container"><h2 class="pg-h2">${page.local ? "What we build" : "What we offer"}</h2><ul class="pg-grid">${page.offers.map(([t, d]) => `<li class="pg-card"><span class="pg-check">${icon.check}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("")}</ul></div></section>`
    + `<section class="pg-section"><div class="container"><h2 class="pg-h2">Work we have shipped</h2><div class="pg-work">${projects.map(p => `<article class="pg-project"><a href="${p.href}"${external(p.href)} class="pg-project-image"><img src="${p.image}" alt="${esc(p.name)}: ${esc(p.kind)} built by AVITA Technologies" loading="lazy" decoding="async"></a><div><p class="eyebrow">${esc(p.kind).toUpperCase()}</p><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p><a class="pg-more" href="${p.href}"${external(p.href)}>${p.cta}${icon.arrow}</a></div></article>`).join("")}</div></div></section>`
    + `<section class="pg-section pg-steps-wrap"><div class="container"><h2 class="pg-h2">How we work</h2><ol class="pg-steps">${steps.map(([t, d], i) => `<li><span>0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol><p class="pg-stack-title">TECHNOLOGY WE USE</p><ul class="pg-stack">${page.stack.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div></section>`
    + `<section class="pg-section"><div class="container pg-faq-wrap"><h2 class="pg-h2">Questions, answered.</h2><div class="pg-faq">${page.faq.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div></section>`
    + `<section class="pg-section"><div class="container"><h2 class="pg-h2 pg-h2-small">More from AVITA</h2><ul class="pg-related">${pages.filter(p => p !== page).map(p => `<li><a href="/${p.slug}/">${esc(p.short)}${icon.arrow}</a></li>`).join("")}</ul></div></section>`;
}

function render(page, css) {
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url(page)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#141417">
<meta name="geo.region" content="IN-MH">
<meta name="geo.placename" content="Andheri West, Mumbai">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AVITA Technologies">
<meta property="og:locale" content="en_IN">
<meta property="og:url" content="${url(page)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${site}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/space-grotesk-bold.ttf" as="font" type="font/ttf" crossorigin>
${css.map(href => `<link rel="stylesheet" href="${href}">`).join("\n")}
<script type="application/ld+json">
${schema(page)}
</script>
</head>
<body id="top" class="pg-body">
<a href="#main" class="skip-link">Skip to content</a>
${header}
<main id="main">
${body(page)}
</main>
${footer}
</body>
</html>
`;
}

const indexHtml = readFileSync(join(dist, "index.html"), "utf8");
const siteCss = [...indexHtml.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m => m[1]);
if (!siteCss.length) throw new Error("Could not find the built stylesheet in dist/index.html");
const pageCss = readFileSync(join(root, "scripts/pages.css"), "utf8");
const pageCssName = `/assets/pages-${createHash("sha256").update(pageCss).digest("hex").slice(0, 10)}.css`;
writeFileSync(join(dist, pageCssName), pageCss);

for (const page of [hub, ...pages]) {
  const file = join(dist, page.slug, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page, [...siteCss, pageCssName]));
}

const urls = [{ loc: `${site}/`, priority: "1.0" }, { loc: url(hub), priority: "0.9" }, ...pages.map(page => ({ loc: url(page), priority: page.local ? "0.9" : "0.8" }))];
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`);
console.log(`Generated ${pages.length + 1} pages and sitemap.xml (${urls.length} URLs).`);
