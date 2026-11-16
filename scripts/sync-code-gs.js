const fs = require('fs');

const codePath = 'E:/Aryan/fun-strikes-waiver/google-apps-script/Code.gs';
let code = fs.readFileSync(codePath, 'utf8');

const rendererCode = fs.readFileSync('E:/Aryan/fun-strikes-waiver/scripts/test-all-counts.js', 'utf8');

const fnStartInRenderer = rendererCode.indexOf('function buildPrintableHtml(r) {');
const fnEndInRenderer = rendererCode.indexOf('// Test cases');
let fnBody = rendererCode.slice(fnStartInRenderer, fnEndInRenderer).trim();

// Rename to buildPrintableHtml_ for Code.gs standard
fnBody = fnBody.replace('function buildPrintableHtml(r)', 'function buildPrintableHtml_(r)');
fnBody = fnBody.replace(/escapeHtml\(/g, 'escapeHtml_(');

const fnStartInCode = code.indexOf('function buildPrintableHtml_(r)');
if (fnStartInCode === -1) {
  console.error('Marker not found in Code.gs');
  process.exit(1);
}

const updatedCode = code.slice(0, fnStartInCode) + fnBody + '\n';
fs.writeFileSync(codePath, updatedCode, 'utf8');
console.log('Successfully updated Code.gs with dynamic 1 to 20 riders support!');
