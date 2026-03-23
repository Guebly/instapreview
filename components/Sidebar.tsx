"use client";
import { useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Upload } from "lucide-react";
import { ProfileData, Highlight, FeedImage, SidebarTab } from "@/lib/types";
import { uid, readFileAsDataURL } from "@/lib/utils";

/* ── Shared input style ── */
const inputCls =
  "w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all " +
  "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 " +
  "text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 " +
  "focus:border-ig-red dark:focus:border-ig-red focus:ring-1 focus:ring-ig-red/30";

/* ── Label ── */
const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1.5">
    {children}
  </p>
);

/* ── Section wrapper ── */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <Label>{title}</Label>
    {children}
  </div>
);

/* ── Upload button ── */
const UploadBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-500 hover:border-ig-red hover:text-ig-red dark:hover:border-ig-red dark:hover:text-ig-red transition-all"
  >
    {children}
  </button>
);

/* ══════════════════════════════════════════════════════════════════════ */

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  profile: ProfileData;
  onProfileChange: (p: Partial<ProfileData>) => void;
  highlights: Highlight[];
  onHighlightsChange: (h: Highlight[]) => void;
  feed: FeedImage[];
  onFeedChange: (f: FeedImage[]) => void;
}

const TABS: { id: SidebarTab; label: string; emoji: string }[] = [
  { id: "profile",    label: "Perfil",     emoji: "👤" },
  { id: "highlights", label: "Destaques",  emoji: "⭕" },
  { id: "feed",       label: "Feed",       emoji: "⊞" },
];

