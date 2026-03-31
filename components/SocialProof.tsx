"use client";
import { motion } from "framer-motion";
import { Users, TrendingUp, Award, Star } from "lucide-react";

export default function SocialProof() {
  const stats = [
    { icon: Users, value: "15.000+", label: "Usuários ativos" },
    { icon: TrendingUp, value: "127%", label: "Crescimento médio" },
    { icon: Award, value: "200+", label: "Marcas atendidas" },
    { icon: Star, value: "4.9/5", label: "Avaliação média" },
  ];

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="text-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-emerald-100 dark:border-emerald-900"
          >
            <stat.icon size={16} className="mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{stat.value}</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-950 border border-emerald-100 dark:border-emerald-900">
        <p className="text-xs text-center text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
          ✨ <span className="font-semibold text-emerald-600 dark:text-emerald-400">InstaPreview</span> é mantido pela{" "}
          <a href="https://guebly.com.br?ref=instapreview-footer" target="_blank" rel="noopener" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Guebly
          </a>
          , plataforma de crescimento orgânico do Instagram
        </p>
        <a
          href="https://guebly.com.br/sobre?ref=instapreview-about"
          target="_blank"
          rel="noopener"
          className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline block text-center"
        >
          Conheça nossos serviços →
        </a>
      </div>
    </div>
  );
}
