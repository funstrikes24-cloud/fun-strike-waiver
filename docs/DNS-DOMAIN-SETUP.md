# Fun Strike! — Live Domain & DNS Configuration Guide
**Target Domain**: `nexoraonesolution.com`  
**Brand Architecture**: Fun Strikes Entertainment LLP

---

## 1. Chosen Subdomain Scheme

The QR codes, printable standees, and digital links are configured for the following 3 branded endpoints:

| Activity / Branch | Live Subdomain URL | Target Destination |
| :--- | :--- | :--- |
| **Pal — Go-Karting Track (18+)** | `https://gokart.nexoraonesolution.com` | `/pal-gokart/` |
| **Pal — Soft Play & Trampoline** | `https://pal.nexoraonesolution.com` | `/pal-trampoline/` |
| **Mota Varachha — Soft Play & Trampoline** | `https://varachha.nexoraonesolution.com` | `/motavarachha-softplay/` |
| **Master Waiver Portal (Optional)** | `https://waiver.nexoraonesolution.com` | `/` (Auto-redirects to Pal Go-Kart) |

---

## 2. DNS Records to Add in Your DNS Provider

Login to your DNS manager (Cloudflare, cPanel, GoDaddy, Hostinger, Namecheap, or AWS Route53) for **`nexoraonesolution.com`**:

### Standard CNAME Records
| Type | Host / Name | Value / Points To | Proxy / TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `gokart` | `funstrikes24-cloud.github.io` | Proxied / Auto |
| **CNAME** | `pal` | `funstrikes24-cloud.github.io` | Proxied / Auto |
| **CNAME** | `varachha` | `funstrikes24-cloud.github.io` | Proxied / Auto |
| **CNAME** | `waiver` | `funstrikes24-cloud.github.io` | Proxied / Auto |

---

## 3. Subdomain Routing Setup

GitHub Pages natively serves **1 custom domain per repository** (via the `CNAME` file). To route the 3 subdomains seamlessly to their respective activities without needing 3 separate repositories:

### Method A: Cloudflare Redirect Rules (Zero-Cost, Recommended)
If your DNS is managed via **Cloudflare**:
1. Go to **Rules → Redirect Rules → Create Rule**.
2. **Rule 1 (Go-Karting)**:
   - Field: `Hostname` | Operator: `equals` | Value: `gokart.nexoraonesolution.com`
   - URL redirect: Type: `Dynamic` (or `Static`) | Target: `https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-gokart/` (Status: `301 Moved Permanently`)
3. **Rule 2 (Pal Trampoline)**:
   - Field: `Hostname` | Operator: `equals` | Value: `pal.nexoraonesolution.com`
   - Target: `https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-trampoline/` (Status: `301`)
4. **Rule 3 (Mota Varachha Trampoline)**:
   - Field: `Hostname` | Operator: `equals` | Value: `varachha.nexoraonesolution.com`
   - Target: `https://funstrikes24-cloud.github.io/fun-strike-waiver/motavarachha-softplay/` (Status: `301`)

### Method B: cPanel / Web Host Subdomain Redirection
If your domain is hosted on **cPanel**:
1. Open **cPanel → Subdomains**.
2. Create:
   - `gokart.nexoraonesolution.com`
   - `pal.nexoraonesolution.com`
   - `varachha.nexoraonesolution.com`
3. Click **Manage Redirection** next to each subdomain:
   - `gokart` ➔ `https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-gokart/`
   - `pal` ➔ `https://funstrikes24-cloud.github.io/fun-strike-waiver/pal-trampoline/`
   - `varachha` ➔ `https://funstrikes24-cloud.github.io/fun-strike-waiver/motavarachha-softplay/`

### Method C: Single Custom Subdomain on GitHub Pages
If you prefer a single custom domain across the whole system:
1. In repo root, add a `CNAME` file with `waiver.nexoraonesolution.com`.
2. Add DNS record: `CNAME waiver -> funstrikes24-cloud.github.io`.
3. In GitHub Settings → Pages: set Custom Domain to `waiver.nexoraonesolution.com` and check **Enforce HTTPS**.

---

## 4. Production Readiness Checklist

- [x] **High-DPI QR Codes Generated**: Encoded with `https://gokart.nexoraonesolution.com`, `https://pal.nexoraonesolution.com`, `https://varachha.nexoraonesolution.com`.
- [x] **Photo Paper A4 Standees Rendered**: Ready to print in `printables/`.
- [x] **Zero Console Errors**: Verified in live Chrome DevTools MCP sessions.
- [x] **Multi-Participant Trampoline Fixed**: Parent + minor addition verified with dynamic age calculations.
- [x] **Strict 18+ Go-Karting Safeguard**: Enforced across UI and backend.
- [x] **Google Drive & Sheets Integration**: Live operations database connected to Surat branches.
