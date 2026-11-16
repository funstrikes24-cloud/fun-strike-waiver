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

const cleanCreditBadge = `    <!-- Official Developer & Partner Credit Badge -->
    <footer class="site-credit-wrap no-print" aria-label="Developer credits" style="margin-top: 24px; padding-bottom: 20px;">
      <div class="creator-credit-badge">
        <span>Made with</span>
        <span class="heart-icon" aria-label="love">❤️</span>
        <span>by</span>
        <a href="https://www.linkedin.com/in/aryanpandya" target="_blank" rel="noopener noreferrer">Aryan</a>
        <span>&amp;</span>
        <a href="https://nexoraonesolution.com/" target="_blank" rel="noopener noreferrer">NexoraOneSolution</a>
      </div>
    </footer>`;

targetFiles.forEach(rel => {
  const full = path.join('E:/Aryan/fun-strikes-waiver', rel);
  if (!fs.existsSync(full)) return;
  let html = fs.readFileSync(full, 'utf8');

  // Remove any previously injected credit-line inside sheet-footer
  html = html.replace(/<div class="credit-line"[\s\S]*?<\/div>/g, '');
  // Remove any previously injected site-credit-wrap
  html = html.replace(/<!-- Official Developer[\s\S]*?<\/footer>/g, '');

  // Clean sheet-footer so it only has the venue details
  // And place cleanCreditBadge right after </main> or right before </main>
  if (html.includes('</main>')) {
    html = html.replace('</main>', cleanCreditBadge + '\n  </main>');
    fs.writeFileSync(full, html, 'utf8');
    console.log('Cleaned and updated layout in', rel);
  } else {
    console.log('No </main> in', rel);
  }
});
