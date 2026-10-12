// Cohort Simulation Script
const startingActive = 5000;
const growthRate = 0.02;
const reachRate = 0.70;
const engageRate = 0.40;
const activateRate = 0.25;
const arpu = 2999;
const baselineChurn = 0.05; // 5% monthly churn
const retentionLift = 0.02; // +2.0 pp monthly retention improvement (churn reduces to 3%)

console.log('--- COHORT RETENTION SIMULATION ---');

// Let's track monthly newly activated accounts
const monthlyActive = [];
const monthlyActivated = [];
let currActive = startingActive;

for (let m = 1; m <= 12; m++) {
  if (m > 1) currActive = Math.round(currActive * (1 + growthRate));
  monthlyActive.push(currActive);
  const reached = Math.round(currActive * reachRate);
  const engaged = Math.round(reached * engageRate);
  const activated = Math.round(engaged * activateRate);
  monthlyActivated.push(activated);
}

console.log('Monthly Activations:', monthlyActivated);
const totalActivations = monthlyActivated.reduce((a, b) => a + b, 0);
console.log('Total 12M Activations:', totalActivations);

// Model A: Each month, the newly activated cohort has +2.0 pp retention in that month
// and then survives with (1 - (baselineChurn - retentionLift)) = 97% survival each subsequent month!
// The incremental retained accounts active in month m:
// From cohort k (k <= m), the incremental retained accounts relative to control:
// In cohort k of size N_k, without Growth Guide churn is 5%, with Growth Guide churn is 3%.
// Incremental surviving accounts in month m = N_k * [(1 - 0.03)^(m - k + 1) - (1 - 0.05)^(m - k + 1)]
console.log('\n--- COHORT DECAY MODEL ---');
const activeRetainedInMonth = [];
const revenueInMonth = [];

for (let m = 1; m <= 12; m++) {
  let incrementalRetainedInM = 0;
  for (let k = 1; k <= m; k++) {
    const elapsedMonths = m - k + 1;
    const n_k = monthlyActivated[k - 1];
    // Baseline survival after elapsedMonths: (1 - 0.05)^elapsedMonths
    // Treatment survival after elapsedMonths: (1 - 0.03)^elapsedMonths
    const baselineSurvival = Math.pow(1 - baselineChurn, elapsedMonths);
    const treatmentSurvival = Math.pow(1 - (baselineChurn - retentionLift), elapsedMonths);
    const incrementalAccountsFromCohortK = n_k * (treatmentSurvival - baselineSurvival);
    incrementalRetainedInM += incrementalAccountsFromCohortK;
  }
  activeRetainedInMonth.push(incrementalRetainedInM);
  revenueInMonth.push(incrementalRetainedInM * arpu);
}

for (let m = 1; m <= 12; m++) {
  console.log(`M${m}: Active Retained Accounts=${activeRetainedInMonth[m-1].toFixed(1)}, Monthly In-Period Rev=₹${Math.round(revenueInMonth[m-1])}`);
}

const totalRecognizedRevenue = revenueInMonth.reduce((a, b) => a + b, 0);
const m12MRR = revenueInMonth[11];
const m12ARR = m12MRR * 12;

console.log(`\nTotal In-Period Recognized Revenue (12M Sum): ₹${Math.round(totalRecognizedRevenue)}`);
console.log(`Month 12 Exit Monthly Run Rate (MRR): ₹${Math.round(m12MRR)}`);
console.log(`Month 12 Exit Annualized Recurring Revenue (ARR): ₹${Math.round(m12ARR)}`);
