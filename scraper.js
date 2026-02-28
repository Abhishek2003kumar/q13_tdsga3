const { chromium } = require('playwright');

const seeds = [40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
const BASE_URL = 'https://sanand0.github.io/tdsdata/js_table/?seed=';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `${BASE_URL}${seed}`;
    console.log(`Scraping: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for table to render via JS
      await page.waitForSelector('table', { timeout: 15000 });

      const numbers = await page.evaluate(() => {
        const cells = document.querySelectorAll('table td, table th');
        const nums = [];
        cells.forEach(cell => {
          const text = cell.innerText.trim().replace(/,/g, '');
          const num = parseFloat(text);
          if (!isNaN(num)) nums.push(num);
        });
        return nums;
      });

      const seedTotal = numbers.reduce((a, b) => a + b, 0);
      console.log(`  Seed ${seed}: ${numbers.length} numbers, subtotal = ${seedTotal}`);
      grandTotal += seedTotal;
    } catch (e) {
      console.log(`  ERROR on seed ${seed}: ${e.message}`);
    }
  }

  await browser.close();
  console.log(`Total: ${grandTotal}`);
})();
