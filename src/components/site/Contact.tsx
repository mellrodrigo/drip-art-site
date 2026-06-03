import { Button } from "@/components/ui/button";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contato" className="relative overflow-hidden bg-gradient-hero py-20 text-steel-foreground md:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Precisa de um orçamento?</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80">
          Chame no WhatsApp e receba um atendimento rápido. Avaliação e orçamento sem compromisso.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="whatsapp" size="xl">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
            </a>
          </Button>
          <Button asChild variant="steel" size="xl">
            <a href={`tel:+${siteConfig.whatsapp}`}>
              <Phone className="h-5 w-5" /> {siteConfig.phoneDisplay}
            </a>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 text-sm sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <Phone className="h-5 w-5 text-[oklch(0.8_0.14_230)]" />
            <span className="text-white/85">{siteConfig.phoneDisplay}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Mail className="h-5 w-5 text-[oklch(0.8_0.14_230)]" />
            <span className="text-white/85">{siteConfig.email}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MapPin className="h-5 w-5 text-[oklch(0.8_0.14_230)]" />
            <span className="text-white/85">{siteConfig.city}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
