import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('ERROR:', error.message));
  
  await page.goto('https://gen-lang-client-0198209189.uc.r.appspot.com', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'white_screen.png' });
  await browser.close();
})();
