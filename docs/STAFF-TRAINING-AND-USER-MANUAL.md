# 🏎️ Fun Strike! Game Zone — Staff Training Module & Operating Manual
### Fun Strikes Entertainment LLP • Surat, Gujarat
*Official Operational Standard Operating Procedure (SOP) & Training Guide for Reception, Cashiers, Track Marshals & Duty Managers*

---

## 📖 Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Role-Based Responsibilities Matrix](#2-role-based-responsibilities-matrix)
3. [Step-by-Step Customer Journey (Walk-in to Play)](#3-step-by-step-customer-journey)
4. [Activity-Specific Operational Protocols](#4-activity-specific-operational-protocols)
   - [A. Go-Karting Track (18+)](#a-go-karting-track-18-sop)
   - [B. Trampoline Arena & Soft Play Park](#b-trampoline-arena--soft-play-sop)
5. [Cashier & Reception Counter SOP](#5-cashier--reception-counter-sop)
6. [Customer Dialogue Scripts & Objection Handling](#6-customer-dialogue-scripts--objection-handling)
7. [Google Sheets Live Dashboard & One-Click Printing](#7-google-sheets-live-dashboard--one-click-printing)
8. [Marshal Track / Arena Clearance Station SOP](#8-marshal-track--arena-clearance-station-sop)
9. [Customer Troubleshooting & Edge Cases](#9-customer-troubleshooting--edge-cases)
10. [Emergency, Injury & Equipment Breakage Protocol](#10-emergency-injury--equipment-breakage-protocol)
11. [Shift Handover & Daily Closing Checklist](#11-shift-handover--daily-closing-checklist)
12. [Staff Onboarding Comprehension Quiz](#12-staff-onboarding-comprehension-quiz)
13. [Escalation Matrix & Key Contacts](#13-escalation-matrix--key-contacts)

---

## 1. System Overview & Architecture

**Fun Strike! Game Zone** operates a 100% digital, paperless, legally binding participant waiver and queue management platform compliant with the **Indian Information Technology Act, 2000 (Sections 4 & 10A)** and the **Digital Personal Data Protection Act, 2023 (DPDP Act)**.

```text
[ Customer Arrives at Venue ]
          │
          ▼
[ Scans Branch QR Code on Counter Standee ]
          │
          ▼
[ Fills Mobile-Responsive Digital Waiver on Smartphone ]
          │
          ▼
[ Digitally Signs with Finger / Stylus & Submits ]
          │
          ├─────────────────────────────────────────────────┐
          ▼                                                 ▼
[ Customer Screen: Instant Ref Code ]     [ Google Sheets Dashboard (Real-time) ]
(e.g., FS-QM4B9Z)                                  │
                                                    ▼
                                          [ Cashier Clicks "🖨️ Print Legal Waiver" ]
                                                    │
                                                    ▼
                                          [ High-Definition 2-3 Page Legal Contract ]
                                                    │
                                                    ▼
                                          [ Marshal Clearance & Wristband Issued ]
```

### Why Digital Waivers?
1. **Zero Paper Clutter**: No physical clipboards or lost indemnity sheets.
2. **Instant Searchability**: Search any customer by name, mobile, or reference code in $< 2$ seconds.
3. **Legal Ironclad Protection**: Captures digital signatures, timestamp in IST, IP address, and security audit hashes.
4. **Group Check-in**: One parent or group leader can register up to 20 riders/jumpers in a single submission.

---

## 2. Role-Based Responsibilities Matrix

| Role | Primary Responsibility | Daily Tools | Key Performance Metrics |
| :--- | :--- | :--- | :--- |
| **Reception / Cashier** | Greet guests, guide QR scanning, verify waiver rows in Google Sheets, issue wristbands, collect payment. | Google Sheets Terminal, Ticket POS, A4 Standees, Cash/Card POS | Queue time $< 60\text{ sec}$ per guest; 100% waiver verification rate. |
| **Pit Lane Marshal (Karting)** | Verify driver age (18+), enforce height ($\ge 5\text{ ft } 5\text{ in}$), inspect helmets & closed shoes, conduct track flag briefing. | Height Measuring Post, Helmets, Hair Ties, Remote Engine Cutoff | Zero shoe/hair safety violations; 100% helmet buckle compliance. |
| **Court Monitor (Trampoline)** | Enforce grip socks, verify empty pockets, maintain 1 person per mat, oversee foam pit jumps, protect toddler zone. | Whistle, Grip Socks Inventory, Toddler Zone Barrier | Zero double-bouncing accidents; 100% grip sock compliance. |
| **Duty Manager** | Supervise daily queue flow, audit Google Sheets records, resolve customer escalations, manage damage assessments. | Master Google Sheet, Incident Log, CCTV Monitoring Station | Accurate daily reconciliations; zero unresolved safety incidents. |

---

## 3. Step-by-Step Customer Journey

### Step 1: Counter Greeting & QR Scan
1. Receptionist greets the guest warmly:
   > *"Welcome to Fun Strike! Please scan this QR code on the counter with your phone to complete your quick safety check-in before we issue your tickets."*
2. Customer points phone camera at the acrylic counter standee.
3. The official branch portal opens instantly in mobile Safari / Chrome (no app installation needed).

### Step 2: Customer Fills the Mobile Form
1. **Primary Signer Details**: Full Legal Name, 10-Digit Mobile Number, Date of Birth, and Address/City.
2. **Family & Group Members**:
   * If visiting alone: Check *"Primary signer is jumping/driving"*.
   * If accompanied by friends or children: Click **`+ Add Another Driver / Child`** (up to 19 additional participants).
3. **Safety Rules Review**: Clear bullet points detailing track/arena safety rules and financial liabilities.
4. **Touch Signature**: The customer signs on their touchscreen using their finger.
5. **Submit**: Customer taps the large blue button (e.g., **`Submit Go-Karting Waiver`**).

### Step 3: Instant Confirmation & Reference Code
1. The submission completes in $< 1.5$ seconds.
2. A green checkmark screen displays their unique **6-Character Reference Code** (e.g., `FS-QM4B9Z`).
3. Customer shows this code or their mobile number to the cashier.

### Step 4: Cashier Verification in Google Sheets
1. Cashier opens the **Fun Strike! Master Waiver Google Sheet**.
2. The row appears automatically at the top:
   * **Timestamp**: Exact IST time of submission.
   * **Reference Code**: Matches customer's phone.
   * **Activity & Branch**: Confirms activity ticket match.
   * **Participant Breakdown**: Confirms exact number of wristbands to dispense.
3. Cashier issues color-coded wristbands, processes payment, and directs guest to the pit lane or arena staging area.

---

## 4. Activity-Specific Operational Protocols

### A. Go-Karting Track (18+) SOP
> [!IMPORTANT]
> **Strict 18+ Age Policy**: High-speed motorized karting is strictly engineered and operated for adult drivers aged 18 and older.

1. **Mandatory Height Check**:
   * Single-kart drivers must stand against the pit lane height scale and meet the minimum height of **$5\text{ ft } 5\text{ in}$ ($165\text{ cm}$)**.
   * Drivers under $5\text{ ft } 5\text{ in}$ are physically unable to reach pedals safely and must be redirected to alternate venue games.
2. **Mandatory Footwear Inspection**:
   * **Closed-toe shoes are compulsory** at all times.
   * Strictly prohibited: Crocs, flip-flops, sandals, slides, high heels, and bare feet.
3. **Attire & Hair Security**:
   * Long hair (shoulder length or longer) must be tied securely into a bun or tucked inside the racing jacket/helmet.
   * Loose clothing, dupattas, scarves, loose jackets, and dangling keychains must be removed and placed in venue lockers.
4. **Full-Face Helmet Protocol**:
   * Sized correctly (no loose wobble) and chin strap securely fastened prior to engine start.
5. **Track Flags Briefing**:
   * 🟡 **Yellow Flag**: Hazard / caution ahead — slow down immediately, **NO OVERTAKING**.
   * 🔴 **Red Flag**: Track blocked / emergency — bring kart to a complete stop where you are.
   * 🏁 **Checkered Flag**: Race finished — slow down to walking speed and enter pit lane.
6. **Zero-Tolerance Bumping Policy**:
   * Intentional ramming or drifting into safety barriers results in immediate remote engine shutdown and ejection without refund.

---

### B. Trampoline Arena & Soft Play SOP
> [!IMPORTANT]
> **Non-Slip Grip Socks Compulsory**: Bare feet, street footwear, and regular socks are strictly prohibited on trampoline beds.

1. **Grip Sock Verification**:
   * Inspect soles: Must have rubber traction grip dots.
   * If customer has standard socks, they must purchase approved Fun Strike! grip socks at reception.
2. **Empty Pockets Protocol**:
   * Every jumper must completely empty pockets: mobile phones, coins, keys, pens, lighters, and jewelry must be placed in cubbies.
3. **One Person Per Trampoline Bed**:
   * Strictly 1 person per mat. Never permit two jumpers on the same mat to prevent catastrophic "double-bouncing" fractures.
4. **Foam Pit & Airbag Safety**:
   * Somersaults, backflips, and inverted aerial stunts are prohibited.
   * Head-first diving is strictly prohibited. Jumpers must land on their feet or seated bottom.
   * Verify the foam pit is completely clear of other guests before jumping.
5. **Toddler Soft Play Separation**:
   * Soft Play zone is exclusively for kids under 5 years old.
   * Teenagers and adults are prohibited from bouncing or playing inside toddler enclosures.

---

## 5. Cashier & Reception Counter SOP

### Daily Opening Checklist (10:30 AM)
- [ ] Inspect acrylic counter standees: Ensure clean, unscratched, and properly displayed at each register.
- [ ] Log into counter terminal and open Google Sheet: `Fun Strike! Waiver Master Dashboard`.
- [ ] Perform 1 live mobile test submission to confirm internet connectivity and $< 2\text{ sec}$ sync.
- [ ] Verify counter thermal/A4 printer has paper loaded and ink/toner is ready.
- [ ] Check wristband dispenser inventory (verify colors for Go-Karting vs Trampoline).

### Verifying a Walk-in Customer:
```text
1. Ask guest: "May I have your 6-character Reference Code or registered mobile number?"
2. In Google Sheet, press [Ctrl + F] and paste the code/mobile.
3. Verify:
   - Branch: Pal or Mota Varachha
   - Activity: Go-Karting or Trampoline
   - Total Participants: Count matches tickets requested
4. Issue wristbands -> Collect payment -> Provide locker key/grip socks.
```

---

## 6. Customer Dialogue Scripts & Objection Handling

### Scenario 1: Customer asks "Why do I have to fill this on my phone?"
> **Staff Script**:  
> *"Sir/Ma'am, for your safety and fast track access, Fun Strike! uses a 100% digital safety check-in. It takes only 45 seconds on your phone, covers your entire family or group on one form, and ensures your wristbands are ready without waiting in a long line!"*

### Scenario 2: Parent signing for minor children
> **Staff Script**:  
> *"Please enter your name as the Primary Signer at the top. If you are not jumping/driving yourself, just leave the box unchecked and click '+ Add Another Child' for each kid. One signature covers all of them!"*

### Scenario 3: Customer's phone battery is dead or has no internet
> **Staff Script**:  
> *"No problem at all! You can connect to our free high-speed guest Wi-Fi ('FunStrike_Guest'), or you can use our reception tablet right here on the counter to complete it."*

### Scenario 4: Under-18 customer wants to drive Go-Karts alone
> **Staff Script**:  
> *"Our high-speed karts are regulated for drivers aged 18 and older. An adult parent or legal guardian must be present to sign the legal assumption of liability. If you'd like, we have amazing arcade games and trampoline attractions available!"*

---

## 7. Google Sheets Live Dashboard & One-Click Printing

### The Master Sheet Column Reference:
| Col | Field Header | Data Captured |
| :---: | :--- | :--- |
| **A** | **Timestamp** | Submission date & exact IST time (e.g., `16/11/2026 17:15:30`) |
| **B** | **Waiver Ref Code** | 6-character unique identifier (e.g., `FS-QM4B9Z`) |
| **C** | **Branch & Location** | `Pal (Gauravpath Road)` or `Mota Varachha` |
| **D** | **Activity** | `Go-Karting (18+)` or `Soft Play & Trampoline` |
| **E** | **Full Legal Name** | Primary signer / parent / guardian name |
| **F** | **Mobile Number** | 10-digit verified contact number |
| **G** | **Email ID** | Optional customer email address |
| **H** | **DOB & Age** | Birthdate and computed age in years |
| **I** | **Total Participants** | Total count of drivers/jumpers covered |
| **J** | **All Riders Breakdown** | List of all individual participants and categories |
| **K** | **Digital Signature** | In-cell preview of the captured digital signature |
| **L** | **Terms & 18+ Ack** | Legal confirmation (`CONFIRMED & AGREED`) |
| **M** | **Action Button** | **`🖨️ Print Legal Waiver`** (One-click high-def printable) |

### How to Print a Physical Contract:
1. In the customer's row, click the **`🖨️ Print Legal Waiver`** link in **Column M**.
2. A framed, official A4 document opens in a new browser tab.
3. Click the red **Print Legal Document** button (or press `Ctrl + P`).
4. Select printer $\rightarrow$ Paper size `A4` $\rightarrow$ Margins `Minimum` $\rightarrow$ Click **Print**.

---

## 8. Marshal Track / Arena Clearance Station SOP

When a physical printout is required for corporate bookings, large school groups, or VIP racing heats:

1. **Review Schedule II**: Ensure every participant entering the track or arena is registered on the paper.
2. **Execute Safety Check**:
   * **Go-Karting**: Verify Helmet Sized & Strapped, Closed-Toe Shoes, Height $\ge 5\text{'}5\text{"}$, Flags Briefing.
   * **Trampoline**: Verify Grip Socks, Pockets Emptied, 1-per-mat rule acknowledged.
3. **Sign & Stamp**:
   * Marshal initials the physical clearance box at the bottom.
   * Stamp or mark: **`STATUS: CLEARED FOR TRACK`** or **`STATUS: CLEARED FOR ARENA`**.
4. **Filing**: Deposit executed physical waivers into the daily date-indexed pit lane binder.

---

## 9. Customer Troubleshooting & Edge Cases

| Issue / Error | Root Cause | Staff Resolution |
| :--- | :--- | :--- |
| **Form shows error: "Signature is required"** | Customer pressed submit without drawing signature. | Ask customer to sign inside the outlined white signature box using their finger. |
| **Spelling mistake in customer name** | Customer typo during mobile typing. | Cashier locates customer row in Google Sheet $\rightarrow$ double-clicks name cell $\rightarrow$ edits name directly. |
| **Customer cannot find reference code** | Customer closed browser tab prematurely. | Cashier searches by customer's 10-digit mobile number in Google Sheet (`Ctrl + F`). |
| **Customer's child is 4 years old for trampoline** | Child is under the general arena recommended age. | Direct parent to the dedicated Soft Play Toddler Zone where padded equipment is designed for toddlers. |

---

## 10. Emergency, Injury & Equipment Breakage Protocol

### In the Event of an Injury:
1. **Immediate Halt**: Marshal blows whistle or signals track RED FLAG. All activity stops instantly.
2. **First Aid**: Certified on-duty first aider attends to the participant immediately.
3. **Retrieve Waiver**: Cashier searches reference code in Google Sheet $\rightarrow$ Prints signed waiver.
4. **Emergency Transport**: Under **Clause 9 (Emergency Medical Consent)**, Fun Strike! staff are authorized to call 108 ambulance transport to the nearest hospital at customer expense if required.

### In the Event of Kart / Facility Breakage:
1. Under **Clause 4 (Customer Property Damage & Breakage Liability)**, participants are legally bound to pay for damages resulting from intentional collisions, reckless ramming, or disobeying marshals.
2. Duty Manager conducts immediate assessment with the head mechanic.
3. Present damage assessment invoice to customer before facility departure, referencing their signed digital waiver.

---

## 11. Shift Handover & Daily Closing Checklist

### Daily Closing (11:00 PM)
- [ ] **Wristband Reconciliation**: Total wristbands issued must match total participant count in Google Sheets.
- [ ] **Physical Waiver Filing**: Any printed corporate/incident waivers must be placed in the locked manager archive.
- [ ] **Equipment Inspection**:
  * All go-kart helmets sanitized and placed on drying racks.
  * Trampoline mats inspected for tears or spring exposures.
- [ ] **Terminal Shutdown**: Ensure Google Sheet is saved and browser tabs logged out.
- [ ] **Acrylic Standees**: Wipe clean with microfiber cloth; ensure no scratches or marker stains.

---

## 12. Staff Onboarding Comprehension Quiz

*Every new cashier and marshal must score 5/5 before commencing independent shifts:*

1. **What is the minimum height requirement for single-seat Go-Karting?**  
   *Answer*: $5\text{ ft } 5\text{ in}$ ($165\text{ cm}$).

2. **Can a customer drive Go-Karts wearing Crocs or sandals?**  
   *Answer*: Absolutely not. Closed-toe shoes are 100% compulsory.

3. **What does a Yellow Flag mean on the Go-Kart track?**  
   *Answer*: Hazard on track — slow down immediately and maintain position (strictly NO overtaking).

4. **Are regular cotton socks allowed on the trampoline beds?**  
   *Answer*: No. Non-slip grip socks with rubber traction soles are mandatory.

5. **Where does a cashier find the customer's signed waiver if physical proof is needed?**  
   *Answer*: In the Google Sheet dashboard, click the `🖨️ Print Legal Waiver` button in Column M.

---

## 13. Escalation Matrix & Key Contacts

| Escalation Level | Contact Person | Role | Phone / Channel |
| :--- | :--- | :--- | :--- |
| **Level 1 (Immediate Ground)** | On-Duty Shift Lead | Queue flow & minor customer queries | Internal Intercom Ext. 101 |
| **Level 2 (Management)** | Venue Duty Manager | Equipment damage, safety ejection, refunds | +91 76005 57671 |
| **Level 3 (Medical Emergency)** | Emergency Medical Services | Ambulance & Trauma Response | **108 / 112** |
| **Level 4 (Technical Support)** | NexoraOneSolution / Aryan | Cloud sheets, DNS, or server sync issues | tech@nexoraonesolution.com |

---

<div align="center">
  <p>
    <strong>Fun Strikes Entertainment LLP &bull; Surat, Gujarat</strong><br />
    Operational Manual Version 2.5.0 &bull; Approved for Venue Use<br />
    Made with ❤️ by <a href="https://www.linkedin.com/in/aryanpandya"><strong>Aryan</strong></a> and <a href="https://nexoraonesolution.com/"><strong>NexoraOneSolution</strong></a>
  </p>
</div>
