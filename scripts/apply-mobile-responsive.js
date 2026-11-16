const fs = require('fs');

const mobileCssRules = `
/* =========================================================
   COMPREHENSIVE MOBILE & TABLET FULL-WIDTH RESPONSIVENESS
   ========================================================= */
@media screen and (max-width: 768px) {
  body {
    padding: 0 !important;
    background: #f1f5f9 !important;
  }

  .page-wrapper {
    padding: 8px 6px 20px !important;
    max-width: 100% !important;
  }

  .waiver-sheet {
    border-radius: 12px !important;
    padding: 0 12px 16px !important;
    margin: 0 !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06) !important;
  }

  /* COLLAPSE ALL 2-COLUMN & 3-COLUMN INPUT GRIDS TO 1 FULL-WIDTH COLUMN */
  .field-grid-2,
  .rider-fields-grid,
  .datetime-grid,
  .form-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    width: 100% !important;
  }

  .field-row {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  .field-row input[type="text"],
  .field-row input[type="email"],
  .field-row input[type="tel"],
  .field-row input[type="date"],
  .field-row select {
    width: 100% !important;
    min-height: 48px !important;
    font-size: 15px !important; /* Touch-friendly & prevents mobile Safari zoom */
    padding: 10px 12px !important;
    box-sizing: border-box !important;
  }

  /* HEADER & LOGO ON MOBILE */
  .sheet-header {
    flex-direction: column !important;
    text-align: center !important;
    gap: 10px !important;
    padding: 14px 0 10px !important;
  }

  .logo-box {
    margin: 0 auto !important;
    width: 70px !important;
    height: 70px !important;
  }

  .header-text h1 {
    font-size: 1.25rem !important;
    line-height: 1.2 !important;
  }

  .subtitle {
    font-size: 0.82rem !important;
  }

  /* HEADER BADGES (Branch, Activity, Phone) - CLEAN WRAP */
  .header-meta-badges,
  .header-badges {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    gap: 6px !important;
    margin-top: 6px !important;
  }

  .header-badge,
  .branch-pill,
  .activity-pill,
  .phone-pill {
    font-size: 0.72rem !important;
    padding: 5px 9px !important;
    white-space: normal !important;
    text-align: center !important;
  }

  /* SECTION HEADINGS */
  .section-heading-row {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 6px !important;
  }

  /* ADDITIONAL RIDER CARDS */
  .rider-card {
    padding: 12px 10px !important;
    border-radius: 10px !important;
  }

  .rider-card-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 6px !important;
  }

  /* SIGNATURE BLOCK */
  .signature-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 6px !important;
  }

  .btn-clear-sig {
    align-self: flex-start !important;
    padding: 6px 12px !important;
    font-size: 0.75rem !important;
  }

  .sig-pad-wrap {
    height: 130px !important;
    width: 100% !important;
  }

  .sig-canvas {
    width: 100% !important;
    height: 130px !important;
  }

  /* SUBMIT BAR */
  .customer-submit-bar {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
    text-align: center !important;
  }

  .customer-submit-bar .btn {
    width: 100% !important;
    min-height: 48px !important;
    font-size: 1rem !important;
    padding: 12px 18px !important;
  }

  /* INTEGRATED 3-PART FOOTER ON MOBILE */
  .sheet-footer {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 8px !important;
    padding-top: 14px !important;
    margin-top: 18px !important;
    border-top: 1.5px solid #e2e8f0 !important;
  }

  .sheet-footer-col {
    display: flex !important;
    justify-content: center !important;
    text-align: center !important;
    width: 100% !important;
  }

  .sheet-footer-left,
  .sheet-footer-center,
  .sheet-footer-right {
    white-space: normal !important;
    text-align: center !important;
    font-size: 0.74rem !important;
    line-height: 1.4 !important;
  }
}
`;

['E:/Aryan/fun-strikes-waiver/styles.css', 'E:/Aryan/fun-strikes-waiver/assets/css/styles.css'].forEach(p => {
  let css = fs.readFileSync(p, 'utf8');

  // Remove previous mobile overrides if any
  css = css.replace(/\/\* =========================================================\s*COMPREHENSIVE MOBILE[\s\S]*?@media screen and \(max-width: 768px\) \{[\s\S]*?\n\}/g, '');
  
  css += '\n' + mobileCssRules + '\n';
  fs.writeFileSync(p, css, 'utf8');
  console.log('Appended comprehensive mobile responsive rules to:', p);
});
