const { execSync } = require('child_process');
const fs = require('fs');

const cmd = '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless --no-sandbox --window-size=1100,1400 --screenshot="E:\\Aryan\\fun-strikes-waiver\\printables\\footer-fixed-view.png" "file:///E:/Aryan/fun-strikes-waiver/printables/test-footer-snippet.html"';
execSync(cmd, { stdio: 'inherit' });
console.log('File written, exists:', fs.existsSync('E:/Aryan/fun-strikes-waiver/printables/footer-fixed-view.png'));
