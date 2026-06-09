import { useState } from "react";
import { Menu, X, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, whatsappLink } from "@/lib/site-config";

const navItems = [
  { label: "Serviços", href: "#servicos" },
  { label: "Materiais", href: "#materiais" },
  { label: "Aquecedor Solar", href: "#solar" },
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Contato", href: "#contato" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
            <Droplets className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">{siteConfig.name}</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="hero" size="default">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              Pedir orçamento
            </a>
          </Button>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <Button asChild variant="hero" className="mt-2">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                Pedir orçamento
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
