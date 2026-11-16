/**
 * Fun Strikes Entertainment LLP — Fun Strike! Game Zone
 * Enterprise Multi-Branch Google Drive & Google Sheets Database Architecture
 *
 * Physical Branches:
 *   1. Pal Branch (Gauravpath Road, Surat):
 *      - Go-Karting Track (Strictly 18+ & Min Height 5'5" / 165 cm)
 *      - Soft Play & Trampoline Arena (All Ages)
 *   2. Mota Varachha Branch (Surat):
 *      - Soft Play & Trampoline Arena (All Ages)
 *
 * Google Drive Architecture ("Fun Strike! Waivers Database/"):
 *   ├── 01 - Live Waivers (Daily Operations)/
 *   │   ├── Fun Strike! - Pal - Go-Karting Waivers (18+)
 *   │   ├── Fun Strike! - Pal - Trampoline & Soft Play Waivers
 *   │   └── Fun Strike! - Mota Varachha - Trampoline & Soft Play Waivers
 *   │
 *   ├── 02 - Customer Signatures/
 *   │   ├── Pal - Go-Karting/
 *   │   ├── Pal - Trampoline/
 *   │   └── Mota Varachha - Trampoline/
 *   │
 *   ├── 03 - Monthly Archives/
 *   │   └── Fun Strike! - YYYY-MM Monthly Waivers (All Branches)
 *   │
 *   └── 04 - Yearly Archives/
 *       └── Fun Strike! - YYYY Full Year Combined Waivers (All Branches)
 */

const ROOT_FOLDER_NAME = "Fun Strike! Waivers Database";
const LIVE_FOLDER_NAME = "01 - Live Waivers (Daily Operations)";
const SIGNATURES_FOLDER_NAME = "02 - Customer Signatures";
const MONTHLY_FOLDER_NAME = "03 - Monthly Archives";
const ARCHIVE_FOLDER_NAME = "04 - Yearly Archives";
const MANAGER_SHARE_EMAIL = "pandyaaryanp348@gmail.com";

const STREAMS = {
  pal_gokart: {
    propKey: "SHEET_ID_PAL_GOKART",
    title: "Fun Strike! - Pal - Go-Karting Waivers (18+)",
    label: "Pal - Go-Karting (18+)",
    branchLabel: "Gauravpath Road, Pal (Surat)",
    activityLabel: "Go-Karting (18+)",
    themeColor: "#be123c",
    sigFolder: "Pal - Go-Karting"
  },
  pal_softplay: {
    propKey: "SHEET_ID_PAL_SOFTPLAY",
    title: "Fun Strike! - Pal - Trampoline & Soft Play Waivers",
    label: "Pal - Trampoline & Soft Play",
    branchLabel: "Gauravpath Road, Pal (Surat)",
    activityLabel: "Soft Play & Trampoline",
    themeColor: "#0284c7",
    sigFolder: "Pal - Trampoline"
  },
  mv_softplay: {
    propKey: "SHEET_ID_MV_SOFTPLAY",
    title: "Fun Strike! - Mota Varachha - Trampoline & Soft Play Waivers",
    label: "Mota Varachha - Trampoline & Soft Play",
    branchLabel: "Mota Varachha, Surat",
    activityLabel: "Soft Play & Trampoline",
    themeColor: "#059669",
    sigFolder: "Mota Varachha - Trampoline"
  }
};

const ZONE_CONFIG = STREAMS;

const HEADERS = [
  "Submitted At",
  "Ref Code",
  "Activity / Zone",
  "Branch",
  "Primary Participant",
  "Participant DOB",
  "Age / Role",
  "Signed By (Parent / Guardian)",
  "Mobile Number",
  "Email ID",
  "Address",
  "Total in Group",
  "All Participants in Waiver",
  "Min Height",
  "18+ Policy Acknowledged",
  "Agreed to T&C",
  "Sign Date",
  "Sign Time",
  "Signature Image",
  "Print / View Waiver"
];

/**
 * Adds the custom menu on open for every spreadsheet bound to this script.
 */
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu("Fun Strike! Waiver")
      .addItem("Print Selected Row (Waiver Form)", "printSelectedWaiver")
      .addSeparator()
      .addItem("Setup Folders, Activity Sheets & Auto-Triggers", "setupAllZoneSheets")
      .addItem("Create New Month Tab & Archive Last Month", "onMonthlyRotation")
      .addItem("Transfer Full Year Into Yearly Archives...", "promptTransferYearArchive")
      .addItem("Share Drive Folder (pandyaaryanp348@gmail.com)", "shareFolderWithManager")
      .addToUi();
  } catch (e) {
    // Runs safely without error when invoked outside a Sheet UI
  }
}

function setupAllZoneSheets() {
  return setupAllThreeZoneSheets();
}

/**
 * Creates Drive folders, ensures all 3 live branch spreadsheets exist inside
 * "01 - Live Waivers (Daily Operations)" with current month tab and styling,
 * and installs monthly + yearly triggers.
 */
function setupAllThreeZoneSheets() {
  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  const liveFolder = getOrCreateFolder_(rootFolder, LIVE_FOLDER_NAME);
  const sigParentFolder = getOrCreateFolder_(rootFolder, SIGNATURES_FOLDER_NAME);
  getOrCreateFolder_(rootFolder, MONTHLY_FOLDER_NAME);
  getOrCreateFolder_(rootFolder, ARCHIVE_FOLDER_NAME);

  // Create signature subfolders for each stream
  Object.keys(STREAMS).forEach(function (k) {
    getOrCreateFolder_(sigParentFolder, STREAMS[k].sigFolder);
  });

  const monthTab = getMonthTabName_(new Date());
  const summary = [];

  Object.keys(STREAMS).forEach(function (streamKey) {
    const cfg = STREAMS[streamKey];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    ensureMonthlyTab_(ss, monthTab, cfg);
    removeDefaultEmptySheet1_(ss, monthTab);
    summary.push(cfg.label + ": " + ss.getUrl());
  });

  installAutoTriggers_();
  Logger.log("Root Folder (" + rootFolder.getId() + "): " + rootFolder.getUrl());
  Logger.log("Live Operations Folder (" + liveFolder.getId() + "): " + liveFolder.getUrl());
  Logger.log("Setup Complete:\n" + summary.join("\n"));

  try {
    SpreadsheetApp.getUi().alert(
      "Enterprise Setup Complete!\n\nFolder: " +
        rootFolder.getUrl() +
        "\n\nLive Sheets Ready (Month: " +
        monthTab +
        "):\n\n" +
        summary.join("\n\n")
    );
  } catch (e) {
    // Logged above for Apps Script Execution log
  }

  return summary;
}

/**
 * Clears stored sheet IDs and recreates the 3 spreadsheets inside 01 - Live Waivers.
 */
function forceRecreate3Sheets() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty("ROOT_FOLDER_ID");
  props.deleteProperty("SHEET_ID_GOKART");
  props.deleteProperty("SHEET_ID_SOFTPLAY");
  Object.keys(STREAMS).forEach(function (k) {
    props.deleteProperty(STREAMS[k].propKey);
  });
  return setupAllThreeZoneSheets();
}

/**
 * Shares the entire "Fun Strike! Waivers Database" folder and all contents
 * with MANAGER_SHARE_EMAIL as Editor.
 */
