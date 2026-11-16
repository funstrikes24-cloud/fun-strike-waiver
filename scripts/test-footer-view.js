const http = require('http');
const { exec } = require('child_process');

// We can just verify via an HTML element test or Chrome CLI
// Let's create a test harness that displays only the bottom 600px of the form
const fs = require('fs');
let html = fs.readFileSync('E:/Aryan/fun-strikes-waiver/pal-gokart/index.html', 'utf8');

// create a preview page focusing on the agreement section + footer
const match = html.match(/<section class="form-section agreement-section"[\s\S]*?<\/form>/);
if (match) {
  const headMatch = html.match(/<head>[\s\S]*?<\/head>/);
  const snippet = `<!DOCTYPE html><html>${headMatch[0]}<body style="background:#f1f5f9; padding: 20px;"><div class="container" style="max-width: 820px; margin: 0 auto; background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">${match[0]}</div></body></html>`;
  fs.writeFileSync('E:/Aryan/fun-strikes-waiver/printables/test-footer-snippet.html', snippet, 'utf8');
  console.log('Snippet created successfully');
}
