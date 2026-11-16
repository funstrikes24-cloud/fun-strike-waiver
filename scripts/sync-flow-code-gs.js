const fs = require('fs');

const codePath = 'E:/Aryan/fun-strikes-waiver/google-apps-script/Code.gs';
let code = fs.readFileSync(codePath, 'utf8');

const flowScript = fs.readFileSync('E:/Aryan/fun-strikes-waiver/scripts/test-natural-flow.js', 'utf8');

const fnStartInRenderer = flowScript.indexOf('function buildContinuousDynamicHtml(r) {');
const fnEndInRenderer = flowScript.indexOf('// Test Suite:');
let fnBody = flowScript.slice(fnStartInRenderer, fnEndInRenderer).trim();

// Rename to buildPrintableHtml_
fnBody = fnBody.replace('function buildContinuousDynamicHtml(r)', 'function buildPrintableHtml_(r)');
fnBody = fnBody.replace(/escapeHtml\(/g, 'escapeHtml_(');

const fnStartInCode = code.indexOf('function buildPrintableHtml_(r)');
if (fnStartInCode === -1) {
  console.error('Marker not found in Code.gs');
  process.exit(1);
}

const updatedCode = code.slice(0, fnStartInCode) + fnBody + '\n';
fs.writeFileSync(codePath, updatedCode, 'utf8');
console.log('Successfully updated Code.gs with continuous dynamic flow layout!');
