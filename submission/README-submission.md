# CHEERIO GROWTH GUIDE — ASSIGNMENT B SUBMISSION DOSSIER

**Company:** Cheerio AI  
**Assignment:** Assignment B — Users don't know what they can do on Cheerio  
**Role:** Cheerio AI Product Intern Candidate  
**Date of Completion:** October 2026  
**Prototype Working Directory:** `d:\AllProjects\Cheerio AI\cheerio-growth-guide`  
**Submission Package Directory:** `d:\AllProjects\Cheerio AI\cheerio-growth-guide\submission`  

---

## 1. Deliverables Checklist & Verification Summary

| # | Deliverable | Path | Format | Verification Status | Notes |
|---|---|---|---|---|---|
| **1** | **4-Page Assignment Document (DOCX)** | `submission/cheerio_growth_guide_assignment.docx` | DOCX | **VERIFIED (4 Pages)** | Formatted with explicit page breaks; Calibrated 4-page layout |
| **2** | **4-Page Assignment Document (Markdown)** | `submission/cheerio_growth_guide_assignment.md` | Markdown | **VERIFIED** | Complete Markdown source version |
| **3** | **Financial Model Workbook** | `submission/cheerio_growth_guide_financial_model.xlsx` | XLSX | **VERIFIED (8 Sheets)** | Formula-driven, centralized assumptions, audit checks |
| **4** | **Genuine UI Screenshots** | `submission/screenshots/` | PNG (5 images) | **VERIFIED** | Captured headlessly from running app at `localhost:3000` |
| **5** | **AI Usage Log & Verification Evidence** | `submission/AI-usage-log-template.md` | Markdown | **VERIFIED** | Real prompts, failed build debug, test evidence |
| **6** | **Master Submission Guide** | `submission/README-submission.md` | Markdown | **VERIFIED** | This comprehensive dossier |

---

## 2. Document Page Breakdown (cheerio_growth_guide_assignment.docx)

The Word document was compiled using the `docx` library with calibrated 0.5-inch margins and explicit `pageBreakBefore` directives to ensure strict compliance with the **4-page maximum limit**:

* **Page 1: User Persona, Pain Points & Strategic Prioritization**
  * *Target Persona:* Priya Sharma, Founder of "Glow Theory" (D2C Skincare, 2,450 customers, WhatsApp campaign user).
  * *Core Pain Points:* Repetitive customer support fatigue (18h/wk), post-click conversion drop-off, blanket broadcast fatigue, cognitive catalog overload.
  * *Three Priority Features:* AI FAQ Chatbot (WhatsApp Concierge), Follow-Up Automation (Nurture Engine), Smart CRM Segmentation.
  * *Alternatives Considered:* Passive documentation directory (rejected due to user friction), mandatory product tour (rejected due to drop-off).
  * *Prioritization Matrix:* High-impact, low-setup AI FAQ Chatbot prioritized as Tier 1.
* **Page 2: Growth Guide Solution, User Journey & Specification**
  * *Product Concept:* Embedded contextual activation copilot ("Your next best growth move").
  * *Complete 6-Stage User Journey:* Dashboard signal → 3-question diagnostic assessment → Prescriptive recommendation card → Multi-step setup wizard → WhatsApp conversational test sandbox → Simulated activation & ledgering.
  * *Scope Boundaries & Exclusions:* Explicitly excludes live Meta WhatsApp API billing and SMS transmission.
  * *Failure Recovery:* Low-confidence FAQ fallback routing (score < 2.5), inline validation, and modal safety against accidental cancellation.
* **Page 3: Metrics Framework, Experimentation & Governance**
  * *North Star Metric:* *"Percentage of monthly active businesses that activate and meaningfully use at least one previously unused Cheerio feature within 30 days."*
  * *Meaningful Use Criteria:* Defined separately from button clicks (≥10 chatbot conversations, ≥5 automated follow-ups, or ≥1 segmented campaign).
  * *Three Supporting Metrics:* Recommendation-to-activation rate (25% target), 7-day meaningful use velocity (60% target), 30-day cohort retention lift (+2.0 pp hypothesized).
  * *A/B Test Design:* 5,000 active businesses split 50/50 (Control vs Treatment), 60-day duration, preceded by a mandatory 2-week baseline observational window.
  * *Guardrails:* Spam report rate < 0.2%, support escalation backlog increase < 5%, opt-out rate < 1.0%.
