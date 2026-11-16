const { execFileSync } = require('child_process');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = 'E:/Aryan/fun-strikes-waiver/pal-gokart/index.html';
const imgPath = 'E:/Aryan/fun-strikes-waiver/printables/pal-gokart-form-view.png';

execFileSync(CHROME_PATH, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=1200,3200',
  `--screenshot=${imgPath}`,
  htmlPath
]);
console.log('Saved:', imgPath);
