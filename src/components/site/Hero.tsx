import heroImage from "@/assets/hero-plumbing.jpg";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site-config";
import { ShieldCheck, Clock, Award } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-hero text-steel-foreground">
      <div className="absolute inset-0 opacity-20">
        <img
          src={heroImage}
          alt="Instalação de sistema de água quente com tubulações de cobre e PPR"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.24_0.03_256)] via-transparent to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
        <div className="animate-fade-up">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            Água quente e fria · Residencial e Predial
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl">
            Instalações hidráulicas com{" "}
            <span className="bg-gradient-to-r from-[oklch(0.8_0.14_230)] to-[oklch(0.85_0.1_200)] bg-clip-text text-transparent">
              precisão e segurança
            </span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/80">
            Especialista em água quente e fria, aquecedor solar e tubulações em PVC, CPVC,
            PPR, cobre, PEX e galvanizado. Serviço limpo, garantido e bem feito.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="whatsapp" size="xl">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </a>
            </Button>
            <Button asChild variant="steel" size="xl">
              <a href="#servicos">Ver serviços</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2 text-white/85">
              <ShieldCheck className="h-5 w-5 text-[oklch(0.8_0.14_230)]" /> Serviço garantido
            </span>
            <span className="flex items-center gap-2 text-white/85">
              <Clock className="h-5 w-5 text-[oklch(0.8_0.14_230)]" /> Atendimento ágil
            </span>
            <span className="flex items-center gap-2 text-white/85">
              <Award className="h-5 w-5 text-[oklch(0.8_0.14_230)]" /> Acabamento profissional
            </span>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="animate-float overflow-hidden rounded-3xl border border-white/15 shadow-elegant">
            <img
              src={heroImage}
              alt="Profissional instalando sistema hidráulico"
              width={1920}
              height={1080}
              className="h-[460px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
