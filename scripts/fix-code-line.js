const fs = require('fs');

const codePath = 'E:/Aryan/fun-strikes-waiver/google-apps-script/Code.gs';
let code = fs.readFileSync(codePath, 'utf8');

// Replace the buggy line
const badLinePattern = /'          <td class="value-cell"><strong>' \+ escapeHtml_\(r\.heightInches \?[\s\S]*?<\/strong><\/td>' \+/;
const goodLine = '\'          <td class="value-cell"><strong>\' + escapeHtml_(r.heightInches ? r.heightInches + " in (Verified >= 5ft 5in)" : "Verified On-Site") + \'</strong></td>\' +';

code = code.replace(badLinePattern, goodLine);
fs.writeFileSync(codePath, code, 'utf8');
console.log('Fixed line in Code.gs successfully!');
