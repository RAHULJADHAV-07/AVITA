import Website from "@/components/website";

const pages = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/projects": "projects",
  "/contact": "contact",
} as const;

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const page = pages[path as keyof typeof pages] ?? "home";
  return <Website page={page} />;
}
