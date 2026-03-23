"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Topbar         from "@/components/Topbar";
import Sidebar        from "@/components/Sidebar";
import PhonePreview   from "@/components/PhonePreview";
import DesktopPreview from "@/components/DesktopPreview";
import { exportPreview } from "@/lib/exportPreview";
import type { ProfileData, Highlight, FeedImage, AppTheme, IgTheme, ViewMode, SidebarTab } from "@/lib/types";
import { uid, saveTheme, loadTheme, saveIgTheme, loadIgTheme } from "@/lib/utils";

const DEFAULT_PROFILE: ProfileData = {
  username: "", displayName: "", bio: "", link: "",
  posts: "0", followers: "0", following: "0",
  avatarUrl: null, verified: false, category: "",
  ctaLabel: "", storyActive: true,
};

const mkHighlights = () => [
  { id: uid(), name: "Viagem",   coverUrl: null },
  { id: uid(), name: "Trabalho", coverUrl: null },
  { id: uid(), name: "Família",  coverUrl: null },
];

export default function Home() {
  const [appTheme,   setAppTheme]   = useState<AppTheme>("dark");
  const [igTheme,    setIgTheme]    = useState<IgTheme>("light");
  const [viewMode,   setViewMode]   = useState<ViewMode>("mobile");
  const [activeTab,  setActiveTab]  = useState<SidebarTab>("profile");
  const [profile,    setProfile]    = useState<ProfileData>(DEFAULT_PROFILE);
  const [highlights, setHighlights] = useState<Highlight[]>(mkHighlights());
  const [feed,       setFeed]       = useState<FeedImage[]>([]);
  const [exporting,  setExporting]  = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  /* ── Load persisted prefs ── */
  useEffect(() => {
    const at = loadTheme();
    const it = loadIgTheme();
    if (at) setAppTheme(at);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setAppTheme("dark");
    if (it) setIgTheme(it);
  }, []);

  /* ── Apply app dark/light class ── */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", appTheme === "dark");
    saveTheme(appTheme);
  }, [appTheme]);

  const toggleApp = useCallback(() => setAppTheme(t => t === "dark" ? "light" : "dark"), []);
  const toggleIg  = useCallback(() => setIgTheme(t => {
    const next = t === "light" ? "dark" : "light";
    saveIgTheme(next);
    return next;
  }), []);

  const handleReset = useCallback(() => {
    if (!confirm("Resetar tudo? As fotos serão perdidas.")) return;
    setProfile(DEFAULT_PROFILE);
    setHighlights(mkHighlights());
    setFeed([]);
  }, []);

  const handleExport = useCallback(async () => {
    if (!previewRef.current || exporting) return;
    setExporting(true);
    try {
      await exportPreview({ frameEl: previewRef.current, username: profile.username });
    } catch {
      alert("Não foi possível exportar. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }, [exporting, profile.username]);

  /* ════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#0a0a0a]">
      <Topbar
        appTheme={appTheme}
        onToggleApp={toggleApp}
        onReset={handleReset}
        onExport={handleExport}
        isExporting={exporting}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          profile={profile}
          onProfileChange={p => setProfile(prev => ({ ...prev, ...p }))}
          highlights={highlights}
          onHighlightsChange={setHighlights}
          feed={feed}
          onFeedChange={setFeed}
        />

        {/* ── Canvas ── */}
        <main className="relative flex-1 overflow-auto bg-slate-100 dark:bg-[#0a0a0a] flex flex-col items-center py-6 px-4 gap-5">

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

          {/* ── Preview controls bar ── */}
          <div className="relative flex items-center gap-2 flex-wrap z-10">

            {/* View mode toggle */}
            <div className="flex items-center rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161616]">
              {(["mobile","desktop"] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all ${
                    viewMode === mode
                      ? "ig-gradient text-white"
                      : "text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {mode === "mobile"
                    ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" strokeWidth="3"/></svg> Mobile</>
                    : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> Desktop</>
                  }
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

            {/* IG theme toggle */}
            <div className="flex items-center rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161616]">
              {(["light","dark"] as IgTheme[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setIgTheme(t); saveIgTheme(t); }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all ${
                    igTheme === t
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {t === "light"
                    ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> IG Light</>
                    : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg> IG Dark</>
                  }
                </button>
              ))}
            </div>

            {/* Hint */}
            <span className="text-[11px] text-slate-400 dark:text-slate-600 hidden lg:block ml-1">
              Arraste as fotos do feed para reorganizar
            </span>
          </div>

          {/* ── Preview ── */}
          <div ref={previewRef} className="relative z-10">
            {viewMode === "mobile"
              ? <PhonePreview
                  profile={profile} highlights={highlights}
                  feed={feed} onFeedReorder={setFeed} igTheme={igTheme} />
              : <DesktopPreview
                  profile={profile} highlights={highlights}
                  feed={feed} onFeedReorder={setFeed} igTheme={igTheme} />
            }
          </div>

          {/* Footer */}
          <a
            href="https://www.guebly.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition pb-4"
          >
            <img src="https://www.guebly.com.br/guebly.png" alt="" className="w-4 h-4 rounded object-contain opacity-60" />
            InstaPreview é open-source · feito pela Guebly
          </a>
        </main>
      </div>
    </div>
  );
}
