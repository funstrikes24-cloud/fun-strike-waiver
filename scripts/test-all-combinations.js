const fs = require('fs');
const path = require('path');

const GAS_URL = "https://script.google.com/macros/s/AKfycbztd1Rd24z1eOcgSy54XPOEDmV00DI7LC_-WlB-mpsKlf-GmEPnxe9OsAtA1xRoyMpuug/exec";

// Minimal valid PNG data URI for testing signature
const DUMMY_SIG_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyCAYAAACF0L/jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA3SURBVHhe7cExAQAAAMKg9U9tDQ8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgFcDD54AATH4w70AAAAASUVORK5CYII=";

function generateRefCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FS-${code}`;
}

const testCases = [
  {
    name: "TC-01: Go-Karting Single Adult (Pal) - Valid",
    payload: {
      refCode: generateRefCode(),
      zone: "gokart",
      activity: "Go-Karting",
      branch: "Gauravpath Road, Pal (Surat)",
      fullName: "Aarav Sharma",
      dob: "1996-04-12",
      mobileNumber: "9876543210",
      emailId: "aarav.sharma@example.com",
      address: "102, Shivalik Heights, Pal, Surat",
      primaryIsRiding: true,
      totalRiders: 1,
      riders: [
        { name: "Aarav Sharma", dob: "1996-04-12", age: 30, relation: "Primary Signer" }
      ],
      minHeightIn: "66",
      minHeightCm: "168",
      agreeGokart18: true,
      agreed: true,
      signDate: "2026-11-16",
      signTime: "17:15:00",
      guestSignature: DUMMY_SIG_PNG,
      hpWebsite: ""
    },
    expectedSync: true
  },
  {
    name: "TC-02: Go-Karting Multi Adult Group (Pal) - Valid",
    payload: {
      refCode: generateRefCode(),
      zone: "gokart",
      activity: "Go-Karting",
      branch: "Gauravpath Road, Pal (Surat)",
      fullName: "Rajesh Patel",
      dob: "1992-08-20",
      mobileNumber: "9825012345",
      emailId: "rajesh.patel@example.com",
      address: "Flat 401, Galaxy Tower, Adajan, Surat",
      primaryIsRiding: true,
      totalRiders: 2,
      riders: [
        { name: "Rajesh Patel", dob: "1992-08-20", age: 34, relation: "Primary Signer" },
        { name: "Chirag Mehta", dob: "1994-01-15", age: 32, relation: "Friend" }
      ],
      minHeightIn: "68",
      minHeightCm: "172",
      agreeGokart18: true,
      agreed: true,
      signDate: "2026-11-16",
      signTime: "17:16:00",
      guestSignature: DUMMY_SIG_PNG,
      hpWebsite: ""
    },
    expectedSync: true
  },
  {
    name: "TC-03: Pal Trampoline Parent + 2 Children - Valid",
    payload: {
      refCode: generateRefCode(),
      zone: "softplay",
      activity: "Soft Play & Trampoline",
      branch: "Gauravpath Road, Pal (Surat)",
      fullName: "Neha Desai",
      dob: "1988-11-05",
      mobileNumber: "9909988776",
      emailId: "neha.desai@example.com",
      address: "B-22, Green Avenue, VIP Road, Vesu, Surat",
      primaryIsRiding: false, // Parent not jumping, signing as guardian
      totalRiders: 2,
      riders: [
        { name: "Vihaan Desai", dob: "2018-06-10", age: 8, relation: "Son" },
        { name: "Ananya Desai", dob: "2021-02-14", age: 5, relation: "Daughter" }
      ],
      minHeightIn: "",
      minHeightCm: "",
      agreeGokart18: null,
      agreed: true,
      signDate: "2026-11-16",
      signTime: "17:17:00",
      guestSignature: DUMMY_SIG_PNG,
      hpWebsite: ""
    },
    expectedSync: true
  },
  {
    name: "TC-04: Mota Varachha Trampoline Family (3 Kids) - Valid",
    payload: {
      refCode: generateRefCode(),
      zone: "softplay",
      activity: "Soft Play & Trampoline",
      branch: "Mota Varachha, Surat",
      fullName: "Mitesh Vaghani",
      dob: "1985-03-25",
      mobileNumber: "9712345678",
      emailId: "mitesh.vaghani@example.com",
      address: "Row House 14, Radhika Residency, Mota Varachha, Surat",
      primaryIsRiding: true, // Parent jumping too
      totalRiders: 4,
      riders: [
        { name: "Mitesh Vaghani", dob: "1985-03-25", age: 41, relation: "Primary Signer" },
        { name: "Kavya Vaghani", dob: "2015-09-12", age: 11, relation: "Daughter" },
        { name: "Dev Vaghani", dob: "2017-12-04", age: 9, relation: "Son" },
        { name: "Rudra Vaghani", dob: "2020-04-18", age: 6, relation: "Son" }
      ],
      minHeightIn: "",
      minHeightCm: "",
      agreeGokart18: null,
      agreed: true,
      signDate: "2026-11-16",
      signTime: "17:18:00",
      guestSignature: DUMMY_SIG_PNG,
      hpWebsite: ""
    },
    expectedSync: true
  },
  {
    name: "TC-05: Missing Signature (Should Fail Validation)",
    payload: {
      refCode: generateRefCode(),
      zone: "gokart",
      activity: "Go-Karting",
      branch: "Gauravpath Road, Pal (Surat)",
      fullName: "Incomplete User",
      dob: "1995-01-01",
      mobileNumber: "9876543210",
      emailId: "incomplete@example.com",
      address: "Surat",
      primaryIsRiding: true,
      totalRiders: 1,
      riders: [{ name: "Incomplete User", dob: "1995-01-01", age: 31, relation: "Primary Signer" }],
      minHeightIn: "66",
      minHeightCm: "168",
      agreeGokart18: true,
      agreed: true,
      signDate: "2026-11-16",
      signTime: "17:19:00",
      guestSignature: "", // EMPTY SIGNATURE
      hpWebsite: ""
    },
    expectedSync: false
  },
  {
    name: "TC-06: Honeypot Anti-Spam Bot Trigger (Should Fail)",
    payload: {
      refCode: generateRefCode(),
      zone: "gokart",
      activity: "Go-Karting",
      branch: "Gauravpath Road, Pal (Surat)",
      fullName: "Spam Bot",
      dob: "1990-01-01",
      mobileNumber: "9999999999",
      emailId: "bot@spam.com",
      address: "Spam Land",
      primaryIsRiding: true,
      totalRiders: 1,
      riders: [{ name: "Spam Bot", dob: "1990-01-01", age: 36, relation: "Primary Signer" }],
      agreed: true,
      signDate: "2026-11-16",
      signTime: "17:20:00",
      guestSignature: DUMMY_SIG_PNG,
      hpWebsite: "http://spam-link.com" // BOT FILLED HONEYPOT
    },
    expectedSync: false
  }
];

async function runTests() {
  console.log("==================================================================");
  console.log("  FUN STRIKE! DIGITAL WAIVER - AUTOMATED COMBINATION TEST RUNNER  ");
  console.log("==================================================================");
  console.log(`Endpoint: ${GAS_URL}\n`);

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    process.stdout.write(`Testing: ${tc.name} ... `);
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(tc.payload)
      });

      const text = await res.text();
      let json = {};
      try {
        json = JSON.parse(text);
      } catch (e) {
        json = { raw: text };
      }

      const isOk = json.ok !== false && json.success !== false && !json.error;

      if (isOk === tc.expectedSync) {
        console.log(`✅ PASSED (Result: ${isOk ? "Accepted" : "Rejected as expected"})`);
        if (isOk) {
          console.log(`   └─ Ref: ${tc.payload.refCode} | Stream: ${json.stream || "ok"} | Tab: ${json.monthTab || "current"}`);
        }
        passed++;
      } else {
        console.log(`❌ FAILED (Expected: ${tc.expectedSync}, Got: ${isOk}, Response: ${JSON.stringify(json)})`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
      failed++;
    }

    // Small delay between requests to respect Google Apps Script concurrency
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log("\n==================================================================");
  console.log(`Test Summary: Total: ${testCases.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log("==================================================================");
}

runTests();
