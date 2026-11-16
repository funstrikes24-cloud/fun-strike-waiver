# Fun Strike! Enterprise Google Drive & Google Sheets Database Architecture

This setup provides an automated, multi-branch database for **Fun Strikes Entertainment LLP**, organizing customer waivers across **Pal Branch** and **Mota Varachha Branch** with automatic monthly rotation, year-end consolidation, customer signature archiving, and 1-page printable legal waivers.

---

## 📁 Google Drive Directory Architecture

When you run `setupAllZoneSheets()`, your Google Drive folder **`Fun Strike! Waivers Database`** is automatically structured as follows:

```text
Google Drive
└── 📂 Fun Strike! Waivers Database/                    (Root Master Folder)
    │
    ├── 📂 01 - Live Waivers (Daily Operations)/       (Pinned for Staff & Reception)
    │   ├── 📊 Fun Strike! - Pal - Go-Karting Waivers (18+)
    │   ├── 📊 Fun Strike! - Pal - Trampoline & Soft Play Waivers
    │   └── 📊 Fun Strike! - Mota Varachha - Trampoline & Soft Play Waivers
    │
    ├── 📂 02 - Customer Signatures/                   (Organized Customer Signatures)
    │   ├── 📂 Pal - Go-Karting/                       (e.g., FS-CYD952.png)
    │   ├── 📂 Pal - Trampoline/
    │   └── 📂 Mota Varachha - Trampoline/
    │
    ├── 📂 03 - Monthly Archives/                      (Month-by-Month Backups)
    │   └── 📊 Fun Strike! - YYYY-MM Monthly Waivers (All Branches)
    │
    └── 📂 04 - Yearly Archives/                       (Year-End 12-Month Consolidations)
        ├── 📊 Fun Strike! - YYYY Full Year Combined Waivers (All Branches)
        └── 📂 YYYY Monthly Backups/
```

---

## 📊 Live Spreadsheets Breakdown

