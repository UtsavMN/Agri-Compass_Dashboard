const puppeteer = require('puppeteer');

async function run() {
  const prefix = process.argv[2] || 'screenshot';
  const outDir = 'C:\\Users\\Utsav M N\\.gemini\\antigravity\\brain\\217ad51b-2e6f-4e26-b0f3-553f68b24240';
  
  console.log(`Starting puppeteer for ${prefix}...`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Emulate reduced motion to skip the intro animation immediately
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  
  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000)); // allow WebGL to settle
  
  // Hero Section
  console.log('Capturing Hero...');
  await page.screenshot({ path: `${outDir}\\${prefix}_hero.png` });
  
  // Problem Section
  console.log('Capturing Problem Section...');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${outDir}\\${prefix}_problem.png` });
  
  // Smart Farm Section
  console.log('Capturing Smart Farm...');
  const smartFarmHeight = await page.evaluate(() => {
    const el = document.getElementById('features');
    return el ? el.offsetTop : window.innerHeight * 2.5;
  });
  await page.evaluate((y) => window.scrollTo(0, y), smartFarmHeight);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${outDir}\\${prefix}_smartfarm.png` });

  // Engineering Lab
  console.log('Capturing Engineering Lab...');
  const engLabHeight = await page.evaluate(() => {
    const el = document.getElementById('engineering-lab');
    return el ? el.offsetTop : window.innerHeight * 4;
  });
  await page.evaluate((y) => window.scrollTo(0, y), engLabHeight);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${outDir}\\${prefix}_englab.png` });
  
  await browser.close();
  console.log(`Finished ${prefix}`);
}

run().catch(console.error);
