# Fun Strike! — Live Domain & DNS Configuration Guide
**Root Domain**: `nexoraonesolution.com`  
**Brand Portal**: `funstrike.nexoraonesolution.com`  
**Brand Architecture**: Fun Strikes Entertainment LLP

---

## 1. Subdomain Scheme (`*.funstrike.nexoraonesolution.com`)

The QR codes, printable photo-paper standees, and links are configured for:

| Activity / Branch | Live Branded Subdomain URL | Target Destination |
| :--- | :--- | :--- |
| **Pal — Go-Karting Track (18+)** | `https://gokart.funstrike.nexoraonesolution.com` | `/pal-gokart/` |
| **Pal — Soft Play & Trampoline** | `https://pal.funstrike.nexoraonesolution.com` | `/pal-trampoline/` |
| **Mota Varachha — Trampoline** | `https://varachha.funstrike.nexoraonesolution.com` | `/motavarachha-softplay/` |
| **Master Portal Root** | `https://funstrike.nexoraonesolution.com` | `/` (Auto-redirects to Pal Go-Kart) |

---

## 2. DNS Records to Add in Your DNS Manager

Open your DNS Manager (Cloudflare, cPanel, Hostinger, GoDaddy, or Namecheap) for **`nexoraonesolution.com`**:

### CNAME Records Table
| Type | Host / Name | Target / Points To | TTL / Proxy | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `funstrike` | `funstrikes24-cloud.github.io` | Proxied / Auto | Master Waiver Portal |
| **CNAME** | `gokart.funstrike` | `funstrikes24-cloud.github.io` | Proxied / Auto | Pal Go-Karting (18+) |
| **CNAME** | `pal.funstrike` | `funstrikes24-cloud.github.io` | Proxied / Auto | Pal Trampoline |
| **CNAME** | `varachha.funstrike` | `funstrikes24-cloud.github.io` | Proxied / Auto | Mota Varachha Trampoline |

*(Note: In DNS managers, enter `gokart.funstrike` in the Host field to create `gokart.funstrike.nexoraonesolution.com`)*

---

## 3. Subdomain Routing Setup

Because GitHub Pages serves one custom domain per repo (configured via the `CNAME` file pointing to `funstrike.nexoraonesolution.com`), routing the 3 subdomains is done with instant redirection rules:

### Method A: Cloudflare Redirect Rules (Recommended & Zero Cost)
If your DNS is managed via **Cloudflare**:
1. Go to **Rules → Redirect Rules → Create Rule**.
2. **Rule 1 (Pal Go-Karting 18+)**:
   - Field: `Hostname` | Operator: `equals` | Value: `gokart.funstrike.nexoraonesolution.com`
   - URL redirect: `Static` | Target: `https://funstrike.nexoraonesolution.com/pal-gokart/` (Status: `301`)
3. **Rule 2 (Pal Trampoline & Soft Play)**:
   - Field: `Hostname` | Operator: `equals` | Value: `pal.funstrike.nexoraonesolution.com`
   - Target: `https://funstrike.nexoraonesolution.com/pal-trampoline/` (Status: `301`)
4. **Rule 3 (Mota Varachha Trampoline)**:
   - Field: `Hostname` | Operator: `equals` | Value: `varachha.funstrike.nexoraonesolution.com`
   - Target: `https://funstrike.nexoraonesolution.com/motavarachha-softplay/` (Status: `301`)

### Method B: cPanel Subdomain Redirection
If your domain is hosted on **cPanel**:
1. Open **cPanel → Subdomains**.
2. Create `gokart.funstrike`, `pal.funstrike`, and `varachha.funstrike`.
3. In **Manage Redirection**:
   - `gokart.funstrike` ➔ `https://funstrike.nexoraonesolution.com/pal-gokart/`
   - `pal.funstrike` ➔ `https://funstrike.nexoraonesolution.com/pal-trampoline/`
   - `varachha.funstrike` ➔ `https://funstrike.nexoraonesolution.com/motavarachha-softplay/`

---

## 4. GitHub Pages Custom Domain Verification

The repository includes a root `CNAME` file containing `funstrike.nexoraonesolution.com`.
Once your DNS `CNAME funstrike -> funstrikes24-cloud.github.io` propagates (usually 1-5 minutes):
1. In GitHub Repository → **Settings** → **Pages**.
2. Under **Custom domain**, ensure `funstrike.nexoraonesolution.com` is verified.
3. Check **Enforce HTTPS**.
