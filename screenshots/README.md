# Cheerio Growth Guide — Prototype Visual Documentation & Walkthrough

This directory documents the user interface, interaction flows, and visual hierarchy of the **Cheerio Growth Guide** prototype.

---

## Screen Inventory & Visual Architecture

### 1. Screen 1: Simulated Sign-in & Demo Entry (`/`)
- **Visual Design**: Split-screen SaaS onboarding interface.
- **Left Panel**: Slate-900 gradient branding with glowing ambient teal/emerald orbs, product pillars (Smart Recommendations, Guided Setup, Track Progress).
- **Right Panel**: Demo welcome card featuring "Glow Theory" D2C skincare context (Priya Sharma, WhatsApp campaign user, non-technical), demo mode disclaimer, and high-contrast "Explore Demo" CTA.
- **Key Flow**: Direct one-click entry simulating authentication into the tenant workspace.

### 2. Screen 2: Business Dashboard (`/dashboard`)
- **Visual Design**: Clean executive dashboard on off-white (`#FAFBFC`) background with subtle card borders.
- **Header**: Time-aware greeting ("Good morning, Priya"), tenant tag, and 30-day date range badge.
- **Metric Cards**: Total Customers (2,450, +12.3%), Active Customers (1,820, 74%), Campaigns Sent (24), and Avg Response Time (2.4 hrs).
- **Campaign Funnel**: Visual progression of WhatsApp message delivery (Sent 12.4k → Delivered 95% → Read 72% → Clicked 17% → Replied 7%).
- **Growth Guide Hero Banner**: Prominent teal/emerald recommendation card highlighting the 2.4-hour response lag opportunity, with a direct CTA "Find my next growth opportunity".
- **Feature Status & Activity Split**: Real-time adoption status badges (Active, In Progress, Not Started) paired with live chronological activity feed.

### 3. Screen 3: Growth Guide Overview & Assessment (`/growth-guide`)
- **Mode 1 — Guided Assessment**: 3-question diagnostic wizard with step progress tracker:
  - *Q1 (Goal)*: "Answer customer questions faster", "Follow up with interested customers", "Understand and segment customers".
  - *Q2 (Time Sink)*: "Repeating the same answers", "Manually following up", "Finding the right audience".
  - *Q3 (Current Features)*: Checkbox selection of existing tools (WhatsApp campaigns pre-selected).
- **Mode 2 — Growth Recommendations**:
  - Hero recommendation card tailored to assessment results (e.g., AI FAQ Chatbot for support goals).
  - Highlights problem solved ("68% repetitive queries"), expected outcome, ~15 min setup estimate.
  - Secondary catalog of other high-impact growth levers (Follow-up Automation, Smart CRM Segmentation).

### 4. Screen 4: Recommendation Detail (`/growth-guide/recommend/[featureId]`)
- **Visual Design**: Deep-dive feature case study and prerequisite breakdown.
- **Structure**:
  - The Problem (amber accent border detailing support backlogs).
  - Recommended Solution (teal accent border detailing automated 24/7 concierge).
  - What You Will Get (4 distinct capability benefit cards).
  - Setup Prerequisites (~15 min illustrative timeframe, required assets).
  - Plan Eligibility Callout (Growth & Enterprise tier verification notice).
  - Action Bar: Primary "Set Up This Feature" and secondary "Choose Another Feature".

### 5. Screen 5: AI FAQ Chatbot Setup Wizard (`/growth-guide/setup/chatbot`)
- **6-Step Interactive Wizard**:
  - *Step 0 (Use Cases)*: Multi-select cards for Product FAQs, Delivery, Returns, and Order Status.
  - *Step 1 (FAQ Editor)*: Dynamic list of editable questions/answers, live add/delete FAQ rows, category tags, and blank-field validation.
  - *Step 2 (Fallback Configuration)*: Configurable fallback message, simulated human handoff toggle, and live chat preview bubble.
  - *Step 3 (Sandbox Preview & Test)*: Interactive WhatsApp chat simulator with quick query pills, real-time message sending, fuzzy token matching against configured FAQs, fallback routing, and chat reset.
  - *Step 4 (Review)*: Complete configuration summary card and required review confirmation checkbox.
  - *Step 5 (Activation)*: 2-second realistic deployment simulation, local state update to "Active in demo", audit event logging, and success confirmation view.

### 6. Screen 6: Follow-Up Automation Configuration (`/growth-guide/setup/automation`)
- **5-Step Flow**:
  - *Step 0 (Trigger)*: Radio selection of high-intent triggers (Campaign Click, Cart Abandonment, No Reply, New Signup).
  - *Step 1 (Audience & Delay)*: Audience cohorts with contact counts and dropdown delay selector (1h to 72h).
  - *Step 2 (Message & Preview)*: Auto-populated template with variable placeholders (`{{name}}`, `{{business}}`) and realistic WhatsApp mobile preview card.
  - *Step 3 (Review)*: Summary review with confirmation checkbox.
  - *Step 4 (Activation)*: Simulated activation, state updates, toast notification, and status badge update.

### 7. Screen 7: CRM Segmentation Preview (`/growth-guide/setup/crm`)
- **Visual Design**: Interactive audience intelligence workspace.
- **Segment Cards**: 4 cohorts (VIP High Engagement, High Purchase Intent, Recent First-Time Buyers, Inactive at Risk).
- **Interactive Customer Table**: 8 realistic demo profiles with engagement score color bars (>70 green, 40-70 yellow, <40 red) and fictitious data disclaimer.
- **Actionable Broadcast Card**: Tailored message recommendation with instant "Activate Segmentation" flow.

### 8. Screen 8: Growth Analytics & Progress (`/analytics`)
- **North Star Metric Card**: High-visibility dark card displaying "Feature Activation & Meaningful Use Rate" with 3-month target hypothesis (+10 pp) and 2-week baseline note.
- **Supporting Metrics Grid**: Recommendation-to-Activation Conversion, 7-Day Meaningful Use Rate, and 30-Day Cohort Retention.
- **Interactive Recharts Trend**: 6-week historical adoption curve showing impressions, engagements, and activations.
- **Feature Adoption Breakdown**: Comparative progress bars for Chatbot, Automation, and CRM.
- **Audit Timeline**: Live event ledger distinguishing session-triggered activations from baseline demo logs.

### 9. Screen 9: Settings & Demo Controls (`/settings`)
- **Session Status**: Live indicator of assessment completion, active features count, and recorded session events.
- **Feature Status Table**: Status badges and icons for all three core features.
- **Demo Reset Modal**: Safe confirmation modal to purge `localStorage` and reset state to pristine defaults.
- **Prototype Disclaimers**: Transparent disclosure that all actions are simulated and operate without external APIs.
