import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Materials } from "@/components/site/Materials";
import { SolarSection } from "@/components/site/SolarSection";
import { GallerySection } from "@/components/site/GallerySection";
import { Contact } from "@/components/site/Contact";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instalações Hidráulicas · Água Quente e Fria, Aquecedor Solar" },
      {
        name: "description",
        content:
          "Instalação e manutenção de água quente e fria residencial e predial. PVC, CPVC, PPR, cobre, PEX, galvanizado e aquecedor solar. Orçamento no WhatsApp.",
      },
      { property: "og:title", content: "Instalações Hidráulicas · Água Quente e Fria" },
      {
        property: "og:description",
        content:
          "Especialista em água quente e fria, aquecedor solar e tubulações de todos os tipos. Serviço garantido.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Materials />
        <SolarSection />
        <GallerySection />
        <Contact />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
