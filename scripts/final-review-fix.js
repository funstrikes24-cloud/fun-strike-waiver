/**
 * FINAL REVIEW FIX — Fun Strike Waiver Project
 * =============================================
 * 1. Rebuilds the sheet-footer in ALL 8 HTML files to exact spec:
 *    LEFT: Fun Strikes Entertainment LLP
 *    RIGHT: Fun Strike! Game Zone • Branch • Surat, Gujarat
 *    CENTRE (below, dashed separator): Made with ❤️ by Aryan and NexoraOneSolution
 * 2. Updates Code.gs similarly for the printed legal document footer.
 */

const fs = require('fs');
const path = require('path');

const BASE = 'E:/Aryan/fun-strikes-waiver';

// ─── 1. HTML FOOTER TEMPLATES ────────────────────────────────────────────────

function htmlFooter(rightText) {
  return `      <footer class="sheet-footer">
        <div class="sheet-footer-row">
          <span class="sheet-footer-left">Fun Strikes Entertainment LLP</span>
          <span class="sheet-footer-right">${rightText}</span>
        </div>
        <div class="sheet-footer-credit">
          <span>Made with ❤️ by</span>
          <a href="https://www.linkedin.com/in/aryanpandya" target="_blank" rel="noopener noreferrer">Aryan</a>
          <span>and</span>
          <a href="https://nexoraonesolution.com/" target="_blank" rel="noopener noreferrer">NexoraOneSolution</a>
        </div>
      </footer>`;
}

const PAGES = [
  { dir: 'pal-gokart',         right: 'Fun Strike! Game Zone &bull; Gauravpath Road, Pal &bull; Surat, Gujarat' },
  { dir: 'gokart',             right: 'Fun Strike! Game Zone &bull; Gauravpath Road, Pal &bull; Surat, Gujarat' },
  { dir: 'pal-trampoline',     right: 'Fun Strike! Game Zone &bull; Gauravpath Road, Pal &bull; Surat, Gujarat' },
  { dir: 'pal',                right: 'Fun Strike! Game Zone &bull; Gauravpath Road, Pal &bull; Surat, Gujarat' },
  { dir: 'PAL',                right: 'Fun Strike! Game Zone &bull; Gauravpath Road, Pal &bull; Surat, Gujarat' },
  { dir: 'motavarachha-softplay', right: 'Fun Strike! Game Zone &bull; Mota Varachha &bull; Surat, Gujarat' },
  { dir: 'varachha',           right: 'Fun Strike! Game Zone &bull; Mota Varachha &bull; Surat, Gujarat' },
  { dir: 'VARACHHA',           right: 'Fun Strike! Game Zone &bull; Mota Varachha &bull; Surat, Gujarat' },
];

PAGES.forEach(({ dir, right }) => {
  const filePath = path.join(BASE, dir, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${dir}/index.html`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Remove all existing sheet-footer blocks (clean slate)
  html = html.replace(/\s*<footer class="sheet-footer"[\s\S]*?<\/footer>/gi, '');

  // Remove any stray creator-credit-badge
  html = html.replace(/\s*<div class="creator-credit-badge"[\s\S]*?<\/div>/gi, '');

  const footer = '\n' + htmlFooter(right) + '\n    ';

  // Insert ONE footer at end of <form> (before </form>)
  html = html.replace('</form>', footer + '</form>');

  // Insert ONE footer inside submissionScreen (before </section> of that block)
  const subStart = html.indexOf('id="submissionScreen"');
  if (subStart !== -1) {
    const sectionClose = html.indexOf('</section>', subStart);
    if (sectionClose !== -1) {
      html = html.slice(0, sectionClose) + footer + html.slice(sectionClose);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Updated footer: ${dir}/index.html`);
});

// ─── 2. CSS — Replace sheet-footer styles ────────────────────────────────────

const cssPath = path.join(BASE, 'assets/css/styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const oldFooterCss = css.match(/\/\*.*?Feedback Banner/s);

const newFooterCss = `
/* ═══ SHEET FOOTER ═══════════════════════════════════════════ */
.sheet-footer {
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1.5px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--ink-muted, #64748b);
}

/* Top row: Left company name | Right venue + branch */
.sheet-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  width: 100%;
  padding-bottom: 8px;
}

.sheet-footer-left {
  flex: 0 0 auto;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}

.sheet-footer-right {
  flex: 1 1 auto;
  text-align: right;
  color: #475569;
  white-space: nowrap;
  font-weight: 600;
}

/* Credit row: centred, dashed separator above */
.sheet-footer-credit {
  width: 100%;
  text-align: center;
  padding-top: 8px;
  border-top: 1px dashed #e2e8f0;
  font-size: 0.775rem;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.sheet-footer-credit a {
  color: #be123c;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2.5px;
  transition: color 0.15s ease-in-out;
}

.sheet-footer-credit a:hover {
  color: #0f172a;
}

/* Feedback Banner`;

// Replace from .sheet-footer { ... down to /* Feedback Banner
css = css.replace(/\.sheet-footer \{[\s\S]*?\/\* Feedback Banner/, newFooterCss);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✓ Updated styles.css sheet-footer rules');

console.log('\n✅ All HTML footers and CSS updated.');
console.log('Next: run update-code-gs.js and test-print-render.js');