* **Page 4: Business Case, Financial Model & Risk Management**
  * *Financial Summary Table:* 12-month projections derived directly from `cheerio_growth_guide_financial_model.xlsx`:
    * Full Year Activations: 4,691 accounts
    * Full Year AI & Infra Cost: ₹13,18,000 (Average cost per activation: ₹281)
    * Incremental Retained Revenue: ₹26,00,000 (96 net retained businesses at ₹2,999 ARPU)
    * Net Modeled Benefit: **₹12,82,000 / year** (49.3% contribution margin)
  * *AI Token Economics:* OpenAI GPT-4o-mini official verified pricing ($0.150/1M input, $0.600/1M output, ₹84.00/USD peg; ₹0.021 blended cost per interaction).
  * *Expected-Value Disclaimer:* Explicitly models retention revenue on an expected-value basis without double-counting.
  * *Risk Matrix:* Recommendation fatigue suppression, hallucination guardrails, and WhatsApp template compliance.

---

## 3. Financial Workbook Structure & Formula Audit

**File Location:** `submission/cheerio_growth_guide_financial_model.xlsx`

The workbook contains **8 dedicated worksheets** featuring dynamic cell formulas linking back to centralized assumptions:

1. **`Read Me`**: Executive summary, workbook index, author details, and methodology notes.
2. **`Assumptions`**: Central inputs formatted in light blue:
   * Starting Businesses: `5,000` (Cheerio MAU)
   * Monthly ARPU: `₹2,999` (Growth Plan)
   * Monthly Churn Baseline: `5.0%`
   * Funnel Conversion: Reach `70.0%`, Engagement `40.0%`, Activation `25.0%`, Meaningful Use `60.0%`
   * Retention Improvement: `+2.0 pp` (reduces churn from 5.0% to 3.0% for adopters)
   * AI Pricing: OpenAI GPT-4o-mini ($0.150 input / $0.600 output per 1M tokens), FX `₹84.00 / USD`
   * Token Sizing: 650 input tokens, 250 output tokens, 18 monthly interactions per active account
   * Infrastructure: ₹15.00 variable hosting / account, ₹25,000 fixed monthly overhead
3. **`Adoption Model`**: 12-month month-by-month funnel progression calculating active accounts, reached, engaged, new activations, cumulative activations, and meaningful-use cohorts.
4. **`AI and Infrastructure Cost`**: Token volume sizing, OpenAI API costs (USD converted to INR), cloud hosting fees, total program cost, and unit cost per activation (₹281 average).
5. **`Revenue and Margin`**:
   * Expected Additional Retained Businesses: `= Adopting Businesses * Retention Lift (pp)`
   * Incremental Monthly Retained Revenue: `= Retained Businesses * Monthly ARPU`
   * Cumulative Retained Revenue, Program Cost, Net Modeled Benefit, and Contribution Margin %.
6. **`Scenarios`**: Side-by-side comparison of Conservative (15% activation, 1.0 pp lift, -₹3.4L net), Base (25% activation, 2.0 pp lift, +₹12.8L net, 49.3% margin), and Optimistic (35% activation, 3.5 pp lift, +₹36.6L net, 70.4% margin) scenarios, plus a two-dimensional sensitivity grid.
7. **`Monthly Audit`**: Automated reconciliation formulas checking:
   * `Reach ≤ Active Businesses`: PASS across all 12 months.
   * `Engaged ≤ Reached`: PASS across all 12 months.
   * `Activated ≤ Engaged`: PASS across all 12 months.
   * `Positive Mature Benefit`: PASS (Ramp M1–M5, positive from M6 onward).
   * `Overall Reconciliation`: `ALL CHECKS PASSED - MODEL RECONCILED (0 ERRORS)`.
