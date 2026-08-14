import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

export function Navbar() {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mindLabOpen, setMindLabOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [location] = useLocation();

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (location !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["hero", "about", "team", "tests", "games", "illusions", "join"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5, 0.8] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location]);

  const links = [
    { name: "About", href: "#about" },
    { name: "Team", href: "#team" },
    { name: "Gallery", href: "/gallery" },
    { name: "Counselling", href: "/counselling" },
    { name: "Join Us", href: "#join" },
  ];
  const mindLabLinks = [
    { name: "Tests", href: "#tests", description: "Discover your patterns" },
    { name: "Games", href: "#games", description: "Challenge your thinking" },
    { name: "Illusions", href: "#illusions", description: "Question what you see" },
  ];
  const mindLabActive = ["tests", "games", "illusions"].includes(activeSection);

  const navItemClass = (active: boolean) =>
    `text-sm font-medium transition-colors duration-200 relative group tracking-wide ${
      active ? "text-foreground" : "text-foreground/55 hover:text-foreground"
    }`;

  const closeMenus = () => {
    setMobileOpen(false);
    setMindLabOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
      isScrolled ? "bg-background/90 backdrop-blur-xl border-b border-border py-3 shadow-sm" : "bg-transparent py-5"
    }`}>
      <motion.div className="absolute top-0 left-0 right-0 h-[2px] bg-accent/60 origin-left" style={{ scaleX: scrollYProgress }} />

      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#hero" onClick={closeMenus} className="flex items-center gap-3 leading-none" aria-label="PSYNAPSE home">
           <img src={logoSrc} alt="PSYNAPSE logo" className="w-9 h-9 object-contain" />
          <div className="flex flex-col">
            <span className="text-lg tracking-[0.2em] font-serif font-bold text-foreground">PSYNAPSE</span>
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-foreground/40">DPS Dwarka</span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          <a href="#about" className={navItemClass(activeSection === "about")} data-testid="link-nav-about">
            About
            <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 rounded-full ${activeSection === "about" ? "w-full" : "w-0 group-hover:w-full"}`} />
          </a>

          {links.slice(1, 2).map((l) => {
            const active = activeSection === l.href.slice(1);
            return (
              <a key={l.name} href={l.href} className={navItemClass(active)} data-testid={`link-nav-${l.name.toLowerCase().replaceAll(" ", "-")}`}>
                {l.name}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 rounded-full ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
              </a>
            );
          })}

          <div className="relative" onMouseEnter={() => setMindLabOpen(true)} onMouseLeave={() => setMindLabOpen(false)}>
            <button
              type="button"
              onClick={() => setMindLabOpen((open) => !open)}
              className={`${navItemClass(mindLabActive)} inline-flex items-center gap-1`}
              aria-expanded={mindLabOpen}
              aria-haspopup="menu"
              data-testid="button-nav-mind-lab"
            >
              Mind Lab
              <ChevronDown size={14} className={`transition-transform duration-200 ${mindLabOpen ? "rotate-180" : ""}`} />
              <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 rounded-full ${mindLabActive ? "w-full" : "w-0 group-hover:w-full"}`} />
            </button>

            {mindLabOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute left-1/2 top-full mt-5 w-64 -translate-x-1/2 rounded-2xl border border-border bg-background/95 p-2 shadow-xl backdrop-blur-xl"
                role="menu"
              >
                {mindLabLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={closeMenus}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-card ${
                      activeSection === item.href.slice(1) ? "bg-card" : ""
                    }`}
                    role="menuitem"
                  >
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-foreground/35">{item.description}</span>
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          {links.slice(2).map((l) => {
            const active = l.href.startsWith("/")
              ? location === l.href
              : activeSection === l.href.slice(1);
            return l.href.startsWith("/") ? (
              <Link key={l.name} href={l.href} className={navItemClass(active)} data-testid={`link-nav-${l.name.toLowerCase().replaceAll(" ", "-")}`}>
                {l.name}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 rounded-full ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ) : (
              <a key={l.name} href={l.href} className={navItemClass(active)} data-testid={`link-nav-${l.name.toLowerCase().replaceAll(" ", "-")}`}>
                {l.name}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 rounded-full ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
              </a>
            );
          })}
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 rounded-xl border border-border flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border py-4 px-6 flex flex-col gap-1 shadow-lg md:hidden">
          <a href="#about" onClick={closeMenus} className="text-base font-medium text-foreground/65 hover:text-foreground py-3 border-b border-border/40 transition-colors">About</a>
          {links.slice(1, 2).map((l) => (
            <a key={l.name} href={l.href} onClick={closeMenus} className="text-base font-medium text-foreground/65 hover:text-foreground py-3 border-b border-border/40 transition-colors">
              {l.name}
            </a>
          ))}
          <div className="border-b border-border/40 py-2">
            <button type="button" onClick={() => setMindLabOpen((open) => !open)} className="flex w-full items-center justify-between py-2 text-left text-base font-medium text-foreground/65 hover:text-foreground transition-colors">
              <span>Mind Lab</span>
              <ChevronDown size={16} className={`transition-transform ${mindLabOpen ? "rotate-180" : ""}`} />
            </button>
            {mindLabOpen && (
              <div className="ml-3 flex flex-col border-l border-border pl-4">
                {mindLabLinks.map((item) => (
                  <a key={item.name} href={item.href} onClick={closeMenus} className="py-2.5 text-sm text-foreground/50 hover:text-foreground transition-colors">
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          {links.slice(2).map((l) => (
            l.href.startsWith("/") ? (
              <Link key={l.name} href={l.href} onClick={closeMenus} className="text-base font-medium text-foreground/65 hover:text-foreground py-3 border-b border-border/40 last:border-0 transition-colors">
                {l.name}
              </Link>
            ) : (
              <a key={l.name} href={l.href} onClick={closeMenus} className="text-base font-medium text-foreground/65 hover:text-foreground py-3 border-b border-border/40 last:border-0 transition-colors">
                {l.name}
              </a>
            )
          ))}
        </motion.div>
      )}
    </header>
  );
}
