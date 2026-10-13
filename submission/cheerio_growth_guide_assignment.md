# CHEERIO GROWTH GUIDE: PRODUCT SPECIFICATION & BUSINESS CASE
**Take-Home Assignment B: "Users don't know what they can do on Cheerio"**  
*Author: Cheerio AI Product Intern Candidate | Date: October 2026 | Document Version: 1.0*

---

<!-- PAGE 1 BREAK -->
## PAGE 1: USER PERSONA, PAIN POINTS & STRATEGIC PRIORITIZATION

### 1.1 Target User Persona
* **Name & Role:** Priya Sharma, Founder & Operator of **"Glow Theory"** (a direct-to-consumer skincare brand based in India).
* **Business Profile:** 2,450 customer profiles, 1,820 monthly active buyers, 24 WhatsApp broadcast campaigns sent to date.
* **Current Cheerio Adoption:** Active user of WhatsApp Broadcasts and bulk campaign messaging only. Zero adoption of automated chatbots, drop-off workflows, or CRM customer segmentation.
* **Technical Savvy:** Non-technical domain specialist. Prioritizes immediate marketing conversion, brand reputation, and operational time-efficiency over complex technical feature configuration.

### 1.2 Core Pain Points
1. **Repetitive Support Fatigue:** Customer queries regarding delivery timelines, product ingredients, and return policies consume 18+ hours per week of manual staff effort.
2. **Post-Click Drop-Off Blind Spot:** Customers who click broadcast links but do not purchase receive no automated re-engagement, resulting in missed conversions.
3. **Blanket Broadcast Inefficiency:** Marketing broadcasts are delivered identically to VIP buyers and dormant subscribers, resulting in fatigue and suboptimal ROI.
4. **Cognitive Feature Overload:** When exploring the platform, Priya sees a wide feature catalog but lacks contextual guidance on which capability solves her immediate business bottleneck.

### 1.3 Three Priority Features
* **Priority 1 — AI FAQ Chatbot (WhatsApp Concierge):** An automated virtual concierge resolving frequent skincare, order status, and return questions in under 3 seconds with fallback and human-handoff routing.
* **Priority 2 — Follow-Up Automation (Re-engagement Engine):** Event-triggered messaging rules nurturing campaign clickers, cart abandoners, and dormant prospects with configurable time delays (1h–72h).
* **Priority 3 — Smart CRM & Audience Segmentation:** Algorithmic cohort classification grouping customers by purchase intent, historical order frequency, and recency to deliver tailored broadcasts.

### 1.4 Alternatives Considered & Prioritization Rationale
* **Alternative A — Comprehensive Feature Directory / Help Center:** Rejected. Passive documentation requires user self-diagnosis and fails time-constrained SMB owners who abandon unguided setups.
* **Alternative B — Mandatory Onboarding Product Tour (Tooltips):** Rejected. Intrusive modal tours create friction on sign-in and introduce cognitive overload before the business has established intent.
* **Prioritization Matrix:**
  * *AI FAQ Chatbot:* High Impact (solves 18h/wk support backlog), Low Setup Friction (~15 min setup), Highest Time-to-Value. Selected as Tier 1.
  * *Follow-Up Automation:* High Impact (recovers broadcast drop-offs), Moderate Setup Friction (~10 min setup). Selected as Tier 2.
  * *Smart CRM Segmentation:* Moderate-to-High Impact (campaign relevance), Moderate Setup Friction (~8 min setup). Selected as Tier 3.

---

<!-- PAGE 2 BREAK -->
## PAGE 2: GROWTH GUIDE SOLUTION, USER JOURNEY & SPECIFICATION

### 2.1 The Growth Guide Solution
Cheerio Growth Guide (*"Your next best growth move"*) is an embedded activation copilot that continuously analyzes business metrics and usage patterns to prescribe, guide, and simulate high-impact feature adoption. Rather than asking users to explore features blindly, it delivers goal-aligned recommendations backed by interactive sandbox previews.

### 2.2 Complete End-to-End User Journey
```
[1. Dashboard Signal] → [2. 3-Question Assessment] → [3. Contextual Recommendation]
       ↓                                                               ↓
[6. Activation & Progress] ← [5. Review & Confirmation] ← [4. Interactive Setup & Sandbox]
```
1. **Dashboard Signal:** The merchant sees an executive banner highlighting operational bottlenecks (e.g., *“Your average response time is 2.4 hours. Deploy AI FAQ Chatbot to resolve 68% of repetitive queries instantly”*).
2. **Diagnostic Assessment:** A 3-question assessment evaluating Primary Goal (Support speed, Nurturing, Segmentation), Operational Bottleneck, and Existing Feature Stack.
3. **Prescriptive Recommendation:** Growth Guide presents a tailored recommendation card outlining the problem solved, expected outcome, prerequisites, and setup duration (~15 min illustrative).
4. **Setup Wizard & Sandbox Test:** The merchant configures intents and tests responses in an interactive WhatsApp conversation sandbox with real-time token scoring and fallback matching.
5. **Review & Governance:** The merchant confirms fallback responses, human handoff triggers, and verifies plan eligibility placeholders.
6. **Simulated Activation:** Growth Guide records a simulated activation event, marks the tool active in the tenant state, and updates the analytics adoption ledger.

