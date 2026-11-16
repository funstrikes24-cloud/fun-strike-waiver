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

function buildContinuousDynamicHtml(r) {
  const isGokart = /kart/i.test(r.activity || "") || /kart/i.test(r.branch || "");
  const activityTitle = isGokart ? "GO-KARTING TRACK (18+)" : "TRAMPOLINE ARENA & SOFT PLAY PARK";
  const activitySub = isGokart ? "Go-Karting Speedway Operational Directives & Safety Protocol" : "Trampoline Bounce Rules, Grip Socks Policy & Play Regulations";

  const riderLines = String(r.allRiders || r.fullName || "")
    .split(/\r?\n/)
    .filter(Boolean);

  const totalCount = riderLines.length;

  // Schedule II: Strict 1 line per participant name (white-space: nowrap)
  const schedule2Rows = riderLines.map(function(line, idx) {
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
      <td style="white-space: nowrap; font-weight: bold; color: #0f172a; padding: 3px 8px;">${escapeHtml(pName)}</td>
      <td style="text-align: center; white-space: nowrap; padding: 3px 6px;">${escapeHtml(pDob)}</td>
      <td style="text-align: center; white-space: nowrap; padding: 3px 6px;">${ageBadge}</td>
      <td style="white-space: nowrap; padding: 3px 8px;">${relBadge}</td>
    </tr>`;
  }).join('');

  const schedule2Html = `
    <table class="data-table participants-table">
      <thead>
        <tr>
          <th style="width: 24px; text-align: center;">#</th>
          <th>Full Legal Name of Participant</th>
          <th style="width: 85px; text-align: center;">Date of Birth</th>
          <th style="width: 100px; text-align: center;">Age &amp; Category</th>
          <th style="width: 120px;">Relationship</th>
        </tr>
      </thead>
      <tbody>${schedule2Rows}</tbody>
    </table>
  `;

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
        <strong>11. INDEMNIFICATION, GOVERNING LAW, IT ACT &amp; DPDP ACT 2023:</strong> The signer covenants to indemnify and hold harmless Fun Strikes Entertainment LLP from any claims. This agreement is governed exclusively by Indian law with jurisdiction in Surat, Gujarat. Pursuant to Sections 4 and 10A of the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023 (DPDP Act), all participant personal data is processed lawfully and strictly for venue operations, safety enforcement, and legal indemnification. This digital signature holds full legal validity and admissibility.
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
      <div class="marshal-text">
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
        <strong>10. EMERGENCY FIRST AID &amp; 24/7 CCTV CONSENT:</strong> The signer consents to CCTV monitoring for facility safety. In case of injury, Fun Strikes staff are authorized to provide basic first aid and coordinate emergency 108 ambulance transfer at customer's sole cost.
      </div>
      <div class="clause-item">
        <strong>11. LEGAL JURISDICTION, IT ACT &amp; DPDP ACT 2023:</strong> This agreement is governed exclusively by Indian law and the courts of Surat, Gujarat. Pursuant to Sections 4 &amp; 10A of the IT Act, 2000, and the Digital Personal Data Protection Act, 2023 (DPDP Act), all participant data is protected and lawfully processed. This electronic signature constitutes a legally valid contract.
      </div>
    `;

    checklistHtml = `
      <table class="checklist-table">
        <tr>
          <td><span class="check-box-icon">&#10003;</span> Approved Grip Socks On</td>
          <td><span class="check-box-icon">&#10003;</span> Pockets Emptied Completely</td>
          <td><span class="check-box-icon">&#10003;</span> 1 Jumper Per Mat Understood</td>
          <td><span class="check-box-icon">&#10003;</span> Arena Court Whistle Rules Agreed</td>
        </tr>
      </table>
    `;

    marshalCheckHtml = `
      <div class="marshal-text">
        <strong>COUNTER MONITOR CHECK:</strong>
        <span>Non-Slip Grip Socks Verified &bull; Pockets Emptied &bull; Arena Rules Briefed &bull; Wristbands Issued (${totalCount})</span>
      </div>
      <div class="marshal-status-badge" style="background: #0284c7;">STATUS: CLEARED FOR ARENA</div>
    `;
  }

  const sigHtml = (r.signatureDataUrl && String(r.signatureDataUrl).startsWith("data:image"))
    ? `<img src="${r.signatureDataUrl}" class="sig-img" alt="Digital Signature">`
    : `<div style="height: 38px; line-height: 38px; font-style: italic; color: #1e293b; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 15pt; text-align: center;">${escapeHtml(r.fullName || "Aarav Sharma")}</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Official Waiver - ${escapeHtml(r.refCode || "FS-WAIVER")} - Fun Strike!</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 7mm 8mm 7mm 8mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif;
      color: #0f172a;
      background: #ffffff !important; /* PURE WHITE - ZERO GRAY ANYWHERE */
      font-size: 8.5pt;
      line-height: 1.30;
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
      margin-bottom: 12px;
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

    /* MASTER TABLE PRINT WRAPPER: PREVENTS TEXT COLLIDING WITH FOOTER */
    .waiver-page-table {
      width: 100%;
      max-width: 194mm;
      margin: 0 auto;
      border-collapse: collapse;
      background: #ffffff;
    }

    /* CLOSED RECTANGLE BORDER ON CONTENT AREA */
    .waiver-content-td {
      border: 1.5px solid #0f172a;
      border-bottom: none;
      padding: 5mm 7mm 3mm 7mm;
      background: #ffffff;
      vertical-align: top;
    }

    /* CLOSED RECTANGLE BORDER ON FOOTER (REPEATS AT BOTTOM OF EVERY PAGE) */
    .waiver-footer-td {
      border: 1.5px solid #0f172a;
      border-top: 1.2px solid #0f172a;
      padding: 5px 12px;
      background: #ffffff;
      vertical-align: middle;
    }
    .clean-footer-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 7.4pt;
      color: #475569;
      width: 100%;
    }
    .c-footer-left {
      flex: 0 0 auto;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }
    .c-footer-center {
      flex: 1 1 auto;
      text-align: center;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      white-space: nowrap;
    }
    .c-footer-right {
      flex: 0 0 auto;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.2px;
      white-space: nowrap;
    }

    /* PROTECT ATOMIC LOGICAL UNITS AGAINST SPLITTING ACROSS A PAGE LINE */
    .doc-unit {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 4px;
    }

    /* SCHEDULE III ALLOWS NATURAL PAGINATION ACROSS PAGES, BUT PROTECTS INDIVIDUAL CLAUSES */
    .doc-unit-flow {
      margin-bottom: 4px;
    }
    .doc-unit-flow .section-title {
      break-after: avoid;
      page-break-after: avoid;
    }

    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 3px;
      margin-bottom: 2px;
    }
    .header-table td {
      vertical-align: middle;
    }
    .logo-cell {
      width: 60px;
      text-align: left;
      padding-right: 10px;
    }
    .logo-img {
      height: 48px;
      width: auto;
      display: block;
    }
    .title-cell {
      text-align: center;
    }
    .company-title {
      font-size: 13.5pt;
      font-weight: 900;
      letter-spacing: 0.8px;
      color: #0f172a;
      text-transform: uppercase;
    }
    .company-sub {
      font-size: 7.2pt;
      font-style: italic;
      color: #475569;
      font-family: Arial, sans-serif;
      margin-top: 1px;
    }
    .doc-main-heading {
      font-size: 8.6pt;
      font-weight: bold;
      color: #b91c1c;
      letter-spacing: 0.4px;
      margin-top: 2px;
      text-transform: uppercase;
    }

    /* 2x2 BALANCED META BAR (2 ITEMS PER ROW ACROSS 2 LINES) */
    .meta-bar {
      width: 100%;
      border-collapse: collapse;
      border-top: 1.5px solid #0f172a;
      border-bottom: 1.5px solid #0f172a;
      background: #f8fafc;
      margin-top: 3px;
      font-family: Arial, sans-serif;
      font-size: 7.4pt;
    }
    .meta-bar td {
      padding: 3.5px 8px;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }

    .section-title {
      background: #0f172a;
      color: #ffffff;
      padding: 3px 8px;
      font-family: Arial, sans-serif;
      font-size: 7.8pt;
      font-weight: bold;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.8pt;
      font-family: Arial, sans-serif;
      border: 1px solid #cbd5e1;
    }
    .data-table td, .data-table th {
      border: 1px solid #cbd5e1;
      padding: 3px 7px;
    }
    .label-cell {
      background: #f8fafc;
      font-weight: bold;
      color: #475569;
      width: 18%;
      text-transform: uppercase;
      font-size: 7pt;
    }
    .value-cell {
      color: #0f172a;
      width: 32%;
    }

    .participants-table th {
      background: #f1f5f9;
      font-weight: bold;
      color: #1e293b;
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 3.5px 6px;
      white-space: nowrap;
    }

    .badge {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 2px;
      font-size: 6.5pt;
      font-weight: bold;
      text-transform: uppercase;
      font-family: Arial, sans-serif;
      white-space: nowrap;
    }
    .badge-adult { background: #dbeafe; color: #1e40af; }
    .badge-minor { background: #fee2e2; color: #991b1b; }
    .badge-primary { background: #dcfce7; color: #166534; }

    .clauses-container {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 8pt;
      line-height: 1.28;
      text-align: justify;
    }
    .clause-item {
      break-inside: avoid;
      page-break-inside: avoid;
      padding: 2.5px 0;
      border-bottom: 1px dotted #e2e8f0;
    }
    .clause-item:last-child {
      border-bottom: none;
    }
    .highlight-clause {
      background: #fff1f2;
      border-left: 3px solid #e11d48;
      padding: 3.5px 7px !important;
      margin: 1.5px 0;
    }

    .info-callout {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3px solid #0284c7;
      padding: 4px 8px;
      font-size: 7.6pt;
      line-height: 1.26;
      margin-bottom: 3px;
    }
    .checklist-table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      font-family: Arial, sans-serif;
      font-size: 7.4pt;
    }
    .checklist-table td {
      border: 1px solid #cbd5e1;
      padding: 3.5px 6px;
      font-weight: bold;
      color: #0f172a;
      width: 25%;
    }
    .check-box-icon {
      color: #166534;
      font-weight: 900;
      margin-right: 3px;
    }

    .declaration-box {
      border: 1.2px solid #0f172a;
      background: #ffffff;
      padding: 4px 7px;
      font-size: 7.4pt;
      line-height: 1.26;
      text-align: justify;
    }

    .signature-grid {
      display: flex;
      width: 100%;
      border: 1.2px solid #0f172a;
      background: #ffffff;
    }
    .sig-col-left {
      width: 56%;
      border-right: 1.2px solid #0f172a;
      padding: 6px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sig-col-right {
      width: 44%;
      padding: 6px 10px;
      background: #f8fafc;
      font-size: 7.3pt;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 3px;
    }
    .sig-img {
      max-height: 48px;
      max-width: 100%;
      object-fit: contain;
      display: block;
      margin: 2px auto;
    }
    .audit-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #cbd5e1;
      padding-bottom: 1.5px;
    }
    .audit-label {
      color: #64748b;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 6.8pt;
    }
    .audit-val {
      font-weight: bold;
      color: #0f172a;
    }

    /* CLEARLY SEPARATED COUNTER MARSHAL CHECK (NO BADGE OVERLAPPING) */
    .marshal-strip {
      border: 1.5px solid #166534;
      background: #f0fdf4;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      font-family: Arial, sans-serif;
      font-size: 7.5pt;
    }
    .marshal-text {
      flex: 1 1 auto;
      line-height: 1.34;
    }
    .marshal-status-badge {
      flex: 0 0 auto;
      background: #166534;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 7.8pt;
      letter-spacing: 0.5px;
      white-space: nowrap;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0;
      }
      .print-bar {
        display: none !important;
      }
      .waiver-page-table {
        max-width: 100% !important;
        margin: 0 !important;
      }
    }
  </style>
</head>
<body>

  <div class="print-bar">
    <span>OFFICIAL LEGAL RECORD: Ref <strong>${escapeHtml(r.refCode || "FS")}</strong> &bull; ${escapeHtml(r.fullName || "Signer")} (${totalCount} Participants) &bull; ${escapeHtml(activityTitle)}</span>
    <button class="print-btn" onclick="window.print()">Print Legal Contract</button>
  </div>

  <table class="waiver-page-table">
    <tfoot>
      <tr>
        <td class="waiver-footer-td">
          <div class="clean-footer-wrap">
            <span class="c-footer-left">FUN STRIKES ENTERTAINMENT LLP</span>
            <span class="c-footer-center">MADE WITH &#10084; BY ARYAN AND NEXORAONESOLUTION</span>
            <span class="c-footer-right">Fun Strike! Game Zone &bull; ${escapeHtml(r.branch || "Gauravpath Road, Pal, Surat")}</span>
          </div>
        </td>
      </tr>
    </tfoot>
    <tbody>
      <tr>
        <td class="waiver-content-td">

          <!-- 1. HEADER -->
          <div class="doc-unit">
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

            <!-- 2x2 BALANCED META BAR (2 ITEMS PER ROW) -->
            <table class="meta-bar">
              <tr>
                <td style="width: 52%;"><strong>ZONE / ACTIVITY:</strong> ${escapeHtml(activityTitle)}</td>
                <td style="width: 48%;"><strong>DOCUMENT REF:</strong> ${escapeHtml(r.refCode || "FS-RECORD")}</td>
              </tr>
              <tr>
                <td><strong>LOCATION / BRANCH:</strong> ${escapeHtml(r.branch || "Gauravpath Road, Pal, Surat")}</td>
                <td><strong>TOTAL PARTICIPANTS:</strong> ${totalCount} (${isGokart ? 'DRIVERS' : 'JUMPERS'})</td>
              </tr>
            </table>
          </div>

          <!-- 2. SCHEDULE I: PRIMARY SIGNER -->
          <div class="doc-unit">
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

          <!-- 3. SCHEDULE II: COVERED PARTICIPANTS (1 LINE PER PARTICIPANT) -->
          <div class="doc-unit">
            <div class="section-title">
              <span>Schedule II: Schedule of Covered Participants &amp; Dependents (${totalCount})</span>
              <span>INDIVIDUAL ACKNOWLEDGEMENT (1 LINE PER PARTICIPANT)</span>
            </div>
            ${schedule2Html}
          </div>

          <!-- 4. SCHEDULE III: FLOWS IMMEDIATELY UNDER SCHEDULE II DYNAMICALLY! -->
          <div class="doc-unit-flow">
            <div class="section-title">
              <span>Schedule III: ${escapeHtml(activitySub)}</span>
              <span>ENFORCEABLE LEGAL CONTRACT</span>
            </div>
            <div class="clauses-container">
              ${clausesHtml}
            </div>
          </div>

          <!-- 5. PRE-ACTIVITY ATTESTATION & CHECKLIST -->
          <div class="doc-unit">
            <div class="info-callout">
              <strong>MANDATORY PRE-ACTIVITY ATTESTATION:</strong> All participants have undergone the compulsory safety orientation, had personal protective equipment / grip socks verified by marshals, and agreed to obey active attendant whistle signals and venue rules.
            </div>
            ${checklistHtml}
          </div>

          <!-- 6. SOLEMN AFFIRMATION & DECLARATION -->
          <div class="doc-unit">
            <div class="declaration-box">
              <strong>SOLEMN AFFIRMATION &amp; LEGAL DECLARATION BY PRIMARY SIGNER / LEGAL GUARDIAN:</strong><br>
              I, the undersigned participant, parent, or lawful legal guardian, do hereby solemnly declare under penalty of perjury under Indian law that I am at least 18 years of age, and all personal details, identification records, and participant schedules set forth in Schedules I &amp; II are true, correct, and complete. I have thoroughly read, fully understood, and freely agreed to all operational safety directives, liability indemnities, risk assumption clauses, and non-refundable payment conditions. I hereby execute this instrument intending to be legally bound thereby on behalf of myself and all covered minors/dependents.
            </div>
          </div>

          <!-- 7. EXECUTION & DIGITAL SIGNATURE AUDIT BLOCK -->
          <div class="doc-unit">
            <div class="signature-grid">
              <div class="sig-col-left">
                <div style="font-size: 7.2pt; font-weight: bold; text-transform: uppercase; color: #475569; font-family: Arial, sans-serif;">
                  Signature of Customer / Parent / Legal Guardian:
                </div>
                <div style="text-align: center; margin: 2px 0;">
                  ${sigHtml}
                </div>
                <div style="border-top: 1px solid #0f172a; padding-top: 2px;">
                  <strong style="font-size: 8.2pt; word-break: break-word;">${escapeHtml(r.fullName || "Signer")}</strong> <span style="font-size: 7.2pt; color: #64748b;">(Primary Signer &amp; Guardian)</span>
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
                  <span class="audit-val" style="font-family: monospace; font-size: 7pt;">${escapeHtml(r.refCode || "FS-RECORD")}-SEC-OK</span>
                </div>
                <div class="audit-row">
                  <span class="audit-label">Legal Framework:</span>
                  <span class="audit-val" style="color: #166534;">IT Act 2000 (Sec 4 &amp; 10A)</span>
                </div>
                <div class="audit-row" style="border-bottom: none;">
                  <span class="audit-label">Data Privacy:</span>
                  <span class="audit-val" style="color: #166534;">DPDP Act 2023 Compliant</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 8. COUNTER MARSHAL CLEARANCE STRIP -->
          <div class="doc-unit">
            <div class="marshal-strip">
              ${marshalCheckHtml}
            </div>
          </div>

        </td>
      </tr>
    </tbody>
  </table>

</body>
</html>`;
}

module.exports = { buildContinuousDynamicHtml };
