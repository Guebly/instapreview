<div align="center">

<img src="https://www.guebly.com.br/guebly.png" alt="Guebly" width="48" height="48" style="border-radius: 12px" />

# InstaPreview

**Simulador de feed do Instagram — open-source, sem login, com drag & drop**

[![MIT License](https://img.shields.io/badge/license-MIT-dc2743?style=flat-square)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06b6d4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Feito pela Guebly](https://img.shields.io/badge/feito%20por-Guebly-e6683c?style=flat-square)](https://www.guebly.com.br)

[🚀 Demo ao vivo](https://instapreview.guebly.com.br) · [📦 Releases](https://github.com/guebly/instapreview/releases) · [🐛 Reportar bug](https://github.com/guebly/instapreview/issues)

</div>

---

## O que é?

O **InstaPreview** é uma ferramenta gratuita e open-source que permite simular como ficará seu perfil do Instagram **antes de publicar qualquer coisa**. Tudo acontece localmente no seu navegador — nenhum dado é enviado para servidores, nenhuma conta é necessária.

### Por que isso existe?

Ferramentas como Planoly, Later, UNUM e Preview App são ótimas, mas:

- ✗ Exigem login com sua conta do Instagram
- ✗ São pagas (ou têm limite no plano grátis)
- ✗ Não permitem drag & drop completamente livre
- ✗ Não têm controle total sobre bio, destaques e layout

O InstaPreview resolve isso sendo **100% client-side**, open-source e sem nenhuma integração com a API do Instagram.

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---------|-----------|
| 📸 **Foto de perfil** | Upload e preview em tempo real com o anel de degradê do Instagram |
| ✏️ **Bio completa** | Nome, username, biografia multilinha e link clicável |
| 📊 **Estatísticas** | Edite posts, seguidores e seguindo livremente |
| ⭕ **Destaques** | Crie, nomeie e adicione capas aos stories em destaque |
| 🖼️ **Feed drag & drop** | Arraste as fotos para reorganizar a grade 3×N do feed |
| 📱 **Frame de celular** | Preview realista dentro de um frame de smartphone |
| 🌙 **Dark / Light mode** | Alternância com persistência em `localStorage` |
| 🔒 **100% privado** | Nenhuma imagem sai do seu navegador |
| 📤 **Importação múltipla** | Importe várias fotos de uma vez para o feed |

---

## 🛠️ Stack técnica

- **[Next.js 14](https://nextjs.org/)** — App Router, SSR opcional
- **[TypeScript 5](https://typescriptlang.org/)** — tipos em todo o projeto
- **[Tailwind CSS 3](https://tailwindcss.com/)** — utilitários + dark mode por classe
- **[Lucide React](https://lucide.dev/)** — ícones consistentes
- **HTML5 Drag & Drop API** + **Touch Events** — sem dependências externas para o drag

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm, yarn ou pnpm

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/guebly/instapreview.git
cd instapreview

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build de produção

```bash
npm run build
npm start
```

---

## 📁 Estrutura do projeto

```
instapreview/
├── app/
│   ├── layout.tsx          # Layout raiz com metadados e anti-flash de tema
│   ├── globals.css         # Reset, utilitários do IG gradient, drag states
│   └── page.tsx            # Página principal — gerencia todo o estado
│
├── components/
│   ├── Topbar.tsx          # Barra superior: logo, Guebly, dark mode, reset
│   ├── Sidebar.tsx         # Painel lateral com 3 abas (Perfil / Destaques / Feed)
│   ├── PhonePreview.tsx    # Frame de celular com o perfil do Instagram simulado
│   ├── DraggableFeedGrid.tsx # Grade de feed com drag & drop (desktop + touch)
│   └── IgIcon.tsx          # Ícone do Instagram com gradiente oficial
│
├── lib/
│   ├── types.ts            # ProfileData, Highlight, FeedImage, Theme, SidebarTab
│   └── utils.ts            # uid(), readFileAsDataURL(), saveTheme(), loadTheme()
│
├── public/                 # Assets estáticos
├── next.config.js
├── tailwind.config.js      # darkMode: "class", cores ig-*, keyframes
├── tsconfig.json
└── package.json
```

---

## 🧩 Arquitetura de estado

Todo o estado vive em `app/page.tsx` e é passado para baixo via props — sem Context API ou Zustand, de propósito: o projeto é simples o suficiente para não precisar.

```
page.tsx
├── ProfileData      → Sidebar (edição) + PhonePreview (exibição)
├── Highlight[]      → Sidebar (edição) + PhonePreview (exibição)
├── FeedImage[]      → Sidebar (edição) + DraggableFeedGrid (drag & drop)
└── Theme            → Topbar (toggle) + document.documentElement (classe)
```

### Como o drag & drop funciona

O `DraggableFeedGrid` implementa a **HTML5 Drag & Drop API** para desktop e **Touch Events** para mobile, sem bibliotecas externas:

```
onDragStart(id)   → salva o id da imagem sendo arrastada
onDragOver(id)    → marca o id do slot alvo
onDrop(targetId)  → reordena o array via splice + insert
onTouchMove       → detecta o elemento sob o dedo via elementFromPoint()
onTouchEnd        → executa o mesmo reorder
```

---

## 🎨 Design system

### Gradiente do Instagram

Definido como constante e utilitário CSS em todo o projeto:

```css
/* globals.css */
.ig-gradient {
  background: linear-gradient(135deg,#f09433 0%,#e6683c 22%,#dc2743 45%,#cc2366 72%,#bc1888 100%);
}
.ig-text {
  background: linear-gradient(135deg,...);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

```js
// tailwind.config.js
colors: {
  ig: {
    orange: "#f09433",
    coral:  "#e6683c",
    red:    "#dc2743",
    pink:   "#cc2366",
    purple: "#bc1888",
  }
}
```

### Dark mode

Implementado via `darkMode: "class"` no Tailwind. Um script inline no `<head>` do layout lê o `localStorage` antes do primeiro render para evitar o "flash" de tema errado (FOUC).

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

```bash
# 1. Fork o repositório no GitHub

# 2. Crie uma branch com o nome da sua feature
git checkout -b feat/nome-da-feature

# 3. Faça suas alterações e commite seguindo Conventional Commits
git commit -m "feat: adicionar exportação como PNG"

# 4. Push e abra um Pull Request
git push origin feat/nome-da-feature
```

### Conventional Commits

| Prefixo | Quando usar |
|---------|------------|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `chore:` | Manutenção, deps, configs |
| `refactor:` | Refatoração sem mudança de comportamento |
| `docs:` | Apenas documentação |
| `style:` | Formatação, espaços, sem lógica |

### Ideias de contribuição

- [ ] Exportar preview como PNG (html2canvas)
- [ ] Simular modo de edição de Stories
- [ ] Preview de post individual (carousel)
- [ ] Compartilhar configuração via URL (query params / hash)
- [ ] Suporte a vídeos (.mp4) no feed
- [ ] Internacionalização (i18n)

---

## 📝 Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](./LICENSE) para mais detalhes.

---

<div align="center">

Feito com ❤️ pela [Guebly](https://www.guebly.com.br) · plataforma de inteligência para Instagram

</div>
