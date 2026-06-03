import { supabase } from "@/integrations/supabase/client";

export type GalleryPhoto = {
  id: string;
  title: string | null;
  category: string | null;
  storage_path: string;
  signedUrl: string;
  created_at: string;
  sort_order: number;
};

const BUCKET = "gallery";

export async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id, title, category, storage_path, created_at, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const paths = data.map((p) => p.storage_path);
  const { data: signed, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, 60 * 60 * 24);

  if (signErr) throw signErr;

  const urlByPath = new Map<string, string>();
  signed?.forEach((s) => {
    if (s.path && s.signedUrl) urlByPath.set(s.path, s.signedUrl);
  });

  return data.map((p) => ({
    ...p,
    signedUrl: urlByPath.get(p.storage_path) ?? "",
  }));
}
