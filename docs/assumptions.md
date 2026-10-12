# Assumptions & Constraints — Cheerio Growth Guide

## Product Assumptions

### About the Target User
1. **Business owners are time-constrained.** They prefer guided, opinionated recommendations over a feature catalogue that requires self-exploration.
2. **Goal alignment drives adoption.** Connecting a feature to a specific business objective (e.g., "answer questions faster") is more motivating than feature-centric messaging (e.g., "try our chatbot").
3. **Step-by-step guidance reduces friction.** A multi-step wizard with validation and preview is preferred over a single complex form.
4. **Preview builds confidence.** Allowing users to test a chatbot or preview an automation before activation reduces anxiety about deploying to real customers.
5. **Progress visibility motivates continuation.** Showing a growth journey and tracking activations encourages users to explore additional features.

### About the Problem
1. **Feature underutilization is a meaningful churn factor.** Users who only use campaigns are at higher risk of disengaging than users who adopt multiple features.
2. **Discovery, not capability, is the blocker.** Cheerio already has the features; the challenge is surfacing the right feature at the right time.
3. **Three features cover the most common gaps.** Chatbot, automation, and CRM segmentation represent the highest-impact features for a D2C brand that currently only uses campaigns.

### About the Metric
1. **Feature activation is a leading indicator of retention.** Users who activate more features are more likely to remain active.
2. **"Meaningful use" is distinct from activation.** Simply clicking "activate" is insufficient; the feature must be used in a qualifying way (e.g., the chatbot handles conversations, the automation triggers follow-ups).
3. **A 10-percentage-point improvement is ambitious but plausible.** This target is a hypothesis and would require validation through experimentation.

---

## Technical Assumptions

1. **No backend required for the prototype.** All data is static mock data and all persistence is browser-local.
2. **localStorage is sufficient for demo persistence.** The prototype does not need cross-device or cross-session sync.
3. **Deterministic recommendations are adequate for demonstration.** The goal-to-feature mapping is intentionally simple. A production version would use ML-based scoring.
4. **Simple word-overlap FAQ matching is sufficient for the demo.** The FAQ test simulator uses basic string matching. A production version would use NLP or vector similarity.
5. **React Context is adequate for state management.** The prototype's state complexity does not warrant Redux, Zustand, or a server-side store.
6. **No real-time data or WebSocket connections are needed.** All updates are synchronous and local.

---

## Constraints

### Prototype Scope
- **No real authentication or authorization.** The sign-in screen is simulated.
- **No real message sending.** WhatsApp, SMS, and email are simulated.
- **No real AI/ML.** Recommendations use deterministic rules; chatbot matching uses word overlap.
- **No real customer data.** All customers, metrics, and business data are fictional.
- **No production deployment.** The prototype runs locally via `npm run dev`.

### Design Constraints
- **Original UI only.** No official Cheerio logos, brand assets, or claims about actual product behavior are used.
- **Simulated estimates are clearly labeled.** Any projected metric, setup duration, or outcome is marked as illustrative.
- **Demo data is distinguished from session events.** Seeded analytics data is visually separated from events generated during the user's session.

### Technical Constraints
- **No paid API keys or external credentials.** The demo runs without any third-party service dependencies.
- **No secrets in frontend code.** No environment variables or API keys are used.
- **Browser compatibility.** Tested primarily on Chromium-based browsers. No IE11 support.
- **No i18n.** English only for this prototype.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Users may perceive recommendations as generic | Medium | High | Assessment questions personalize the recommendation; rationale is shown explicitly |
| Setup wizard may feel too long | Low | Medium | Stepper shows progress; steps are short (1-2 actions each) |
| FAQ matching may produce poor results | Medium | Low | Fallback behavior is well-configured; users can edit FAQs and re-test |
| Users may not understand it's a demo | Low | Medium | Demo banners, prototype notices, and "illustrative" labels are shown throughout |
| Local state may be lost unexpectedly | Low | Low | Reset functionality is prominent; state loss is acceptable in a prototype |

---

## Open Questions (For Production Consideration)

1. **How should the recommendation engine evolve?** Current: deterministic lookup. Future: ML-based scoring with user behavior signals?
2. **Should Growth Guide be a persistent sidebar or a standalone page?** The prototype uses a standalone page; a sidebar might improve contextual access.
3. **How should "meaningful use" thresholds be calibrated?** Current: any qualifying use event. Future: minimum thresholds per feature?
4. **Should recommendations refresh based on new usage data?** Current: static after assessment. Future: dynamic re-ranking?
5. **How should Growth Guide interact with Cheerio's existing onboarding?** Integration points need definition.
