const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'submission', 'screenshots');

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Launching headless Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
    },
  });

  const page = await browser.newPage();

  try {
    // 1. Dashboard
    console.log('Capturing 01-dashboard.png...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
    await page.waitForTimeout ? page.waitForTimeout(1000) : new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01-dashboard.png'), fullPage: false });
    console.log('✓ 01-dashboard.png saved');

    // 2. Growth Guide (Assessment & Recommendations)
    console.log('Capturing 02-growth-guide.png...');
    await page.goto('http://localhost:3000/growth-guide', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // If assessment is visible, click through assessment to reach recommendation state
    const goalOption = await page.$('input[value="answer-questions"]');
    if (goalOption) {
      await goalOption.click();
      await new Promise(r => setTimeout(r, 400));
      // Click Next
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const next = btns.find(b => b.textContent && b.textContent.includes('Next'));
        if (next) next.click();
      });
      await new Promise(r => setTimeout(r, 600));

      // Step 2: pain
      const painOption = await page.$('input[value="repeating-answers"]');
      if (painOption) await painOption.click();
      await new Promise(r => setTimeout(r, 400));
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const next = btns.find(b => b.textContent && b.textContent.includes('Next'));
        if (next) next.click();
      });
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Finish
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const finish = btns.find(b => b.textContent && (b.textContent.includes('See My Recommendation') || b.textContent.includes('Finish') || b.textContent.includes('Recommendation')));
        if (finish) finish.click();
      });
      await new Promise(r => setTimeout(r, 1200));
    }
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02-growth-guide.png'), fullPage: false });
    console.log('✓ 02-growth-guide.png saved');

    // 3. Recommendation Detail
    console.log('Capturing 03-recommendation.png...');
    await page.goto('http://localhost:3000/growth-guide/recommend/chatbot', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03-recommendation.png'), fullPage: false });
    console.log('✓ 03-recommendation.png saved');

    // 4. Chatbot Setup Wizard (FAQ Configuration)
    console.log('Capturing 04-chatbot-setup.png...');
    await page.goto('http://localhost:3000/growth-guide/setup/chatbot', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // Advance to Step 1 (Configure FAQs)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const next = btns.find(b => b.textContent && b.textContent.includes('Continue to FAQs'));
      if (next) next.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04-chatbot-setup.png'), fullPage: false });
    console.log('✓ 04-chatbot-setup.png saved (Step 1 FAQs captured)');

    // 5. Preview & Test / Simulated Activation
    console.log('Capturing 05-preview-and-activation.png...');
    // Click "Continue to Fallback"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const next = btns.find(b => b.textContent && b.textContent.includes('Continue to Fallback'));
      if (next) next.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Click "Continue to Preview & Test"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const next = btns.find(b => b.textContent && b.textContent.includes('Continue to Preview & Test'));
      if (next) next.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Type a sample question in chat simulator
    const chatInput = await page.$('input[placeholder*="Ask"]');
    if (chatInput) {
      await chatInput.type('Are your products safe for acne prone skin?');
      await new Promise(r => setTimeout(r, 400));
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 800));
    }

    // Advance to Review: "Continue to Review"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const next = btns.find(b => b.textContent && b.textContent.includes('Continue to Review'));
      if (next) next.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Check review confirmation checkbox
    await page.evaluate(() => {
      const checkbox = document.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.checked) checkbox.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Click "Activate Chatbot"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const activate = btns.find(b => b.textContent && b.textContent.includes('Activate Chatbot'));
      if (activate) activate.click();
    });

    // Wait for the 2.5s activation animation to complete and reveal success state
    await new Promise(r => setTimeout(r, 3200));

    await page.screenshot({ path: path.join(OUTPUT_DIR, '05-preview-and-activation.png'), fullPage: false });
    console.log('✓ 05-preview-and-activation.png saved (Activation state captured)');

    console.log('\nAll 5 real screenshots captured successfully in submission/screenshots/!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

run();
