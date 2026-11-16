const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const QRCode = require('E:/Aryan/nexoraone-certify/node_modules/qrcode');

const BASE_DIR = path.resolve(__dirname, '..');
const PRINTABLES_DIR = path.join(BASE_DIR, 'printables');
if (!fs.existsSync(PRINTABLES_DIR)) {
  fs.mkdirSync(PRINTABLES_DIR, { recursive: true });
}
const LOGO_PATH = path.join(BASE_DIR, 'assets', 'funstrike-logo.png');
const QR_DIR = path.join(BASE_DIR, 'assets', 'qr');

const PAL_GOKART_URL = 'https://gokart.nexoraonesolution.com';
const PAL_TRAMPOLINE_URL = 'https://pal.nexoraonesolution.com';
const MV_TRAMPOLINE_URL = 'https://varachha.nexoraonesolution.com';

async function generate() {
  const logoBase64 = fs.readFileSync(LOGO_PATH).toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  // High-DPI PNG QR codes (800x800, level H) for assets
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

  // Photo Paper CSS with BIG FONTS and PUNCHY VIBRANT COLORS
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
      padding: 7mm 9mm 6mm;
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
      border-radius: 22px;
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
      border-radius: 16px;
      padding: 10px 16px;
      background: #080d1a;
      color: #ffffff;
      box-shadow: 0 6px 18px rgba(0,0,0,0.22);
    }
    .venue-brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-logo {
      width: 64px;
      height: 64px;
      object-fit: contain;
      filter: drop-shadow(0 3px 8px rgba(0,0,0,0.5));
    }
    .brand-text h1 {
      font-size: 23px;
      font-weight: 950;
      color: #ffffff;
      letter-spacing: -0.3px;
      line-height: 1.15;
      text-transform: uppercase;
    }
    .brand-text .sub {
      font-size: 13.5px;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-top: 3px;
    }
    .venue-meta {
      text-align: right;
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.4;
    }
    .venue-meta strong {
      color: #ffffff;
      font-size: 13.5px;
      letter-spacing: 0.4px;
      font-weight: 900;
    }

    /* Hero Standee Title Box */
    .hero-title-box {
      text-align: center;
      margin: 4px 0 2px;
    }
    .hero-badge {
      display: inline-block;
      color: #ffffff;
      font-size: 13.5px;
      font-weight: 950;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      padding: 6px 24px;
      border-radius: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.18);
      margin-bottom: 5px;
    }
    .hero-h2 {
      font-size: 44px;
      font-weight: 950;
      letter-spacing: -0.5px;
      line-height: 1.05;
      text-transform: uppercase;
    }
    .hero-p {
      font-size: 15px;
      color: #334155;
      max-width: 620px;
      margin: 4px auto 0;
      font-weight: 750;
      letter-spacing: 0.2px;
    }

    /* Center QR Card for Photo Paper */
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
      padding: 12px;
      width: 255px;
      height: 255px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 32px rgba(0,0,0,0.18);
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

    /* Scanner Corner Target Crosshairs */
    .scan-corner {
      position: absolute;
      width: 24px;
      height: 24px;
      border-style: solid;
      pointer-events: none;
    }
    .scan-corner.tl { top: 6px; left: 6px; border-width: 4px 0 0 4px; border-top-left-radius: 7px; }
    .scan-corner.tr { top: 6px; right: 6px; border-width: 4px 4px 0 0; border-top-right-radius: 7px; }
    .scan-corner.bl { bottom: 6px; left: 6px; border-width: 0 0 4px 4px; border-bottom-left-radius: 7px; }
    .scan-corner.br { bottom: 6px; right: 6px; border-width: 0 4px 4px 0; border-bottom-right-radius: 7px; }

    .scan-cta-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: #ffffff;
      font-size: 20px;
      font-weight: 950;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 10px 28px;
      border-radius: 50px;
      margin-top: 10px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.22);
    }
    .scan-sub-text {
      font-size: 13.5px;
      color: #334155;
      margin-top: 4px;
      font-weight: 800;
      display: block;
    }
    .url-chip {
      margin-top: 6px;
      background: #ffffff;
      border-radius: 10px;
      padding: 5px 18px;
      font-size: 13px;
      font-family: 'Segoe UI', monospace;
      font-weight: 850;
      display: inline-block;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      letter-spacing: 0.3px;
    }

    /* 3-Step Flow Row */
    .steps-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      background: #ffffff;
      border-radius: 16px;
      padding: 10px 14px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .step-num {
      width: 36px;
      height: 36px;
      color: #fff;
      font-weight: 950;
      font-size: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 3px 8px rgba(0,0,0,0.24);
    }
    .step-content {
      font-size: 12px;
      color: #334155;
      line-height: 1.35;
      font-weight: 600;
    }
    .step-content strong {
      display: block;
      color: #0f172a;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: -0.2px;
    }

    /* Safety & Rules Checklist */
    .rules-card {
      background: #ffffff;
      border-radius: 14px;
      padding: 9px 16px;
    }
    .rules-header {
      font-size: 13px;
      font-weight: 950;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .rules-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px 20px;
      font-size: 12px;
      color: #1e293b;
      line-height: 1.4;
      font-weight: 600;
    }
    .rules-grid strong {
      font-weight: 900;
      color: #0f172a;
    }

    /* Footer */
    .venue-footer {
      border-top: 2px solid #e2e8f0;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12.5px;
      color: #475569;
      font-weight: 600;
    }
    .venue-footer strong {
      color: #0f172a;
      font-weight: 900;
    }
  `;

  // ===================================================
  // 1. PAL — GO-KARTING (18+) PHOTO PAPER STANDEE (PUNCHY RED/YELLOW)
  // ===================================================
  const palGokartHtml = `
    <div class="page" id="page-pal-gokart">
      <div class="standee-frame" style="border: 4px solid #e11d48; background: linear-gradient(180deg, #ffffff 0%, #fff1f2 100%); box-shadow: inset 0 0 0 2px #be123c;">
        
        <!-- Header Bar -->
        <header class="venue-header" style="background: linear-gradient(90deg, #090e1a 0%, #1e1b4b 60%, #4c0519 100%);">
          <div class="venue-brand">
            <img src="${logoDataUri}" alt="Fun Strike! Logo" class="brand-logo" />
            <div class="brand-text">
              <h1>Fun Strikes Entertainment</h1>
              <div class="sub" style="color: #fb7185;">🏎️ Pal Branch &bull; Go-Karting Track (18+)</div>
            </div>
          </div>
          <div class="venue-meta">
            <strong>Driver Registration</strong><br>
            Gauravpath Road, Pal (Surat)<br>
            <span style="color: #facc15; font-weight: 800;">funstrike.in</span>
          </div>
        </header>

        <!-- Hero Title Box -->
        <div class="hero-title-box">
          <div class="hero-badge" style="background: linear-gradient(135deg, #e11d48, #be123c); color: #ffffff;">
            🏁 PIT LANE ENTRY &bull; MANDATORY DRIVER WAIVER
          </div>
          <h2 class="hero-h2" style="color: #be123c; text-shadow: 0 2px 4px rgba(190, 18, 60, 0.15);">
            GO-KARTING WAIVER
          </h2>
          <p class="hero-p">
            Scan QR code with your phone camera &bull; E-sign driver agreement in 60 seconds before boarding karts.
          </p>
        </div>

        <!-- Center QR Card -->
        <div class="qr-card" style="background: linear-gradient(180deg, #fff5f5 0%, #ffe4e6 100%); border: 3.5px solid #e11d48; box-shadow: 0 14px 34px rgba(225, 29, 72, 0.22);">
          
          <div class="qr-target-wrap" style="border: 2.5px solid #fecdd3;">
            <div class="scan-corner tl" style="border-color: #be123c;"></div>
            <div class="scan-corner tr" style="border-color: #be123c;"></div>
            <div class="scan-corner bl" style="border-color: #be123c;"></div>
            <div class="scan-corner br" style="border-color: #be123c;"></div>
            <div class="qr-svg-box">
              ${palGokartSvg}
            </div>
          </div>

          <div class="scan-cta-pill" style="background: linear-gradient(135deg, #e11d48, #be123c);">
            📷 SCAN WITH PHONE CAMERA
          </div>
          <span class="scan-sub-text">
            Instant Camera Scan &bull; iPhone &amp; Android &bull; No App Needed
          </span>
          <div class="url-chip" style="border: 2px solid #e11d48; color: #be123c;">
            ${PAL_GOKART_URL}
          </div>
        </div>

        <!-- Strict 18+ & 5'5" Height Sole Responsibility Callout -->
        <div style="background: #fef2f2; border: 3px solid #dc2626; border-radius: 14px; padding: 10px 16px; text-align: center; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.15);">
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 3px;">
            <span style="background: #dc2626; color: #fff; font-size: 13px; font-weight: 950; text-transform: uppercase; padding: 3px 12px; border-radius: 20px; letter-spacing: 0.6px;">
              ⚠️ STRICT 18+ POLICY &bull; MIN HEIGHT: 5'5" (165 CM)
            </span>
          </div>
          <p style="color: #991b1b; font-size: 12.5px; font-weight: 800; line-height: 1.4; margin: 0;">
            Go-Karting is designed for adults (18+). If an individual under 18 signs or drives, <strong>100% OF ALL RESPONSIBILITY, ACCIDENT RISKS &amp; LIABILITIES REST SOLELY WITH YOU / PARENT</strong>. Fun Strikes bears ZERO liability.
          </p>
        </div>

        <!-- 3-Step Flow -->
        <div class="steps-row" style="border: 2px solid #fecdd3;">
          <div class="step-item">
            <div class="step-num" style="background: linear-gradient(135deg, #e11d48, #be123c);">1</div>
            <div class="step-content">
              <strong>1. Scan QR Code</strong>
              Point camera &amp; tap link
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: linear-gradient(135deg, #e11d48, #be123c);">2</div>
            <div class="step-content">
              <strong>2. Add Drivers &amp; Sign</strong>
              E-sign waiver on phone
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: linear-gradient(135deg, #e11d48, #be123c);">3</div>
            <div class="step-content">
              <strong>3. Show Pit Marshal</strong>
              Collect helmet &amp; race!
            </div>
          </div>
        </div>

        <!-- Track Safety Rules Checklist -->
        <div class="rules-card" style="border: 2px solid #cbd5e1; background: #ffffff;">
          <div class="rules-header">
            <span>🏁 Essential Pit Rules &amp; Track Safety</span>
            <span style="background: #be123c; color: #fff; font-size: 11px; font-weight: 950; padding: 2px 8px; border-radius: 6px;">SAFETY FIRST</span>
          </div>
          <div class="rules-grid">
            <div>&bull; <strong>Min Height: 5'5" (165 cm):</strong> Strictly required for single karts.</div>
            <div>&bull; <strong>Helmets Mandatory:</strong> Full-face helmet strapped before throttle.</div>
            <div>&bull; <strong>Strictly No Bumping:</strong> Intentional ramming will stop race session.</div>
            <div>&bull; <strong>Closed-Toe Shoes:</strong> No crocs, sandals, slippers, or bare feet.</div>
            <div>&bull; <strong>Tie Long Hair:</strong> Hair tied above shoulders; tuck in loose clothes.</div>
            <div>&bull; <strong>Double Karts:</strong> Passenger min 40" (102 cm) with adult 18+ driver.</div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="venue-footer">
          <div>
            <strong>Fun Strikes Entertainment LLP</strong> &bull; Gauravpath Road, Pal (Surat)
          </div>
          <div>
            Pit Reception: <strong>+91 76005 57671</strong> &bull; funstrike.in
          </div>
        </footer>

      </div>
    </div>
  `;

  // ===================================================
  // 2. PAL — SOFT PLAY & TRAMPOLINE PHOTO PAPER STANDEE (PUNCHY CYAN/ELECTRIC BLUE)
  // ===================================================
  const palTrampolineHtml = `
    <div class="page" id="page-pal-trampoline">
      <div class="standee-frame" style="border: 4px solid #0284c7; background: linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%); box-shadow: inset 0 0 0 2px #0369a1;">
        
        <!-- Header Bar -->
        <header class="venue-header" style="background: linear-gradient(90deg, #090e1a 0%, #0c4a6e 60%, #0369a1 100%);">
          <div class="venue-brand">
            <img src="${logoDataUri}" alt="Fun Strike! Logo" class="brand-logo" />
            <div class="brand-text">
              <h1>Fun Strikes Entertainment</h1>
              <div class="sub" style="color: #38bdf8;">🤸 Pal Branch &bull; Soft Play &amp; Trampoline Arena</div>
            </div>
          </div>
          <div class="venue-meta">
            <strong>Arena Registration</strong><br>
            Gauravpath Road, Pal (Surat)<br>
            <span style="color: #38bdf8; font-weight: 800;">funstrike.in</span>
          </div>
        </header>

        <!-- Hero Title Box -->
        <div class="hero-title-box">
          <div class="hero-badge" style="background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff;">
            ⭐ JUMP ARENA ENTRY &bull; ALL AGES &bull; MANDATORY WAIVER
          </div>
          <h2 class="hero-h2" style="color: #0284c7; text-shadow: 0 2px 4px rgba(2, 132, 199, 0.15);">
            TRAMPOLINE WAIVER
          </h2>
          <p class="hero-p">
            Scan QR code with phone camera &bull; Parents can sign for up to 20 jumpers on 1 quick waiver form.
          </p>
        </div>

        <!-- Center QR Card -->
        <div class="qr-card" style="background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%); border: 3.5px solid #0284c7; box-shadow: 0 14px 34px rgba(2, 132, 199, 0.22);">
          
          <div class="qr-target-wrap" style="border: 2.5px solid #bae6fd;">
            <div class="scan-corner tl" style="border-color: #0284c7;"></div>
            <div class="scan-corner tr" style="border-color: #0284c7;"></div>
            <div class="scan-corner bl" style="border-color: #0284c7;"></div>
            <div class="scan-corner br" style="border-color: #0284c7;"></div>
            <div class="qr-svg-box">
              ${palTrampolineSvg}
            </div>
          </div>

          <div class="scan-cta-pill" style="background: linear-gradient(135deg, #0284c7, #0369a1);">
            📷 SCAN WITH PHONE CAMERA
          </div>
          <span class="scan-sub-text">
            Instant Camera Scan &bull; iPhone &amp; Android &bull; No App Needed
          </span>
          <div class="url-chip" style="border: 2px solid #0284c7; color: #0284c7;">
            ${PAL_TRAMPOLINE_URL}
          </div>
        </div>

        <!-- Grip Socks & Family Banner -->
        <div style="background: #e0f2fe; border: 3px solid #0284c7; border-radius: 14px; padding: 10px 16px; text-align: center; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.15);">
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 3px;">
            <span style="background: #0284c7; color: #fff; font-size: 13px; font-weight: 950; text-transform: uppercase; padding: 3px 12px; border-radius: 20px; letter-spacing: 0.6px;">
              🧦 ANTI-SLIP GRIP SOCKS MANDATORY &bull; ALL AGES WELCOME
            </span>
          </div>
          <p style="color: #075985; font-size: 12.5px; font-weight: 800; line-height: 1.4; margin: 0;">
            Approved grip socks must be worn by all jumpers. Parents/guardians can add up to 20 children and family members on one single waiver form in under 60 seconds!
          </p>
        </div>

        <!-- 3-Step Flow -->
        <div class="steps-row" style="border: 2px solid #bae6fd;">
          <div class="step-item">
            <div class="step-num" style="background: linear-gradient(135deg, #0284c7, #0369a1);">1</div>
            <div class="step-content">
              <strong>1. Scan QR Code</strong>
              Point camera &amp; tap link
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: linear-gradient(135deg, #0284c7, #0369a1);">2</div>
            <div class="step-content">
              <strong>2. Add Jumpers &amp; Sign</strong>
              Parents sign for all kids
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: linear-gradient(135deg, #0284c7, #0369a1);">3</div>
            <div class="step-content">
              <strong>3. Show Check-In Desk</strong>
              Get grip socks &amp; bounce!
            </div>
          </div>
        </div>

        <!-- Arena Safety Rules Checklist -->
        <div class="rules-card" style="border: 2px solid #cbd5e1; background: #ffffff;">
          <div class="rules-header">
            <span>🛡️ Pal Arena Safety &amp; Jump Rules</span>
            <span style="background: #0284c7; color: #fff; font-size: 11px; font-weight: 950; padding: 2px 8px; border-radius: 6px;">SAFETY FIRST</span>
          </div>
          <div class="rules-grid">
            <div>&bull; <strong>Grip Socks Mandatory:</strong> Approved anti-slip socks worn at all times.</div>
            <div>&bull; <strong>One Jumper Per Trampoline:</strong> Never double-bounce another jumper.</div>
            <div>&bull; <strong>Empty All Pockets:</strong> No smartphones, keys, jewelry, or sharp items.</div>
            <div>&bull; <strong>No Uncontrolled Flips:</strong> Inverted tricks and double flips prohibited.</div>
            <div>&bull; <strong>Supervise Kids Under 10:</strong> Must be watched by parent or guardian.</div>
            <div>&bull; <strong>Foam Pit Landing:</strong> Feet-first or bottom landing; never dive headfirst.</div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="venue-footer">
          <div>
            <strong>Fun Strikes Entertainment LLP</strong> &bull; Gauravpath Road, Pal (Surat)
          </div>
          <div>
            Arena Reception: <strong>+91 76005 57671</strong> &bull; funstrike.in
          </div>
        </footer>

      </div>
    </div>
  `;

  // ===================================================
  // 3. MOTA VARACHHA — TRAMPOLINE PHOTO PAPER STANDEE (PUNCHY EMERALD/MINT)
  // ===================================================
  const mvTrampolineHtml = `
    <div class="page" id="page-mv-trampoline">
      <div class="standee-frame" style="border: 4px solid #059669; background: linear-gradient(180deg, #ffffff 0%, #ecfdf5 100%); box-shadow: inset 0 0 0 2px #047857;">
        
        <!-- Header Bar -->
        <header class="venue-header" style="background: linear-gradient(90deg, #090e1a 0%, #064e3b 60%, #047857 100%);">
          <div class="venue-brand">
            <img src="${logoDataUri}" alt="Fun Strike! Logo" class="brand-logo" />
            <div class="brand-text">
              <h1>Fun Strikes Entertainment</h1>
              <div class="sub" style="color: #34d399;">🤸 Mota Varachha &bull; Soft Play &amp; Trampoline Arena</div>
            </div>
          </div>
          <div class="venue-meta">
            <strong>Arena Registration</strong><br>
            Mota Varachha (Surat)<br>
            <span style="color: #34d399; font-weight: 800;">funstrike.in</span>
          </div>
        </header>

        <!-- Hero Title Box -->
        <div class="hero-title-box">
          <div class="hero-badge" style="background: linear-gradient(135deg, #059669, #047857); color: #ffffff;">
            ⭐ JUMP ARENA ENTRY &bull; ALL AGES &bull; MANDATORY WAIVER
          </div>
          <h2 class="hero-h2" style="color: #059669; text-shadow: 0 2px 4px rgba(5, 150, 105, 0.15);">
            TRAMPOLINE WAIVER
          </h2>
          <p class="hero-p">
            Scan QR code with phone camera &bull; Parents can sign for up to 20 jumpers on 1 quick waiver form.
          </p>
        </div>

        <!-- Center QR Card -->
        <div class="qr-card" style="background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%); border: 3.5px solid #059669; box-shadow: 0 14px 34px rgba(5, 150, 105, 0.22);">
          
          <div class="qr-target-wrap" style="border: 2.5px solid #a7f3d0;">
            <div class="scan-corner tl" style="border-color: #059669;"></div>
            <div class="scan-corner tr" style="border-color: #059669;"></div>
            <div class="scan-corner bl" style="border-color: #059669;"></div>
            <div class="scan-corner br" style="border-color: #059669;"></div>
            <div class="qr-svg-box">
              ${mvTrampolineSvg}
            </div>
          </div>

          <div class="scan-cta-pill" style="background: linear-gradient(135deg, #059669, #047857);">
            📷 SCAN WITH PHONE CAMERA
          </div>
          <span class="scan-sub-text">
            Instant Camera Scan &bull; iPhone &amp; Android &bull; No App Needed
          </span>
          <div class="url-chip" style="border: 2px solid #059669; color: #059669;">
            ${MV_TRAMPOLINE_URL}
          </div>
        </div>

        <!-- Grip Socks & Family Banner -->
        <div style="background: #d1fae5; border: 3px solid #059669; border-radius: 14px; padding: 10px 16px; text-align: center; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.15);">
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 3px;">
            <span style="background: #059669; color: #fff; font-size: 13px; font-weight: 950; text-transform: uppercase; padding: 3px 12px; border-radius: 20px; letter-spacing: 0.6px;">
              🧦 ANTI-SLIP GRIP SOCKS MANDATORY &bull; ALL AGES WELCOME
            </span>
          </div>
          <p style="color: #064e3b; font-size: 12.5px; font-weight: 800; line-height: 1.4; margin: 0;">
            Approved grip socks must be worn by all jumpers. Parents/guardians can add up to 20 children and family members on one single waiver form in under 60 seconds!
          </p>
        </div>

        <!-- 3-Step Flow -->
        <div class="steps-row" style="border: 2px solid #a7f3d0;">
          <div class="step-item">
            <div class="step-num" style="background: linear-gradient(135deg, #059669, #047857);">1</div>
            <div class="step-content">
              <strong>1. Scan QR Code</strong>
              Point camera &amp; tap link
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: linear-gradient(135deg, #059669, #047857);">2</div>
            <div class="step-content">
              <strong>2. Add Jumpers &amp; Sign</strong>
              Parents sign for all kids
            </div>
          </div>
          <div class="step-item">
            <div class="step-num" style="background: linear-gradient(135deg, #059669, #047857);">3</div>
            <div class="step-content">
              <strong>3. Show Check-In Desk</strong>
              Get grip socks &amp; bounce!
            </div>
          </div>
        </div>

        <!-- Arena Safety Rules Checklist -->
        <div class="rules-card" style="border: 2px solid #cbd5e1; background: #ffffff;">
          <div class="rules-header">
            <span>🛡️ Mota Varachha Safety &amp; Jump Rules</span>
            <span style="background: #059669; color: #fff; font-size: 11px; font-weight: 950; padding: 2px 8px; border-radius: 6px;">SAFETY FIRST</span>
          </div>
          <div class="rules-grid">
            <div>&bull; <strong>Grip Socks Mandatory:</strong> Approved anti-slip socks worn at all times.</div>
            <div>&bull; <strong>One Jumper Per Trampoline:</strong> Never double-bounce another jumper.</div>
            <div>&bull; <strong>Empty All Pockets:</strong> No smartphones, keys, jewelry, or sharp items.</div>
            <div>&bull; <strong>No Uncontrolled Flips:</strong> Inverted tricks and double flips prohibited.</div>
            <div>&bull; <strong>Supervise Kids Under 10:</strong> Must be watched by parent or guardian.</div>
            <div>&bull; <strong>Foam Pit Landing:</strong> Feet-first or bottom landing; never dive headfirst.</div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="venue-footer">
          <div>
            <strong>Fun Strikes Entertainment LLP</strong> &bull; Mota Varachha (Surat)
          </div>
          <div>
            Arena Reception: <strong>+91 76005 57671</strong> &bull; funstrike.in
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
    { html: masterHtml, htmlPath: path.join(BASE_DIR, 'qr-all-branches.html'), pdfPath: path.join(PRINTABLES_DIR, 'Fun-Strike-All-Branches-QR-Codes.pdf') },
    { html: palGokartPdfHtml, htmlPath: path.join(BASE_DIR, 'qr-pal-gokart.html'), pdfPath: path.join(PRINTABLES_DIR, 'Fun-Strike-QR-Pal-GoKarting.pdf') },
    { html: palTrampolinePdfHtml, htmlPath: path.join(BASE_DIR, 'qr-pal-trampoline.html'), pdfPath: path.join(PRINTABLES_DIR, 'Fun-Strike-QR-Pal-Trampoline.pdf') },
    { html: mvTrampolinePdfHtml, htmlPath: path.join(BASE_DIR, 'qr-mv-trampoline.html'), pdfPath: path.join(PRINTABLES_DIR, 'Fun-Strike-QR-MotaVarachha-Trampoline.pdf') }
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
