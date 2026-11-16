const fs = require('fs');
const path = require('path');

const dirs = [
  'pal-gokart', 'gokart',
  'pal-trampoline', 'pal', 'PAL',
  'motavarachha-softplay', 'varachha', 'VARACHHA'
];

function buildFooter(branchText) {
  return [
    '      <footer class="sheet-footer">',
    '        <div class="sheet-footer-main">',
    '          <span>Fun Strikes Entertainment LLP &bull; Fun Strike! Game Zone</span>',
    '          <span>' + branchText + '</span>',
    '        </div>',
    '        <div class="sheet-footer-credit">',
    '          <span>Made with ❤️ by</span>',
    '          <a href="https://www.linkedin.com/in/aryanpandya" target="_blank" rel="noopener noreferrer">Aryan</a>',
    '          <span>and</span>',
    '          <a href="https://nexoraonesolution.com/" target="_blank" rel="noopener noreferrer">NexoraOneSolution</a>',
    '        </div>',
    '      </footer>'
  ].join('\n');
}

dirs.forEach(d => {
  const filePath = path.join('E:/Aryan/fun-strikes-waiver', d, 'index.html');
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  let branchText = 'Gauravpath Road, Pal &bull; Surat, Gujarat';
  if (d.toLowerCase().includes('varachha')) {
    branchText = 'Mota Varachha &bull; Surat, Gujarat';
  }

  // 1. Remove any floating credit badge or floating pill
  html = html.replace(/\s*<div class="creator-credit-badge"[\s\S]*?<\/div>/gi, '');

  // 2. Remove all existing sheet-footers inside the file
  html = html.replace(/\s*<footer class="sheet-footer"[\s\S]*?<\/footer>/gi, '');

  // 3. Place exactly ONE footer at the end of form (before </form>)
  const formEndMarker = '</form>';
  const formEndIdx = html.indexOf(formEndMarker);
  if (formEndIdx !== -1) {
    const footerHtml = '\n' + buildFooter(branchText) + '\n    ';
    html = html.slice(0, formEndIdx) + footerHtml + html.slice(formEndIdx);
  }

  // 4. Place ONE footer at the end of submissionScreen (before </section>)
  const subScreenMarker = 'id="submissionScreen"';
  const subScreenIdx = html.indexOf(subScreenMarker);
  if (subScreenIdx !== -1) {
    const nextSectionClose = html.indexOf('</section>', subScreenIdx);
    if (nextSectionClose !== -1) {
      const footerHtml = '\n' + buildFooter(branchText) + '\n    ';
      html = html.slice(0, nextSectionClose) + footerHtml + html.slice(nextSectionClose);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Cleaned and standardized footers in:', d);
});
