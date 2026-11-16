const fs = require('fs');
const path = require('path');

const targetFiles = [
  'pal-gokart/index.html',
  'gokart/index.html',
  'pal-trampoline/index.html',
  'pal/index.html',
  'PAL/index.html',
  'motavarachha-softplay/index.html',
  'varachha/index.html',
  'VARACHHA/index.html'
];

const creditHtml = `        <div class="credit-line" style="width: 100%; text-align: center; padding-top: 8px; margin-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 11.5px; font-weight: 600;">
          Made with ❤️ by <a href="https://www.linkedin.com/in/aryanpandya" target="_blank" rel="noopener noreferrer" style="color: #be123c; font-weight: 700; text-decoration: underline;">Aryan</a> and <a href="https://nexoraonesolution.com/" target="_blank" rel="noopener noreferrer" style="color: #be123c; font-weight: 700; text-decoration: underline;">NexoraOneSolution</a>
        </div>`;

targetFiles.forEach(rel => {
  const full = path.join('E:/Aryan/fun-strikes-waiver', rel);
  if (!fs.existsSync(full)) return;
  let content = fs.readFileSync(full, 'utf8');
  if (content.includes('Made with ❤️ by')) {
    console.log(rel, 'already has credit');
    return;
  }
  if (content.includes('</footer>')) {
    content = content.replace('</footer>', creditHtml + '\n      </footer>');
    fs.writeFileSync(full, content, 'utf8');
    console.log('Updated', rel);
  }
});
