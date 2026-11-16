const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const QRCode = require('E:/Aryan/nexoraone-certify/node_modules/qrcode');

const BASE_DIR = 'E:/Aryan/fun-strikes-waiver';
const LOGO_PATH = path.join(BASE_DIR, 'assets', 'funstrike-logo.png');
const QR_DIR = path.join(BASE_DIR, 'assets', 'qr');

const PAL_GOKART_URL = 'https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-gokart';
const PAL_TRAMPOLINE_URL = 'https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-trampoline';
const MV_TRAMPOLINE_URL = 'https://funstrikes24-cloud.github.io/fun-strike-waiver/motavarachha-softplay';

async function generate() {
  const logoBase64 = fs.readFileSync(LOGO_PATH).toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  // High-DPI PNG QR codes (600 DPI quality) for assets
  const pngs = [
    { file: 'qr-pal-gokart.png', url: PAL_GOKART_URL },
    { file: 'qr-gokart.png', url: PAL_GOKART_URL },
    { file: 'qr-pal-trampoline.png', url: PAL_TRAMPOLINE_URL },
    { file: 'qr-trampoline.png', url: PAL_TRAMPOLINE_URL },
    { file: 'qr-softplay.png', url: PAL_TRAMPOLINE_URL },
    { file: 'qr-motavarachha-softplay.png', url: MV_TRAMPOLINE_URL }
  ];

  for (const p of pngs) {
    await QRCode.toFile(path.join(QR_DIR, p.file), p.url, {
      width: 800,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#0a0f1d', light: '#ffffff' }
    });
  }
  console.log('High-DPI PNG QR codes saved in assets/qr/');

  // High-precision vector SVG QR codes with Error Correction Level H (30%)
  const palGokartSvg = await QRCode.toString(PAL_GOKART_URL, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: '#090d16', light: '#ffffff' }
  });

  const palTrampolineSvg = await QRCode.toString(PAL_TRAMPOLINE_URL, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: '#090d16', light: '#ffffff' }
  });

  const mvTrampolineSvg = await QRCode.toString(MV_TRAMPOLINE_URL, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: '#090d16', light: '#ffffff' }
  });

  // Photo Paper CSS with ultra-crisp print-color-adjust and rich contrast
  const photoPaperCss = `
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      image-rendering: -webkit-optimize-contrast;
    }
    html, body {
      width: 210mm;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 8mm 10mm 7mm;
      box-sizing: border-box;
      background: #ffffff;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
      overflow: hidden;
    }
    .page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    /* Outer Standee Border Frame */
    .standee-frame {
      width: 100%;
      height: 100%;
      border-radius: 20px;
      padding: 10px 14px 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    /* Branded Header */
    .venue-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 14px;
      padding: 8px 14px;
      background: #090e1a;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .venue-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      width: 58px;
      height: 58px;
      object-fit: contain;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
    }
    .brand-text h1 {
      font-size: 20px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.3px;
      line-height: 1.15;
    }
    .brand-text .sub {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-top: 2px;
    }
    .venue-meta {
      text-align: right;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.35;
    }
    .venue-meta strong {
      color: #f8fafc;
      font-size: 12px;
      letter-spacing: 0.3px;
    }

    /* Hero Standee Title */
    .hero-title-box {
      text-align: center;
      margin: 4px 0 2px;
    }
    .hero-badge {
      display: inline-block;
      color: #ffffff;
      font-size: 12.5px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1.6px;
      padding: 5px 22px;
      border-radius: 30px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.12);
      margin-bottom: 5px;
    }
    .hero-h2 {
      font-size: 33px;
      font-weight: 900;
      letter-spacing: -0.5px;
      line-height: 1.1;
      text-transform: uppercase;
    }
    .hero-p {
      font-size: 13.5px;
      color: #475569;
      max-width: 580px;
      margin: 3px auto 0;
      font-weight: 600;
    }

    /* QR Center Card for Photo Paper */
    .qr-card {
      border-radius: 22px;
      padding: 14px 18px 12px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .qr-target-wrap {
      background: #ffffff;
      border-radius: 18px;
      padding: 14px;
      width: 275px;
      height: 275px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 28px rgba(0,0,0,0.14);
      position: relative;
    }
    .qr-svg-box {
      width: 100%;
      height: 100%;
    }
    .qr-svg-box svg {
      width: 100%;
      height: 100%;
      shape-rendering: crispEdges;
    }

    /* Scanner Corner Crosshair Accents */
    .scan-corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: #0f172a;
      border-style: solid;
      pointer-events: none;
    }
    .scan-corner.tl { top: 6px; left: 6px; border-width: 3.5px 0 0 3.5px; border-top-left-radius: 6px; }
    .scan-corner.tr { top: 6px; right: 6px; border-width: 3.5px 3.5px 0 0; border-top-right-radius: 6px; }
    .scan-corner.bl { bottom: 6px; left: 6px; border-width: 0 0 3.5px 3.5px; border-bottom-left-radius: 6px; }
    .scan-corner.br { bottom: 6px; right: 6px; border-width: 0 3.5px 3.5px 0; border-bottom-right-radius: 6px; }

    .scan-cta-text {
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      display: block;
      margin-top: 10px;
    }
    .scan-sub-text {
      font-size: 12.5px;
      color: #475569;
      margin-top: 2px;
      font-weight: 600;
      display: block;
    }
    .url-chip {
      margin-top: 6px;
      background: #ffffff;
      border-radius: 10px;
      padding: 4px 14px;
      font-size: 12px;
      font-family: monospace;
      font-weight: 700;
      display: inline-block;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }

    /* 3-Step Flow Row */
    .steps-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 8px 12px;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .step-num {
      width: 28px;
      height: 28px;
      color: #fff;
      font-weight: 900;
      font-size: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.18);
    }
    .step-content {
      font-size: 11px;
      color: #334155;
      line-height: 1.3;
    }
    .step-content strong {
      display: block;
      color: #0f172a;
      font-size: 12px;
    }

    /* Safety & Rules Checklist */
    .rules-card {
      background: #ffffff;
      border-radius: 14px;
      padding: 9px 14px;
    }
    .rules-header {
      font-size: 12px;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .rules-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px 18px;
      font-size: 11px;
      color: #1e293b;
      line-height: 1.35;
    }

    /* Footer */
    .venue-footer {
      border-top: 1.5px solid #e2e8f0;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }
    .venue-footer strong {
      color: #0f172a;
    }
  `;

  // ===================================================
  // 1. PAL — GO-KARTING (18+) PHOTO PAPER STANDEE
  // ===================================================
  const palGokartHtml = `
    <div class="page" id="page-pal-gokart">
      <div class="standee-frame" style="border: 3px solid #be123c; background: linear-gradient(180deg, #fffefe 0%, #fff5f5 100%);">
        
        <!-- Header Bar -->
        <header class="venue-header">
          <div class="venue-brand">
            <img src="${logoDataUri}" alt="Fun Strike! Logo" class="brand-logo" />
            <div class="brand-text">
              <h1>Fun Strikes Entertainment LLP</h1>
              <div class="sub" style="color: #fb7185;">📍 Pal Branch &bull; Go-Karting Track (18+)</div>
            </div>
          </div>
          <div class="venue-meta">
            <strong>Mandatory Driver Waiver</strong><br>
            Gauravpath Road, Pal (Surat)<br>
            funstrike.in
          </div>
        </header>

        <!-- Hero Title Box -->
        <div class="hero-title-box">
          <div class="hero-badge" style="background: linear-gradient(135deg, #e11d48, #be123c);">
            🏎️ Official Driver Registration &bull; Pit Lane
          </div>
          <h2 class="hero-h2" style="color: #be123c;">
            GO-KARTING WAIVER
          </h2>
          <p class="hero-p">
            Scan below with your phone camera &bull; E-sign driver agreement in 60 seconds before boarding.
          </p>
        </div>

        <!-- Center QR Card -->
        <div class="qr-card" style="background: linear-gradient(180deg, #fff5f5 0%, #ffe4e6 100%); border: 3px solid #e11d48; box-shadow: 0 12px 32px rgba(225, 29, 72, 0.16);">
          
          <div class="qr-target-wrap" style="border: 2px solid #fecdd3;">
            <div class="scan-corner tl" style="border-color: #be123c;"></div>
            <div class="scan-corner tr" style="border-color: #be123c;"></div>
            <div class="scan-corner bl" style="border-color: #be123c;"></div>
            <div class="scan-corner br" style="border-color: #be123c;"></div>
            <div class="qr-svg-box">
              ${palGokartSvg}
            </div>
          </div>

          <span class="scan-cta-text" style="color: #9f1239;">
            📷 POINT PHONE CAMERA TO SCAN
          </span>
          <span class="scan-sub-text">
            No app download required &bull; Works with iPhone &amp; Android Camera
          </span>
          <div class="url-chip" style="border: 1.5px solid #e11d48; color: #be123c;">
            ${PAL_GOKART_URL}
          </div>
        </div>

        <!-- Strict 18+ Sole Responsibility Banner -->
        <div style="background: #fee2e2; border: 2px solid #e11d48; border-radius: 12px; padding: 8px 14px; text-align: center; box-shadow: 0 3px 8px rgba(225, 29, 72, 0.08);">
          <strong style="color: #9f1239; font-size: 12.5px; text-transform: uppercase; display: block; margin-bottom: 2px; letter-spacing: 0.5px;">
            ⚠️ STRICT 18+ ADULT POLICY &amp; MINOR SOLE RESPONSIBILITY CLAUSE
          </strong>
          <p style="color: #881337; font-size: 11.5px; font-weight: 600; line-height: 1.35; margin: 0;">
            Go-Karting is designed for ages 18+. If you are under 18 and sign this waiver yourself, or drive without adult guardian supervision, <strong>ALL RESPONSIBILITY, INJURIES, DAMAGES, AND LIABILITIES REST 100% WITH YOU / YOUR PARENTS</strong>. Fun Strikes Entertainment LLP bears ZERO liability.
          </p>
        </div>

        <!-- 3-Step Flow -->
        <div class="steps-row">
          <div class="step-item">
            <div class="step-num" style="background: #e11d48;">1</div>
            <div class="step-content">
              <strong>1. Scan QR</strong>
              Open camera &amp; tap link
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: #e11d48;">2</div>
            <div class="step-content">
              <strong>2. Enter Drivers &amp; Sign</strong>
              Add up to 20 drivers on 1 form
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: #e11d48;">3</div>
            <div class="step-content">
              <strong>3. Show Pit Marshals</strong>
              Receive helmet &amp; start racing!
            </div>
          </div>
        </div>

        <!-- Track Safety Rules Checklist -->
        <div class="rules-card" style="border: 1.5px solid #cbd5e1; background: #f8fafc;">
          <div class="rules-header">
            <span>🏁 Essential Track Rules &amp; Safety Protocol</span>
            <span style="color: #be123c; font-size: 11px; font-weight: 800;">SAFETY FIRST</span>
          </div>
          <div class="rules-grid">
            <div>&bull; <strong>Min Height: 5'5" (165 cm):</strong> Required for single-kart drivers.</div>
            <div>&bull; <strong>Helmets Mandatory:</strong> Full-face helmet secured before boarding.</div>
            <div>&bull; <strong>Strictly No Bumping:</strong> Intentional ramming will stop session.</div>
            <div>&bull; <strong>Closed-Toe Shoes:</strong> No crocs, slippers, or bare feet on track.</div>
            <div>&bull; <strong>Tie Long Hair:</strong> Tie hair above shoulder; secure loose dupattas.</div>
            <div>&bull; <strong>Double-Seat Karts:</strong> Passenger min 40" (102 cm) with adult driver.</div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="venue-footer">
          <div>
            <strong>Fun Strikes Entertainment LLP</strong> &bull; Pal Branch (Gauravpath Road, Surat)
          </div>
          <div>
            Track Pit Desk: <strong>+91 76005 57671</strong> &bull; funstrike.in
          </div>
        </footer>

      </div>
    </div>
  `;

  // ===================================================
  // 2. PAL — SOFT PLAY & TRAMPOLINE PHOTO PAPER STANDEE
  // ===================================================
  const palTrampolineHtml = `
    <div class="page" id="page-pal-trampoline">
      <div class="standee-frame" style="border: 3px solid #0284c7; background: linear-gradient(180deg, #fffefe 0%, #f0f9ff 100%);">
        
        <!-- Header Bar -->
        <header class="venue-header">
          <div class="venue-brand">
            <img src="${logoDataUri}" alt="Fun Strike! Logo" class="brand-logo" />
            <div class="brand-text">
              <h1>Fun Strikes Entertainment LLP</h1>
              <div class="sub" style="color: #38bdf8;">📍 Pal Branch &bull; Soft Play &amp; Trampoline Arena</div>
            </div>
          </div>
          <div class="venue-meta">
            <strong>Mandatory Arena Waiver</strong><br>
            Gauravpath Road, Pal (Surat)<br>
            funstrike.in
          </div>
        </header>

        <!-- Hero Title Box -->
        <div class="hero-title-box">
          <div class="hero-badge" style="background: linear-gradient(135deg, #0284c7, #0369a1);">
            🤸 Official Jumper Registration &bull; Arena Entry
          </div>
          <h2 class="hero-h2" style="color: #0369a1;">
            TRAMPOLINE &amp; SOFT PLAY WAIVER
          </h2>
          <p class="hero-p">
            Scan below with your phone camera &bull; E-sign jumper waiver in 60 seconds before entering arena.
          </p>
        </div>

        <!-- Center QR Card -->
        <div class="qr-card" style="background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%); border: 3px solid #0284c7; box-shadow: 0 12px 32px rgba(2, 132, 199, 0.16);">
          
          <div class="qr-target-wrap" style="border: 2px solid #bae6fd;">
            <div class="scan-corner tl" style="border-color: #0284c7;"></div>
            <div class="scan-corner tr" style="border-color: #0284c7;"></div>
            <div class="scan-corner bl" style="border-color: #0284c7;"></div>
            <div class="scan-corner br" style="border-color: #0284c7;"></div>
            <div class="qr-svg-box">
              ${palTrampolineSvg}
            </div>
          </div>

          <span class="scan-cta-text" style="color: #075985;">
            📷 POINT PHONE CAMERA TO SCAN
          </span>
          <span class="scan-sub-text">
            No app download required &bull; Works with iPhone &amp; Android Camera
          </span>
          <div class="url-chip" style="border: 1.5px solid #0284c7; color: #0284c7;">
            ${PAL_TRAMPOLINE_URL}
          </div>
        </div>

        <!-- Anti-Slip Grip Socks Callout Banner -->
        <div style="background: #e0f2fe; border: 2px solid #0284c7; border-radius: 12px; padding: 8px 14px; text-align: center; box-shadow: 0 3px 8px rgba(2, 132, 199, 0.08);">
          <strong style="color: #075985; font-size: 12.5px; text-transform: uppercase; display: block; margin-bottom: 2px; letter-spacing: 0.5px;">
            🧦 ANTI-SLIP GRIP SOCKS MANDATORY &bull; ALL AGES &amp; FAMILIES WELCOME
          </strong>
          <p style="color: #0c4a6e; font-size: 11.5px; font-weight: 600; line-height: 1.35; margin: 0;">
            Approved trampoline grip socks must be worn at all times by all jumpers. Parents or adult guardians can register all accompanying children on a single waiver form in seconds.
          </p>
        </div>

        <!-- 3-Step Flow -->
        <div class="steps-row">
          <div class="step-item">
            <div class="step-num" style="background: #0284c7;">1</div>
            <div class="step-content">
              <strong>1. Scan QR</strong>
              Open camera &amp; tap link
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: #0284c7;">2</div>
            <div class="step-content">
              <strong>2. Add Jumpers &amp; Sign</strong>
              Parents sign for all kids on 1 form
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: #0284c7;">3</div>
            <div class="step-content">
              <strong>3. Show Check-In Desk</strong>
              Get grip socks &amp; start bouncing!
            </div>
          </div>
        </div>

        <!-- Arena Safety Rules Checklist -->
        <div class="rules-card" style="border: 1.5px solid #cbd5e1; background: #f8fafc;">
          <div class="rules-header">
            <span>🛡️ Pal Arena Safety Rules &amp; Bounce Protocol</span>
            <span style="color: #0284c7; font-size: 11px; font-weight: 800;">BOUNCE RESPONSIBLY</span>
          </div>
          <div class="rules-grid">
            <div>&bull; <strong>Grip Socks Mandatory:</strong> Anti-slip socks worn at all times.</div>
            <div>&bull; <strong>One Jumper Per Bed:</strong> Never double-bounce another person.</div>
            <div>&bull; <strong>Empty Pockets:</strong> No phones, keys, or sharp objects in arena.</div>
            <div>&bull; <strong>No Rough Flips:</strong> Backflips and inverted stunts prohibited.</div>
            <div>&bull; <strong>Supervise Under 10:</strong> Children under 10 must be accompanied.</div>
            <div>&bull; <strong>Foam Pit Safety:</strong> Feet-first entry only; never dive headfirst.</div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="venue-footer">
          <div>
            <strong>Fun Strikes Entertainment LLP</strong> &bull; Pal Branch (Gauravpath Road, Surat)
          </div>
          <div>
            Arena Desk: <strong>+91 76005 57671</strong> &bull; funstrike.in
          </div>
        </footer>

      </div>
    </div>
  `;

  // ===================================================
  // 3. MOTA VARACHHA — TRAMPOLINE PHOTO PAPER STANDEE
  // ===================================================
  const mvTrampolineHtml = `
    <div class="page" id="page-mv-trampoline">
      <div class="standee-frame" style="border: 3px solid #059669; background: linear-gradient(180deg, #fffefe 0%, #ecfdf5 100%);">
        
        <!-- Header Bar -->
        <header class="venue-header">
          <div class="venue-brand">
            <img src="${logoDataUri}" alt="Fun Strike! Logo" class="brand-logo" />
            <div class="brand-text">
              <h1>Fun Strikes Entertainment LLP</h1>
              <div class="sub" style="color: #34d399;">📍 Mota Varachha Branch &bull; Soft Play &amp; Trampoline</div>
            </div>
          </div>
          <div class="venue-meta">
            <strong>Mandatory Arena Waiver</strong><br>
            Mota Varachha, Surat<br>
            funstrike.in
          </div>
        </header>

        <!-- Hero Title Box -->
        <div class="hero-title-box">
          <div class="hero-badge" style="background: linear-gradient(135deg, #059669, #047857);">
            🤸 Official Jumper Registration &bull; Arena Entry
          </div>
          <h2 class="hero-h2" style="color: #047857;">
            TRAMPOLINE &amp; SOFT PLAY WAIVER
          </h2>
          <p class="hero-p">
            Scan below with your phone camera &bull; E-sign jumper waiver in 60 seconds before entering arena.
          </p>
        </div>

        <!-- Center QR Card -->
        <div class="qr-card" style="background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%); border: 3px solid #059669; box-shadow: 0 12px 32px rgba(5, 150, 105, 0.16);">
          
          <div class="qr-target-wrap" style="border: 2px solid #a7f3d0;">
            <div class="scan-corner tl" style="border-color: #059669;"></div>
            <div class="scan-corner tr" style="border-color: #059669;"></div>
            <div class="scan-corner bl" style="border-color: #059669;"></div>
            <div class="scan-corner br" style="border-color: #059669;"></div>
            <div class="qr-svg-box">
              ${mvTrampolineSvg}
            </div>
          </div>

          <span class="scan-cta-text" style="color: #065f46;">
            📷 POINT PHONE CAMERA TO SCAN
          </span>
          <span class="scan-sub-text">
            No app download required &bull; Works with iPhone &amp; Android Camera
          </span>
          <div class="url-chip" style="border: 1.5px solid #059669; color: #059669;">
            ${MV_TRAMPOLINE_URL}
          </div>
        </div>

        <!-- Anti-Slip Grip Socks Callout Banner -->
        <div style="background: #d1fae5; border: 2px solid #059669; border-radius: 12px; padding: 8px 14px; text-align: center; box-shadow: 0 3px 8px rgba(5, 150, 105, 0.08);">
          <strong style="color: #065f46; font-size: 12.5px; text-transform: uppercase; display: block; margin-bottom: 2px; letter-spacing: 0.5px;">
            🧦 ANTI-SLIP GRIP SOCKS MANDATORY &bull; ALL AGES &amp; FAMILIES WELCOME
          </strong>
          <p style="color: #064e3b; font-size: 11.5px; font-weight: 600; line-height: 1.35; margin: 0;">
            Approved trampoline grip socks must be worn at all times by all jumpers. Parents or adult guardians can register all accompanying children on a single waiver form in seconds.
          </p>
        </div>

        <!-- 3-Step Flow -->
        <div class="steps-row">
          <div class="step-item">
            <div class="step-num" style="background: #059669;">1</div>
            <div class="step-content">
              <strong>1. Scan QR</strong>
              Open camera &amp; tap link
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: #059669;">2</div>
            <div class="step-content">
              <strong>2. Add Jumpers &amp; Sign</strong>
              Parents sign for all kids on 1 form
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: #059669;">3</div>
            <div class="step-content">
              <strong>3. Show Check-In Desk</strong>
              Get grip socks &amp; start bouncing!
            </div>
          </div>
        </div>

        <!-- Arena Safety Rules Checklist -->
        <div class="rules-card" style="border: 1.5px solid #cbd5e1; background: #f8fafc;">
          <div class="rules-header">
            <span>🛡️ Mota Varachha Arena Rules &amp; Bounce Protocol</span>
            <span style="color: #059669; font-size: 11px; font-weight: 800;">BOUNCE RESPONSIBLY</span>
          </div>
          <div class="rules-grid">
            <div>&bull; <strong>Grip Socks Mandatory:</strong> Anti-slip socks worn at all times.</div>
            <div>&bull; <strong>One Jumper Per Bed:</strong> Never double-bounce another person.</div>
            <div>&bull; <strong>Empty Pockets:</strong> No phones, keys, or sharp objects in arena.</div>
            <div>&bull; <strong>No Rough Flips:</strong> Backflips and inverted stunts prohibited.</div>
            <div>&bull; <strong>Supervise Under 10:</strong> Children under 10 must be accompanied.</div>
            <div>&bull; <strong>Foam Pit Safety:</strong> Feet-first entry only; never dive headfirst.</div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="venue-footer">
          <div>
            <strong>Fun Strikes Entertainment LLP</strong> &bull; Mota Varachha Branch (Surat)
          </div>
          <div>
            Arena Desk: <strong>+91 76005 57671</strong> &bull; funstrike.in
          </div>
        </footer>

      </div>
    </div>
  `;

  // HTML templates for PDFs
  // 1. All Branches Master PDF (3 pages)
  const masterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fun Strike! QR Waiver Standees — Photo Paper Edition</title>
  <style>${photoPaperCss}</style>
