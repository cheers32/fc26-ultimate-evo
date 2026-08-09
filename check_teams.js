import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  
  const checkTeam = async (id, name) => {
    const page = await browser.newPage();
    page.on('console', msg => {
      console.log(`[${name}] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    page.on('pageerror', error => {
      console.log(`[${name}] PAGEERROR: ${error.message}`);
    });
    
    console.log(`Checking ${name} (${id})...`);
    await page.goto(`https://gen-lang-client-0198209189.uc.r.appspot.com/?team=${id}`, { waitUntil: 'networkidle0' });
    await page.close();
  };
  
  await checkTeam("tmslcwokchv7zgt", "Weiteng Elite");
  
  await browser.close();
})();
