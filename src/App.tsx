import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowLeft, Droplets, Loader2, LogOut, Trash2, Upload } from "lucide-react";

import { Contact } from "@/components/site/Contact";
import { GallerySection } from "@/components/site/GallerySection";
import { Hero } from "@/components/site/Hero";
import { Materials } from "@/components/site/Materials";
import { Services } from "@/components/site/Services";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SolarSection } from "@/components/site/SolarSection";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchGalleryPhotos } from "@/lib/gallery";

const queryClient = new QueryClient();

function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash.startsWith("/admin") ? "admin" : hash.startsWith("/auth") ? "auth" : "home";
}

function HomePage() {
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

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.hash = "/admin";
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode acessar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      window.location.hash = "/admin";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Droplets className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">Área restrita</span>
        </div>

        <h1 className="text-2xl font-bold">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acesse o painel para gerenciar as fotos.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
        </button>

        <a href="/" className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
        </a>
      </div>
    </div>
  );
}

function AdminPage() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.hash = "/auth";
    });
  }, []);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["gallery-photos"],
    queryFn: fetchGalleryPhotos,
  });

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error("Selecione uma imagem ou vídeo.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file);
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("gallery_photos").insert({
        title: title || null,
        category: category || null,
        storage_path: path,
        public_url: path,
      });
      if (insErr) throw insErr;

      toast.success("Foto enviada!");
      setTitle("");
      setCategory("");
      if (fileRef.current) fileRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, path: string) => {
    if (!confirm("Remover esta foto?")) return;
    try {
      await supabase.storage.from("gallery").remove([path]);
      const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
      if (error) throw error;
      toast.success("Foto removida.");
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.hash = "/auth";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Droplets className="h-4 w-4" />
            </span>
            <span className="font-display font-bold">Painel de fotos</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <form onSubmit={handleUpload} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Enviar nova foto ou vídeo</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Título (opcional)</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Instalação de aquecedor" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Categoria (opcional)</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Água quente" />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="file">Imagem ou vídeo</Label>
            <Input id="file" ref={fileRef} type="file" accept="image/*,video/*" />
          </div>
          <Button type="submit" variant="hero" className="mt-5" disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Enviando..." : "Enviar"}
          </Button>
        </form>

        <h2 className="mt-10 text-lg font-semibold">Publicados ({photos.length})</h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
        ) : photos.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhuma foto ainda.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-xl border border-border">
                {p.type === "video" ? (
                  <video src={p.signedUrl} controls playsInline preload="metadata" className="aspect-square w-full object-cover" />
                ) : (
                  <img src={p.signedUrl} alt={p.title ?? "Foto"} className="aspect-square w-full object-cover" />
                )}
                <button
                  onClick={() => handleDelete(p.id, p.storage_path)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-destructive text-destructive-foreground opacity-0 shadow transition-opacity group-hover:opacity-100"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function AppContent() {
  const [route, setRoute] = useState(getRouteFromHash);

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route === "auth") return <AuthPage />;
  if (route === "admin") return <AdminPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}