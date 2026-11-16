const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// We can capture screenshot with different scroll offsets or using print emulation
const htmlUri = 'file:///' + path.resolve('E:/Aryan/fun-strikes-waiver/printables/framed-gokart-single.html').replace(/\\/g, '/');
execSync(`"${chromePath}" --headless --disable-gpu --window-size=950,1500 --screenshot="E:/Aryan/fun-strikes-waiver/printables/snap-single-page.png" "${htmlUri}"`, { stdio: 'ignore' });
console.log('Captured single page snap');