### 2.3 Scope Boundaries & Strict Exclusions
* **In Scope:** Diagnostic assessment engine; interactive multi-step wizards for Chatbot, Automation, and CRM; WhatsApp conversational test simulator; local state persistence; analytics progress tracking.
* **Explicit Exclusions:** Direct production WhatsApp Business API deployments; transmission of real SMS/WhatsApp messages; production Meta BSP credential provisioning; real AI model fine-tuning; live billing plan upgrades.

### 2.4 Edge Cases & Failure Recovery
* **FAQ Confidence Failure:** If customer test questions fail semantic overlap thresholds (score < 2.5), the engine routes gracefully to the configured fallback message and flags human handoff.
* **Blank Input Validation:** Wizards enforce non-empty field validation on FAQ items, trigger delays, and review confirmation checkboxes before allowing stage progression.
* **State Loss Prevention:** All configuration changes persist automatically in browser `localStorage`. A modal confirmation prevents accidental cancellation or loss of setup progress.

---

<!-- PAGE 3 BREAK -->
## PAGE 3: METRICS FRAMEWORK, EXPERIMENTATION & GOVERNANCE

### 3.1 North Star Metric Definition
> **"Percentage of monthly active businesses that activate and meaningfully use at least one previously unused Cheerio feature within 30 days."**

* **Activation vs. Meaningful Use:** Activation is defined as completing the configuration wizard and enabling the module. Meaningful use requires qualifying operational interaction within 30 days:
  * *Chatbot:* Resolving ≥ 10 automated inbound customer inquiries.
  * *Automation:* Triggering ≥ 5 event-driven follow-up messages.
  * *CRM Segmentation:* Executing ≥ 1 campaign targeted to a segmented cohort.

### 3.2 Three Supporting Metrics
1. **Recommendation-to-Activation Conversion Rate:** % of businesses viewing a recommendation that complete setup (Target: 25.0% baseline).
2. **7-Day Meaningful Use Velocity:** % of newly activated businesses recording qualifying interactions within 7 days of setup (Target: 60.0% of activations).
3. **30-Day Cohort Retention Lift:** 30-day retention curve of activated cohorts versus single-feature benchmark cohorts (Hypothesized lift: +2.0 percentage points).

### 3.3 Target Hypothesis & Baseline Measurement
* **Target Hypothesis:** Increase the North Star Metric by **10 percentage points** (e.g., from an illustrative baseline of 15% to 25%) within 3 months of rollout.
* **Pre-Experiment Baseline:** A mandatory **2-week observational measurement window** will monitor current organic feature adoption across 5,000 active businesses prior to intervention exposure.

### 3.4 Experimentation Methodology (A/B Test Design)
* **Sample Population:** 5,000 monthly active Cheerio business accounts split 50/50.
* **Control Group (N = 2,500):** Standard Cheerio navigation and passive feature catalog.
* **Treatment Group (N = 2,500):** Cheerio Growth Guide embedded dashboard banner, diagnostic assessment, and interactive setup sandbox.
* **Duration:** 60 days active experiment post baseline window. Minimum Detectable Effect (MDE): 3.2 percentage points at 95% confidence and 80% statistical power.

### 3.5 Guardrail Metrics & Risk Boundaries
* **Broadcast Deliverability Guardrail:** Automated follow-ups must not increase WhatsApp spam report rates above 0.2%.
* **Support Escalation Guardrail:** Chatbot low-confidence handoffs must not increase human support ticket backlog by more than 5%.
* **Opt-Out Rate Guardrail:** Customer unsubscribe rates must remain below 1.0% per broadcast cohort.

---

<!-- PAGE 4 BREAK -->
## PAGE 4: BUSINESS CASE, FINANCIAL MODEL & RISK MANAGEMENT

### 4.1 Financial Model Summary (5,000 Active Business Universe)
*All figures derived from `cheerio_growth_guide_financial_model.xlsx` (12-Month Projections, Base Scenario):*

