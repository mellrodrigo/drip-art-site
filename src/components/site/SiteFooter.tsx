import { Droplets } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Droplets className="h-4 w-4" />
          </span>
          <span className="font-display font-bold">{siteConfig.name}</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.tagline}
        </p>
        <a href="#/admin" className="text-xs text-muted-foreground/70 transition-colors hover:text-foreground">
          Área restrita
        </a>
      </div>
    </footer>
  );
}
