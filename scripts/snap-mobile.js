const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const htmlUri = 'file:///' + path.resolve('E:/Aryan/fun-strikes-waiver/pal-trampoline/index.html').replace(/\\/g, '/');
const outPng = path.resolve('E:/Aryan/fun-strikes-waiver/printables/mobile-form-top.png');

execSync(`"${chromePath}" --headless --disable-gpu --window-size=375,1200 --screenshot="${outPng}" "${htmlUri}"`, { stdio: 'ignore' });
console.log('Mobile screenshot captured');
