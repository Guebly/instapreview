import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaPreview by Guebly — Simulador de Feed do Instagram",
  description: "Simule e visualize como ficará seu perfil do Instagram antes de publicar. Arraste fotos, teste destaques, bio e foto de perfil. Gratuito e open-source.",
  keywords: ["instagram", "feed", "simulador", "preview", "guebly", "drag drop"],
  authors: [{ name: "Guebly", url: "https://www.guebly.com.br" }],
  openGraph: {
    title: "InstaPreview by Guebly",
    description: "Simule seu feed do Instagram com drag & drop. Grátis e open-source.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><defs><linearGradient id='ig' x1='0%25' y1='100%25' x2='100%25' y2='0%25'><stop offset='0%25' stop-color='%23f09433'/><stop offset='22%25' stop-color='%23e6683c'/><stop offset='45%25' stop-color='%23dc2743'/><stop offset='72%25' stop-color='%23cc2366'/><stop offset='100%25' stop-color='%23bc1888'/></linearGradient></defs><rect width='24' height='24' rx='6' fill='url(%23ig)'/><rect x='4' y='4' width='16' height='16' rx='4' fill='none' stroke='white' stroke-width='1.8'/><circle cx='12' cy='12' r='3.5' fill='none' stroke='white' stroke-width='1.8'/><circle cx='16.5' cy='7.5' r='1' fill='white'/></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Theme script runs before render to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('instapreview-theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body style={{ WebkitFontSmoothing: "antialiased" } as any}>
        {children}
      </body>
    </html>
  );
}
