"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Image as ImageIcon, Upload, Pin, PinOff, ExternalLink, X } from "lucide-react";
import type { ProfileData, Highlight, FeedImage, SidebarTab, BioLink, Template } from "@/lib/types";
import { uid, readFileAsDataURL } from "@/lib/utils";
import VerifiedBadge from "./VerifiedBadge";
import FeedAnalysis from "./FeedAnalysis";
import TemplateGallery from "./TemplateGallery";
import SampleImagesButton from "./SampleImagesButton";

/* ── Shared styles ── */
const inp =
  "w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all " +
  "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 " +
  "text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 " +
  "focus:border-ig-red focus:ring-1 focus:ring-ig-red/20";

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1.5">
    {children}
  </p>
);
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><Label>{label}</Label>{children}</div>
);
const UploadBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick}
    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
      text-xs font-semibold border-2 border-dashed
      border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-500
      hover:border-ig-red hover:text-ig-red dark:hover:border-ig-red dark:hover:text-ig-red
      transition-all">
    {children}
  </button>
);
const Toggle = ({ checked, onChange, label, sub }: {
  checked: boolean; onChange: () => void; label: string; sub?: string;
}) => (
  <button onClick={onChange} className="flex items-center justify-between w-full py-2 gap-3">
    <div className="text-left">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">{label}</span>
      {sub && <span className="text-[11px] text-slate-400 dark:text-slate-600">{sub}</span>}
    </div>
    <span className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-all ${
      checked ? "ig-gradient" : "bg-slate-200 dark:bg-slate-700"
    }`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
        checked ? "translate-x-4" : ""
      }`} />
    </span>
  </button>
);

const TABS: { id: SidebarTab; emoji: string; label: string }[] = [
  { id: "profile",    emoji: "👤", label: "Perfil"    },
  { id: "highlights", emoji: "⭕", label: "Destaques" },
  { id: "feed",       emoji: "⊞",  label: "Feed"      },
  { id: "analysis",   emoji: "✨", label: "Análise"   },
];

/* ── Verified options — typed explicitly to avoid TS inference issues ── */
interface VerifiedOption {
  val:   ProfileData["verified"];
  label: string;
  badge: React.ReactNode;
}
const VERIFIED_OPTIONS: VerifiedOption[] = [
  { val: "none", label: "Nenhum", badge: <span className="text-base leading-none">✕</span>  },
  { val: "blue", label: "Azul",   badge: <VerifiedBadge type="blue" size={16} /> },
  { val: "gold", label: "Ouro",   badge: <VerifiedBadge type="gold" size={16} /> },
];

/* ── View mode options ── */
interface ViewOption { val: ProfileData["viewMode"]; label: string; sub: string; }
const VIEW_OPTIONS: ViewOption[] = [
  { val: "owner",   label: "Dono",      sub: "Editar perfil" },
  { val: "visitor", label: "Visitante", sub: "Seguir + Msg"  },
];

/* ════════════════════════════════════════════════════════════════════ */

interface SidebarProps {
  activeTab:          SidebarTab;
  onTabChange:        (t: SidebarTab) => void;
  profile:            ProfileData;
  onProfileChange:    (p: Partial<ProfileData>) => void;
  highlights:         Highlight[];
  onHighlightsChange: (h: Highlight[]) => void;
  feed:               FeedImage[];
  onFeedChange:       (f: FeedImage[]) => void;
  onClose:            () => void;   // mobile X button
  onLoadTemplate:     (t: Template) => void;
}

