import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchGalleryPhotos } from "@/lib/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, LogOut, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel · Gerenciar fotos" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["gallery-photos"],
    queryFn: fetchGalleryPhotos,
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error("Selecione uma imagem.");
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
    navigate({ to: "/auth", replace: true });
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
          <h2 className="text-lg font-semibold">Enviar nova foto</h2>
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
            <Label htmlFor="file">Imagem</Label>
            <Input id="file" ref={fileRef} type="file" accept="image/*" />
          </div>
          <Button type="submit" variant="hero" className="mt-5" disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Enviando..." : "Enviar foto"}
          </Button>
        </form>

        <h2 className="mt-10 text-lg font-semibold">Fotos publicadas ({photos.length})</h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
        ) : photos.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhuma foto ainda.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-xl border border-border">
                <img src={p.signedUrl} alt={p.title ?? "Foto"} className="aspect-square w-full object-cover" />
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
