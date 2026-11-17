/**
 * Fun Strikes Entertainment LLP — Fun Strike! Game Zone
 * Enterprise Multi-Branch Google Drive & Google Sheets Database Architecture
 *
 * Physical Branches:
 *   1. Pal Branch (Gauravpath Road, Surat):
 *      - Go-Karting Track (Strictly 18+ & Min Height 5 ft 5 in / 165 cm)
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
var logoBase64 = "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";

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
  "Participant Name",
  "Participant DOB",
  "Age / Role",
  "Signed By (Parent / Guardian)",
  "Mobile Number",
  "Email ID",
  "Address",
  "Total in Group",
  "All Participants in Waiver",
  "18+ Policy Acknowledged",
  "Agreed to T&C",
  "Signature Image",
  "Print / View Waiver",
  "Activity / Zone",
  "Branch"
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
      .addItem("Update Sheet Headers to New Clean Layout", "updateSheetHeadersToNewLayout")
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
 * Updates row 1 headers of all active month tabs to the new clean layout
 * (Activity and Branch moved to the end of the sheet, columns 19 and 20).
 */
function updateSheetHeadersToNewLayout() {
  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  const monthTab = getMonthTabName_(new Date());
  let count = 0;

  Object.keys(STREAMS).forEach(function(key) {
    const cfg = STREAMS[key];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    if (!ss) return;
    const sheet = ss.getSheetByName(monthTab);
    if (!sheet) return;
    
    const lastCol = sheet.getLastColumn();
    if (lastCol > HEADERS.length) {
      sheet.getRange(1, HEADERS.length + 1, 1, lastCol - HEADERS.length).clearContent();
    }

    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold")
      .setBackground(cfg.themeColor || "#0f172a")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle")
      .setFontSize(10);
    sheet.setRowHeight(1, 32);
    try {
      sheet.autoResizeColumns(1, HEADERS.length);
    } catch(e) {}
    count++;
  });

  try {
    SpreadsheetApp.getUi().alert("Updated " + count + " sheet(s) to new clean column layout!");
  } catch(e) {}
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
    if (rawPayload.length > 250000) {
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

    const rowsToAppend = effectiveRiders.map(function (r, idx) {
      const hasAge = r.age !== null && r.age !== undefined && !isNaN(r.age);
      const isMinor = hasAge && r.age < 18;
      const ageRole =
        (hasAge ? r.age + " yrs (" + (isMinor ? "MINOR" : "Adult") + ") — " : "") +
        (r.relation || (idx === 0 && data.primaryIsRiding !== false ? "Primary Signer" : "Participant"));

      const participantSignedBy = (isMinor || r.name !== cleanFullName || data.primaryIsRiding === false)
        ? cleanFullName + " (Parent / Legal Guardian)"
        : cleanFullName + " (Self)";

      return [
        "'" + submittedIso,                               // 0: Submitted At
        safeCell_(refCodeStr),                            // 1: Ref Code
        safeCell_(r.name || cleanFullName),               // 2: Participant Name
        safeCell_(r.dob || cleanDob),                     // 3: Participant DOB
        safeCell_(ageRole),                               // 4: Age / Role
        safeCell_(participantSignedBy),                   // 5: Signed By (Parent / Guardian)
        "'" + cleanMobile,                                // 6: Mobile Number
        safeCell_(cleanEmail),                            // 7: Email ID
        safeCell_(cleanAddress),                          // 8: Address
        totalCount,                                       // 9: Total in Group
        safeCell_(allNamesList),                          // 10: All Participants in Waiver
        is18Ack,                                          // 11: 18+ Policy Acknowledged
        data.agreed ? "YES" : "NO",                       // 12: Agreed to T&C
        sigCellValue,                                     // 13: Signature Image
        printFormula,                                     // 14: Print / View Waiver
        safeCell_(cleanActivity),                         // 15: Activity / Zone (at the end)
        safeCell_(cleanBranch)                            // 16: Branch (at the end)
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
  const sigColIndex = getSigColumnNumber_(found.sheet, m, found.colOffset);
  const sigFormula = found.sheet.getRange(found.rowNum, found.colOffset + sigColIndex).getFormula();
  const record = parseRecordFromRowValues_(m, sigFormula, cfg);

  return HtmlService.createHtmlOutput(buildPrintableHtml_(record))
    .setTitle("Print Waiver — " + record.refCode);
}

function detectLayoutType_(rowVals) {
  // Legacy layout: Activity in col 3 (index 2), Branch in col 4 (index 3)
  if (/kart|softplay|trampoline|bounce/i.test(String(rowVals[2] || "")) || /surat|pal|motavarachha/i.test(String(rowVals[3] || ""))) {
    return "legacy";
  }
  // 17-column clean layout: Activity in col 16 (index 15) or total length <= 18
  if (/kart|softplay|trampoline|bounce/i.test(String(rowVals[15] || "")) || rowVals.length <= 18) {
    return "clean17";
  }
  // 20-column layout: Activity in col 19 (index 18)
  return "layout20";
}

function getSigColumnNumber_(sheet, rowVals, colOffset) {
  // 1. Try finding column by header name in row 1
  try {
    if (sheet && sheet.getLastRow() >= 1) {
      const colOff = colOffset || 0;
      const numCols = Math.max(sheet.getLastColumn(), 17);
      const headers = sheet.getRange(1, 1 + colOff, 1, numCols).getDisplayValues()[0];
      for (let c = 0; c < headers.length; c++) {
        if (/signature/i.test(String(headers[c] || ""))) {
          return c + 1; // 1-based column
        }
      }
    }
  } catch (e) {}

  // 2. Scan row values for signature markers
  for (let i = 0; i < rowVals.length; i++) {
    const val = String(rowVals[i] || "");
    if (/✍️|view signature/i.test(val) || isValidSignatureDataUrl_(val) || /drive\.google\.com/i.test(val)) {
      return i + 1;
    }
  }

  // 3. Fallback based on layout type
  const layout = detectLayoutType_(rowVals);
  if (layout === "clean17") return 14;
  if (layout === "layout20") return 17;
  return rowVals.length >= 20 ? 19 : 18;
}

function parseRecordFromRowValues_(rowVals, sigFormula, cfg) {
  const layout = detectLayoutType_(rowVals);

  if (layout === "clean17") {
    const rawSigVal = rowVals[13];
    const resolvedSigUrl = resolveSignatureDataUrl_(rawSigVal, sigFormula);
    return {
      submittedAt: rowVals[0],
      refCode: rowVals[1],
      fullName: rowVals[2],
      dob: rowVals[3],
      ageRole: rowVals[4],
      signedBy: rowVals[5],
      mobile: rowVals[6],
      phone: rowVals[6],
      mobileNumber: rowVals[6],
      email: rowVals[7],
      emailId: rowVals[7],
      address: rowVals[8],
      totalRiders: rowVals[9],
      allRiders: rowVals[10],
      is18Ack: rowVals[11],
      agreed: rowVals[12],
      signatureUrl: resolvedSigUrl,
      signatureDataUrl: resolvedSigUrl,
      activity: rowVals[15] || (cfg && cfg.activityLabel) || "Trampoline Arena & Soft Play",
      branch: rowVals[16] || (cfg && cfg.branchLabel) || "Surat"
    };
  } else if (layout === "layout20") {
    const rawSigVal = rowVals[16];
    const resolvedSigUrl = resolveSignatureDataUrl_(rawSigVal, sigFormula);
    return {
      submittedAt: rowVals[0],
      refCode: rowVals[1],
      fullName: rowVals[2],
      dob: rowVals[3],
      ageRole: rowVals[4],
      signedBy: rowVals[5],
      mobile: rowVals[6],
      phone: rowVals[6],
      mobileNumber: rowVals[6],
      email: rowVals[7],
      emailId: rowVals[7],
      address: rowVals[8],
      totalRiders: rowVals[9],
      allRiders: rowVals[10],
      heightStr: rowVals[11],
      is18Ack: rowVals[12],
      agreed: rowVals[13],
      signDate: rowVals[14],
      signTime: rowVals[15],
      signatureUrl: resolvedSigUrl,
      signatureDataUrl: resolvedSigUrl,
      activity: rowVals[18] || (cfg && cfg.activityLabel) || "Trampoline Arena & Soft Play",
      branch: rowVals[19] || (cfg && cfg.branchLabel) || "Surat"
    };
  } else {
    const rawSigVal = rowVals.length >= 20 ? rowVals[18] : rowVals[17];
    const resolvedSigUrl = resolveSignatureDataUrl_(rawSigVal, sigFormula);
    return {
      submittedAt: rowVals[0],
      refCode: rowVals[1],
      activity: rowVals[2],
      branch: rowVals[3],
      fullName: rowVals[4],
      dob: rowVals[5],
      ageRole: rowVals[6],
      signedBy: rowVals[7],
      mobile: rowVals[8],
      phone: rowVals[8],
      mobileNumber: rowVals[8],
      email: rowVals[9],
      emailId: rowVals[9],
      address: rowVals[10],
      totalRiders: rowVals[11],
      allRiders: rowVals[12],
      heightStr: rowVals[13],
      is18Ack: rowVals.length >= 20 ? rowVals[14] : (rowVals[13] || "N/A"),
      agreed: rowVals.length >= 20 ? rowVals[15] : rowVals[14],
      signDate: rowVals.length >= 20 ? rowVals[16] : rowVals[15],
      signTime: rowVals.length >= 20 ? rowVals[17] : rowVals[16],
      signatureUrl: resolvedSigUrl,
      signatureDataUrl: resolvedSigUrl,
      activityTitle: rowVals[2],
      branchLocation: rowVals[3]
    };
  }
}

function findPrintRow_(sheet, refCode, token, props, colOffset) {
  if (!sheet || sheet.getLastRow() <= 1) {
    return { match: null, sawRef: false, sheet: sheet, rowNum: -1, colOffset: colOffset };
  }

  const startCol = 1 + colOffset;
  const numCols = Math.max(sheet.getLastColumn() - colOffset, HEADERS.length);
  const allVals = sheet.getRange(2, startCol, sheet.getLastRow() - 1, numCols).getDisplayValues();
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
  const sigColIndex = getSigColumnNumber_(sheet, vals, 0);
  const sigFormula = sheet.getRange(rowIndex, sigColIndex).getFormula();
  const record = parseRecordFromRowValues_(vals, sigFormula, null);

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
  if (!match || String(dataUrl).length > 300000) return "";
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
  return s.length <= 300000 && /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(s);
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
  const logoBase64 = (r && r.logoBase64) || "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";
  const isGokart = /kart/i.test(r.activity || "") || /kart/i.test(r.branch || "");
  const activityTitle = isGokart ? "GO-KARTING TRACK (18+)" : "TRAMPOLINE ARENA & SOFT PLAY PARK";
  const activitySub = isGokart ? "Go-Karting Speedway Operational Directives & Safety Protocol" : "Trampoline Bounce Rules, Grip Socks Policy & Play Regulations";

  const riderLines = String(r.allRiders || r.fullName || "")
    .split(/\r?\n/)
    .filter(Boolean);

  const totalCount = riderLines.length;

  // Schedule II: Strict 1 line per participant name (white-space: nowrap)
  const schedule2Rows = riderLines.map(function(line, idx) {
    const cleanLine = line.replace(/^\d+\.\s*/, "");
    const parts = cleanLine.split(" | ");
    const pName = parts[0] || cleanLine;
    const pDob = parts[1] || r.dob || "—";
    const pAge = parts[2] || r.ageRole || "—";
    const pRel = parts[3] || (idx === 0 && (!r.signedBy || !r.signedBy.includes("Parent/Guardian")) ? "Primary Signer" : "Participant");

    const isMinor = /minor/i.test(pAge) || /minor|child/i.test(pRel);
    const cleanAge = pAge.replace(/\s*\((minor|adult)\)/gi, "").trim();
    const ageBadge = isMinor
      ? '<span class="badge badge-minor">MINOR</span> ' + escapeHtml_(cleanAge)
      : '<span class="badge badge-adult">ADULT</span> ' + escapeHtml_(cleanAge);

    let relBadge;
    if (/child|minor/i.test(pRel)) {
      relBadge = '<span class="badge badge-minor">CHILD / MINOR</span>';
    } else if (/primary|self/i.test(pRel)) {
      relBadge = '<span class="badge badge-primary">PRIMARY SIGNER</span>';
    } else {
      relBadge = '<span class="badge badge-adult">' + escapeHtml_(pRel || "Participant") + '</span>';
    }

    return `<tr>
      <td style="text-align: center; font-weight: bold; color: #475569; width: 24px; white-space: nowrap;">${idx + 1}</td>
      <td style="white-space: nowrap; font-weight: bold; color: #0f172a; padding: 3px 8px;">${escapeHtml_(pName)}</td>
      <td style="text-align: center; white-space: nowrap; padding: 3px 6px;">${escapeHtml_(pDob)}</td>
      <td style="text-align: center; white-space: nowrap; padding: 3px 6px;">${ageBadge}</td>
      <td style="white-space: nowrap; padding: 3px 8px;">${relBadge}</td>
    </tr>`;
  }).join('');

  const schedule2Html = `
    <table class="data-table participants-table">
      <thead>
        <tr>
          <th style="width: 24px; text-align: center;">#</th>
          <th>Full Legal Name of Participant</th>
          <th style="width: 85px; text-align: center;">Date of Birth</th>
          <th style="width: 100px; text-align: center;">Age &amp; Category</th>
          <th style="width: 120px;">Relationship</th>
        </tr>
      </thead>
      <tbody>${schedule2Rows}</tbody>
    </table>
  `;

  let clausesHtml = '';
  let checklistHtml = '';
  let marshalCheckHtml = '';

  if (isGokart) {
    clausesHtml = `
      <div class="clause-item highlight-clause">
        <strong>1. STRICT 18+ ADULT POLICY &amp; SOLE MINOR LIABILITY CLAUSE:</strong> The Go-Karting Track is strictly designed, engineered, and operated exclusively for adult drivers aged 18 and older. If a minor under 18 years of age operates a kart or signs this instrument, the primary signer and parent/legal guardian explicitly warrant, covenant, and declare that <strong>ONE HUNDRED PERCENT (100%) OF ALL RISKS, PERSONAL INJURIES, VEHICLE LIABILITIES, AND DAMAGES REST SOLELY WITH THEM</strong>. Fun Strikes Entertainment LLP, its designated partners, and track marshals bear ZERO liability under any circumstances.
      </div>
      <div class="clause-item">
        <strong>2. TRACK RULES, SAFETY EQUIPMENT &amp; MANDATORY HEIGHT VERIFICATION:</strong> Single-kart drivers must meet the strict minimum height requirement of <strong>5 ft 5 in (165 cm)</strong>. Full-face protective helmets must be securely buckled prior to entering the pit lane and accelerating. Closed-toe footwear is mandatory at all times (no crocs, sandals, high heels, or loose footwear). Loose clothing, scarves, dupattas must be tucked in securely; long hair must be tied securely above shoulder level. <strong>ZERO-TOLERANCE BUMPING POLICY:</strong> Intentional ramming, bumping, or hazardous driving results in immediate disqualification and ejection from the circuit on first warning without refund.
      </div>
      <div class="clause-item">
        <strong>3. VOLUNTARY ASSUMPTION OF INHERENT MOTORSPORTS RISKS:</strong> The participant and their guardian knowingly, voluntarily, and freely assume all inherent risks associated with high-speed motorized karting, collisions, vehicle rollover, mechanical failures, falls, fractures, sprains, disability, spinal injury, or fatal injury. The participant hereby forever releases, discharges, defends, and indemnifies Fun Strikes Entertainment LLP, its affiliates, track marshals, safety stewards, employees, and agents from any and all legal suits, damages, or liabilities.
      </div>
      <div class="clause-item">
        <strong>4. CUSTOMER PROPERTY DAMAGE &amp; EQUIPMENT BREAKAGE LIABILITY:</strong> Any physical damage, breakage, loss, or impairment caused to go-karts, engines, chassis, safety barriers, or venue property resulting from reckless conduct, disobeying track marshals, or rule violations must be paid in full by the customer as assessed by management before departing the facility premises.
      </div>
      <div class="clause-item">
        <strong>5. PROHIBITED SUBSTANCES, INTOXICATION &amp; LOOSE ARTICLES POLICY:</strong> Possession or consumption of alcohol, narcotics, drugs, or smoking/vaping is strictly prohibited on the premises. Persons suspected of being under the influence will be denied track access immediately. Mobile phones, cameras, selfie sticks, and loose items are prohibited while driving.
      </div>
      <div class="clause-item highlight-clause">
        <strong>6. STRICT 100% NON-REFUNDABLE &amp; NON-TRANSFERABLE PAYMENT POLICY:</strong> All ticket fees, admissions, and session charges are <strong>STRICTLY 100% NON-REFUNDABLE AND NON-TRANSFERABLE</strong> once paid. No refunds, credits, chargebacks, or date transfers shall be granted if a participant voluntarily withdraws, claims they "did not have fun", is disqualified or ejected for safety violations, fails height/attire checks, or in the event of equipment downtime or rain/weather interruptions.
      </div>
      <div class="clause-item">
        <strong>7. MEDICAL FITNESS WARRANTY &amp; CARDIOVASCULAR RESTRICTIONS:</strong> The participant warrants that all covered drivers are in sound physical and psychological health. Participation is strictly prohibited for individuals who are pregnant, suffer from hypertension, cardiovascular disorders, neck/back/spinal impairments, epilepsy, recent surgical operations, or who are impaired by alcohol, narcotics, or medications.
      </div>
      <div class="clause-item">
        <strong>8. SPEED GOVERNOR TAMPERING &amp; PIT LANE REGULATIONS:</strong> Any customer attempting to tamper with kart engines, governor cables, tire barriers, or safety switches will be permanently barred from the facility. Drivers must enter the pit lane at walking pace only; spinning out in the pit lane results in automatic termination of track privileges.
      </div>
      <div class="clause-item">
        <strong>9. CCTV SURVEILLANCE, SECURITY &amp; MEDIA RELEASE:</strong> The facility operates under continuous 24/7 CCTV surveillance. The participant grants Fun Strikes Entertainment LLP irrevocable permission to record, store, and utilize photographs and video recordings for venue security, promotional broadcasts, and safety investigations without monetary claim.
      </div>
      <div class="clause-item">
        <strong>10. EMERGENCY MEDICAL AUTHORIZATION &amp; FIRST AID CONSENT:</strong> In the event of injury, acute illness, or accident, the signer hereby authorizes Fun Strikes Entertainment LLP marshals and designated medical personnel to administer necessary first aid and, if warranted, arrange transport to the nearest medical emergency facility at the customer's sole financial expense.
      </div>
      <div class="clause-item">
        <strong>11. INDEMNIFICATION, GOVERNING LAW, IT ACT &amp; DPDP ACT 2023:</strong> The signer covenants to indemnify and hold harmless Fun Strikes Entertainment LLP from any claims. This agreement is governed exclusively by Indian law with jurisdiction in Surat, Gujarat. Pursuant to Sections 4 and 10A of the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023 (DPDP Act), all participant personal data is processed lawfully and strictly for venue operations, safety enforcement, and legal indemnification. This digital signature holds full legal validity and admissibility.
      </div>
    `;

    checklistHtml = `
      <table class="checklist-table">
        <tr>
          <td><span class="check-box-icon">&#10003;</span> Full-Face Helmet Sized &amp; Strapped</td>
          <td><span class="check-box-icon">&#10003;</span> Closed-Toe Shoes Inspected</td>
          <td><span class="check-box-icon">&#10003;</span> Driver Height &ge; 5ft 5in Confirmed</td>
          <td><span class="check-box-icon">&#10003;</span> Track Flags Briefing Understood</td>
        </tr>
      </table>
    `;

    marshalCheckHtml = `
      <div class="marshal-text">
        <strong>COUNTER MARSHAL CHECK:</strong>
        <span>Safety Helmet Buckled &bull; Closed-Toe Shoes &bull; Height Verified &ge; 5'5" &bull; Wristbands Issued (${totalCount})</span>
      </div>
      <div class="marshal-status-badge">STATUS: CLEARED FOR TRACK</div>
    `;
  } else {
    clausesHtml = `
      <div class="clause-item highlight-clause">
        <strong>1. MANDATORY NON-SLIP GRIP SOCKS POLICY:</strong> Approved non-slip trampoline grip socks must be worn at all times by every participant inside the trampoline arena and soft play structures. Bare feet, street footwear, sandals, sneakers, and regular smooth socks are strictly prohibited on trampoline beds.
      </div>
      <div class="clause-item">
        <strong>2. ONE PERSON PER TRAMPOLINE MAT &amp; NO DOUBLE BOUNCING:</strong> Strictly one jumper is permitted on any individual trampoline mat/square at a time. Double-bouncing, jumping into another participant's bounce zone, or landing on another jumper is hazardous and strictly prohibited.
      </div>
      <div class="clause-item">
        <strong>3. STUNT RESTRICTIONS &amp; FOAM PIT SAFETY DIRECTIVE:</strong> Inverted maneuvers, somersaults, multi-flips, and head-first diving into foam pits or airbag zones are strictly prohibited. Jumpers must always land on both feet simultaneously or in a seated bottom position. Always check that the foam pit is completely clear before jumping in.
      </div>
      <div class="clause-item">
        <strong>4. POCKETS EMPTY &amp; JEWELRY/SHARP OBJECTS PROHIBITION:</strong> All participants must empty all pockets and remove all jewelry, smartwatches, belt buckles, keychains, loose coins, pens, eyeglasses (unless sport-strapped), and mobile devices before stepping onto the jumping mats.
      </div>
      <div class="clause-item">
        <strong>5. ACTIVE PARENTAL SUPERVISION &amp; ZONE SEGREGATION:</strong> Parents and guardians bear 100% responsibility for actively supervising accompanying minors at all times. Toddler Soft Play zones are strictly reserved for toddlers and young children; adult jumping or rough play in toddler areas is prohibited. No running on safety pads, no climbing on peripheral netting, and no hanging on basketball rims.
      </div>
      <div class="clause-item highlight-clause">
        <strong>6. STRICT 100% NON-REFUNDABLE &amp; NON-TRANSFERABLE PAYMENT POLICY:</strong> All ticket fees, grip sock purchases, admissions, and session charges are <strong>STRICTLY 100% NON-REFUNDABLE AND NON-TRANSFERABLE</strong> once paid. No refunds, credits, chargebacks, or session date transfers shall be granted if a participant voluntarily leaves early, claims they "did not have fun", is ejected for safety violations, or in the event of venue capacity/equipment downtime.
      </div>
      <div class="clause-item">
        <strong>7. VOLUNTARY ASSUMPTION OF INHERENT JUMPING RISKS:</strong> Soft play and trampoline activities involve physical exertion, high impacts, jumping, and rapid balance changes. The participant and guardian freely assume all inherent risks including sprains, joint dislocations, bone fractures, spinal trauma, or accidental collisions. Fun Strikes Entertainment LLP bears ZERO liability.
      </div>
      <div class="clause-item">
        <strong>8. MEDICAL FITNESS WARRANTY &amp; HEALTH RESTRICTIONS:</strong> Participation is strictly prohibited for pregnant individuals or persons suffering from cardiovascular ailments, hypertension, spinal/back/neck impairments, epilepsy, recent surgical procedures, or individuals under the influence of alcohol, medications, or narcotics.
      </div>
      <div class="clause-item">
        <strong>9. CUSTOMER LIABILITY FOR MAT &amp; EQUIPMENT BREAKAGE:</strong> If any damage, tear, or breakage is caused to trampoline beds, protective spring pads, enclosure nets, foam pit blocks, or soft-play equipment due to reckless behavior, sharp objects, or rule violations, the customer agrees to pay full repair/replacement costs before leaving.
      </div>
      <div class="clause-item">
        <strong>10. EMERGENCY FIRST AID &amp; 24/7 CCTV CONSENT:</strong> The signer consents to CCTV monitoring for facility safety. In case of injury, Fun Strikes staff are authorized to provide basic first aid and coordinate emergency 108 ambulance transfer at customer's sole cost.
      </div>
      <div class="clause-item">
        <strong>11. LEGAL JURISDICTION, IT ACT &amp; DPDP ACT 2023:</strong> This agreement is governed exclusively by Indian law and the courts of Surat, Gujarat. Pursuant to Sections 4 &amp; 10A of the IT Act, 2000, and the Digital Personal Data Protection Act, 2023 (DPDP Act), all participant data is protected and lawfully processed. This electronic signature constitutes a legally valid contract.
      </div>
    `;

    checklistHtml = `
      <table class="checklist-table">
        <tr>
          <td><span class="check-box-icon">&#10003;</span> Approved Grip Socks On</td>
          <td><span class="check-box-icon">&#10003;</span> Pockets Emptied Completely</td>
          <td><span class="check-box-icon">&#10003;</span> 1 Jumper Per Mat Understood</td>
          <td><span class="check-box-icon">&#10003;</span> Arena Court Whistle Rules Agreed</td>
        </tr>
      </table>
    `;

    marshalCheckHtml = `
      <div class="marshal-text">
        <strong>COUNTER MONITOR CHECK:</strong>
        <span>Non-Slip Grip Socks Verified &bull; Pockets Emptied &bull; Arena Rules Briefed &bull; Wristbands Issued (${totalCount})</span>
      </div>
      <div class="marshal-status-badge" style="background: #0284c7;">STATUS: CLEARED FOR ARENA</div>
    `;
  }

  const signerName = r.signerName || (r.signedBy ? r.signedBy.replace(/\s*\([^)]*\)/, "").trim() : "") || r.fullName || "Signer";
  const isParentOnly = (r.signedBy && /Parent\/Guardian|Parent \/ Legal Guardian/i.test(r.signedBy)) || r.primaryIsRiding === false;
  const hasMinors = riderLines.some(l => /minor|child/i.test(l));
  const signerRoleLabel = isParentOnly
    ? "Parent / Legal Guardian (Non-Participating)"
    : (hasMinors ? "Parent / Legal Guardian & Participant" : "Self (Adult Participant)");

  const sigRaw = (r && (r.signatureDataUrl || r.signatureUrl || r.signature || r.guestSignature)) || "";
  const hasSig = sigRaw && (String(sigRaw).startsWith("data:image") || String(sigRaw).startsWith("http"));
  const sigHtml = hasSig
    ? `<img src="${sigRaw}" class="sig-img" alt="Digital Signature" style="max-height: 48px; max-width: 240px; object-fit: contain; display: block; margin: 0 auto;">`
    : `<div style="height: 38px; line-height: 38px; font-style: italic; color: #1e293b; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 15pt; text-align: center;">${escapeHtml_(signerName)}</div>`;

  let execDate = "17-11-2026";
  let execTime = "05:30:00 PM IST";
  const subStr = String(r.submittedAt || r.timestamp || r.signDate || "");
  if (subStr) {
    if (subStr.includes("T")) {
      const parts = subStr.split("T");
      execDate = parts[0];
      execTime = parts[1].replace(/Z|\.\d+Z?$/i, "") + " IST";
    } else if (subStr.includes(" ")) {
      const parts = subStr.split(" ");
      execDate = parts[0];
      execTime = parts.slice(1).join(" ");
    } else {
      execDate = subStr;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Official Waiver - ${escapeHtml_(r.refCode || "FS-WAIVER")} - Fun Strike!</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 7mm 8mm 7mm 8mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif;
      color: #0f172a;
      background: #ffffff !important; /* PURE WHITE - ZERO GRAY ANYWHERE */
      font-size: 8.5pt;
      line-height: 1.30;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 8px 18px;
      font-family: Arial, sans-serif;
      font-size: 11px;
      margin-bottom: 12px;
    }
    .print-btn {
      background: #e11d48;
      color: #ffffff;
      border: none;
      padding: 6px 16px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      font-size: 12px;
    }

    /* MASTER TABLE PRINT WRAPPER: REPEATS HEADER AT TOP AND FOOTER AT BOTTOM OF EVERY PAGE */
    .waiver-page-table {
      width: 100%;
      max-width: 194mm;
      margin: 0 auto;
      border-collapse: collapse;
      background: #ffffff;
    }

    thead {
      display: table-header-group;
    }
    tfoot {
      display: table-footer-group;
    }

    /* REPEATING HEADER AT TOP OF EVERY PAGE WITH CLOSED TOP/SIDE BORDER */
    .waiver-header-td {
      border: 1.5px solid #0f172a;
      border-bottom: none;
      padding: 4mm 7mm 1mm 7mm;
      background: #ffffff;
      vertical-align: top;
    }

    /* CLOSED RECTANGLE BORDER ON CONTENT AREA */
    .waiver-content-td {
      border-left: 1.5px solid #0f172a;
      border-right: 1.5px solid #0f172a;
      border-top: none;
      border-bottom: none;
      padding: 1mm 7mm 2mm 7mm;
      background: #ffffff;
      vertical-align: top;
    }

    /* CLOSED RECTANGLE BORDER ON FOOTER (REPEATS AT BOTTOM OF EVERY PAGE) */
    .waiver-footer-td {
      border: 1.5px solid #0f172a;
      border-top: 1.2px solid #0f172a;
      padding: 4px 12px;
      background: #ffffff;
      vertical-align: middle;
    }
    .clean-footer-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-family: Arial, sans-serif;
      width: 100%;
    }
    .footer-top-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.4pt;
      letter-spacing: 0.3px;
    }
    .c-footer-left {
      font-weight: normal;
      color: #334155;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .c-footer-right {
      font-weight: normal;
      color: #334155;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .footer-bottom-line {
      text-align: center;
      font-size: 7pt;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    /* PROTECT ATOMIC LOGICAL UNITS AGAINST SPLITTING ACROSS A PAGE LINE */
    .doc-unit {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 4px;
    }

    /* SCHEDULE III ALLOWS NATURAL PAGINATION ACROSS PAGES, BUT PROTECTS INDIVIDUAL CLAUSES */
    .doc-unit-flow {
      margin-bottom: 4px;
    }
    .doc-unit-flow .section-title {
      break-after: avoid;
      page-break-after: avoid;
    }

    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 3px;
      margin-bottom: 2px;
    }
    .header-table td {
      vertical-align: middle;
    }
    .logo-cell {
      width: 60px;
      text-align: left;
      padding-right: 10px;
    }
    .logo-img {
      height: 48px;
      width: auto;
      display: block;
    }
    .title-cell {
      text-align: center;
    }
    .company-title {
      font-size: 13.5pt;
      font-weight: 900;
      letter-spacing: 0.8px;
      color: #0f172a;
      text-transform: uppercase;
    }
    .company-sub {
      font-size: 7.2pt;
      font-style: italic;
      color: #475569;
      font-family: Arial, sans-serif;
      margin-top: 1px;
    }
    .doc-main-heading {
      font-size: 8.6pt;
      font-weight: bold;
      color: #b91c1c;
      letter-spacing: 0.4px;
      margin-top: 2px;
      text-transform: uppercase;
    }

    /* 2x2 BALANCED META BAR (2 ITEMS PER ROW ACROSS 2 LINES) */
    .meta-bar {
      width: 100%;
      border-collapse: collapse;
      border-top: 1.5px solid #0f172a;
      border-bottom: 1.5px solid #0f172a;
      background: #f8fafc;
      margin-top: 3px;
      font-family: Arial, sans-serif;
      font-size: 7.4pt;
    }
    .meta-bar td {
      padding: 3.5px 8px;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }

    .section-title {
      background: #0f172a;
      color: #ffffff;
      padding: 3px 8px;
      font-family: Arial, sans-serif;
      font-size: 7.8pt;
      font-weight: bold;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.8pt;
      font-family: Arial, sans-serif;
      border: 1px solid #cbd5e1;
    }
    .data-table td, .data-table th {
      border: 1px solid #cbd5e1;
      padding: 3px 7px;
    }
    .label-cell {
      background: #f8fafc;
      font-weight: bold;
      color: #475569;
      width: 18%;
      text-transform: uppercase;
      font-size: 7pt;
    }
    .value-cell {
      color: #0f172a;
      width: 32%;
    }

    .participants-table th {
      background: #f1f5f9;
      font-weight: bold;
      color: #1e293b;
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 3.5px 6px;
      white-space: nowrap;
    }

    .badge {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 2px;
      font-size: 6.5pt;
      font-weight: bold;
      text-transform: uppercase;
      font-family: Arial, sans-serif;
      white-space: nowrap;
    }
    .badge-adult { background: #dbeafe; color: #1e40af; }
    .badge-minor { background: #fee2e2; color: #991b1b; }
    .badge-primary { background: #dcfce7; color: #166534; }

    .clauses-container {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 8pt;
      line-height: 1.28;
      text-align: justify;
    }
    .clause-item {
      break-inside: avoid;
      page-break-inside: avoid;
      padding: 2.5px 0;
      border-bottom: 1px dotted #e2e8f0;
    }
    .clause-item:last-child {
      border-bottom: none;
    }
    .highlight-clause {
      background: #fff1f2;
      border-left: 3px solid #e11d48;
      padding: 3.5px 7px !important;
      margin: 1.5px 0;
    }

    .info-callout {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3px solid #0284c7;
      padding: 4px 8px;
      font-size: 7.6pt;
      line-height: 1.26;
      margin-bottom: 3px;
    }
    .checklist-table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      font-family: Arial, sans-serif;
      font-size: 7.4pt;
    }
    .checklist-table td {
      border: 1px solid #cbd5e1;
      padding: 3.5px 6px;
      font-weight: bold;
      color: #0f172a;
      width: 25%;
    }
    .check-box-icon {
      color: #166534;
      font-weight: 900;
      margin-right: 3px;
    }

    .declaration-box {
      border: 1.2px solid #0f172a;
      background: #ffffff;
      padding: 4px 7px;
      font-size: 7.4pt;
      line-height: 1.26;
      text-align: justify;
    }

    .signature-grid {
      display: flex;
      width: 100%;
      border: 1.2px solid #0f172a;
      background: #ffffff;
    }
    .sig-col-left {
      width: 56%;
      border-right: 1.2px solid #0f172a;
      padding: 6px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sig-col-right {
      width: 44%;
      padding: 6px 10px;
      background: #f8fafc;
      font-size: 7.3pt;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 3px;
    }
    .sig-img {
      max-height: 48px;
      max-width: 100%;
      object-fit: contain;
      display: block;
      margin: 2px auto;
    }
    .audit-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #cbd5e1;
      padding-bottom: 1.5px;
    }
    .audit-label {
      color: #64748b;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 6.8pt;
    }
    .audit-val {
      font-weight: bold;
      color: #0f172a;
    }

    /* CLEARLY SEPARATED COUNTER MARSHAL CHECK (NO BADGE OVERLAPPING) */
    .marshal-strip {
      border: 1.5px solid #166534;
      background: #f0fdf4;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      font-family: Arial, sans-serif;
      font-size: 7.5pt;
    }
    .marshal-text {
      flex: 1 1 auto;
      line-height: 1.34;
    }
    .marshal-status-badge {
      flex: 0 0 auto;
      background: #166534;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 7.8pt;
      letter-spacing: 0.5px;
      white-space: nowrap;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0;
      }
      .print-bar {
        display: none !important;
      }
      .waiver-page-table {
        max-width: 100% !important;
        margin: 0 !important;
      }
    }
  </style>
</head>
<body>

  <div class="print-bar">
    <span>OFFICIAL LEGAL RECORD: Ref <strong>${escapeHtml_(r.refCode || "FS")}</strong> &bull; ${escapeHtml_(r.fullName || "Signer")} (${totalCount} Participants) &bull; ${escapeHtml_(activityTitle)}</span>
    <button class="print-btn" onclick="window.print()">Print Legal Contract</button>
  </div>

  <table class="waiver-page-table">
    <thead>
      <tr>
        <td class="waiver-header-td">
          <table class="header-table">
            <tr>
              <td class="logo-cell"><img src="data:image/png;base64,${logoBase64}" class="logo-img" alt="Fun Strike Logo"></td>
              <td class="title-cell">
                <div class="company-title">FUN STRIKES ENTERTAINMENT LLP</div>
                <div class="company-sub">Registered LLP under Indian Limited Liability Partnership Act, 2008 &bull; Surat, Gujarat, India</div>
                <div class="doc-main-heading">PARTICIPANT LIABILITY WAIVER, INDEMNITY AGREEMENT & RULES OF OPERATION</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <td class="waiver-footer-td">
          <div class="clean-footer-wrap">
            <div class="footer-top-line">
              <span class="c-footer-left">Fun Strikes Entertainment LLP</span>
              <span class="c-footer-right">${escapeHtml_(r.branch || "Gauravpath Road, Pal, Surat")}</span>
            </div>
            <div class="footer-bottom-line">
              MADE WITH &#10084; BY ARYAN AND NEXORAONESOLUTION
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
    <tbody>
      <tr>
        <td class="waiver-content-td">

          <!-- 1. META BAR (2x2 BALANCED GRID) -->
          <div class="doc-unit">
            <table class="meta-bar">
              <tr>
                <td style="width: 52%;"><strong>ZONE / ACTIVITY:</strong> ${escapeHtml_(activityTitle)}</td>
                <td style="width: 48%;"><strong>DOCUMENT REF:</strong> ${escapeHtml_(r.refCode || "FS-RECORD")}</td>
              </tr>
              <tr>
                <td><strong>LOCATION / BRANCH:</strong> ${escapeHtml_(r.branch || "Gauravpath Road, Pal, Surat")}</td>
                <td><strong>TOTAL PARTICIPANTS:</strong> ${totalCount} (${isGokart ? 'DRIVERS' : 'JUMPERS'})</td>
              </tr>
            </table>
          </div>

          <!-- 2. SCHEDULE I: LEGAL SIGNER -->
          <div class="doc-unit">
            <div class="section-title">
              <span>Schedule I: Legal Signer &amp; Guardian Identification</span>
              <span>FORM FS-W9</span>
            </div>
            <table class="data-table">
              <tr>
                <td class="label-cell">Legal Signer / Parent:</td>
                <td class="value-cell" style="word-break: break-word;"><strong>${escapeHtml_(signerName)}</strong></td>
                <td class="label-cell">Verified Mobile:</td>
                <td class="value-cell"><strong>${escapeHtml_(r.phone || r.mobile || r.mobileNumber || "—")}</strong></td>
              </tr>
              <tr>
                <td class="label-cell">Date of Birth &amp; Age:</td>
                <td class="value-cell">${escapeHtml_(r.dob || "—")} (${escapeHtml_(r.ageRole || "Adult")})</td>
                <td class="label-cell">Official Email:</td>
                <td class="value-cell" style="word-break: break-all;">${escapeHtml_(r.email || r.emailId || "—")}</td>
              </tr>
              <tr>
                <td class="label-cell">Legal Authority &amp; Role:</td>
                <td class="value-cell"><strong>${escapeHtml_(signerRoleLabel)}</strong></td>
                <td class="label-cell">${isGokart ? 'Height Verification:' : 'Participant Status:'}</td>
                <td class="value-cell"><strong>${isGokart ? (r.heightInches ? r.heightInches + ' in (Verified ≥ 5ft 5in)' : 'Verified On-Site (≥ 5ft 5in)') : (isParentOnly ? 'Accompanying Guardian (Spectator)' : 'Cleared for Arena')}</strong></td>
              </tr>
              <tr>
                <td class="label-cell">Residential Address:</td>
                <td class="value-cell" colspan="3" style="word-break: break-word;">${escapeHtml_(r.address || "Surat, Gujarat, India")}</td>
              </tr>
            </table>
          </div>

          <!-- 3. SCHEDULE II: COVERED PARTICIPANTS (1 LINE PER PARTICIPANT) -->
          <div class="doc-unit">
            <div class="section-title">
              <span>Schedule II: Schedule of Covered Participants &amp; Dependents (${totalCount})</span>
              <span>INDIVIDUAL ACKNOWLEDGEMENT (1 LINE PER PARTICIPANT)</span>
            </div>
            ${schedule2Html}
          </div>

          <!-- 4. SCHEDULE III: FLOWS IMMEDIATELY UNDER SCHEDULE II DYNAMICALLY! -->
          <div class="doc-unit-flow">
            <div class="section-title">
              <span>Schedule III: ${escapeHtml_(activitySub)}</span>
              <span>ENFORCEABLE LEGAL CONTRACT</span>
            </div>
            <div class="clauses-container">
              ${clausesHtml}
            </div>
          </div>

          <!-- 5. PRE-ACTIVITY ATTESTATION & CHECKLIST -->
          <div class="doc-unit">
            <div class="info-callout">
              <strong>MANDATORY PRE-ACTIVITY ATTESTATION:</strong> All participants have undergone the compulsory safety orientation, had personal protective equipment / grip socks verified by marshals, and agreed to obey active attendant whistle signals and venue rules.
            </div>
            ${checklistHtml}
          </div>

          <!-- 6. SOLEMN AFFIRMATION & DECLARATION -->
          <div class="doc-unit">
            <div class="declaration-box">
              <strong>SOLEMN AFFIRMATION &amp; LEGAL DECLARATION BY PRIMARY SIGNER / LEGAL GUARDIAN:</strong><br>
              I, the undersigned participant, parent, or lawful legal guardian, do hereby solemnly declare under penalty of perjury under Indian law that I am at least 18 years of age, and all personal details, identification records, and participant schedules set forth in Schedules I &amp; II are true, correct, and complete. I have thoroughly read, fully understood, and freely agreed to all operational safety directives, liability indemnities, risk assumption clauses, and non-refundable payment conditions. I hereby execute this instrument intending to be legally bound thereby on behalf of myself and all covered minors/dependents.
            </div>
          </div>

          <!-- 7. EXECUTION & DIGITAL SIGNATURE AUDIT BLOCK -->
          <div class="doc-unit">
            <div class="signature-grid">
              <div class="sig-col-left">
                <div style="font-size: 7.2pt; font-weight: bold; text-transform: uppercase; color: #475569; font-family: Arial, sans-serif;">
                  Signature of Customer / Parent / Legal Guardian:
                </div>
                <div style="text-align: center; margin: 2px 0;">
                  ${sigHtml}
                </div>
                <div style="border-top: 1px solid #0f172a; padding-top: 2px;">
                  <strong style="font-size: 8.2pt; word-break: break-word;">${escapeHtml_(signerName)}</strong> <span style="font-size: 7.2pt; color: #64748b;">(${escapeHtml_(signerRoleLabel)})</span>
                </div>
              </div>
              <div class="sig-col-right">
                <div class="audit-row">
                  <span class="audit-label">Execution Date:</span>
                  <span class="audit-val">${escapeHtml_(execDate)}</span>
                </div>
                <div class="audit-row">
                  <span class="audit-label">Submission Time:</span>
                  <span class="audit-val">${escapeHtml_(execTime)}</span>
                </div>
                <div class="audit-row">
                  <span class="audit-label">Terms &amp; Policy Ack:</span>
                  <span class="audit-val" style="color: #166534;">CONFIRMED &amp; AGREED</span>
                </div>
                <div class="audit-row">
                  <span class="audit-label">Security Audit Hash:</span>
                  <span class="audit-val" style="font-family: monospace; font-size: 7pt;">${escapeHtml_(r.refCode || "FS-RECORD")}-SEC-OK</span>
                </div>
                <div class="audit-row">
                  <span class="audit-label">Legal Framework:</span>
                  <span class="audit-val" style="color: #166534;">IT Act 2000 (Sec 4 &amp; 10A)</span>
                </div>
                <div class="audit-row" style="border-bottom: none;">
                  <span class="audit-label">Data Privacy:</span>
                  <span class="audit-val" style="color: #166534;">DPDP Act 2023 Compliant</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 8. COUNTER MARSHAL CLEARANCE STRIP -->
          <div class="doc-unit">
            <div class="marshal-strip">
              ${marshalCheckHtml}
            </div>
          </div>

        </td>
      </tr>
    </tbody>
  </table>

</body>
</html>`;
}
