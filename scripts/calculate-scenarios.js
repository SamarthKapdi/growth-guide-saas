/**
 * SCENARIO & SENSITIVITY CALCULATOR
 * Calculates exact Conservative, Base, and Optimistic cases
 * and the 5x4 sensitivity matrix.
 */

function runModel(activationRate, retentionLift, avgInteractions) {
  const startingActive = 5000;
  const growthRate = 0.02;
  const reachRate = 0.70;
  const engagementRate = 0.40;
  const baselineChurnRate = 0.05;
  const arpu = 2999;
  const inputTokenPrice = 0.150;
  const outputTokenPrice = 0.600;
  const fxRate = 84.00;
  const avgInputTokens = 650;
  const avgOutputTokens = 250;
  const variableCloudCost = 15.00;
  const fixedOverhead = 25000;

  const costPerCall = ((avgInputTokens / 1e6) * inputTokenPrice + (avgOutputTokens / 1e6) * outputTokenPrice) * fxRate;

  let active = startingActive;
  let totalActivations = 0;
  let totalCost = 0;
  let totalInPeriodRev = 0;
  let activeRetained = 0;

  for (let m = 1; m <= 12; m++) {
    if (m > 1) {
      active = Math.round(active * (1 + growthRate));
    }
    const reached = Math.round(active * reachRate);
    const engaged = Math.round(reached * engagementRate);
    const activated = Math.round(engaged * activationRate);
    totalActivations += activated;

    // AI cost
    const interactions = activated * avgInteractions;
    const aiCost = interactions * costPerCall;
    const cloudCost = active * variableCloudCost;
    const monthlyCost = aiCost + cloudCost + fixedOverhead;
    totalCost += monthlyCost;

    if (m === 12) {
      m12MonthlyCost = monthlyCost;
    }

    // Retained
    const newRetained = Math.round(activated * retentionLift);
    if (m === 1) {
      activeRetained = newRetained;
    } else {
      activeRetained = Math.round(activeRetained * (1 - baselineChurnRate)) + newRetained;
    }
    const monthlyRev = activeRetained * arpu;
    totalInPeriodRev += monthlyRev;
  }

  const exitMRR = activeRetained * arpu;
  const exitARR = exitMRR * 12;
  const annualizedM12Cost = m12MonthlyCost * 12;
  const exitNetBenefit = exitARR - annualizedM12Cost;
  const exitMargin = exitNetBenefit / exitARR;
  const inPeriodNetBenefit = totalInPeriodRev - totalCost;
  const inPeriodMargin = inPeriodNetBenefit / totalInPeriodRev;

  return {
    activations: totalActivations,
    totalCost: Math.round(totalCost),
    m12MonthlyCost: Math.round(m12MonthlyCost),
    annualizedM12Cost: Math.round(annualizedM12Cost),
    inPeriodRev: Math.round(totalInPeriodRev),
    inPeriodNetBenefit: Math.round(inPeriodNetBenefit),
    inPeriodMargin: inPeriodMargin,
    activeRetainedM12: activeRetained,
    exitMRR: Math.round(exitMRR),
    exitARR: Math.round(exitARR),
    exitNetBenefit: Math.round(exitNetBenefit),
    exitMargin: exitMargin,
  };
}

console.log('--- SCENARIO COMPARISON ---');
const cons = runModel(0.15, 0.010, 12);
const base = runModel(0.25, 0.020, 18);
const opt = runModel(0.35, 0.035, 25);

console.log('Driver / Outcome             | Conservative   | Base Case      | Optimistic');
console.log('-----------------------------+----------------+----------------+----------------');
console.log(`Activation Rate              | 15.0%          | 25.0%          | 35.0%`);
console.log(`Retention Improvement (pp)   | +1.0 pp        | +2.0 pp        | +3.5 pp`);
console.log(`Avg AI Interactions / Mo     | 12             | 18             | 25`);
console.log(`Total 12M Activations        | ${cons.activations}          | ${base.activations}          | ${opt.activations}`);
console.log(`Total 12M Cost (₹)           | ₹${cons.totalCost.toLocaleString()}    | ₹${base.totalCost.toLocaleString()}    | ₹${opt.totalCost.toLocaleString()}`);
console.log(`12M In-Period Revenue (₹)    | ₹${cons.inPeriodRev.toLocaleString()}      | ₹${base.inPeriodRev.toLocaleString()}    | ₹${opt.inPeriodRev.toLocaleString()}`);
console.log(`In-Period Net Benefit (₹)    | ₹${cons.inPeriodNetBenefit.toLocaleString()}    | ₹${base.inPeriodNetBenefit.toLocaleString()}      | ₹${opt.inPeriodNetBenefit.toLocaleString()}`);
console.log(`In-Period Margin %           | ${(cons.inPeriodMargin * 100).toFixed(1)}%         | ${(base.inPeriodMargin * 100).toFixed(1)}%          | ${(opt.inPeriodMargin * 100).toFixed(1)}%`);
console.log(`M12 Exit Retained Accounts   | ${cons.activeRetainedM12} accounts    | ${base.activeRetainedM12} accounts    | ${opt.activeRetainedM12} accounts`);
console.log(`Exit MRR (M12) (₹)           | ₹${cons.exitMRR.toLocaleString()}        | ₹${base.exitMRR.toLocaleString()}      | ₹${opt.exitMRR.toLocaleString()}`);
console.log(`Exit ARR Run Rate (₹)        | ₹${cons.exitARR.toLocaleString()}    | ₹${base.exitARR.toLocaleString()}    | ₹${opt.exitARR.toLocaleString()}`);
console.log(`Exit Net Benefit (₹)         | ₹${cons.exitNetBenefit.toLocaleString()}     | ₹${base.exitNetBenefit.toLocaleString()}    | ₹${opt.exitNetBenefit.toLocaleString()}`);
console.log(`Exit Contribution Margin %   | ${(cons.exitMargin * 100).toFixed(1)}%         | ${(base.exitMargin * 100).toFixed(1)}%          | ${(opt.exitMargin * 100).toFixed(1)}%`);

console.log('\n--- SENSITIVITY MATRIX (Exit Net Benefit in ₹) ---');
console.log('Activation \\ Lift | +1.0 pp      | +1.5 pp      | +2.0 pp (Base)| +2.5 pp');
console.log('------------------+--------------+--------------+---------------+--------------');

const actRates = [
  { label: '15% (Conservative)', r: 0.15 },
  { label: '20%', r: 0.20 },
  { label: '25% (Base Model)', r: 0.25 },
  { label: '30%', r: 0.30 },
  { label: '35% (Optimistic)', r: 0.35 },
];
const lifts = [0.010, 0.015, 0.020, 0.025];

for (const act of actRates) {
  const rowVals = lifts.map(lift => {
    const res = runModel(act.r, lift, 18);
    return res.exitNetBenefit;
  });
  console.log(
    `${act.label.padEnd(17)} | ` +
    rowVals.map(v => String('₹' + v.toLocaleString()).padStart(12)).join(' | ')
  );
}
