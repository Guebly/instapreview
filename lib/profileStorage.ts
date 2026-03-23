/**
 * profileStorage
 * Export e import do estado completo do InstaPreview como JSON.
 * As imagens (base64) são incluídas no arquivo — o JSON pode ser
 * recarregado em qualquer browser sem perder nada.
 */

import type { SavedProfile, ProfileData, Highlight, FeedImage } from "./types";

const VERSION = 1;

/* ── Export ──────────────────────────────────────────────────────── */
export function exportProfile(
  profile:    ProfileData,
  highlights: Highlight[],
  feed:       FeedImage[],
): void {
  const payload: SavedProfile = {
    version:    VERSION,
    savedAt:    new Date().toISOString(),
    profile,
    highlights,
    feed,
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const slug = (profile.username || "perfil").replace(/[^a-z0-9_]/gi, "_").toLowerCase();

  const a       = document.createElement("a");
  a.href        = url;
  a.download    = `instapreview_${slug}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Import ──────────────────────────────────────────────────────── */
export function importProfile(): Promise<SavedProfile> {
  return new Promise((resolve, reject) => {
    const input   = document.createElement("input");
    input.type    = "file";
    input.accept  = ".json,application/json";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) { reject(new Error("Nenhum arquivo selecionado")); return; }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const raw  = e.target?.result as string;
          const data = JSON.parse(raw) as SavedProfile;

          // Basic validation
          if (!data.profile || !Array.isArray(data.highlights) || !Array.isArray(data.feed)) {
            throw new Error("Arquivo inválido ou corrompido");
          }

          // Backfill missing fields from older saves
          data.profile.bioLinks   = data.profile.bioLinks   ?? [];
          data.profile.autoCount  = data.profile.autoCount  ?? false;
          data.profile.verified   = data.profile.verified   ?? "none";
          data.profile.category   = data.profile.category   ?? "";
          data.profile.ctaLabel   = data.profile.ctaLabel   ?? "";
          data.profile.storyActive = data.profile.storyActive ?? true;
          data.profile.viewMode   = data.profile.viewMode   ?? "owner";
          data.feed = data.feed.map(f => ({ ...f, archived: f.archived ?? false, pinned: f.pinned ?? false }));

          resolve(data);
        } catch (err: any) {
          reject(new Error(err.message || "Erro ao ler arquivo"));
        }
      };
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsText(file);
    };

    input.click();
  });
}
