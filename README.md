# Cheerio Growth Guide

> **"Your next best growth move."**

An interactive product prototype for the Cheerio AI Product Intern Assignment (Assignment B). This prototype demonstrates how contextual, goal-based feature recommendations can increase feature discovery, activation, and retention for Cheerio's business users.

---

## 🎯 What This Is

Cheerio Growth Guide is a **clickable, functional prototype** that shows how a guided feature discovery experience could help businesses discover and activate unused Cheerio features. It is **not** a production integration — all data is illustrative, no real messages are sent, and no actual AI models are called.

### Demo Business

- **Business:** Glow Theory (fictional D2C skincare brand)
- **Owner:** Priya Sharma
- **Current usage:** WhatsApp campaigns only
- **Opportunity:** Chatbots, automations, and CRM segmentation are unused

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
cd cheerio-growth-guide
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📱 The Journey

1. **Demo Entry** — Welcome screen explaining the prototype context
2. **Business Dashboard** — Overview of Glow Theory's metrics, feature status, and Growth Guide recommendation
3. **Growth Guide** — Three-question assessment to understand goals, then personalized feature recommendations
4. **Recommendation Detail** — Deep dive into why a feature is recommended, with setup info
5. **Setup Wizard (Chatbot)** — Full 6-step wizard: use cases → FAQ configuration → fallback → preview & test → review → activation
6. **Automation Setup** — Configure triggers, audience, delay, and message for follow-up automations
7. **CRM Segmentation** — Explore customer segments, view demo data, activate segmentation
8. **Analytics & Progress** — Track feature adoption metrics, North Star metric, and activity timeline
9. **Settings** — Demo controls, reset functionality, and session status

---

## 🏗 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework and routing |
| React 18 + TypeScript | UI components and type safety |
| Tailwind CSS | Styling and design system |
| Lucide React | Icon library |
| Recharts | Analytics charts |
| react-hot-toast | Toast notifications |
| localStorage | Demo state persistence |

No backend, database, or third-party API keys are required.

---

## 🧭 Project Structure

```
cheerio-growth-guide/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Demo entry (Screen 1)
│   │   ├── dashboard/          # Business dashboard (Screen 2)
│   │   ├── growth-guide/       # Growth Guide and setup wizards
│   │   │   ├── page.tsx        # Assessment + recommendations (Screen 3)
│   │   │   ├── recommend/      # Recommendation detail (Screen 4)
│   │   │   └── setup/          # Feature setup wizards
│   │   │       ├── chatbot/    # FAQ chatbot wizard (Screen 5)
│   │   │       ├── automation/ # Automation setup (Screen 6)
│   │   │       └── crm/        # CRM segmentation (Screen 7)
│   │   ├── analytics/          # Analytics & progress (Screen 8)
│   │   └── settings/           # Settings & demo controls (Screen 9)
│   ├── components/
│   │   ├── ui/                 # Design system components
│   │   └── layout/             # App shell and navigation
│   ├── data/
│   │   └── mock-data.ts        # All sample/seed data
│   ├── lib/
│   │   ├── store.ts            # React Context state management
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── docs/
│   ├── product-spec.md         # Product specification
│   ├── architecture.md         # Architecture decisions
│   ├── assumptions.md          # Assumptions and constraints
│   └── ai-usage-log-template.md # AI usage log template
├── tests/                      # Test files
└── public/                     # Static assets
```

---

## 🔑 Key Design Decisions

1. **Deterministic recommendations** — Feature suggestions use a simple goal-to-feature mapping, not AI. This keeps the prototype self-contained and makes the recommendation logic transparent.

2. **Local state persistence** — All demo state is stored in `localStorage` under `cheerio-growth-guide-state`. This survives browser refreshes but can be fully reset from Settings.

3. **Simulated everything** — Authentication, chatbot testing, message sending, feature activation, and analytics are all simulated. The UI makes this explicit at every step.

4. **Component-first design** — A shared design system (`src/components/ui/`) ensures visual consistency. All components are typed and reusable.

---

## 🎯 North Star Metric

**"Percentage of monthly active businesses that activate and meaningfully use at least one previously unused Cheerio feature within 30 days."**

- **Target:** +10 percentage points within 3 months (hypothesis, not proven)
- **Measurement:** Proposed 2-week baseline period before experiment
- **Supporting metrics:** Recommendation-to-activation rate, 7-day meaningful use, 30-day retention

See [docs/product-spec.md](docs/product-spec.md) for full metric definitions.

---

## ⚠️ Important Disclaimers

- **No real authentication** — The sign-in screen is simulated
- **No real messages** — WhatsApp, SMS, and email sending is simulated
- **No real AI** — Recommendations and chatbot matching use deterministic rules
- **No real customer data** — All customers and metrics are fictional
- **Demo data** — All numbers are illustrative and clearly labeled as such
- **Not production code** — This is a prototype for demonstrating a product concept

---

## 🧪 Testing

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Production build test
npm run build
```

See the [Testing section in docs/architecture.md](docs/architecture.md) for detailed test instructions.

---

## 📄 Documentation

- [Product Specification](docs/product-spec.md)
- [Architecture Decisions](docs/architecture.md)
- [Assumptions & Constraints](docs/assumptions.md)
- [AI Usage Log Template](docs/ai-usage-log-template.md)

---

## 📋 Known Limitations

1. Analytics charts use seeded data — session events are reflected but the trend visualization is primarily illustrative
2. The FAQ matching algorithm is basic (word overlap) — a production version would use NLP or vector similarity
3. No i18n or RTL support
4. Responsive design optimized for desktop first, functional on mobile
5. No actual deployment pipeline included

---

Built for the Cheerio AI Product Intern Assignment (Assignment B).
