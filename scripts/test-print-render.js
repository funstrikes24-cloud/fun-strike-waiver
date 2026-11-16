const fs = require('fs');
const { execFileSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sigDataUri = fs.readFileSync('E:/Aryan/fun-strikes-waiver/printables/sample-sig.txt', 'utf8').trim();

const sampleData = {
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
  totalRiders: 1,
  allRiders: "1. Aarav Sharma | 1996-04-12 | 30 yrs (Adult) | Primary Signer",
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

  const gokartClauses = `
    <div class="clause-item clause-highlight">
      <span class="clause-num">1.</span> <span class="clause-title">Strict 18+ Adult Policy &amp; Sole Minor Liability Clause:</span>
      The Go-Karting Track is strictly designed, engineered, and operated exclusively for adult drivers aged 18 and older. If a minor under 18 years of age operates a kart or signs this instrument, the participant and their parent or legal guardian explicitly warrant, covenant, and declare that <strong>ONE HUNDRED PERCENT (100%) OF ALL RISKS, PERSONAL INJURIES, VEHICLE LIABILITIES, AND DAMAGES REST SOLELY WITH THEM</strong>. Fun Strikes Entertainment LLP, its designated partners, and track marshals bear ZERO liability.
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
      margin: 8mm 10mm 8mm 10mm;
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
      font-size: 9.3pt;
      line-height: 1.38;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      width: 100%;
      height: 100%;
    }
    .print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 8px 16px;
      font-family: Arial, sans-serif;
      font-size: 11px;
      margin-bottom: 10px;
    }
    .print-btn {
      background: #991b1b;
      color: #ffffff;
      border: none;
      padding: 6px 16px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
    }
    .document-page {
      width: 100%;
      height: 279mm;
      max-height: 279mm;
      border: 2px solid #0f172a;
      padding: 16px 20px 14px 20px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .doc-header {
      text-align: center;
      border-bottom: 2px double #0f172a;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .doc-header .org-name {
      font-size: 17pt;
      font-weight: bold;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #0f172a;
      line-height: 1.1;
    }
    .doc-header .org-sub {
      font-family: Arial, sans-serif;
      font-size: 8pt;
      color: #475569;
      letter-spacing: 0.4px;
      margin-top: 2px;
    }
    .doc-header .doc-title {
      font-size: 10.5pt;
      font-weight: bold;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-top: 5px;
      color: #991b1b;
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 3px 0;
    }
    .doc-meta {
      display: flex;
      justify-content: space-between;
      font-family: Arial, sans-serif;
      font-size: 8pt;
      font-weight: bold;
      color: #334155;
      margin-top: 4px;
      padding: 0 4px;
    }

    /* Formal Identification Schedule Table */
    .schedule-title {
      font-family: Arial, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      border-bottom: 1.2px solid #0f172a;
      padding-bottom: 2px;
      margin: 6px 0 4px 0;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-family: Arial, sans-serif;
      font-size: 8.2pt;
      margin-bottom: 6px;
    }
    table.data-table td {
      border: 1px solid #94a3b8;
      padding: 3.5px 7px;
      vertical-align: middle;
    }
    table.data-table td.lbl {
      background: #f1f5f9;
      font-weight: bold;
      color: #334155;
      width: 20%;
      text-transform: uppercase;
      font-size: 7.5pt;
    }
    table.data-table td.val {
      color: #0f172a;
      width: 30%;
    }

    /* Formal Legal Clauses Section */
    .clauses-header {
      font-family: Arial, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #ffffff;
      background: #0f172a;
      padding: 3.5px 8px;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
    }
    .clauses-body {
      text-align: justify;
      font-size: 8.8pt;
      line-height: 1.38;
      color: #1e293b;
    }
    .clause-item {
      margin-bottom: 4.5px;
      text-indent: -18px;
      padding-left: 18px;
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
      font-size: 8.8pt;
    }
    .clause-highlight {
      background: #fef2f2;
      border-left: 3px solid #dc2626;
      padding: 3px 6px;
      margin: 4px 0;
      text-indent: 0;
    }

    /* Solemn Declaration */
    .decl-box {
      border: 1.5px solid #0f172a;
      background: #f8fafc;
      padding: 5px 8px;
      margin: 6px 0 5px 0;
      font-size: 8.5pt;
      line-height: 1.34;
      text-align: justify;
    }
    .decl-box strong {
      font-family: Arial, sans-serif;
      text-transform: uppercase;
      color: #0f172a;
      font-size: 8pt;
      letter-spacing: 0.4px;
    }

    /* Formal Execution & Signatures Block */
    .exec-table {
      width: 100%;
      border-collapse: collapse;
      font-family: Arial, sans-serif;
      margin-top: 4px;
    }
    .exec-table td {
      border: 1.5px solid #0f172a;
      padding: 5px 8px;
      vertical-align: top;
    }
    .exec-table .sig-title {
      font-size: 7.5pt;
      font-weight: bold;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .exec-table .sig-img-wrap {
      height: 50px;
      display: flex;
      align-items: center;
    }
    .exec-table .sig-img-wrap img {
      max-height: 48px;
      max-width: 220px;
      object-fit: contain;
    }
    .exec-table .sig-signer-name {
      font-weight: bold;
      font-size: 9pt;
      color: #0f172a;
      border-top: 1px dashed #cbd5e1;
      padding-top: 2px;
      margin-top: 2px;
    }
    .exec-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 10px;
      font-size: 8.2pt;
    }
    .exec-meta-row {
      display: flex;
      flex-direction: column;
    }
    .exec-meta-lbl {
      font-size: 7pt;
      font-weight: bold;
      color: #64748b;
      text-transform: uppercase;
    }
    .exec-meta-val {
      font-size: 8.5pt;
      font-weight: bold;
      color: #0f172a;
    }

    /* Document Legal Footer */
    .doc-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 3px;
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      font-family: Arial, sans-serif;
      font-size: 7pt;
      color: #64748b;
      text-transform: uppercase;
    }

    @media print {
      .print-bar { display: none !important; }
      body { margin: 0; padding: 0; }
      .document-page { border: 1.5px solid #000; height: 100%; min-height: 100vh; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span>OFFICIAL LEGAL RECORD: Ref ${escapeHtml(r.refCode)} &mdash; ${escapeHtml(r.fullName)}</span>
    <button class="print-btn" onclick="window.print()">Print Legal Document</button>
  </div>

  <div class="document-page">
    <div>
      <div class="doc-header">
        <div class="org-name">Fun Strikes Entertainment LLP</div>
        <div class="org-sub">Registered LLP under Indian Limited Liability Partnership Act, 2008 &bull; Surat, Gujarat, India</div>
        <div class="doc-title">Participant Liability Waiver, Indemnity Agreement &amp; Rules of Operation</div>
        <div class="doc-meta">
          <span>ACTIVITY: <strong>${activityTitle}</strong></span>
          <span>BRANCH: <strong>${escapeHtml(r.branch)}</strong></span>
          <span>DOCUMENT REF: <strong>${escapeHtml(r.refCode)}</strong></span>
        </div>
      </div>

      <div class="schedule-title">Schedule I: Participant &amp; Registration Identification</div>
      <table class="data-table">
        <tr>
          <td class="lbl">Primary Signer / Rider:</td>
          <td class="val"><strong>${escapeHtml(r.fullName)}</strong></td>
          <td class="lbl">Verified Contact No:</td>
          <td class="val"><strong>${escapeHtml(r.mobileNumber)}</strong></td>
        </tr>
        <tr>
          <td class="lbl">Date of Birth &amp; Age:</td>
          <td class="val">${escapeHtml(r.dob)} (${escapeHtml(r.ageRole)})</td>
          <td class="lbl">Official Email Address:</td>
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
        <tr>
          <td class="lbl">Participants Covered:</td>
          <td class="val" colspan="3"><strong>Total (${escapeHtml(r.totalRiders)}):</strong> ${escapeHtml(r.allRiders)}</td>
        </tr>
      </table>

      <div class="clauses-header">
        <span>Schedule II: Legally Binding Terms, Covenants &amp; Operational Regulations</span>
        <span>Enforceable Legal Contract</span>
      </div>

      <div class="clauses-body">
        ${specificClauses}

        <div class="clause-item">
          <span class="clause-num">3.</span> <span class="clause-title">Voluntary Assumption of Inherent Operational Risks:</span>
          The participant knowingly, voluntarily, and freely assumes all inherent risks associated with high-speed motorized karting, trampoline jumping, collisions, vehicle rollover, mechanical failures, falls, fractures, sprains, disability, spinal injury, or fatal injury. The participant hereby forever releases, discharges, defends, and indemnifies Fun Strikes Entertainment LLP, its affiliates, track marshals, safety stewards, employees, and agents from any and all legal suits, damages, or liabilities.
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
          The participant warrants that they are in sound physical and psychological health. Participation is strictly prohibited for individuals who are pregnant, suffer from hypertension, cardiovascular disorders, neck/back/spinal impairments, recent surgical operations, or who are impaired by alcohol, narcotics, or medications.
        </div>

        <div class="clause-item">
          <span class="clause-num">7.</span> <span class="clause-title">CCTV Surveillance, Security &amp; Media Release:</span>
          The facility operates under continuous 24/7 CCTV surveillance. The participant grants Fun Strikes Entertainment LLP irrevocable permission to record, store, and utilize photographs and video recordings for venue security, promotional broadcasts, and safety investigations without monetary claim.
        </div>

        <div class="clause-item">
          <span class="clause-num">8.</span> <span class="clause-title">Governing Law, Dispute Jurisdiction &amp; Severability:</span>
          This legal instrument is executed under and governed by the laws of the Republic of India. Any and all disputes arising from participation shall fall under the exclusive judicial jurisdiction of the competent courts in Surat, Gujarat. If any provision is deemed unenforceable, the validity of all remaining covenants shall remain unaffected.
        </div>
      </div>

      <div class="decl-box">
        <strong>Solemn Affirmation &amp; Legal Declaration:</strong> I, the undersigned participant / authorized parent / legal guardian, do hereby declare under penalty of law that I have attained 18 years of age, all information furnished in Schedule I is accurate, and I have carefully read, understood, and voluntarily executed each and every covenant, liability waiver, and safety rule set forth in this document.
      </div>
    </div>

    <div>
      <table class="exec-table">
        <tr>
          <td style="width: 50%;">
            <div class="sig-title">Signature of Participant / Legal Guardian</div>
            <div class="sig-img-wrap">
              <img src="${r.signatureUrl}" alt="Customer Signature" />
            </div>
            <div class="sig-signer-name">${escapeHtml(r.signedBy)} (Primary Signer)</div>
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
        <span>Fun Strikes Entertainment LLP &bull; Surat, Gujarat &bull; Official Digital Record: ${escapeHtml(r.refCode)}</span>
        <span>Legally Binding Electronic Record Under Information Technology Act, 2000 (Section 4 &amp; 10A) &bull; Page 1 of 1</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const html = buildDocumentHtml(sampleData);
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
  '--window-size=850,1202',
  `--screenshot=${imgPath}`,
  htmlPath
]);

console.log('PDF rendered to:', pdfPath);
console.log('PNG preview rendered to:', imgPath);
