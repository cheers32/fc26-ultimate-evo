import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`LOG: ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  page.on('pageerror', error => {
    console.log(`PAGEERROR: ${error.message}`);
  });
  
  await page.goto('https://gen-lang-client-0198209189.uc.r.appspot.com', { waitUntil: 'networkidle0' });
  
  console.log("Waiting for team Weiteng Elite...");
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('div.font-bold')).some(el => el.textContent === 'Weiteng Elite');
  });
  
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div.font-bold')).find(el => el.textContent === 'Weiteng Elite');
    if (el) el.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'after_click.png' });
  await browser.close();
})();
