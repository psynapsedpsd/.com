import { Instagram, Linkedin, Images } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const socials = [
    { icon: <Instagram size={15} />, href: "https://www.instagram.com/psynapse_dpsd/", external: true },
    { icon: <Linkedin size={15} />, href: "#", external: false },
  ];

  return (
    <footer className="bg-card pt-16 pb-6 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-1">PSYNAPSE</h2>
            <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest mb-4">DPS Dwarka</p>
            <p className="text-sm text-foreground/45 font-light max-w-xs leading-relaxed mb-6">
              The official psychology club — bridging academic curiosity with modern exploration of the human mind.
            </p>
            <div className="flex gap-2">
              {socials.map((s, i) => (
                <a key={i} href={s.href}
                  {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-foreground/35 hover:text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/35 mb-5">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "#about" },
                { label: "Leadership", href: "#team" },
                { label: "Tests", href: "#tests" },
                { label: "Mind Games", href: "#games" },
                { label: "Gallery", href: "/gallery" },
                 { label: "Counselling", href: "/counselling" },
                { label: "Join Us", href: "#join" },
              ].map(l => (
                <li key={l.label}>
                  {l.href.startsWith("/") ? <Link href={l.href} className="text-sm text-foreground/45 hover:text-foreground transition-colors font-light" data-testid={`link-footer-${l.label.toLowerCase().replaceAll(" ", "-")}`}>{l.label}</Link> : <a href={l.href} className="text-sm text-foreground/45 hover:text-foreground transition-colors font-light" data-testid={`link-footer-${l.label.toLowerCase().replaceAll(" ", "-")}`}>{l.label}</a>}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/35 mb-5">Club Archive</h4>
            <Link href="/gallery" className="group inline-flex items-center gap-2 text-sm text-foreground/45 hover:text-foreground transition-colors font-light" data-testid="link-footer-explore-gallery">
              <Images size={15} className="text-accent transition-transform group-hover:rotate-6" />
              Explore the gallery
            </Link>
            <p className="mt-3 max-w-[12rem] text-xs leading-relaxed text-foreground/35">A moving record of experiments, workshops, and shared curiosity.</p>
             <Link href="/counselling" className="mt-5 inline-flex items-center gap-2 text-sm text-foreground/45 hover:text-foreground transition-colors font-light" data-testid="link-footer-counselling">A private way to ask for support</Link>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/35 mb-5">Contact</h4>
            <p className="text-sm text-foreground/40 font-light mb-2">psynapse@dpsdwarka.in</p>
            <p className="text-sm text-foreground/40 font-light">DPS Dwarka, New Delhi</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Highlighted credit box */}
          <div
            className="inline-flex items-center gap-2 bg-background border border-border rounded-2xl px-4 py-2"
            style={{ boxShadow: "0 4px 16px hsl(25 20% 8% / .12), 0 1px 4px hsl(25 20% 8% / .07), inset 0 1px 0 hsl(36 55% 96% / .8)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <p className="text-xs text-foreground/60 font-mono italic tracking-wide">
              Website made by <span className="text-foreground/85 font-semibold not-italic">Nikhil Dev</span>
            </p>
          </div>

          <p className="text-xs text-foreground/35 font-mono text-center md:text-right">
            © {new Date().getFullYear()} <span className="text-foreground/50">PSYNAPSE</span> · DPS Dwarka. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
