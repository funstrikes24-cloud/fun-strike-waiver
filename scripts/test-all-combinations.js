const fs = require('fs');
const path = require('path');

const GAS_URL = "https://script.google.com/macros/s/AKfycbztd1Rd24z1eOcgSy54XPOEDmV00DI7LC_-WlB-mpsKlf-GmEPnxe9OsAtA1xRoyMpuug/exec";

// Realistic black ink signature PNG data URI for testing
const DUMMY_SIG_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAABQBAMAAAD1ZgXIAAAALVBMVEUAAAAMDAwfHx86Ojo/Pz9AQEBISEhMTExVVVVdXV1lZWVxcXF5eXl+fn6AgIC1/517AAAABXRSTlP///8A/v5/qAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA45JREFUaN7t2T+LGkEcwPFVLLeFw4WwO5hG3mEuk85m0Q2Y1e8gbCF4N8jNIXeT3K5iYxCE4D024A2s5S18A19hB3Z37o+7f5f9W931e5gZlhl+zLg0e/f27p89f3z9+vXr1/f/7h7gX/f/3R0eHzu4e+y5O+iOu5d3eLz7eXfs6+57N8R/3F35h3f/8r4ZgK9X77gG/3a/0h33L+/u/b2P13c49N043bvf77271/f1C3q5e6+v466fXl1ff71ePfeR1894d+e7e72/f/V69fq1h/e7H16vX394vXr95XX69f21/4aP/wK+1/305vX9119++vT186eP37397e5V13c/ff3w5vX1l9dfPn39fOf18/v7q65ffnr78c3rr19/fv3p9efXe++3f/1+7224fv7p9fPn91+e994e4/218fcf1+uPv3/3+vvH717v8L3h57cfXn/59Pbn9z+9/v7j3ft/u+vXb97ff/v59ev7j7+9f7/1+6vj72/e//b5/ceP7//648O3e69ff/7u4x+/ffzh/eeP715df/n9x6/3P3378fr17z99/fHt9ev7t3/euf/t/sO319fvP7x5+9vX/3j/t/f1q+vvP7z57fXb3/782+f3P3337f71x6tvrz89/PT7b59e377/7b5f/2f3x/dv377//t/7/efv3n3+8PDb68+v37774/cfvvr58/sfv/v5x7f7x/f//t3bt28/vr/r/sf75y8/vr2+vnv/4fX7t+/ee/z24/ef33388Z/vP/3w2+v1z999+/b69u23h3eff3z/8eb7/v9/f7h//9vD69uf37z97f7j348//fbdt/uPX//r09vrr798e/f68+8f3v7x6/u/P/z0/fXXb58+fHv38fOfb797ffvbt6+uv/z547f3n759vPv89fv714eHdw8fvn54//D6+v3Hz59/f3h9ff379+/ff319ff39+/efP3//+fP3nz9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7z9//vPn7wH+A1WJ94o3O8UFAAAAAElFTkSuQmCC";

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
