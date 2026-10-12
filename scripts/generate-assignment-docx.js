const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  PageBreak,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
} = require('docx');
const fs = require('fs');
const path = require('path');

async function generateDocx() {
  const borderNone = {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
  };

  const borderLight = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
  };

  const createCell = (text, isHeader = false, widthPercent = 25, isBold = false) => {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: isHeader ? { fill: '0D9488' } : undefined,
      borders: borderLight,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: isHeader || isBold,
              size: isHeader ? 18 : 17,
              color: isHeader ? 'FFFFFF' : '1E293B',
              font: 'Calibri',
            }),
          ],
        }),
      ],
    });
  };

  const createHeading1 = (text, pageBreakBefore = false) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 26,
          color: '0F766E', // Teal dark
          font: 'Calibri',
        }),
      ],
    });
  };

  const createHeading2 = (text) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 21,
          color: '1E293B', // Navy
          font: 'Calibri',
        }),
      ],
    });
  };

  const createBullet = (label, text) => {
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { before: 20, after: 20 },
      children: [
        new TextRun({ text: label + ' ', bold: true, size: 18, color: '1E293B', font: 'Calibri' }),
        new TextRun({ text, size: 18, color: '334155', font: 'Calibri' }),
      ],
    });
  };

  const createPara = (text, italic = false) => {
    return new Paragraph({
      spacing: { before: 40, after: 40 },
      children: [
        new TextRun({
          text,
          size: 18,
          italic,
          color: '334155',
          font: 'Calibri',
        }),
      ],
    });
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 18, color: '334155' },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 }, // ~0.5 inch margins
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Cheerio Growth Guide | Take-Home Assignment B',
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri',
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: '94A3B8',
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // =========================================================================
          // PAGE 1: USER PERSONA, PAIN POINTS & STRATEGIC PRIORITIZATION
          // =========================================================================
          new Paragraph({
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: 'CHEERIO GROWTH GUIDE — PRODUCT SPECIFICATION & BUSINESS CASE',
                bold: true,
                size: 26,
                color: '0F766E',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 100 },
            children: [
              new TextRun({
                text: 'Assignment B: "Users don\'t know what they can do on Cheerio" | Candidate Evaluation Document',
                size: 18,
                italic: true,
                color: '64748B',
                font: 'Calibri',
              }),
            ],
          }),

          createHeading1('PAGE 1: USER PERSONA, PAIN POINTS & STRATEGIC PRIORITIZATION'),
          createHeading2('1.1 Target User Persona: The Time-Constrained D2C Brand Owner'),
          createBullet('Name & Brand:', 'Priya Sharma, Founder & Operator of "Glow Theory" (Direct-to-Consumer Skincare Brand).'),
          createBullet('Business Scale:', '2,450 customer profiles, 1,820 monthly active buyers, 24 WhatsApp broadcast campaigns sent to date.'),
          createBullet('Current Tool Adoption:', 'Uses WhatsApp Broadcasts exclusively. Zero adoption of chatbots, automations, or segmentation.'),
          createBullet('Technical Profile:', 'Non-technical operator. Values immediate conversion uplift and time savings over complex tool setups.'),

          createHeading2('1.2 Primary Customer Pain Points'),
          createBullet('Repetitive Query Fatigue:', '68% of inbound messages are repetitive questions (ingredients, order status, return policies), consuming 18+ hours/week.'),
          createBullet('Post-Click Drop-Off Blind Spot:', 'Broadcast clickers who fail to purchase receive no automated re-engagement, creating conversion drop-off.'),
          createBullet('Blanket Broadcast Fatigue:', 'Marketing messages are sent to the entire audience identically, reducing engagement and risking fatigue.'),
          createBullet('Cognitive Catalog Overload:', 'The merchant sees Cheerio as a simple campaign tool and fails to discover advanced modules without prescriptive guidance.'),

          createHeading2('1.3 Three Priority Feature Pillars'),
          createBullet('Priority 1 — AI FAQ Chatbot:', '24/7 WhatsApp concierge resolving product safety, shipping, and refund inquiries in < 3s with human handoff.'),
          createBullet('Priority 2 — Follow-Up Automation:', 'Triggered nurture sequences recovering link clickers and cart abandoners across 1h to 72h delays.'),
          createBullet('Priority 3 — Smart CRM & Segmentation:', 'Dynamic cohort classification grouping customers by intent and recency for targeted messaging.'),

          createHeading2('1.4 Alternatives Considered & Prioritization Rationale'),
          createBullet('Alternative A (Comprehensive Feature Directory):', 'Rejected. Passive directories demand user self-diagnosis, failing busy SMBs.'),
          createBullet('Alternative B (Mandatory Product Tooltips/Tour):', 'Rejected. Intrusive walkthroughs cause onboarding drop-off and friction.'),
          createBullet('Strategic Prioritization:', 'AI Chatbot selected as Tier 1 recommendation due to immediate 18h/week time-savings and minimal setup friction (~15 min). Follow-up Automation is Tier 2, and CRM Segmentation is Tier 3.'),

          // =========================================================================
          // PAGE 2: SOLUTION, COMPLETE USER JOURNEY & SPECIFICATION
          // =========================================================================
          createHeading1('PAGE 2: GROWTH GUIDE SOLUTION, COMPLETE USER JOURNEY & SPECIFICATION', true),

          createHeading2('2.1 The Growth Guide Concept'),
          createPara('Cheerio Growth Guide ("Your next best growth move") is an intelligent in-app activation copilot. It replaces generic feature exploration with diagnostic business goal discovery, prescriptive feature matching, interactive sandbox testing, and progress tracking.'),

          createHeading2('2.2 Complete End-to-End User Journey'),
          createBullet('Step 1 — Dashboard Opportunity Signal:', 'The merchant views a prominent Growth Guide banner on the dashboard highlighting operational bottlenecks (e.g., 2.4-hour response lag) with a direct CTA "Find my next growth opportunity".'),
          createBullet('Step 2 — Diagnostic Onboarding Assessment:', 'A guided 3-question evaluation: Q1 Main Goal (Speed up support, Nurture leads, Segment audience); Q2 Operational Bottleneck (Repetitive answers, Manual follow-ups); Q3 Current Feature Stack.'),
          createBullet('Step 3 — Contextual Recommendation:', 'Growth Guide presents the top-matched feature card detailing the problem it solves, why it fits Glow Theory, expected business benefits, required assets, and setup duration (~15 min illustrative).'),
          createBullet('Step 4 — Multi-Step Setup Wizard:', 'A 6-step guided wizard: 1) Select use cases; 2) Edit pre-loaded FAQ templates; 3) Configure fallback and simulated human handoff; 4) Test in real-time sandbox; 5) Review configuration; 6) Simulated activation.'),
          createBullet('Step 5 — WhatsApp Sandbox Simulation:', 'Merchants enter casual test questions. The engine performs token scoring, displays bot answers, and verifies fallback behavior in real-time.'),
          createBullet('Step 6 — Activation & Adoption Ledgering:', 'The module is activated in the demo environment, logged in session audit events, and reflected across dashboard status and analytics progress bars.'),

          createHeading2('2.3 Scope Boundaries & Strict Exclusions'),
          createBullet('In Scope (Prototype):', 'Diagnostic recommendation engine, interactive setup wizards for Chatbot, Automation, and CRM; WhatsApp test sandbox; local storage state persistence; adoption analytics tracking.'),
          createBullet('Explicit Exclusions:', 'Production Meta WhatsApp API provisioning; live SMS/WhatsApp message transmission; external paid LLM calls; live billing/subscription upgrades; access to real customer data.'),

          createHeading2('2.4 Failure Recovery & Edge Case Handling'),
          createBullet('Confidence Fallback:', 'Unmatched questions (score < 2.5) trigger configurable fallback responses and simulated human handoff.'),
          createBullet('Form Validation:', 'Enforces non-empty FAQ questions, answers, and mandatory review confirmation before activation.'),
          createBullet('State Safety:', 'All configurations persist in localStorage; modal confirmation protects against accidental setup cancellation.'),

          // =========================================================================
          // PAGE 3: METRICS FRAMEWORK, EXPERIMENTATION & GOVERNANCE
          // =========================================================================
          createHeading1('PAGE 3: METRICS FRAMEWORK, EXPERIMENTATION & GOVERNANCE', true),

          createHeading2('3.1 North Star Metric Definition'),
          createPara('"Percentage of monthly active businesses that activate and meaningfully use at least one previously unused Cheerio feature within 30 days."'),
          createBullet('Meaningful Use Criteria:', 'Distinguishes true adoption from button clicks. Requires qualifying operational interactions: ≥ 10 chatbot-handled customer conversations, or ≥ 5 triggered follow-ups, or ≥ 1 targeted CRM campaign.'),

          createHeading2('3.2 Three Supporting Metrics'),
          createBullet('1. Recommendation-to-Activation Rate:', '% of businesses viewing a Growth Guide recommendation that complete setup (Target: 25.0% baseline).'),
          createBullet('2. 7-Day Meaningful Use Velocity:', '% of newly activated businesses recording qualifying interactions within 7 days (Target: 60.0% of activations).'),
          createBullet('3. 30-Day Cohort Retention Lift:', 'Retention curve of activated accounts vs single-feature benchmark cohorts (Hypothesized lift: +2.0 percentage points).'),

          createHeading2('3.3 Target Hypothesis & Baseline Measurement'),
          createBullet('Hypothesized Lift:', 'Improve the North Star Metric by 10 percentage points within three months of rollout (e.g., from an illustrative 15% baseline to 25%).'),
          createBullet('Pre-Rollout Baseline Window:', 'A mandatory 2-week observational measurement window prior to rollout to record true organic multi-feature adoption across 5,000 active businesses.'),

          createHeading2('3.4 Experimentation Methodology (A/B Test Design)'),
          createBullet('Sample Cohort:', '5,000 monthly active Cheerio business accounts randomized into equal cohorts (N = 2,500 each).'),
          createBullet('Control Group (50%):', 'Standard Cheerio interface with existing static navigation and passive feature catalog.'),
          createBullet('Treatment Group (50%):', 'Cheerio Growth Guide embedded dashboard banner, diagnostic assessment, and interactive setup wizard.'),
          createBullet('Test Duration & Power:', '60-day evaluation post-baseline window. Minimum Detectable Effect (MDE) of 3.2 pp at 95% confidence (α = 0.05) and 80% statistical power (β = 0.20).'),

          createHeading2('3.5 Guardrail Metrics & Risk Boundaries'),
          createBullet('Deliverability Guardrail:', 'Automated follow-ups must not increase WhatsApp spam reports above 0.2% of delivered messages.'),
          createBullet('Support Queue Guardrail:', 'Chatbot escalations must not increase human support ticket backlog by more than 5%.'),
          createBullet('Customer Opt-Out Guardrail:', 'Broadcast unsubscribe rates must remain below 1.0% per cohort.'),

          // =========================================================================
          // PAGE 4: BUSINESS CASE, FINANCIAL MODEL & RISK MANAGEMENT
          // =========================================================================
          createHeading1('PAGE 4: BUSINESS CASE, FINANCIAL MODEL & RISK MANAGEMENT', true),

          createHeading2('4.1 Financial Model Summary (Derived from Financial Workbook)'),
          createPara('12-Month Rolling Projections across 5,000 baseline active businesses (Base Scenario from cheerio_growth_guide_financial_model.xlsx):'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Metric Category', true, 32),
                  createCell('Monthly Avg', true, 22),
                  createCell('Full Year (12M)', true, 22),
                  createCell('Financial & Operational Logic', true, 24),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Active Accounts (2% MoM growth)', false, 32, true),
                  createCell('5,584 accounts', false, 22),
                  createCell('5,000 to 6,242', false, 22),
                  createCell('Starting Cheerio active business universe', false, 24),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Feature Activations (25% rate)', false, 32, true),
                  createCell('391 / month', false, 22),
                  createCell('4,691 activations', false, 22),
                  createCell('Merchants completing feature setup wizards', false, 24),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Total AI & Infrastructure Cost', false, 32, true),
                  createCell('₹1,09,833 / mo', false, 22),
                  createCell('₹13,18,000 / yr', false, 22),
                  createCell('OpenAI GPT-4o-mini + hosting + overhead', false, 24),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Cost Per Feature Activation', false, 32, true),
                  createCell('₹281 / activation', false, 22),
                  createCell('₹281 average', false, 22),
                  createCell('Total program cost divided by activations', false, 24),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Active Retained Accounts', false, 32, true),
                  createCell('73 exit accounts', false, 22),
                  createCell('94 cohort-months', false, 22),
                  createCell('Adopting accounts × +2.0 pp lift with 5% decay', false, 24),
                ],
              }),
              new TableRow({
                children: [
                  createCell('In-Period Recognized Revenue', false, 32, true),
                  createCell('₹1,22,959 / mo avg', false, 22),
                  createCell('₹14,76,000 / yr', false, 22),
                  createCell('Sum of recognized customer-months (no double counting)', false, 24),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Month 12 Exit ARR Run Rate', false, 32, true),
                  createCell('₹2,18,927 / mo exit', false, 22),
                  createCell('₹26,00,000 / yr exit', false, 22),
                  createCell('73 active retained accounts × ₹2,999 × 12 months', false, 24),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Net Program Benefit (Exit ARR)', false, 32, true),
                  createCell('₹1,06,833 / mo avg', false, 22),
                  createCell('₹12,82,000 / yr', false, 22),
                  createCell('Exit ARR minus total annual program cost', false, 24),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Contribution Margin (Exit / In-Period)', false, 32, true),
                  createCell('49.3% exit ARR', false, 22),
                  createCell('10.7% in-period', false, 22),
                  createCell('Base 49.3% flags 75% SaaS hurdle; hits 70.4% in opt.', false, 24),
                ],
              }),
            ],
          }),

          createPara('Methodology & Audit Notes: Revenue is modeled strictly on expected value (Adopters × +2.0 pp lift × ₹2,999 ARPU). Distinguishes in-period cash flow (₹14.76L) from Month 12 Exit ARR (₹26.0L). 75% SaaS hurdle flags Year 1 base case (49.3%) due to fixed setup overhead; cleared at scale or Y2.', true),

          createHeading2('4.2 AI Token Economics & Provider Pricing Benchmark'),
          createBullet('Model Selected:', 'OpenAI GPT-4o-mini (Official docs verified: $0.150/1M input, $0.600/1M output; editable illustrative conversion assumption of ₹84.00/USD, not a fixed currency peg; URL: https://developers.openai.com/api/docs/models/gpt-4o-mini).'),
          createBullet('Interaction Sizing:', '650 input tokens + 250 output tokens across an average of 18 monthly interactions per adopting business (~₹0.021/call).'),
          createBullet('Annual AI Token Spend:', '₹12,490 total annual token cost across 4,691 activations (< 0.2% of retained customer lifetime value).'),

          createHeading2('4.3 Key Risks & Mitigation Matrix'),
          createBullet('Recommendation Fatigue:', 'Suppressed recommendations for 14 days after activation; smart dismissal controls.'),
          createBullet('Chatbot Misinformation:', 'Strict FAQ-grounded matching; automated fallback when semantic score is below 2.5.'),
          createBullet('Retention Lift Sensitivity:', 'Break-even resilience down to +1.0 pp retention lift (model maintains positive ROI).'),
        ],
      },
    ],
  });

  const outputPath = path.join(__dirname, '..', 'submission', 'cheerio_growth_guide_assignment.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log('✓ DOCX document generated successfully at:', outputPath);
}

generateDocx().catch((err) => {
  console.error('Error generating DOCX:', err);
  process.exit(1);
});
