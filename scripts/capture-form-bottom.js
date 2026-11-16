const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const htmlPath = 'file:///' + path.resolve('E:/Aryan/fun-strikes-waiver/pal-gokart/index.html').replace(/\\/g, '/');
const outPng = path.resolve('E:/Aryan/fun-strikes-waiver/printables/webform-bottom-fixed.png');

console.log('Capturing screenshot of web form bottom...');
execSync(`"${chromePath}" --headless --disable-gpu --window-size=1200,1600 --screenshot="${outPng}" "${htmlPath}"`, { stdio: 'inherit' });
console.log('Done!');