</head>
<body>
  ${palGokartHtml}
  ${palTrampolineHtml}
  ${mvTrampolineHtml}
</body>
</html>`;

  // 2. Pal Go-Karting Single PDF
  const palGokartPdfHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Pal — Go-Karting Track Standee (18+) — Photo Paper Edition</title>
  <style>${photoPaperCss}</style>
</head>
<body>
  ${palGokartHtml}
</body>
</html>`;

  // 3. Pal Trampoline Single PDF
  const palTrampolinePdfHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Pal — Soft Play & Trampoline Standee — Photo Paper Edition</title>
  <style>${photoPaperCss}</style>
</head>
<body>
  ${palTrampolineHtml}
</body>
</html>`;

  // 4. Mota Varachha Trampoline Single PDF
  const mvTrampolinePdfHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Mota Varachha — Soft Play & Trampoline Standee — Photo Paper Edition</title>
  <style>${photoPaperCss}</style>
</head>
<body>
  ${mvTrampolineHtml}
</body>
</html>`;

  const files = [
    { html: masterHtml, htmlPath: path.join(BASE_DIR, 'qr-all-branches.html'), pdfPath: path.join(BASE_DIR, 'Fun-Strike-All-Branches-QR-Codes.pdf') },
    { html: palGokartPdfHtml, htmlPath: path.join(BASE_DIR, 'qr-pal-gokart.html'), pdfPath: path.join(BASE_DIR, 'Fun-Strike-QR-Pal-GoKarting.pdf') },
    { html: palGokartPdfHtml, htmlPath: path.join(BASE_DIR, 'qr-gokart-alias.html'), pdfPath: path.join(BASE_DIR, 'Fun-Strike-QR-GoKarting.pdf') },
    { html: palTrampolinePdfHtml, htmlPath: path.join(BASE_DIR, 'qr-pal-trampoline.html'), pdfPath: path.join(BASE_DIR, 'Fun-Strike-QR-Pal-Trampoline.pdf') },
    { html: palTrampolinePdfHtml, htmlPath: path.join(BASE_DIR, 'qr-trampoline-alias.html'), pdfPath: path.join(BASE_DIR, 'Fun-Strike-QR-Trampoline.pdf') },
    { html: mvTrampolinePdfHtml, htmlPath: path.join(BASE_DIR, 'qr-mv-trampoline.html'), pdfPath: path.join(BASE_DIR, 'Fun-Strike-QR-MotaVarachha-Trampoline.pdf') }
  ];

  const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  for (const f of files) {
    fs.writeFileSync(f.htmlPath, f.html, 'utf8');
    const fileUrl = 'file:///' + f.htmlPath.replace(/\\/g, '/');
    console.log(`Generating Photo Paper PDF: ${path.basename(f.pdfPath)}...`);
    execFileSync(chromeExe, [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${f.pdfPath}`,
      fileUrl
    ]);
    const stat = fs.statSync(f.pdfPath);
    console.log(`Created ${path.basename(f.pdfPath)} (${stat.size} bytes)`);
    fs.unlinkSync(f.htmlPath);
  }

  console.log('All Photo Paper Edition PDF files generated successfully!');
}

generate().catch(err => {
  console.error('Error generating Photo Paper PDFs:', err);
  process.exit(1);
});
