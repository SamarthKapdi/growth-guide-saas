# Architecture Decisions — Cheerio Growth Guide

## Technology Choices

### Framework: Next.js 14 (App Router)

**Rationale:** Next.js provides file-system routing, server components, and a mature ecosystem. The App Router enables clean route organization that mirrors the product's screen hierarchy. For a prototype, it offers rapid development without sacrificing code organization.

**Alternative considered:** Vite + React Router. Rejected because Next.js provides more structure out of the box, which helps maintain consistency across a complex multi-page prototype.

### Styling: Tailwind CSS

**Rationale:** Utility-first CSS enables rapid prototyping while maintaining design consistency. All design tokens (colors, spacing, radii) are expressed directly in component code, making the visual system easy to audit and modify.

**Design tokens used:**
- Background: `#FAFBFC` (off-white)
- Text: `#1E293B` (dark slate)
- Primary accent: `#0D9488` (teal-600)
- Secondary accent: `#059669` (emerald-600)
- Cards: white with `border-gray-200` and `shadow-sm`
- Border radius: `rounded-lg` (8px) and `rounded-xl` (12px)

### State Management: React Context + localStorage

**Rationale:** For a prototype with moderate state complexity, React Context provides sufficient state management without the overhead of Redux or Zustand. State is persisted to localStorage for demo continuity across refreshes.

**Architecture:**
```
AppProvider (Context)
├── State object (AppState type)
├── Action functions (setAssessmentAnswers, updateFeatureStatus, etc.)
├── localStorage sync (on every state change)
└── Hydration guard (useEffect to prevent SSR mismatch)
```

**Key design decision:** Each route group (dashboard, growth-guide, analytics, settings) has its own layout.tsx that wraps children in `<AppProvider>`. This means state is shared across all pages within a session.

### Icons: Lucide React

**Rationale:** Lightweight, tree-shakeable icon library with consistent design. Provides all the icons needed (navigation, features, status indicators) without a heavy bundle.

### Charts: Recharts

**Rationale:** Used sparingly, only on the Analytics page where trend visualization materially improves the experience. Recharts provides responsive, composable chart components that integrate well with React.

### Notifications: react-hot-toast

**Rationale:** Lightweight toast library for success/error feedback. Provides a clean API and customizable styling that matches the design system.

---

## Architecture Patterns

### Component Architecture

```
src/
├── components/
│   ├── ui/          # Design system primitives (Button, Card, Badge, etc.)
│   └── layout/      # Shell components (AppLayout, sidebar, nav)
├── app/             # Pages (each screen is a page component)
├── lib/             # Business logic (store, utils)
├── data/            # Mock data (single source of truth)
└── types/           # TypeScript interfaces (shared across all layers)
```

**Design system components** (`src/components/ui/index.tsx`) are stateless, reusable, and styled with Tailwind. They accept variant props and compose into more complex patterns.

**Page components** (`src/app/*/page.tsx`) handle page-specific state, use the global store for cross-page state, and compose UI components.

### Data Flow

```
Mock Data (src/data/mock-data.ts)
    ↓
AppProvider (src/lib/store.ts)
    ↓ Context
Page Components (src/app/*/page.tsx)
    ↓ Props
UI Components (src/components/ui/)
    ↓
Rendered UI
```

### State Persistence

```
User action → dispatch action → update state → sync to localStorage
                                              → re-render components

Page load → read localStorage → hydrate state (or use defaults)
```

### Recommendation Engine

```
Assessment answers → ASSESSMENT_FEATURE_MAP lookup → FeatureId
    ↓
FeatureId → FEATURE_RECOMMENDATIONS filter → FeatureRecommendation
    ↓
Render recommendation detail + setup wizard
```

The recommendation engine is intentionally simple (deterministic lookup). This is explicitly documented as a prototype approach. The code is modular — replacing the lookup with an API call to a real ML service would require changes only in `store.ts`.

### FAQ Matching

```
User query → tokenize (lowercase, split by spaces)
    ↓
For each FAQ → tokenize question → count overlapping words
    ↓
Best match (≥2 overlapping words) or null (→ fallback)
```

---

## Route Structure

```
/                           → Demo entry (no AppProvider needed)
/dashboard                  → Business dashboard
/growth-guide               → Assessment + recommendations
/growth-guide/recommend/[id] → Recommendation detail
/growth-guide/setup/chatbot → Chatbot setup wizard
/growth-guide/setup/automation → Automation setup
/growth-guide/setup/crm     → CRM segmentation
/analytics                  → Analytics & progress
/settings                   → Settings & demo controls
```

Each route group has a `layout.tsx` that provides `AppProvider` and `Toaster`.

---

## Testing Strategy

### Type Checking
```bash
npx tsc --noEmit
```
Validates all TypeScript types across the codebase.

### Linting
```bash
npm run lint
```
ESLint with Next.js recommended rules.

### Build Verification
```bash
npm run build
```
Ensures production build succeeds without errors.

### Manual Testing Checklist

1. **Entry flow:** Click "Explore Demo" → lands on dashboard
2. **Dashboard:** All stats render, Growth Guide CTA works
3. **Assessment:** Complete 3 questions → get recommendation
4. **Recommendation detail:** View feature details, click setup
5. **Chatbot wizard:** Complete all 6 steps including FAQ editing and chat testing
6. **Automation:** Complete trigger → audience → message → activation
7. **CRM:** Select segment → view customers → activate
8. **Analytics:** Charts render, metrics update with session events
9. **Settings:** Reset demo → returns to entry screen
10. **Persistence:** Refresh browser → state preserved
11. **Responsive:** Check at 1440px, 768px, and 375px widths

---

## Performance Considerations

- **Bundle size:** Recharts is the largest dependency; it's only imported on the Analytics page
- **State updates:** Context re-renders are acceptable for a prototype; a production version would benefit from more granular state slices
- **localStorage:** Synchronous writes on every state change; acceptable for demo scale
- **No SSR data fetching:** All data is static mock data, so there's no waterfall concern

---

## Security Notes

- No API keys, secrets, or credentials in the codebase
- No external API calls
- No real authentication
- All data is local and fictional
- localStorage is used for demo persistence only