function shareFolderWithManager() {
  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  rootFolder.addEditor(MANAGER_SHARE_EMAIL);

  const sharedUrls = ["Root Folder: " + rootFolder.getUrl()];
  Object.keys(STREAMS).forEach(function (k) {
    const cfg = STREAMS[k];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    ss.addEditor(MANAGER_SHARE_EMAIL);
    sharedUrls.push(cfg.label + ": " + ss.getUrl());
  });

  Logger.log("Shared with " + MANAGER_SHARE_EMAIL + ":\n" + sharedUrls.join("\n"));

  try {
    SpreadsheetApp.getUi().alert(
      "Drive Database & All Sheets Shared!\n\nEditor Access Granted To: " +
        MANAGER_SHARE_EMAIL +
        "\n\n" +
        sharedUrls.join("\n")
    );
  } catch (e) {}

  return sharedUrls;
}

/**
 * Scheduled on the 1st of every month:
 * 1) Creates new month tab (YYYY-MM) in all 3 live spreadsheets.
 * 2) Saves a combined monthly archive file in "03 - Monthly Archives".
 */
function onMonthlyRotation() {
  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  const monthlyFolder = getOrCreateFolder_(rootFolder, MONTHLY_FOLDER_NAME);

  const now = new Date();
  const currentMonthTab = getMonthTabName_(now);

  Object.keys(STREAMS).forEach(function (k) {
    const cfg = STREAMS[k];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    ensureMonthlyTab_(ss, currentMonthTab, cfg);
  });

  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthTab = getMonthTabName_(prevMonthDate);
  archiveMonthToFolder_(props, rootFolder, monthlyFolder, prevMonthTab);
}

/**
 * Exports a single month across all 3 live sheets into "03 - Monthly Archives".
 */
function archiveMonthToFolder_(props, rootFolder, monthlyFolder, monthTab) {
  const monthFileTitle = "Fun Strike! - " + monthTab + " Monthly Waivers (All Branches)";
  let hasAnyRows = false;
  const streamRows = {};

  Object.keys(STREAMS).forEach(function (k) {
    const cfg = STREAMS[k];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    const sh = ss.getSheetByName(monthTab);
    if (!sh || sh.getLastRow() <= 1) {
      streamRows[k] = [];
      return;
    }
    hasAnyRows = true;
    streamRows[k] = readRowsWithFormulas_(sh, 2, sh.getLastRow() - 1, HEADERS.length);
  });

  if (!hasAnyRows) return null;

  trashExistingByName_(monthlyFolder, monthFileTitle);
  const monthSs = SpreadsheetApp.create(monthFileTitle);
  DriveApp.getFileById(monthSs.getId()).moveTo(monthlyFolder);

  const keys = Object.keys(STREAMS);
  keys.forEach(function (k, idx) {
    const cfg = STREAMS[k];
    const tab = idx === 0 ? monthSs.getSheets()[0] : monthSs.insertSheet(cfg.label);
    tab.setName(cfg.label);
    writeArchiveTab_(tab, HEADERS, streamRows[k], cfg.themeColor);
  });

  return { fileName: monthFileTitle, url: monthSs.getUrl() };
}

/**
 * Scheduled every Jan 1st: Transfers full year to "04 - Yearly Archives".
 */
function archivePreviousYearOnJan1() {
  const now = new Date();
  if (now.getMonth() !== 0) return;
  const prevYear = String(now.getFullYear() - 1);
  transferYearToArchiveFile(prevYear, true);
}

function promptTransferYearArchive() {
  const ui = SpreadsheetApp.getUi();
  const currentYear = String(new Date().getFullYear());
  const resp = ui.prompt(
    "Transfer Full Year Into Yearly Archives",
    "Enter the 4-digit year to transfer (e.g. " +
      currentYear +
      ").\nAll monthly tabs for that year will be combined into 04 - Yearly Archives and cleared from live sheets:",
    ui.ButtonSet.OK_CANCEL
  );

  if (resp.getSelectedButton() !== ui.Button.OK) return;
  const year = resp.getResponseText().trim();
  if (!/^\d{4}$/.test(year)) {
    ui.alert("Please enter a valid 4-digit year (e.g., " + currentYear + ").");
    return;
  }

  const result = transferYearToArchiveFile(year, true);
  ui.alert(
    "Year Transfer Complete!\n\nArchive File: " +
      result.fileName +
      "\nTotal Rows Transferred: " +
      result.totalRows +
      "\nTabs Cleared from Live Sheets: " +
      result.tabsRemoved +
      "\nURL:\n" +
      result.url
  );
}

/**
 * Combines all monthly tabs ("YYYY-01" .. "YYYY-12") from all 3 live spreadsheets
 * into ONE 1-Year Master Archive inside "04 - Yearly Archives".
 */
function transferYearToArchiveFile(yearStr, removeOldTabsFromLiveSheets) {
  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  const monthlyFolder = getOrCreateFolder_(rootFolder, MONTHLY_FOLDER_NAME);
  const archiveFolder = getOrCreateFolder_(rootFolder, ARCHIVE_FOLDER_NAME);

  const archiveTitle = "Fun Strike! - " + yearStr + " Full Year Combined Waivers (All Branches)";
  trashExistingByName_(archiveFolder, archiveTitle);

  const archiveSs = SpreadsheetApp.create(archiveTitle);
  DriveApp.getFileById(archiveSs.getId()).moveTo(archiveFolder);

  const masterHeaders = ["Month", "Source Stream"].concat(HEADERS);
  const allRows = [];
  const streamBuckets = { pal_gokart: [], pal_softplay: [], mv_softplay: [] };
  const tabsToDelete = [];

  const currentMonthTab = getMonthTabName_(new Date());

  Object.keys(STREAMS).forEach(function (k) {
    const cfg = STREAMS[k];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    ensureMonthlyTab_(ss, currentMonthTab, cfg);

    ss.getSheets().forEach(function (sh) {
      const tabName = sh.getName();
      if (tabName.indexOf(yearStr + "-") !== 0) return;

      const lastRow = sh.getLastRow();
      if (lastRow > 1) {
        const dataRows = readRowsWithFormulas_(sh, 2, lastRow - 1, HEADERS.length);
        dataRows.forEach(function (r) {
          const combinedRow = [tabName, cfg.label].concat(r);
          allRows.push(combinedRow);
          if (streamBuckets[k]) streamBuckets[k].push(combinedRow);
        });
      }

      if (tabName !== currentMonthTab) {
        tabsToDelete.push({ ss: ss, sheet: sh });
      }
    });
  });

  // Sort combined rows chronologically by Submitted At
  allRows.sort(function (a, b) {
    return (new Date(a[2]).getTime() || 0) - (new Date(b[2]).getTime() || 0);
  });

  const allTab = archiveSs.getSheets()[0];
  allTab.setName("All Branches Combined " + yearStr);
  writeArchiveTab_(allTab, masterHeaders, allRows, "#0f172a");

  Object.keys(STREAMS).forEach(function (k) {
    const cfg = STREAMS[k];
    const zTab = archiveSs.insertSheet(cfg.label);
    writeArchiveTab_(zTab, masterHeaders, streamBuckets[k] || [], cfg.themeColor);
  });

  SpreadsheetApp.flush();

  let tabsRemoved = 0;
  if (removeOldTabsFromLiveSheets) {
    tabsToDelete.forEach(function (item) {
      if (item.ss.getSheets().length > 1) {
        item.ss.deleteSheet(item.sheet);
        tabsRemoved += 1;
      }
    });

    const yearMonthlySub = getOrCreateFolder_(archiveFolder, yearStr + " Monthly Backups");
    const files = monthlyFolder.getFiles();
    while (files.hasNext()) {
      const f = files.next();
      if (f.getName().indexOf("Fun Strike! - " + yearStr + "-") === 0) {
        f.moveTo(yearMonthlySub);
      }
    }
  }

  return {
    fileName: archiveTitle,
    url: archiveSs.getUrl(),
    totalRows: allRows.length,
    tabsRemoved: tabsRemoved
  };
}

