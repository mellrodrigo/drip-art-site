import { useQuery } from "@tanstack/react-query";
import { fetchGalleryPhotos } from "@/lib/gallery";
import { ImageOff } from "lucide-react";

export function GallerySection() {
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["gallery-photos"],
    queryFn: fetchGalleryPhotos,
  });

  return (
    <section id="trabalhos" className="bg-secondary/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Portfólio
          </span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Trabalhos realizados</h2>
          <p className="mt-4 text-muted-foreground">
            Veja alguns serviços de instalação e manutenção já executados.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
            <ImageOff className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              As fotos dos trabalhos aparecerão aqui em breve.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {photos.map((p) => (
              <figure
                key={p.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-soft"
              >
                <img
                  src={p.signedUrl}
                  alt={p.title ?? "Trabalho realizado"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {(p.title || p.category) && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    {p.category && (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                        {p.category}
                      </span>
                    )}
                    {p.title && <p className="text-sm font-medium">{p.title}</p>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
