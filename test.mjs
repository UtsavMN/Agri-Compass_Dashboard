import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const devServer = spawn('npm', ['run', 'dev'], { shell: true });

setTimeout(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`PAGE ${msg.type().toUpperCase()}:`, msg.text());
    }
  });
  
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    console.log('Page loaded');
    await new Promise(r => setTimeout(r, 5000));
  } catch (e) {
    console.log('Failed to load', e);
  }
  
  await browser.close();
  devServer.kill();
  process.exit(0);
}, 5000);