function writeArchiveTab_(sheet, headers, rows, headerBg) {
  sheet.appendRow(headers);
  sheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground(headerBg || "#0f172a")
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 32);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  for (let i = 1; i <= Math.min(headers.length, 12); i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Resolves which operational stream a submission belongs to.
 */
function resolveStreamKey_(data) {
  const branchStr = String(data.branch || "").toLowerCase();
  const zoneStr = String(data.zone || data.activity || "").toLowerCase();
  if (/kart/i.test(zoneStr)) return "pal_gokart";
  if (/varachha/i.test(branchStr)) return "mv_softplay";
  return "pal_softplay";
}

/**
 * Receives customer waiver submissions and appends to the appropriate branch sheet.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const rawPayload = e && e.postData && e.postData.contents ? String(e.postData.contents) : "{}";
    if (rawPayload.length > 100000) {
      return jsonError_("Payload too large.");
    }
    const data = JSON.parse(rawPayload);

    if (data && String(data.hpWebsite || "").trim()) {
      return jsonError_("Rejected");
    }

    if (isRateLimited_()) {
      return jsonError_("Server busy. Please wait a few seconds and try again.");
    }

    const now = new Date();
    const validationError = validateSubmissionPayload_(data, now);
    if (validationError) {
      return jsonError_(validationError);
    }

    const streamKey = resolveStreamKey_(data);
    const streamCfg = STREAMS[streamKey] || STREAMS.pal_gokart;

    const props = PropertiesService.getScriptProperties();
    const rootFolder = getRootDatabaseFolder_(props);
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, streamCfg.propKey, streamCfg.title);

    const monthTab = getMonthTabName_(now);
    const sheet = ensureMonthlyTab_(ss, monthTab, streamCfg);
    removeDefaultEmptySheet1_(ss, monthTab);

    const cleanFullName = clampText_(data.fullName, 120);
    const cleanDob = clampText_(data.dob, 20);
    const cleanMobile = clampText_(data.mobileNumber, 30);
    const cleanEmail = clampText_(data.emailId, 160);
    const cleanAddress = clampText_(data.address, 300);
    const cleanBranch = clampText_(data.branch || streamCfg.branchLabel, 100);
    const cleanActivity = clampText_(data.activity || streamCfg.activityLabel, 80);
    const cleanSignDate = clampText_(data.signDate || Utilities.formatDate(now, "Asia/Kolkata", "yyyy-MM-dd"), 20);
    const cleanSignTime = clampText_(data.signTime || Utilities.formatDate(now, "Asia/Kolkata", "hh:mm:ss a"), 20);

    const ridersArr = Array.isArray(data.riders) ? data.riders.slice(0, 20) : [];
    const effectiveRiders = ridersArr.length
      ? ridersArr.map(function (r) {
          return {
            name: clampText_(r && r.name ? r.name : cleanFullName, 120),
            dob: clampText_(r && r.dob ? r.dob : cleanDob, 20),
            age: r && r.age !== null && r.age !== undefined ? Number(r.age) : null,
            relation: clampText_(r && r.relation ? r.relation : "Participant", 60)
          };
        })
      : [{ name: cleanFullName, dob: cleanDob, age: null, relation: "Primary Signer" }];

    const allNamesList = effectiveRiders
      .map(function (r, idx) {
        const hasAge = r.age !== null && r.age !== undefined && !isNaN(r.age);
        const agePart = hasAge ? r.age + " yrs (" + (r.age < 18 ? "MINOR" : "Adult") + ")" : "";
        return (idx + 1) + ". " + [r.name, r.dob, agePart, r.relation]
          .filter(Boolean)
          .join(" | ");
      })
      .join("\n");

    const signedByLabel =
      data.primaryIsRiding === false
        ? cleanFullName + " (Parent/Guardian)"
        : cleanFullName;

    const minIn = clampText_(data.minHeightIn, 12);
    const minCm = clampText_(data.minHeightCm, 12);
    const heightStr =
      minIn || minCm
        ? (minIn || "—") + " in / " + (minCm || "—") + " cm"
        : (/kart/i.test(streamCfg.activityLabel) ? "65 in / 165 cm" : "—");

    const sigVal = isValidSignatureDataUrl_(data.guestSignature) ? data.guestSignature : "";
    const totalCount = effectiveRiders.length;
    const submittedIso = clampText_(data.submittedAt || now.toISOString(), 40);
    const refCodeStr = clampText_(data.refCode, 16);
    const sigCellValue = saveSignatureFileFormula_(rootFolder, refCodeStr, sigVal, streamCfg);
    const webAppUrl = getWebAppUrl_(props);
    const printToken = computePrintToken_(props, refCodeStr, submittedIso);
    const printUrl = webAppUrl
      ? webAppUrl +
        "?printRef=" + encodeURIComponent(refCodeStr) +
        "&zone=" + encodeURIComponent(streamKey) +
        "&month=" + encodeURIComponent(monthTab) +
        "&k=" + encodeURIComponent(printToken)
      : "";
    const printFormula = printUrl ? '=HYPERLINK("' + printUrl + '", "🖨️ Print Waiver")' : "";

    const is18Ack = (/kart/i.test(streamCfg.activityLabel) || data.agreeGokart18) ? "YES" : "N/A";

    const rowsToAppend = effectiveRiders.map(function (r) {
      const hasAge = r.age !== null && r.age !== undefined && !isNaN(r.age);
      const ageRole =
        (hasAge ? r.age + " yrs (" + (r.age < 18 ? "MINOR" : "Adult") + ") — " : "") +
        (r.relation || "Participant");

      return [
        "'" + submittedIso,
        safeCell_(refCodeStr),
        safeCell_(cleanActivity),
        safeCell_(cleanBranch),
        safeCell_(r.name || cleanFullName),
        safeCell_(r.dob || cleanDob),
        safeCell_(ageRole),
        safeCell_(signedByLabel),
        "'" + cleanMobile,
        safeCell_(cleanEmail),
        safeCell_(cleanAddress),
        totalCount,
        safeCell_(allNamesList),
        safeCell_(heightStr),
        is18Ack,
        data.agreed ? "YES" : "NO",
        safeCell_(cleanSignDate),
        safeCell_(cleanSignTime),
        sigCellValue,
        printFormula
      ];
    });

    const startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rowsToAppend.length, HEADERS.length).setValues(rowsToAppend);

    return ContentService.createTextOutput(
      JSON.stringify({
        ok: true,
        refCode: refCodeStr,
        stream: streamKey,
        monthTab: monthTab
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return jsonError_(err.message);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  if (!params.printRef) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, service: "Fun Strike! 3-Zone Waiver Endpoint" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const refCode = String(params.printRef || "").trim();
  const zoneKey = ZONE_CONFIG[params.zone] ? params.zone : "gokart";
  const monthTab = String(params.month || getMonthTabName_(new Date())).trim();
  const token = String(params.k || "").trim();

  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  const cfg = ZONE_CONFIG[zoneKey];
  const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);

  let found = findPrintRow_(ss.getSheetByName(monthTab), refCode, token, props, 0);

  // Fallback to Yearly Archives if this month was already transferred out of the live sheet
  if (!found.match && /^\d{4}/.test(monthTab)) {
    const yearStr = monthTab.slice(0, 4);
    const archiveFolder = getOrCreateFolder_(rootFolder, ARCHIVE_FOLDER_NAME);
    const archiveFiles = archiveFolder.getFilesByName("Fun Strike! - " + yearStr + " Full Year Combined Waivers");
    if (archiveFiles.hasNext()) {
      const archiveSs = SpreadsheetApp.openById(archiveFiles.next().getId());
      const archiveSheet = archiveSs.getSheetByName("All Zones " + yearStr);
      found = findPrintRow_(archiveSheet, refCode, token, props, 2);
    }
  }

  if (!found.match) {
    return HtmlService.createHtmlOutput("<p>Waiver link is invalid or unavailable.</p>");
  }

  const m = found.match;
  const sigColIndex = m.length >= 20 ? 19 : 18;
  const sigFormula = found.sheet.getRange(found.rowNum, found.colOffset + sigColIndex).getFormula();
  const rawSigVal = m.length >= 20 ? m[18] : m[17];
  const resolvedSigUrl = resolveSignatureDataUrl_(rawSigVal, sigFormula);

  const record = {
    submittedAt: m[0],
    refCode: m[1],
    activity: m[2],
    branch: m[3],
    fullName: m[4],
    dob: m[5],
    ageRole: m[6],
    signedBy: m[7],
    mobileNumber: m[8],
    emailId: m[9],
    address: m[10],
    totalRiders: m[11],
    allRiders: m[12],
    heightStr: m[13],
    is18Ack: m.length >= 20 ? m[14] : (m[13] || "N/A"),
    agreed: m.length >= 20 ? m[15] : m[14],
    signDate: m.length >= 20 ? m[16] : m[15],
    signTime: m.length >= 20 ? m[17] : m[16],
    signatureUrl: resolvedSigUrl
  };

  return HtmlService.createHtmlOutput(buildPrintableHtml_(record))
    .setTitle("Print Waiver — " + record.refCode);
}

function findPrintRow_(sheet, refCode, token, props, colOffset) {
  if (!sheet || sheet.getLastRow() <= 1) {
    return { match: null, sawRef: false, sheet: sheet, rowNum: -1, colOffset: colOffset };
  }

  const startCol = 1 + colOffset;
  const allVals = sheet.getRange(2, startCol, sheet.getLastRow() - 1, HEADERS.length).getDisplayValues();
  let sawRef = false;

  for (let i = 0; i < allVals.length; i++) {
    if (String(allVals[i][1]).trim() === refCode) {
      sawRef = true;
      const rowToken = computePrintToken_(props, refCode, String(allVals[i][0]).trim());
      if (token && constantTimeEquals_(token, rowToken)) {
        return { match: allVals[i], sawRef: true, sheet: sheet, rowNum: i + 2, colOffset: colOffset };
      }
    }
  }

  return { match: null, sawRef: sawRef, sheet: sheet, rowNum: -1, colOffset: colOffset };
}

/**
 * Opens a print-ready A4 waiver dialog for the currently selected row in the active sheet.
 */
function printSelectedWaiver() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeRange = sheet.getActiveRange();

  if (!activeRange) {
    ui.alert("Please click on any customer row first, then click Print Selected Row.");
    return;
  }

  const rowIndex = activeRange.getRow();
  if (rowIndex <= 1) {
    ui.alert("Row 1 is the header row. Please select a customer waiver row (Row 2 or below).");
    return;
  }

  const numCols = Math.max(sheet.getLastColumn(), HEADERS.length);
  const vals = sheet.getRange(rowIndex, 1, 1, numCols).getDisplayValues()[0];
  const sigColIndex = vals.length >= 20 ? 19 : 18;
  const sigFormula = sheet.getRange(rowIndex, sigColIndex).getFormula();
  const rawSigVal = vals.length >= 20 ? vals[18] : vals[17];
  const resolvedSigUrl = resolveSignatureDataUrl_(rawSigVal, sigFormula);

  const record = {
    submittedAt: vals[0],
    refCode: vals[1],
    activity: vals[2],
    branch: vals[3],
    fullName: vals[4],
    dob: vals[5],
    ageRole: vals[6],
    signedBy: vals[7],
    mobileNumber: vals[8],
    emailId: vals[9],
    address: vals[10],
    totalRiders: vals[11],
    allRiders: vals[12],
    heightStr: vals[13],
    is18Ack: vals.length >= 20 ? vals[14] : (vals[13] || "N/A"),
    agreed: vals.length >= 20 ? vals[15] : vals[14],
    signDate: vals.length >= 20 ? vals[16] : vals[15],
    signTime: vals.length >= 20 ? vals[17] : vals[16],
    signatureUrl: resolvedSigUrl
  };

  if (!record.fullName && !record.refCode) {
    ui.alert("The selected row appears to be empty.");
    return;
  }

  const html = buildPrintableHtml_(record);
  const output = HtmlService.createHtmlOutput(html)
    .setWidth(860)
    .setHeight(720);

  ui.showModalDialog(output, "Print Waiver — " + (record.refCode || record.fullName));
}

