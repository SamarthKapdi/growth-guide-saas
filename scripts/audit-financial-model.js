const ExcelJS = require('exceljs');
const path = require('path');

async function auditModel() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, '..', 'submission', 'cheerio_growth_guide_financial_model.xlsx'));

  console.log('--- AUDITING SHEETS ---');
  for (const ws of wb.worksheets) {
    console.log(`Sheet: "${ws.name}" (${ws.rowCount} rows, ${ws.columnCount} cols)`);
  }

  // Print Assumptions
  console.log('\n--- ASSUMPTIONS ---');
  const wsAssump = wb.getWorksheet('Assumptions');
  wsAssump.eachRow((row, rNum) => {
    const pName = row.getCell(2).value;
    const pVal = row.getCell(3).value;
    const pUnit = row.getCell(4).value;
    if (pName && typeof pName === 'string' && !pName.includes('SECTION')) {
      console.log(`Row ${rNum}: ${pName} = ${pVal} (${pUnit})`);
    }
  });

  // Calculate Month-by-Month Adoption Funnel
  console.log('\n--- ADOPTION MODEL (CALCULATED NUMBERS) ---');
  const startingActive = 5000;
  const growthRate = 0.02;
  const reachRate = 0.70;
  const engageRate = 0.40;
  const activateRate = 0.25;
  const meaningfulRate = 0.60;
  const retentionLift = 0.02; // +2.0 pp
  const arpu = 2999;

  let active = startingActive;
  let totalActivations = 0;
  let totalRetainedAccounts = 0;
  let totalRevenue = 0;

  for (let m = 1; m <= 12; m++) {
    if (m > 1) {
      active = Math.round(active * (1 + growthRate));
    }
    const reached = Math.round(active * reachRate);
    const engaged = Math.round(reached * engageRate);
    const activated = Math.round(engaged * activateRate);
    const meaningful = Math.round(activated * meaningfulRate);
    const retained = Math.round(activated * retentionLift);
    const rev = retained * arpu;

    totalActivations += activated;
    totalRetainedAccounts += retained;
    totalRevenue += rev;

    console.log(`M${m}: Active=${active}, Reached=${reached}, Engaged=${engaged}, Activated=${activated}, Retained=${retained}, MonthlyRetainedRev=₹${rev}`);
  }

  console.log(`\n12-Month Total Activations: ${totalActivations}`);
  console.log(`12-Month Total Retained Accounts (monthly sum): ${totalRetainedAccounts}`);
  console.log(`12-Month Total Retained Revenue (monthly sum): ₹${totalRevenue}`);
}

auditModel().catch(console.error);
