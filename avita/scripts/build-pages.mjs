// Generates the static service and location pages into dist/ after `vite build`.
// Each page is plain HTML (no JavaScript needed), so search engines read the full content,
// and it reuses the site's built stylesheet and home page components so it looks like the rest of the site.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const site = "https://avitatechnologies.com";
const today = new Date().toISOString().slice(0, 10);
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const phone = { display: "+91 91301 53071", tel: "+919130153071", schema: "+91-9130153071" };
const email = "contact@avitatechnologies.com";
const whatsapp = "https://wa.me/919130153071";
const maps = "https://www.google.com/maps/search/?api=1&query=Plot+No+49+Manish+Nagar+Andheri+West+Mumbai+400053";
const address = { street: "Plot No. 49, Manish Nagar, Andheri West", city: "Mumbai", region: "Maharashtra", postal: "400053" };

// `preview` picks the same mock-up the home page uses for that project (browser window, phones or the export app).
const work = {
  jg: { name: "Jaikvin Global", kind: "Export operations platform", text: "A full-stack web app that runs an export business end to end and generates 40+ customs and shipping papers as PDF, Excel and Word from one shipment record. In production, now on v7.3.", tags: "React / FastAPI / PostgreSQL · In production", href: "/#work", cta: "See the case study", preview: "automation" },
  amishna: { name: "Amishna Music", kind: "Company website", text: "A premium, fully responsive website for a music publishing and royalty management company, built to explain a complex service and earn trust at first glance.", tags: "React / Vite · Live", href: "https://amishnamusic.com/", cta: "Visit amishnamusic.com", preview: "web", dir: "amishna", address: "amishnamusic.com", ghost: "03" },
  space: { name: "AVITA.TECH", kind: "Immersive 3D website", text: "A studio website where scrolling becomes a space flight, with a real-time 3D Earth and eight planets rendered live in the browser with Three.js.", tags: "React / Three.js · Live", href: "https://avitagraphics.netlify.app/", cta: "Visit the live site", preview: "platform", dir: "space", address: "avitagraphics.netlify.app", ghost: "02" },
  myhisab: { name: "My Hisab", kind: "Money tracking app", text: "An installable mobile-first app for daily money: balance across UPI, bank and cash, a searchable ledger, borrowed and lent, and savings goals.", tags: "React / Next.js · PWA · Live", href: "https://money-dun-seven.vercel.app/", cta: "Open My Hisab", preview: "app", dir: "myhisab", screens: ["Overview", "Ledger"] },
  thali: { name: "Thali", kind: "Calorie and macro tracker", text: "A mobile-first tracker for Indian food with daily targets from BMR and TDEE, week and month charts, streaks and a weight trend.", tags: "React / Next.js · Recharts · Live", href: "https://thali-eight.vercel.app/", cta: "Open Thali", preview: "app", dir: "thali", screens: ["Today", "Week"] },
};

// Papers the export platform generates from one shipment record, as on the home page.
const papers = [["PDF", "Commercial invoice"], ["XLSX", "Packing list"], ["DOCX", "VGM declaration"], ["PDF", "Shipping bill"], ["XLSX", "Export value declaration"], ["PDF", "Proforma invoice"], ["DOCX", "Bank letter"], ["PDF", "Certificate of origin"]];
const paper = ([kind, name], extra = "") => `<span class="pv-paper pv-paper-${kind.toLowerCase()}${extra}"><b>${kind}</b>${name}</span>`;

// Example data for the AI and data page: the same few rows, messy, then cleaned.
const rawRows = [["meridian polymers", "98", "₹1,200"], ["Meridian Polymers ", "ninety", "1200 rs", "dup"], ["BluePeak", "", "N/A", "gap"], ["Northstar Mat.", "115", "₹ 6,900.00"]];
const cleanRows = [["Meridian Polymers", "188", "₹2,400"], ["BluePeak Plastics", "Needs review", "—", "flag"], ["Northstar Materials", "115", "₹6,900"]];
const bars = [["Meridian", 72], ["Northstar", 44], ["Crestline", 88], ["BluePeak", 30]];
const table = (rows, head = ["Supplier", "Boxes", "Amount"]) => `<table><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(([a, b, c, mark]) => `<tr${mark ? ` class="pv-${mark}"` : ""}><td>${esc(a)}</td><td>${esc(b) || "<em>empty</em>"}</td><td>${esc(c)}</td></tr>`).join("")}</tbody></table>`;
const chart = () => `<div class="pv-bars">${bars.map(([name, value], i) => `<span style="--v:${value}%;--i:${i}"><i></i><small>${name}</small></span>`).join("")}</div>`;

// Neighbourhoods around the studio, placed roughly as on a map of the western suburbs (x, y in %).
const areas = [["Goregaon", 70, 8], ["Jogeshwari", 66, 26], ["Lokhandwala", 30, 30], ["Versova", 12, 46], ["Andheri East", 82, 56], ["Juhu", 22, 78], ["Vile Parle", 62, 86]];

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
    service: "Website design and development", promise: ["Built properly,", "from the first", "screen."], visual: "web", feature: "anatomy",
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
    service: "Mobile app development", promise: ["Apps people", "actually keep", "using."], visual: "apps", feature: "install",
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
    service: "Custom software development", promise: ["Software shaped", "around how you", "work."], visual: "system", feature: "before",
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
    service: "Business process automation", promise: ["Type it once.", "Use it", "everywhere."], visual: "burst", feature: "pipeline",
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
    service: "Cloud and DevOps services", promise: ["Releases that", "feel routine,", "not risky."], visual: "deploy", feature: "release",
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
    service: "AI and data solutions", promise: ["Scattered data,", "clear", "decisions."], visual: "insight", feature: "clean",
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
    service: "Software development", promise: ["Your software", "partner, close", "to home."], visual: "map", feature: "nearby",
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
  work: ["jg", "myhisab", "space", "amishna"], visual: "orbit",
  stack: ["Websites", "Mobile apps", "Custom software", "Automation", "Cloud", "AI & data"],
  hub: true,
};