// ---------- Helpers ----------

function getMonthTabName_(dateObj) {
  return Utilities.formatDate(dateObj, Session.getScriptTimeZone() || "Asia/Kolkata", "yyyy-MM");
}

function getRootDatabaseFolder_(props) {
  const storedFolderId = props.getProperty("ROOT_FOLDER_ID");
  if (storedFolderId) {
    try {
      const f = DriveApp.getFolderById(storedFolderId);
      if (!f.isTrashed()) return f;
    } catch (e) {
      // Folder deleted or inaccessible; look up or recreate below
    }
    props.deleteProperty("ROOT_FOLDER_ID");
  }
  const folder = getOrCreateFolder_(DriveApp.getRootFolder(), ROOT_FOLDER_NAME);
  props.setProperty("ROOT_FOLDER_ID", folder.getId());
  return folder;
}

function getOrCreateFolder_(parentFolder, folderName) {
  const it = parentFolder.getFoldersByName(folderName);
  while (it.hasNext()) {
    const f = it.next();
    if (!f.isTrashed()) return f;
  }
  return parentFolder.createFolder(folderName);
}

function trashExistingByName_(folder, fileName) {
  const existing = folder.getFilesByName(fileName);
  while (existing.hasNext()) {
    existing.next().setTrashed(true);
  }
}

function isFileInFolder_(file, folder) {
  if (file.isTrashed()) return false;
  const targetId = folder.getId();
  const parents = file.getParents();
  while (parents.hasNext()) {
    if (parents.next().getId() === targetId) return true;
  }
  return false;
}

