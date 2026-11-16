const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// We have chrome-win/chrome.exe or system chrome
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// Generate a sample signature data URL (black signature strokes on white canvas)
// Let's create an offscreen canvas or realistic signature SVG data URI
const realisticSigBase64 = "iVBORw0KGgoAAAANSUhEUgAAAWgAAABQBAMAAAD1ZgXIAAAALVBMVEUAAAAMDAwfHx86Ojo/Pz9AQEBISEhMTExVVVVdXV1lZWVxcXF5eXl+fn6AgIC1/517AAAABXRSTlP///8A/v5/qAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA45JREFUaN7t2T+LGkEcwPFVLLeFw4WwO5hG3mEuk85m0Q2Y1e8gbCF4N8jNIXeT3K5iYxCE4D024A2s5S18A19hB3Z37o+7f5f9W931e5gZlhl+zLg0e/f27p89f3z9+vXr1/f/7h7gX/f/3R0eHzu4e+y5O+iOu5d3eLz7eXfs6+57N8R/3F35h3f/8r4ZgK9X77gG/3a/0h33L+/u/b2P13c49N043bvf77271/f1C3q5e6+v466fXl1ff71ePfeR1894d+e7e72/f/V69fq1h/e7H16vX394vXr95XX69f21/4aP/wK+1/305vX9119++vT186eP37397e5V13c/ff3w5vX1l9dfPn39fOf18/v7q65ffnr78c3rr19/fv3p9efXe++3f/1+7224fv7p9fPn91+e994e4/218fcf1+uPv3/3+vvH717v8L3h57cfXn/59Pbn9z+9/v7j3ft/u+vXb97ff/v59ev7j7+9f7/1+6vj72/e//b5/ceP7//648O3e69ff/7u4x+/ffzh/eeP715df/n9x6/3P3378fr17z99/fHt9ev7t3/euf/t/sO319fvP7x5+9vX/3j/t/f1q+vvP7z57fXb3/782+f3P3337f71x6tvrz89/PT7b59e377/7b5f/2f3x/dv377//t/7/efv3n3+8PDb68+v37774/cfvvr58/sfv/v5x7f7x/f//t3bt28/vr/r/sf75y8/vr2+vnv/4fX7t+/ee/z24/ef33388Z/vP/3w2+v1z999+/b69u23h3eff3z/8eb7/v9/f7h//9vD69uf37z97f7j348//fbdt/uPX//r09vrr798e/f68+8f3v7x6/u/P/z0/fXXb58+fHv38fOfb797ffvbt6+uv/z547f3n759vPv89fv714eHdw8fvn54//D6+v3Hz59/f3h9ff379+/ff319ff39+/efP3//+fP3nz9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7wH+A1WJ94o3O8UFAAAAAElFTkSuQmCC";

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
  signatureUrl: `data:image/png;base64,${realisticSigBase64}`
};

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHtml(r) {
  const isGokart = true;
  const sigImgHtml = `<img src="${r.signatureUrl}" alt="Customer Signature" style="max-height:54px;max-width:240px;object-fit:contain;display:block;margin-top:2px;" />`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Fun Strike! Signed Waiver - ${r.refCode}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 6mm 8mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: Arial, -apple-system, BlinkMacSystemFont, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 0;
      font-size: 9.5px;
      line-height: 1.25;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .sheet {
      border: 1.8px solid #0f172a;
      padding: 7mm 8mm 6mm;
      max-height: 284mm;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .hdr {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 4px;
      margin-bottom: 5px;
    }
    .hdr h1 {
      margin: 0;
      font-size: 17px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .hdr p {
      margin: 2px 0 0;
      font-weight: 700;
      color: #334155;
      font-size: 11px;
    }
    .row-meta {
      border-bottom: 1.5px solid #0f172a;
      padding: 3px 0;
      font-size: 10px;
      margin-bottom: 5px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5px 12px;
      margin-bottom: 5px;
    }
    .row {
      border-bottom: 1px solid #cbd5e1;
      padding: 2px 0;
      font-size: 9.5px;
      display: flex;
    }
    .lbl {
      font-weight: 800;
      font-size: 9px;
      color: #475569;
      text-transform: uppercase;
      width: 140px;
      flex-shrink: 0;
    }
    .val {
      font-weight: 700;
      color: #0f172a;
    }
    .box {
      border: 1px solid #94a3b8;
      padding: 4px 6px;
      margin: 4px 0;
      border-radius: 4px;
      background: #f8fafc;
    }
    table.rtable {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2px;
      font-size: 9px;
    }
    table.rtable th, table.rtable td {
      border: 1px solid #cbd5e1;
      padding: 2px 5px;
      text-align: left;
    }
    table.rtable th {
      background: #e2e8f0;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 8.5px;
    }
    .tc-container {
      margin: 4px 0;
      border: 1.5px solid #0f172a;
      border-radius: 4px;
      padding: 5px 7px;
      background: #ffffff;
    }
    .tc-title {
      font-size: 9.5px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #0f172a;
      border-bottom: 1.2px solid #0f172a;
      padding-bottom: 2px;
      margin-bottom: 3.5px;
      display: flex;
      justify-content: space-between;
    }
    .tc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3.5px 8px;
      font-size: 7.6pt;
      line-height: 1.22;
      color: #1e293b;
    }
    .tc-col {
      display: flex;
      flex-direction: column;
      gap: 3.5px;
    }
    .tc-block {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      padding: 3px 5px;
    }
    .tc-block.highlight {
      border-color: #dc2626;
      background: #fef2f2;
    }
    .tc-block strong {
      display: block;
      font-size: 7.9pt;
      color: #0f172a;
      margin-bottom: 1px;
      text-transform: uppercase;
      letter-spacing: 0.2px;
    }
    .tc-block.highlight strong {
      color: #991b1b;
    }
    .sig-decl {
      font-size: 7.6pt;
      color: #1e293b;
      line-height: 1.22;
      margin: 4px 0 2px;
      padding: 3px 5px;
      background: #f1f5f9;
      border-left: 3px solid #0f172a;
      font-weight: 600;
    }
    .sig-wrap {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 8px;
      margin-top: 5px;
      border-top: 1.5px solid #0f172a;
      padding-top: 5px;
      align-items: end;
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div>
      <div class="hdr">
        <h1>Fun Strikes Entertainment LLP</h1>
        <p>Fun Strike! Game Zone &mdash; Participant Waiver, Safety Agreement &amp; Terms (${r.refCode})</p>
      </div>

      <div class="row-meta">
        <span class="lbl" style="width:auto;">ACTIVITY / ZONE:</span> <strong>${escapeHtml(r.activity)}</strong> &bull; 
        <span class="lbl" style="width:auto;">BRANCH:</span> <strong>${escapeHtml(r.branch)}</strong>
      </div>

      <div class="grid">
        <div class="row"><span class="lbl">PARTICIPANT NAME:</span> <span class="val">${escapeHtml(r.fullName)}</span></div>
        <div class="row"><span class="lbl">SIGNED BY:</span> <span class="val">${escapeHtml(r.signedBy)}</span></div>
        <div class="row"><span class="lbl">DOB:</span> <span class="val">${escapeHtml(r.dob)}</span></div>
        <div class="row"><span class="lbl">MOBILE:</span> <span class="val">${escapeHtml(r.mobileNumber)}</span></div>
        <div class="row"><span class="lbl">MIN HEIGHT:</span> <span class="val">${escapeHtml(r.heightStr)}</span></div>
        <div class="row"><span class="lbl">EMAIL:</span> <span class="val">${escapeHtml(r.emailId)}</span></div>
        <div class="row"><span class="lbl">AGE / ROLE:</span> <span class="val">${escapeHtml(r.ageRole)}</span></div>
        <div class="row"><span class="lbl">ADDRESS:</span> <span class="val">${escapeHtml(r.address)}</span></div>
      </div>

      <div class="box">
        <strong style="font-size:8.5px;text-transform:uppercase;">PARTICIPANTS COVERED (${r.totalRiders}):</strong>
        <table class="rtable">
          <thead><tr><th style="width:30px;">#</th><th>Full Name</th><th style="width:90px;">DOB</th><th style="width:90px;">Age</th><th style="width:120px;">Relation</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><strong>${escapeHtml(r.fullName)}</strong></td><td>${escapeHtml(r.dob)}</td><td>30 yrs (Adult)</td><td>Primary Signer</td></tr>
          </tbody>
        </table>
      </div>

      <!-- COMPLETE LEGAL TERMS & CONDITIONS SECTION -->
      <div class="tc-container">
        <div class="tc-title">
          <span>TERMS &amp; CONDITIONS, SAFETY RULES &amp; LIABILITY RELEASE</span>
          <span>LEGAL BINDING AGREEMENT</span>
        </div>
        <div class="tc-grid">
          <div class="tc-col">
            <div class="tc-block highlight">
              <strong>⚠️ STRICT 18+ POLICY &amp; MINOR SOLE RESPONSIBILITY CLAUSE:</strong>
              Go-Karting is designed and operated for adults (18+). If an individual under 18 years of age signs this waiver or operates a kart, the participant and their parent/legal guardian explicitly acknowledge and declare that <strong>100% OF ALL RESPONSIBILITY, ACCIDENTAL RISKS, PERSONAL INJURIES, VEHICLE DAMAGES, AND LEGAL LIABILITIES REST ENTIRELY WITH THEM</strong>. Fun Strikes Entertainment LLP bears ZERO liability.
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

      <div class="row" style="border:none;padding:2px 0;">
        <span class="lbl" style="width:auto;">TERMS &amp; CONDITIONS AGREED:</span> <strong>${escapeHtml(r.agreed)}</strong>
        &bull; <span class="lbl" style="width:auto;">18+ SOLE LIABILITY ACKNOWLEDGED:</span> <strong>YES</strong>
      </div>
    </div>

    <div class="sig-wrap">
      <div>
        <div class="lbl">CUSTOMER / GUARDIAN SIGNATURE:</div>
        ${sigImgHtml}
      </div>
      <div>
        <div class="lbl">SUBMISSION DATE:</div>
        <div style="font-size:11.5px;font-weight:700;">${escapeHtml(r.signDate)}</div>
      </div>
      <div>
        <div class="lbl">SUBMISSION TIME:</div>
        <div style="font-size:11.5px;font-weight:700;">${escapeHtml(r.signTime)}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const html = buildHtml(sampleData);
const htmlPath = path.join(__dirname, '..', 'printables', 'test-waiver.html');
const pdfPath = path.join(__dirname, '..', 'printables', 'Fun-Strike-Signed-Waiver-Print-Demo.pdf');

fs.writeFileSync(htmlPath, html, 'utf8');

execFileSync(CHROME_PATH, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  htmlPath
]);

console.log('PDF rendered successfully to:', pdfPath);
