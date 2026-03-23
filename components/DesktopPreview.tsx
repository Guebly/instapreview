"use client";
import type { ProfileData, Highlight, FeedImage, IgTheme } from "@/lib/types";
import { igC } from "@/lib/igColors";
import DraggableFeedGrid from "./DraggableFeedGrid";

interface Props {
  profile:       ProfileData;
  highlights:    Highlight[];
  feed:          FeedImage[];
  onFeedReorder: (f: FeedImage[]) => void;
  igTheme:       IgTheme;
}

export default function DesktopPreview({ profile, highlights, feed, onFeedReorder, igTheme }: Props) {
  const c = igC(igTheme);
  const hasAvatar = !!profile.avatarUrl;

  return (
    <div className="w-[900px] flex-shrink-0 rounded-xl overflow-hidden phone-shadow"
      style={{ border: "1px solid #3a3a3a" }}>

      {/* ── Browser chrome ── */}
      <div className="flex flex-col" style={{ background: "#1e1e1e" }}>
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {/* Tab */}
          <div className="flex-1 flex items-center gap-2 bg-[#2a2a2a] rounded-md px-3 py-1.5 max-w-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span className="text-[11px] text-slate-400 truncate">
              Instagram — {profile.username ? `@${profile.username}` : "seu_usuario"}
            </span>
          </div>
        </div>
        {/* Address bar */}
        <div className="flex items-center gap-3 px-4 pb-2.5">
          {/* Nav arrows */}
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-white/5 text-slate-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="p-1 rounded hover:bg-white/5 text-slate-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button className="p-1 rounded hover:bg-white/5 text-slate-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            </button>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-[#2a2a2a] rounded-md px-3 py-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span className="text-[11px] text-slate-400 font-mono">
              instagram.com/{profile.username ? profile.username : "seu_usuario"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Instagram page ── */}
      <div style={{ background: c.bg, maxHeight: "600px", overflowY: "auto", scrollbarWidth: "none" }}>

        {/* IG Nav bar */}
        <div className="sticky top-0 z-10 border-b ig-font" style={{ background: c.navBg, borderColor: c.border }}>
          <div className="max-w-[935px] mx-auto px-4 h-[60px] flex items-center justify-between gap-4">
            {/* Logo */}
            <svg width="103" height="29" viewBox="0 0 103 29" fill={c.text}>
              <text x="0" y="22" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" fontSize="22" fontWeight="500">Instagram</text>
            </svg>
            {/* Search bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg w-52" style={{ background: c.inputBg, border: `1px solid ${c.border}` }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.textSec} strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <span className="text-[13px]" style={{ color: c.textSec }}>Pesquisar</span>
            </div>
            {/* Icons */}
            <div className="flex items-center gap-5">
              {[
                <path key="h" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
                <><rect key="r" x="2" y="2" width="20" height="20" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="16.5" cy="7.5" r="1.2" fill={c.icon}/></>,
                <><path key="m" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
                <><path key="b" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></>,
              ].map((d, i) => (
                <button key={i}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="1.8">{d}</svg>
                </button>
              ))}
              {/* Avatar mini */}
              <div className="w-7 h-7 rounded-full overflow-hidden" style={{ background: c.bgSec, border: `1px solid ${c.border}` }}>
                {profile.avatarUrl && <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />}
              </div>
            </div>
          </div>
        </div>

        {/* IG Profile content */}
        <div className="max-w-[935px] mx-auto px-4 py-8 ig-font">

          {/* Profile header */}
          <div className="flex gap-16 mb-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className={`w-[150px] h-[150px] rounded-full p-[3px] ${profile.storyActive && hasAvatar ? "ig-gradient" : ""}`}
                style={!profile.storyActive || !hasAvatar ? { background: c.border } : {}}>
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                  style={{ border: `3px solid ${c.bg}`, background: c.bgSec }}>
                  {profile.avatarUrl
                    ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                    : <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={c.border} strokeWidth="1.2">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                  }
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Username row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-light" style={{ color: c.text }}>
                    {profile.username || "seu_usuario"}
                  </h2>
                  {profile.verified && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#3797f0">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 text-sm font-semibold rounded-lg" style={{ background: c.btnBg, color: c.text }}>
                    Editar perfil
                  </button>
                  <button className="px-4 py-1.5 text-sm font-semibold rounded-lg" style={{ background: c.btnBg, color: c.text }}>
                    Ver arquivo
                  </button>
                  {profile.ctaLabel && (
                    <button className="px-4 py-1.5 text-sm font-semibold rounded-lg" style={{ background: c.btnBg, color: c.text }}>
                      {profile.ctaLabel}
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                {[
                  { val: profile.posts,     label: "publicações" },
                  { val: profile.followers, label: "seguidores"  },
                  { val: profile.following, label: "seguindo"    },
                ].map(({ val, label }) => (
                  <div key={label} className="flex items-baseline gap-1.5">
                    <span className="text-[15px] font-bold" style={{ color: c.text }}>{val || "0"}</span>
                    <span className="text-[15px]" style={{ color: c.text }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div>
                {profile.displayName && (
                  <p className="text-[14px] font-semibold" style={{ color: c.text }}>{profile.displayName}</p>
                )}
                {profile.category && (
                  <p className="text-[14px]" style={{ color: c.textSec }}>{profile.category}</p>
                )}
                {profile.bio && (
                  <p className="text-[14px] whitespace-pre-line leading-[1.5] mt-1" style={{ color: c.text }}>{profile.bio}</p>
                )}
                {profile.link && (
                  <p className="text-[14px] font-semibold mt-1" style={{ color: c.link }}>{profile.link}</p>
                )}
              </div>
            </div>
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="flex gap-6 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {highlights.map(h => (
                <div key={h.id} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                  <div className="w-[77px] h-[77px] rounded-full border p-[2px] group-hover:opacity-80 transition"
                    style={{ borderColor: c.hlBorder }}>
                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center" style={{ background: c.bgSec }}>
                      {h.coverUrl
                        ? <img src={h.coverUrl} alt="" className="w-full h-full object-cover" />
                        : <span style={{ color: c.textSec, fontSize: 24 }}>○</span>
                      }
                    </div>
                  </div>
                  <span className="text-[12px] max-w-[77px] text-center overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: c.text }}>
                    {h.name || "Destaque"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Feed tabs */}
          <div className="flex border-t mb-1" style={{ borderColor: c.border }}>
            {[
              { label: "PUBLICAÇÕES", active: true,  icon: <rect x="3" y="3" width="7" height="7" rx="1"/>, icon2: <rect x="14" y="3" width="7" height="7" rx="1"/>, icon3: <rect x="3" y="14" width="7" height="7" rx="1"/>, icon4: <rect x="14" y="14" width="7" height="7" rx="1"/>, isFill: true },
              { label: "REELS",        active: false, icon: <rect x="2" y="2" width="20" height="20" rx="4"/>, isFill: false },
              { label: "MARCADAS",     active: false, icon: <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>, isFill: false },
            ].map(({ label, active }) => (
              <button key={label}
                className="flex items-center gap-2 px-6 py-3 text-[12px] font-semibold tracking-widest border-t-[1px] -mt-[1px] transition"
                style={{
                  borderColor: active ? c.tabActive : "transparent",
                  color: active ? c.tabActive : c.tabInact,
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Feed grid - desktop has bigger cells */}
          <DraggableFeedGrid images={feed} onReorder={onFeedReorder} bgColor={c.bgSec} />
        </div>

        {/* Guebly watermark in desktop view */}
        <div className="flex items-center justify-center gap-2 py-4 opacity-30">
          <img src="https://www.guebly.com.br/guebly.png" alt="" className="w-4 h-4 rounded object-contain" />
          <span className="text-[11px] font-bold" style={{ color: c.textSec }}>InstaPreview by Guebly</span>
        </div>
      </div>
    </div>
  );
}
