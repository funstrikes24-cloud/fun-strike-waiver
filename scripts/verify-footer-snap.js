const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000 });
  await page.goto('file:///' + path.resolve('E:/Aryan/fun-strikes-waiver/pal-gokart/index.html').replace(/\\/g, '/'), { waitUntil: 'load' });

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));

  const footerEl = await page.$('.sheet-footer');
  console.log('sheet-footer element found:', !!footerEl);
  const floatingBadge = await page.$('.creator-credit-badge');
  console.log('floating badge found:', !!floatingBadge);

  // Take screenshot of the bottom portion containing footer
  const box = await footerEl.boundingBox();
  console.log('Footer bounding box:', box);

  await page.screenshot({
    path: 'E:/Aryan/fun-strikes-waiver/printables/form-footer-verified.png',
    clip: {
      x: Math.max(0, box.x - 40),
      y: Math.max(0, box.y - 120),
      width: box.width + 80,
      height: box.height + 150
    }
  });

  console.log('Screenshot saved to: E:/Aryan/fun-strikes-waiver/printables/form-footer-verified.png');
  await browser.close();
})();
