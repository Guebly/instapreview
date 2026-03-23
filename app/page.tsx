"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Topbar      from "@/components/Topbar";
import Sidebar     from "@/components/Sidebar";
import PhonePreview from "@/components/PhonePreview";
import { ProfileData, Highlight, FeedImage, SidebarTab } from "@/lib/types";
import { uid, saveTheme, loadTheme } from "@/lib/utils";
import { exportPreview } from "@/lib/exportPreview";

/* ── Default State ── */
const DEFAULT_PROFILE: ProfileData = {
  username:    "",
  displayName: "",
  bio:         "",
  link:        "",
  posts:       "0",
  followers:   "0",
  following:   "0",
  avatarUrl:   null,
};

const makeDefaultHighlights = () => [
  { id: uid(), name: "Viagem",   coverUrl: null },
  { id: uid(), name: "Trabalho", coverUrl: null },
  { id: uid(), name: "Família",  coverUrl: null },
];

export default function Home() {
  const [theme,       setTheme]       = useState<"dark" | "light">("dark");
  const [activeTab,   setActiveTab]   = useState<SidebarTab>("profile");
  const [profile,     setProfile]     = useState<ProfileData>(DEFAULT_PROFILE);
  const [highlights,  setHighlights]  = useState<Highlight[]>(makeDefaultHighlights());
  const [feed,        setFeed]        = useState<FeedImage[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Ref attached to the phone frame wrapper — used by html2canvas
  const phoneRef = useRef<HTMLDivElement>(null);

  /* ── Load theme ── */
  useEffect(() => {
    const saved = loadTheme();
    if (saved) setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, []);

  /* ── Apply theme ── */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === "dark" ? "light" : "dark"));
  }, []);

  /* ── Reset ── */
  const handleReset = useCallback(() => {
    if (!confirm("Resetar tudo? As fotos carregadas serão perdidas.")) return;
    setProfile(DEFAULT_PROFILE);
    setHighlights(makeDefaultHighlights());
    setFeed([]);
  }, []);

  /* ── Export PNG ── */
  const handleExport = useCallback(async () => {
    if (!phoneRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await exportPreview({
        frameEl: phoneRef.current,
        username: profile.username,
      });
    } catch (err) {
      console.error("Export failed:", err);
      alert("Não foi possível exportar. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, profile.username]);

  const updateProfile = useCallback((partial: Partial<ProfileData>) => {
    setProfile(p => ({ ...p, ...partial }));
  }, []);

  /* ─────────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#0a0a0a]">
      <Topbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onReset={handleReset}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          profile={profile}
          onProfileChange={updateProfile}
          highlights={highlights}
          onHighlightsChange={setHighlights}
          feed={feed}
          onFeedChange={setFeed}
        />

        {/* Preview canvas */}
        <main className="relative flex-1 overflow-y-auto bg-slate-100 dark:bg-[#0a0a0a] flex items-start justify-center py-8 px-4">

          {/* Dot grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* Hint label */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-600">
              <span>Preview — arraste as fotos do feed para reorganizar</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
              </svg>
            </div>

            {/* Phone frame — ref passed here for html2canvas */}
            <div ref={phoneRef}>
              <PhonePreview
                profile={profile}
                highlights={highlights}
                feed={feed}
                onFeedReorder={setFeed}
              />
            </div>

            {/* Exporting overlay hint */}
            {isExporting && (
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
                Capturando preview...
              </div>
            )}

            {/* Footer */}
            <p className="text-[11px] text-slate-400 dark:text-slate-600 text-center pb-4">
              InstaPreview é open-source e não se conecta ao Instagram.{" "}
              <a
                href="https://www.guebly.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-ig-red dark:hover:text-ig-red transition"
              >
                Feito pela Guebly
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