export default function Sidebar({
  activeTab, onTabChange,
  profile, onProfileChange,
  highlights, onHighlightsChange,
  feed, onFeedChange,
}: SidebarProps) {
  const avatarInputRef     = useRef<HTMLInputElement>(null);
  const hlCoverRefs        = useRef<Record<string, HTMLInputElement | null>>({});
  const feedMultiInputRef  = useRef<HTMLInputElement>(null);
  const feedSingleInputRef = useRef<HTMLInputElement>(null);
  const pendingSlotRef     = useRef<string | null>(null);

  /* ── Avatar ── */
  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataURL(file);
    onProfileChange({ avatarUrl: url });
    e.target.value = "";
  }

  /* ── Highlight cover ── */
  async function handleHlCover(e: React.ChangeEvent<HTMLInputElement>, id: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataURL(file);
    onHighlightsChange(highlights.map(h => h.id === id ? { ...h, coverUrl: url } : h));
    e.target.value = "";
  }

  /* ── Feed: multiple import ── */
  async function handleMultiFeed(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = await Promise.all(files.map(readFileAsDataURL));
    const newImgs: FeedImage[] = urls.map(url => ({ id: uid(), url }));
    onFeedChange([...feed, ...newImgs]);
    e.target.value = "";
  }

  /* ── Feed: single slot ── */
  async function handleSingleFeed(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataURL(file);
    const slotId = pendingSlotRef.current;
    if (slotId) {
      onFeedChange(feed.map(f => f.id === slotId ? { ...f, url } : f));
      pendingSlotRef.current = null;
    } else {
      onFeedChange([...feed, { id: uid(), url }]);
    }
    e.target.value = "";
  }

  function openSlot(id: string) {
    pendingSlotRef.current = id;
    feedSingleInputRef.current?.click();
  }

  function removeSlot(id: string) {
    onFeedChange(feed.filter(f => f.id !== id));
  }

  function addHighlight() {
    onHighlightsChange([...highlights, { id: uid(), name: "Novo", coverUrl: null }]);
  }

  function removeHighlight(id: string) {
    onHighlightsChange(highlights.filter(h => h.id !== id));
  }

  function updateHighlightName(id: string, name: string) {
    onHighlightsChange(highlights.map(h => h.id === id ? { ...h, name } : h));
  }

  /* ══════════════════════════════════════════════════════════════════ */
  return (
    <aside className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] flex flex-col overflow-hidden">

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 text-[11px] font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-ig-red text-ig-red"
                : "border-transparent text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
            }`}
          >
            <span className="block text-base leading-none mb-0.5">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

        {/* ── PROFILE ── */}
        {activeTab === "profile" && (
          <>
            <Section title="Foto de perfil">
              <div className="flex items-center gap-3">
                {/* Avatar preview */}
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-ig-red dark:hover:border-ig-red transition-all bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl"
                >
                  {profile.avatarUrl
                    ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                    : "📷"
                  }
                </button>
                <UploadBtn onClick={() => avatarInputRef.current?.click()}>
                  <Upload size={13} />
                  Enviar foto
                </UploadBtn>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </div>
            </Section>

            <Section title="Informações">
              <div className="flex flex-col gap-2.5">
                <div>
                  <Label>Usuário (@)</Label>
                  <input className={inputCls} placeholder="seu_usuario" value={profile.username}
                    onChange={e => onProfileChange({ username: e.target.value })} />
                </div>
                <div>
                  <Label>Nome de exibição</Label>
                  <input className={inputCls} placeholder="Seu Nome Completo" value={profile.displayName}
                    onChange={e => onProfileChange({ displayName: e.target.value })} />
                </div>
                <div>
                  <Label>Biografia</Label>
                  <textarea
                    className={`${inputCls} resize-none min-h-[80px] leading-relaxed`}
                    placeholder={"✨ Descrição do perfil\n🔗 www.seusite.com"}
                    value={profile.bio}
                    onChange={e => onProfileChange({ bio: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Link na bio</Label>
                  <input className={inputCls} placeholder="www.seusite.com" value={profile.link}
                    onChange={e => onProfileChange({ link: e.target.value })} />
                </div>
              </div>
            </Section>

            <Section title="Estatísticas">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "posts",     label: "Posts",      placeholder: "24"    },
                  { key: "followers", label: "Seguidores", placeholder: "1.248" },
                  { key: "following", label: "Seguindo",   placeholder: "312"   },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <input
                      className={inputCls}
                      placeholder={placeholder}
                      value={(profile as any)[key]}
                      onChange={e => onProfileChange({ [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ── HIGHLIGHTS ── */}
        {activeTab === "highlights" && (
          <>
            <Section title="Destaques (Stories)">
              <div className="flex flex-col gap-2">
                {highlights.map(h => (
                  <div key={h.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    {/* Cover */}
                    <button
                      onClick={() => hlCoverRefs.current[h.id]?.click()}
                      className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-ig-red dark:hover:border-ig-red transition-all bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg"
                    >
                      {h.coverUrl
                        ? <img src={h.coverUrl} alt="" className="w-full h-full object-cover" />
                        : "+"
                      }
                    </button>
                    <input
                      ref={el => { hlCoverRefs.current[h.id] = el; }}
                      type="file" accept="image/*" className="hidden"
                      onChange={e => handleHlCover(e, h.id)}
                    />

                    {/* Name */}
                    <input
                      className="flex-1 bg-transparent text-sm font-semibold text-slate-800 dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-600"
                      placeholder="Nome"
                      value={h.name}
                      onChange={e => updateHighlightName(h.id, e.target.value)}
                    />

                    {/* Delete */}
                    <button
                      onClick={() => removeHighlight(h.id)}
                      className="p-1.5 rounded-lg text-slate-400 dark:text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <UploadBtn onClick={addHighlight}>
                <Plus size={13} />
                Adicionar destaque
              </UploadBtn>
            </Section>

            <p className="text-[11px] text-slate-400 dark:text-slate-600 leading-relaxed">
              Clique no círculo de cada destaque para adicionar uma foto de capa. O nome aparece abaixo do destaque no feed.
            </p>
          </>
        )}

        {/* ── FEED ── */}
        {activeTab === "feed" && (
          <>
            <Section title="Fotos do Feed">
              <p className="text-[11px] text-slate-400 dark:text-slate-600 leading-relaxed -mt-1">
                No preview à direita, <strong className="text-slate-600 dark:text-slate-400">arraste as fotos</strong> para reorganizá-las livremente.
              </p>

              {/* Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {feed.map((img, idx) => (
                  <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openSlot(img.id)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
                        title="Trocar foto"
                      >
                        <ImageIcon size={11} />
                      </button>
                      <button
                        onClick={() => removeSlot(img.id)}
                        className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition"
                        title="Remover"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 text-[9px] font-black text-white/60 bg-black/40 rounded px-1">
                      {idx + 1}
                    </span>
                  </div>
                ))}
                {/* Empty add slot */}
                <button
                  onClick={() => { pendingSlotRef.current = null; feedSingleInputRef.current?.click(); }}
                  className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-600 hover:border-ig-red hover:text-ig-red dark:hover:border-ig-red dark:hover:text-ig-red transition-all text-xl"
                >
                  +
                </button>
              </div>

              <UploadBtn onClick={() => feedMultiInputRef.current?.click()}>
                <Upload size={13} />
                Importar múltiplas fotos
              </UploadBtn>
            </Section>

            <p className="text-[11px] text-slate-400 dark:text-slate-600 leading-relaxed">
              As fotos aparecem no preview em ordem de cima para baixo, da esquerda para direita (igual ao Instagram).
            </p>

            {/* Hidden inputs */}
            <input ref={feedMultiInputRef}  type="file" accept="image/*" multiple className="hidden" onChange={handleMultiFeed} />
            <input ref={feedSingleInputRef} type="file" accept="image/*"          className="hidden" onChange={handleSingleFeed} />
          </>
        )}

      </div>
    </aside>
  );
}
