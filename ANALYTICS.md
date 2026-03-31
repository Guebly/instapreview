# 📊 Analytics & Conversion Tracking

## Estratégia de Conversão

O InstaPreview funciona como **lead magnet** para a Guebly. Os CTAs aparecem em momentos estratégicos:

### 🎯 Momentos de Conversão

| Trigger | CTA | Timing |
|---------|-----|--------|
| **Score ≥ 75** | "Parabéns! Quer transformar em resultados?" | Após análise |
| **Score < 50** | "Difícil melhorar sozinho. Guebly ajuda!" | Após 6+ fotos |
| **Competidor vencido** | "Domine seu nicho com Guebly" | Ao ver análise comparativa |
| **PDF exportado** | Toast: "Guebly pode ajudar na execução" | Após download |
| **3+ features usadas** | "Consultoria grátis para power users" | Detecção automática |

---

## 🔧 Implementação de Analytics

### 1. Adicionar Google Analytics

```tsx
// app/layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### 2. Integrar com lib/analytics.ts

```typescript
// lib/analytics.ts
export function trackEvent(event: AnalyticsEvent, data?: EventData): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, data);
  }
}
```

### 3. Eventos Importantes

```typescript
// Conversão principal
trackConversion('high-score', profile.username);

// Funil
trackFunnel('landed');
trackFunnel('used_template');
trackFunnel('saw_analysis');
trackFunnel('exported_pdf');
trackFunnel('clicked_cta');

// Power users
detectPowerUser(['template', 'analysis', 'export', 'pattern']);
```

---

## 📈 Métricas para Acompanhar

### Funil de Conversão

```
100% - Visitantes
 60% - Carregaram template OU sample images
 40% - Viram análise completa
 15% - Exportaram PDF
  5% - Clicaram CTA
  2% - Viraram leads (formulário Guebly)
  0.5% - Viraram clientes
```

### KPIs Críticos

1. **Conversion Rate** (CTA clicks / Total visitors)
2. **Power User Rate** (Users com 3+ features / Total)
3. **PDF Export Rate** (Exports / Sessions)
4. **Template Load Rate** (Templates loaded / Visitors)
5. **Time to CTA** (Tempo médio até clicar CTA)

---

## 🎨 A/B Tests Sugeridos

### Teste 1: Timing do CTA
- **A:** CTA após score (atual)
- **B:** CTA após 3 features usadas

### Teste 2: Copy do CTA
- **A:** "Falar com especialista"
- **B:** "Consultoria grátis 15min"
- **C:** "Ver planos e preços"

### Teste 3: Social Proof
- **A:** Com números (15.000+ usuários)
- **B:** Sem números
- **C:** Com depoimentos

---

## 🔌 Integrações Recomendadas

### PostHog (Recomendado)
```typescript
// Tracking + Session Replay + Feature Flags
posthog.init('phc_XXXXX', {
  api_host: 'https://app.posthog.com',
  autocapture: true,
  session_recording: { recordCrossOriginIframes: true }
});
```

### Mixpanel (Alternativa)
```typescript
mixpanel.init('YOUR_TOKEN');
mixpanel.track('CTA Click', { type: 'high-score', username });
```

### Hotjar (Heatmaps)
```html
<!-- Entender onde usuários clicam -->
<script>
  (function(h,o,t,j,a,r){...})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## 💰 ROI Tracking

### Setup Conversion Value

```typescript
// Quando usuário vira lead
trackConversion('lead_created', {
  source: 'instapreview',
  username: profile.username,
  score: harmonyScore,
  value: 500, // Valor estimado de um lead qualificado
});

// Quando vira cliente (webhook da Guebly)
trackConversion('customer_converted', {
  source: 'instapreview',
  plan: 'pro',
  value: 1200, // MRR ou deal size
});
```

### Dashboard Recomendado

```
┌─────────────────────────────────────────┐
│  InstaPreview → Guebly Funnel          │
├─────────────────────────────────────────┤
│  Visitors: 10.000/mês                   │
│  Template loads: 6.000 (60%)            │
│  Analysis views: 4.000 (40%)            │
│  PDF exports: 1.500 (15%)               │
│  CTA clicks: 500 (5%)                   │
│  Leads: 200 (2%)                        │
│  Customers: 50 (0.5%)                   │
│                                         │
│  Revenue from InstaPreview: R$ 60.000  │
│  CAC via InstaPreview: R$ 0 (orgânico) │
│  LTV estimado: R$ 3.600                 │
│  ROI: ∞ (ferramenta grátis)            │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

1. Escolher ferramenta: **PostHog** (grátis até 1M events)
2. Adicionar script no `app/layout.tsx`
3. Descomentar tracking em `lib/analytics.ts`
4. Deploy e acompanhar dashboard
5. Iterar CTAs baseado em dados

---

## 📧 Email Automation (Opcional)

### Trigger Emails

```typescript
// Após export PDF mas sem CTA click em 24h
if (exported && !clickedCTA && timeSince > 24h) {
  sendEmail('pdf_followup', {
    subject: "Gostou da análise? 🚀",
    body: "Vimos que você exportou uma proposta. Precisa de ajuda?"
  });
}

// Power user sem conversão
if (powerUser && !clickedCTA) {
  sendEmail('power_user_invite', {
    subject: "Convite exclusivo para consultoria grátis",
  });
}
```

---

## ✅ Checklist de Implementação

- [ ] Escolher analytics tool (PostHog/GA4/Mixpanel)
- [ ] Adicionar script tracking no layout
- [ ] Descomentar tracking em `lib/analytics.ts`
- [ ] Configurar conversões no analytics
- [ ] Setup dashboard de funil
- [ ] Testar todos eventos (dev tools)
- [ ] Configurar alertas (queda conversão)
- [ ] Setup A/B tests
- [ ] Integrar com CRM da Guebly
- [ ] Webhook lead → Guebly database

---

**Status atual:** CTAs implementados, tracking preparado mas desabilitado.  
**Próximo passo:** Descomentar tracking e conectar com ferramenta escolhida.
