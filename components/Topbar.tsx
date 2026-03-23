"use client";
import { Moon, Sun, RotateCcw, Github } from "lucide-react";
import IgIcon from "./IgIcon";

interface TopbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onReset: () => void;
}

export default function Topbar({ theme, onToggleTheme, onReset }: TopbarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-slate-800 dark:border-slate-800 border-slate-200 bg-white dark:bg-[#0e0e0e] flex-shrink-0 z-10">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <IgIcon size={22} />
        <div className="flex items-baseline gap-2">
          <span className="font-black text-slate-900 dark:text-white text-[15px] tracking-tight">
            InstaPreview
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ig-gradient text-white">
            beta
          </span>
        </div>
      </div>

      {/* Center: by Guebly */}
      <a
        href="https://www.guebly.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity"
      >
        <img
          src="https://www.guebly.com.br/guebly.png"
          alt="Guebly"
          className="w-5 h-5 rounded object-contain"
          onError={(e: any) => (e.target.style.display = "none")}
        />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-500">
          by Guebly
        </span>
      </a>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/guebly/instapreview"
          target="_blank"
          rel="noopener noreferrer"
          title="Ver no GitHub"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Github size={13} />
          Open-source
        </a>

        <button
          onClick={onReset}
          title="Resetar tudo"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Resetar</span>
        </button>

        <button
          onClick={onToggleTheme}
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
