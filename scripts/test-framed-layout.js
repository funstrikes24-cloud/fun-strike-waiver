const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logoBase64 = fs.readFileSync('E:/Aryan/fun-strikes-waiver/assets/funstrike-logo.png').toString('base64');
const sampleSig = fs.readFileSync('E:/Aryan/fun-strikes-waiver/printables/sample-sig.txt', 'utf8').trim();

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildFramedLegalWaiverHtml(r) {
  const isGokart = /kart/i.test(r.activity || "") || /kart/i.test(r.branch || "");
  const activityTitle = isGokart ? "GO-KARTING TRACK (18+)" : "TRAMPOLINE ARENA & SOFT PLAY PARK";
  const activitySub = isGokart ? "Go-Karting Speedway Operational Directives & Safety Protocol" : "Trampoline Bounce Rules, Grip Socks Policy & Play Regulations";

  const riderLines = String(r.allRiders || r.fullName || "")
    .split(/\r?\n/)
    .filter(Boolean);

  const totalCount = riderLines.length;

  // Schedule II Table: Full-width, single line per name, NO wrapping to 2 lines!
  const rows = riderLines.map(function(line, idx) {
    const cleanLine = line.replace(/^\d+\.\s*/, "");
    const parts = cleanLine.split(" | ");
    const pName = parts[0] || cleanLine;
    const pDob = parts[1] || r.dob || "—";
    const pAge = parts[2] || r.ageRole || "—";
    const pRel = parts[3] || (idx === 0 ? "Primary Signer" : "Participant");

    const isMinor = /minor/i.test(pAge);
    const cleanAge = pAge.replace(/\s*\((minor|adult)\)/gi, "").trim();
    const ageBadge = isMinor
      ? '<span class="badge badge-minor">MINOR</span> ' + escapeHtml(cleanAge)
      : '<span class="badge badge-adult">ADULT</span> ' + escapeHtml(cleanAge);

    const relBadge = (idx === 0)
      ? '<span class="badge badge-primary">PRIMARY SIGNER</span>'
      : escapeHtml(pRel);

    return `<tr>
      <td style="text-align: center; font-weight: bold; color: #475569; width: 24px; white-space: nowrap;">${idx + 1}</td>
      <td style="white-space: nowrap; font-weight: bold; color: #0f172a; padding: 4px 8px;">${escapeHtml(pName)}</td>
      <td style="text-align: center; white-space: nowrap; padding: 4px 6px;">${escapeHtml(pDob)}</td>
      <td style="text-align: center; white-space: nowrap; padding: 4px 6px;">${ageBadge}</td>
      <td style="white-space: nowrap; padding: 4px 8px;">${relBadge}</td>
    </tr>`;
  }).join('');

  const schedule2Html = `
    <table class="data-table participants-table">
      <thead>
        <tr>
          <th style="width: 24px; text-align: center;">#</th>
          <th>Full Legal Name of Participant</th>
          <th style="width: 80px; text-align: center;">Date of Birth</th>
          <th style="width: 95px; text-align: center;">Age &amp; Category</th>
          <th style="width: 110px;">Relationship</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  // Activity-Specific Clauses
  let clausesHtml = '';
  let checklistHtml = '';
  let marshalCheckHtml = '';

  if (isGokart) {
    clausesHtml = `
      <div class="clause-item highlight-clause">
        <strong>1. STRICT 18+ ADULT POLICY &amp; SOLE MINOR LIABILITY CLAUSE:</strong> The Go-Karting Track is strictly designed, engineered, and operated exclusively for adult drivers aged 18 and older. If a minor under 18 years of age operates a kart or signs this instrument, the primary signer and parent/legal guardian explicitly warrant, covenant, and declare that <strong>ONE HUNDRED PERCENT (100%) OF ALL RISKS, PERSONAL INJURIES, VEHICLE LIABILITIES, AND DAMAGES REST SOLELY WITH THEM</strong>. Fun Strikes Entertainment LLP, its designated partners, and track marshals bear ZERO liability under any circumstances.
      </div>
      <div class="clause-item">
        <strong>2. TRACK RULES, SAFETY EQUIPMENT &amp; MANDATORY HEIGHT VERIFICATION:</strong> Single-kart drivers must meet the strict minimum height requirement of <strong>5 ft 5 in (165 cm)</strong>. Full-face protective helmets must be securely buckled prior to entering the pit lane and accelerating. Closed-toe footwear is mandatory at all times (no crocs, sandals, high heels, or loose footwear). Loose clothing, scarves, dupattas must be tucked in securely; long hair must be tied securely above shoulder level. <strong>ZERO-TOLERANCE BUMPING POLICY:</strong> Intentional ramming, bumping, or hazardous driving results in immediate disqualification and ejection from the circuit on first warning without refund.
      </div>
      <div class="clause-item">
        <strong>3. VOLUNTARY ASSUMPTION OF INHERENT MOTORSPORTS RISKS:</strong> The participant and their guardian knowingly, voluntarily, and freely assume all inherent risks associated with high-speed motorized karting, collisions, vehicle rollover, mechanical failures, falls, fractures, sprains, disability, spinal injury, or fatal injury. The participant hereby forever releases, discharges, defends, and indemnifies Fun Strikes Entertainment LLP, its affiliates, track marshals, safety stewards, employees, and agents from any and all legal suits, damages, or liabilities.
      </div>
      <div class="clause-item">
        <strong>4. CUSTOMER PROPERTY DAMAGE &amp; EQUIPMENT BREAKAGE LIABILITY:</strong> Any physical damage, breakage, loss, or impairment caused to go-karts, engines, chassis, safety barriers, or venue property resulting from reckless conduct, disobeying track marshals, or rule violations must be paid in full by the customer as assessed by management before departing the facility premises.
      </div>
      <div class="clause-item">
        <strong>5. PROHIBITED SUBSTANCES, INTOXICATION &amp; LOOSE ARTICLES POLICY:</strong> Possession or consumption of alcohol, narcotics, drugs, or smoking/vaping is strictly prohibited on the premises. Persons suspected of being under the influence will be denied track access immediately. Mobile phones, cameras, selfie sticks, and loose items are prohibited while driving.
      </div>
      <div class="clause-item highlight-clause">
        <strong>6. STRICT 100% NON-REFUNDABLE &amp; NON-TRANSFERABLE PAYMENT POLICY:</strong> All ticket fees, admissions, and session charges are <strong>STRICTLY 100% NON-REFUNDABLE AND NON-TRANSFERABLE</strong> once paid. No refunds, credits, chargebacks, or date transfers shall be granted if a participant voluntarily withdraws, claims they "did not have fun", is disqualified or ejected for safety violations, fails height/attire checks, or in the event of equipment downtime or rain/weather interruptions.
      </div>
      <div class="clause-item">
        <strong>7. MEDICAL FITNESS WARRANTY &amp; CARDIOVASCULAR RESTRICTIONS:</strong> The participant warrants that all covered drivers are in sound physical and psychological health. Participation is strictly prohibited for individuals who are pregnant, suffer from hypertension, cardiovascular disorders, neck/back/spinal impairments, epilepsy, recent surgical operations, or who are impaired by alcohol, narcotics, or medications.
      </div>
      <div class="clause-item">
        <strong>8. SPEED GOVERNOR TAMPERING &amp; PIT LANE REGULATIONS:</strong> Any customer attempting to tamper with kart engines, governor cables, tire barriers, or safety switches will be permanently barred from the facility. Drivers must enter the pit lane at walking pace only; spinning out in the pit lane results in automatic termination of track privileges.
      </div>
      <div class="clause-item">
        <strong>9. CCTV SURVEILLANCE, SECURITY &amp; MEDIA RELEASE:</strong> The facility operates under continuous 24/7 CCTV surveillance. The participant grants Fun Strikes Entertainment LLP irrevocable permission to record, store, and utilize photographs and video recordings for venue security, promotional broadcasts, and safety investigations without monetary claim.
      </div>
      <div class="clause-item">
        <strong>10. EMERGENCY MEDICAL AUTHORIZATION &amp; FIRST AID CONSENT:</strong> In the event of injury, acute illness, or accident, the signer hereby authorizes Fun Strikes Entertainment LLP marshals and designated medical personnel to administer necessary first aid and, if warranted, arrange transport to the nearest medical emergency facility at the customer's sole financial expense.
      </div>
      <div class="clause-item">
        <strong>11. INDEMNIFICATION, GOVERNING LAW &amp; DIGITAL ADMISSIBILITY:</strong> The signer covenants to indemnify and hold harmless Fun Strikes Entertainment LLP from any claims arising from rule violations. This agreement is governed exclusively by the laws of India with exclusive jurisdiction in the courts of Surat, Gujarat. Pursuant to Sections 4 and 10A of the Information Technology Act, 2000, this digital signature and electronic contract hold full legal validity and admissibility.
      </div>
    `;

    checklistHtml = `
      <table class="checklist-table">
        <tr>
          <td><span class="check-box-icon">&#10003;</span> Full-Face Helmet Sized &amp; Strapped</td>
          <td><span class="check-box-icon">&#10003;</span> Closed-Toe Shoes Inspected</td>
          <td><span class="check-box-icon">&#10003;</span> Driver Height &ge; 5ft 5in Confirmed</td>
          <td><span class="check-box-icon">&#10003;</span> Track Flags Briefing Understood</td>
        </tr>
      </table>
    `;

    marshalCheckHtml = `
      <div>
        <strong>COUNTER MARSHAL CHECK:</strong>
        <span>Safety Helmet Buckled &bull; Closed-Toe Shoes &bull; Height Verified &ge; 5'5" &bull; Wristbands Issued (${totalCount})</span>
      </div>
      <div class="marshal-status-badge">STATUS: CLEARED FOR TRACK</div>
    `;
  } else {
    clausesHtml = `
      <div class="clause-item highlight-clause">
        <strong>1. MANDATORY NON-SLIP GRIP SOCKS POLICY:</strong> Approved non-slip trampoline grip socks must be worn at all times by every participant inside the trampoline arena and soft play structures. Bare feet, street footwear, sandals, sneakers, and regular smooth socks are strictly prohibited on trampoline beds.
      </div>
      <div class="clause-item">
        <strong>2. ONE PERSON PER TRAMPOLINE MAT &amp; NO DOUBLE BOUNCING:</strong> Strictly one jumper is permitted on any individual trampoline mat/square at a time. Double-bouncing, jumping into another participant's bounce zone, or landing on another jumper is hazardous and strictly prohibited.
      </div>
      <div class="clause-item">
        <strong>3. STUNT RESTRICTIONS &amp; FOAM PIT SAFETY DIRECTIVE:</strong> Inverted maneuvers, somersaults, multi-flips, and head-first diving into foam pits or airbag zones are strictly prohibited. Jumpers must always land on both feet simultaneously or in a seated bottom position. Always check that the foam pit is completely clear before jumping in.
      </div>
      <div class="clause-item">
        <strong>4. POCKETS EMPTY &amp; JEWELRY/SHARP OBJECTS PROHIBITION:</strong> All participants must empty all pockets and remove all jewelry, smartwatches, belt buckles, keychains, loose coins, pens, eyeglasses (unless sport-strapped), and mobile devices before stepping onto the jumping mats.
      </div>
      <div class="clause-item">
        <strong>5. ACTIVE PARENTAL SUPERVISION &amp; ZONE SEGREGATION:</strong> Parents and guardians bear 100% responsibility for actively supervising accompanying minors at all times. Toddler Soft Play zones are strictly reserved for toddlers and young children; adult jumping or rough play in toddler areas is prohibited. No running on safety pads, no climbing on peripheral netting, and no hanging on basketball rims.
      </div>
      <div class="clause-item highlight-clause">
        <strong>6. STRICT 100% NON-REFUNDABLE &amp; NON-TRANSFERABLE PAYMENT POLICY:</strong> All ticket fees, grip sock purchases, admissions, and session charges are <strong>STRICTLY 100% NON-REFUNDABLE AND NON-TRANSFERABLE</strong> once paid. No refunds, credits, chargebacks, or session date transfers shall be granted if a participant voluntarily leaves early, claims they "did not have fun", is ejected for safety violations, or in the event of venue capacity/equipment downtime.
      </div>
      <div class="clause-item">
        <strong>7. VOLUNTARY ASSUMPTION OF INHERENT JUMPING RISKS:</strong> Soft play and trampoline activities involve physical exertion, high impacts, jumping, and rapid balance changes. The participant and guardian freely assume all inherent risks including sprains, joint dislocations, bone fractures, spinal trauma, or accidental collisions. Fun Strikes Entertainment LLP bears ZERO liability.
      </div>
      <div class="clause-item">
        <strong>8. MEDICAL FITNESS WARRANTY &amp; HEALTH RESTRICTIONS:</strong> Participation is strictly prohibited for pregnant individuals or persons suffering from cardiovascular ailments, hypertension, spinal/back/neck impairments, epilepsy, recent surgical procedures, or individuals under the influence of alcohol, medications, or narcotics.
      </div>
      <div class="clause-item">
        <strong>9. CUSTOMER LIABILITY FOR MAT &amp; EQUIPMENT BREAKAGE:</strong> If any damage, tear, or breakage is caused to trampoline beds, protective spring pads, enclosure nets, foam pit blocks, or soft-play equipment due to reckless behavior, sharp objects, or rule violations, the customer agrees to pay full repair/replacement costs before leaving.
      </div>
      <div class="clause-item">
        <strong>10. CCTV SURVEILLANCE, FIRST AID &amp; JURISDICTION:</strong> The facility operates under 24/7 CCTV surveillance. Signer authorizes marshals to administer first aid or call emergency medical transport at the customer's expense. Governed by the laws of India under the exclusive jurisdiction of Surat courts; admissible under IT Act 2000 § 4 &amp; 10A.
      </div>
    `;

    checklistHtml = `
      <table class="checklist-table">
        <tr>
          <td><span class="check-box-icon">&#10003;</span> Non-Slip Grip Socks Inspected</td>
          <td><span class="check-box-icon">&#10003;</span> Pockets Emptied &amp; Sharp Items Removed</td>
          <td><span class="check-box-icon">&#10003;</span> 1 Jumper Per Mat Rule Understood</td>
          <td><span class="check-box-icon">&#10003;</span> Court Monitor Whistle Signals Briefed</td>
        </tr>
      </table>
    `;

    marshalCheckHtml = `
      <div>
        <strong>COUNTER MARSHAL CHECK:</strong>
        <span>Grip Socks Verified &bull; Pockets Emptied &bull; Rules Briefed &bull; Wristbands Issued (${totalCount})</span>
      </div>
      <div class="marshal-status-badge">STATUS: CLEARED FOR ARENA</div>
    `;
  }

  const sigHtml = r.signatureDataUrl
    ? `<img src="${r.signatureDataUrl}" class="sig-img" alt="Digital Signature" />`
    : `<div style="height: 48px; border-bottom: 1px dashed #94a3b8; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size: 8pt;">[Digitally Verified Signature on Record]</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Official Waiver - ${escapeHtml(r.refCode || "FS")} - Fun Strike!</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif;
      color: #0f172a;
      background: #f1f5f9;
      font-size: 8.8pt;
      line-height: 1.34;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 8px 18px;
      font-family: Arial, sans-serif;
      font-size: 11px;
      margin-bottom: 14px;
    }
    .print-btn {
      background: #e11d48;
      color: #ffffff;
      border: none;
      padding: 6px 16px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      font-size: 12px;
    }

    /* THE PROFESSIONAL FRAMED LEGAL CONTRACT WRAPPER */
    .legal-frame-wrapper {
      max-width: 190mm;
      margin: 0 auto;
      background: #ffffff;
      border: 2px solid #0f172a; /* Clean solid professional outer border */
      padding: 10mm 12mm;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }

    /* EACH SECTION PROTECTED AGAINST AWKWARD PAGE CUTS */
    .doc-section {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 7px;
    }

    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 3px;
    }
    .header-table td {
      vertical-align: middle;
      border: none;
      padding: 0;
    }
    .logo-cell {
      width: 62px;
    }
    .logo-img {
      width: 58px;
      height: 58px;
      object-fit: contain;
      display: block;
    }
    .title-cell {
      text-align: center;
      padding: 0 10px !important;
    }
    .company-title {
      font-size: 13.5pt;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.15;
    }
    .company-sub {
      font-size: 7.2pt;
      color: #475569;
      font-family: Arial, sans-serif;
      margin-top: 2px;
    }
    .doc-main-heading {
      font-size: 9.5pt;
      font-weight: 800;
      color: #991b1b;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-top: 3px;
    }

    .meta-bar {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-collapse: collapse;
      font-size: 7.8pt;
      font-family: Arial, sans-serif;
      margin-bottom: 6px;
    }
    .meta-bar td {
      padding: 3.5px 7px;
      border: 1px solid #cbd5e1;
    }

    .section-title {
      background: #0f172a;
      color: #ffffff;
      padding: 3.5px 8px;
      font-size: 8.2pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title span:last-child {
      font-size: 7.2pt;
      font-weight: normal;
      color: #cbd5e1;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
      margin-bottom: 4px;
    }
    .data-table th, .data-table td {
      border: 1px solid #cbd5e1;
      padding: 3.5px 6px;
      text-align: left;
    }
    .data-table th {
      background: #f1f5f9;
      font-weight: bold;
      font-size: 7.4pt;
      text-transform: uppercase;
      color: #334155;
    }
    .label-cell {
      width: 23%;
      font-weight: bold;
      background: #f8fafc;
      color: #334155;
      font-size: 7.4pt;
      text-transform: uppercase;
    }
    .value-cell {
      width: 27%;
    }

    .badge {
      display: inline-block;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 6.8pt;
      font-weight: bold;
      font-family: Arial, sans-serif;
      text-transform: uppercase;
      vertical-align: middle;
      white-space: nowrap;
    }
    .badge-adult { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .badge-minor { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .badge-primary { background: #0f172a; color: #ffffff; }

    .clauses-container {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: 3px;
      margin-bottom: 4px;
    }
    .clause-item {
      font-size: 8.2pt;
      text-align: justify;
      line-height: 1.33;
    }
    .clause-item strong {
      color: #0f172a;
    }
    .highlight-clause {
      background: #fff1f2;
      border-left: 3px solid #e11d48;
      padding: 4px 7px;
      border-top: 1px solid #ffe4e6;
      border-bottom: 1px solid #ffe4e6;
      border-right: 1px solid #ffe4e6;
    }

    .info-callout {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      padding: 4px 8px;
      font-size: 7.6pt;
      line-height: 1.3;
      margin-top: 2px;
      margin-bottom: 2px;
    }
    .info-callout strong {
      color: #0f172a;
    }

    .checklist-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.5pt;
      font-family: Arial, sans-serif;
      margin-bottom: 4px;
    }
    .checklist-table td {
      border: 1px solid #cbd5e1;
      padding: 3px 6px;
      background: #ffffff;
    }
    .check-box-icon {
      font-weight: bold;
      color: #166534;
      font-size: 9pt;
      margin-right: 3px;
    }

    .declaration-box {
      border: 1.2px solid #0f172a;
      background: #fafaf9;
      padding: 7px 10px;
      font-size: 8.2pt;
      line-height: 1.35;
      text-align: justify;
      margin-bottom: 5px;
    }

    .signature-grid {
      display: flex;
      width: 100%;
      border: 1.2px solid #0f172a;
      background: #ffffff;
      margin-bottom: 5px;
    }
    .sig-col-left {
      width: 58%;
      border-right: 1.2px solid #0f172a;
      padding: 7px 11px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sig-col-right {
      width: 42%;
      padding: 7px 11px;
      background: #f8fafc;
      font-size: 7.5pt;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 4px;
    }
    .sig-img {
      max-height: 52px;
      max-width: 100%;
      object-fit: contain;
      display: block;
      margin: 3px auto;
    }
    .audit-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #cbd5e1;
      padding-bottom: 2px;
    }
    .audit-label {
      color: #64748b;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 7pt;
    }
    .audit-val {
      font-weight: bold;
      color: #0f172a;
    }

    .marshal-strip {
      border: 1.5px solid #166534;
      background: #f0fdf4;
      padding: 6px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 7.5pt;
      margin-bottom: 5px;
    }
    .marshal-status-badge {
      background: #166534;
      color: #ffffff;
      padding: 3.5px 9px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 8pt;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    /* CLEAN PROFESSIONAL FOOTER ATTACHED DIRECTLY TO CONTENT */
    .page-footer {
      border-top: 1.5px solid #0f172a;
      padding-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 7.2pt;
      font-weight: bold;
      color: #475569;
      width: 100%;
      margin-top: 5px;
    }
    .page-footer-left {
      flex: 0 0 auto;
      text-align: left;
      color: #0f172a;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .page-footer-center {
      flex: 1 1 auto;
      text-align: center;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }
    .page-footer-right {
      flex: 0 0 auto;
      text-align: right;
      color: #334155;
      text-transform: uppercase;
      white-space: nowrap;
    }

    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .print-bar {
        display: none !important;
      }
      .legal-frame-wrapper {
        max-width: 100% !important;
        margin: 0 !important;
        border: 2px solid #0f172a !important;
        padding: 8mm 10mm !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>

  <div class="print-bar">
    <span>OFFICIAL LEGAL RECORD: Ref <strong>${escapeHtml(r.refCode || "FS")}</strong> &bull; ${escapeHtml(r.fullName || "Signer")} (${totalCount} Participants) &bull; ${escapeHtml(activityTitle)}</span>
    <button class="print-btn" onclick="window.print()">Print Legal Document</button>
  </div>

  <div class="legal-frame-wrapper">
    
    <!-- 1. HEADER -->
    <div class="doc-section">
      <table class="header-table">
        <tr>
          <td class="logo-cell"><img src="data:image/png;base64,${logoBase64}" class="logo-img" alt="Fun Strike Logo"></td>
          <td class="title-cell">
            <div class="company-title">FUN STRIKES ENTERTAINMENT LLP</div>
            <div class="company-sub">Registered LLP under Indian Limited Liability Partnership Act, 2008 &bull; Surat, Gujarat, India</div>
            <div class="doc-main-heading">PARTICIPANT LIABILITY WAIVER, INDEMNITY AGREEMENT & RULES OF OPERATION</div>
          </td>
        </tr>
      </table>

      <table class="meta-bar">
        <tr>
          <td><strong>ZONE:</strong> ${escapeHtml(activityTitle)}</td>
          <td><strong>BRANCH:</strong> ${escapeHtml(r.branch || "Gauravpath Road, Pal, Surat")}</td>
          <td><strong>TOTAL PARTICIPANTS:</strong> ${totalCount}</td>
          <td><strong>DOCUMENT REF:</strong> ${escapeHtml(r.refCode || "FS-RECORD")}</td>
        </tr>
      </table>
    </div>

    <!-- 2. SCHEDULE I: PRIMARY SIGNER -->
    <div class="doc-section">
      <div class="section-title">
        <span>Schedule I: Primary Signer &amp; Legal Guardian Identification</span>
        <span>FORM FS-W9</span>
      </div>
      <table class="data-table">
        <tr>
          <td class="label-cell">Primary Signer:</td>
          <td class="value-cell" style="word-break: break-word;"><strong>${escapeHtml(r.fullName || "—")}</strong></td>
          <td class="label-cell">Verified Mobile:</td>
          <td class="value-cell"><strong>${escapeHtml(r.phone || "—")}</strong></td>
        </tr>
        <tr>
          <td class="label-cell">Date of Birth &amp; Age:</td>
          <td class="value-cell">${escapeHtml(r.dob || "—")} (${escapeHtml(r.ageRole || "Adult")})</td>
          <td class="label-cell">Official Email:</td>
          <td class="value-cell" style="word-break: break-all;">${escapeHtml(r.email || "—")}</td>
        </tr>
        <tr>
          <td class="label-cell">${isGokart ? 'Height Verification:' : 'Participant Type:'}</td>
          <td class="value-cell"><strong>${isGokart ? escapeHtml(r.heightInches ? r.heightInches + ' in (Verified ≥ 5ft 5in)' : 'Verified On-Site') : 'Arena Jumper / Guardian'}</strong></td>
          <td class="label-cell">Signed By / Role:</td>
          <td class="value-cell">${escapeHtml(r.fullName ? r.fullName.split(' ')[0] : 'Signer')} (Self &amp; Legal Guardian)</td>
        </tr>
        <tr>
          <td class="label-cell">Residential Address:</td>
          <td class="value-cell" colspan="3" style="word-break: break-word;">${escapeHtml(r.address || "Surat, Gujarat, India")}</td>
        </tr>
      </table>
    </div>

    <!-- 3. SCHEDULE II: COVERED PARTICIPANTS (SINGLE LINE PER PARTICIPANT) -->
    <div class="doc-section">
      <div class="section-title">
        <span>Schedule II: Schedule of Covered Participants &amp; Dependents (${totalCount})</span>
        <span>INDIVIDUAL ACKNOWLEDGEMENT</span>
      </div>
      ${schedule2Html}
    </div>

    <!-- 4. SCHEDULE III: ACTIVITY-SPECIFIC RULES & COVENANTS -->
    <div class="doc-section">
      <div class="section-title">
        <span>Schedule III: ${escapeHtml(activitySub)}</span>
        <span>ENFORCEABLE LEGAL CONTRACT</span>
      </div>
      <div class="clauses-container">
        ${clausesHtml}
      </div>
    </div>

    <!-- 5. PRE-ACTIVITY ATTESTATION & CHECKLIST -->
    <div class="doc-section">
      <div class="info-callout">
        <strong>MANDATORY PRE-ACTIVITY ATTESTATION:</strong> All participants have undergone the compulsory safety orientation, had personal protective equipment / grip socks verified by marshals, and agreed to obey active attendant whistle signals and venue rules.
      </div>
      ${checklistHtml}
    </div>

    <!-- 6. SOLEMN AFFIRMATION & DECLARATION -->
    <div class="doc-section">
      <div class="declaration-box">
        <strong>SOLEMN AFFIRMATION &amp; LEGAL DECLARATION BY PRIMARY SIGNER / LEGAL GUARDIAN:</strong><br>
        I, the undersigned participant, parent, or lawful legal guardian, do hereby solemnly declare under penalty of perjury under Indian law that I am at least 18 years of age, and all personal details, identification records, and participant schedules set forth in Schedules I &amp; II are true, correct, and complete. I have thoroughly read, fully understood, and freely agreed to all operational safety directives, liability indemnities, risk assumption clauses, and non-refundable payment conditions. I hereby execute this instrument intending to be legally bound thereby on behalf of myself and all covered minors/dependents.
      </div>
    </div>

    <!-- 7. EXECUTION & DIGITAL SIGNATURE AUDIT BLOCK -->
    <div class="doc-section">
      <div class="signature-grid">
        <div class="sig-col-left">
          <div style="font-size: 7.4pt; font-weight: bold; text-transform: uppercase; color: #475569; font-family: Arial, sans-serif;">
            Signature of Customer / Parent / Legal Guardian:
          </div>
          <div style="text-align: center; margin: 3px 0;">
            ${sigHtml}
          </div>
          <div style="border-top: 1px solid #0f172a; padding-top: 2px;">
            <strong style="font-size: 8.4pt; word-break: break-word;">${escapeHtml(r.fullName || "Signer")}</strong> <span style="font-size: 7.3pt; color: #64748b;">(Primary Signer &amp; Guardian)</span>
          </div>
        </div>
        <div class="sig-col-right">
          <div class="audit-row">
            <span class="audit-label">Execution Date:</span>
            <span class="audit-val">${escapeHtml(r.timestamp ? String(r.timestamp).split(' ')[0] : '16-11-2026')}</span>
          </div>
          <div class="audit-row">
            <span class="audit-label">Submission Time:</span>
            <span class="audit-val">${escapeHtml(r.timestamp ? String(r.timestamp).split(' ').slice(1).join(' ') : '05:15:30 PM IST')}</span>
          </div>
          <div class="audit-row">
            <span class="audit-label">Terms &amp; Policy Ack:</span>
            <span class="audit-val" style="color: #166534;">CONFIRMED &amp; AGREED</span>
          </div>
          <div class="audit-row">
            <span class="audit-label">Security Audit Hash:</span>
            <span class="audit-val" style="font-family: monospace; font-size: 7.2pt;">${escapeHtml(r.refCode ? r.refCode + '-SEC-OK' : 'FS-VERIFIED')}</span>
          </div>
          <div class="audit-row" style="border-bottom: none;">
            <span class="audit-label">IT Act 2000 Status:</span>
            <span class="audit-val" style="color: #166534;">&sect; 4 &amp; 10A ADMISSIBLE</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 8. COUNTER MARSHAL CLEARANCE STRIP -->
    <div class="doc-section">
      <div class="marshal-strip">
        ${marshalCheckHtml}
      </div>
    </div>

    <!-- 9. 3-PART FOOTER (DIRECTLY UNDER CONTENT) -->
    <div class="doc-section">
      <footer class="page-footer">
        <span class="page-footer-left">Fun Strikes Entertainment LLP</span>
        <span class="page-footer-center">Made with &#10084; by Aryan and NexoraOneSolution</span>
        <span class="page-footer-right">Ref: ${escapeHtml(r.refCode || "FS")} &bull; ${escapeHtml(r.branch ? r.branch.split(',')[0] : 'Pal')}</span>
      </footer>
    </div>

  </div>

</body>
</html>`;
}

// Generate test for 1-rider and 20-riders to see the exact rendering!
const sampleRiders20 = [
  '1. Aarav Harshvardhansinh Sharma | 1996-04-12 | 30 yrs (adult) | Primary Signer',
  '2. Rohan Aarav Sharma | 2012-08-15 | 14 yrs (minor) | Family / Son',
  '3. Priya Aarav Sharma | 2015-02-20 | 11 yrs (minor) | Family / Daughter',
  '4. Vivek Vikramaditya Chudasama-Rathore | 1991-06-10 | 35 yrs (adult) | Brother / Guest',
  '5. Meenakshi Suryavanshi-Deshmukh | 1994-11-25 | 32 yrs (adult) | Sister-in-law',
  '6. Harshvardhan Jaideepsinh Solanki | 2008-03-14 | 18 yrs (adult) | Cousin',
  '7. Ananya Devendrasingh Jhala | 2014-07-22 | 12 yrs (minor) | Niece',
  '8. Rajveer Mahendrasingh Parmar | 2005-09-09 | 21 yrs (adult) | Friend',
  '9. Kripalsinh Digvijaysinh Jadeja | 2000-12-01 | 26 yrs (adult) | Friend',
  '10. Shivendrasinh Yuvrajsinh Vaghela | 1998-05-18 | 28 yrs (adult) | Friend',
  '11. Bhavik Kiritkumar Bhattacharya | 1995-02-14 | 31 yrs (adult) | Colleague',
  '12. Chirag Hemendrabhai Prajapati | 1993-10-30 | 33 yrs (adult) | Colleague',
  '13. Divyarajsinh Pratapsinh Gohil | 2003-04-19 | 23 yrs (adult) | Friend',
  '14. Eshaani Chandrakant Sengupta | 2013-11-12 | 13 yrs (minor) | Family / Cousin',
  '15. Farhan Mohammadsiddiq Mansuri | 1997-08-05 | 29 yrs (adult) | Friend',
  '16. Gaurav Dharmendrabhai Makwana | 2002-01-20 | 24 yrs (adult) | Friend',
  '17. Hardik Jayeshkumar Brahmbhatt | 1999-06-17 | 27 yrs (adult) | Friend',
  '18. Ishan Dhirendrasingh Shekhawat | 2016-05-08 | 10 yrs (minor) | Family / Guest',
  '19. Jatin Chandrashekhar Upadhyay | 1990-09-23 | 36 yrs (adult) | Relative',
  '20. Karan Balwantsinh Mahida-Chavda | 1994-03-11 | 32 yrs (adult) | Guest'
];

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

[
  { count: 1, name: 'gokart-single' },
  { count: 20, name: 'gokart-20riders' },
  { count: 1, name: 'trampoline-single' },
  { count: 20, name: 'trampoline-20jumpers' },
].forEach(t => {
  const isTramp = t.name.includes('trampoline');
  const record = {
    refCode: 'FS-FRAME-' + t.name.toUpperCase(),
    fullName: 'Aarav Harshvardhansinh Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    dob: '1996-04-12',
    ageRole: 'Adult (30 yrs)',
    heightInches: 66,
    address: '102, Shivalik Heights, Gauravpath Road, Pal, Surat, Gujarat - 395009',
    branch: isTramp ? 'Mota Varachha, Surat' : 'Gauravpath Road, Pal, Surat',
    activity: isTramp ? 'Trampoline & Soft Play Park' : 'Go-Karting Track (18+)',
    allRiders: sampleRiders20.slice(0, t.count).join('\n'),
    signatureDataUrl: sampleSig,
    timestamp: '16-11-2026 05:15:30 PM'
  };

  const html = buildFramedLegalWaiverHtml(record);
  const htmlFile = `E:/Aryan/fun-strikes-waiver/printables/framed-${t.name}.html`;
  const pdfFile = `E:/Aryan/fun-strikes-waiver/printables/framed-${t.name}.pdf`;
  const pngFile = `E:/Aryan/fun-strikes-waiver/printables/framed-${t.name}-preview.png`;

  fs.writeFileSync(htmlFile, html, 'utf8');

  const htmlUri = 'file:///' + path.resolve(htmlFile).replace(/\\/g, '/');

  execSync(`"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFile}" "${htmlUri}"`, { stdio: 'ignore' });
  execSync(`"${chromePath}" --headless --disable-gpu --window-size=950,2250 --screenshot="${pngFile}" "${htmlUri}"`, { stdio: 'ignore' });

  const pdfBuf = fs.readFileSync(pdfFile);
  const pages = (pdfBuf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
  console.log(`Rendered [${t.name}] -> PDF Pages = ${pages}`);
});

module.exports = { buildFramedLegalWaiverHtml };