| Metric Category | Monthly Average (M1–M12) | 12-Month Cumulative | Notes & Model Logic |
|---|---|---|---|
| **Active Business Universe** | 5,588 accounts avg | 5,000 to 6,217 accounts | 2.0% monthly organic expansion (67,058 acct-mo) |
| **Recommendation Reach (70%)** | 3,912 accounts / mo | 46,941 exposures | Active accounts exposed to Growth Guide |
| **Engaged Businesses (40%)** | 1,565 accounts / mo | 18,776 engagements | Merchants interacting with recommendations |
| **New Feature Activations (25%)** | 391 accounts / mo avg | 4,695 activations | Merchants completing setup wizards |
| **Total Year-1 Realized Cost** | ₹1,08,969 / mo avg | ₹13,07,627 / year | Token fees (₹1.7k) + hosting (₹10.06L) + fixed (₹3.00L) |
| **Cost Per Feature Activation** | ₹279 / activation | ₹279 average | Year-1 realized cost divided by activations (₹13.08L / 4,695) |
| **Active Retained Accounts** | 73 exit accounts | 94 cohort-months | Adopting accounts × +2.0 pp lift with 5% decay |
| **In-Period Recognized Revenue** | ₹1,22,959 / mo avg | ₹14,75,508 / year | Sum of customer-months recognized (no double counting) |
| **Month 12 Exit ARR Run Rate** | ₹2,18,927 / mo exit | ₹26,27,124 / year exit | 73 active retained accounts × ₹2,999 × 12 months (~₹26.27L) |
| **Annualized M12 Operating Cost** | ₹1,18,418 / mo exit | ₹14,21,013 / year exit | Fixed (₹25k) + M12 hosting (₹93k) + AI (₹162.79) × 12 (~₹14.21L) |
| **Exit Net Annualized Benefit** | **₹1,00,509 / mo net** | **₹12,06,111 / year** | **Exit ARR (₹26.27L) minus Annualized M12 Cost (₹14.21L)** |
| **Contribution Margin (Exit / In-Period)** | **45.9% exit ARR** | **11.4% in-period** | **Base 45.9% flags 75% SaaS hurdle; hits 77.9% opt. or >80% incremental** |

*Methodology & Hosting Attribution Notes: Retention revenue is calculated strictly on an expected-value basis (`Adopting Businesses × 2.0% incremental yield × ₹2,999 ARPU with 5% monthly decay`), keeping Year-1 in-period recognized cash flow (₹14,75,508 recognized, ₹13,07,627 realized cost, +₹1,67,881 net benefit, 11.4% margin) distinct from Exit Run-Rate ARR (₹26,27,124) and Annualized M12 Operating Cost (₹14,21,013; net exit benefit ₹12,06,111, 45.9% margin). The 2.0% yield represents the illustrative share of newly activated businesses contributing an incremental retained account, not a company-wide churn reduction from 5% to 3%. Hosting Attribution: The conservative base model allocates full-platform hosting (₹10,05,870) across all 67,058 account-months, triggering the 75% SaaS hurdle (45.9%). Under incremental feature cost attribution (~₹4.75L incremental cost), exit margin exceeds 80%. Platform hosting must not be double-counted against baseline WhatsApp campaign P&Ls.*

### 4.2 AI Contribution & Token Sizing Economics
* **Model Selected:** **OpenAI GPT-4o-mini** (Standard Pay-As-You-Go API Tier).
* **Official Verified Pricing:** Input: **$0.150 / 1M tokens**; Output: **$0.600 / 1M tokens**; URL: `https://developers.openai.com/api/docs/models/gpt-4o-mini`.
* **Currency Assumption:** Editable illustrative conversion assumption of **₹84.00 / USD** (not a fixed currency peg).
* **Interaction Sizing:** 650 input tokens (prompt context, FAQ schema) + 250 output tokens (structured recommendation payload) across 18 onboarding setup/test interactions per newly activated business (~₹0.02079/call; exact M12 AI cost is ₹162.79 across 7,830 calls).
* **Blended AI Token Spend:** ₹1,757 total annual token cost across 4,695 activations and 84,510 calls (< 0.02% of retained customer lifetime value).

### 4.3 Key Risks & Mitigation Matrix
| Identified Risk | Severity | Operational Mitigation |
|---|---|---|
| **Recommendation Fatigue** | Medium | Implement smart dismissal rules; suppress recommendations for 14 days following an activation. |
| **Chatbot Hallucination / Misinformation** | High | Ground chatbot strictly in user-authored FAQ pairs and catalog data; enforce fallback when confidence < 2.5. |
| **WhatsApp Template Rejection** | Medium | Provide pre-approved WhatsApp Business message templates with validated variable tags. |
| **Retention Lift Sensitivity** | Medium | Model demonstrates break-even resilience down to +1.0% incremental retained yield (see Scenarios worksheet). |

### 4.4 AI Assistance & Personal Contributions
* **AI Use & Candidate Oversight:** DeepMind Antigravity AI agent accelerated React UI scaffolding, test runner boilerplate, and Excel generation scripts. Core problem taxonomy, diagnostic recommendation algorithm, 8-sheet financial model architecture, pricing benchmarks, and unit economics calculations were designed, audited, and verified personally.

---
*End of Assignment Document (4 Pages Maximum).*
