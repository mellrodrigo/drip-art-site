const materials = [
  { name: "PVC", desc: "Água fria e esgoto" },
  { name: "CPVC", desc: "Água quente" },
  { name: "PPR", desc: "Termofusão" },
  { name: "Cobre", desc: "Alta durabilidade" },
  { name: "PEX", desc: "Flexível e moderno" },
  { name: "Galvanizado", desc: "Resistência reforçada" },
];

export function Materials() {
  return (
    <section id="materiais" className="bg-secondary/60 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Materiais
          </span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Trabalho com todos os tipos de tubulação</h2>
          <p className="mt-4 text-muted-foreground">
            Cada projeto pede o material certo. Eu domino todos para entregar a melhor solução.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {materials.map((m) => (
            <div
              key={m.name}
              className="rounded-xl border border-border bg-card p-5 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <p className="font-display text-lg font-bold text-foreground">{m.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