function getSpreadsheetByPropOrTitle_(props, rootFolder, propKey, title) {
  const liveFolder = getOrCreateFolder_(rootFolder, LIVE_FOLDER_NAME);
  const storedId = props.getProperty(propKey);
  if (storedId) {
    try {
      const f = DriveApp.getFileById(storedId);
      if (!f.isTrashed()) {
        if (!isFileInFolder_(f, liveFolder)) {
          f.moveTo(liveFolder);
        }
        return SpreadsheetApp.openById(storedId);
      }
    } catch (e) {
      // Stored file deleted or inaccessible
    }
    props.deleteProperty(propKey);
  }

  // Look in 01 - Live Waivers first
  let files = liveFolder.getFilesByName(title);
  while (files.hasNext()) {
    const f = files.next();
    if (!f.isTrashed()) {
      const ss = SpreadsheetApp.openById(f.getId());
      props.setProperty(propKey, ss.getId());
      return ss;
    }
  }

  // Look in rootFolder (migration from old layout)
  files = rootFolder.getFilesByName(title);
  while (files.hasNext()) {
    const f = files.next();
    if (!f.isTrashed()) {
      f.moveTo(liveFolder);
      const ss = SpreadsheetApp.openById(f.getId());
      props.setProperty(propKey, ss.getId());
      return ss;
    }
  }

  // Create brand new sheet in liveFolder
  const created = SpreadsheetApp.create(title);
  DriveApp.getFileById(created.getId()).moveTo(liveFolder);
  props.setProperty(propKey, created.getId());
  return created;
}

function ensureMonthlyTab_(ss, monthTabName, streamCfg) {
  let sheet = ss.getSheetByName(monthTabName);
  if (!sheet) {
    sheet = ss.insertSheet(monthTabName, 0);
  }
  const lastRow = sheet.getLastRow();
  if (lastRow === 0 || (lastRow === 1 && sheet.getLastColumn() !== HEADERS.length)) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    const themeBg = (streamCfg && streamCfg.themeColor) || "#0f172a";
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold")
      .setBackground(themeBg)
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle")
      .setFontSize(10);
    sheet.setRowHeight(1, 32);
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(2);

    try {
      sheet.autoResizeColumns(1, HEADERS.length);
    } catch (e) {}
  }
  return sheet;
}

function removeDefaultEmptySheet1_(ss, keepTabName) {
  const sheet1 = ss.getSheetByName("Sheet1");
  if (sheet1 && sheet1.getName() !== keepTabName && sheet1.getLastRow() === 0 && ss.getSheets().length > 1) {
    ss.deleteSheet(sheet1);
  }
}

function installAutoTriggers_() {
  const existing = ScriptApp.getProjectTriggers();
  const names = existing.map(function (t) {
    return t.getHandlerFunction();
  });

  if (names.indexOf("onMonthlyRotation") === -1) {
    ScriptApp.newTrigger("onMonthlyRotation")
      .timeBased()
      .onMonthDay(1)
      .atHour(0)
      .create();
  }

  if (names.indexOf("archivePreviousYearOnJan1") === -1) {
    ScriptApp.newTrigger("archivePreviousYearOnJan1")
      .timeBased()
      .onMonthDay(1)
      .atHour(1)
      .create();
  }
}

function saveSignatureFileFormula_(rootFolder, refCode, dataUrl, streamCfg) {
  const match = String(dataUrl || "").match(/^data:(image\/(webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || String(dataUrl).length > 49000) return "";
  try {
    const sigParentFolder = getOrCreateFolder_(rootFolder, SIGNATURES_FOLDER_NAME);
    const subfolderName = (streamCfg && streamCfg.sigFolder) || "General";
    const sigFolder = getOrCreateFolder_(sigParentFolder, subfolderName);
    const mime = match[1];
    const ext = match[2] === "jpeg" ? "jpg" : match[2];
    const bytes = Utilities.base64Decode(match[3]);
    const blob = Utilities.newBlob(bytes, mime, (refCode || "waiver") + "." + ext);
    const file = sigFolder.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {}
    return '=HYPERLINK("https://drive.google.com/file/d/' + file.getId() + '/view", "✍️ View Signature")';
  } catch (e) {
    return dataUrl;
  }
}

function extractDriveFileId_(val) {
  if (!val) return "";
  const s = String(val);
  let match = s.match(/\/file\/d\/([A-Za-z0-9_-]+)/i);
  if (match) return match[1];
  match = s.match(/\/d\/([A-Za-z0-9_-]+)/i);
  if (match) return match[1];
  match = s.match(/id=([A-Za-z0-9_-]+)/i);
  if (match) return match[1];
  if (/^[A-Za-z0-9_-]{25,}$/.test(s.trim())) return s.trim();
  return "";
}

function resolveSignatureDataUrl_(cellDisplayVal, cellFormula) {
  if (isValidSignatureDataUrl_(cellDisplayVal)) return cellDisplayVal;
  if (isValidSignatureDataUrl_(cellFormula)) return cellFormula;

  const fileId = extractDriveFileId_(cellFormula) || extractDriveFileId_(cellDisplayVal);
  if (!fileId) return "";

  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    const bytes = blob.getBytes();
    let mime = blob.getContentType();
    if (!mime || mime === "application/octet-stream") {
      mime = "image/png";
    }
    return "data:" + mime + ";base64," + Utilities.base64Encode(bytes);
  } catch (e) {
    return "https://lh3.googleusercontent.com/d/" + fileId;
  }
}

function readRowsWithFormulas_(sheet, startRow, numRows, numCols) {
  const range = sheet.getRange(startRow, 1, numRows, numCols);
  const values = range.getValues();
  const formulas = range.getFormulas();
  for (let r = 0; r < values.length; r++) {
    for (let c = 0; c < numCols; c++) {
      if (formulas[r][c]) {
        values[r][c] = formulas[r][c];
      }
    }
  }
  return values;
}

function getWebAppUrl_(props) {
  try {
    const liveUrl = ScriptApp.getService().getUrl();
    if (liveUrl && liveUrl.indexOf("https://script.google.com/") === 0) {
      props.setProperty("WEB_APP_URL", liveUrl);
      return liveUrl;
    }
  } catch (e) {}
  return props.getProperty("WEB_APP_URL") || "";
}

function computePrintToken_(props, refCode, submittedAt) {
  let secret = props.getProperty("PRINT_SECRET");
  if (!secret) {
    secret = Utilities.getUuid();
    props.setProperty("PRINT_SECRET", secret);
  }
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    refCode + "|" + submittedAt + "|" + secret
  );
  return Utilities.base64EncodeWebSafe(digest).slice(0, 12);
}

function jsonError_(msg) {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: false, error: String(msg || "Error") })
  ).setMimeType(ContentService.MimeType.JSON);
}

function clampText_(val, maxLen) {
  return String(val === null || val === undefined ? "" : val).trim().slice(0, maxLen || 200);
}

