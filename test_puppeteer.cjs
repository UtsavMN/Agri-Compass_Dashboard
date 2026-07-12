const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:5174');
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'C:/Users/Utsav M N/.gemini/antigravity/brain/d771ddbe-a70c-4e3a-b563-67d41491731f/screenshot.png' });
  await browser.close();
})();
