import solarImage from "@/assets/solar-heater.jpg";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site-config";
import { Check } from "lucide-react";

const benefits = [
  "Economia de até 70% na conta de energia",
  "Instalação de coletores e boiler",
  "Manutenção e troca de resistências",
  "Atendimento residencial e predial",
];

export function SolarSection() {
  return (
    <section id="solar" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-border shadow-card">
          <img
            src={solarImage}
            alt="Aquecedor solar instalado em telhado residencial"
            width={1200}
            height={900}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Energia que economiza
          </span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Aquecedor solar instalado e mantido por especialista
          </h2>
          <p className="mt-4 text-muted-foreground">
            Reduza sua conta de energia com um sistema de aquecimento solar bem dimensionado,
            instalado com segurança e com manutenção completa.
          </p>

          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-sm text-foreground">{b}</span>
              </li>
            ))}
          </ul>

          <Button asChild variant="hero" size="lg" className="mt-8">
            <a href={whatsappLink("Olá! Quero um orçamento de aquecedor solar.")} target="_blank" rel="noopener noreferrer">
              Quero economizar energia
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
