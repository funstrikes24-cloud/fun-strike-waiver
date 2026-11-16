const fs = require('fs');

const codePath = 'E:/Aryan/fun-strikes-waiver/google-apps-script/Code.gs';
let code = fs.readFileSync(codePath, 'utf8');

// Replace any unescaped single quotes inside strings
code = code.replace(/5'5"/g, '5 ft 5 in');
code = code.replace(/5'5\\"/g, '5 ft 5 in');

fs.writeFileSync(codePath, code, 'utf8');
console.log('Fixed single quotes in Code.gs');
