# Fun Strike! Google Sheets & Drive Setup Guide

The complete enterprise setup documentation has been moved to:
👉 **[docs/GOOGLE-SHEETS-SETUP.md](docs/GOOGLE-SHEETS-SETUP.md)**

### Quick Reference:
- **Google Apps Script Code**: [`google-apps-script/Code.gs`](google-apps-script/Code.gs)
- **Drive Structure**: `Fun Strike! Waivers Database/`
  - `01 - Live Waivers (Daily Operations)/`
    - `Fun Strike! - Pal - Go-Karting Waivers (18+)`
    - `Fun Strike! - Pal - Trampoline & Soft Play Waivers`
    - `Fun Strike! - Mota Varachha - Trampoline & Soft Play Waivers`
  - `02 - Customer Signatures/`
    - `Pal - Go-Karting/`
    - `Pal - Trampoline/`
    - `Mota Varachha - Trampoline/`
  - `03 - Monthly Archives/`
  - `04 - Yearly Archives/`
- **Initial Setup**: In Apps Script, run function `setupAllZoneSheets`.
- **Share Database**: Run function `shareFolderWithManager` (grants Editor to `pandyaaryanp348@gmail.com`).
