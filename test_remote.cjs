const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  await page.goto('https://gen-lang-client-0198209189.uc.r.appspot.com', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'remote_screenshot.png' });
  await browser.close();
})();
