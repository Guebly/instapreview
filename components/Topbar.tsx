"use client";
import { Moon, Sun, RotateCcw, Github, Download, Loader2 } from "lucide-react";
import IgIcon from "./IgIcon";
import type { AppTheme } from "@/lib/types";

interface TopbarProps {
  appTheme:    AppTheme;
  onToggleApp: () => void;
  onReset:     () => void;
  onExport:    () => Promise<void>;
  isExporting: boolean;
}

export default function Topbar({ appTheme, onToggleApp, onReset, onExport, isExporting }: TopbarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 sm:px-6
      border-b border-slate-200 dark:border-slate-800
      bg-white dark:bg-[#0e0e0e] flex-shrink-0 z-20">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3">
        <IgIcon size={22} />
        <div className="flex items-baseline gap-2">
          <span className="font-black text-slate-900 dark:text-white text-[15px] tracking-tight">
            InstaPreview
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ig-gradient text-white leading-none">
            beta
          </span>
        </div>
      </div>

      {/* ── Guebly center branding ── */}
      <a
        href="https://www.guebly.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg
          border border-slate-200 dark:border-slate-800
          hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
      >
        <img
          src="https://www.guebly.com.br/guebly.png"
          alt="Guebly"
          className="w-5 h-5 rounded-md object-contain"
          onError={(e: any) => (e.target.style.display = "none")}
        />
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
          by Guebly
        </span>
      </a>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/guebly/instapreview"
          target="_blank"
          rel="noopener noreferrer"
          title="Ver no GitHub"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            border border-slate-200 dark:border-slate-800
            text-slate-600 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Github size={13} />
          Open-source
        </a>

        {/* Export */}
        <button
          onClick={onExport}
          disabled={isExporting}
          title="Exportar como PNG"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            border border-slate-200 dark:border-slate-800
            text-slate-600 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800 transition
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          <span className="hidden sm:inline">{isExporting ? "Gerando…" : "Exportar PNG"}</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Resetar tudo"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            border border-slate-200 dark:border-slate-800
            text-slate-600 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Resetar</span>
        </button>

        {/* App theme toggle */}
        <button
          onClick={onToggleApp}
          title={appTheme === "dark" ? "Modo claro (app)" : "Modo escuro (app)"}
          className="flex items-center justify-center w-8 h-8 rounded-lg
            border border-slate-200 dark:border-slate-800
            text-slate-600 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {appTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