8. **`Sources`**: Verified reference URLs for OpenAI official API pricing, currency peg references, industry SaaS churn benchmarks, and model disclaimers.

---

## 4. Screenshot Inventory & Visual Evidence

All screenshots were captured from the running Next.js application at `http://localhost:3000` using headless Google Chrome (`puppeteer-core`) at 1440×900 desktop viewport:

| File Name | Size (Bytes) | Viewport State & Content Captured |
|---|---|---|
| [`01-dashboard.png`](file:///d:/AllProjects/Cheerio%20AI/cheerio-growth-guide/submission/screenshots/01-dashboard.png) | 195,040 bytes | Glow Theory executive dashboard; 2,450 customers; campaign funnel (Sent 12.4k → Replied 7%); Growth Guide recommendation banner. |
| [`02-growth-guide.png`](file:///d:/AllProjects/Cheerio%20AI/cheerio-growth-guide/submission/screenshots/02-growth-guide.png) | 256,391 bytes | Growth Guide overview; 3-question assessment completion; recommended feature hero card (~15 min setup); alternative feature cards. |
| [`03-recommendation.png`](file:///d:/AllProjects/Cheerio%20AI/cheerio-growth-guide/submission/screenshots/03-recommendation.png) | 160,459 bytes | Deep-dive recommendation detail for AI FAQ Chatbot; problem breakdown (68% repetitive queries); 4 benefits; prerequisites checklist; plan verification notice. |
| [`04-chatbot-setup.png`](file:///d:/AllProjects/Cheerio%20AI/cheerio-growth-guide/submission/screenshots/04-chatbot-setup.png) | 145,996 bytes | Step 1 of Chatbot Setup Wizard; editable skincare FAQ questions and answers; category tags; dynamic add/delete row controls. |
| [`05-preview-and-activation.png`](file:///d:/AllProjects/Cheerio%20AI/cheerio-growth-guide/submission/screenshots/05-preview-and-activation.png) | 115,680 bytes | Step 5 Activation Success screen; "Chatbot Activated Successfully!"; "Active in demo" glowing badge; session event audit ledger confirmation. |

---

## 5. Actual Test & Build Verification Results

### Automated Test Suite (`npm test`)
Executed via `tsx tests/test-runner.ts`:
```text
========================================
🧪 RUNNING CHEERIO GROWTH GUIDE TEST SUITE
========================================

--- 1. Recommendation Engine Mapping ---
  ✓ PASS: Goal 'answer-questions' maps to 'chatbot'
  ✓ PASS: Goal 'follow-up' maps to 'automation'
  ✓ PASS: Goal 'segment-customers' maps to 'crm'
  ✓ PASS: Feature 'chatbot' exists in catalog with full metadata
  ✓ PASS: Feature 'chatbot' has at least 3 benefits defined
  ✓ PASS: Feature 'chatbot' has at least 3 setup steps defined
  ✓ PASS: Feature 'automation' exists in catalog with full metadata
  ✓ PASS: Feature 'automation' has at least 3 benefits defined
  ✓ PASS: Feature 'automation' has at least 3 setup steps defined
  ✓ PASS: Feature 'crm' exists in catalog with full metadata
  ✓ PASS: Feature 'crm' has at least 3 benefits defined
  ✓ PASS: Feature 'crm' has at least 3 setup steps defined

--- 2. FAQ Matching Engine ---
  ✓ PASS: Ingredient question matches product safety FAQ
  ✓ PASS: Ingredient match category is product-faqs
  ✓ PASS: Delivery duration query matches delivery FAQ
  ✓ PASS: Delivery match category is delivery
  ✓ PASS: Return question matches return FAQ
  ✓ PASS: Return match category is returns
  ✓ PASS: Unrelated query triggers fallback (null match)
  ✓ PASS: Single word generic greeting returns null for fallback routing

--- 3. CRM Segmentation Data Integrity ---
  ✓ PASS: Demo customer dataset contains at least 8 profiles
  ✓ PASS: All demo customers belong to valid segmented cohorts
  ✓ PASS: All customer engagement scores are between 0 and 100

--- 4. Formatting Utilities ---
  ✓ PASS: formatNumber formats thousands with commas
  ✓ PASS: formatPercentage calculates correct whole %
  ✓ PASS: formatPercentage handles 0%

========================================
TEST SUMMARY: 26 Passed, 0 Failed
========================================
```

### Production Build (`npm run build`)
```text
▲ Next.js 14.2.35
   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (12/12)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                              Size     First Load JS
┌ ○ /                                    3.98 kB        94.4 kB
├ ○ /_not-found                          873 B          88.2 kB
├ ○ /analytics                           114 kB          225 kB
├ ○ /dashboard                           5.33 kB         116 kB
├ ○ /growth-guide                        7.57 kB         121 kB
├ ƒ /growth-guide/recommend/[featureId]  4.89 kB         116 kB
├ ○ /growth-guide/setup/automation       8.7 kB          122 kB
├ ○ /growth-guide/setup/chatbot          7.81 kB         123 kB
├ ○ /growth-guide/setup/crm              6.91 kB         123 kB
└ ○ /settings                            3.17 kB         119 kB
+ First Load JS shared by all            87.3 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```
* **Exit Code:** `0` (Clean build, zero lint errors, zero type errors).

---

## 6. Prototype Hosting & Deployment Guide

### Deployment Status
* **Current Status:** Not publicly deployed to external cloud infrastructure (running locally on `http://localhost:3000`).
* **Transparency Notice:** In accordance with instructions, no third-party cloud accounts were created or billed without authorization, and no fabricated public URLs are reported.

### Deployment Instructions (Vercel / Netlify / Node VPS)
The prototype has **zero external API keys, database credentials, or paid secrets**, making it 100% portable for instantaneous one-click deployment:

#### Option A: Deploy to Vercel (Recommended for Next.js)
1. Push the repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/cheerio-growth-guide.git
   git branch -M main
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the `cheerio-growth-guide` repository.
4. Leave all build settings at defaults (`Framework: Next.js`, `Build Command: npm run build`, `Output Directory: .next`).
5. Click **"Deploy"**. The live URL will be generated in ~60 seconds.

#### Option B: Run Locally for Live Evaluation
1. Clone repository:
   ```bash
   git clone <repo-url>
   cd cheerio-growth-guide
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development or production server:
   ```bash
   npm run build
   npm start
   ```
4. Open `http://localhost:3000` in any web browser.

---

## 7. Google Sheets Import & Verification Instructions

To share or evaluate `submission/cheerio_growth_guide_financial_model.xlsx` in Google Sheets:

1. **Upload File:**
   * Open [Google Drive](https://drive.google.com).
   * Click **New** → **File upload** and select `cheerio_growth_guide_financial_model.xlsx` from the `submission` folder.
2. **Open with Google Sheets:**
   * Double-click the uploaded file and select **Open with Google Sheets**.
3. **Verify Formula Recalculation:**
   * Click on the **`Monthly Audit`** tab.
   * Verify cell `B19` reads: `AUDIT RESULT: ALL FORMULAS, FUNNEL CONSTRAINTS AND RETENTION RULES RECONCILED (0 ERRORS)`.
   * Check the **`Revenue and Margin`** tab: verify row 18 calculates full-year incremental revenue as `₹26,00,000` and net benefit as `₹12,82,000`.
   * Check the **`Assumptions`** tab: verify changing cell `C10` (Reach %) or `C12` (Activation %) dynamically updates all downstream sheets.
4. **Set Sharing Permissions for Submission:**
   * Click the **Share** button in the top right.
   * Under **General access**, change from *Restricted* to **"Anyone with the link"**.
   * Set role to **Viewer** (or **Commenter**).
   * Click **Copy link** to submit alongside the document.

---

## 8. Remaining Manual Candidate Actions

1. Insert candidate name, email, and contact details on the cover lines if submitting as a candidate portfolio.
2. If desired, attach personal chat export links or conversation screenshots in `submission/AI-usage-log-template.md`.
3. Provide the copied Google Sheets viewer link or attach the standalone `.xlsx` file directly in the application submission portal.
