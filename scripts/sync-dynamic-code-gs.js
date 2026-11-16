const fs = require('fs');

const codePath = 'E:/Aryan/fun-strikes-waiver/google-apps-script/Code.gs';
let code = fs.readFileSync(codePath, 'utf8');

const dynamicScript = fs.readFileSync('E:/Aryan/fun-strikes-waiver/scripts/test-fully-dynamic.js', 'utf8');

const fnStartInRenderer = dynamicScript.indexOf('function buildDynamicWaiverHtml(r) {');
const fnEndInRenderer = dynamicScript.indexOf('// Test both Go-Kart');
let fnBody = dynamicScript.slice(fnStartInRenderer, fnEndInRenderer).trim();

// Rename function to buildPrintableHtml_ for Apps Script standard
fnBody = fnBody.replace('function buildDynamicWaiverHtml(r)', 'function buildPrintableHtml_(r)');
fnBody = fnBody.replace(/escapeHtml\(/g, 'escapeHtml_(');

const fnStartInCode = code.indexOf('function buildPrintableHtml_(r)');
if (fnStartInCode === -1) {
  console.error('Marker not found in Code.gs');
  process.exit(1);
}

const updatedCode = code.slice(0, fnStartInCode) + fnBody + '\n';
fs.writeFileSync(codePath, updatedCode, 'utf8');
console.log('Successfully updated Code.gs with fully dynamic flow + activity-specific terms (Go-Karting vs Trampoline)!');