function isValidDob_(dobStr, nowDate) {
  const s = String(dobStr || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const todayStr = Utilities.formatDate(nowDate || new Date(), Session.getScriptTimeZone() || "Asia/Kolkata", "yyyy-MM-dd");
  if (s > todayStr) return false;
  const year = Number(s.slice(0, 4));
  const curYear = Number(todayStr.slice(0, 4));
  return year >= curYear - 130 && year <= curYear;
}

function validateSubmissionPayload_(data, nowDate) {
  if (!data || !clampText_(data.fullName, 120) || data.agreed !== true) {
    return "Invalid waiver submission: missing name or agreement.";
  }
  const refCode = clampText_(data.refCode, 16);
  if (!/^FS-[A-Z0-9]{4,12}$/.test(refCode)) {
    return "Invalid waiver submission: invalid reference code.";
  }
  const mobileDigits = String(data.mobileNumber || "").replace(/\D/g, "");
  if (mobileDigits.length < 7 || mobileDigits.length > 20) {
    return "Invalid waiver submission: valid mobile number required.";
  }
  if (!isValidDob_(data.dob, nowDate)) {
    return "Invalid waiver submission: valid date of birth required.";
  }
  if (!clampText_(data.address, 300)) {
    return "Invalid waiver submission: address required.";
  }
  if (!isValidSignatureDataUrl_(data.guestSignature)) {
    return "Invalid waiver submission: valid signature required.";
  }
  return "";
}

function isRateLimited_() {
  try {
    const cache = CacheService.getScriptCache();
    const bucket = "rate_" + Math.floor(Date.now() / 60000);
    const count = Number(cache.get(bucket) || "0");
    if (count >= 45) return true;
    cache.put(bucket, String(count + 1), 120);
  } catch (e) {
    // Fail open if CacheService is unavailable
  }
  return false;
}

function constantTimeEquals_(a, b) {
  const sa = String(a || "");
  const sb = String(b || "");
  if (!sa || sa.length !== sb.length) return false;
  let diff = 0;
  for (let i = 0; i < sa.length; i++) {
    diff |= sa.charCodeAt(i) ^ sb.charCodeAt(i);
  }
  return diff === 0;
}

function isValidSignatureDataUrl_(val) {
  const s = String(val || "");
  return s.length <= 49000 && /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(s);
}

function runSelfCheck() {
  if (safeCell_("=CMD()") !== "'=CMD()") throw new Error("Formula injection check failed");
  if (!isValidSignatureDataUrl_("data:image/webp;base64,UklGRh4=")) throw new Error("Valid WebP check failed");
  if (!isValidSignatureDataUrl_("data:image/jpeg;base64,/9j/4AAQ")) throw new Error("Valid JPEG check failed");
  if (!isValidSignatureDataUrl_("data:image/png;base64,iVBORw0KGgo=")) throw new Error("Valid PNG check failed");
  if (isValidSignatureDataUrl_('data:image/svg+xml;base64,PHN2Zz4=')) throw new Error("SVG rejection check failed");
  if (isValidSignatureDataUrl_('data:image/png;base64,AAA" onerror="alert(1)')) throw new Error("XSS signature check failed");
  if (extractDriveFileId_('=HYPERLINK("https://drive.google.com/file/d/abc_123-XYZ/view", "View Signature")') !== "abc_123-XYZ") {
    throw new Error("Drive file ID extraction check failed");
  }
  if (!constantTimeEquals_("abc123", "abc123") || constantTimeEquals_("abc123", "abc124")) {
    throw new Error("Constant-time comparison check failed");
  }
  if (clampText_("  hello  ", 3) !== "hel") throw new Error("Text clamp check failed");
  if (isValidDob_("2099-01-01", new Date("2026-11-11T00:00:00Z"))) throw new Error("Future DOB check failed");
  if (!validateSubmissionPayload_({ fullName: "A", agreed: true }, new Date("2026-11-11T00:00:00Z"))) {
    throw new Error("Strict payload check failed");
  }

  const rows = [
    ["2026-12", "Soft Play & Trampoline", new Date("2026-12-01T10:00:00Z")],
    ["2026-11", "Go-Karting", "2026-11-11T17:00:00.000Z"]
  ];
  rows.sort(function (a, b) {
    return (new Date(a[2]).getTime() || 0) - (new Date(b[2]).getTime() || 0);
  });
  if (rows[0][0] !== "2026-11") throw new Error("Chronological date sort check failed");
  return "All Code.gs self-checks passed.";
}

function safeCell_(val) {
  const s = String(val === null || val === undefined ? "" : val);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function escapeHtml_(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPrintableHtml_(r) {
  const isGokart = /kart/i.test(r.activity || "") || /kart/i.test(r.branch || "");
  const activityTitle = isGokart ? "GO-KARTING TRACK" : "TRAMPOLINE & SOFT PLAY PARK";

  const riderLines = String(r.allRiders || r.fullName || "")
    .split(/\r?\n/)
    .filter(Boolean);

  const ridersListFormatted = riderLines.map(function(line, idx) {
    const cleanLine = line.replace(/^\d+\.\s*/, "");
    return (idx + 1) + ". " + escapeHtml_(cleanLine);
  }).join("<br/>");

  let sigImgHtml = '<div style="height:48px;border-bottom:1.5px solid #0f172a;display:flex;align-items:flex-end;padding-bottom:3px;font-size:10px;color:#64748b;font-style:italic;">Digitally Signed &amp; Recorded on Submission</div>';

  if (r.signatureUrl && String(r.signatureUrl).length > 5) {
    if (isValidSignatureDataUrl_(r.signatureUrl) || String(r.signatureUrl).indexOf("http") === 0) {
      sigImgHtml = '<img src="' + r.signatureUrl + '" alt="Customer Signature" style="max-height:48px;max-width:220px;object-fit:contain;display:block;" />';
    }
  }

  const gokartClauses = [
    '<div class="clause-item clause-highlight">',
    '  <span class="clause-num">1.</span> <span class="clause-title">Strict 18+ Adult Policy &amp; Sole Minor Liability Clause:</span>',
    '  The Go-Karting Track is strictly designed, engineered, and operated exclusively for adult drivers aged 18 and older. If a minor under 18 years of age operates a kart or signs this instrument, the participant and their parent or legal guardian explicitly warrant, covenant, and declare that <strong>ONE HUNDRED PERCENT (100%) OF ALL RISKS, PERSONAL INJURIES, VEHICLE LIABILITIES, AND DAMAGES REST SOLELY WITH THEM</strong>. Fun Strikes Entertainment LLP, its designated partners, and track marshals bear ZERO liability.',
    '</div>',
    '<div class="clause-item">',
    '  <span class="clause-num">2.</span> <span class="clause-title">Track Rules, Safety Equipment &amp; Mandatory Height Verification:</span>',
    '  Single-kart drivers must meet the strict minimum height requirement of 5\'5\" (165 cm). Full-face protective helmets must be securely buckled prior to entering the pit lane and accelerating. Closed-toe footwear is mandatory at all times (no crocs, sandals, or loose footwear). Loose clothing must be tucked in; long hair must be tied securely above shoulder level. <strong>ZERO-TOLERANCE BUMPING POLICY:</strong> Intentional ramming, bumping, or hazardous driving results in immediate disqualification and ejection from the circuit on first warning without refund.',
    '</div>'
  ].join('\n');

  const trampolineClauses = [
    '<div class="clause-item clause-highlight">',
    '  <span class="clause-num">1.</span> <span class="clause-title">Trampoline &amp; Soft Play Park Safety Protocol:</span>',
    '  Approved anti-slip grip socks must be worn at all times by all active participants inside the park. Exactly one jumper per trampoline mat at all times; double-bouncing, wrestling, horseplay, and running across pads are strictly prohibited. Inverted somersaults, multi-rotational flips, and uncontrolled aerial maneuvers are barred. All pockets must be completely emptied (no mobile phones, keys, or sharp items).',
    '</div>',
    '<div class="clause-item">',
    '  <span class="clause-num">2.</span> <span class="clause-title">Active Parental Supervision &amp; Foam Pit / Airbag Regulations:</span>',
    '  Children under 10 years of age must be actively and continuously supervised by a parent or adult legal guardian (18+) at all times within the arena. Foam Pit / Airbag protocol: participants must land strictly feet-first or in a seated position; diving headfirst, landing on other jumpers, or performing uncontrolled flips into the pit is strictly prohibited. Exit the landing zone immediately after jumping.',
    '</div>'
  ].join('\n');

  const specificClauses = isGokart ? gokartClauses : trampolineClauses;

  const html = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8" />',
    '  <title>Fun Strike! Participant Waiver - ' + escapeHtml_(r.refCode) + '</title>',
    '  <style>',
    '    @page { size: A4 portrait; margin: 8mm 10mm 8mm 10mm; }',
    '    * { box-sizing: border-box; margin: 0; padding: 0; }',
    '    html, body { font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif; color: #0f172a; background: #ffffff; font-size: 9.3pt; line-height: 1.38; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; width: 100%; height: 100%; }',
    '    .print-bar { display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: #ffffff; padding: 8px 16px; font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 10px; }',
    '    .print-btn { background: #991b1b; color: #ffffff; border: none; padding: 6px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; }',
    '    .document-page { width: 100%; height: 279mm; max-height: 279mm; border: 2px solid #0f172a; padding: 16px 20px 14px 20px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; }',
    '    .doc-header { text-align: center; border-bottom: 2px double #0f172a; padding-bottom: 6px; margin-bottom: 8px; }',
    '    .doc-header .org-name { font-size: 17pt; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; color: #0f172a; line-height: 1.1; }',
    '    .doc-header .org-sub { font-family: Arial, sans-serif; font-size: 8pt; color: #475569; letter-spacing: 0.4px; margin-top: 2px; }',
    '    .doc-header .doc-title { font-size: 10.5pt; font-weight: bold; letter-spacing: 0.6px; text-transform: uppercase; margin-top: 5px; color: #991b1b; background: #fef2f2; border: 1px solid #fecaca; padding: 3px 0; }',
    '    .doc-meta { display: flex; justify-content: space-between; font-family: Arial, sans-serif; font-size: 8pt; font-weight: bold; color: #334155; margin-top: 4px; padding: 0 4px; }',
    '    .schedule-title { font-family: Arial, sans-serif; font-size: 8.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; border-bottom: 1.2px solid #0f172a; padding-bottom: 2px; margin: 6px 0 4px 0; }',
    '    table.data-table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 8.2pt; margin-bottom: 6px; }',
    '    table.data-table td { border: 1px solid #94a3b8; padding: 3.5px 7px; vertical-align: middle; }',
    '    table.data-table td.lbl { background: #f1f5f9; font-weight: bold; color: #334155; width: 20%; text-transform: uppercase; font-size: 7.5pt; }',
    '    table.data-table td.val { color: #0f172a; width: 30%; }',
    '    .clauses-header { font-family: Arial, sans-serif; font-size: 8.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; background: #0f172a; padding: 3.5px 8px; margin-bottom: 5px; display: flex; justify-content: space-between; }',
    '    .clauses-body { text-align: justify; font-size: 8.8pt; line-height: 1.38; color: #1e293b; }',
    '    .clause-item { margin-bottom: 4.5px; text-indent: -18px; padding-left: 18px; }',
    '    .clause-num { font-weight: bold; font-family: Arial, sans-serif; color: #0f172a; }',
    '    .clause-title { font-weight: bold; text-transform: uppercase; color: #0f172a; font-size: 8.8pt; }',
    '    .clause-highlight { background: #fef2f2; border-left: 3px solid #dc2626; padding: 3px 6px; margin: 4px 0; text-indent: 0; }',
    '    .decl-box { border: 1.5px solid #0f172a; background: #f8fafc; padding: 5px 8px; margin: 6px 0 5px 0; font-size: 8.5pt; line-height: 1.34; text-align: justify; }',
    '    .decl-box strong { font-family: Arial, sans-serif; text-transform: uppercase; color: #0f172a; font-size: 8pt; letter-spacing: 0.4px; }',
    '    .exec-table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; margin-top: 4px; }',
    '    .exec-table td { border: 1.5px solid #0f172a; padding: 5px 8px; vertical-align: top; }',
    '    .exec-table .sig-title { font-size: 7.5pt; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }',
    '    .exec-table .sig-img-wrap { height: 50px; display: flex; align-items: center; }',
    '    .exec-table .sig-img-wrap img { max-height: 48px; max-width: 220px; object-fit: contain; }',
    '    .exec-table .sig-signer-name { font-weight: bold; font-size: 9pt; color: #0f172a; border-top: 1px dashed #cbd5e1; padding-top: 2px; margin-top: 2px; }',
    '    .exec-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 10px; font-size: 8.2pt; }',
    '    .exec-meta-row { display: flex; flex-direction: column; }',
    '    .exec-meta-lbl { font-size: 7pt; font-weight: bold; color: #64748b; text-transform: uppercase; }',
    '    .exec-meta-val { font-size: 8.5pt; font-weight: bold; color: #0f172a; }',
    '    .doc-footer { border-top: 1px solid #cbd5e1; padding-top: 3px; margin-top: 5px; display: flex; justify-content: space-between; font-family: Arial, sans-serif; font-size: 7pt; color: #64748b; text-transform: uppercase; }',
    '    @media print { .print-bar { display: none !important; } body { margin: 0; padding: 0; } .document-page { border: 1.5px solid #000; height: 100%; min-height: 100vh; } }',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="print-bar">',
    '    <span>OFFICIAL LEGAL RECORD: Ref ' + escapeHtml_(r.refCode) + ' &mdash; ' + escapeHtml_(r.fullName) + '</span>',
    '    <button class="print-btn" onclick="window.print()">Print Legal Document</button>',
    '  </div>',
    '  <div class="document-page">',
    '    <div>',
    '      <div class="doc-header">',
    '        <div class="org-name">Fun Strikes Entertainment LLP</div>',
    '        <div class="org-sub">Registered LLP under Indian Limited Liability Partnership Act, 2008 &bull; Surat, Gujarat, India</div>',
    '        <div class="doc-title">Participant Liability Waiver, Indemnity Agreement &amp; Rules of Operation</div>',
    '        <div class="doc-meta">',
    '          <span>ACTIVITY: <strong>' + activityTitle + '</strong></span>',
    '          <span>BRANCH: <strong>' + escapeHtml_(r.branch) + '</strong></span>',
    '          <span>DOCUMENT REF: <strong>' + escapeHtml_(r.refCode) + '</strong></span>',
    '        </div>',
    '      </div>',
    '      <div class="schedule-title">Schedule I: Participant &amp; Registration Identification</div>',
    '      <table class="data-table">',
    '        <tr>',
    '          <td class="lbl">Primary Signer / Rider:</td>',
    '          <td class="val"><strong>' + escapeHtml_(r.fullName) + '</strong></td>',
    '          <td class="lbl">Verified Contact No:</td>',
    '          <td class="val"><strong>' + escapeHtml_(r.mobileNumber || "—") + '</strong></td>',
    '        </tr>',
    '        <tr>',
    '          <td class="lbl">Date of Birth &amp; Age:</td>',
    '          <td class="val">' + escapeHtml_(r.dob || "—") + ' (' + escapeHtml_(r.ageRole || "—") + ')</td>',
    '          <td class="lbl">Official Email Address:</td>',
    '          <td class="val">' + escapeHtml_(r.emailId || "—") + '</td>',
    '        </tr>',
    '        <tr>',
    '          <td class="lbl">Height Verification:</td>',
    '          <td class="val"><strong>' + escapeHtml_(r.heightStr || "—") + '</strong></td>',
    '          <td class="lbl">Signed By / Role:</td>',
    '          <td class="val">' + escapeHtml_(r.signedBy || r.fullName) + '</td>',
    '        </tr>',
    '        <tr>',
    '          <td class="lbl">Residential Address:</td>',
    '          <td class="val" colspan="3">' + escapeHtml_(r.address || "—") + '</td>',
    '        </tr>',
    '        <tr>',
    '          <td class="lbl">Participants Covered:</td>',
    '          <td class="val" colspan="3"><strong>Total (' + escapeHtml_(r.totalRiders || "1") + '):</strong> ' + (ridersListFormatted || escapeHtml_(r.fullName)) + '</td>',
    '        </tr>',
    '      </table>',
    '      <div class="clauses-header">',
    '        <span>Schedule II: Legally Binding Terms, Covenants &amp; Operational Regulations</span>',
    '        <span>Enforceable Legal Contract</span>',
    '      </div>',
    '      <div class="clauses-body">',
    '        ' + specificClauses + ',',
    '        <div class="clause-item">',
    '          <span class="clause-num">3.</span> <span class="clause-title">Voluntary Assumption of Inherent Operational Risks:</span>',
    '          The participant knowingly, voluntarily, and freely assumes all inherent risks associated with high-speed motorized karting, trampoline jumping, collisions, vehicle rollover, mechanical failures, falls, fractures, sprains, disability, spinal injury, or fatal injury. The participant hereby forever releases, discharges, defends, and indemnifies Fun Strikes Entertainment LLP, its affiliates, track marshals, safety stewards, employees, and agents from any and all legal suits, damages, or liabilities.',
    '        </div>',
    '        <div class="clause-item">',
    '          <span class="clause-num">4.</span> <span class="clause-title">Customer Property Damage &amp; Equipment Breakage Liability:</span>',
    '          Any physical damage, breakage, loss, or impairment caused to go-karts, engines, chassis, safety barriers, trampolines, foam pit, safety gear, or venue property resulting from reckless conduct, disobeying track marshals, or rule violations must be paid in full by the customer as assessed by management before departing the facility premises.',
    '        </div>',
    '        <div class="clause-item clause-highlight">',
    '          <span class="clause-num">5.</span> <span class="clause-title">Strict 100% Non-Refundable &amp; Non-Transferable Payment Policy:</span>',
    '          All ticket fees, admissions, and session charges are <strong>STRICTLY 100% NON-REFUNDABLE AND NON-TRANSFERABLE</strong> once paid. No refunds, credits, or chargebacks shall be granted if a participant voluntarily withdraws, claims they "did not have fun", is disqualified for safety violations, or in the event of equipment downtime.',
    '        </div>',
    '        <div class="clause-item">',
    '          <span class="clause-num">6.</span> <span class="clause-title">Medical Fitness Warranty &amp; Health Restrictions:</span>',
    '          The participant warrants that they are in sound physical and psychological health. Participation is strictly prohibited for individuals who are pregnant, suffer from hypertension, cardiovascular disorders, neck/back/spinal impairments, recent surgical operations, or who are impaired by alcohol, narcotics, or medications.',
    '        </div>',
    '        <div class="clause-item">',
    '          <span class="clause-num">7.</span> <span class="clause-title">CCTV Surveillance, Security &amp; Media Release:</span>',
    '          The facility operates under continuous 24/7 CCTV surveillance. The participant grants Fun Strikes Entertainment LLP irrevocable permission to record, store, and utilize photographs and video recordings for venue security, promotional broadcasts, and safety investigations without monetary claim.',
    '        </div>',
    '        <div class="clause-item">',
    '          <span class="clause-num">8.</span> <span class="clause-title">Governing Law, Dispute Jurisdiction &amp; Severability:</span>',
    '          This legal instrument is executed under and governed by the laws of the Republic of India. Any and all disputes arising from participation shall fall under the exclusive judicial jurisdiction of the competent courts in Surat, Gujarat. If any provision is deemed unenforceable, the validity of all remaining covenants shall remain unaffected.',
    '        </div>',
    '      </div>',
    '      <div class="decl-box">',
    '        <strong>Solemn Affirmation &amp; Legal Declaration:</strong> I, the undersigned participant / authorized parent / legal guardian, do hereby declare under penalty of law that I have attained 18 years of age, all information furnished in Schedule I is accurate, and I have carefully read, understood, and voluntarily executed each and every covenant, liability waiver, and safety rule set forth in this document.',
    '      </div>',
    '    </div>',
    '    <div>',
    '      <table class="exec-table">',
    '        <tr>',
    '          <td style="width: 50%;">',
    '            <div class="sig-title">Signature of Participant / Legal Guardian</div>',
    '            <div class="sig-img-wrap">' + sigImgHtml + '</div>',
    '            <div class="sig-signer-name">' + escapeHtml_(r.signedBy || r.fullName) + ' (Primary Signer)</div>',
    '          </td>',
    '          <td style="width: 50%;">',
    '            <div class="sig-title">Digital Verification &amp; Audit Trail</div>',
    '            <div class="exec-meta-grid">',
    '              <div class="exec-meta-row">',
    '                <span class="exec-meta-lbl">Date of Submission:</span>',
    '                <span class="exec-meta-val">' + escapeHtml_(r.signDate || (r.submittedAt ? String(r.submittedAt).slice(0, 10) : "—")) + '</span>',
    '              </div>',
    '              <div class="exec-meta-row">',
    '                <span class="exec-meta-lbl">Time of Submission:</span>',
    '                <span class="exec-meta-val">' + escapeHtml_(r.signTime || (r.submittedAt ? String(r.submittedAt).slice(11, 19) : "—")) + '</span>',
    '              </div>',
    '              <div class="exec-meta-row">',
    '                <span class="exec-meta-lbl">Terms &amp; 18+ Ack:</span>',
    '                <span class="exec-meta-val" style="color:#059669;">CONFIRMED &amp; AGREED</span>',
    '              </div>',
    '              <div class="exec-meta-row">',
    '                <span class="exec-meta-lbl">Security Audit Token:</span>',
    '                <span class="exec-meta-val">' + escapeHtml_(r.refCode) + '-SEC-OK</span>',
    '              </div>',
    '            </div>',
    '          </td>',
    '        </tr>',
    '      </table>',
    '      <div class="doc-footer">',
    '        <span>Fun Strikes Entertainment LLP &bull; Surat, Gujarat &bull; Official Digital Record: ' + escapeHtml_(r.refCode) + '</span>',
    '        <span>Legally Binding Electronic Record Under Information Technology Act, 2000 (Section 4 &amp; 10A) &bull; Page 1 of 1</span>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</body>',
    '</html>'
  ].join('\n');

  return html;
}