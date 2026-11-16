const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logoBase64 = fs.readFileSync('E:/Aryan/fun-strikes-waiver/assets/funstrike-logo.png').toString('base64');
const sigBase64 = fs.readFileSync('E:/Aryan/fun-strikes-waiver/printables/sample-sig.txt', 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fun Strike! Go-Karting Track Waiver - Official Print Record</title>
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
      font-size: 8.8pt;
      line-height: 1.35;
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

    /* EACH PAGE IS ITS OWN CLOSED, FULL-PAGE A4 CONTAINER */
    .sheet-page {
      width: 100%;
      max-width: 190mm;
      border: 1.5px solid #0f172a;
      padding: 8mm 10mm;
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
      gap: 7px;
      flex: 1 1 auto;
    }

    /* HEADER */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 2px;
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
      padding: 0 8px !important;
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

    /* META BAR */
    .meta-bar {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-collapse: collapse;
      font-size: 7.8pt;
      font-family: Arial, sans-serif;
    }
    .meta-bar td {
      padding: 3.5px 6px;
      border: 1px solid #cbd5e1;
    }

    /* SECTION HEADERS */
    .section-title {
      background: #0f172a;
      color: #ffffff;
      padding: 3.5px 8px;
      font-size: 8.2pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1px;
    }
    .section-title span:last-child {
      font-size: 7.2pt;
      font-weight: normal;
      color: #cbd5e1;
    }

    /* DATA TABLES */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    .data-table th, .data-table td {
      border: 1px solid #cbd5e1;
      padding: 3.5px 6px;
      text-align: left;
    }
    .data-table th {
      background: #f1f5f9;
      font-weight: bold;
      font-size: 7.5pt;
      text-transform: uppercase;
      color: #334155;
    }
    .label-cell {
      width: 23%;
      font-weight: bold;
      background: #f8fafc;
      color: #334155;
      font-size: 7.5pt;
      text-transform: uppercase;
    }
    .value-cell {
      width: 27%;
    }

    /* BADGES */
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

    /* LEGAL CLAUSES */
    .clauses-container {
      display: flex;
      flex-direction: column;
      gap: 5.5px;
    }
    .clause-item {
      font-size: 8.2pt;
      text-align: justify;
      line-height: 1.34;
    }
    .clause-item strong {
      color: #0f172a;
    }
    .highlight-clause {
      background: #fff1f2;
      border-left: 3px solid #e11d48;
      padding: 5px 8px;
      border-top: 1px solid #ffe4e6;
      border-bottom: 1px solid #ffe4e6;
      border-right: 1px solid #ffe4e6;
    }

    /* ATTESTATION / BRIEFING BOX */
    .info-callout {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      padding: 5px 8px;
      font-size: 7.8pt;
      line-height: 1.3;
    }
    .info-callout strong {
      color: #0f172a;
    }

    /* SAFETY CHECKLIST TABLE */
    .checklist-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.6pt;
      font-family: Arial, sans-serif;
      margin-top: 1px;
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

    /* CONTINUATION BANNER */
    .continuation-banner {
      border: 1px dashed #64748b;
      background: #f8fafc;
      padding: 4px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 7.5pt;
      font-weight: bold;
      color: #334155;
    }

    /* DECLARATION BOX */
    .declaration-box {
      border: 1.2px solid #0f172a;
      background: #fafaf9;
      padding: 7px 10px;
      font-size: 8.2pt;
      line-height: 1.36;
      text-align: justify;
    }

    /* SIGNATURE BLOCK */
    .signature-grid {
      display: flex;
      width: 100%;
      border: 1.2px solid #0f172a;
      background: #ffffff;
    }
    .sig-col-left {
      width: 58%;
      border-right: 1.2px solid #0f172a;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sig-col-right {
      width: 42%;
      padding: 8px 12px;
      background: #f8fafc;
      font-size: 7.6pt;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 5px;
    }
    .sig-img {
      max-height: 54px;
      max-width: 100%;
      object-fit: contain;
      display: block;
      margin: 4px auto;
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

    /* MARSHAL TRACK CLEARANCE STRIP */
    .marshal-strip {
      border: 1.5px solid #166534;
      background: #f0fdf4;
      padding: 7px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 7.6pt;
    }
    .marshal-status-badge {
      background: #166534;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 8pt;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    /* 3-PART FOOTER (LEFT | CENTER | RIGHT) */
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
      margin-top: 4px;
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
    <span>OFFICIAL LEGAL RECORD: Ref <strong>FS-QM4B9Z</strong> &bull; Aarav Sharma (4 Participants)</span>
    <button class="print-btn" onclick="window.print()">Print Legal Document (2 Pages)</button>
  </div>

  <!-- ==================== PAGE 1 OF 2 ==================== -->
  <div class="sheet-page">
    <div class="page-content-wrapper">
      
      <!-- HEADER -->
      <table class="header-table">
        <tr>
          <td class="logo-cell">
            <img src="data:image/png;base64,${logoBase64}" class="logo-img" alt="Fun Strike Logo">
          </td>
          <td class="title-cell">
            <div class="company-title">FUN STRIKES ENTERTAINMENT LLP</div>
            <div class="company-sub">Registered LLP under Indian Limited Liability Partnership Act, 2008 &bull; Surat, Gujarat, India</div>
            <div class="doc-main-heading">PARTICIPANT LIABILITY WAIVER, INDEMNITY AGREEMENT & RULES OF OPERATION</div>
          </td>
        </tr>
      </table>

      <!-- METADATA BAR -->
      <table class="meta-bar">
        <tr>
          <td><strong>ZONE:</strong> GO-KARTING SPEEDWAY (18+)</td>
          <td><strong>BRANCH:</strong> Gauravpath Road, Pal, Surat (Gujarat)</td>
          <td><strong>TOTAL PARTICIPANTS:</strong> 4 DRIVERS</td>
          <td><strong>DOCUMENT REF:</strong> FS-QM4B9Z</td>
        </tr>
      </table>

      <!-- SCHEDULE I: PRIMARY SIGNER -->
      <div class="section-title">
        <span>Schedule I: Primary Signer &amp; Legal Guardian Identification</span>
        <span>FORM FS-W9</span>
      </div>
      <table class="data-table">
        <tr>
          <td class="label-cell">Primary Signer:</td>
          <td class="value-cell"><strong>Aarav Sharma</strong></td>
          <td class="label-cell">Verified Mobile:</td>
          <td class="value-cell"><strong>+91 98765 43210</strong></td>
        </tr>
        <tr>
          <td class="label-cell">Date of Birth &amp; Age:</td>
          <td class="value-cell">1996-04-12 (30 Years, Adult)</td>
          <td class="label-cell">Official Email:</td>
          <td class="value-cell">aarav.sharma@example.com</td>
        </tr>
        <tr>
          <td class="label-cell">Height Verification:</td>
          <td class="value-cell"><strong>66 in / 168 cm (Verified &ge; 5'5")</strong></td>
          <td class="label-cell">Signed By / Role:</td>
          <td class="value-cell">Aarav Sharma (Self &amp; Legal Guardian)</td>
        </tr>
        <tr>
          <td class="label-cell">Residential Address:</td>
          <td class="value-cell" colspan="3">102, Shivalik Heights, Gauravpath Road, Pal, Surat, Gujarat - 395009</td>
        </tr>
      </table>

      <!-- SCHEDULE II: COVERED PARTICIPANTS -->
      <div class="section-title">
        <span>Schedule II: Schedule of Covered Participants &amp; Dependents (4)</span>
        <span>INDIVIDUAL ACKNOWLEDGEMENT</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 5%; text-align: center;">#</th>
            <th style="width: 35%;">Full Legal Name of Participant</th>
            <th style="width: 18%; text-align: center;">Date of Birth</th>
            <th style="width: 20%; text-align: center;">Age &amp; Category</th>
            <th style="width: 22%;">Relationship to Signer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center; font-weight: bold;">1</td>
            <td><strong>Aarav Sharma</strong></td>
            <td style="text-align: center;">1996-04-12</td>
            <td style="text-align: center;"><span class="badge badge-adult">ADULT</span> 30 yrs</td>
            <td><span class="badge badge-primary">PRIMARY SIGNER</span></td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: bold;">2</td>
            <td><strong>Rohan Sharma</strong></td>
            <td style="text-align: center;">2012-08-15</td>
            <td style="text-align: center;"><span class="badge badge-minor">MINOR</span> 14 yrs</td>
            <td>Family / Child (Son)</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: bold;">3</td>
            <td><strong>Priya Sharma</strong></td>
            <td style="text-align: center;">2015-02-20</td>
            <td style="text-align: center;"><span class="badge badge-minor">MINOR</span> 11 yrs</td>
            <td>Family / Child (Daughter)</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: bold;">4</td>
            <td><strong>Vivek Sharma</strong></td>
            <td style="text-align: center;">1991-06-10</td>
            <td style="text-align: center;"><span class="badge badge-adult">ADULT</span> 35 yrs</td>
            <td>Brother / Adult Guest</td>
          </tr>
        </tbody>
      </table>

      <!-- SCHEDULE III (PART A): SAFETY REGULATIONS -->
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

      <!-- MANDATORY PRE-ACTIVITY ATTESTATION -->
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

      <!-- CONTINUATION NOTICE -->
      <div class="continuation-banner">
        <span>NOTICE: CONTINUED ON PAGE 2 FOR LEGAL COVENANTS, PAYMENT POLICY &amp; BINDING SIGNATURE</span>
        <span>PLEASE TURN OVER &rarr;</span>
      </div>

    </div>

    <!-- PAGE 1 FOOTER -->
    <footer class="page-footer">
      <span class="page-footer-left">Fun Strikes Entertainment LLP</span>
      <span class="page-footer-center">Made with &#10084; by Aryan and NexoraOneSolution</span>
      <span class="page-footer-right">Ref: FS-QM4B9Z &bull; Page 1 of 2</span>
    </footer>
  </div>

  <!-- ==================== PAGE 2 OF 2 ==================== -->
  <div class="sheet-page">
    <div class="page-content-wrapper">
      
      <!-- CONTINUATION HEADER -->
      <table class="header-table">
        <tr>
          <td class="logo-cell">
            <img src="data:image/png;base64,${logoBase64}" class="logo-img" alt="Fun Strike Logo">
          </td>
          <td class="title-cell" style="text-align: left; padding-left: 12px !important;">
            <div class="company-title" style="font-size: 11pt;">FUN STRIKES ENTERTAINMENT LLP &mdash; LEGAL COVENANTS</div>
            <div class="company-sub">Participant Waiver, Indemnity Contract &amp; Binding Execution (Schedule III Continued)</div>
          </td>
          <td style="text-align: right; width: 35%; font-family: Arial, sans-serif; font-size: 7.5pt; color: #475569;">
            <div><strong>DOCUMENT REF:</strong> FS-QM4B9Z</div>
            <div>Primary Signer: <strong>Aarav Sharma</strong></div>
            <div>Date of Execution: <strong>16-11-2026</strong></div>
          </td>
        </tr>
      </table>

      <!-- SCHEDULE III (PART B): LEGAL & PAYMENT COVENANTS -->
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

      <!-- SOLEMN AFFIRMATION & DECLARATION -->
      <div class="declaration-box">
        <strong>SOLEMN AFFIRMATION &amp; LEGAL DECLARATION BY PRIMARY SIGNER / LEGAL GUARDIAN:</strong><br>
        I, the undersigned participant, parent, or lawful legal guardian, do hereby solemnly declare under penalty of perjury under Indian law that I am at least 18 years of age, and all personal details, identification records, and participant schedules set forth in Schedules I &amp; II are true, correct, and complete. I have thoroughly read, fully understood, and freely agreed to all operational safety directives, liability indemnities, risk assumption clauses, and non-refundable payment conditions. I hereby execute this instrument intending to be legally bound thereby on behalf of myself and all covered minors/dependents.
      </div>

      <!-- SIGNATURE & AUDIT BLOCK -->
      <div class="signature-grid">
        <div class="sig-col-left">
          <div style="font-size: 7.4pt; font-weight: bold; text-transform: uppercase; color: #475569; font-family: Arial, sans-serif;">
            Signature of Driver / Parent / Legal Guardian:
          </div>
          <div style="text-align: center; margin: 4px 0;">
            <img src="${sigBase64}" class="sig-img" alt="Digital Signature">
          </div>
          <div style="border-top: 1px solid #0f172a; padding-top: 3px;">
            <strong style="font-size: 8.5pt;">Aarav Sharma</strong> <span style="font-size: 7.5pt; color: #64748b;">(Primary Signer &amp; Guardian)</span>
          </div>
        </div>
        <div class="sig-col-right">
          <div class="audit-row">
            <span class="audit-label">Execution Date:</span>
            <span class="audit-val">16-11-2026</span>
          </div>
          <div class="audit-row">
            <span class="audit-label">Submission Time:</span>
            <span class="audit-val">05:15:30 PM IST</span>
          </div>
          <div class="audit-row">
            <span class="audit-label">Terms &amp; 18+ Ack:</span>
            <span class="audit-val" style="color: #166534;">CONFIRMED &amp; AGREED</span>
          </div>
          <div class="audit-row">
            <span class="audit-label">Security Audit Hash:</span>
            <span class="audit-val" style="font-family: monospace; font-size: 7.2pt;">FS-QM4B9Z-SEC-OK</span>
          </div>
          <div class="audit-row" style="border-bottom: none;">
            <span class="audit-label">IT Act 2000 Status:</span>
            <span class="audit-val" style="color: #166534;">&sect; 4 &amp; 10A ADMISSIBLE</span>
          </div>
        </div>
      </div>

      <!-- COUNTER MARSHAL TRACK CLEARANCE STRIP -->
      <div class="marshal-strip">
        <div>
          <strong>COUNTER MARSHAL CHECK:</strong>
          <span>Safety Helmet Buckled &bull; Closed-Toe Shoes &bull; Height Verified &ge; 5'5" &bull; Wristband #4081-84 Issued</span>
        </div>
        <div class="marshal-status-badge">STATUS: CLEARED FOR TRACK</div>
      </div>

    </div>

    <!-- PAGE 2 FOOTER -->
    <footer class="page-footer">
      <span class="page-footer-left">Fun Strikes Entertainment LLP</span>
      <span class="page-footer-center">Made with &#10084; by Aryan and NexoraOneSolution</span>
      <span class="page-footer-right">Ref: FS-QM4B9Z &bull; Page 2 of 2</span>
    </footer>
  </div>

</body>
</html>
`;

fs.writeFileSync('E:/Aryan/fun-strikes-waiver/printables/test-waiver.html', html, 'utf8');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const htmlUri = 'file:///' + path.resolve('E:/Aryan/fun-strikes-waiver/printables/test-waiver.html').replace(/\\/g, '/');
const outPdf = path.resolve('E:/Aryan/fun-strikes-waiver/printables/Fun-Strike-Signed-Waiver-Print-Demo.pdf');
const outPng = path.resolve('E:/Aryan/fun-strikes-waiver/printables/page1-preview.png');

console.log('Generating PDF via Chrome...');
execSync(`"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${outPdf}" "${htmlUri}"`, { stdio: 'inherit' });

console.log('Capturing screenshot of Page 1 and Page 2...');
execSync(`"${chromePath}" --headless --disable-gpu --window-size=950,2250 --screenshot="${outPng}" "${htmlUri}"`, { stdio: 'inherit' });

console.log('Done! Checking PDF...');
const pdfBuffer = fs.readFileSync(outPdf);
const matches = pdfBuffer.toString('latin1').match(/\/Type\s*\/Page\b/g);
console.log('Total PDF Page Count:', matches ? matches.length : 'unknown');
