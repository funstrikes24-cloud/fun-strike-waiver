const fs = require('fs');
const { execFileSync } = require('child_process');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sigDataUri = fs.readFileSync('E:/Aryan/fun-strikes-waiver/printables/sample-sig.txt', 'utf8').trim();
const logoBase64 = fs.readFileSync('E:/Aryan/fun-strikes-waiver/assets/funstrike-logo.png').toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const sampleDataMulti = {
  submittedAt: "2026-11-16 17:15:30 IST",
  refCode: "FS-QM4B9Z",
  activity: "Go-Karting Track (18+ Adult Zone)",
  branch: "Gauravpath Road, Pal, Surat (Gujarat)",
  fullName: "Aarav Sharma",
  dob: "1996-04-12",
  ageRole: "30 Years (Adult) — Primary Signer",
  signedBy: "Aarav Sharma",
  mobileNumber: "+91 98765 43210",
  emailId: "aarav.sharma@example.com",
  address: "102, Shivalik Heights, Gauravpath Road, Pal, Surat, Gujarat - 395009",
  totalRiders: 4,
  allRiders: [
    "1. Aarav Sharma | 1996-04-12 | 30 yrs (Adult) | Primary Signer",
    "2. Rohan Sharma | 2012-08-15 | 14 yrs (MINOR) | Family / Child (Son)",
    "3. Priya Sharma | 2015-02-20 | 11 yrs (MINOR) | Family / Child (Daughter)",
    "4. Vivek Sharma | 1991-06-10 | 35 yrs (Adult) | Brother / Guest"
  ].join("\n"),
  heightStr: "66 in / 168 cm (Height Requirement 5'5\" Verified)",
  is18Ack: "YES",
  agreed: "YES",
  signDate: "16-11-2026",
  signTime: "05:15:30 PM",
  signatureUrl: sigDataUri
};

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildDocumentHtml(r) {
  const isGokart = /kart/i.test(r.activity || "") || /kart/i.test(r.branch || "");
  const activityTitle = isGokart ? "GO-KARTING TRACK" : "TRAMPOLINE & SOFT PLAY PARK";

  const riderLines = String(r.allRiders || r.fullName || "")
    .split(/\r?\n/)
    .filter(Boolean);

  const participantsTableRows = riderLines.map(function(line, idx) {
    const cleanLine = line.replace(/^\d+\.\s*/, "");
    const parts = cleanLine.split(" | ");
    const pName = parts[0] || cleanLine;
    const pDob = parts[1] || r.dob || "—";
    const pAge = parts[2] || r.ageRole || "—";
    const pRel = parts[3] || (idx === 0 ? "Primary Signer" : "Participant");

    const isMinor = /minor/i.test(pAge);
    const cleanAge = pAge.replace(/\s*\((minor|adult)\)/gi, "").trim();
    const ageBadge = isMinor
      ? `<span class="badge badge-minor">MINOR</span> ${escapeHtml(cleanAge)}`
      : `<span class="badge badge-adult">ADULT</span> ${escapeHtml(cleanAge)}`;

    const relBadge = (idx === 0)
      ? `<span class="badge badge-primary">PRIMARY SIGNER</span>`
      : escapeHtml(pRel);

    return `
      <tr>
        <td style="text-align: center; font-weight: bold; color: #475569; white-space: nowrap;">${idx + 1}</td>
        <td><strong>${escapeHtml(pName)}</strong></td>
        <td style="text-align: center; white-space: nowrap;">${escapeHtml(pDob)}</td>
        <td style="white-space: nowrap;">${ageBadge}</td>
        <td style="white-space: nowrap;">${relBadge}</td>
      </tr>
    `;
  }).join("");

  const gokartClauses = `
    <div class="clause-item clause-highlight">
      <span class="clause-num">1.</span> <span class="clause-title">Strict 18+ Adult Policy &amp; Sole Minor Liability Clause:</span>
      The Go-Karting Track is strictly designed, engineered, and operated exclusively for adult drivers aged 18 and older. If a minor under 18 years of age operates a kart or signs this instrument, the primary signer and parent/legal guardian explicitly warrant, covenant, and declare that <strong>ONE HUNDRED PERCENT (100%) OF ALL RISKS, PERSONAL INJURIES, VEHICLE LIABILITIES, AND DAMAGES REST SOLELY WITH THEM</strong>. Fun Strikes Entertainment LLP, its designated partners, and track marshals bear ZERO liability.
    </div>
    <div class="clause-item">
      <span class="clause-num">2.</span> <span class="clause-title">Track Rules, Safety Equipment &amp; Mandatory Height Verification:</span>
      Single-kart drivers must meet the strict minimum height requirement of 5'5" (165 cm). Full-face protective helmets must be securely buckled prior to entering the pit lane and accelerating. Closed-toe footwear is mandatory at all times (no crocs, sandals, or loose footwear). Loose clothing must be tucked in; long hair must be tied securely above shoulder level. <strong>ZERO-TOLERANCE BUMPING POLICY:</strong> Intentional ramming, bumping, or hazardous driving results in immediate disqualification and ejection from the circuit on first warning without refund.
    </div>
  `;

  const trampolineClauses = `
    <div class="clause-item clause-highlight">
      <span class="clause-num">1.</span> <span class="clause-title">Trampoline &amp; Soft Play Park Safety Protocol:</span>
      Approved anti-slip grip socks must be worn at all times by all active participants inside the park. Exactly one jumper per trampoline mat at all times; double-bouncing, wrestling, horseplay, and running across pads are strictly prohibited. Inverted somersaults, multi-rotational flips, and uncontrolled aerial maneuvers are barred. All pockets must be completely emptied (no mobile phones, keys, or sharp items).
    </div>
    <div class="clause-item">
      <span class="clause-num">2.</span> <span class="clause-title">Active Parental Supervision &amp; Foam Pit / Airbag Regulations:</span>
      Children under 10 years of age must be actively and continuously supervised by a parent or adult legal guardian (18+) at all times within the arena. Foam Pit / Airbag protocol: participants must land strictly feet-first or in a seated position; diving headfirst, landing on other jumpers, or performing uncontrolled flips into the pit is strictly prohibited. Exit the landing zone immediately after jumping.
    </div>
  `;

  const specificClauses = isGokart ? gokartClauses : trampolineClauses;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Fun Strike! Participant Waiver - ${escapeHtml(r.refCode)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 6mm 9mm 6mm 9mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 7.8pt;
      line-height: 1.25;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 6px 14px;
      font-family: Arial, sans-serif;
      font-size: 10px;
      margin-bottom: 8px;
    }
    .print-btn {
      background: #991b1b;
      color: #ffffff;
      border: none;
      padding: 5px 14px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      font-size: 11px;
    }
    .document-page {
      width: 100%;
      border: 1.5px solid #0f172a;
      padding: 7px 10px;
      background: #ffffff;
      margin-bottom: 0;
    }

    /* Formal Document Header with Logo */
    .doc-header-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px double #0f172a;
      padding-bottom: 4px;
      margin-bottom: 4px;
      gap: 12px;
    }
    .doc-logo-box {
      flex-shrink: 0;
      width: 48px;
      text-align: center;
    }
    .doc-logo-box img {
      width: 44px;
      height: 44px;
      object-fit: contain;
      display: block;
    }
    .doc-header-text {
      flex: 1;
      text-align: center;
    }
    .doc-header-text .org-name {
      font-size: 14pt;
      font-weight: bold;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #0f172a;
      line-height: 1.1;
    }
    .doc-header-text .org-sub {
      font-family: Arial, sans-serif;
      font-size: 7pt;
      color: #475569;
      letter-spacing: 0.3px;
      margin-top: 1px;
    }
    .doc-header-text .doc-title {
      font-size: 8.8pt;
      font-weight: bold;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 3px;
      color: #991b1b;
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 1.5px 6px;
      display: inline-block;
    }
    .doc-meta-bar {
      display: flex;
      justify-content: space-between;
      font-family: Arial, sans-serif;
      font-size: 7.2pt;
      font-weight: bold;
      color: #1e293b;
      margin-top: 3px;
      border-top: 1px solid #e2e8f0;
      padding-top: 2px;
    }

    /* Section Headers */
    .section-head {
      font-family: Arial, sans-serif;
      font-size: 7.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #ffffff;
      background: #0f172a;
      padding: 2.5px 8px;
      margin: 5px 0 3px 0;
      display: flex;
      justify-content: space-between;
      page-break-after: avoid;
    }

    /* Primary Signer Table */
    table.signer-table {
      width: 100%;
      border-collapse: collapse;
      font-family: Arial, sans-serif;
      font-size: 7.2pt;
      margin-bottom: 3px;
      page-break-inside: avoid;
    }
    table.signer-table td {
      border: 1px solid #94a3b8;
      padding: 2px 6px;
      vertical-align: middle;
    }
    table.signer-table td.lbl {
      background: #f1f5f9;
      font-weight: bold;
      color: #334155;
      width: 18%;
      text-transform: uppercase;
      font-size: 6.8pt;
    }
    table.signer-table td.val {
      color: #0f172a;
      width: 32%;
    }

    /* Participants Covered Table */
    table.participants-table {
      width: 100%;
      border-collapse: collapse;
      font-family: Arial, sans-serif;
      font-size: 7.2pt;
      margin-bottom: 4px;
      page-break-inside: avoid;
    }
    table.participants-table th, table.participants-table td {
      border: 1px solid #94a3b8;
      padding: 2.5px 6px;
      text-align: left;
      vertical-align: middle;
    }
    table.participants-table th {
      background: #e2e8f0;
      color: #0f172a;
      font-weight: bold;
      font-size: 6.9pt;
      text-transform: uppercase;
      white-space: nowrap;
    }
    table.participants-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    /* Badges */
    .badge {
      display: inline-block;
      font-size: 6.5pt;
      font-weight: bold;
      padding: 1px 4px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      vertical-align: middle;
      margin-right: 4px;
    }
    .badge-primary {
      background: #0f172a;
      color: #ffffff;
    }
    .badge-adult {
      background: #dbeafe;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }
    .badge-minor {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    /* Legal Clauses Section */
    .clauses-body {
      text-align: justify;
      font-size: 7.2pt;
      line-height: 1.25;
      color: #1e293b;
    }
    .clause-item {
      margin-bottom: 2px;
      text-indent: -14px;
      padding-left: 14px;
      page-break-inside: avoid;
    }
    .clause-num {
      font-weight: bold;
      font-family: Arial, sans-serif;
      color: #0f172a;
    }
    .clause-title {
      font-weight: bold;
      text-transform: uppercase;
      color: #0f172a;
      font-size: 7.2pt;
    }
    .clause-highlight {
      background: #fef2f2;
      border-left: 3px solid #dc2626;
      padding: 2px 6px;
      margin: 2px 0;
      text-indent: 0;
      page-break-inside: avoid;
    }

    /* Solemn Declaration */
    .decl-box {
      border: 1.2px solid #0f172a;
      background: #f8fafc;
      padding: 3px 6px;
      margin: 3px 0;
      font-size: 6.8pt;
      line-height: 1.22;
      text-align: justify;
      page-break-inside: avoid;
    }
    .decl-box strong {
      font-family: Arial, sans-serif;
      text-transform: uppercase;
      color: #0f172a;
      font-size: 6.6pt;
      letter-spacing: 0.3px;
    }

    /* Execution & Signature Section */
    .exec-wrap {
      page-break-inside: avoid;
      margin-top: 3px;
    }
    table.exec-table {
      width: 100%;
      border-collapse: collapse;
      font-family: Arial, sans-serif;
    }
    table.exec-table td {
      border: 1.2px solid #0f172a;
      padding: 3px 6px;
      vertical-align: top;
    }
    table.exec-table .sig-title {
      font-size: 6.8pt;
      font-weight: bold;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 2px;
    }
    table.exec-table .sig-img-wrap {
      height: 36px;
      display: flex;
      align-items: center;
    }
    table.exec-table .sig-img-wrap img {
      max-height: 34px;
      max-width: 200px;
      object-fit: contain;
    }
    table.exec-table .sig-signer-name {
      font-weight: bold;
      font-size: 8pt;
      color: #0f172a;
      border-top: 1px dashed #cbd5e1;
      padding-top: 2px;
      margin-top: 2px;
    }
    .exec-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px 8px;
      font-size: 7.2pt;
    }
    .exec-meta-row {
      display: flex;
      flex-direction: column;
    }
    .exec-meta-lbl {
      font-size: 6.2pt;
      font-weight: bold;
      color: #64748b;
      text-transform: uppercase;
    }
    .exec-meta-val {
      font-size: 7.4pt;
      font-weight: bold;
      color: #0f172a;
    }

    /* Document Legal Footer: 3-column, perfectly aligned, 1 single line */
    .doc-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 4px;
      margin-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 6.6pt;
      color: #64748b;
      text-transform: uppercase;
      page-break-inside: avoid;
      white-space: nowrap;
    }
    .doc-footer-left {
      font-weight: bold;
      color: #0f172a;
      text-align: left;
    }
    .doc-footer-center {
      text-align: center;
      color: #475569;
      font-weight: 600;
    }
    .doc-footer-right {
      text-align: right;
      color: #475569;
    }

    @media print {
      .print-bar {
        display: none !important;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .document-page {
        border: 1.5px solid #000;
        margin-bottom: 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span>OFFICIAL LEGAL RECORD: Ref ${escapeHtml(r.refCode)} &mdash; ${escapeHtml(r.fullName)} (${escapeHtml(r.totalRiders)} Participants)</span>
    <button class="print-btn" onclick="window.print()">Print Legal Document</button>
  </div>

  <div class="document-page">
    <div class="doc-header-wrap">
      <div class="doc-logo-box">
        <img src="${logoDataUri}" alt="Fun Strike Logo" />
      </div>
      <div class="doc-header-text">
        <div class="org-name">Fun Strikes Entertainment LLP</div>
        <div class="org-sub">Registered LLP under Indian Limited Liability Partnership Act, 2008 &bull; Surat, Gujarat, India</div>
        <div class="doc-title">Participant Liability Waiver, Indemnity Agreement &amp; Rules of Operation</div>
      </div>
    </div>

    <div class="doc-meta-bar">
      <span>ZONE: <strong>${activityTitle}</strong></span>
      <span>BRANCH: <strong>${escapeHtml(r.branch)}</strong></span>
      <span>TOTAL PARTICIPANTS: <strong>${escapeHtml(r.totalRiders)}</strong></span>
      <span>DOCUMENT REF: <strong>${escapeHtml(r.refCode)}</strong></span>
    </div>

    <div class="section-head">
      <span>Schedule I: Primary Signer &amp; Legal Guardian Identification</span>
      <span>Form FS-W9</span>
    </div>

    <table class="signer-table">
      <tr>
        <td class="lbl">Primary Signer:</td>
        <td class="val"><strong>${escapeHtml(r.fullName)}</strong></td>
        <td class="lbl">Verified Mobile:</td>
        <td class="val"><strong>${escapeHtml(r.mobileNumber)}</strong></td>
      </tr>
      <tr>
        <td class="lbl">Date of Birth &amp; Age:</td>
        <td class="val">${escapeHtml(r.dob)} (${escapeHtml(r.ageRole)})</td>
        <td class="lbl">Official Email:</td>
        <td class="val">${escapeHtml(r.emailId)}</td>
      </tr>
      <tr>
        <td class="lbl">Height Verification:</td>
        <td class="val"><strong>${escapeHtml(r.heightStr)}</strong></td>
        <td class="lbl">Signed By / Role:</td>
        <td class="val">${escapeHtml(r.signedBy)}</td>
      </tr>
      <tr>
        <td class="lbl">Residential Address:</td>
        <td class="val" colspan="3">${escapeHtml(r.address)}</td>
      </tr>
    </table>

    <div class="section-head">
      <span>Schedule II: Schedule of Covered Participants &amp; Dependents (${escapeHtml(r.totalRiders)})</span>
      <span>Individual Acknowledgement</span>
    </div>

    <table class="participants-table">
      <thead>
        <tr>
          <th style="width: 24px; text-align: center; white-space: nowrap;">#</th>
          <th>Full Legal Name of Participant</th>
          <th style="width: 90px; text-align: center; white-space: nowrap;">Date of Birth</th>
          <th style="width: 165px; white-space: nowrap;">Age &amp; Category</th>
          <th style="width: 185px; white-space: nowrap;">Relationship to Signer</th>
        </tr>
      </thead>
      <tbody>
        ${participantsTableRows}
      </tbody>
    </table>

    <div class="section-head">
      <span>Schedule III: Legally Binding Terms, Covenants &amp; Operational Regulations</span>
      <span>Enforceable Legal Contract</span>
    </div>

    <div class="clauses-body">
      ${specificClauses}
      <div class="clause-item">
        <span class="clause-num">3.</span> <span class="clause-title">Voluntary Assumption of Inherent Operational Risks:</span>
        The participant and their guardian knowingly, voluntarily, and freely assume all inherent risks associated with high-speed motorized karting, trampoline jumping, collisions, vehicle rollover, mechanical failures, falls, fractures, sprains, disability, spinal injury, or fatal injury. The participant hereby forever releases, discharges, defends, and indemnifies Fun Strikes Entertainment LLP, its affiliates, track marshals, safety stewards, employees, and agents from any and all legal suits, damages, or liabilities.
      </div>
      <div class="clause-item">
        <span class="clause-num">4.</span> <span class="clause-title">Customer Property Damage &amp; Equipment Breakage Liability:</span>
        Any physical damage, breakage, loss, or impairment caused to go-karts, engines, chassis, safety barriers, trampolines, foam pit, safety gear, or venue property resulting from reckless conduct, disobeying track marshals, or rule violations must be paid in full by the customer as assessed by management before departing the facility premises.
      </div>
      <div class="clause-item clause-highlight">
        <span class="clause-num">5.</span> <span class="clause-title">Strict 100% Non-Refundable &amp; Non-Transferable Payment Policy:</span>
        All ticket fees, admissions, and session charges are <strong>STRICTLY 100% NON-REFUNDABLE AND NON-TRANSFERABLE</strong> once paid. No refunds, credits, or chargebacks shall be granted if a participant voluntarily withdraws, claims they "did not have fun", is disqualified for safety violations, or in the event of equipment downtime.
      </div>
      <div class="clause-item">
        <span class="clause-num">6.</span> <span class="clause-title">Medical Fitness Warranty &amp; Health Restrictions:</span>
        The participant warrants that all covered participants are in sound physical and psychological health. Participation is strictly prohibited for individuals who are pregnant, suffer from hypertension, cardiovascular disorders, neck/back/spinal impairments, recent surgical operations, or who are impaired by alcohol, narcotics, or medications.
      </div>
      <div class="clause-item">
        <span class="clause-num">7.</span> <span class="clause-title">CCTV Surveillance, Security &amp; Media Release:</span>
        The facility operates under continuous 24/7 CCTV surveillance. The participant grants Fun Strikes Entertainment LLP irrevocable permission to record, store, and utilize photographs and video recordings for venue security, promotional broadcasts, and safety investigations without monetary claim.
      </div>
      <div class="clause-item">
        <span class="clause-num">8.</span> <span class="clause-title">Governing Jurisdiction &amp; Severability:</span>
        This agreement is governed by the laws of India. Any legal dispute or proceeding arising out of or related to this waiver shall be instituted exclusively in the competent courts having jurisdiction over Surat, Gujarat, India.
      </div>
    </div>

    <div class="decl-box">
      <strong>Solemn Affirmation &amp; Legal Declaration:</strong>
      I, the undersigned participant / authorized parent / legal guardian, do hereby declare under penalty of law that I have attained 18 years of age, all information furnished in Schedules I &amp; II is accurate, and I have carefully read, understood, and voluntarily executed each and every covenant, liability waiver, and safety rule set forth in this document on behalf of myself and all covered participants.
    </div>

    <div class="exec-wrap">
      <table class="exec-table">
        <tr>
          <td style="width: 50%;">
            <div class="sig-title">Signature of Participant / Legal Guardian</div>
            <div class="sig-img-wrap">
              <img src="${r.signatureUrl}" alt="Customer Signature" style="max-height:34px;max-width:200px;object-fit:contain;display:block;" />
            </div>
            <div class="sig-signer-name">${escapeHtml(r.fullName)} (Primary Signer &amp; Guardian)</div>
          </td>
          <td style="width: 50%;">
            <div class="sig-title">Digital Verification &amp; Audit Trail</div>
            <div class="exec-meta-grid">
              <div class="exec-meta-row">
                <span class="exec-meta-lbl">Date of Submission:</span>
                <span class="exec-meta-val">${escapeHtml(r.signDate)}</span>
              </div>
              <div class="exec-meta-row">
                <span class="exec-meta-lbl">Time of Submission:</span>
                <span class="exec-meta-val">${escapeHtml(r.signTime)}</span>
              </div>
              <div class="exec-meta-row">
                <span class="exec-meta-lbl">Terms &amp; 18+ Ack:</span>
                <span class="exec-meta-val" style="color:#059669;">CONFIRMED &amp; AGREED</span>
              </div>
              <div class="exec-meta-row">
                <span class="exec-meta-lbl">Security Audit Token:</span>
                <span class="exec-meta-val">${escapeHtml(r.refCode)}-SEC-OK</span>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <div class="doc-footer">
        <span class="doc-footer-left">Fun Strikes Entertainment LLP</span>
        <span class="doc-footer-center">Made with ❤️ by Aryan and NexoraOneSolution</span>
        <span class="doc-footer-right">Fun Strike! Game Zone &bull; Gauravpath Road, Pal &bull; Surat</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const html = buildDocumentHtml(sampleDataMulti);
const htmlPath = 'E:/Aryan/fun-strikes-waiver/printables/test-waiver.html';
const pdfPath = 'E:/Aryan/fun-strikes-waiver/printables/Fun-Strike-Signed-Waiver-Print-Demo.pdf';
const imgPath = 'E:/Aryan/fun-strikes-waiver/printables/signed-waiver-preview.png';

fs.writeFileSync(htmlPath, html, 'utf8');

execFileSync(CHROME_PATH, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  htmlPath
]);

execFileSync(CHROME_PATH, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=920,1320',
  `--screenshot=${imgPath}`,
  htmlPath
]);

const pdf = fs.readFileSync(pdfPath);
const matches = pdf.toString('latin1').match(/\/Type\s*\/Page\b/g);
console.log('✅ Final 1-Page PDF Generated successfully!');
console.log('Total PDF Page Count:', matches ? matches.length : 'unknown');
