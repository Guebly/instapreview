"use client";
import { motion } from "framer-motion";
import { ExternalLink, Sparkles, MessageCircle, TrendingUp } from "lucide-react";

interface Props {
  type: "high-score" | "low-score" | "power-user" | "post-export" | "competitor-leader";
  onDismiss?: () => void;
}

const CTA_CONFIG = {
  "high-score": {
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    emoji: "🎉",
    title: "Parabéns! Score excelente!",
    description: "Você tem potencial de crescimento orgânico. Quer transformar isso em resultados reais?",
    cta: "Falar com especialista Guebly",
    href: "https://guebly.com.br/consultoria?ref=instapreview-high",
  },
  "low-score": {
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-500",
    emoji: "📈",
    title: "Score baixo, mas tem solução!",
    description: "Melhorar sozinho é difícil. A Guebly já ajudou +200 marcas a crescerem 3x mais rápido.",
    cta: "Quero crescer meu Instagram",
    href: "https://guebly.com.br/consultoria?ref=instapreview-low",
  },
  "power-user": {
    icon: MessageCircle,
    gradient: "from-emerald-500 to-teal-500",
    emoji: "🚀",
    title: "Você é um power user!",
    description: "Já domina a ferramenta. Que tal uma consultoria gratuita de 15min com nosso time?",
    cta: "Agendar consultoria grátis",
    href: "https://guebly.com.br/consultoria-gratis?ref=instapreview-power",
  },
  "post-export": {
    icon: ExternalLink,
    gradient: "from-blue-500 to-cyan-500",
    emoji: "💼",
    title: "PDF exportado com sucesso!",
    description: "Apresente para seu cliente. Se quiser ajuda na execução, a Guebly cuida de tudo.",
    cta: "Ver planos empresariais",
    href: "https://guebly.com.br/planos?ref=instapreview-export",
  },
  "competitor-leader": {
    icon: Sparkles,
    gradient: "from-violet-500 to-purple-500",
    emoji: "👑",
    title: "Pronto para dominar seu nicho?",
    description: "Você viu o potencial. Agora descubra como a Guebly transforma análise em crescimento real.",
    cta: "Ver cases de sucesso",
    href: "https://guebly.com.br/cases?ref=instapreview-competitor",
  },
};

export default function CTACard({ type, onDismiss }: Props) {
  const config = CTA_CONFIG[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-5 rounded-2xl bg-gradient-to-r ${config.gradient} text-white shadow-xl relative overflow-hidden`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.emoji}</span>
            <Icon size={20} className="text-white" />
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-white/70 hover:text-white transition text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <h3 className="text-base font-bold mb-2">{config.title}</h3>
        <p className="text-sm text-white/90 mb-4 leading-relaxed">{config.description}</p>

        <a
          href={config.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white rounded-lg
            font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{ color: config.gradient.includes('purple') ? '#9333ea' : '#059669' }}
          onClick={() => {
            // Track conversion
            if (typeof window !== 'undefined') {
              // @ts-ignore - Analytics tracking
              window.trackConversion?.(type);
            }
          }}
        >
          {config.cta}
          <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  );
}
