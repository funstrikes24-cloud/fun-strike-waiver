<div align="center">
  <img src="assets/images/funstrike-logo.png" alt="Fun Strike! Game Zone Official Logo" width="120" />
  <h1>Fun Strike! Game Zone — Digital Participant Waiver</h1>
  <p>
    <strong>Fun Strikes Entertainment LLP</strong> &bull; Surat, Gujarat<br />
    Mobile &amp; Tablet-First Digital Waiver System with Dedicated Branch Portals &amp; Photo Paper Counter Standees
  </p>
  <p>
    <a href="https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-gokart"><strong>🏎️ Pal Go-Karting (18+)</strong></a>
    &bull;
    <a href="https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-trampoline"><strong>🤸 Pal Trampoline</strong></a>
    &bull;
    <a href="https://funstrikes24-cloud.github.io/fun-strike-waiver/motavarachha-softplay"><strong>🎪 Mota Varachha Trampoline</strong></a>
    &bull;
    <a href="https://funstrike.in">Website</a>
  </p>
</div>

---

## 📍 Dedicated Customer Waiver Links

There is no generic portal. Each activity and branch has its own standalone dedicated form with locked location and rules:

| Branch | Activity | Target Audience | Live Custom Domain | Fallback URL | Standee PDF |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pal (Gauravpath Road)** | **Go-Karting Track** | **18+ Only &bull; Min 5'5" (165 cm)** | [`https://gokart.funstrike.nexoraonesolution.com`](https://gokart.funstrike.nexoraonesolution.com) | [`.../pal-gokart`](https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-gokart) | [`printables/Fun-Strike-QR-Pal-GoKarting.pdf`](printables/Fun-Strike-QR-Pal-GoKarting.pdf) |
| **Pal (Gauravpath Road)** | **Soft Play &amp; Trampoline** | **All Ages (Jump Arena)** | [`https://pal.funstrike.nexoraonesolution.com`](https://pal.funstrike.nexoraonesolution.com) | [`.../pal-trampoline`](https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-trampoline) | [`printables/Fun-Strike-QR-Pal-Trampoline.pdf`](printables/Fun-Strike-QR-Pal-Trampoline.pdf) |
| **Mota Varachha** | **Soft Play &amp; Trampoline** | **All Ages (Jump Arena)** | [`https://varachha.funstrike.nexoraonesolution.com`](https://varachha.funstrike.nexoraonesolution.com) | [`.../motavarachha-softplay`](https://funstrikes24-cloud.github.io/fun-strike-waiver/motavarachha-softplay) | [`printables/Fun-Strike-QR-MotaVarachha-Trampoline.pdf`](printables/Fun-Strike-QR-MotaVarachha-Trampoline.pdf) |

> 📖 **DNS & Domain Setup**: See [`docs/DNS-DOMAIN-SETUP.md`](docs/DNS-DOMAIN-SETUP.md) for step-by-step DNS CNAME and Cloudflare/cPanel redirection rules for `*.funstrike.nexoraonesolution.com`.

---

## 📁 Repository Directory Structure

```text
fun-strike-waiver/
├── assets/                          # Core static assets
│   ├── css/
│   │   └── styles.css              # Main stylesheet
│   ├── js/
│   │   └── app.js                  # Waiver frontend logic & e-signature pad
│   ├── images/
│   │   └── funstrike-logo.png      # Official brand logo
│   └── qr/                         # High-DPI PNG QR codes (600+ DPI)
│       ├── qr-pal-gokart.png
│       ├── qr-pal-trampoline.png
│       └── qr-motavarachha-softplay.png
│
├── docs/                            # Documentation & Architecture
│   ├── ARCHITECTURE.md             # Detailed directory & routing documentation
│   └── GOOGLE-SHEETS-SETUP.md      # Google Sheets & monthly/yearly archive guide
│
├── google-apps-script/              # Backend automation
│   └── Code.gs                     # Google Apps Script Web App receiver
│
├── printables/                      # Photo Paper Standee PDFs (High-DPI A4)
│   ├── Fun-Strike-All-Branches-QR-Codes.pdf       # 3-Page All-Branches Master Pack
│   ├── Fun-Strike-QR-Pal-GoKarting.pdf           # 1-Page Pal Go-Karting Standee
│   ├── Fun-Strike-QR-Pal-Trampoline.pdf          # 1-Page Pal Trampoline Standee
│   ├── Fun-Strike-QR-MotaVarachha-Trampoline.pdf # 1-Page Mota Varachha Standee
│   └── Fun-Strike-Signed-Waiver-Print-Demo.pdf   # 1-Page Signed Waiver Sample with All Terms
│
├── scripts/                         # Build & PDF generator scripts
│   └── generate-qr-pdf.js          # Automation script for QR & PDF generation
│
├── pal-gokart/                      # Dedicated Pal Go-Karting Waiver (18+ & 5'5"+)
│   └── index.html
├── pal-trampoline/                  # Dedicated Pal Trampoline Waiver
│   └── index.html
├── motavarachha-softplay/           # Dedicated Mota Varachha Trampoline Waiver
│   └── index.html
│
├── index.html                       # Auto-redirects to /pal-gokart/
├── README.md                        # Master repository documentation
├── generate-qr-pdf.js               # CLI runner wrapper for scripts/generate-qr-pdf.js
├── styles.css                       # Fallback stylesheet pointer
└── app.js                           # Fallback JavaScript pointer
```

---

## 🖨️ Printing on Photo Paper
1. Open any PDF from the [`printables/`](printables/) folder.
2. In your print dialog (`Ctrl + P`), select:
   - **Paper Size**: A4
   - **Paper Type / Media**: `Glossy Photo Paper` or `Matte Photo Paper`
   - **Quality**: `High` / `Best` (600–1200 DPI)
   - **Scale**: `100%` / `Actual Size` (or `Fit to Printable Area`)
   - **Margins**: `None` / `Minimum`
   - **Color**: `Vivid / High Saturation`

---

## 🛡️ Key Safety Rules & Logic
- **Go-Karting 18+ Sole Liability Policy**: Adults only. If under 18 participates or signs, 100% sole liability rests with the participant/parent; Fun Strikes bears zero liability. Mandatory acknowledgement checkbox required.
- **Go-Karting Height Requirement**: Minimum driver height is strictly **5'5" (5 ft 5 in / 165 cm)**.
- **No In-Form Zone Switching**: Customer forms have no radio buttons or dropdowns; location and activity are locked and dedicated to avoid customer errors.
- **Customer Print Buttons Removed**: Clean ~60-second mobile submission flow without confusing print buttons.

---

<p align="center">
  Made with ❤️ by <a href="https://www.linkedin.com/in/aryanpandya"><strong>Aryan</strong></a> &bull; <a href="https://nexoraonesolution.com/"><strong>NexoraOneSolution</strong></a>
</p>