const svg = (size, paths, width = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const icon = {
  arrow: svg(18, '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>'),
  arrowSmall: svg(13, '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>'),
  arrowBig: svg(25, '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>'),
  down: svg(16, '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>'),
  check: svg(18, '<path d="M20 6 9 17l-5-5"/>', 2.2),
  chat: svg(18, '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),
  pin: svg(15, '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>'),
  mail: svg(18, '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  phone: svg(18, '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  globe: svg(10, '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
  asterisk: svg(16, '<path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/>'),
  asteriskThin: svg(60, '<path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/>', 1.3),
  lock: svg(15, '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  sparkle: svg(14, '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'),
  menu: svg(20, '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>'),
  close: svg(20, '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  phoneDevice: svg(15, '<rect width="12" height="20" x="6" y="2" rx="2"/><path d="M12 18h.01"/>'),
  tablet: svg(15, '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M12 18h.01"/>'),
  monitor: svg(15, '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>'),
};
const brand = (color = "#f1f0eb") => `<svg class="brand-mark" viewBox="0 0 132 50" role="img" aria-label="AVITA Technologies"><g fill="none" stroke="${color}" stroke-width="3.1" stroke-linecap="square" stroke-linejoin="miter"><path d="M4 33 17 7 30 33M10 24h14M35 8l11 25L57 8M64 11v22M73 8h22M84 9v24M99 33l13-26 13 26M105 24h14"/></g><path d="m112 7 13 26h-4L112 15z" fill="#b8a4ff"/><path d="M62.5 12v12" stroke="#b8a4ff" stroke-width="3.1"/><circle cx="64" cy="5" r="2.4" fill="#b8a4ff"/><text x="6" y="46" fill="${color}" font-family="Arial, sans-serif" font-size="5.3" font-weight="600" letter-spacing="3.2">TECHNOLOGIES</text></svg>`;
const esc = text => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = page => `${site}/${page.slug}/`;
const external = href => href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";
const pad = n => String(n).padStart(2, "0");
// The last word of a headline is set in the site's serif italic, like "Built differently." on the home page.
const accent = text => text.replace(/(\S+)$/, '<em class="serif-word">$1</em>');

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

const navigation = [["Home", "/"], ["Studio", "/#about"], ["Services", "/services/"], ["Work", "/#work"], ["Contact", "/#contact"]];
const header = page => `<header class="site-header header-scrolled page-header"><div class="container header-inner">
  <a class="brand-link" href="/" aria-label="AVITA Technologies home">${brand()}</a>
  <nav class="desktop-navigation" aria-label="Main navigation">${navigation.map(([label, href], i) => `<a href="${href}"${label === "Services" && page.slug.startsWith("services") ? ' aria-current="page"' : ""}><span class="nav-index" aria-hidden="true">0${i + 1}</span>${label}</a>`).join("")}</nav>
  <div class="header-actions"><a class="button" href="/#contact"><span>Let’s talk</span><span class="button-icon">${icon.arrow}</span></a>
    <details class="pg-menu"><summary class="menu-trigger" aria-label="Menu">${icon.menu}${icon.close}</summary>
      <div class="pg-menu-panel"><p class="eyebrow">IDEAS. ENGINEERING. REAL IMPACT.</p>
        <nav aria-label="Mobile navigation">${navigation.map(([label, href], i) => `<a href="${href}"><span><small>0${i + 1}</small>${label}</span>${icon.arrow}</a>`).join("")}</nav>
        <p class="eyebrow">SERVICES</p><ul class="pg-menu-services">${pages.map(p => `<li><a href="/${p.slug}/">${esc(p.short)}</a></li>`).join("")}</ul>
        <a class="button" href="${whatsapp}" target="_blank" rel="noreferrer"><span>Chat on WhatsApp</span><span class="button-icon">${icon.chat}</span></a>
      </div></details></div>
</div></header>`;

const footerWork = [["Jaikvin Global", "/#work"], ["My Hisab", work.myhisab.href], ["Thali", work.thali.href], ["AVITA.TECH", work.space.href], ["Amishna Music", work.amishna.href]];
const footer = `<footer class="site-footer"><div class="container">
  <div class="footer-cta">
    <div><p class="footer-status"><i></i>AVAILABLE FOR NEW PROJECTS</p><h2 class="footer-headline">Have an idea?<br>Let’s build it <span class="serif-word">together.</span></h2></div>
    <div class="footer-cta-actions"><a class="button" href="/#contact">Start a project<span class="button-icon">${icon.arrow}</span></a><a class="footer-whatsapp" href="${whatsapp}" target="_blank" rel="noreferrer">${icon.chat}Chat on WhatsApp</a></div>
  </div>
  <div class="footer-grid">
    <div class="footer-brand"><a href="/" class="brand-link" aria-label="AVITA Technologies home">${brand()}</a><p>Independent minds.<br>Extraordinary possibilities.</p><p class="footer-origin">${icon.pin}Andheri West, Mumbai, India</p></div>
    <nav class="footer-explore" aria-label="Footer"><p class="footer-title">EXPLORE</p><ul>${navigation.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul></nav>
    <div class="footer-capabilities"><p class="footer-title">SERVICES</p><ul>${pages.map(p => `<li><a href="/${p.slug}/">${esc(p.short)}</a></li>`).join("")}</ul></div>
    <div class="footer-work"><p class="footer-title">SELECTED WORK</p><ul>${footerWork.map(([l, h]) => `<li><a href="${h}"${external(h)}>${l}${h.startsWith("http") ? icon.arrowSmall : ""}</a></li>`).join("")}</ul></div>
    <div class="footer-contact"><p class="footer-title">CONTACT</p><ul><li><a href="mailto:${email}"><span>${email}</span></a></li><li><a href="tel:${phone.tel}"><span>${phone.display}</span></a></li><li><a href="${whatsapp}" target="_blank" rel="noreferrer"><span>WhatsApp</span></a></li><li><a href="${maps}" target="_blank" rel="noreferrer" class="footer-address"><span>Plot No. 49, Manish Nagar,<br>Andheri West, Mumbai 400053</span></a></li></ul></div>
  </div>
  <div class="footer-bottom"><p>© ${today.slice(0, 4)} AVITA TECHNOLOGIES · RDJ &amp; SMK<span class="footer-version">v${version}</span></p><p>IDEAS. ENGINEERING. REAL IMPACT.</p><a class="back-top" href="#top">Back to top<span>${icon.arrow}</span></a></div>
</div></footer>`;

// Small illustrations for the services hub cards, one per service page.
const minis = {
  web: '<span class="pv-mini pv-mini-web"><i></i><i></i><i></i><b></b></span>',
  apps: '<span class="pv-mini pv-mini-apps"><i></i><i></i></span>',
  system: '<span class="pv-mini pv-mini-system"><b></b><i></i><i></i><i></i><i></i></span>',
  burst: '<span class="pv-mini pv-mini-burst"><b></b><i></i><i></i><i></i><i></i><i></i></span>',
  deploy: '<span class="pv-mini pv-mini-deploy"><i></i><i></i><i></i><i></i></span>',
  insight: '<span class="pv-mini pv-mini-insight"><i style="--v:55%"></i><i style="--v:80%"></i><i style="--v:40%"></i><i style="--v:95%"></i></span>',
};

// Section furniture shared by every page: the numbered label row and a heading with a short note beside it.
const top = (n, label, note) => `<div class="pg-top"><p class="eyebrow section-label"><span class="section-number">${pad(n)}</span><span>${label}</span></p><p class="pg-top-note">${note}</p></div>`;
const heading = (title, note) => `<div class="pg-heading pg-reveal"><h2>${title}</h2><p class="body-copy">${note}</p></div>`;

const dots = '<span class="window-dots"><i></i><i></i><i></i></span>';
const browser = (address, src, extra = "", w = 1600, h = 900) => `<div class="site-window ${extra}"><div class="preview-toolbar">${dots}<span class="site-address">${icon.globe}${address}</span><span>•••</span></div><div class="site-viewport"><img src="${src}" alt="" width="${w}" height="${h}" decoding="async"></div></div>`;

// Hero artwork. Every page gets its own scene; pages without one keep the home page sculpture.
const visuals = {
  sculpture: (page, index) => `<span class="pg-orbit"><i></i></span><span class="pg-orbit pg-orbit-two"><i></i></span>
      <img class="pg-sculpture" src="/artwork/hero-sculpture-v3.webp" alt="" width="1254" height="1254" fetchpriority="high">
      <span class="pg-chip pg-chip-a"><i></i>AVAILABLE FOR NEW PROJECTS</span>
      <span class="pg-chip pg-chip-b">${icon.pin}Andheri West, Mumbai</span>
      <span class="pg-chip pg-chip-c">${page.stack.slice(0, 3).map(s => `<b>${esc(s)}</b>`).join("<i></i>")}</span>
      <p class="scene-coordinate pg-coordinate">AV / ${pad(index)}<br>${esc(page.short.toUpperCase())}</p>`,
  // A site we built on desktop and on a phone, with this page's own search markup typed out beside it.
  web: page => `<div class="pv-stage">
      ${browser("avitagraphics.netlify.app", "/work/space/01.webp", "pv-win-back")}
      ${browser("amishnamusic.com", "/work/amishna/01.webp", "pv-win-front")}
      <div class="app-phone pv-phone"><div class="app-screen"><img src="/work/amishna/mobile.webp" alt="" width="540" height="1169" decoding="async"></div></div>
      <div class="pv-code"><p>${dots}<span>index.html</span></p><pre><code><b>&lt;title&gt;</b>${esc(page.title.split(" | ")[0])}<b>&lt;/title&gt;</b>
<b>&lt;meta</b> <i>name</i>=<u>"description"</u> <b>/&gt;</b>
<b>&lt;link</b> <i>rel</i>=<u>"canonical"</u> <b>/&gt;</b>
{ <i>"@type"</i>: <u>"ProfessionalService"</u>,
  <i>"areaServed"</i>: <u>"Mumbai"</u> }<s></s></code></pre></div>
      <span class="pg-chip pv-chip-devices">${icon.phoneDevice}${icon.tablet}${icon.monitor}<span>Responsive on every screen</span></span>
      <span class="pg-chip pv-chip-live"><i></i>LIVE · amishnamusic.com</span>
    </div>`,
  // Our two live apps on phones, with the browser's install prompt that makes them home screen apps.
  apps: () => `<div class="pv-stage">
      <span class="pv-app-glow"></span>
      <div class="app-phone app-myhisab pv-app-a"><div class="app-screen"><img src="/work/myhisab/01.webp" alt="" width="720" height="1600" decoding="async"></div><span class="app-tag"><i></i>My Hisab<small>Money, at a glance</small></span></div>
      <div class="app-phone app-thali pv-app-b"><div class="app-screen"><img src="/work/thali/01.webp" alt="" width="720" height="2023" decoding="async"></div><span class="app-tag"><i></i>Thali<small>Calories &amp; macros</small></span></div>
      <div class="pv-install-card"><span class="pv-icon pv-icon-hisab">₹</span><span><strong>Install My Hisab</strong><small>money-dun-seven.vercel.app</small></span><b>Install</b></div>
      <span class="pg-chip pv-chip-os">${icon.phoneDevice}<span>Android + iPhone</span><i></i><span>one codebase</span></span>
      <span class="pg-chip pv-chip-pwa"><i></i>INSTALLABLE PWA</span>
    </div>`,
  // One real system in the middle, with the modules it brings together wired into it.
  system: () => {
    const modules = [["Purchase orders", "13 open"], ["Shipments", "8 invoices"], ["Documents", "PDF · Excel · Word"], ["Reports", "live"], ["Roles", "audit log"], ["Setup", "no code"]];
    return `<div class="pv-stage">
      <svg class="pv-wires" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M14 10 C 22 14, 26 20, 30 26"/><path d="M84 6 C 80 14, 76 18, 72 24"/><path d="M92 58 C 90 58, 89 58, 86 58"/><path d="M16 92 C 22 86, 26 82, 30 78"/><path d="M80 94 C 76 88, 72 84, 68 78"/></svg>
      <div class="pv-system-window"><div class="preview-toolbar">${dots}<span>Jaikvin Global / <b>Dashboard</b></span><span class="jg-live"><i></i>IN PRODUCTION</span></div><img src="/work/jg/02.webp" alt="" width="2400" height="1334" decoding="async"></div>
      ${modules.map(([name, note], i) => `<span class="pv-module pv-module-${i + 1}"><i></i><b>${name}</b><small>${note}</small></span>`).join("")}
    </div>`;
  },
  // One shipment record in the middle, fanning out into the papers generated from it.
  burst: () => `<div class="pv-stage">
      <svg class="pv-rays" viewBox="0 0 100 100" preserveAspectRatio="none">${papers.map((_, i) => { const a = i / papers.length * Math.PI * 2 - Math.PI / 2; return `<path d="M50 50 L${(50 + Math.cos(a) * 37).toFixed(1)} ${(50 + Math.sin(a) * 42).toFixed(1)}" style="--i:${i}"/>`; }).join("")}</svg>
      ${papers.map((p, i) => { const a = i / papers.length * Math.PI * 2 - Math.PI / 2; return paper(p, `" style="--i:${i};left:${(50 + Math.cos(a) * 37).toFixed(1)}%;top:${(50 + Math.sin(a) * 42).toFixed(1)}%`); }).join("")}
      <div class="pv-record"><p><span>SHIPMENT RECORD</span><b>INV-26-59382</b></p>
        <dl><div><dt>Buyer</dt><dd>Blue Harbor Trading</dd></div><div><dt>Boxes</dt><dd>2,000</dd></div><div><dt>Volume</dt><dd>120.000 m³</dd></div><div><dt>Port</dt><dd>Nhava Sheva</dd></div></dl>
        <span class="pv-generate">Generate all papers${icon.arrowSmall}</span>
      </div>
      <span class="pv-count"><strong>40+</strong><span>papers from<br>one record</span></span>
    </div>`,
  // A deploy running in a terminal, one step at a time, ending live.
  deploy: () => {
    const lines = [["$", "git push origin main"], ["✓", "Install dependencies"], ["✓", "Type check and tests"], ["✓", "Production build"], ["✓", "Docker image built"], ["✓", "Database migrations applied"], ["✓", "Deployed behind HTTPS"], ["●", "Live in production"]];
    return `<div class="pv-stage">
      <div class="pv-term"><p>${dots}<span>deploy — production</span></p><ol>${lines.map(([mark, text], i) => `<li style="--i:${i}"><b>${mark}</b>${text}</li>`).join("")}</ol></div>
      <div class="pv-status"><p><i></i>All systems normal</p>${[["Web", "HTTPS · CDN"], ["API", "Docker · nginx"], ["Database", "PostgreSQL"]].map(([k, v]) => `<span><b>${k}</b><small>${v}</small><i></i></span>`).join("")}</div>
      <span class="pg-chip pv-chip-lock">${icon.lock}<span>HTTPS · security headers</span></span>
    </div>`;
  },
  // Messy rows flowing into a clean dashboard, with a question asked of the data.
  insight: () => `<div class="pv-stage">
      <div class="pv-sheet-raw">${table(rawRows)}</div>
      <div class="pv-dash"><p><span>Boxes by supplier</span><b>This month</b></p>
        <div class="pv-kpis"><span><small>Total boxes</small><strong>4,548</strong></span><span><small>Open orders</small><strong>13</strong></span></div>
        ${chart()}
      </div>
      <div class="pv-ask"><p class="pv-ask-label">${icon.sparkle}EXAMPLE · ASK YOUR DATA</p><p class="pv-q">Which supplier has the most boxes pending?</p><p class="pv-a">Crestline, with 3,218 boxes across open orders.<s></s></p></div>
    </div>`,
  // A simple map of the western suburbs with the studio pinned in Andheri West.
  map: () => `<div class="pv-stage">
      <div class="pv-mapbox">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path class="pv-sea" d="M0 0 H14 C 10 18, 6 30, 9 44 S 4 70, 12 84 S 10 96, 8 100 H0 Z"/><path class="pv-road" d="M74 0 C 72 30, 76 60, 72 100"/><path class="pv-rail" d="M56 0 C 54 34, 58 66, 55 100"/><path class="pv-road" d="M30 0 C 34 30, 28 62, 34 100"/></svg>
        <span class="pv-map-sea">ARABIAN SEA</span><span class="pv-map-line pv-map-rail">WESTERN LINE</span><span class="pv-map-line pv-map-wexp">W. EXPRESS HWY</span>
        <span class="pv-rings"><i></i><i></i><i></i></span>
        ${areas.map(([name, x, y]) => `<span class="pv-area" style="left:${x}%;top:${y}%"><i></i>${name}</span>`).join("")}
        <span class="pv-studio"><span class="pv-studio-pin"><i></i></span><b>AVITA Technologies</b><small>Manish Nagar, Andheri West</small></span>
        <span class="pv-scale">MAP NOT TO SCALE</span>
      </div>
      <div class="pv-address"><span class="contact-icon">${icon.pin}</span><span><small>VISIT US</small><strong>Plot No. 49, Manish Nagar,<br>Andheri West, Mumbai 400053</strong></span></div>
    </div>`,
  // The services hub: the sculpture with every service circling it.
  orbit: () => `<span class="pg-orbit"><i></i></span><span class="pg-orbit pg-orbit-two"><i></i></span>
      <img class="pg-sculpture" src="/artwork/hero-sculpture-v3.webp" alt="" width="1254" height="1254" fetchpriority="high">
      <div class="pv-orbit-ring">${services.map((p, i) => `<span style="--a:${i * 60}deg"><b>${pad(i + 1)}</b>${esc(p.short)}</span>`).join("")}</div>`,
};

// Signature sections: one per page, about the thing that page sells.
const features = {
  anatomy: (page, n) => {
    const pin = n => `<span class="pv-pin pv-pin-${n}">${n}</span>`;
    const parts = [["A clear message, instantly", "Visitors understand what you do and who it is for within seconds of landing."], ["Designed for phones first", "Layouts that read beautifully on a phone, then scale up to tablets and desktops."], ["Fast by default", "Modern image formats, lazy loading and lean code, so pages open quickly on any network."], ["Ready for Google", "Page titles, descriptions, structured data and a sitemap, set up before launch."], ["One obvious next step", "Enquiry and WhatsApp buttons exactly where people look for them."]];
    return `<section class="pg-section pg-dark"><div class="container">${top(n, "WHAT GOES INTO EVERY SITE", "THE ANATOMY OF A GOOD WEBSITE")}
  ${heading(`Small details.<br>Big <em class="serif-word">difference.</em>`, "Five things every AVITA website gets right before it goes live. Hover a point to see where it lives on the page.")}
  <div class="pv-anatomy pg-reveal">
    <div class="pv-browser" aria-hidden="true">
      <div class="preview-toolbar">${dots}<span class="site-address">${icon.globe}yourbusiness.com</span><span>•••</span></div>
      <div class="pv-wire">
        <div class="pv-wire-nav"><i class="pv-logo"></i><span><i></i><i></i><i></i><i></i></span><b></b></div>
        <div class="pv-wire-hero"><div class="pv-wire-copy">${pin(1)}<i class="pv-h"></i><i class="pv-h pv-short"></i><i class="pv-p"></i><i class="pv-p pv-short"></i><b class="pv-cta">${pin(5)}</b></div><div class="pv-wire-img">${pin(3)}<span class="pv-img-label">WEBP · LAZY</span></div></div>
        <div class="pv-wire-cards"><i></i><i></i><i></i></div>
      </div>
      <div class="pv-mini-phone">${pin(2)}<i class="pv-h"></i><i class="pv-p"></i><i class="pv-p pv-short"></i><b class="pv-cta"></b><i class="pv-img"></i></div>
      <span class="pv-tag">${pin(4)}&lt;title&gt; · schema · sitemap.xml</span>
    </div>
    <ol class="pv-parts">${parts.map(([t, d], i) => `<li class="pv-part-${i + 1}"><span>${pad(i + 1)}</span><div><strong>${t}</strong><p>${d}</p></div></li>`).join("")}</ol>
  </div>
</div></section>`;
  },
  // Custom software: the same business before and after one system.
  before: (page, n) => `<section class="pg-section pg-dark"><div class="container">${top(n, "BEFORE AND AFTER", "ONE BUSINESS / ONE SYSTEM")}
  ${heading(`From five spreadsheets<br>to one <em class="serif-word">system.</em>`, "What changed for an export business when its spreadsheets, copy-paste and paperwork became one piece of software.")}
  <div class="pv-compare">
    <article class="pv-side pv-before pg-reveal"><p class="pv-side-label"><i></i>BEFORE</p>
      <div class="pv-mess" aria-hidden="true">
        <span class="pv-file pv-xls"><b>XLS</b>orders_final_v3.xlsx</span>
        <span class="pv-file pv-doc"><b>DOC</b>invoice copy (2).docx</span>
        <span class="pv-file pv-xls"><b>XLS</b>packing list OLD.xlsx</span>
        <span class="pv-file pv-pdf"><b>PDF</b>scan_0193.pdf</span>
        <span class="pv-bubble">Which rate is the latest one?</span>
        <span class="pv-note">re-check the totals!!</span>
      </div>
      <ul>${["The same figure typed into many files", "Nobody sure which copy is the latest", "Hours of paperwork for every shipment"].map(t => `<li>${icon.close}${t}</li>`).join("")}</ul>
    </article>
    <span class="pv-compare-arrow" aria-hidden="true">${icon.arrowBig}</span>
    <article class="pv-side pv-after pg-reveal" style="--d:1"><p class="pv-side-label"><i></i>AFTER</p>
      <div class="pv-clean" aria-hidden="true"><div class="preview-toolbar">${dots}<span>Jaikvin Global / <b>Purchase Orders</b></span><span>•••</span></div><img src="/work/jg/04.webp" alt="" width="2400" height="1334" loading="lazy" decoding="async"></div>
      <ul>${["Every figure entered once, used everywhere", "One source of truth, with roles for each person", "40+ papers generated from a single record"].map(t => `<li>${icon.check}${t}</li>`).join("")}</ul>
    </article>
  </div>
</div></section>`,
  // Business automation: one record, your rules, every document, and the time it gives back.
  pipeline: (page, n) => `<section class="pg-section pg-dark"><div class="container">${top(n, "HOW THE AUTOMATION RUNS", "ENTER ONCE / USE EVERYWHERE")}
  ${heading(`Hours of paperwork,<br>now one <em class="serif-word">click.</em>`, "The figures your team already types become the single source for every document, in the layouts your customers, banks and agents expect.")}
  <ol class="pv-pipe">
    <li class="pg-reveal"><span class="pv-pipe-num">01</span><h3>Enter once</h3><p>Your team fills in one record. Nothing is retyped anywhere else.</p>
      <div class="pv-pipe-card" aria-hidden="true">${[["Buyer", "Blue Harbor Trading"], ["Boxes", "2,000"], ["Volume", "120.000 m³"], ["Port", "Nhava Sheva"]].map(([k, v]) => `<p><span>${k}</span><b>${v}</b></p>`).join("")}</div></li>
    <li class="pg-reveal" style="--d:1"><span class="pv-pipe-num">02</span><h3>Your rules</h3><p>Admins set sequences, columns and terms from a settings screen, no code needed.</p>
      <div class="pv-pipe-card" aria-hidden="true">${["Item sequence", "Report columns", "Terms of delivery", "Document layouts"].map((t, i) => `<p><span>${t}</span><i class="pv-toggle${i === 2 ? "" : " on"}"></i></p>`).join("")}</div></li>
    <li class="pg-reveal" style="--d:2"><span class="pv-pipe-num">03</span><h3>Every document</h3><p>Invoices, packing lists and declarations, generated as PDF, Excel or Word.</p>
      <div class="pv-pipe-card pv-pipe-docs" aria-hidden="true">${papers.slice(0, 5).map(p => paper(p)).join("")}</div></li>
  </ol>
  <div class="pv-time pg-reveal"><p class="eyebrow">TIME PER SHIPMENT</p>
    <div class="pv-bar pv-bar-before"><span>Manual Excel and Word work</span><i></i><b>Hours</b></div>
    <div class="pv-bar pv-bar-after"><span>With the export platform</span><i></i><b>One click</b></div>
  </div>
</div></section>`,
  // Cloud and DevOps: commit to live, and the security basics this very site ships with.
  release: (page, n) => {
    const stages = [["Commit", "Code is pushed to the repository."], ["Build and test", "Every change is built and checked automatically."], ["Package", "Docker makes it run the same everywhere."], ["Deploy", "Released to modern hosting behind HTTPS."], ["Monitor", "Uptime and errors watched after launch."]];
    // The site-wide block of public/_headers: the first rule, up to the first blank line.
    const headers = readFileSync(join(root, "public/_headers"), "utf8").split("\n\n")[0].split("\n").slice(1).map(line => line.trim());
    return `<section class="pg-section pg-dark"><div class="container">${top(n, "FROM COMMIT TO LIVE", "RELEASES WITHOUT DRAMA")}
  ${heading(`Push the code.<br>We handle the <em class="serif-word">rest.</em>`, "An automated path from a code change to production, so releases are small, frequent and easy to undo.")}
  <ol class="pv-stages pg-reveal">${stages.map(([t, d], i) => `<li style="--i:${i}"><span class="pv-light"></span><span class="pv-stage-num">${pad(i + 1)}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol>
  <div class="pv-secure pg-reveal">
    <div><p class="eyebrow">SECURITY BASICS, DONE RIGHT</p><h3>The same care, <em class="serif-word">on this site.</em></h3><p class="body-copy">These are the real security headers avitatechnologies.com is served with. Your project gets the same, plus rate limiting, safe secrets and role-based access where it needs them.</p></div>
    <div class="pv-headers"><p>${dots}<span>_headers</span></p><pre><code>${headers.map(line => { const [k, ...v] = line.split(": "); return `<b>${esc(k)}</b>: <u>${esc(v.join(": "))}</u>`; }).join("\n")}</code></pre></div>
  </div>
</div></section>`;
  },
  // AI and data: raw rows, cleaned rows, then a dashboard, and how AI is used.
  clean: (page, n) => `<section class="pg-section pg-dark"><div class="container">${top(n, "MESSY IN, CLEAR OUT", "FROM SPREADSHEETS TO DECISIONS")}
  ${heading(`Messy in.<br>Clear <em class="serif-word">out.</em>`, "Most businesses already have the data they need. It is just spread across files, typed in different ways. We fix that first.")}
  <ol class="pv-transform">
    <li class="pg-reveal"><p class="pv-t-label"><span>01</span>Raw data</p><div class="pv-t-card" aria-hidden="true">${table(rawRows)}</div><p>Duplicates, typos, blanks and three ways of writing the same amount.</p></li>
    <li class="pg-reveal" style="--d:1"><p class="pv-t-label"><span>02</span>Cleaned and structured</p><div class="pv-t-card pv-cleaned" aria-hidden="true">${table(cleanRows)}</div><p>Merged, standardised and checked, with anything unclear flagged for a person.</p></li>
    <li class="pg-reveal" style="--d:2"><p class="pv-t-label"><span>03</span>Live dashboard</p><div class="pv-t-card" aria-hidden="true">${chart()}</div><p>Numbers you can act on, updated as new data comes in.</p></li>
  </ol>
  <ul class="pv-facts pg-reveal">${["Your data is only used for your business", "AI assists, people stay in control", "Works with the documents and data you already have"].map(f => `<li>${icon.check}${f}</li>`).join("")}</ul>
</div></section>`,
  // Local page: the areas around the studio and the ways to work together.
  nearby: (page, n) => `<section class="pg-section pg-dark"><div class="container">${top(n, "AREAS WE SERVE", "ANDHERI WEST / MUMBAI 400053")}
  ${heading(`Close by.<br>Easy to <em class="serif-word">meet.</em>`, "Being in Andheri West means a short trip for most of the western suburbs, and we work with clients across Mumbai and India too.")}
  <div class="pv-nearby">
    <ul class="pv-areas pg-reveal">${["Andheri West", "Andheri East", "Juhu", "Versova", "Lokhandwala", "Jogeshwari", "Goregaon", "Vile Parle", "Across Mumbai", "Across India"].map((a, i) => `<li${i === 0 ? ' class="is-home"' : i > 7 ? ' class="is-wide"' : ""}>${i === 0 ? icon.pin : ""}${a}</li>`).join("")}</ul>
    <div class="pv-ways pg-reveal" style="--d:1">
      ${[["Meet in person", "Talk through your idea face to face at our studio or near you, wherever it helps."], ["Work remotely", "Clear updates, shared previews and quick calls for clients anywhere in India."], ["One team throughout", "The people you meet are the people who design, build and support your product."]].map(([t, d], i) => `<div class="pv-way"><span>${pad(i + 1)}</span><div><strong>${t}</strong><p>${d}</p></div></div>`).join("")}
      <a class="button" href="${maps}" target="_blank" rel="noreferrer"><span>Get directions</span><span class="button-icon">${icon.arrow}</span></a>
    </div>
  </div>
</div></section>`,
  // Mobile apps: how an installable web app goes from a link to the home screen.
  install: (page, n) => {
    const steps = [["Open the link", "Share a link by WhatsApp, email or a QR code. The app opens instantly in the browser, nothing to download first."], ["Add to Home screen", "One tap on the install prompt and the app is saved to the phone, with its own icon and name."], ["Tap and go", "It opens full screen like any other app, and every update reaches users the next time they open it."]];
    const screen = '<img src="/work/myhisab/01.webp" alt="" width="720" height="1600" loading="lazy" decoding="async">';
    const phones = [
      `<div class="pv-mock-bar">${icon.globe}money-dun-seven.vercel.app</div><div class="pv-mock-screen">${screen}</div>`,
      `<div class="pv-mock-bar">${icon.globe}money-dun-seven.vercel.app</div><div class="pv-mock-screen pv-dim">${screen}</div><div class="pv-sheet"><span class="pv-icon pv-icon-hisab">₹</span><strong>My Hisab</strong><small>money-dun-seven.vercel.app</small><b>Add to Home screen</b></div>`,
      `<div class="pv-home"><span class="pv-clock">9:41</span><div class="pv-grid">${Array.from({ length: 16 }, (_, i) => i === 5 ? '<span class="pv-icon pv-icon-hisab pv-ring">₹<small>My Hisab</small></span>' : i === 6 ? '<span class="pv-icon pv-icon-thali">T<small>Thali</small></span>' : "<i></i>").join("")}</div><div class="pv-dock"><i></i><i></i><i></i><i></i></div></div>`,
    ];
    return `<section class="pg-section pg-dark"><div class="container">${top(n, "FROM LINK TO HOME SCREEN", "HOW AN INSTALLABLE APP WORKS")}
  ${heading(`No app store.<br>No <em class="serif-word">waiting.</em>`, "Our apps install straight from the browser on Android and iPhone, then open full screen like any other app on the phone.")}
  <ol class="pv-flow">${steps.map(([t, d], i) => `<li class="pg-reveal" style="--d:${i}"><div class="pv-mock" aria-hidden="true">${phones[i]}</div><span class="pv-flow-num">${pad(i + 1)}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol>
  <ul class="pv-facts pg-reveal">${["One codebase for Android and iPhone", "Updates without waiting for store review", "Its own icon, name and full screen view"].map(f => `<li>${icon.check}${f}</li>`).join("")}</ul>
</div></section>`;
  },
};

function hero(page, index) {
  const crumbs = [["Home", "/"], ...(page.slug.startsWith("services/") ? [["Services", "/services/"]] : []), [page.short, null]];
  return `<section class="pg-hero${page.visual ? " pg-hero-mock" : ""}"><div class="pg-hero-bg" aria-hidden="true"><i class="pg-stars"></i></div>
  <div class="container pg-hero-inner">
    <div class="pg-hero-copy">
      <nav class="pg-crumbs" aria-label="Breadcrumb"><ol>${crumbs.map(([l, h]) => h ? `<li><a href="${h}">${esc(l)}</a></li>` : `<li aria-current="page">${esc(l)}</li>`).join("")}</ol></nav>
      <p class="pg-eyebrow"><span class="status-dot"></span>${page.eyebrow}</p>
      <h1><span class="pg-line"><span>${page.h1[0]}</span></span><span class="pg-line"><span>${accent(page.h1[1])}</span></span></h1>
      <div class="pg-hero-lead"><p>${esc(page.lead)}</p></div>
      <div class="pg-actions"><a class="button" href="/#contact"><span>Start a project</span><span class="button-icon">${icon.arrow}</span></a><a class="pg-ghost" href="${whatsapp}" target="_blank" rel="noreferrer">${icon.chat}Chat on WhatsApp</a></div>
    </div>
    <div class="pg-hero-visual pv-${page.visual ?? "sculpture"}" aria-hidden="true">${(visuals[page.visual] ?? visuals.sculpture)(page, index)}</div>
  </div>
  <div class="container"><div class="hero-bottom">
    <ul class="hero-disciplines"><li><span>01</span>DESIGN</li><li><span>02</span>ENGINEERING</li><li><span>03</span>SUPPORT</li></ul>
    <a class="scroll-link" href="#overview"><span class="scroll-arrow">${icon.down}</span>SCROLL TO EXPLORE</a>
    <div class="hero-bottom-end"><p class="hero-tagline">${icon.asterisk}FORM. FUNCTION. FORWARD.</p></div>
  </div></div>
</section>
<div class="marquee pg-marquee" aria-hidden="true"><div class="marquee-track">${[0, 1, 2, 3].map(() => `<div class="marquee-set">${page.stack.map((s, i) => `<span${i % 2 ? ' class="outline-text"' : ""}>${esc(s.toUpperCase())}</span>${icon.asteriskThin}`).join("")}</div>`).join("")}</div></div>`;
}

function preview(p) {
  const img = (src, w, h) => `<img src="${src}" alt="" width="${w}" height="${h}" loading="lazy" decoding="async">`;
  if (p.preview === "automation") return `<div class="product-preview preview-automation preview-still"><span class="preview-background-type">LESS FRICTION.</span><div class="jg-window jg-main"><div class="preview-toolbar">${dots}<span>Jaikvin Global / <b>Export system</b></span><span>•••</span></div>${img("/work/jg/01.webp", 2400, 1334)}</div></div>`;
  if (p.preview === "app") return `<div class="product-preview preview-apps"><span class="preview-background-type">DAILY HABITS.</span>${p.screens.map((screen, i) => `<div class="app-phone app-${p.dir} app-phone-${i}"><div class="app-screen">${img(`/work/${p.dir}/0${i + 1}.webp`, 720, 1600)}</div><span class="app-tag"><i></i>${esc(p.name)}<small>${screen}</small></span></div>`).join("")}</div>`;
  const win = (shot, extra = "") => `<div class="site-window ${extra}"><div class="preview-toolbar">${dots}<span class="site-address">${icon.globe}${p.address}</span><span>•••</span></div><div class="site-viewport">${img(`/work/${p.dir}/${shot}.webp`, 1600, 900)}</div></div>`;
  return `<div class="product-preview preview-site preview-${p.preview}"><span class="preview-background-type">${p.preview === "web" ? "EVERY STREAM." : "LEAVES ORBIT."}</span>${win(p.ghost, "site-ghost")}${win("01")}</div>`;
}

function project(p, i) {
  const link = `href="${p.href}"${external(p.href)}`;
  return `<article class="project-card pg-reveal">
    <a class="project-image" ${link} aria-label="${esc(p.name)}: ${esc(p.cta)}"><div class="project-visual-inner" aria-hidden="true">${preview(p)}</div><span class="project-open">${icon.arrowBig}<span>EXPLORE</span></span></a>
    <div class="project-info"><p class="project-label"><span>${pad(i + 1)}</span>${esc(p.kind.toUpperCase())}</p><h3><a class="project-title" ${link}>${esc(p.name)}${icon.arrowBig}</a></h3><p class="project-summary">${esc(p.text)}</p><p class="project-tags">${esc(p.name)} · ${esc(p.tags)}</p>
    <div class="project-actions"><a class="project-action${p.href.startsWith("http") ? " project-action-live" : ""}" ${link}>${esc(p.cta)}${icon.arrowSmall}</a></div></div>
  </article>`;
}

const workSection = (page, n) => {
  const projects = page.work.map(key => work[key]);
  return `<section class="pg-section pg-deep"><div class="container">${top(n, "SELECTED WORK", "REAL CLIENT WORK / LIVE")}
  ${heading(`Work we have <em class="serif-word">shipped.</em>`, "Real products, designed and engineered by our team and in use today.")}
  <div class="project-grid pg-projects${projects.length === 1 ? " pg-projects-single" : ""}">${projects.map(project).join("")}</div>
</div></section>`;
};

const processSection = (page, n) => `<section class="pg-section pg-dark"><div class="container">${top(n, "HOW WE WORK", "NO MYSTERY. JUST GOOD WORK.")}
  ${heading(`The way <em class="serif-word">forward.</em>`, "Four clear steps, with working software in your hands early and often.")}
  <div class="process-grid pg-process">${steps.map(([t, d], i) => `<article class="pg-reveal" style="--d:${i}"><span class="process-number">${pad(i + 1)}</span><h3>${t}${icon.arrowBig}</h3><p>${d}</p></article>`).join("")}</div>
  <div class="pg-stack-row pg-reveal"><p class="eyebrow">TECHNOLOGY WE USE</p><ul class="pg-stack">${page.stack.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div>
</div></section>`;

const ctaSection = n => `<section class="contact-section pg-cta"><span class="pg-cta-star" aria-hidden="true">${icon.asteriskThin}</span><div class="container pg-cta-grid">
  <div class="pg-reveal"><p class="eyebrow section-label"><span class="section-number">${pad(n)}</span><span>START A PROJECT</span></p>
    <h2>Got a <em class="serif-word">what if?</em><br>Let’s make it real.</h2>
    <p class="contact-lead">Good things start with a conversation. Tell us what you are building and we will reply with a clear plan and estimate before any work starts.</p>
    <address class="contact-cards">
      <a class="contact-card" href="mailto:${email}"><span class="contact-icon">${icon.mail}</span><span><small>DROP US A LINE</small><strong>${email}</strong></span>${icon.arrow}</a>
      <a class="contact-card" href="${maps}" target="_blank" rel="noreferrer"><span class="contact-icon">${icon.pin}</span><span><small>VISIT US</small><strong>Plot No. 49, Manish Nagar, Andheri West, Mumbai 400053</strong></span>${icon.arrow}</a>
      <a class="contact-card" href="tel:${phone.tel}"><span class="contact-icon">${icon.phone}</span><span><small>LET’S TALK</small><strong>${phone.display}</strong></span>${icon.arrow}</a>
    </address></div>
  <div class="pg-cta-panel pg-reveal" style="--d:1"><p class="eyebrow">WHAT HAPPENS NEXT</p>
    <ol>${[["Tell us the idea", "A message on WhatsApp or email is enough. No forms, no jargon."], ["Get a clear plan", "We reply with scope, timeline and an estimate you can decide on."], ["Watch it come alive", "Design, build and launch in short steps you can see and test."]].map(([t, d], i) => `<li><span>${pad(i + 1)}</span><div><strong>${t}</strong><p>${d}</p></div></li>`).join("")}</ol>
    <a class="button" href="${whatsapp}" target="_blank" rel="noreferrer"><span>Chat on WhatsApp</span><span class="button-icon">${icon.chat}</span></a>
    <a class="pg-cta-alt" href="/#contact">Or send us a project brief${icon.arrowSmall}</a>
  </div>
</div></section>`;

const hubServicesSection = (page, n) => `<section class="pg-section pg-deep" id="overview"><div class="container">${top(n, "WHAT WE DO", "06 DISCIPLINES / ONE TEAM")}
  ${heading(`From <em class="serif-word">what if</em><br>to what’s next.`, "Pick a service to see what is included, the work we have shipped and the questions clients ask most.")}
  <div class="pg-cards">${services.map((p, i) => `<a class="pg-card pg-card-link pg-card-mini pg-reveal" style="--d:${i % 3}" href="/${p.slug}/"><span class="pg-card-top"><span class="pg-card-num">${pad(i + 1)}</span><span class="pg-card-glyph">${icon.arrow}</span></span>${minis[p.visual] ?? ""}<h3>${esc(p.short)}</h3><p>${esc(p.lead)}</p><ul class="svc-card-tags">${p.stack.slice(0, 3).map(s => `<li>${esc(s)}</li>`).join("")}</ul></a>`).join("")}</div>
  ${pages.filter(p => p.local).map(p => `<a class="pg-local pg-reveal" href="/${p.slug}/"><img src="/artwork/about-studio.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async"><span class="pg-local-copy"><small>${p.eyebrow}</small><strong>${esc(p.h1.join(" "))}</strong><span>${esc(p.lead)}</span></span><span class="pg-card-glyph">${icon.arrow}</span></a>`).join("")}
</div></section>`;

const overviewSection = (page, n) => `<section class="pg-section light-section" id="overview"><div class="container">${top(n, "THE APPROACH", `${esc(page.short.toUpperCase())} / ANDHERI WEST`)}
  <div class="pg-overview pg-reveal">
    <h2>${page.promise[0]}<br>${page.promise[1]}<br><span class="pg-accent">${page.promise[2]}<svg class="pg-swoosh" viewBox="0 0 600 30" preserveAspectRatio="none" aria-hidden="true"><path d="M4 21C120 7 262 3 382 11s176 13 214 1" pathLength="1"/></svg></span></h2>
    <div class="pg-story"><p class="large-copy">${esc(page.intro[0])}</p><p class="body-copy">${esc(page.intro[1])}</p>
      <ul class="pg-stats">${[["05", "", "Products live and in use today"], ["40", "+", "Papers generated from one record for a client"], ["01", "", "Team, from first sketch to deployment"]].map(([n, plus, label]) => `<li><strong>${n}<em>${plus}</em></strong><span>${label}</span></li>`).join("")}</ul>
    </div>
  </div>
</div></section>`;

const offersSection = (page, n) => `<section class="pg-section pg-deep"><div class="container">${top(n, page.local ? "WHAT WE BUILD" : "WHAT WE OFFER", `${pad(page.offers.length)} CAPABILITIES / ONE TEAM`)}
  ${heading(page.local ? `What we <em class="serif-word">build.</em>` : `What we <em class="serif-word">offer.</em>`, "Every part designed and engineered in-house, so what you approve is exactly what gets built.")}
  <ul class="pg-cards">${page.offers.map(([t, d], i) => page.local
    ? `<li class="pg-reveal" style="--d:${i % 3}"><a class="pg-card pg-card-link" href="/${services[i].slug}/"><span class="pg-card-top"><span class="pg-card-num">${pad(i + 1)}</span><span class="pg-card-glyph">${icon.arrow}</span></span><h3>${esc(t)}</h3><p>${esc(d)}</p></a></li>`
    : `<li class="pg-card pg-reveal" style="--d:${i % 3}"><span class="pg-card-top"><span class="pg-card-num">${pad(i + 1)}</span><span class="pg-card-glyph">${icon.check}</span></span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("")}</ul>
</div></section>`;

const faqSection = (page, n) => `<section class="pg-section light-section"><div class="container">${top(n, "QUESTIONS", "STRAIGHT ANSWERS")}
  <div class="pg-faq-wrap"><div class="pg-faq-side pg-reveal"><h2>Questions, <em class="serif-word">answered.</em></h2><p class="body-copy">Something else on your mind? Ask us directly, we are happy to talk it through.</p><a class="text-link" href="${whatsapp}" target="_blank" rel="noreferrer">Ask on WhatsApp${icon.arrow}</a></div>
  <div class="pg-faq pg-reveal" style="--d:1">${page.faq.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary><span>${pad(i + 1)}</span>${esc(q)}<i aria-hidden="true"></i></summary><p>${esc(a)}</p></details>`).join("")}</div></div>
</div></section>`;

const relatedSection = (page, n) => `<section class="pg-section pg-dark"><div class="container">${top(n, "MORE FROM AVITA", "ONE TEAM / EVERY STAGE")}
  <div class="pg-related-wrap"><h2 class="pg-reveal">Explore <em class="serif-word">more.</em></h2>
  <ul class="pg-related pg-reveal" style="--d:1">${[hub, ...pages].filter(p => p !== page).map((p, i) => `<li><a href="/${p.slug}/"><span>${pad(i + 1)}</span><strong>${esc(p.short)}</strong><i>${icon.arrow}</i></a></li>`).join("")}</ul></div>
</div></section>`;

const guideSection = (page, n) => {
  const needs = [["I need a new website, or my current one feels dated", 0], ["I want an app my customers can install on their phone", 1], ["Off-the-shelf tools don’t fit how my business works", 2], ["My team types the same figures into many documents", 3], ["My app is slow, hard to release or hosted badly", 4], ["We have lots of data but no clear picture", 5]];
  return `<section class="pg-section light-section"><div class="container">${top(n, "WHICH SERVICE DO I NEED?", "START FROM THE PROBLEM")}
  <div class="pg-faq-wrap"><div class="pg-faq-side pg-reveal"><h2>Not sure where <em class="serif-word">to start?</em></h2><p class="body-copy">Pick the sentence that sounds most like you. If none of them fit, tell us in your own words and we will point you the right way.</p><a class="text-link" href="${whatsapp}" target="_blank" rel="noreferrer">Ask on WhatsApp${icon.arrow}</a></div>
  <ul class="pv-needs pg-reveal" style="--d:1">${needs.map(([need, i]) => `<li><a href="/${services[i].slug}/"><span>“${need}”</span><small>${esc(services[i].short)}${icon.arrowSmall}</small></a></li>`).join("")}</ul></div>
</div></section>`;
};

function body(page, index) {
  const sections = page.hub ? [hubServicesSection, guideSection, workSection, processSection]
    : [overviewSection, offersSection, features[page.feature], workSection, processSection, faqSection, relatedSection].filter(Boolean);
  return hero(page, index) + sections.map((section, i) => section(page, i + 1)).join("") + ctaSection(sections.length + 1);
}

// Progressive enhancement only: content is fully visible without JavaScript.
const script = `<script>
(() => {
  const items = document.querySelectorAll(".pg-reveal");
  if (!("IntersectionObserver" in window)) return items.forEach(item => item.classList.add("is-in"));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-in"); observer.unobserve(entry.target); } }), { rootMargin: "0px 0px -10% 0px" });
  items.forEach(item => observer.observe(item));
  document.querySelectorAll(".pg-card").forEach(card => card.addEventListener("pointermove", event => { const box = card.getBoundingClientRect(); card.style.setProperty("--mx", event.clientX - box.left + "px"); card.style.setProperty("--my", event.clientY - box.top + "px"); }));
})();
</script>`;

function render(page, css, index) {
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
<link rel="preload" href="/artwork/hero-sculpture-v3.webp" as="image" fetchpriority="high">
${css.map(href => `<link rel="stylesheet" href="${href}">`).join("\n")}
<script>document.documentElement.classList.add("pg-js")</script>
<script type="application/ld+json">
${schema(page)}
</script>
</head>
<body id="top" class="pg-body">
<a href="#main" class="skip-link">Skip to content</a>
${header(page)}
<main id="main">
${body(page, index)}
</main>
${footer}
${script}
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

[hub, ...pages].forEach((page, index) => {
  const file = join(dist, page.slug, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page, [...siteCss, pageCssName], index + 1));
});

const urls = [{ loc: `${site}/`, priority: "1.0" }, { loc: url(hub), priority: "0.9" }, ...pages.map(page => ({ loc: url(page), priority: page.local ? "0.9" : "0.8" }))];
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`);
console.log(`Generated ${pages.length + 1} pages and sitemap.xml (${urls.length} URLs).`);
