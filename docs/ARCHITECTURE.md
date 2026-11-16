# Fun Strike! Waiver System — Project Architecture & Directory Structure

This document outlines the organized folder hierarchy, routing rules, and design of the **Fun Strike! Game Zone** digital waiver ecosystem.

---

## 📁 Repository Directory Structure

```text
fun-strike-waiver/
├── assets/                          # Core frontend static assets
│   ├── css/
│   │   └── styles.css              # Main responsive styling & theme
│   ├── js/
│   │   └── app.js                  # Digital signature pad, validation & Apps Script sync
│   ├── images/
│   │   └── funstrike-logo.png      # Official high-resolution brand logo
│   └── qr/                         # 600+ DPI standalone QR code PNG images
│       ├── qr-pal-gokart.png       # Pal Go-Karting QR
│       ├── qr-pal-trampoline.png   # Pal Trampoline QR
│       └── qr-motavarachha-softplay.png # Mota Varachha Trampoline QR
│
├── docs/                            # Technical setup, guides & architecture
│   ├── GOOGLE-SHEETS-SETUP.md      # Google Sheets & Monthly/Yearly archive guide
│   └── ARCHITECTURE.md             # This directory structure documentation
│
├── google-apps-script/              # Backend automation & spreadsheet database
│   └── Code.gs                     # Google Apps Script Web App receiver & auto-archiver
│
├── printables/                      # Ready-to-print Photo Paper Standee PDFs (High-DPI)
│   ├── Fun-Strike-All-Branches-QR-Codes.pdf       # Combined 3-Page Standee Pack
│   ├── Fun-Strike-QR-Pal-GoKarting.pdf           # Pal Go-Karting Standee (1 Page, A4)
│   ├── Fun-Strike-QR-Pal-Trampoline.pdf          # Pal Trampoline Standee (1 Page, A4)
│   ├── Fun-Strike-QR-MotaVarachha-Trampoline.pdf # Mota Varachha Standee (1 Page, A4)
│   └── archive/                    # Archived previous version/draft standees
│       ├── Fun-Strike-GoKart-Trampoline-QR-Codes.pdf
│       ├── Fun-Strike-Printed-Waiver-Demo.pdf
│       ├── Fun-Strike-QR-Dual-Karting-Trampoline.pdf
│       ├── Fun-Strike-QR-GoKarting.pdf
│       ├── Fun-Strike-QR-Trampoline.pdf
│       └── Fun-Strike-Waiver-Owner-Guide.pdf
│
├── scripts/                         # Build, automation & PDF generation scripts
│   └── generate-qr-pdf.js          # Node.js + Chrome Headless high-DPI generator
│
├── pal-gokart/                      # Dedicated Pal Go-Karting Waiver (18+ & 5'5"+)
│   └── index.html
│
├── pal-trampoline/                  # Dedicated Pal Soft Play & Trampoline Waiver
│   └── index.html
│
├── motavarachha-softplay/           # Dedicated Mota Varachha Soft Play & Trampoline Waiver
│   └── index.html
│
├── gokart/                          # Seamless backward-compatibility redirect -> pal-gokart/
│   └── index.html
├── trampoline/                      # Seamless backward-compatibility redirect -> pal-trampoline/
│   └── index.html
├── motavarachha/                    # Seamless backward-compatibility redirect -> motavarachha-softplay/
│   └── index.html
│
├── index.html                       # Master Central Portal for customer & staff selection
├── README.md                        # Master repository documentation & quick links
├── generate-qr-pdf.js               # Root CLI alias for scripts/generate-qr-pdf.js
├── styles.css                       # Root fallback stylesheet pointer
└── app.js                           # Root fallback JavaScript pointer
```

---

## 🚦 Branch & Activity Routing Matrix

| Branch / Location | Activity | Canonical URL | Standee PDF File |
| :--- | :--- | :--- | :--- |
| **Pal (Gauravpath Road)** | **Go-Karting** *(18+ & 5'5"+ only)* | [`/pal-gokart/`](https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-gokart) | `printables/Fun-Strike-QR-Pal-GoKarting.pdf` |
| **Pal (Gauravpath Road)** | **Soft Play & Trampoline** *(All ages)* | [`/pal-trampoline/`](https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-trampoline) | `printables/Fun-Strike-QR-Pal-Trampoline.pdf` |
| **Mota Varachha** | **Soft Play & Trampoline** *(All ages)* | [`/motavarachha-softplay/`](https://funstrikes24-cloud.github.io/fun-strike-waiver/motavarachha-softplay) | `printables/Fun-Strike-QR-MotaVarachha-Trampoline.pdf` |
| **All Branches** | **Complete Standee Pack** | [`/`](https://funstrikes24-cloud.github.io/fun-strike-waiver/) | `printables/Fun-Strike-All-Branches-QR-Codes.pdf` |

---

## 🖨️ Photo Paper Standee Specifications
- **Dimensions**: Exact A4 (`210mm × 297mm`), zero margin overflow.
- **QR Code Quality**: Vector SVG + 800×800 PNG with Error Correction Level H (30% damage tolerance).
- **Paper Compatibility**: High-Gloss Photo Paper, Semi-Gloss, or Matte Heavy Photo Cardstock (180–250 GSM).
- **Ink Setting**: Photo Black + Vivid Color saturation with `-webkit-print-color-adjust: exact`.
