const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outPng = path.resolve('E:/Aryan/fun-strikes-waiver/printables/mobile-form-bottom.png');

const snippetHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../assets/css/styles.css">
</head>
<body style="background: #f1f5f9; padding: 6px;">
  <div class="waiver-sheet" style="max-width: 100%;">
    <section class="form-section agreement-section">
      <div class="signature-block">
        <div class="signature-header">
          <span class="sig-label-text">CUSTOMER / PARENT / GUARDIAN SIGNATURE<span class="req">*</span></span>
          <button type="button" class="btn-clear-sig">Clear Signature</button>
        </div>
        <div class="sig-pad-wrap">
          <canvas class="sig-canvas" style="background:#fff;"></canvas>
          <div class="sig-baseline"></div>
        </div>
      </div>
      <div class="customer-submit-bar">
        <p class="submit-note">By clicking <strong>Submit Waiver</strong>, you confirm all participant details are accurate.</p>
        <button type="button" class="btn btn-primary btn-lg" style="background:#0284c7; width:100%;">Submit Trampoline Waiver</button>
      </div>
      <footer class="sheet-footer">
        <div class="sheet-footer-col sheet-footer-left"><span>Fun Strikes Entertainment LLP</span></div>
        <div class="sheet-footer-col sheet-footer-center"><span>Made with ❤️ by <a href="#">Aryan</a> &amp; <a href="#">NexoraOneSolution</a></span></div>
        <div class="sheet-footer-col sheet-footer-right"><span>Fun Strike! Game Zone &bull; Gauravpath Road, Pal, Surat</span></div>
      </footer>
    </section>
  </div>
</body>
</html>
`;

fs.writeFileSync('E:/Aryan/fun-strikes-waiver/printables/test-mobile-bottom.html', snippetHtml, 'utf8');

const snippetUri = 'file:///' + path.resolve('E:/Aryan/fun-strikes-waiver/printables/test-mobile-bottom.html').replace(/\\/g, '/');
execSync(`"${chromePath}" --headless --disable-gpu --window-size=375,650 --screenshot="${outPng}" "${snippetUri}"`, { stdio: 'ignore' });
console.log('Mobile bottom screenshot captured');