export default function Sidebar({
  activeTab, onTabChange,
  profile, onProfileChange,
  highlights, onHighlightsChange,
  feed, onFeedChange,
  onClose,
  onLoadTemplate,
}: SidebarProps) {
  const avatarRef     = useRef<HTMLInputElement>(null);
  const hlCoverRefs   = useRef<Record<string, HTMLInputElement | null>>({});
  const feedMultiRef  = useRef<HTMLInputElement>(null);
  const feedSingleRef = useRef<HTMLInputElement>(null);
  const pendingSlot   = useRef<string | null>(null);

  /* ── Handlers ── */
  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    onProfileChange({ avatarUrl: await readFileAsDataURL(f) });
    e.target.value = "";
  }
  async function handleHlCover(e: React.ChangeEvent<HTMLInputElement>, id: string) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = await readFileAsDataURL(f);
    onHighlightsChange(highlights.map(h => h.id === id ? { ...h, coverUrl: url } : h));
    e.target.value = "";
  }
  async function handleMultiFeed(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    const urls  = await Promise.all(files.map(readFileAsDataURL));
    const next: FeedImage[] = [
      ...feed,
      ...urls.map(url => ({ id: uid(), url, pinned: false, archived: false })),
    ];
    onFeedChange(next);
    if (profile.autoCount) onProfileChange({ posts: String(next.length) });
    e.target.value = "";
  }
  async function handleSingleFeed(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url  = await readFileAsDataURL(f);
    const slot = pendingSlot.current;
    const next: FeedImage[] = slot
      ? feed.map(fi => fi.id === slot ? { ...fi, url } : fi)
      : [...feed, { id: uid(), url, pinned: false, archived: false }];
    pendingSlot.current = null;
    onFeedChange(next);
    if (profile.autoCount && !slot) onProfileChange({ posts: String(next.length) });
    e.target.value = "";
  }
  function removeImage(id: string) {
    const next = feed.filter(f => f.id !== id);
    onFeedChange(next);
    if (profile.autoCount) onProfileChange({ posts: String(next.length) });
  }
  function togglePin(id: string) {
    const pinnedCount = feed.filter(f => f.pinned).length;
    onFeedChange(feed.map(f => {
      if (f.id !== id) return f;
      if (!f.pinned && pinnedCount >= 3) return f; // max 3 pinned
      return { ...f, pinned: !f.pinned };
    }));
  }
  function addBioLink() {
    if ((profile.bioLinks || []).length >= 5) return;
    onProfileChange({ bioLinks: [...(profile.bioLinks || []), { id: uid(), label: "", url: "" }] });
  }
  function updateBioLink(id: string, patch: Partial<BioLink>) {
    onProfileChange({ bioLinks: (profile.bioLinks || []).map(l => l.id === id ? { ...l, ...patch } : l) });
  }
  function removeBioLink(id: string) {
    onProfileChange({ bioLinks: (profile.bioLinks || []).filter(l => l.id !== id) });
  }

  const sortedFeed = [...feed.filter(f => f.pinned), ...feed.filter(f => !f.pinned)];

  /* ════════════════════════════════════════════════════════════════ */
  return (
    <aside className="w-72 flex-shrink-0 flex flex-col overflow-hidden h-full
      border-r border-slate-200 dark:border-slate-800
      bg-white dark:bg-[#111111]">

      {/* ── Header: tabs + mobile close ── */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        {TABS.map(t => (
          <button key={t.id} onClick={() => onTabChange(t.id)}
            className={`flex-1 py-3 text-[11px] font-bold transition-all border-b-2 ${
              activeTab === t.id
                ? "border-ig-red text-ig-red"
                : "border-transparent text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
            }`}>
            <span className="block text-base leading-none mb-0.5">{t.emoji}</span>
            {t.label}
          </button>
        ))}
        {/* X close — only visible on mobile (lg:hidden) */}
        <button
          onClick={onClose}
          className="lg:hidden flex items-center justify-center w-10 h-10 flex-shrink-0
            text-slate-500 dark:text-slate-400
            hover:text-slate-800 dark:hover:text-white
            hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-lg mr-1"
          aria-label="Fechar painel"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Scrollable panel ── */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

        {/* ════ PERFIL ════ */}
        {activeTab === "profile" && (<>

          {/* Avatar */}
          <div>
            <Label>Foto de perfil</Label>
            <div className="flex items-center gap-3">
              <button onClick={() => avatarRef.current?.click()}
                className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden
                  border-2 border-slate-200 dark:border-slate-700
                  hover:border-ig-red dark:hover:border-ig-red transition-all
                  bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
                {profile.avatarUrl
                  ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : "📷"}
              </button>
              <UploadBtn onClick={() => avatarRef.current?.click()}>
                <Upload size={13} />Enviar foto
              </UploadBtn>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>
          </div>

          {/* Informações básicas */}
          <div className="flex flex-col gap-3">
            <Label>Informações básicas</Label>
            <Field label="Usuário (@)">
              <input className={inp} placeholder="seu_usuario" value={profile.username}
                onChange={e => onProfileChange({ username: e.target.value })} />
            </Field>
            <Field label="Nome de exibição">
              <input className={inp} placeholder="Seu Nome Completo" value={profile.displayName}
                onChange={e => onProfileChange({ displayName: e.target.value })} />
            </Field>
            <Field label="Categoria do perfil">
              <input className={inp} placeholder="ex: Criador de conteúdo" value={profile.category}
                onChange={e => onProfileChange({ category: e.target.value })} />
            </Field>
            <Field label="Biografia">
              <textarea className={`${inp} resize-none min-h-[76px] leading-relaxed`}
                placeholder={"✨ Sua bio aqui\n🔗 www.seusite.com"}
                value={profile.bio}
                onChange={e => onProfileChange({ bio: e.target.value })} />
            </Field>
          </div>

          {/* Links na bio */}
          <div>
            <Label>Links na bio <span className="normal-case font-normal text-slate-400">(até 5)</span></Label>
            <div className="flex flex-col gap-2">
              {(profile.bioLinks || []).map(link => (
                <div key={link.id}
                  className="flex flex-col gap-1.5 p-2.5 rounded-xl
                    bg-slate-50 dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ExternalLink size={11} className="text-slate-400 flex-shrink-0" />
                    <input
                      className="flex-1 bg-transparent text-xs font-semibold
                        text-slate-700 dark:text-slate-300 outline-none
                        placeholder-slate-400 dark:placeholder-slate-600"
                      placeholder="Rótulo (ex: Meu site)"
                      value={link.label}
                      onChange={e => updateBioLink(link.id, { label: e.target.value })} />
                    <button onClick={() => removeBioLink(link.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition">
                      <Trash2 size={11} />
                    </button>
                  </div>
                  <input
                    className="w-full bg-transparent text-[11px] text-slate-500 dark:text-slate-500
                      outline-none placeholder-slate-400 dark:placeholder-slate-600 font-mono"
                    placeholder="https://..."
                    value={link.url}
                    onChange={e => updateBioLink(link.id, { url: e.target.value })} />
                </div>
              ))}
              {(profile.bioLinks || []).length < 5 && (
                <UploadBtn onClick={addBioLink}>
                  <Plus size={13} />Adicionar link
                </UploadBtn>
              )}
            </div>
          </div>

          {/* CTA */}
          <Field label="Botão CTA (opcional)">
            <input className={inp} placeholder="ex: Saiba mais / Agendar" value={profile.ctaLabel}
              onChange={e => onProfileChange({ ctaLabel: e.target.value })} />
          </Field>

          {/* Verificação */}
          <div>
            <Label>Verificação</Label>
            <div className="grid grid-cols-3 gap-2">
              {VERIFIED_OPTIONS.map(({ val, label, badge }) => (
                <button key={val}
                  onClick={() => onProfileChange({ verified: val })}
                  className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl
                    text-[11px] font-semibold border-2 transition-all ${
                    profile.verified === val
                      ? "border-ig-red bg-ig-red/5 text-ig-red"
                      : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-500"
                  }`}>
                  <span className="flex items-center justify-center h-5">{badge}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Perspectiva */}
          <div>
            <Label>Perspectiva do preview</Label>
            <div className="grid grid-cols-2 gap-2">
              {VIEW_OPTIONS.map(({ val, label, sub }) => (
                <button key={val}
                  onClick={() => onProfileChange({ viewMode: val })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border-2 text-left transition-all ${
                    profile.viewMode === val
                      ? "border-ig-red bg-ig-red/5 text-ig-red"
                      : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-500"
                  }`}>
                  <span className="block font-bold">{label}</span>
                  <span className="text-[10px] opacity-70">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div>
            <Label>Estatísticas</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Posts</Label>
                <input
                  className={`${inp} ${profile.autoCount ? "opacity-40 cursor-not-allowed" : ""}`}
                  placeholder="0"
                  value={profile.posts}
                  disabled={profile.autoCount}
                  onChange={e => onProfileChange({ posts: e.target.value })} />
              </div>
              <div>
                <Label>Seguidores</Label>
                <input className={inp} placeholder="0" value={profile.followers}
                  onChange={e => onProfileChange({ followers: e.target.value })} />
              </div>
              <div>
                <Label>Seguindo</Label>
                <input className={inp} placeholder="0" value={profile.following}
                  onChange={e => onProfileChange({ following: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            <Label>Comportamento</Label>
            <Toggle
              checked={profile.autoCount}
              label="Posts automático"
              sub="Conta as fotos do feed"
              onChange={() => {
                const next = !profile.autoCount;
                onProfileChange({ autoCount: next, posts: next ? String(feed.length) : profile.posts });
              }} />
            <Toggle
              checked={profile.storyActive}
              label="Story ativo"
              sub="Anel colorido no avatar"
              onChange={() => onProfileChange({ storyActive: !profile.storyActive })} />
          </div>
        </>)}

        {/* ════ DESTAQUES ════ */}
        {activeTab === "highlights" && (<>
          <div>
            <Label>Destaques (Stories)</Label>
            <div className="flex flex-col gap-2">
              {highlights.map(h => (
                <div key={h.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl
                    bg-slate-50 dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800">
                  <button onClick={() => hlCoverRefs.current[h.id]?.click()}
                    className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden
                      border-2 border-dashed border-slate-300 dark:border-slate-700
                      hover:border-ig-red dark:hover:border-ig-red transition-all
                      bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                    {h.coverUrl
                      ? <img src={h.coverUrl} alt="" className="w-full h-full object-cover" />
                      : "+"}
                  </button>
                  <input
                    ref={el => { hlCoverRefs.current[h.id] = el; }}
                    type="file" accept="image/*" className="hidden"
                    onChange={e => handleHlCover(e, h.id)} />
                  <input
                    className="flex-1 bg-transparent text-sm font-semibold
                      text-slate-800 dark:text-white outline-none
                      placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="Nome"
                    value={h.name}
                    onChange={e => onHighlightsChange(
                      highlights.map(x => x.id === h.id ? { ...x, name: e.target.value } : x)
                    )} />
                  <button
                    onClick={() => onHighlightsChange(highlights.filter(x => x.id !== h.id))}
                    className="p-1.5 rounded-lg text-slate-400 dark:text-slate-600
                      hover:text-red-500 hover:bg-red-500/10 transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <UploadBtn onClick={() => onHighlightsChange([...highlights, { id: uid(), name: "Novo", coverUrl: null }])}>
                <Plus size={13} />Adicionar destaque
              </UploadBtn>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-600 leading-relaxed">
            Clique no círculo para adicionar capa. O nome aparece abaixo de cada destaque no preview.
          </p>
        </>)}

        {/* ════ FEED ════ */}
        {activeTab === "feed" && (<>
          <div>
            <Label>
              Fotos do Feed
              <span className="ml-2 normal-case font-normal text-slate-400 dark:text-slate-600">
                {feed.length} foto{feed.length !== 1 ? "s" : ""}
                {profile.autoCount ? " · sincronizado" : ""}
              </span>
            </Label>
            <p className="text-[11px] text-slate-400 dark:text-slate-600 leading-relaxed mb-3">
              Arraste no preview para reorganizar.{" "}
              <span className="text-ig-red font-semibold">Pino</span> = aparece primeiro (máx. 3).
            </p>

            <div className="grid grid-cols-3 gap-1.5">
              {sortedFeed.map((img, idx) => (
                <div key={img.id}
                  className={`relative group aspect-square rounded-lg overflow-hidden
                    bg-slate-100 dark:bg-slate-900
                    border ${img.pinned ? "border-ig-red" : "border-slate-200 dark:border-slate-800"}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {img.pinned && (
                    <div className="absolute top-1 left-1 w-4 h-4 ig-gradient rounded-full flex items-center justify-center">
                      <Pin size={8} className="text-white" />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 text-[9px] font-black text-white/70 bg-black/50 rounded px-1">
                    {idx + 1}
                  </span>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                    <button onClick={() => togglePin(img.id)} title={img.pinned ? "Desafixar" : "Fixar"}
                      className={`p-1.5 rounded-lg transition ${img.pinned ? "bg-ig-red/80 text-white" : "bg-white/20 hover:bg-white/30 text-white"}`}>
                      {img.pinned ? <PinOff size={10} /> : <Pin size={10} />}
                    </button>
                    <button onClick={() => { pendingSlot.current = img.id; feedSingleRef.current?.click(); }}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition">
                      <ImageIcon size={10} />
                    </button>
                    <button onClick={() => removeImage(img.id)}
                      className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition">
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add slot */}
              <button
                onClick={() => { pendingSlot.current = null; feedSingleRef.current?.click(); }}
                className="aspect-square rounded-lg border-2 border-dashed
                  border-slate-300 dark:border-slate-700
                  flex items-center justify-center text-slate-400 dark:text-slate-600
                  hover:border-ig-red hover:text-ig-red transition-all text-xl font-light">
                +
              </button>
            </div>

            <div className="mt-2">
              <UploadBtn onClick={() => feedMultiRef.current?.click()}>
                <Upload size={13} />Importar múltiplas fotos
              </UploadBtn>
            </div>
          </div>

          <input ref={feedMultiRef}  type="file" accept="image/*" multiple className="hidden" onChange={handleMultiFeed} />
          <input ref={feedSingleRef} type="file" accept="image/*"          className="hidden" onChange={handleSingleFeed} />
        </>)}

        {/* ════ ANÁLISE ════ */}
        {activeTab === "analysis" && (
          <AnimatePresence mode="wait">
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <TemplateGallery onLoadTemplate={onLoadTemplate} />
              <SampleImagesButton onLoadImages={onFeedChange} />
              <FeedAnalysis feed={feed} profile={profile} onFeedReorder={onFeedChange} />
            </motion.div>
          </AnimatePresence>
        )}

      </div>

      {/* ── Guebly footer ── */}
      <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 px-4 py-3">
        <a href="https://www.guebly.com.br" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 group">
          <img src="https://www.guebly.com.br/guebly.png" alt="Guebly"
            className="w-7 h-7 rounded-lg object-contain opacity-70 group-hover:opacity-100 transition-opacity"
            onError={(e: any) => (e.target.style.display = "none")} />
          <div>
            <p className="text-[11px] font-black text-slate-800 dark:text-slate-300 leading-none">InstaPreview</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5 leading-none">by guebly.com.br · open-source</p>
          </div>
        </a>
      </div>
    </aside>
  );
}
