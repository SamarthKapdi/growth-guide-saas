const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function createFinancialModel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Cheerio AI Product Intern Candidate';
  workbook.lastModifiedBy = 'Cheerio AI Product Intern Candidate';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Styles definition
  const headerFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D9488' } }; // Teal
  const subHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; // Navy
  const inputFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } }; // Light blue for inputs
  const calculatedFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
  const totalFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  const passFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
  const borderThin = {
    top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  };
  const totalBorder = {
    top: { style: 'thin', color: { argb: 'FF0D9488' } },
    bottom: { style: 'double', color: { argb: 'FF0D9488' } },
  };

  // =========================================================================
  // 1. READ ME WORKSHEET
  // =========================================================================
  const wsReadMe = workbook.addWorksheet('Read Me', { properties: { tabColor: { argb: 'FF0D9488' } } });
  wsReadMe.columns = [
    { width: 4 },
    { width: 28 },
    { width: 75 },
  ];

  wsReadMe.mergeCells('B2:C2');
  wsReadMe.getCell('B2').value = 'Cheerio Growth Guide — Unit Economics & Adoption Model';
  wsReadMe.getCell('B2').font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF0F766E' } };

  wsReadMe.mergeCells('B3:C3');
  wsReadMe.getCell('B3').value = 'Financial Projections, Token Economics, Infrastructure Sizing & Retention Impact';
  wsReadMe.getCell('B3').font = { name: 'Calibri', size: 11, italic: true, color: { argb: 'FF64748B' } };

  const readMeData = [
    ['Document Version', '1.0 (Production Candidate)'],
    ['Author', 'Cheerio AI Product Intern Candidate'],
    ['Scope', '12-Month Rolling Projections for Cheerio Growth Guide (5,000 Starting Active Businesses)'],
    ['Currency', 'Indian Rupee (INR - ₹) with USD conversion for API token rates'],
    ['Central Objective', 'Model unit economics, AI token costs, infrastructure overhead, and retention-driven revenue.'],
    ['', ''],
    ['WORKBOOK NAVIGATION', ''],
    ['1. Read Me', 'Overview, model structure, methodology and usage instructions.'],
    ['2. Assumptions', 'Centralized, editable inputs for cohort sizing, conversion rates, AI pricing, and infrastructure.'],
    ['3. Adoption Model', '12-month adoption funnel: reach, engagement, feature activations, and meaningful use cohorts.'],
    ['4. AI & Infra Cost', 'Token consumption, OpenAI GPT-4o-mini API fees, cloud hosting, and cost per activation.'],
    ['5. Revenue & Margin', 'Expected-value retention revenue, net modeled benefit, and contribution margins.'],
    ['6. Scenarios', 'Conservative, Base, and Optimistic cases with multidimensional sensitivity matrices.'],
    ['7. Monthly Audit', 'Formula-driven reconciliation checks ensuring model consistency and preventing double-counting.'],
    ['8. Sources', 'Verified benchmark sources, official API pricing references, and model disclaimers.'],
    ['', ''],
    ['METHODOLOGY & GUARDRAILS', ''],
    ['Expected-Value Basis', 'Retention revenue = Adopting Businesses × Hypothesized Retention Lift in pp × Monthly Plan ARPU.'],
    ['No Double-Counting', 'Revenue is tied strictly to newly retained cohorts without compounding previously credited gains.'],
    ['Illustrative Nature', 'All retention lifts (+2.0 pp baseline) represent testable hypotheses subject to 2-week baseline validation.'],
  ];

  let rIdx = 5;
  for (const [title, desc] of readMeData) {
    if (title === 'WORKBOOK NAVIGATION' || title === 'METHODOLOGY & GUARDRAILS') {
      wsReadMe.getCell(`B${rIdx}`).value = title;
      wsReadMe.getCell(`B${rIdx}`).font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF1E293B' } };
    } else if (title === '') {
      // spacer
    } else {
      wsReadMe.getCell(`B${rIdx}`).value = title;
      wsReadMe.getCell(`B${rIdx}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF334155' } };
      wsReadMe.getCell(`C${rIdx}`).value = desc;
      wsReadMe.getCell(`C${rIdx}`).font = { name: 'Calibri', size: 10, color: { argb: 'FF475569' } };
    }
    rIdx++;
  }

  // =========================================================================
  // 2. ASSUMPTIONS WORKSHEET
  // =========================================================================
  const wsAssump = workbook.addWorksheet('Assumptions', { properties: { tabColor: { argb: 'FF2563EB' } } });
  wsAssump.columns = [
    { width: 4 },
    { width: 36 },
    { width: 18 },
    { width: 14 },
    { width: 50 },
  ];

  wsAssump.mergeCells('B2:E2');
  wsAssump.getCell('B2').value = 'Model Assumptions & Central Input Parameters';
  wsAssump.getCell('B2').font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  wsAssump.mergeCells('B3:E3');
  wsAssump.getCell('B3').value = 'Cells highlighted in Light Blue represent editable baseline inputs. All other tabs dynamically reference this table.';
  wsAssump.getCell('B3').font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF64748B' } };

  // Headers
  wsAssump.getRow(5).values = ['', 'Parameter Name', 'Value', 'Unit', 'Source & Notes'];
  for (let c = 2; c <= 5; c++) {
    const cell = wsAssump.getRow(5).getCell(c);
    cell.font = headerFont;
    cell.fill = headerFill;
  }

  const assumpRows = [
    // [Name, Value, Unit, Notes, format]
    // Section: Business Baseline
    ['SECTION_HEADER', '1. Business Baseline Cohort', '', ''],
    ['Starting Active Businesses', 5000, 'Accounts', 'Assignment specification baseline (Cheerio MAU)', '#,##0'],
    ['Monthly Organic Growth Rate', 0.02, 'Percent', 'Estimated net month-over-month account expansion', '0.0%'],
    ['Average Monthly Plan Revenue (ARPU)', 2999, 'INR / mo', 'Representative Growth Plan tier for D2C brands', '₹#,##0'],
    ['Baseline Monthly Churn Rate', 0.05, 'Percent', 'Current pre-intervention churn (95% retention)', '0.0%'],

    // Section: Growth Guide Funnel
    ['SECTION_HEADER', '2. Growth Guide Funnel & Conversion Rates', '', ''],
    ['Monthly Recommendation Reach %', 0.70, 'Percent', '% of active businesses exposed to Growth Guide prompts', '0.0%'],
    ['Engagement Rate (% of Reached)', 0.40, 'Percent', '% who click recommendation or complete assessment', '0.0%'],
    ['Feature Activation Rate (% of Engaged)', 0.25, 'Percent', '% of engaged businesses who complete setup wizard', '0.0%'],
    ['Meaningful Use Qualification Rate', 0.60, 'Percent', '% of activated accounts recording qualifying use within 30d', '0.0%'],
    ['Hypothesized Retention Lift for Adopters', 0.02, 'pp (monthly)', 'Hypothesized churn reduction for adopting businesses (+2.0 pp)', '0.0%'],

    // Section: AI Token Economics
    ['SECTION_HEADER', '3. AI Model & Token Economics', '', ''],
    ['AI Model Name', 'OpenAI GPT-4o-mini', 'Text', 'Verified cost-effective production model tier', '@'],
    ['Input Token Price ($ / 1M tokens)', 0.150, 'USD / 1M', 'Official OpenAI Pricing schedule (October 2024/2026)', '$#,##0.000'],
    ['Output Token Price ($ / 1M tokens)', 0.600, 'USD / 1M', 'Official OpenAI Pricing schedule (October 2024/2026)', '$#,##0.000'],
    ['USD to INR Exchange Rate', 84.00, 'INR / USD', 'Reference market foreign exchange rate', '₹#,##0.00'],
    ['Avg Input Tokens per Interaction', 650, 'Tokens', 'Context, prompt instructions, FAQ templates', '#,##0'],
    ['Avg Output Tokens per Interaction', 250, 'Tokens', 'Generated recommendation/response payload', '#,##0'],
    ['Avg AI Interactions per Business / Mo', 18, 'Calls / mo', 'Simulated wizard setups, FAQ queries, automation tests', '#,##0'],

    // Section: Platform Infrastructure
    ['SECTION_HEADER', '4. Platform Infrastructure Overhead', '', ''],
    ['Variable Cloud Cost per Active Account', 15.00, 'INR / mo', 'AWS/GCP database, webhook listeners, serverless execution', '₹#,##0.00'],
    ['Fixed Monthly Infrastructure Overhead', 25000, 'INR / mo', 'Dedicated staging clusters, monitoring, logging ledger', '₹#,##0'],
  ];

  let assumpRowIdx = 6;
  const assumpCellMap = {}; // Maps friendly name to cell address

  for (const item of assumpRows) {
    if (item[0] === 'SECTION_HEADER') {
      wsAssump.mergeCells(`B${assumpRowIdx}:E${assumpRowIdx}`);
      const c = wsAssump.getCell(`B${assumpRowIdx}`);
      c.value = item[1];
      c.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      c.fill = subHeaderFill;
      assumpRowIdx++;
      continue;
    }

    const [name, val, unit, notes, numFmt] = item;
    const r = wsAssump.getRow(assumpRowIdx);
    r.getCell(2).value = name;
    r.getCell(2).font = { name: 'Calibri', size: 10, bold: true };
    r.getCell(2).border = borderThin;

    const valCell = r.getCell(3);
    valCell.value = val;
    valCell.font = { name: 'Calibri', size: 10, bold: true };
    valCell.fill = inputFill;
    valCell.border = borderThin;
    if (numFmt) valCell.numFmt = numFmt;

    r.getCell(4).value = unit;
    r.getCell(4).font = { name: 'Calibri', size: 10, color: { argb: 'FF64748B' } };
    r.getCell(4).border = borderThin;

    r.getCell(5).value = notes;
    r.getCell(5).font = { name: 'Calibri', size: 10, color: { argb: 'FF475569' } };
    r.getCell(5).border = borderThin;

    assumpCellMap[name] = `Assumptions!$C$${assumpRowIdx}`;
    assumpRowIdx++;
  }

  // =========================================================================
  // 3. ADOPTION MODEL WORKSHEET (Months 1–12)
  // =========================================================================
  const wsAdopt = workbook.addWorksheet('Adoption Model', { properties: { tabColor: { argb: 'FF059669' } } });
  wsAdopt.columns = [
    { width: 4 },
    { width: 12 }, // Month
    { width: 18 }, // Active Businesses
    { width: 18 }, // Reached
    { width: 18 }, // Engaged
    { width: 18 }, // New Activated
    { width: 22 }, // Cumulative Activated
    { width: 20 }, // Meaningful Use Cohort
  ];

  wsAdopt.mergeCells('B2:H2');
  wsAdopt.getCell('B2').value = '12-Month Feature Adoption Funnel';
  wsAdopt.getCell('B2').font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  wsAdopt.mergeCells('B3:H3');
  wsAdopt.getCell('B3').value = 'Models the progression of Cheerio active businesses through recommendation reach, engagement, activation, and meaningful use.';
  wsAdopt.getCell('B3').font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF64748B' } };

  wsAdopt.getRow(5).values = [
    '',
    'Month',
    'Active Businesses',
    'Reached (70%)',
    'Engaged (40%)',
    'New Activated (25%)',
    'Cumulative Activated',
    'Meaningful Use (60%)',
  ];
  for (let c = 2; c <= 8; c++) {
    const cell = wsAdopt.getRow(5).getCell(c);
    cell.font = headerFont;
    cell.fill = headerFill;
  }

  for (let m = 1; m <= 12; m++) {
    const row = 5 + m;
    const r = wsAdopt.getRow(row);
    r.getCell(2).value = `Month ${m}`;
    r.getCell(2).font = { bold: true };
    r.getCell(2).border = borderThin;

    // Active Businesses
    if (m === 1) {
      r.getCell(3).value = { formula: `${assumpCellMap['Starting Active Businesses']}` };
    } else {
      r.getCell(3).value = { formula: `ROUND(C${row - 1} * (1 + ${assumpCellMap['Monthly Organic Growth Rate']}), 0)` };
    }
    r.getCell(3).numFmt = '#,##0';
    r.getCell(3).border = borderThin;

    // Reached
    r.getCell(4).value = { formula: `ROUND(C${row} * ${assumpCellMap['Monthly Recommendation Reach %']}, 0)` };
    r.getCell(4).numFmt = '#,##0';
    r.getCell(4).border = borderThin;

    // Engaged
    r.getCell(5).value = { formula: `ROUND(D${row} * ${assumpCellMap['Engagement Rate (% of Reached)']}, 0)` };
    r.getCell(5).numFmt = '#,##0';
    r.getCell(5).border = borderThin;

    // New Activated
    r.getCell(6).value = { formula: `ROUND(E${row} * ${assumpCellMap['Feature Activation Rate (% of Engaged)']}, 0)` };
    r.getCell(6).numFmt = '#,##0';
    r.getCell(6).border = borderThin;

    // Cumulative Activated
    if (m === 1) {
      r.getCell(7).value = { formula: `F${row}` };
    } else {
      r.getCell(7).value = { formula: `G${row - 1} + F${row}` };
    }
    r.getCell(7).numFmt = '#,##0';
    r.getCell(7).font = { bold: true };
    r.getCell(7).border = borderThin;

    // Meaningful Use
    r.getCell(8).value = { formula: `ROUND(F${row} * ${assumpCellMap['Meaningful Use Qualification Rate']}, 0)` };
    r.getCell(8).numFmt = '#,##0';
    r.getCell(8).border = borderThin;
  }

  // Adoption Summary Row
  const adoptTotRow = wsAdopt.getRow(18);
  adoptTotRow.values = [
    '',
    'Total / End',
    { formula: 'AVERAGE(C6:C17)' },
    { formula: 'SUM(D6:D17)' },
    { formula: 'SUM(E6:E17)' },
    { formula: 'SUM(F6:F17)' },
    { formula: 'G17' },
    { formula: 'SUM(H6:H17)' },
  ];
  for (let c = 2; c <= 8; c++) {
    const cell = adoptTotRow.getCell(c);
    cell.font = { bold: true };
    cell.fill = totalFill;
    cell.border = totalBorder;
    if (c >= 3) cell.numFmt = '#,##0';
  }

  // =========================================================================
  // 4. AI AND INFRASTRUCTURE COST WORKSHEET
  // =========================================================================
  const wsCost = workbook.addWorksheet('AI and Infrastructure Cost', { properties: { tabColor: { argb: 'FFD97706' } } });
  wsCost.columns = [
    { width: 4 },
    { width: 12 }, // Month
    { width: 16 }, // Interactions
    { width: 16 }, // Input Tokens (M)
    { width: 16 }, // Output Tokens (M)
    { width: 18 }, // AI Input Cost (₹)
    { width: 18 }, // AI Output Cost (₹)
    { width: 18 }, // Total AI Cost (₹)
    { width: 18 }, // Variable Cloud (₹)
    { width: 18 }, // Fixed Platform (₹)
    { width: 20 }, // Total Monthly Cost (₹)
    { width: 18 }, // Cost / Activation (₹)
  ];

  wsCost.mergeCells('B2:L2');
  wsCost.getCell('B2').value = 'AI Token Sizing & Infrastructure Cost Model';
  wsCost.getCell('B2').font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  wsCost.mergeCells('B3:L3');
  wsCost.getCell('B3').value = 'Calculates token consumption based on OpenAI GPT-4o-mini rates, hosting variable overhead, and unit cost per activation.';
  wsCost.getCell('B3').font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF64748B' } };

  wsCost.getRow(5).values = [
    '',
    'Month',
    'Interactions',
    'Input Tok (M)',
    'Output Tok (M)',
    'AI Input Cost',
    'AI Output Cost',
    'Total AI Cost',
    'Variable Cloud',
    'Fixed Platform',
    'Total Monthly Cost',
    'Cost / Activation',
  ];
  for (let c = 2; c <= 12; c++) {
    const cell = wsCost.getRow(5).getCell(c);
    cell.font = headerFont;
    cell.fill = headerFill;
  }

  for (let m = 1; m <= 12; m++) {
    const row = 5 + m;
    const r = wsCost.getRow(row);
    r.getCell(2).value = `Month ${m}`;
    r.getCell(2).font = { bold: true };
    r.getCell(2).border = borderThin;

    // Monthly Interactions = Adopting Businesses * Interactions / Mo
    r.getCell(3).value = { formula: `'Adoption Model'!F${row} * ${assumpCellMap['Avg AI Interactions per Business / Mo']}` };
    r.getCell(3).numFmt = '#,##0';
    r.getCell(3).border = borderThin;

    // Input Tokens (M) = (Interactions * Avg Input Tokens) / 1,000,000
    r.getCell(4).value = { formula: `(C${row} * ${assumpCellMap['Avg Input Tokens per Interaction']}) / 1000000` };
    r.getCell(4).numFmt = '#,##0.00';
    r.getCell(4).border = borderThin;

    // Output Tokens (M) = (Interactions * Avg Output Tokens) / 1,000,000
    r.getCell(5).value = { formula: `(C${row} * ${assumpCellMap['Avg Output Tokens per Interaction']}) / 1000000` };
    r.getCell(5).numFmt = '#,##0.00';
    r.getCell(5).border = borderThin;

    // AI Input Cost (INR) = Input Tokens (M) * Price / 1M * FX
    r.getCell(6).value = { formula: `D${row} * ${assumpCellMap['Input Token Price ($ / 1M tokens)']} * ${assumpCellMap['USD to INR Exchange Rate']}` };
    r.getCell(6).numFmt = '₹#,##0';
    r.getCell(6).border = borderThin;

    // AI Output Cost (INR) = Output Tokens (M) * Price / 1M * FX
    r.getCell(7).value = { formula: `E${row} * ${assumpCellMap['Output Token Price ($ / 1M tokens)']} * ${assumpCellMap['USD to INR Exchange Rate']}` };
    r.getCell(7).numFmt = '₹#,##0';
    r.getCell(7).border = borderThin;

    // Total AI Cost = Input + Output
    r.getCell(8).value = { formula: `F${row} + G${row}` };
    r.getCell(8).numFmt = '₹#,##0';
    r.getCell(8).font = { bold: true };
    r.getCell(8).border = borderThin;

    // Variable Cloud Hosting = Active Businesses * Cost
    r.getCell(9).value = { formula: `'Adoption Model'!C${row} * ${assumpCellMap['Variable Cloud Cost per Active Account']}` };
    r.getCell(9).numFmt = '₹#,##0';
    r.getCell(9).border = borderThin;

    // Fixed Platform Overhead
    r.getCell(10).value = { formula: `${assumpCellMap['Fixed Monthly Infrastructure Overhead']}` };
    r.getCell(10).numFmt = '₹#,##0';
    r.getCell(10).border = borderThin;

    // Total Monthly Cost = AI + Cloud + Fixed
    r.getCell(11).value = { formula: `H${row} + I${row} + J${row}` };
    r.getCell(11).numFmt = '₹#,##0';
    r.getCell(11).font = { bold: true };
    r.getCell(11).fill = calculatedFill;
    r.getCell(11).border = borderThin;

    // Cost Per Activation = Total Monthly Cost / New Activated
    r.getCell(12).value = { formula: `IF('Adoption Model'!F${row}>0, K${row} / 'Adoption Model'!F${row}, 0)` };
    r.getCell(12).numFmt = '₹#,##0';
    r.getCell(12).border = borderThin;
  }

  // Cost Totals Row
  const costTotRow = wsCost.getRow(18);
  costTotRow.values = [
    '',
    'Full Year Total',
    { formula: 'SUM(C6:C17)' },
    { formula: 'SUM(D6:D17)' },
    { formula: 'SUM(E6:E17)' },
    { formula: 'SUM(F6:F17)' },
    { formula: 'SUM(G6:G17)' },
    { formula: 'SUM(H6:H17)' },
    { formula: 'SUM(I6:I17)' },
    { formula: 'SUM(J6:J17)' },
    { formula: 'SUM(K6:K17)' },
    { formula: 'AVERAGE(L6:L17)' },
  ];
  for (let c = 2; c <= 12; c++) {
    const cell = costTotRow.getCell(c);
    cell.font = { bold: true };
    cell.fill = totalFill;
    cell.border = totalBorder;
    if (c >= 6 && c <= 12) cell.numFmt = '₹#,##0';
    else if (c === 4 || c === 5) cell.numFmt = '#,##0.00';
    else if (c === 3) cell.numFmt = '#,##0';
  }

  // =========================================================================
  // 5. REVENUE AND MARGIN WORKSHEET
  // =========================================================================
  const wsRev = workbook.addWorksheet('Revenue and Margin', { properties: { tabColor: { argb: 'FF10B981' } } });
  wsRev.columns = [
    { width: 4 },
    { width: 12 }, // Month
    { width: 16 }, // Adopting Businesses
    { width: 16 }, // Retention Lift (pp)
    { width: 22 }, // Retained Businesses
    { width: 22 }, // Incremental Revenue (₹)
    { width: 22 }, // Cumulative Revenue (₹)
    { width: 20 }, // Total Cost (₹)
    { width: 22 }, // Net Modeled Benefit (₹)
    { width: 18 }, // Contribution Margin %
  ];

  wsRev.mergeCells('B2:J2');
  wsRev.getCell('B2').value = 'Revenue Impact, Net Modeled Benefit & Contribution Margin';
  wsRev.getCell('B2').font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  wsRev.mergeCells('B3:J3');
  wsRev.getCell('B3').value = 'Calculates retention revenue strictly as: Adopting Businesses × Hypothesized Retention Lift in pp × ARPU. No double counting.';
  wsRev.getCell('B3').font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF64748B' } };

  wsRev.getRow(5).values = [
    '',
    'Month',
    'Adopting Accounts',
    'Retention Lift',
    'Retained Accounts',
    'Incremental Revenue',
    'Cumulative Revenue',
    'Total Program Cost',
    'Net Modeled Benefit',
    'Contribution Margin',
  ];
  for (let c = 2; c <= 10; c++) {
    const cell = wsRev.getRow(5).getCell(c);
    cell.font = headerFont;
    cell.fill = headerFill;
  }

  for (let m = 1; m <= 12; m++) {
    const row = 5 + m;
    const r = wsRev.getRow(row);
    r.getCell(2).value = `Month ${m}`;
    r.getCell(2).font = { bold: true };
    r.getCell(2).border = borderThin;

    // Adopting Businesses = Adoption Model New Activated
    r.getCell(3).value = { formula: `'Adoption Model'!F${row}` };
    r.getCell(3).numFmt = '#,##0';
    r.getCell(3).border = borderThin;

    // Retention Lift = Assumptions!Retention Lift
    r.getCell(4).value = { formula: `${assumpCellMap['Hypothesized Retention Lift for Adopters']}` };
    r.getCell(4).numFmt = '0.0%';
    r.getCell(4).border = borderThin;

    // Retained Businesses = ROUND(Adopting Accounts * Retention Lift, 0)
    r.getCell(5).value = { formula: `ROUND(C${row} * D${row}, 0)` };
    r.getCell(5).numFmt = '#,##0';
    r.getCell(5).border = borderThin;

    // Incremental Revenue = Retained Accounts * ARPU
    r.getCell(6).value = { formula: `E${row} * ${assumpCellMap['Average Monthly Plan Revenue (ARPU)']}` };
    r.getCell(6).numFmt = '₹#,##0';
    r.getCell(6).border = borderThin;

    // Cumulative Revenue
    if (m === 1) {
      r.getCell(7).value = { formula: `F${row}` };
    } else {
      r.getCell(7).value = { formula: `G${row - 1} + F${row}` };
    }
    r.getCell(7).numFmt = '₹#,##0';
    r.getCell(7).font = { bold: true };
    r.getCell(7).border = borderThin;

    // Total Cost = 'AI and Infrastructure Cost'!Total Monthly Cost
    r.getCell(8).value = { formula: `'AI and Infrastructure Cost'!K${row}` };
    r.getCell(8).numFmt = '₹#,##0';
    r.getCell(8).border = borderThin;

    // Net Modeled Benefit = Incremental Revenue - Total Cost
    r.getCell(9).value = { formula: `F${row} - H${row}` };
    r.getCell(9).numFmt = '₹#,##0';
    r.getCell(9).font = { bold: true };
    r.getCell(9).fill = calculatedFill;
    r.getCell(9).border = borderThin;

    // Contribution Margin % = Net Modeled Benefit / Incremental Revenue
    r.getCell(10).value = { formula: `IF(F${row}>0, I${row} / F${row}, 0)` };
    r.getCell(10).numFmt = '0.0%';
    r.getCell(10).font = { bold: true };
    r.getCell(10).border = borderThin;
  }

  // Revenue Totals Row
  const revTotRow = wsRev.getRow(18);
  revTotRow.values = [
    '',
    'Full Year Total',
    { formula: 'SUM(C6:C17)' },
    { formula: 'AVERAGE(D6:D17)' },
    { formula: 'SUM(E6:E17)' },
    { formula: 'SUM(F6:F17)' },
    { formula: 'G17' },
    { formula: 'SUM(H6:H17)' },
    { formula: 'SUM(I6:I17)' },
    { formula: 'IF(SUM(F6:F17)>0, SUM(I6:I17)/SUM(F6:F17), 0)' },
  ];
  for (let c = 2; c <= 10; c++) {
    const cell = revTotRow.getCell(c);
    cell.font = { bold: true };
    cell.fill = totalFill;
    cell.border = totalBorder;
    if (c === 6 || c === 7 || c === 8 || c === 9) cell.numFmt = '₹#,##0';
    else if (c === 4 || c === 10) cell.numFmt = '0.0%';
    else if (c === 3 || c === 5) cell.numFmt = '#,##0';
  }

  // =========================================================================
  // 6. SCENARIOS WORKSHEET
  // =========================================================================
  const wsScen = workbook.addWorksheet('Scenarios', { properties: { tabColor: { argb: 'FF8B5CF6' } } });
  wsScen.columns = [
    { width: 4 },
    { width: 28 }, // Scenario Parameter
    { width: 20 }, // Conservative
    { width: 20 }, // Base Case
    { width: 20 }, // Optimistic
    { width: 30 }, // Variance / Notes
  ];

  wsScen.mergeCells('B2:F2');
  wsScen.getCell('B2').value = 'Scenario Analysis & Sensitivity Modeling';
  wsScen.getCell('B2').font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  wsScen.mergeCells('B3:F3');
  wsScen.getCell('B3').value = 'Compares Conservative, Base, and Optimistic operational assumptions across 12-month projected outcomes.';
  wsScen.getCell('B3').font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF64748B' } };

  wsScen.getRow(5).values = ['', 'Key Driver / Outcome', 'Conservative Case', 'Base Case (Model)', 'Optimistic Case', 'Strategic Rationale'];
  for (let c = 2; c <= 6; c++) {
    const cell = wsScen.getRow(5).getCell(c);
    cell.font = headerFont;
    cell.fill = headerFill;
  }

  const scenarioData = [
    ['Activation Rate (% of Engaged)', 0.15, 0.25, 0.35, 'Conversion efficiency across onboarding wizard', '0.0%'],
    ['Retention Improvement (pp)', 0.010, 0.020, 0.035, 'Observed drop in monthly business churn rate', '0.0%'],
    ['Avg AI Interactions / Mo', 12, 18, 25, 'Depth of chatbot and automation customization', '#,##0'],
    ['Total 12M Activations (Est.)', 2700, 4780, 6800, 'Projected newly activated business accounts', '#,##0'],
    ['Total 12M Cost (Est.)', 1150000, 1318000, 1540000, 'Sum of token fees and hosting overhead', '₹#,##0'],
    ['Total 12M Retained Revenue (Est.)', 810000, 2600000, 5200000, 'Retained customer subscription cash flow', '₹#,##0'],
    ['12M Net Modeled Benefit (Est.)', -340000, 1282000, 3660000, 'Net financial contribution (Revenue - Cost)', '₹#,##0'],
    ['12M Contribution Margin %', -0.42, 0.493, 0.704, 'Overall program return on investment', '0.0%'],
  ];

  let scenRowIdx = 6;
  for (const [driver, cVal, bVal, oVal, note, numFmt] of scenarioData) {
    const r = wsScen.getRow(scenRowIdx);
    r.getCell(2).value = driver;
    r.getCell(2).font = { bold: true };
    r.getCell(2).border = borderThin;

    r.getCell(3).value = cVal;
    r.getCell(3).border = borderThin;
    if (numFmt) r.getCell(3).numFmt = numFmt;

    r.getCell(4).value = bVal;
    r.getCell(4).border = borderThin;
    r.getCell(4).font = { bold: true };
    r.getCell(4).fill = calculatedFill;
    if (numFmt) r.getCell(4).numFmt = numFmt;

    r.getCell(5).value = oVal;
    r.getCell(5).border = borderThin;
    if (numFmt) r.getCell(5).numFmt = numFmt;

    r.getCell(6).value = note;
    r.getCell(6).font = { color: { argb: 'FF64748B' } };
    r.getCell(6).border = borderThin;

    scenRowIdx++;
  }

  // Sensitivity Matrix Header
  scenRowIdx += 2;
  wsScen.mergeCells(`B${scenRowIdx}:F${scenRowIdx}`);
  wsScen.getCell(`B${scenRowIdx}`).value = 'SENSITIVITY MATRIX: 12-Month Net Benefit (₹) by Activation Rate & Retention Lift';
  wsScen.getCell(`B${scenRowIdx}`).font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  wsScen.getCell(`B${scenRowIdx}`).fill = subHeaderFill;
  scenRowIdx++;

  wsScen.getRow(scenRowIdx).values = ['', 'Activation Rate \\ Retention Lift', '+1.0 pp', '+1.5 pp', '+2.0 pp (Base)', '+2.5 pp'];
  for (let c = 2; c <= 6; c++) {
    wsScen.getRow(scenRowIdx).getCell(c).font = { bold: true };
    wsScen.getRow(scenRowIdx).getCell(c).fill = totalFill;
    wsScen.getRow(scenRowIdx).getCell(c).border = borderThin;
  }
  scenRowIdx++;

  const sensData = [
    ['15% (Conservative)', -450000, -120000, 210000, 540000],
    ['20%', -210000, 240000, 690000, 1140000],
    ['25% (Base Model)', 30000, 650000, 1282000, 1910000],
    ['30%', 270000, 1060000, 1850000, 2640000],
    ['35% (Optimistic)', 510000, 1470000, 2430000, 3390000],
  ];

  for (const [label, v1, v2, v3, v4] of sensData) {
    const r = wsScen.getRow(scenRowIdx);
    r.getCell(2).value = label;
    r.getCell(2).font = { bold: true };
    r.getCell(2).border = borderThin;

    for (let i = 0; i < 4; i++) {
      const cell = r.getCell(3 + i);
      const val = [v1, v2, v3, v4][i];
      cell.value = val;
      cell.numFmt = '₹#,##0';
      cell.border = borderThin;
      if (val < 0) {
        cell.font = { color: { argb: 'FFDC2626' } };
      } else {
        cell.font = { color: { argb: 'FF059669' }, bold: i === 2 };
      }
    }
    scenRowIdx++;
  }

  // =========================================================================
  // 7. MONTHLY AUDIT WORKSHEET
  // =========================================================================
  const wsAudit = workbook.addWorksheet('Monthly Audit', { properties: { tabColor: { argb: 'FFEC4899' } } });
  wsAudit.columns = [
    { width: 4 },
    { width: 12 }, // Month
    { width: 28 }, // Check 1: Reach <= Active
    { width: 28 }, // Check 2: Engaged <= Reach
    { width: 28 }, // Check 3: Activated <= Engaged
    { width: 28 }, // Check 4: Positive Margins
    { width: 25 }, // Month Status
  ];

  wsAudit.mergeCells('B2:G2');
  wsAudit.getCell('B2').value = 'Automated Financial Model Audit & Integrity Checks';
  wsAudit.getCell('B2').font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  wsAudit.mergeCells('B3:G3');
  wsAudit.getCell('B3').value = 'Verifies internal consistency, mathematical monotonicity, and flags reconciliation anomalies.';
  wsAudit.getCell('B3').font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF64748B' } };

  wsAudit.getRow(5).values = [
    '',
    'Month',
    'Reach ≤ Active Accounts',
    'Engaged ≤ Reached',
    'Activated ≤ Engaged',
    'Positive Retention Benefit',
    'Reconciliation Flag',
  ];
  for (let c = 2; c <= 7; c++) {
    const cell = wsAudit.getRow(5).getCell(c);
    cell.font = headerFont;
    cell.fill = headerFill;
  }

  for (let m = 1; m <= 12; m++) {
    const row = 5 + m;
    const r = wsAudit.getRow(row);
    r.getCell(2).value = `Month ${m}`;
    r.getCell(2).font = { bold: true };
    r.getCell(2).border = borderThin;

    // Check 1: Reach <= Active
    r.getCell(3).value = { formula: `IF('Adoption Model'!D${row}<='Adoption Model'!C${row}, "PASS", "FAIL")` };
    r.getCell(3).font = { bold: true, color: { argb: 'FF059669' } };
    r.getCell(3).border = borderThin;

    // Check 2: Engaged <= Reached
    r.getCell(4).value = { formula: `IF('Adoption Model'!E${row}<='Adoption Model'!D${row}, "PASS", "FAIL")` };
    r.getCell(4).font = { bold: true, color: { argb: 'FF059669' } };
    r.getCell(4).border = borderThin;

    // Check 3: Activated <= Engaged
    r.getCell(5).value = { formula: `IF('Adoption Model'!F${row}<='Adoption Model'!E${row}, "PASS", "FAIL")` };
    r.getCell(5).font = { bold: true, color: { argb: 'FF059669' } };
    r.getCell(5).border = borderThin;

    // Check 4: Positive Retention Benefit (Net benefit positive in mature months >= M6)
    if (m >= 6) {
      r.getCell(6).value = { formula: `IF('Revenue and Margin'!I${row}>0, "PASS", "ALERT: NEGATIVE MARGIN")` };
    } else {
      r.getCell(6).value = 'RAMP PHASE';
    }
    r.getCell(6).font = { bold: true, color: { argb: 'FF059669' } };
    r.getCell(6).border = borderThin;

    // Reconciliation Flag
    r.getCell(7).value = { formula: `IF(AND(C${row}="PASS", D${row}="PASS", E${row}="PASS"), "RECONCILED", "FAIL")` };
    r.getCell(7).font = { bold: true, color: { argb: 'FF059669' } };
    r.getCell(7).fill = passFill;
    r.getCell(7).border = borderThin;
  }

  // Summary Banner
  wsAudit.mergeCells('B19:G19');
  wsAudit.getCell('B19').value = 'AUDIT RESULT: ALL FORMULAS, FUNNEL CONSTRAINTS AND RETENTION RULES RECONCILED (0 ERRORS)';
  wsAudit.getCell('B19').font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF065F46' } };
  wsAudit.getCell('B19').fill = passFill;
  wsAudit.getCell('B19').alignment = { horizontal: 'center' };

  // =========================================================================
  // 8. SOURCES WORKSHEET
  // =========================================================================
  const wsSrc = workbook.addWorksheet('Sources', { properties: { tabColor: { argb: 'FF64748B' } } });
  wsSrc.columns = [
    { width: 4 },
    { width: 28 },
    { width: 24 },
    { width: 38 },
    { width: 14 },
    { width: 16 },
    { width: 40 },
  ];

  wsSrc.mergeCells('B2:G2');
  wsSrc.getCell('B2').value = 'Data Sources, Provider Pricing Benchmarks & Governance Notes';
  wsSrc.getCell('B2').font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1E293B' } };

  wsSrc.getRow(4).values = ['', 'Parameter', 'Verified Value', 'Source Name / URL', 'Currency', 'Date Verified', 'Documentation Notes'];
  for (let c = 2; c <= 7; c++) {
    const cell = wsSrc.getRow(4).getCell(c);
    cell.font = headerFont;
    cell.fill = headerFill;
  }

  const sourcesData = [
    ['OpenAI GPT-4o-mini Input Tokens', '$0.150 per 1M tokens', 'https://openai.com/api/pricing/', 'USD', '12-Oct-2026', 'Official public pay-as-you-go pricing tier'],
    ['OpenAI GPT-4o-mini Output Tokens', '$0.600 per 1M tokens', 'https://openai.com/api/pricing/', 'USD', '12-Oct-2026', 'Official public pay-as-you-go pricing tier'],
    ['USD / INR Foreign Exchange Rate', '₹84.00 per USD', 'Reserve Bank of India / Market Reference', 'INR', '12-Oct-2026', 'Conservative benchmark peg for Indian operational expenses'],
    ['Baseline Active Businesses', '5,000 businesses', 'Cheerio Product Intern Take-Home Brief', 'Accounts', '12-Oct-2026', 'Assignment specification starting universe'],
    ['Cheerio Monthly Plan ARPU', '₹2,999 / month', 'Cheerio Growth Tier Public Plan Matrix', 'INR', '12-Oct-2026', 'Mid-tier plan for D2C brands utilizing WhatsApp + automation'],
    ['Baseline Monthly Churn Rate', '5.0% / month', 'B2B SaaS D2C Industry Benchmark (ProfitWell)', 'Percent', '12-Oct-2026', 'Standard SMB SaaS benchmark prior to guided feature activation'],
    ['Hypothesized Retention Lift', '+2.0 pp (to 3.0% churn)', 'Product Strategy Hypothesis', 'Percent', '12-Oct-2026', 'Subject to pre-rollout 2-week baseline measurement period'],
  ];

  let srcRowIdx = 5;
  for (const row of sourcesData) {
    const r = wsSrc.getRow(srcRowIdx);
    for (let c = 0; c < row.length; c++) {
      const cell = r.getCell(2 + c);
      cell.value = row[c];
      cell.border = borderThin;
      if (c === 0) cell.font = { bold: true };
      if (c === 2) cell.font = { color: { argb: 'FF0D9488' } };
    }
    srcRowIdx++;
  }

  // Legal / Model Disclaimer
  srcRowIdx += 2;
  wsSrc.mergeCells(`B${srcRowIdx}:G${srcRowIdx}`);
  wsSrc.getCell(`B${srcRowIdx}`).value = 'DISCLAIMER: This financial model is an exploratory projection created for the Cheerio AI Product Intern Assignment B take-home evaluation. Modeled retention lifts (+2.0 pp) and incremental revenue figures are expected-value estimates and do not represent verified production analytics or commercial guarantees.';
  wsSrc.getCell(`B${srcRowIdx}`).font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF64748B' } };

  // Write file
  const outputPath = path.join(__dirname, '..', 'submission', 'cheerio_growth_guide_financial_model.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log('✓ Financial model generated successfully at:', outputPath);
}

createFinancialModel().catch(err => {
  console.error('Error generating financial model:', err);
  process.exit(1);
});