| Spreadsheet | Branch | Activity / Zone | Counter Location | Header Color |
| :--- | :--- | :--- | :--- | :--- |
| **`Fun Strike! - Pal - Go-Karting Waivers (18+)`** | Pal (Gauravpath Road, Surat) | **Go-Karting** *(18+ & 5'5"+)* | Pit Lane Check-in Desk | 🔴 Racing Crimson (`#be123c`) |
| **`Fun Strike! - Pal - Trampoline & Soft Play Waivers`** | Pal (Gauravpath Road, Surat) | **Soft Play & Trampoline** *(All Ages)* | Trampoline Reception Desk | 🔵 Electric Cyan (`#0284c7`) |
| **`Fun Strike! - Mota Varachha - Trampoline & Soft Play Waivers`** | Mota Varachha (Surat) | **Soft Play & Trampoline** *(All Ages)* | Trampoline Reception Desk | 🟢 Neon Emerald (`#059669`) |

---

## 📋 Standardized 20-Column Sheet Schema

Every live spreadsheet tab (`YYYY-MM`) uses the following standardized header layout:

| # | Column Name | Format / Sample | Purpose & Rules |
| :---: | :--- | :--- | :--- |
| **1** | **Submitted At** | `2026-11-16 16:26:00` | Exact timestamp of submission (Frozen Column) |
| **2** | **Ref Code** | `FS-CYD952` | Unique short reference ID for wristband verification (Frozen Column) |
| **3** | **Activity / Zone** | `Go-Karting` | Activity zone chosen by the guest |
| **4** | **Branch** | `Gauravpath Road, Pal (Surat)` | Physical branch location |
| **5** | **Primary Participant** | `Prakash patel` | Full legal name of rider or child |
| **6** | **Participant DOB** | `1991-08-10` | Date of birth (`YYYY-MM-DD`) |
| **7** | **Age / Role** | `35 yrs (Adult) — Primary Signer` | Live calculated age and participant role |
| **8** | **Signed By (Parent / Guardian)** | `Prakash patel` | Name of adult signatory |
| **9** | **Mobile Number** | `9909051806` | WhatsApp / SMS contact (formatted as plain text) |
| **10** | **Email ID** | `prakashpatel8446@gmail.com` | Customer email address |
| **11** | **Address** | `Kukani, Surat` | Residential city / address |
| **12** | **Total in Group** | `2` | Total number of jumpers/drivers covered on waiver |
| **13** | **All Participants in Waiver** | `1. Prakash patel... \| 2. Vivek...` | Complete list of all participants in group |
| **14** | **Min Height** | `65 in / 165 cm` | Height verified (Min 5'5" for Go-Karting) |
| **15** | **18+ Policy Acknowledged** | `YES` / `N/A` | **Strict Legal Proof:** Confirms sole liability acknowledged |
| **16** | **Agreed to T&C** | `YES` | Acceptance of general safety rules & damage policy |
| **17** | **Sign Date** | `2026-11-16` | Date of electronic signature |
| **18** | **Sign Time** | `16:26` | Time of electronic signature |
| **19** | **Signature Image** | `✍️ View Signature` | Clickable `=HYPERLINK(...)` opening stored signature PNG in Drive |
| **20** | **Print / View Waiver** | `🖨️ Print Waiver` | Clickable `=HYPERLINK(...)` rendering **1-page printable waiver** with all terms |

---

## ⚙️ Automated Lifecycle: Monthly & Yearly Archiving

### 1. Daily Operations
- All submissions arrive in real-time under the current month tab (`YYYY-MM`).
- First 2 rows (Headers) and first 2 columns (`Submitted At` & `Ref Code`) are frozen so staff can scroll through large datasets without losing context.

### 2. Monthly Rotation (Automatic on 1st of Every Month at 00:00)
- Triggers function `onMonthlyRotation`.
- Creates a new `YYYY-MM` tab in all 3 live spreadsheets.
- Consolidates the completed previous month's data across all 3 sheets into **`03 - Monthly Archives / Fun Strike! - YYYY-MM Monthly Waivers (All Branches)`**.

### 3. Year-End Transfer (Automatic on January 1st at 01:00 or Manual)
- Triggers function `transferYearToArchiveFile`.
- Combines all 12 monthly tabs (`YYYY-01` through `YYYY-12`) from all 3 live spreadsheets into a single master file: **`04 - Yearly Archives / Fun Strike! - YYYY Full Year Combined Waivers (All Branches)`**.
- Safely clears the finished year's tabs from the 3 live spreadsheets, leaving them lean, fast, and ready for the new year.

---

## 🚀 Setup & Deployment Instructions

### Step 1: Paste Code into Apps Script
1. Open your Google Sheet → **Extensions → Apps Script**.
2. Replace all code in `Code.gs` with [`google-apps-script/Code.gs`](../google-apps-script/Code.gs).
3. Save (`Ctrl + S`).

### Step 2: Initialize Drive Folders & Live Sheets
1. In the function dropdown, select **`setupAllZoneSheets`** and click **Run**.
2. Accept permissions when prompted.
3. Your Google Drive now contains the complete **`Fun Strike! Waivers Database`** directory tree with all 3 live spreadsheets inside `01 - Live Waivers (Daily Operations)`.

### Step 3: Deploy as Web App
1. Click **Deploy → New deployment**.
2. Select type: **Web app**.
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
3. Click **Deploy** and copy the **Web app URL**.
4. Paste this URL into `DEFAULT_GOOGLE_SCRIPT_URL` inside [`assets/js/app.js`](../assets/js/app.js).
5. When updating code in the future: Click **Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy**.

### Step 4: Share with Manager
- Run function **`shareFolderWithManager`** (or use the custom spreadsheet menu **Fun Strike! Waiver → Share Drive Folder**).
- This grants Editor access to `pandyaaryanp348@gmail.com` across the root folder and all subfolders automatically.
