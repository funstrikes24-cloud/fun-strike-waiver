const fs = require('fs');

const codePath = 'E:/Aryan/fun-strikes-waiver/google-apps-script/Code.gs';
let code = fs.readFileSync(codePath, 'utf8');

const ultimateScript = fs.readFileSync('E:/Aryan/fun-strikes-waiver/scripts/test-ultimate-waiver.js', 'utf8');

const fnStartInRenderer = ultimateScript.indexOf('function buildUltimateWaiverHtml(r) {');
const fnEndInRenderer = ultimateScript.indexOf('// Test Suite:');
let fnBody = ultimateScript.slice(fnStartInRenderer, fnEndInRenderer).trim();

// Rename function to buildPrintableHtml_ for Apps Script standard
fnBody = fnBody.replace('function buildUltimateWaiverHtml(r)', 'function buildPrintableHtml_(r)');
fnBody = fnBody.replace(/escapeHtml\(/g, 'escapeHtml_(');

const fnStartInCode = code.indexOf('function buildPrintableHtml_(r)');
if (fnStartInCode === -1) {
  console.error('Marker not found in Code.gs');
  process.exit(1);
}

const updatedCode = code.slice(0, fnStartInCode) + fnBody + '\n';
fs.writeFileSync(codePath, updatedCode, 'utf8');
console.log('Successfully updated Code.gs with ultimate framed legal contract layout!');
