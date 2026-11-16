const fs = require('fs');

const cssRules = `
/* 3-PART INTEGRATED FOOTER: Left | Center | Right */
.sheet-footer {
  margin-top: 24px;
  padding-top: 14px;
  border-top: 1.5px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
  width: 100%;
}

.sheet-footer-col {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sheet-footer-left {
  flex: 0 0 auto;
  font-weight: 700;
  color: #0f172a;
  text-align: left;
  white-space: nowrap;
}

.sheet-footer-center {
  flex: 1 1 auto;
  justify-content: center;
  text-align: center;
  color: #475569;
  white-space: nowrap;
}

.sheet-footer-center a {
  color: #be123c;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2.5px;
  transition: color 0.15s ease-in-out;
}

.sheet-footer-center a:hover {
  color: #0f172a;
}

.sheet-footer-right {
  flex: 0 0 auto;
  justify-content: flex-end;
  text-align: right;
  color: #64748b;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .sheet-footer {
    flex-direction: column;
    text-align: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .sheet-footer-left,
  .sheet-footer-center,
  .sheet-footer-right {
    white-space: normal;
    justify-content: center;
    text-align: center;
  }
}
`;

['E:/Aryan/fun-strikes-waiver/styles.css', 'E:/Aryan/fun-strikes-waiver/assets/css/styles.css'].forEach(p => {
  let css = fs.readFileSync(p, 'utf8');

  // Remove old .sheet-footer and child rules
  css = css.replace(/\.sheet-footer\s*\{[\s\S]*?(?=\.customer-submit-bar|\.creator-credit-badge|\/\* Submission Screen|\n\s*#submissionScreen)/g, '');
  css = css.replace(/\.sheet-footer-row[\s\S]*?(?=\.customer-submit-bar|\/\* Submission Screen|\n\s*#submissionScreen)/g, '');
  css = css.replace(/\.sheet-footer-credit[\s\S]*?(?=\.customer-submit-bar|\/\* Submission Screen|\n\s*#submissionScreen)/g, '');
  css = css.replace(/\.sheet-footer-main[\s\S]*?(?=\.customer-submit-bar|\/\* Submission Screen|\n\s*#submissionScreen)/g, '');

  css += '\n' + cssRules + '\n';
  fs.writeFileSync(p, css, 'utf8');
  console.log('Updated CSS footer rules in:', p);
});
