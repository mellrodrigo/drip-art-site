import { Flame, Droplets, Wrench, Building2, ShowerHead, Search } from "lucide-react";

const services = [
  {
    icon: Flame,
    title: "Água Quente",
    desc: "Instalação e manutenção de sistemas de água quente residencial e predial, com tubulação adequada para alta temperatura.",
  },
  {
    icon: Droplets,
    title: "Água Fria",
    desc: "Redes de água fria completas, ramais, colunas e distribuição interna com pressão equilibrada.",
  },
  {
    icon: Building2,
    title: "Predial",
    desc: "Projetos e execução de instalações hidráulicas em edifícios, condomínios e áreas comuns.",
  },
  {
    icon: ShowerHead,
    title: "Aquecedor Solar",
    desc: "Instalação e manutenção de aquecedores solares, boiler e coletores para economia de energia.",
  },
  {
    icon: Wrench,
    title: "Manutenção",
    desc: "Reparo de vazamentos, troca de registros, conexões e revisão geral de sistemas existentes.",
  },
  {
    icon: Search,
    title: "Detecção de Vazamentos",
    desc: "Identificação e correção de vazamentos com mínimo de quebra e máximo de precisão.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          O que eu faço
        </span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Serviços completos de hidráulica</h2>
        <p className="mt-4 text-muted-foreground">
          Do projeto à manutenção, cuido de cada detalhe da sua instalação de água quente e fria.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="group rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-110">
              <s.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
