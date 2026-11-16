# Fun Strike! Google Sheets & Archive Setup Guide

This setup keeps **2 live Google Spreadsheets** for daily operational use (**Go-Karting** and **Soft Play & Trampoline**), organizes submissions by branch (**Pal** and **Mota Varachha**), creates a **`Monthly Archives`** folder for month-by-month snapshots, and at **year end transfers** all 12 months into **`Yearly Archives`** while keeping your live sheets clean and ready for the new year.

---

## Step 1: Paste & Save `Code.gs`
1. Open your Google Sheet's **Extensions → Apps Script** (or your existing Apps Script project).
2. Replace everything in `Code.gs` with the full contents of [`Code.gs`](google-apps-script/Code.gs) and click **Save** (`Ctrl+S`).

## Step 2: Run Setup (Creates `Monthly Archives` + `Yearly Archives` + Triggers)
1. Select **`setupAllZoneSheets`** (or `setupAllThreeZoneSheets`) in the top function dropdown and click **Run** (accept permissions if prompted).
2. Your **`Fun Strike! Waivers Database`** folder in Google Drive now contains:
   - **`Monthly Archives/`** — automatic monthly snapshot file (`Fun Strike! - YYYY-MM Monthly Waivers`) created on the 1st of every month.
   - **`Yearly Archives/`** — automatic 1-Year Combined file (`Fun Strike! - YYYY Full Year Combined Waivers`) created on Jan 1st.
   - **`Fun Strike! - Go-Karting Waivers`** *(live sheet, kept as-is with monthly tabs `YYYY-MM`)*
   - **`Fun Strike! - Soft Play & Trampoline Waivers`** *(live sheet, kept as-is with monthly tabs `YYYY-MM`)*

## Step 3: Deploy / Update Web App
- **First time:** **Deploy → New deployment → Web app** (`Execute as: Me`, `Who has access: Anyone`) → copy the Web App URL into `DEFAULT_GOOGLE_SCRIPT_URL` in [`app.js`](app.js).
- **When updating `Code.gs` later:** Click **Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy** (keeps your exact same Web App URL!).

## Step 4: How Monthly & Year-End Transfers Work
- **Every Month (Automatic on 1st at 00:00, or run `onMonthlyRotation`):**
  - Opens a new `YYYY-MM` tab inside both live sheets.
  - Saves a monthly snapshot of the previous month into **`Monthly Archives`**.
- **Every Year End (Automatic on Jan 1st at 01:00, or via menu `Transfer Full Year Into Yearly Archives...`):**
  - Combines all 12 monthly tabs (`YYYY-01` .. `YYYY-12`) from both sheets into **`Yearly Archives / Fun Strike! - YYYY Full Year Combined Waivers`**.
  - Moves that year's files from `Monthly Archives` into `Yearly Archives / YYYY Monthly Files`.
  - Deletes the finished year's `YYYY-*` tabs from the live sheets while keeping the **live spreadsheets as-is** and ready for the new year.
- **Print Any Row Anytime:** Select any row in any sheet and click **Fun Strike! Waiver → Print Selected Row (Waiver Form)**.
