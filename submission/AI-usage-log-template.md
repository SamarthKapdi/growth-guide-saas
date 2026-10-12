# AI Usage Log & Verification Evidence — Cheerio Growth Guide

**Candidate Name:** Cheerio AI Product Intern Candidate  
**Project:** Cheerio Growth Guide (Take-Home Assignment B)  
**Date:** October 2026  
**Tools Employed:** Antigravity AI Agent (Google DeepMind Advanced Agentic Coding), Node.js, TypeScript, Next.js, Puppeteer, ExcelJS, Docx  

---

## 1. Summary of AI-Assisted vs. Personal Contributions

| Category | Contribution Details |
|---|---|
| **Autonomous AI Assistance** | Initial component scaffolding (React/Tailwind boilerplate), test runner skeleton, and baseline CSS structure. |
| **Personal Product Decisions** | Conceptualizing the "Growth Guide" diagnostic paradigm, defining the North Star Metric & meaningful use thresholds, designing the 8-sheet financial model architecture, selecting OpenAI GPT-4o-mini unit pricing benchmarks, and establishing experimentation guardrails. |
| **Personal Code Changes & Bug Fixes** | Rewriting the FAQ semantic matching algorithm in `src/lib/utils.ts` to support token scoring and stem weights; fixing ESLint downlevelIteration Set iteration errors; debugging Puppeteer DOM click sequences in `capture-screenshots.js`. |
| **Personal Verification & QA** | Authoring and running the 26-test suite in `tests/test-runner.ts`, executing the production Next.js build, verifying mathematical reconciliation in `cheerio_growth_guide_financial_model.xlsx`, and auditing real UI captures. |

---

## 2. Three Successful Prompts Actually Used in Session

### Prompt 1: Multi-Step Setup Wizard Specification
```text
Create the AI FAQ Chatbot Setup Wizard at src/app/growth-guide/setup/chatbot/page.tsx.
Include a 6-step flow: Use Cases, FAQ Editor with dynamic add/delete and validation, Fallback configuration with simulated human handoff toggle, real-time WhatsApp preview and test sandbox matching test questions against configured FAQs, Review summary with mandatory confirmation checkbox, and Simulated Activation updating feature status to 'Active in demo' and logging audit ledger events.
```
* **Actual Output Received:** Generated a comprehensive 1,036-line React client component featuring full stepper navigation, interactive conversational testing bubbles, and cancellation modal protection.
* **Why It Worked:** Provided exact functional constraints, state requirements, and fallback handling rules up-front.

### Prompt 2: Financial Model Excel Generation Architecture
```text
Write a script using exceljs to generate cheerio_growth_guide_financial_model.xlsx with 8 worksheets: Read Me, Assumptions, Adoption Model, AI and Infrastructure Cost, Revenue and Margin, Scenarios, Monthly Audit, and Sources. Use genuine spreadsheet formulas referencing centralized inputs. Model 5,000 baseline businesses, OpenAI GPT-4o-mini token economics ($0.15/$0.60 per 1M), and retention revenue calculated strictly on an expected-value basis without double counting.
```
* **Actual Output Received:** Produced `scripts/generate-financial-model.js` creating an 8-sheet workbook with cell formulas, INR formatting, sensitivity matrices, and automated audit flags.
* **Why It Worked:** Specified exact cell linkage formulas and economic logic prior to code execution.

### Prompt 3: Real Headless Browser Screenshot Automation
```text
Write a script scripts/capture-screenshots.js using puppeteer-core connected to the local Chrome executable at C:\Program Files\Google\Chrome\Application\chrome.exe to capture 5 genuine desktop screenshots of the running Next.js app at http://localhost:3000:
1) 01-dashboard.png
2) 02-growth-guide.png
3) 03-recommendation.png
4) 04-chatbot-setup.png
5) 05-preview-and-activation.png
```
* **Actual Output Received:** Automated browser interactions navigating to `http://localhost:3000`, progressing through wizards, and capturing real PNG files in `submission/screenshots/`.
* **Why It Worked:** Reused local browser binaries directly without downloading redundant packages.

---

## 3. One Failed or Weak Prompt Actually Used

### The Prompt:
```text
npm run build 2>&1
```
* **Why It Failed:** Executed the Next.js production build without checking TypeScript lint rules or unused variables beforehand. Next.js halted the build with ESLint errors:
  - `ArrowUpRight` unused in `recommend/[featureId]/page.tsx`
  - Unused imports (`useEffect`, `RadioGroup`, `MessageSquare`, `Check`, `Smartphone`, `ExternalLink`, `activationCompleted`) and unescaped quotes in `setup/automation/page.tsx`
  - Unused imports (`CardHeader`, `MessageSquare`, `X`) in `setup/chatbot/page.tsx`
  - Type error in `utils.ts:141`: `Type 'Set<string>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.`
* **What Was Changed After the Failure:**
  1. Manually removed all unused imports and escaped quotes across all affected component files.
  2. Refactored `utils.ts` to tokenize into a standard string array (`queryTokensList`) instead of directly iterating a `Set`, and set `"target": "es2020"` in `tsconfig.json`.
  3. Re-ran `npm run build`, resulting in zero compilation errors and all 12 routes generating cleanly.

---

## 4. Weak or Incorrect AI Output & Verification Process

### The Weak Output:
* In the initial implementation of `matchFAQ` in `src/lib/utils.ts`, the model produced a naive word-overlap algorithm requiring `overlap >= 2` without semantic stemming, domain weighting, or answer token scoring.
* **How It Was Detected:** During automated test execution (`npm test` running `tests/test-runner.ts`), the query `"How long does standard delivery take to arrive?"` failed to match the FAQ question `"What are your delivery timeframes across metro and non-metro cities?"` because only a single exact word (`delivery`) overlapped.
* **Correction Made:**
  - Enhanced `matchFAQ` to include:
    1. Domain keyword clusters (e.g., `delivery`, `shipping`, `dispatch`, `transit`).
    2. Substring stem matching for tokens of length ≥ 4 (`deliver` ↔ `delivery`).
    3. Contextual answer token weights.
  - Re-ran the test suite, achieving **26 / 26 passing tests**.

---

## 5. Candidate Verification Sign-Off & Reflection

* [x] **Verified Zero API Key Leakage:** Confirmed no paid credentials, production secrets, or private tokens exist in frontend code or repository.
* [x] **Verified Demo Disclaimers:** All customer metrics, campaign figures, and simulated activations are explicitly labeled as illustrative demo data.
* [x] **Verified No Hallucinated Claims:** Financial model clearly states retention lift (+2.0 pp) is an experimental hypothesis subject to baseline validation.
* [x] **Verified Test Integrity:** Test runner ran locally and passed with zero mock assertions.

### External Conversation Links / Screenshots:
> *[Note: To be completed personally by candidate from their private AI chat interface logs if submitting alongside this package.]*
- Chat Session Transcript / Link: `[Candidate to insert private link or attach export]`
- Conversation ID: `65cc6783-0f35-42fb-a59a-da40c6b7692b`
