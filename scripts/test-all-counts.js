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

function buildPrintableHtml(r) {
  const isGokart = /kart/i.test(r.activity || "") || /kart/i.test(r.branch || "");
  const activityTitle = isGokart ? "GO-KARTING TRACK" : "TRAMPOLINE & SOFT PLAY PARK";

  const riderLines = String(r.allRiders || r.fullName || "")
    .split(/\r?\n/)
    .filter(Boolean);

  const totalCount = riderLines.length;
  const isDense = totalCount > 6;
  const isGrid2Col = totalCount > 8;

  let participantsHtml = '';

  if (isGrid2Col) {
    // 2-column split table for 9-20 participants so it takes half the vertical space!
    const half = Math.ceil(totalCount / 2);
    const col1 = riderLines.slice(0, half);
    const col2 = riderLines.slice(half);

    function renderSubRows(list, offset) {
      return list.map(function(line, idx) {
        const cleanLine = line.replace(/^\d+\.\s*/, "");
        const parts = cleanLine.split(" | ");
        const pName = parts[0] || cleanLine;
        const pDob = parts[1] || r.dob || "—";
        const pAge = parts[2] || r.ageRole || "—";
        const pRel = parts[3] || (idx + offset === 0 ? "Primary" : "Participant");

        const isMinor = /minor/i.test(pAge);
        const cleanAge = pAge.replace(/\s*\((minor|adult)\)/gi, "").trim();
        const badge = isMinor
          ? '<span class="badge badge-minor">MIN</span> ' + escapeHtml(cleanAge)
          : '<span class="badge badge-adult">ADU</span> ' + escapeHtml(cleanAge);

        const relShort = (idx + offset === 0)
          ? '<span class="badge badge-primary">SIGNER</span>'
          : escapeHtml(pRel.split('/')[0].trim());

        return `<tr>
          <td style="text-align:center; font-weight:bold; width:18px; padding:2px;">${idx + offset + 1}</td>
          <td style="padding:2px 4px; word-break:break-word; line-height:1.15;"><strong>${escapeHtml(pName)}</strong></td>
          <td style="text-align:center; white-space:nowrap; padding:2px 4px; font-size:6.8pt;">${badge}</td>
          <td style="white-space:nowrap; padding:2px 4px; font-size:6.8pt;">${relShort}</td>
        </tr>`;
      }).join('');
    }

    participantsHtml = `
      <div style="display:flex; gap:6px; width:100%;">
        <table class="data-table dense-table" style="width:50%;">
          <thead>
            <tr>
              <th style="width:18px; text-align:center;">#</th>
              <th>Full Legal Name</th>
              <th style="width:65px; text-align:center;">Category</th>
              <th style="width:65px;">Relation</th>
            </tr>
          </thead>
          <tbody>${renderSubRows(col1, 0)}</tbody>
        </table>
        <table class="data-table dense-table" style="width:50%;">
          <thead>
            <tr>
              <th style="width:18px; text-align:center;">#</th>
              <th>Full Legal Name</th>
              <th style="width:65px; text-align:center;">Category</th>
              <th style="width:65px;">Relation</th>
            </tr>
          </thead>
          <tbody>${renderSubRows(col2, half)}</tbody>
        </table>
      </div>
    `;
  } else {
    // 1-8 participants: standard wide table
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
        <td style="text-align: center; font-weight: bold; color: #475569; width: 22px;">${idx + 1}</td>
        <td style="word-break: break-word; line-height: 1.2;"><strong>${escapeHtml(pName)}</strong></td>
        <td style="text-align: center; white-space: nowrap;">${escapeHtml(pDob)}</td>
        <td style="text-align: center; white-space: nowrap;">${ageBadge}</td>
        <td style="white-space: nowrap;">${relBadge}</td>
      </tr>`;
    }).join('');

    participantsHtml = `
      <table class="data-table ${isDense ? 'dense-table' : ''}">
        <thead>
          <tr>
            <th style="width: 5%; text-align: center;">#</th>
            <th style="width: 36%;">Full Legal Name of Participant</th>
            <th style="width: 18%; text-align: center;">Date of Birth</th>
            <th style="width: 20%; text-align: center;">Age &amp; Category</th>
            <th style="width: 21%;">Relationship to Signer</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
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
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif;
      color: #0f172a;
      background: #f8fafc;
      font-size: 8.6pt;
      line-height: 1.33;
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

    .sheet-page {
      width: 100%;
      max-width: 190mm;
      border: 1.5px solid #0f172a;
      padding: 7mm 9mm;
      background: #ffffff;
      margin: 0 auto 12mm auto;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 275mm;
    }
    .sheet-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
      margin-bottom: 0;
    }

    .page-content-wrapper {
      display: flex;
      flex-direction: column;
      gap: ${totalCount > 10 ? '5px' : '6.5px'};
      flex: 1 1 auto;
    }

    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 5px;
      margin-bottom: 1px;
    }
    .header-table td {
      vertical-align: middle;
      border: none;
      padding: 0;
    }
    .logo-cell {
      width: 58px;
    }
    .logo-img {
      width: 54px;
      height: 54px;
      object-fit: contain;
      display: block;
    }
    .title-cell {
      text-align: center;
      padding: 0 8px !important;
    }
    .company-title {
      font-size: 13pt;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.15;
    }
    .company-sub {
      font-size: 7pt;
      color: #475569;
      font-family: Arial, sans-serif;
      margin-top: 1px;
    }
    .doc-main-heading {
      font-size: 9.2pt;
      font-weight: 800;
      color: #991b1b;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-top: 2px;
    }

    .meta-bar {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-collapse: collapse;
      font-size: 7.6pt;
      font-family: Arial, sans-serif;
    }
    .meta-bar td {
      padding: 3px 6px;
      border: 1px solid #cbd5e1;
    }

    .section-title {
      background: #0f172a;
      color: #ffffff;
      padding: 3px 7px;
      font-size: 8pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title span:last-child {
      font-size: 7pt;
      font-weight: normal;
      color: #cbd5e1;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.8pt;
    }
    .data-table th, .data-table td {
      border: 1px solid #cbd5e1;
      padding: ${totalCount > 6 ? '2px 4px' : '3px 6px'};
      text-align: left;
    }
    .dense-table th, .dense-table td {
      padding: 2px 4px !important;
      font-size: 7.2pt !important;
    }
    .data-table th {
      background: #f1f5f9;
      font-weight: bold;
      font-size: 7.2pt;
      text-transform: uppercase;
      color: #334155;
    }
    .label-cell {
      width: 23%;
      font-weight: bold;
      background: #f8fafc;
      color: #334155;
      font-size: 7.2pt;
      text-transform: uppercase;
    }
    .value-cell {
      width: 27%;
    }

    .badge {
      display: inline-block;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 6.5pt;
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
      gap: ${totalCount > 10 ? '4px' : '5px'};
    }
    .clause-item {
      font-size: ${totalCount > 10 ? '7.8pt' : '8.1pt'};
      text-align: justify;
      line-height: ${totalCount > 10 ? '1.28' : '1.32'};
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
      padding: 4px 7px;
      font-size: 7.5pt;
      line-height: 1.28;
    }
    .info-callout strong {
      color: #0f172a;
    }

    .checklist-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.4pt;
      font-family: Arial, sans-serif;
    }
    .checklist-table td {
      border: 1px solid #cbd5e1;
      padding: 2.5px 5px;
      background: #ffffff;
    }
    .check-box-icon {
      font-weight: bold;
      color: #166534;
      font-size: 8.5pt;
      margin-right: 3px;
    }

    .continuation-banner {
      border: 1px dashed #64748b;
      background: #f8fafc;
      padding: 3.5px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 7.2pt;
      font-weight: bold;
      color: #334155;
    }

    .declaration-box {
      border: 1.2px solid #0f172a;
      background: #fafaf9;
      padding: 6px 9px;
      font-size: 8pt;
      line-height: 1.34;
      text-align: justify;
    }

    .signature-grid {
      display: flex;
      width: 100%;
      border: 1.2px solid #0f172a;
      background: #ffffff;
    }
    .sig-col-left {
      width: 58%;
      border-right: 1.2px solid #0f172a;
      padding: 7px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sig-col-right {
      width: 42%;
      padding: 7px 10px;
      background: #f8fafc;
      font-size: 7.4pt;
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
      font-size: 6.8pt;
    }
    .audit-val {
      font-weight: bold;
      color: #0f172a;
    }

    .marshal-strip {
      border: 1.5px solid #166534;
      background: #f0fdf4;
      padding: 6px 9px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 7.4pt;
    }
    .marshal-status-badge {
      background: #166534;
      color: #ffffff;
      padding: 3.5px 8px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 7.8pt;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .page-footer {
      border-top: 1.5px solid #0f172a;
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 7.2pt;
      font-weight: bold;
      color: #475569;
      width: 100%;
      margin-top: 3px;
      flex: 0 0 auto;
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
      }
      .print-bar {
        display: none !important;
      }
      .sheet-page {
        margin: 0 !important;
        border: 1.5px solid #0f172a !important;
        box-shadow: none !important;
        height: 278mm !important;
      }
    }
  </style>
</head>
<body>

  <div class="print-bar">
    <span>OFFICIAL LEGAL RECORD: Ref <strong>${escapeHtml(r.refCode || "FS")}</strong> &bull; ${escapeHtml(r.fullName || "Signer")} (${totalCount} Participants)</span>
    <button class="print-btn" onclick="window.print()">Print Legal Document (2 Pages)</button>
  </div>

  <!-- PAGE 1 OF 2 -->
  <div class="sheet-page">
    <div class="page-content-wrapper">
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
          <td><strong>TOTAL PARTICIPANTS:</strong> ${totalCount} DRIVERS</td>
          <td><strong>DOCUMENT REF:</strong> ${escapeHtml(r.refCode || "FS-RECORD")}</td>
        </tr>
      </table>

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
          <td class="label-cell">Height Verification:</td>
          <td class="value-cell"><strong>${escapeHtml(r.heightInches ? r.heightInches + ' in (Verified ≥ 5ft 5in)' : 'Verified On-Site')}</strong></td>
          <td class="label-cell">Signed By / Role:</td>
          <td class="value-cell">${escapeHtml(r.fullName ? r.fullName.split(' ')[0] : 'Signer')} (Self &amp; Legal Guardian)</td>
        </tr>
        <tr>
          <td class="label-cell">Residential Address:</td>
          <td class="value-cell" colspan="3" style="word-break: break-word;">${escapeHtml(r.address || "Surat, Gujarat, India")}</td>
        </tr>
      </table>

      <div class="section-title">
        <span>Schedule II: Schedule of Covered Participants &amp; Dependents (${totalCount})</span>
        <span>INDIVIDUAL ACKNOWLEDGEMENT</span>
      </div>
      
      ${participantsHtml}

      <div class="section-title">
        <span>Schedule III (Part A): Operational Regulations &amp; Safety Directives</span>
        <span>MANDATORY DIRECTIVES</span>
      </div>
      <div class="clauses-container">
        <div class="clause-item highlight-clause">
          <strong>1. STRICT 18+ ADULT POLICY &amp; SOLE MINOR LIABILITY CLAUSE:</strong> The Go-Karting Track is strictly designed, engineered, and operated exclusively for adult drivers aged 18 and older. If a minor under 18 years of age operates a kart or signs this instrument, the primary signer and parent/legal guardian explicitly warrant, covenant, and declare that <strong>ONE HUNDRED PERCENT (100%) OF ALL RISKS, PERSONAL INJURIES, VEHICLE LIABILITIES, AND DAMAGES REST SOLELY WITH THEM</strong>. Fun Strikes Entertainment LLP, its designated partners, and track marshals bear ZERO liability under any circumstances.
        </div>
        <div class="clause-item">
          <strong>2. TRACK RULES, SAFETY EQUIPMENT &amp; MANDATORY HEIGHT VERIFICATION:</strong> Single-kart drivers must meet the strict minimum height requirement of <strong>5'5" (165 cm)</strong>. Full-face protective helmets must be securely buckled prior to entering the pit lane and accelerating. Closed-toe footwear is mandatory at all times (no crocs, sandals, high heels, or loose footwear). Loose clothing, scarves, dupattas must be tucked in securely; long hair must be tied securely above shoulder level. <strong>ZERO-TOLERANCE BUMPING POLICY:</strong> Intentional ramming, bumping, or hazardous driving results in immediate disqualification and ejection from the circuit on first warning without refund.
        </div>
        <div class="clause-item">
          <strong>3. VOLUNTARY ASSUMPTION OF INHERENT OPERATIONAL RISKS:</strong> The participant and their guardian knowingly, voluntarily, and freely assume all inherent risks associated with high-speed motorized karting, trampoline jumping, collisions, vehicle rollover, mechanical failures, falls, fractures, sprains, disability, spinal injury, or fatal injury. The participant hereby forever releases, discharges, defends, and indemnifies Fun Strikes Entertainment LLP, its affiliates, track marshals, safety stewards, employees, and agents from any and all legal suits, damages, or liabilities.
        </div>
        <div class="clause-item">
          <strong>4. CUSTOMER PROPERTY DAMAGE &amp; EQUIPMENT BREAKAGE LIABILITY:</strong> Any physical damage, breakage, loss, or impairment caused to go-karts, engines, chassis, safety barriers, trampolines, foam pit, safety gear, or venue property resulting from reckless conduct, disobeying track marshals, or rule violations must be paid in full by the customer as assessed by management before departing the facility premises.
        </div>
        <div class="clause-item">
          <strong>5. PROHIBITED SUBSTANCES, INTOXICATION &amp; LOOSE ARTICLES POLICY:</strong> Possession or consumption of alcohol, narcotics, drugs, or smoking/vaping is strictly prohibited on the premises. Persons suspected of being under the influence will be denied track access immediately. Mobile phones, cameras, selfie sticks, and loose items are prohibited while driving or jumping.
        </div>
      </div>

      <div class="info-callout">
        <strong>MANDATORY PRE-RACE BRIEFING &amp; EQUIPMENT ATTESTATION:</strong> All participants have undergone the compulsory safety orientation, had personal protective gear verified by marshals, and agreed to obey active track flags (Yellow = Slow down / No passing, Red = Complete immediate stop, Checkered = Return to pit lane at walking pace).
      </div>

      <table class="checklist-table">
        <tr>
          <td><span class="check-box-icon">&#10003;</span> Helmet Sized &amp; Strapped</td>
          <td><span class="check-box-icon">&#10003;</span> Closed Shoes Inspected</td>
          <td><span class="check-box-icon">&#10003;</span> Height &ge; 5'5" Confirmed</td>
          <td><span class="check-box-icon">&#10003;</span> Track Flags Briefing Understood</td>
        </tr>
      </table>

      <div class="continuation-banner">
        <span>NOTICE: CONTINUED ON PAGE 2 FOR LEGAL COVENANTS, PAYMENT POLICY &amp; BINDING SIGNATURE</span>
        <span>PLEASE TURN OVER &rarr;</span>
      </div>
    </div>

    <footer class="page-footer">
      <span class="page-footer-left">Fun Strikes Entertainment LLP</span>
      <span class="page-footer-center">Made with &#10084; by Aryan and NexoraOneSolution</span>
      <span class="page-footer-right">Ref: ${escapeHtml(r.refCode || "FS")} &bull; Page 1 of 2</span>
    </footer>
  </div>

  <!-- PAGE 2 OF 2 -->
  <div class="sheet-page">
    <div class="page-content-wrapper">
      <table class="header-table">
        <tr>
          <td class="logo-cell"><img src="data:image/png;base64,${logoBase64}" class="logo-img" alt="Fun Strike Logo"></td>
          <td class="title-cell" style="text-align: left; padding-left: 12px !important;">
            <div class="company-title" style="font-size: 11pt;">FUN STRIKES ENTERTAINMENT LLP &mdash; LEGAL COVENANTS</div>
            <div class="company-sub">Participant Waiver, Indemnity Contract &amp; Binding Execution (Schedule III Continued)</div>
          </td>
          <td style="text-align: right; width: 35%; font-family: Arial, sans-serif; font-size: 7.5pt; color: #475569;">
            <div><strong>DOCUMENT REF:</strong> ${escapeHtml(r.refCode || "FS-RECORD")}</div>
            <div style="word-break: break-word;">Primary Signer: <strong>${escapeHtml(r.fullName || "Signer")}</strong></div>
            <div>Date of Execution: <strong>${escapeHtml(r.timestamp ? String(r.timestamp).split(' ')[0] : '16-11-2026')}</strong></div>
          </td>
        </tr>
      </table>

      <div class="section-title">
        <span>Schedule III (Part B): Legally Binding Terms, Covenants &amp; Operational Regulations</span>
        <span>ENFORCEABLE LEGAL CONTRACT</span>
      </div>

      <div class="clauses-container">
        <div class="clause-item highlight-clause">
          <strong>6. STRICT 100% NON-REFUNDABLE &amp; NON-TRANSFERABLE PAYMENT POLICY:</strong> All ticket fees, admissions, and session charges are <strong>STRICTLY 100% NON-REFUNDABLE AND NON-TRANSFERABLE</strong> once paid. No refunds, credits, chargebacks, or date transfers shall be granted if a participant voluntarily withdraws, claims they "did not have fun", is disqualified or ejected for safety violations, fails height/attire checks, or in the event of equipment downtime or rain/weather interruptions.
        </div>
        <div class="clause-item">
          <strong>7. MEDICAL FITNESS WARRANTY &amp; HEALTH RESTRICTIONS:</strong> The participant warrants that all covered participants are in sound physical and psychological health. Participation is strictly prohibited for individuals who are pregnant, suffer from hypertension, cardiovascular disorders, neck/back/spinal impairments, epilepsy, recent surgical operations, or who are impaired by alcohol, narcotics, or medications.
        </div>
        <div class="clause-item">
          <strong>8. CCTV SURVEILLANCE, SECURITY &amp; MEDIA RELEASE:</strong> The facility operates under continuous 24/7 CCTV surveillance. The participant grants Fun Strikes Entertainment LLP irrevocable permission to record, store, and utilize photographs and video recordings for venue security, promotional broadcasts, and safety investigations without monetary claim.
        </div>
        <div class="clause-item">
          <strong>9. EMERGENCY MEDICAL AUTHORIZATION &amp; FIRST AID CONSENT:</strong> In the event of injury, acute illness, or accident, the signer hereby authorizes Fun Strikes Entertainment LLP marshals and designated medical personnel to administer necessary first aid and, if warranted, arrange transport to the nearest medical emergency facility at the customer's sole financial expense.
        </div>
        <div class="clause-item">
          <strong>10. INDEMNIFICATION, DEFENSE &amp; HOLD HARMLESS COVENANT:</strong> The signer covenants and agrees to indemnify, hold harmless, and defend Fun Strikes Entertainment LLP, its designated partners, directors, track stewards, marshals, and staff from any third-party claims, property losses, or liabilities arising directly or indirectly from the participant's actions or breach of track rules.
        </div>
        <div class="clause-item">
          <strong>11. SPEED GOVERNOR TAMPERING &amp; PIT LANE CONDUCT:</strong> Any customer attempting to tamper with kart engines, governor cables, tire barriers, or safety switches will be permanently barred from the facility. Drivers must enter the pit lane at walking pace only; spinning out in the pit lane will result in automatic termination of track privileges.
        </div>
        <div class="clause-item">
          <strong>12. GOVERNING JURISDICTION, SEVERABILITY &amp; DIGITAL ADMISSIBILITY:</strong> This agreement is governed exclusively by the laws of India. Any legal dispute or proceeding arising out of or related to this waiver shall be instituted exclusively in the competent courts having jurisdiction over Surat, Gujarat, India. Pursuant to Sections 4 and 10A of the Information Technology Act, 2000, this digital signature and electronic contract hold full legal validity and admissibility.
        </div>
      </div>

      <div class="declaration-box">
        <strong>SOLEMN AFFIRMATION &amp; LEGAL DECLARATION BY PRIMARY SIGNER / LEGAL GUARDIAN:</strong><br>
        I, the undersigned participant, parent, or lawful legal guardian, do hereby solemnly declare under penalty of perjury under Indian law that I am at least 18 years of age, and all personal details, identification records, and participant schedules set forth in Schedules I &amp; II are true, correct, and complete. I have thoroughly read, fully understood, and freely agreed to all operational safety directives, liability indemnities, risk assumption clauses, and non-refundable payment conditions. I hereby execute this instrument intending to be legally bound thereby on behalf of myself and all covered minors/dependents.
      </div>

      <div class="signature-grid">
        <div class="sig-col-left">
          <div style="font-size: 7.4pt; font-weight: bold; text-transform: uppercase; color: #475569; font-family: Arial, sans-serif;">
            Signature of Driver / Parent / Legal Guardian:
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
            <span class="audit-label">Terms &amp; 18+ Ack:</span>
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

      <div class="marshal-strip">
        <div>
          <strong>COUNTER MARSHAL CHECK:</strong>
          <span>Safety Helmet Buckled &bull; Closed-Toe Shoes &bull; Height Verified &ge; 5'5" &bull; Wristbands Issued (${totalCount})</span>
        </div>
        <div class="marshal-status-badge">STATUS: CLEARED FOR TRACK</div>
      </div>
    </div>

    <footer class="page-footer">
      <span class="page-footer-left">Fun Strikes Entertainment LLP</span>
      <span class="page-footer-center">Made with &#10084; by Aryan and NexoraOneSolution</span>
      <span class="page-footer-right">Ref: ${escapeHtml(r.refCode || "FS")} &bull; Page 2 of 2</span>
    </footer>
  </div>
</body>
</html>`;
}

// Test cases
const testSuites = [
  {
    name: '1-rider',
    riders: [
      '1. Aarav Harshvardhansinh Sharma | 1996-04-12 | 30 yrs (adult) | Primary Signer'
    ]
  },
  {
    name: '5-riders',
    riders: [
      '1. Aarav Harshvardhansinh Sharma | 1996-04-12 | 30 yrs (adult) | Primary Signer',
      '2. Rohan Aarav Sharma | 2012-08-15 | 14 yrs (minor) | Family / Son',
      '3. Priya Aarav Sharma | 2015-02-20 | 11 yrs (minor) | Family / Daughter',
      '4. Vivek Vikramaditya Chudasama-Rathore | 1991-06-10 | 35 yrs (adult) | Brother / Guest',
      '5. Meenakshi Suryavanshi-Deshmukh | 1994-11-25 | 32 yrs (adult) | Sister-in-law'
    ]
  },
  {
    name: '10-riders',
    riders: [
      '1. Aarav Harshvardhansinh Sharma | 1996-04-12 | 30 yrs (adult) | Primary Signer',
      '2. Rohan Aarav Sharma | 2012-08-15 | 14 yrs (minor) | Family / Son',
      '3. Priya Aarav Sharma | 2015-02-20 | 11 yrs (minor) | Family / Daughter',
      '4. Vivek Vikramaditya Chudasama-Rathore | 1991-06-10 | 35 yrs (adult) | Brother / Guest',
      '5. Meenakshi Suryavanshi-Deshmukh | 1994-11-25 | 32 yrs (adult) | Sister-in-law',
      '6. Harshvardhan Jaideepsinh Solanki | 2008-03-14 | 18 yrs (adult) | Cousin',
      '7. Ananya Devendrasingh Jhala | 2014-07-22 | 12 yrs (minor) | Niece',
      '8. Rajveer Mahendrasingh Parmar | 2005-09-09 | 21 yrs (adult) | Friend',
      '9. Kripalsinh Digvijaysinh Jadeja | 2000-12-01 | 26 yrs (adult) | Friend',
      '10. Shivendrasinh Yuvrajsinh Vaghela | 1998-05-18 | 28 yrs (adult) | Friend'
    ]
  },
  {
    name: '20-riders',
    riders: [
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
    ]
  }
];

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

testSuites.forEach(ts => {
  const record = {
    refCode: 'FS-TEST-' + ts.name.toUpperCase(),
    fullName: 'Aarav Harshvardhansinh Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    dob: '1996-04-12',
    ageRole: 'Adult (30 yrs)',
    heightInches: 66,
    address: '102, Shivalik Heights, Gauravpath Road, Pal, Surat, Gujarat - 395009',
    branch: 'Gauravpath Road, Pal, Surat',
    activity: 'Go-Karting Track (18+)',
    allRiders: ts.riders.join('\n'),
    signatureDataUrl: sampleSig,
    timestamp: '16-11-2026 05:15:30 PM'
  };

  const html = buildPrintableHtml(record);
  const htmlFile = `E:/Aryan/fun-strikes-waiver/printables/test-${ts.name}.html`;
  const pdfFile = `E:/Aryan/fun-strikes-waiver/printables/test-${ts.name}.pdf`;
  const pngFile = `E:/Aryan/fun-strikes-waiver/printables/test-${ts.name}-preview.png`;

  fs.writeFileSync(htmlFile, html, 'utf8');

  const htmlUri = 'file:///' + path.resolve(htmlFile).replace(/\\/g, '/');

  execSync(`"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFile}" "${htmlUri}"`, { stdio: 'ignore' });
  execSync(`"${chromePath}" --headless --disable-gpu --window-size=950,2250 --screenshot="${pngFile}" "${htmlUri}"`, { stdio: 'ignore' });

  const pdfBuf = fs.readFileSync(pdfFile);
  const pages = (pdfBuf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
  console.log(`Suite [${ts.name}]: PDF Pages = ${pages}`);
});

module.exports = { buildPrintableHtml };
