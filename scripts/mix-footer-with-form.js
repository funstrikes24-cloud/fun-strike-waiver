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

targetFiles.forEach(rel => {
  const full = path.join('E:/Aryan/fun-strikes-waiver', rel);
  if (!fs.existsSync(full)) return;
  let html = fs.readFileSync(full, 'utf8');

  // 1. Remove separate credit badge outside the card
  html = html.replace(/\s*<!-- Official Developer[\s\S]*?<\/footer>/g, '');
  html = html.replace(/\s*<footer class="site-credit-wrap[\s\S]*?<\/footer>/g, '');
  html = html.replace(/\s*<div class="creator-credit-badge[\s\S]*?<\/div>/g, '');

  // 2. Identify venue branch line for this page
  let branchText = 'Gauravpath Road, Pal &bull; Surat, Gujarat';
  if (rel.includes('varachha') || rel.includes('VARACHHA')) {
    branchText = 'Mota Varachha &bull; Surat, Gujarat';
  }

  const insideFooterHtml = `      <footer class="sheet-footer">
        <div class="sheet-footer-main">
          <span>Fun Strikes Entertainment LLP &bull; Fun Strike! Game Zone</span>
          <span>${branchText}</span>
        </div>
        <div class="sheet-footer-credit">
          <span>Made with ❤️ by</span>
          <a href="https://www.linkedin.com/in/aryanpandya" target="_blank" rel="noopener noreferrer">Aryan</a>
          <span>and</span>
          <a href="https://nexoraonesolution.com/" target="_blank" rel="noopener noreferrer">NexoraOneSolution</a>
        </div>
      </footer>`;

  // Replace existing sheet-footer inside waiverForm
  html = html.replace(/<footer class="sheet-footer">[\s\S]*?<\/footer>/g, insideFooterHtml);

  // Also ensure confirmation screen has the same inside footer
  const confirmFooter = `        <footer class="sheet-footer" style="margin-top: 24px;">
          <div class="sheet-footer-main">
            <span>Fun Strikes Entertainment LLP &bull; Fun Strike! Game Zone</span>
            <span>${branchText}</span>
          </div>
          <div class="sheet-footer-credit">
            <span>Made with ❤️ by</span>
            <a href="https://www.linkedin.com/in/aryanpandya" target="_blank" rel="noopener noreferrer">Aryan</a>
            <span>and</span>
            <a href="https://nexoraonesolution.com/" target="_blank" rel="noopener noreferrer">NexoraOneSolution</a>
          </div>
        </footer>
      </div>
    </section>`;

  html = html.replace(/<\/div>\s*<\/section>/, confirmFooter);

  fs.writeFileSync(full, html, 'utf8');
  console.log('Successfully mixed footer into form card in', rel);
});
