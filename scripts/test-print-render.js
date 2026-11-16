const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sigDataUri = fs.readFileSync('E:/Aryan/fun-strikes-waiver/printables/sample-sig.txt', 'utf8').trim();

const sampleData = {
  submittedAt: "2026-11-16T17:15:30.000Z",
  refCode: "FS-QM4B9Z",
  activity: "Go-Karting (18+)",
  branch: "Gauravpath Road, Pal (Surat)",
  fullName: "Aarav Sharma",
  dob: "1996-04-12",
  ageRole: "30 yrs (Adult) — Primary Signer",
  signedBy: "Aarav Sharma",
  mobileNumber: "9876543210",
  emailId: "aarav.sharma@example.com",
  address: "102, Shivalik Heights, Pal, Surat",
  totalRiders: 1,
  allRiders: "1. Aarav Sharma | 1996-04-12 | 30 yrs (Adult) | Primary Signer",
  heightStr: "66 in / 168 cm (Min 5'5\" Verified)",
  is18Ack: "YES",
  agreed: "YES",
  signDate: "2026-11-16",
  signTime: "05:15:30 PM",
  signatureUrl: sigDataUri
};

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildHtml(r) {
  const isGokart = true;
  const brandColor = isGokart ? "#be123c" : "#0284c7";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Fun Strike! Participant Waiver - ${r.refCode}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 9mm 7mm 9mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 9.8px;
      line-height: 1.32;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .page-container {
      width: 100%;
      height: 281mm;
      max-height: 281mm;
      box-sizing: border-box;
      border: 2px solid #0f172a;
      padding: 6mm 7mm 5mm 7mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
    }
    .hdr {
      text-align: center;
      border-bottom: 2.5px solid ${brandColor};
      padding-bottom: 5px;
      margin-bottom: 6px;
    }
    .hdr h1 {
      font-size: 19px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      line-height: 1.1;
    }
    .hdr .subhead {
      font-size: 11.5px;
      font-weight: 800;
      color: ${brandColor};
      text-transform: uppercase;
      margin-top: 3px;
      letter-spacing: 0.5px;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 3px 8px;
      border-radius: 4px;
      margin: 5px 0 6px 0;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.4px;
    }
    .meta-bar .ref-pill {
      background: ${brandColor};
      padding: 2px 8px;
      border-radius: 3px;
      text-transform: uppercase;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 14px;
      margin-bottom: 6px;
    }
    .row {
      display: flex;
      border-bottom: 1px solid #cbd5e1;
      padding: 2.5px 0;
      font-size: 9.6px;
      align-items: baseline;
    }
    .lbl {
      font-weight: 800;
      font-size: 8.8px;
      color: #475569;
      text-transform: uppercase;
      width: 135px;
      flex-shrink: 0;
    }
    .val {
      font-weight: 700;
      color: #0f172a;
      word-break: break-word;
    }
    .val-highlight {
      color: ${brandColor};
      font-weight: 800;
    }
    .parts-box {
      border: 1.2px solid #94a3b8;
      border-radius: 4px;
      padding: 4px 6px;
      margin-bottom: 6px;
      background: #f8fafc;
    }
    .parts-title {
      font-size: 9.2px;
      font-weight: 900;
      text-transform: uppercase;
      color: #334155;
      margin-bottom: 3px;
      letter-spacing: 0.3px;
    }
    table.rtable {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.2px;
    }
    table.rtable th, table.rtable td {
      border: 1px solid #cbd5e1;
      padding: 3px 6px;
      text-align: left;
    }
    table.rtable th {
      background: #e2e8f0;
      font-weight: 800;
      color: #1e293b;
      text-transform: uppercase;
      font-size: 8.5px;
    }
    .tc-container {
      border: 1.5px solid #0f172a;
      border-radius: 4px;
      padding: 6px 8px;
      margin-bottom: 6px;
      background: #ffffff;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .tc-title {
      font-size: 10.2px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #ffffff;
      background: ${brandColor};
      padding: 3px 6px;
      border-radius: 3px;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
    }
    .tc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 12px;
      font-size: 8.2pt;
      line-height: 1.32;
      color: #1e293b;
    }
    .tc-col {
      display: flex;
      flex-direction: column;
      gap: 5px;
      justify-content: space-between;
    }
    .tc-block {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 4px 6px;
      text-align: justify;
    }
    .tc-block.highlight {
      border: 1.5px solid #dc2626;
      background: #fef2f2;
    }
    .tc-block strong {
      display: block;
      font-size: 8.6pt;
      color: #0f172a;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .tc-block.highlight strong {
      color: #991b1b;
    }
    .sig-decl {
      font-size: 8.2pt;
      color: #0f172a;
      line-height: 1.34;
      padding: 5px 8px;
      background: #f1f5f9;
      border-left: 3.5px solid #0f172a;
      font-weight: 600;
      margin-top: 5px;
      text-align: justify;
    }
    .tc-agreed-bar {
      display: flex;
      justify-content: space-between;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      padding: 3px 8px;
      border-radius: 3px;
      margin-top: 4px;
      font-size: 9.5px;
      font-weight: 800;
    }
    .sig-wrap {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 12px;
      margin-top: 7px;
      border-top: 2px solid #0f172a;
      padding-top: 6px;
      align-items: center;
      background: #ffffff;
    }
    .sig-col {
      display: flex;
      flex-direction: column;
    }
    .sig-box {
      min-height: 58px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 2px;
    }
    .sig-box img {
      max-height: 54px;
      max-width: 230px;
      object-fit: contain;
      display: block;
    }
    .sig-badge {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 6px 8px;
      text-align: center;
    }
    .sig-badge .badge-val {
      font-size: 12px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 2px;
    }
    .footer {
      font-size: 8px;
      color: #64748b;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 3px;
      margin-top: 4px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div>
      <div class="hdr">
        <h1>Fun Strikes Entertainment LLP</h1>
        <div class="subhead">Official Participant Waiver, Safety Agreement &amp; Terms</div>
      </div>

      <div class="meta-bar">
        <span>ACTIVITY: ${escapeHtml(r.activity)} &bull; LOCATION: ${escapeHtml(r.branch)}</span>
        <span class="ref-pill">REF: ${escapeHtml(r.refCode)}</span>
      </div>

      <div class="grid">
        <div class="row"><span class="lbl">PARTICIPANT NAME:</span> <span class="val">${escapeHtml(r.fullName)}</span></div>
        <div class="row"><span class="lbl">SIGNED BY:</span> <span class="val">${escapeHtml(r.signedBy)}</span></div>
        <div class="row"><span class="lbl">DOB:</span> <span class="val">${escapeHtml(r.dob)}</span></div>
        <div class="row"><span class="lbl">MOBILE NUMBER:</span> <span class="val">${escapeHtml(r.mobileNumber)}</span></div>
        <div class="row"><span class="lbl">MIN HEIGHT:</span> <span class="val val-highlight">${escapeHtml(r.heightStr)}</span></div>
        <div class="row"><span class="lbl">EMAIL ADDRESS:</span> <span class="val">${escapeHtml(r.emailId)}</span></div>
        <div class="row"><span class="lbl">AGE / ROLE:</span> <span class="val">${escapeHtml(r.ageRole)}</span></div>
        <div class="row"><span class="lbl">RESIDENTIAL ADDRESS:</span> <span class="val">${escapeHtml(r.address)}</span></div>
      </div>

      <div class="parts-box">
        <div class="parts-title">Participants Covered (${r.totalRiders}):</div>
        <table class="rtable">
          <thead><tr><th style="width:30px;">#</th><th>Full Name</th><th style="width:95px;">DOB</th><th style="width:100px;">Age</th><th style="width:130px;">Relationship</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><strong>${escapeHtml(r.fullName)}</strong></td><td>${escapeHtml(r.dob)}</td><td>30 yrs (Adult)</td><td>Primary Signer</td></tr>
          </tbody>
        </table>
      </div>

      <!-- COMPLETE LEGAL TERMS & CONDITIONS SECTION -->
      <div class="tc-container">
        <div class="tc-title">
          <span>TERMS &amp; CONDITIONS, SAFETY RULES &amp; LIABILITY RELEASE</span>
          <span>LEGALLY BINDING AGREEMENT</span>
        </div>
        <div class="tc-grid">
          <div class="tc-col">
            <div class="tc-block highlight">
              <strong>⚠️ STRICT 18+ POLICY &amp; MINOR SOLE RESPONSIBILITY CLAUSE:</strong>
              Go-Karting is designed and operated strictly for adults (18+). If an individual under 18 years of age signs this waiver or operates a kart, the participant and their parent/legal guardian explicitly acknowledge and declare that <strong>100% OF ALL RESPONSIBILITY, ACCIDENTAL RISKS, PERSONAL INJURIES, VEHICLE DAMAGES, AND LEGAL LIABILITIES REST ENTIRELY WITH THEM</strong>. Fun Strikes Entertainment LLP bears ZERO liability.
            </div>
            <div class="tc-block highlight">
              <strong>🏁 GO-KARTING RULES &amp; HEIGHT REQUIREMENT:</strong>
              Single-kart drivers must be at least 5'5" (165 cm) tall. Double karts: passenger min 40" (102 cm) with adult 18+ driver. Full-face helmets must be secured before throttle. Closed-toe shoes mandatory (no crocs, slippers, or bare feet). Tie long hair above shoulder level; tuck in loose clothes. <strong>ZERO BUMPING:</strong> Intentional ramming results in immediate disqualification on 1st warning without refund.
            </div>
            <div class="tc-block">
              <strong>⚖️ ASSUMPTION OF INHERENT RISK &amp; RELEASE OF LIABILITY:</strong>
              I knowingly, freely, and voluntarily assume all inherent risks of participation (including collisions, sudden impact, physical exertion, falls, fractures, sprains, illness, permanent disability, or property loss). On behalf of myself and all listed participants, I hereby forever release, discharge, defend, and hold harmless Fun Strikes Entertainment LLP, its partners, owners, operators, directors, track marshals, safety crew, and agents from any and all claims, demands, liabilities, actions, or lawsuits.
            </div>
            <div class="tc-block">
              <strong>🩺 MEDICAL FITNESS &amp; PHYSICAL CONDITION:</strong>
              I certify that all listed participants are in good physical health and have no medical impairments that would make participation unsafe. Participation is strictly prohibited for individuals who are pregnant, have heart conditions, neck, back, or spinal ailments, recent surgeries, or who are under the influence of alcohol, drugs, or prescription narcotics.
            </div>
          </div>
          <div class="tc-col">
            <div class="tc-block highlight">
              <strong>🔧 CUSTOMER DAMAGE &amp; BREAKAGE LIABILITY:</strong>
              Any damage, breakage, or loss caused by the customer or any participant under this form to go-karts, helmets, track barriers, trampolines, foam pit, soft-play structures, or venue property due to reckless behavior, rule violations, negligence, or misuse must be paid in full by the customer as assessed by management before leaving the venue.
            </div>
            <div class="tc-block highlight">
              <strong>🚫 STRICT 100% NO-REFUND POLICY:</strong>
              All ticket sales, sessions, and payments are 100% NON-REFUNDABLE, NON-CANCELLABLE, AND NON-TRANSFERABLE once paid, including if a customer changes their mind, feels scared, dislikes the experience, claims they "did not have fun", is removed for breaking safety rules, or in the event of equipment downtime (rescheduled time or replacement equipment may be offered at management discretion; no monetary refund).
            </div>
            <div class="tc-block">
              <strong>📸 MEDIA RELEASE &amp; CCTV SURVEILLANCE:</strong>
              Fun Strikes Entertainment LLP reserves the right to capture and use CCTV security footage, photographs, and video recordings of participants for safety, security, and promotional media without financial compensation.
            </div>
            <div class="tc-block">
              <strong>🏛️ GOVERNING LAW &amp; LEGAL JURISDICTION:</strong>
              This agreement is governed by the laws of India. All legal claims, disputes, or proceedings arising out of this agreement shall be subject exclusively to the jurisdiction of the competent courts in Surat, Gujarat.
            </div>
          </div>
        </div>
      </div>

      <div class="sig-decl">
        <strong>LEGAL ACKNOWLEDGEMENT &amp; DECLARATION:</strong> By signing below, I certify under penalty of law that I am at least 18 years of age (or the authorized parent/legal guardian of all minor participants listed), all information provided on this form is accurate, and I have read, understood, and agreed to every safety rule, liability waiver, damage policy, and term stated above on behalf of myself and all covered participants.
      </div>

      <div class="tc-agreed-bar">
        <span>TERMS &amp; CONDITIONS AGREED: <strong style="color:#059669;">YES</strong></span>
        <span>18+ SOLE LIABILITY ACKNOWLEDGED: <strong style="color:#059669;">YES</strong></span>
        <span>MIN HEIGHT VERIFIED: <strong style="color:#059669;">YES (5'5" / 165 CM)</strong></span>
      </div>
    </div>

    <div>
      <div class="sig-wrap">
        <div class="sig-col">
          <div class="lbl">CUSTOMER / GUARDIAN SIGNATURE:</div>
          <div class="sig-box">
            <img src="${r.signatureUrl}" alt="Customer Signature" />
          </div>
        </div>
        <div class="sig-col">
          <div class="lbl">SUBMISSION DATE:</div>
          <div class="sig-badge">
            <div class="badge-val">${escapeHtml(r.signDate)}</div>
          </div>
        </div>
        <div class="sig-col">
          <div class="lbl">SUBMISSION TIME:</div>
          <div class="sig-badge">
            <div class="badge-val">${escapeHtml(r.signTime)}</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <span>Fun Strikes Entertainment LLP &bull; Surat, Gujarat &bull; Official Digital Record: ${escapeHtml(r.refCode)}</span>
        <span>Recorded: ${escapeHtml(r.submittedAt)} &bull; Legally Enforceable Under Information Technology Act, 2000</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const html = buildHtml(sampleData);
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
  '--window-size=1200,1650',
  `--screenshot=${imgPath}`,
  htmlPath
]);

console.log('PDF rendered to:', pdfPath);
console.log('PNG preview rendered to:', imgPath);
