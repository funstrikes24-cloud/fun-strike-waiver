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

  // Generate PNG QR codes for assets/qr/
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
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#0f172a', light: '#ffffff' }
    });
  }
  console.log('All PNG QR codes updated in assets/qr/');

  // Generate SVG QR codes
  const palGokartSvg = await QRCode.toString(PAL_GOKART_URL, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: '#0f172a', light: '#ffffff' }
  });

  const palTrampolineSvg = await QRCode.toString(PAL_TRAMPOLINE_URL, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: '#0f172a', light: '#ffffff' }
  });

  const mvTrampolineSvg = await QRCode.toString(MV_TRAMPOLINE_URL, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: '#0f172a', light: '#ffffff' }
  });

  const commonCss = `
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    html, body {
      width: 210mm;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
    }
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 10mm 12mm 9mm;
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

    /* Branded Header */
    .venue-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 8px;
    }
    .venue-brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-logo {
      width: 66px;
      height: 66px;
      object-fit: contain;
    }
    .brand-text h1 {
      font-size: 21px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.4px;
      line-height: 1.15;
    }
    .brand-text .sub {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .venue-meta {
      text-align: right;
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
    }
    .venue-meta strong {
      color: #0f172a;
      font-size: 12.5px;
    }

    /* Steps row */
    .steps-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 9px 14px;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .step-num {
      width: 30px;
      height: 30px;
      color: #fff;
      font-weight: 900;
      font-size: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .step-content {
      font-size: 11.5px;
      color: #334155;
      line-height: 1.3;
    }
    .step-content strong {
      display: block;
      color: #0f172a;
      font-size: 12.5px;
    }

    /* Footer */
    .venue-footer {
      border-top: 2px solid #e2e8f0;
      padding-top: 7px;
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

  // 1. PAL - GO-KARTING (18+) FULL PAGE
  const palGokartHtml = `
    <div class="page" id="page-pal-gokart">
      <header class="venue-header">
        <div class="venue-brand">
          <img src="${logoDataUri}" alt="Fun Strike! Logo" class="brand-logo" />
          <div class="brand-text">
            <h1>Fun Strikes Entertainment LLP</h1>
            <div class="sub" style="color: #e11d48;">Pal Branch &bull; Go-Karting Track (18+)</div>
          </div>
        </div>
        <div class="venue-meta">
          <strong>Mandatory Track Waiver</strong><br>
          Gauravpath Road, Pal (Surat)<br>
          funstrike.in
        </div>
      </header>

      <div style="text-align: center; margin: 4px 0;">
        <div style="background: #e11d48; color: #ffffff; font-size: 13.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 20px; border-radius: 30px; display: inline-block; margin-bottom: 6px;">
          🏎️ Pal Branch &bull; Driver Registration (18+)
        </div>
        <h2 style="font-size: 34px; font-weight: 900; color: #be123c; letter-spacing: -0.5px; line-height: 1.1; text-transform: uppercase;">
          GO-KARTING WAIVER
        </h2>
        <p style="font-size: 14.5px; color: #475569; max-width: 600px; margin: 5px auto 0; font-weight: 600;">
          Scan with phone camera &bull; E-sign your Pal Go-Kart waiver in 60 seconds before boarding.
        </p>
      </div>

      <div style="background: linear-gradient(180deg, #fff5f5 0%, #ffe4e6 100%); border: 3.5px solid #e11d48; border-radius: 24px; padding: 18px 22px 16px; text-align: center; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.16); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="background: #ffffff; border-radius: 18px; padding: 16px; width: 280px; height: 280px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.1); border: 2px solid #fecdd3;">
          <div style="width: 100%; height: 100%;">
            ${palGokartSvg}
          </div>
        </div>

        <div style="margin-top: 12px;">
          <span style="font-size: 17px; font-weight: 900; color: #9f1239; letter-spacing: 0.8px; text-transform: uppercase; display: block;">
            📷 POINT PHONE CAMERA TO SCAN
          </span>
          <span style="font-size: 13px; color: #64748b; margin-top: 3px; display: block; font-weight: 600;">
            Opens Dedicated Pal Form &bull; Works with iPhone &amp; Android
          </span>
          <div style="margin-top: 7px; background: #ffffff; border: 1.5px solid #e11d48; border-radius: 10px; padding: 5px 14px; font-size: 12.5px; color: #be123c; font-family: monospace; font-weight: 700; display: inline-block;">
            ${PAL_GOKART_URL}
          </div>
        </div>
      </div>

      <div style="background: #fee2e2; border: 2px solid #e11d48; border-radius: 12px; padding: 10px 14px; text-align: center;">
        <strong style="color: #9f1239; font-size: 12.5px; text-transform: uppercase; display: block; margin-bottom: 2px;">
          ⚠️ STRICT 18+ ADULT POLICY &amp; MINOR SOLE RESPONSIBILITY CLAUSE
        </strong>
        <p style="color: #881337; font-size: 11.5px; font-weight: 600; line-height: 1.4; margin: 0;">
          Go-Karting is designed for ages 18+. If you are under 18 and sign this waiver yourself, or if you drive without adult guardian supervision, <strong>ALL RESPONSIBILITY, INJURIES, DAMAGES, AND LIABILITIES REST 100% WITH YOU / YOUR PARENTS</strong>. Fun Strikes Entertainment LLP bears ZERO liability.
        </p>
      </div>

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

      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 10px 16px;">
        <div style="font-size: 12px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
          <span>🏁 Pal Go-Kart Track Rules</span>
          <span style="color: #be123c; font-size: 11px; font-weight: 800;">SAFETY FIRST</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; font-size: 11px; color: #1e293b; line-height: 1.4;">
          <div>&bull; <strong>Min Height 5'5" (165 cm):</strong> Required for single-kart drivers.</div>
          <div>&bull; <strong>Helmets Mandatory:</strong> Full-face helmet secured before boarding.</div>
          <div>&bull; <strong>Strictly No Bumping:</strong> Intentional ramming will stop session.</div>
          <div>&bull; <strong>Closed-Toe Shoes:</strong> No crocs, slippers, or bare feet on track.</div>
          <div>&bull; <strong>Tie Long Hair:</strong> Tie hair above shoulder; secure loose dupattas.</div>
          <div>&bull; <strong>Double-Seat Karts:</strong> Passenger min 40 in (102 cm) with adult.</div>
        </div>
      </div>

      <footer class="venue-footer">
        <div>
          <strong>Fun Strikes Entertainment LLP</strong> &bull; Pal Branch (Gauravpath Road, Surat)
        </div>
        <div>
          Pit Desk: <strong>+91 76005 57671</strong> &bull; funstrike.in
        </div>
      </footer>
    </div>
  `;

  // 2. PAL - SOFT PLAY & TRAMPOLINE FULL PAGE
  const palTrampolineHtml = `
    <div class="page" id="page-pal-trampoline">
      <header class="venue-header">
        <div class="venue-brand">
          <img src="${logoDataUri}" alt="Fun Strike! Logo" class="brand-logo" />
          <div class="brand-text">
            <h1>Fun Strikes Entertainment LLP</h1>
            <div class="sub" style="color: #0284c7;">Pal Branch &bull; Soft Play &amp; Trampoline Arena</div>
          </div>
        </div>
        <div class="venue-meta">
          <strong>Mandatory Arena Waiver</strong><br>
          Gauravpath Road, Pal (Surat)<br>
          funstrike.in
        </div>
      </header>

      <div style="text-align: center; margin: 4px 0;">
        <div style="background: #0284c7; color: #ffffff; font-size: 13.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 20px; border-radius: 30px; display: inline-block; margin-bottom: 6px;">
          🤸 Pal Branch &bull; Jumper Registration
        </div>
        <h2 style="font-size: 34px; font-weight: 900; color: #0369a1; letter-spacing: -0.5px; line-height: 1.1; text-transform: uppercase;">
          TRAMPOLINE &amp; SOFT PLAY WAIVER
        </h2>
        <p style="font-size: 14.5px; color: #475569; max-width: 600px; margin: 5px auto 0; font-weight: 600;">
          Scan with phone camera &bull; E-sign your Pal trampoline waiver in 60 seconds before entering.
        </p>
      </div>

      <div style="background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%); border: 3.5px solid #0284c7; border-radius: 24px; padding: 18px 22px 16px; text-align: center; box-shadow: 0 10px 30px rgba(2, 132, 199, 0.16); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="background: #ffffff; border-radius: 18px; padding: 16px; width: 280px; height: 280px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.1); border: 2px solid #bae6fd;">
          <div style="width: 100%; height: 100%;">
            ${palTrampolineSvg}
          </div>
        </div>

        <div style="margin-top: 12px;">
          <span style="font-size: 17px; font-weight: 900; color: #075985; letter-spacing: 0.8px; text-transform: uppercase; display: block;">
            📷 POINT PHONE CAMERA TO SCAN
          </span>
          <span style="font-size: 13px; color: #64748b; margin-top: 3px; display: block; font-weight: 600;">
            Opens Dedicated Pal Trampoline Form &bull; Works with iPhone &amp; Android
          </span>
          <div style="margin-top: 7px; background: #ffffff; border: 1.5px solid #0284c7; border-radius: 10px; padding: 5px 14px; font-size: 12.5px; color: #0284c7; font-family: monospace; font-weight: 700; display: inline-block;">
            ${PAL_TRAMPOLINE_URL}
          </div>
        </div>
      </div>

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

      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 10px 16px;">
        <div style="font-size: 12px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
          <span>🛡️ Pal Trampoline Safety Rules</span>
          <span style="color: #0284c7; font-size: 11px; font-weight: 800;">BOUNCE RESPONSIBLY</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; font-size: 11px; color: #1e293b; line-height: 1.4;">
          <div>&bull; <strong>Grip Socks Mandatory:</strong> Anti-slip socks worn at all times.</div>
          <div>&bull; <strong>One Jumper Per Bed:</strong> Never double-bounce another person.</div>
          <div>&bull; <strong>Empty Pockets:</strong> No phones, keys, or sharp objects in arena.</div>
          <div>&bull; <strong>No Rough Flips:</strong> Backflips and inverted stunts prohibited.</div>
          <div>&bull; <strong>Supervise Under 10:</strong> Children under 10 must be accompanied.</div>
          <div>&bull; <strong>Foam Pit Safety:</strong> Feet-first entry only; never dive headfirst.</div>
        </div>
      </div>

      <footer class="venue-footer">
        <div>
          <strong>Fun Strikes Entertainment LLP</strong> &bull; Pal Branch (Gauravpath Road, Surat)
        </div>
        <div>
          Arena Desk: <strong>+91 76005 57671</strong> &bull; funstrike.in
        </div>
      </footer>
    </div>
  `;

  // 3. MOTA VARACHHA - SOFT PLAY & TRAMPOLINE FULL PAGE
  const mvTrampolineHtml = `
    <div class="page" id="page-mv-trampoline">
      <header class="venue-header">
        <div class="venue-brand">
          <img src="${logoDataUri}" alt="Fun Strike! Logo" class="brand-logo" />
          <div class="brand-text">
            <h1>Fun Strikes Entertainment LLP</h1>
            <div class="sub" style="color: #059669;">Mota Varachha Branch &bull; Soft Play &amp; Trampoline Arena</div>
          </div>
        </div>
        <div class="venue-meta">
          <strong>Mandatory Arena Waiver</strong><br>
          Mota Varachha, Surat<br>
          funstrike.in
        </div>
      </header>

      <div style="text-align: center; margin: 4px 0;">
        <div style="background: #059669; color: #ffffff; font-size: 13.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 20px; border-radius: 30px; display: inline-block; margin-bottom: 6px;">
          🤸 Mota Varachha Branch &bull; Jumper Registration
        </div>
        <h2 style="font-size: 34px; font-weight: 900; color: #047857; letter-spacing: -0.5px; line-height: 1.1; text-transform: uppercase;">
          TRAMPOLINE &amp; SOFT PLAY WAIVER
        </h2>
        <p style="font-size: 14.5px; color: #475569; max-width: 600px; margin: 5px auto 0; font-weight: 600;">
          Scan with phone camera &bull; E-sign your Mota Varachha waiver in 60 seconds before entering.
        </p>
      </div>

      <div style="background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%); border: 3.5px solid #059669; border-radius: 24px; padding: 18px 22px 16px; text-align: center; box-shadow: 0 10px 30px rgba(5, 150, 105, 0.16); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="background: #ffffff; border-radius: 18px; padding: 16px; width: 280px; height: 280px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.1); border: 2px solid #a7f3d0;">
          <div style="width: 100%; height: 100%;">
            ${mvTrampolineSvg}
          </div>
        </div>

        <div style="margin-top: 12px;">
          <span style="font-size: 17px; font-weight: 900; color: #065f46; letter-spacing: 0.8px; text-transform: uppercase; display: block;">
            📷 POINT PHONE CAMERA TO SCAN
          </span>
          <span style="font-size: 13px; color: #64748b; margin-top: 3px; display: block; font-weight: 600;">
            Opens Dedicated Mota Varachha Form &bull; Works with iPhone &amp; Android
          </span>
          <div style="margin-top: 7px; background: #ffffff; border: 1.5px solid #059669; border-radius: 10px; padding: 5px 14px; font-size: 12.5px; color: #059669; font-family: monospace; font-weight: 700; display: inline-block;">
            ${MV_TRAMPOLINE_URL}
          </div>
        </div>
      </div>

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

      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 10px 16px;">
        <div style="font-size: 12px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
          <span>🛡️ Mota Varachha Trampoline Safety Rules</span>
          <span style="color: #059669; font-size: 11px; font-weight: 800;">BOUNCE RESPONSIBLY</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; font-size: 11px; color: #1e293b; line-height: 1.4;">
          <div>&bull; <strong>Grip Socks Mandatory:</strong> Anti-slip socks worn at all times.</div>
          <div>&bull; <strong>One Jumper Per Bed:</strong> Never double-bounce another person.</div>
          <div>&bull; <strong>Empty Pockets:</strong> No phones, keys, or sharp objects in arena.</div>
          <div>&bull; <strong>No Rough Flips:</strong> Backflips and inverted stunts prohibited.</div>
          <div>&bull; <strong>Supervise Under 10:</strong> Children under 10 must be accompanied.</div>
          <div>&bull; <strong>Foam Pit Safety:</strong> Feet-first entry only; never dive headfirst.</div>
        </div>
      </div>

      <footer class="venue-footer">
        <div>
          <strong>Fun Strikes Entertainment LLP</strong> &bull; Mota Varachha Branch (Surat)
        </div>
        <div>
          Arena Desk: <strong>+91 76005 57671</strong> &bull; funstrike.in
        </div>
      </footer>
    </div>
  `;

  // HTML templates for PDFs
  // 1. All Branches Master PDF (3 pages)
  const masterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fun Strike! QR Waiver Standees — All Branches & Activities</title>
  <style>${commonCss}</style>
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
  <title>Pal — Go-Karting Track Standee (18+)</title>
  <style>${commonCss}</style>
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
  <title>Pal — Soft Play & Trampoline Standee</title>
  <style>${commonCss}</style>
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
  <title>Mota Varachha — Soft Play & Trampoline Standee</title>
  <style>${commonCss}</style>
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
    console.log(`Generating ${path.basename(f.pdfPath)}...`);
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

  console.log('All branch and activity PDF files generated successfully!');
}

generate().catch(err => {
  console.error('Error generating PDFs:', err);
  process.exit(1);
});
