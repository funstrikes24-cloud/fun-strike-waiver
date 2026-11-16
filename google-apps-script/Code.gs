/**
 * Fun Strikes Entertainment LLP — Fun Strike! Game Zone
 * 2-Activity Google Sheets Database + Monthly Archives + Year-End Transfer + Print Form
 * Branches: Pal (Go-Karting 18+ & Soft Play/Trampoline) & Mota Varachha (Soft Play/Trampoline)
 *
 * Folder structure inside Drive -> "Fun Strike! Waivers Database":
 *   - Monthly Archives/   (monthly snapshots saved at month end: "Fun Strike! - YYYY-MM Monthly Waivers")
 *   - Yearly Archives/    (year-end combined file: "Fun Strike! - YYYY Full Year Combined Waivers" + monthly backups)
 *   - Fun Strike! - Go-Karting Waivers                  (kept as-is, monthly tabs YYYY-MM)
 *   - Fun Strike! - Soft Play & Trampoline Waivers      (kept as-is, monthly tabs YYYY-MM)
 */

const ROOT_FOLDER_NAME = "Fun Strike! Waivers Database";
const MONTHLY_FOLDER_NAME = "Monthly Archives";
const ARCHIVE_FOLDER_NAME = "Yearly Archives";
const SIGNATURES_FOLDER_NAME = "Signatures";
const MANAGER_SHARE_EMAIL = "pandyaaryanp348@gmail.com";

const ZONE_CONFIG = {
  gokart: {
    propKey: "SHEET_ID_GOKART",
    title: "Fun Strike! - Go-Karting Waivers",
    label: "Go-Karting"
  },
  softplay: {
    propKey: "SHEET_ID_SOFTPLAY",
    title: "Fun Strike! - Soft Play & Trampoline Waivers",
    label: "Soft Play & Trampoline"
  }
};

const HEADERS = [
  "Submitted At",
  "Ref Code",
  "Activity / Zone",
  "Branch",
  "Participant Name",
  "Participant DOB",
  "Age / Role",
  "Signed By (Primary Contact)",
  "Mobile Number",
  "Email ID",
  "Address",
  "Total in Group",
  "All Names in Waiver",
  "Min Height (in / cm)",
  "Agreed to T&C",
  "Sign Date",
  "Sign Time",
  "Signature",
  "Print Form"
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
    // Runs safely without error when invoked outside a Sheet UI (e.g., Apps Script editor Run button)
  }
}

function setupAllZoneSheets() {
  return setupAllThreeZoneSheets();
}

/**
 * Creates Drive folders ("Monthly Archives", "Yearly Archives"), ensures all live
 * spreadsheets exist with the current month tab, and installs monthly + yearly triggers.
 */
function setupAllThreeZoneSheets() {
  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  getOrCreateFolder_(rootFolder, MONTHLY_FOLDER_NAME);
  getOrCreateFolder_(rootFolder, ARCHIVE_FOLDER_NAME);
  getOrCreateFolder_(rootFolder, SIGNATURES_FOLDER_NAME);

  const monthTab = getMonthTabName_(new Date());
  const summary = [];

  Object.keys(ZONE_CONFIG).forEach(function (zoneKey) {
    const cfg = ZONE_CONFIG[zoneKey];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    ensureMonthlyTab_(ss, monthTab);
    removeDefaultEmptySheet1_(ss, monthTab);
    summary.push(cfg.label + " (" + ss.getId() + "): " + ss.getUrl());
  });

  installAutoTriggers_();
  Logger.log("Root Folder (" + rootFolder.getId() + "): " + rootFolder.getUrl());
  Logger.log("Setup Complete:\n" + summary.join("\n"));

  try {
    SpreadsheetApp.getUi().alert(
      "Setup Complete!\n\nFolder: " +
        rootFolder.getUrl() +
        "\n\n3 Zone Spreadsheets ready (Month: " +
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
 * Clears stored sheet IDs and creates 3 brand-new spreadsheets inside the active
 * "Fun Strike! Waivers Database" folder.
 */
function forceRecreate3Sheets() {
  const props = PropertiesService.getScriptProperties();
  Object.keys(ZONE_CONFIG).forEach(function (zoneKey) {
    props.deleteProperty(ZONE_CONFIG[zoneKey].propKey);
  });
  return setupAllThreeZoneSheets();
}

/**
 * Shares the entire "Fun Strike! Waivers Database" folder, subfolders, and all 3 zone sheets
 * as Editor with MANAGER_SHARE_EMAIL so they appear immediately in "Shared with me".
 */
function shareFolderWithManager() {
  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  const monthlyFolder = getOrCreateFolder_(rootFolder, MONTHLY_FOLDER_NAME);
  const archiveFolder = getOrCreateFolder_(rootFolder, ARCHIVE_FOLDER_NAME);
  const sigFolder = getOrCreateFolder_(rootFolder, SIGNATURES_FOLDER_NAME);

  rootFolder.addEditor(MANAGER_SHARE_EMAIL);
  monthlyFolder.addEditor(MANAGER_SHARE_EMAIL);
  archiveFolder.addEditor(MANAGER_SHARE_EMAIL);
  sigFolder.addEditor(MANAGER_SHARE_EMAIL);

  const sharedUrls = ["Folder: " + rootFolder.getUrl()];
  Object.keys(ZONE_CONFIG).forEach(function (zoneKey) {
    const cfg = ZONE_CONFIG[zoneKey];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    ss.addEditor(MANAGER_SHARE_EMAIL);
    sharedUrls.push(cfg.label + ": " + ss.getUrl());
  });

  Logger.log("Shared with " + MANAGER_SHARE_EMAIL + ":\n" + sharedUrls.join("\n"));

  try {
    SpreadsheetApp.getUi().alert(
      "Drive Folder & All 3 Sheets Shared!\n\nEditor Access Granted To: " +
        MANAGER_SHARE_EMAIL +
        "\n(Check 'Shared with me' in Google Drive)\n\n" +
        sharedUrls.join("\n")
    );
  } catch (e) {
    // Logged above when run from Apps Script editor
  }

  return sharedUrls;
}

/**
 * Scheduled on the 1st of every month:
 * 1) Creates the new current month tab (YYYY-MM) in all 3 live spreadsheets.
 * 2) Saves a monthly archive file of the previous month inside "Monthly Archives".
 */
function onMonthlyRotation() {
  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  const monthlyFolder = getOrCreateFolder_(rootFolder, MONTHLY_FOLDER_NAME);

  const now = new Date();
  const currentMonthTab = getMonthTabName_(now);

  Object.keys(ZONE_CONFIG).forEach(function (zoneKey) {
    const cfg = ZONE_CONFIG[zoneKey];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    ensureMonthlyTab_(ss, currentMonthTab);
  });

  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthTab = getMonthTabName_(prevMonthDate);
  archiveMonthToFolder_(props, rootFolder, monthlyFolder, prevMonthTab);
}

/**
 * Exports a single month's tabs across all 3 live sheets into "Monthly Archives".
 */
function archiveMonthToFolder_(props, rootFolder, monthlyFolder, monthTab) {
  const monthFileTitle = "Fun Strike! - " + monthTab + " Monthly Waivers";
  let hasAnyRows = false;
  const zoneRows = {};

  Object.keys(ZONE_CONFIG).forEach(function (zoneKey) {
    const cfg = ZONE_CONFIG[zoneKey];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);
    const sh = ss.getSheetByName(monthTab);
    if (!sh || sh.getLastRow() <= 1) {
      zoneRows[zoneKey] = [];
      return;
    }
    hasAnyRows = true;
    zoneRows[zoneKey] = readRowsWithFormulas_(sh, 2, sh.getLastRow() - 1, HEADERS.length);
  });

  if (!hasAnyRows) return null;

  trashExistingByName_(monthlyFolder, monthFileTitle);
  const monthSs = SpreadsheetApp.create(monthFileTitle);
  DriveApp.getFileById(monthSs.getId()).moveTo(monthlyFolder);

  const keys = Object.keys(ZONE_CONFIG);
  keys.forEach(function (zoneKey, idx) {
    const cfg = ZONE_CONFIG[zoneKey];
    const tab = idx === 0 ? monthSs.getSheets()[0] : monthSs.insertSheet(cfg.label);
    tab.setName(cfg.label);
    writeArchiveTab_(tab, HEADERS, zoneRows[zoneKey]);
  });

  return { fileName: monthFileTitle, url: monthSs.getUrl() };
}

/**
 * Scheduled every Jan 1st:
 * Transfers all 12 monthly tabs of the previous year into "Yearly Archives",
 * moves that year's Monthly Archives files into Yearly Archives,
 * and cleans old year tabs from the 3 live sheets while keeping the 3 live sheets as-is.
 */
function archivePreviousYearOnJan1() {
  const now = new Date();
  if (now.getMonth() !== 0) return; // Run year-end transfer only in January
  const prevYear = String(now.getFullYear() - 1);
  transferYearToArchiveFile(prevYear, true);
}

/**
 * Prompts user in Sheets UI for which year (YYYY) to transfer into Yearly Archives.
 */
function promptTransferYearArchive() {
  const ui = SpreadsheetApp.getUi();
  const currentYear = String(new Date().getFullYear());
  const resp = ui.prompt(
    "Transfer Full Year Into Yearly Archives",
    "Enter the 4-digit year to transfer (e.g. " +
      currentYear +
      ").\nAll " +
      currentYear +
      "-* monthly tabs will be combined into Yearly Archives and cleared from the 3 live sheets (the 3 live sheets stay intact):",
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
      "\nMonthly Tabs Cleared from Live Sheets: " +
      result.tabsRemoved +
      "\nURL:\n" +
      result.url
  );
}

/**
 * Combines all monthly tabs ("YYYY-01" .. "YYYY-12") from all 3 zone spreadsheets
 * into ONE 1-Year Archive Google Spreadsheet inside "Yearly Archives",
 * then (when removeOldTabsFromLiveSheets is true) removes old YYYY-* tabs from the 3 live sheets
 * while keeping the 3 live sheets and current month tab intact.
 */
function transferYearToArchiveFile(yearStr, removeOldTabsFromLiveSheets) {
  const props = PropertiesService.getScriptProperties();
  const rootFolder = getRootDatabaseFolder_(props);
  const monthlyFolder = getOrCreateFolder_(rootFolder, MONTHLY_FOLDER_NAME);
  const archiveFolder = getOrCreateFolder_(rootFolder, ARCHIVE_FOLDER_NAME);

  const archiveTitle = "Fun Strike! - " + yearStr + " Full Year Combined Waivers";
  trashExistingByName_(archiveFolder, archiveTitle);

  const archiveSs = SpreadsheetApp.create(archiveTitle);
  DriveApp.getFileById(archiveSs.getId()).moveTo(archiveFolder);

  const masterHeaders = ["Month", "Source Zone"].concat(HEADERS);
  const allRows = [];
  const zoneBuckets = { gokart: [], softplay: [] };
  const tabsToDelete = [];

  const currentMonthTab = getMonthTabName_(new Date());

  Object.keys(ZONE_CONFIG).forEach(function (zoneKey) {
    const cfg = ZONE_CONFIG[zoneKey];
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);

    // Ensure at least one active tab remains before removing archived year tabs
    ensureMonthlyTab_(ss, currentMonthTab);

    ss.getSheets().forEach(function (sh) {
      const tabName = sh.getName();
      if (tabName.indexOf(yearStr + "-") !== 0) return;

      const lastRow = sh.getLastRow();
      if (lastRow > 1) {
        const dataRows = readRowsWithFormulas_(sh, 2, lastRow - 1, HEADERS.length);
        dataRows.forEach(function (r) {
          const combinedRow = [tabName, cfg.label].concat(r);
          allRows.push(combinedRow);
          zoneBuckets[zoneKey].push(combinedRow);
        });
      }

      if (tabName !== currentMonthTab) {
        tabsToDelete.push({ ss: ss, sheet: sh });
      }
    });
  });

  // Sort combined rows chronologically by Submitted At (col index 2 after Month, Source Zone)
  allRows.sort(function (a, b) {
    return (new Date(a[2]).getTime() || 0) - (new Date(b[2]).getTime() || 0);
  });

  const allTab = archiveSs.getSheets()[0];
  allTab.setName("All Zones " + yearStr);
  writeArchiveTab_(allTab, masterHeaders, allRows);

  Object.keys(ZONE_CONFIG).forEach(function (zoneKey) {
    const cfg = ZONE_CONFIG[zoneKey];
    const zTab = archiveSs.insertSheet(cfg.label);
    writeArchiveTab_(zTab, masterHeaders, zoneBuckets[zoneKey]);
  });

  // Flush to guarantee yearly archive file is saved before transferring/removing old monthly tabs
  SpreadsheetApp.flush();

  let tabsRemoved = 0;
  if (removeOldTabsFromLiveSheets) {
    tabsToDelete.forEach(function (item) {
      if (item.ss.getSheets().length > 1) {
        item.ss.deleteSheet(item.sheet);
        tabsRemoved += 1;
      }
    });

    // Move that year's Monthly Archives files into Yearly Archives/<year> Monthly Files
    const yearMonthlySub = getOrCreateFolder_(archiveFolder, yearStr + " Monthly Files");
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

function writeArchiveTab_(sheet, headers, rows) {
  sheet.appendRow(headers);
  sheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#0f172a")
    .setFontColor("#ffffff");
  sheet.setFrozenRows(1);

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

/**
 * Receives waiver submissions from index.html and routes to the correct Zone Spreadsheet
 * and current month tab (YYYY-MM).
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

    const zoneKey = ZONE_CONFIG[data.zone] ? data.zone : "gokart";
    const cfg = ZONE_CONFIG[zoneKey];

    const props = PropertiesService.getScriptProperties();
    const rootFolder = getRootDatabaseFolder_(props);
    const ss = getSpreadsheetByPropOrTitle_(props, rootFolder, cfg.propKey, cfg.title);

    const monthTab = getMonthTabName_(now);
    const sheet = ensureMonthlyTab_(ss, monthTab);
    removeDefaultEmptySheet1_(ss, monthTab);

    const cleanFullName = clampText_(data.fullName, 120);
    const cleanDob = clampText_(data.dob, 20);
    const cleanMobile = clampText_(data.mobileNumber, 30);
    const cleanEmail = clampText_(data.emailId, 160);
    const cleanAddress = clampText_(data.address, 300);
    const cleanBranch = clampText_(data.branch, 100);
    const cleanActivity = clampText_(data.activity || cfg.label, 80);
    const cleanSignDate = clampText_(data.signDate, 20);
    const cleanSignTime = clampText_(data.signTime, 20);

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
        : "—";

    const sigVal = isValidSignatureDataUrl_(data.guestSignature) ? data.guestSignature : "";
    const totalCount = effectiveRiders.length;
    const submittedIso = clampText_(data.submittedAt || now.toISOString(), 40);
    const refCodeStr = clampText_(data.refCode, 16);
    const sigCellValue = saveSignatureFileFormula_(rootFolder, refCodeStr, sigVal);
    const webAppUrl = getWebAppUrl_(props);
    const printToken = computePrintToken_(props, refCodeStr, submittedIso);
    const printUrl = webAppUrl
      ? webAppUrl +
        "?printRef=" + encodeURIComponent(refCodeStr) +
        "&zone=" + encodeURIComponent(zoneKey) +
        "&month=" + encodeURIComponent(monthTab) +
        "&k=" + encodeURIComponent(printToken)
      : "";
    const printFormula = printUrl ? '=HYPERLINK("' + printUrl + '", "PRINT FORM")' : "";

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
        zone: zoneKey,
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
  const sigFormula = found.sheet.getRange(found.rowNum, found.colOffset + 18).getFormula();
  const resolvedSigUrl = resolveSignatureDataUrl_(m[17], sigFormula);

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
    agreed: m[14],
    signDate: m[15],
    signTime: m[16],
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

  const vals = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getDisplayValues()[0];
  const sigFormula = sheet.getRange(rowIndex, 18).getFormula();
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
    agreed: vals[14],
    signDate: vals[15],
    signTime: vals[16],
    signatureUrl: resolveSignatureDataUrl_(vals[17], sigFormula)
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
  if (it.hasNext()) return it.next();
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

function getSpreadsheetByPropOrTitle_(props, folder, propKey, title) {
  const storedId = props.getProperty(propKey);
  if (storedId) {
    try {
      const f = DriveApp.getFileById(storedId);
      if (isFileInFolder_(f, folder)) {
        return SpreadsheetApp.openById(storedId);
      }
    } catch (e) {
      // Stored file deleted or inaccessible; look up by name or create
    }
    props.deleteProperty(propKey);
  }

  const files = folder.getFilesByName(title);
  if (files.hasNext()) {
    const ss = SpreadsheetApp.openById(files.next().getId());
    props.setProperty(propKey, ss.getId());
    return ss;
  }

  // Copy the active container-bound spreadsheet when available and not trashed
  let created = null;
  try {
    const activeSs = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSs && !DriveApp.getFileById(activeSs.getId()).isTrashed()) {
      const copyFile = DriveApp.getFileById(activeSs.getId()).makeCopy(title, folder);
      created = SpreadsheetApp.openById(copyFile.getId());
      const monthTab = getMonthTabName_(new Date());
      ensureMonthlyTab_(created, monthTab);
      created.getSheets().forEach(function (sh) {
        if (sh.getName() !== monthTab && created.getSheets().length > 1) {
          created.deleteSheet(sh);
        }
      });
    }
  } catch (e) {
    created = null;
  }

  if (!created) {
    created = SpreadsheetApp.create(title);
    DriveApp.getFileById(created.getId()).moveTo(folder);
  }

  props.setProperty(propKey, created.getId());
  return created;
}

function ensureMonthlyTab_(ss, monthTabName) {
  let sheet = ss.getSheetByName(monthTabName);
  if (!sheet) {
    sheet = ss.insertSheet(monthTabName);
  }
  const lastRow = sheet.getLastRow();
  if (lastRow === 0 || (lastRow === 1 && sheet.getLastColumn() !== HEADERS.length)) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold")
      .setBackground("#0f172a")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length - 2);
    sheet.setColumnWidth(18, 160);
  } else if (lastRow >= 1) {
    const col18 = sheet.getRange(1, 18).getValue();
    if (col18 === "Customer Signature (Data URL)") {
      sheet.getRange(1, 18).setValue("Signature");
    }
    const col19 = sheet.getRange(1, HEADERS.length).getValue();
    if (col19 === "Print Tip") {
      sheet.getRange(1, HEADERS.length).setValue("Print Form");
    }
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

function saveSignatureFileFormula_(rootFolder, refCode, dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/(webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || String(dataUrl).length > 49000) return "";
  try {
    const sigFolder = getOrCreateFolder_(rootFolder, SIGNATURES_FOLDER_NAME);
    const mime = match[1];
    const ext = match[2] === "jpeg" ? "jpg" : match[2];
    const bytes = Utilities.base64Decode(match[3]);
    const blob = Utilities.newBlob(bytes, mime, (refCode || "waiver") + "." + ext);
    const file = sigFolder.createFile(blob);
    return '=HYPERLINK("https://drive.google.com/file/d/' + file.getId() + '/view", "View Signature")';
  } catch (e) {
    return dataUrl;
  }
}

function extractDriveFileId_(cellFormula) {
  const match = String(cellFormula || "").match(/\/d\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : "";
}

function resolveSignatureDataUrl_(cellDisplayVal, cellFormula) {
  if (isValidSignatureDataUrl_(cellDisplayVal)) return cellDisplayVal;
  const fileId = extractDriveFileId_(cellFormula);
  if (!fileId) return "";
  try {
    const blob = DriveApp.getFileById(fileId).getBlob();
    const mime = blob.getContentType();
    if (!/^image\/(webp|jpeg|png)$/.test(mime)) return "";
    return "data:" + mime + ";base64," + Utilities.base64Encode(blob.getBytes());
  } catch (e) {
    return "";
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
    ["2026-12", "Bowling", new Date("2026-12-01T10:00:00Z")],
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
  const isGokart = /kart/i.test(r.activity || '') || /kart/i.test(r.zone || '');
  const riderLines = String(r.allRiders || r.fullName || "")
    .split(/\r?\n/)
    .filter(Boolean);

  const ridersTableRows = riderLines
    .map(function (line, idx) {
      const cleanLine = line.replace(/^\d+\.\s*/, "");
      const parts = cleanLine.split(" | ");
      const pName = parts[0] || cleanLine;
      const pDob = parts[1] || "—";
      const pAge = parts[2] || "—";
      const pRel = parts[3] || "—";
      return (
        "<tr><td>" + (idx + 1) + "</td><td><strong>" + escapeHtml_(pName) + "</strong></td>" +
        "<td>" + escapeHtml_(pDob) + "</td><td>" + escapeHtml_(pAge) + "</td><td>" + escapeHtml_(pRel) + "</td></tr>"
      );
    })
    .join("");

  const sigImgHtml =
    isValidSignatureDataUrl_(r.signatureUrl)
      ? '<img src="' + r.signatureUrl + '" alt="Customer Signature" style="max-height:70px;display:block;" />'
      : '<div style="height:48px;border-bottom:1px solid #000;"></div>';

  return (
    '<!DOCTYPE html><html><head><meta charset="utf-8" />' +
    '<style>' +
    '@page{size:A4 portrait;margin:6mm 8mm;}' +
    'body{font-family:Arial,sans-serif;color:#0f172a;margin:0;padding:10px;font-size:10px;line-height:1.24;}' +
    '.print-bar{display:flex;justify-content:space-between;align-items:center;background:#0f172a;color:#fff;padding:8px 12px;border-radius:6px;margin-bottom:10px;}' +
    '.print-btn{background:#be123c;color:#fff;border:none;padding:7px 14px;border-radius:5px;font-weight:700;cursor:pointer;font-size:12px;}' +
    '.sheet{border:1.5px solid #0f172a;padding:10px 14px;background:#fff;}' +
    '.hdr{text-align:center;border-bottom:2px solid #0f172a;padding-bottom:5px;margin-bottom:6px;}' +
    '.hdr h1{margin:0;font-size:16px;font-weight:900;text-transform:uppercase;letter-spacing:0.3px;}' +
    '.hdr p{margin:2px 0 0;font-weight:700;color:#334155;font-size:11px;}' +
    '.grid{display:grid;grid-template-columns:1fr 1fr;gap:3px 12px;margin-bottom:6px;}' +
    '.row{border-bottom:1px solid #cbd5e1;padding:2px 0;font-size:10px;}' +
    '.lbl{font-weight:700;font-size:9.5px;color:#475569;text-transform:uppercase;}' +
    '.box{border:1px solid #94a3b8;padding:5px 8px;margin:5px 0;border-radius:4px;background:#f8fafc;}' +
    'table.rtable{width:100%;border-collapse:collapse;margin-top:3px;font-size:9.8px;}' +
    'table.rtable th,table.rtable td{border:1px solid #cbd5e1;padding:2.5px 5px;text-align:left;}' +
    'table.rtable th{background:#e2e8f0;font-weight:700;}' +
    '.tc-container{margin:6px 0;border:1.5px solid #0f172a;border-radius:4px;padding:6px 8px;background:#ffffff;}' +
    '.tc-title{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.4px;color:#0f172a;border-bottom:1.2px solid #0f172a;padding-bottom:2.5px;margin-bottom:4px;display:flex;justify-content:space-between;}' +
    '.tc-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;font-size:7.8pt;line-height:1.22;color:#1e293b;}' +
    '.tc-col{display:flex;flex-direction:column;gap:4px;}' +
    '.tc-block{background:#f8fafc;border:1px solid #cbd5e1;border-radius:3px;padding:3.5px 5.5px;}' +
    '.tc-block.highlight{border-color:#dc2626;background:#fef2f2;}' +
    '.tc-block strong{display:block;font-size:8.1pt;color:#0f172a;margin-bottom:1px;text-transform:uppercase;letter-spacing:0.2px;}' +
    '.tc-block.highlight strong{color:#991b1b;}' +
    '.sig-decl{font-size:7.8pt;color:#1e293b;line-height:1.24;margin:5px 0 3px;padding:3.5px 6px;background:#f1f5f9;border-left:3px solid #0f172a;font-weight:600;}' +
    '.sig-wrap{display:grid;grid-template-columns:2.2fr 1fr 1fr;gap:10px;margin-top:6px;border-top:1.5px solid #0f172a;padding-top:6px;align-items:end;}' +
    '@media print{.print-bar{display:none!important;} body{padding:0;} .sheet{border:1.2px solid #000;padding:8px 12px;}}' +
    '</style></head><body>' +
    '<div class="print-bar"><span><strong>Ref:</strong> ' + escapeHtml_(r.refCode) + ' &mdash; ' + escapeHtml_(r.fullName) + '</span><button class="print-btn" onclick="window.print()">Print / Save PDF</button></div>' +
    '<div class="sheet">' +
    '<div class="hdr"><h1>Fun Strikes Entertainment LLP</h1><p>Fun Strike! Game Zone &mdash; Participant Waiver, Safety Agreement &amp; Terms (' + escapeHtml_(r.refCode) + ')</p></div>' +
    '<div class="row" style="margin-bottom:6px;"><span class="lbl">ACTIVITY / ZONE:</span> <strong>' + escapeHtml_(r.activity || 'Go-Karting') + '</strong> &bull; <span class="lbl">BRANCH:</span> <strong>' + escapeHtml_(r.branch) + '</strong></div>' +
    '<div class="grid">' +
    '<div class="row"><span class="lbl">PARTICIPANT NAME:</span> ' + escapeHtml_(r.fullName) + '</div>' +
    '<div class="row"><span class="lbl">SIGNED BY:</span> ' + escapeHtml_(r.signedBy || r.fullName) + '</div>' +
    '<div class="row"><span class="lbl">DOB:</span> ' + escapeHtml_(r.dob) + '</div>' +
    '<div class="row"><span class="lbl">MOBILE:</span> ' + escapeHtml_(r.mobileNumber) + '</div>' +
    '<div class="row"><span class="lbl">MIN HEIGHT:</span> ' + escapeHtml_(r.heightStr) + '</div>' +
    '<div class="row"><span class="lbl">EMAIL:</span> ' + escapeHtml_(r.emailId || '—') + '</div>' +
    '<div class="row"><span class="lbl">AGE / ROLE:</span> ' + escapeHtml_(r.ageRole || '—') + '</div>' +
    '<div class="row"><span class="lbl">ADDRESS:</span> ' + escapeHtml_(r.address) + '</div>' +
    '</div>' +
    '<div class="box"><strong>PARTICIPANTS COVERED (' + escapeHtml_(r.totalRiders) + '):</strong><table class="rtable"><thead><tr><th>#</th><th>Full Name</th><th>DOB</th><th>Age</th><th>Relation</th></tr></thead><tbody>' + ridersTableRows + '</tbody></table></div>' +
    
    '<!-- COMPLETE LEGAL TERMS & CONDITIONS SECTION -->' +
    '<div class="tc-container">' +
    '<div class="tc-title"><span>TERMS &amp; CONDITIONS, SAFETY RULES &amp; LIABILITY RELEASE</span><span>LEGAL BINDING AGREEMENT</span></div>' +
    '<div class="tc-grid">' +
    '<div class="tc-col">' +
    (isGokart
      ? '<div class="tc-block highlight"><strong>⚠️ STRICT 18+ POLICY &amp; MINOR SOLE RESPONSIBILITY CLAUSE:</strong> Go-Karting is designed and operated for adults (18+). If an individual under 18 years of age signs this waiver or operates a kart, the participant and their parent/legal guardian explicitly acknowledge and declare that <strong>100% OF ALL RESPONSIBILITY, ACCIDENTAL RISKS, PERSONAL INJURIES, VEHICLE DAMAGES, AND LEGAL LIABILITIES REST ENTIRELY WITH THEM</strong>. Fun Strikes Entertainment LLP bears ZERO liability.</div>' +
        '<div class="tc-block highlight"><strong>🏁 GO-KARTING RULES &amp; HEIGHT REQUIREMENT:</strong> Single-kart drivers must be at least 5\'5" (165 cm) tall. Double karts: passenger min 40" (102 cm) with adult 18+ driver. Full-face helmets must be secured before throttle. Closed-toe shoes mandatory (no crocs, slippers, or bare feet). Tie long hair above shoulder level; tuck in loose clothes. <strong>ZERO BUMPING:</strong> Intentional ramming results in immediate disqualification on 1st warning without refund.</div>'
      : '<div class="tc-block highlight"><strong>🧦 TRAMPOLINE &amp; SOFT PLAY SAFETY PROTOCOL:</strong> Approved anti-slip grip socks must be worn at all times by all jumpers. One jumper per trampoline mat at all times; no double-bouncing, horseplay, or wrestling. Inverted flips, somersaults, and uncontrolled stunts prohibited. Empty all pockets (no phones, keys, or sharp items). Children under 10 must be actively supervised by a parent/guardian. Foam pit safety: feet-first or bottom landing only; diving headfirst is strictly prohibited.</div>') +
    '<div class="tc-block"><strong>⚖️ ASSUMPTION OF INHERENT RISK &amp; RELEASE OF LIABILITY:</strong> I knowingly, freely, and voluntarily assume all inherent risks of participation (including collisions, sudden impact, physical exertion, falls, fractures, sprains, illness, permanent disability, or property loss). On behalf of myself and all listed participants, I hereby forever release, discharge, defend, and hold harmless Fun Strikes Entertainment LLP, its partners, owners, operators, directors, track marshals, safety crew, and agents from any and all claims, demands, liabilities, actions, or lawsuits.</div>' +
    '<div class="tc-block"><strong>🩺 MEDICAL FITNESS &amp; PHYSICAL CONDITION:</strong> I certify that all listed participants are in good physical health and have no medical impairments that would make participation unsafe. Participation is strictly prohibited for individuals who are pregnant, have heart conditions, neck, back, or spinal ailments, recent surgeries, or who are under the influence of alcohol, drugs, or prescription narcotics.</div>' +
    '</div>' +
    '<div class="tc-col">' +
    '<div class="tc-block highlight"><strong>🔧 CUSTOMER DAMAGE &amp; BREAKAGE LIABILITY:</strong> Any damage, breakage, or loss caused by the customer or any participant under this form to go-karts, helmets, track barriers, trampolines, foam pit, soft-play structures, or venue property due to reckless behavior, rule violations, negligence, or misuse must be paid in full by the customer as assessed by management before leaving the venue.</div>' +
    '<div class="tc-block highlight"><strong>🚫 STRICT 100% NO-REFUND POLICY:</strong> All ticket sales, sessions, and payments are 100% NON-REFUNDABLE, NON-CANCELLABLE, AND NON-TRANSFERABLE once paid, including if a customer changes their mind, feels scared, dislikes the experience, claims they "did not have fun", is removed for breaking safety rules, or in the event of equipment downtime (rescheduled time or replacement equipment may be offered at management discretion; no monetary refund).</div>' +
    '<div class="tc-block"><strong>📸 MEDIA RELEASE &amp; CCTV SURVEILLANCE:</strong> Fun Strikes Entertainment LLP reserves the right to capture and use CCTV security footage, photographs, and video recordings of participants for safety, security, and promotional media without financial compensation.</div>' +
    '<div class="tc-block"><strong>🏛️ GOVERNING LAW &amp; LEGAL JURISDICTION:</strong> This agreement is governed by the laws of India. All legal claims, disputes, or proceedings arising out of this agreement shall be subject exclusively to the jurisdiction of the competent courts in Surat, Gujarat.</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    
    '<div class="sig-decl"><strong>LEGAL ACKNOWLEDGEMENT &amp; DECLARATION:</strong> By signing below, I certify under penalty of law that I am at least 18 years of age (or the authorized parent/legal guardian of all minor participants listed), all information provided on this form is accurate, and I have read, understood, and agreed to every safety rule, liability waiver, damage policy, and term stated above on behalf of myself and all covered participants.</div>' +
    '<div class="row" style="border:none;padding:2px 0;"><span class="lbl">TERMS &amp; CONDITIONS AGREED:</span> <strong>' + escapeHtml_(r.agreed) + '</strong>' +
    (isGokart ? ' &bull; <span class="lbl">18+ SOLE LIABILITY ACKNOWLEDGED:</span> <strong>YES</strong>' : '') +
    '</div>' +
    '<div class="sig-wrap">' +
    '<div><div class="lbl">CUSTOMER / GUARDIAN SIGNATURE:</div>' + sigImgHtml + '</div>' +
    '<div><div class="lbl">DATE:</div><div style="font-size:12px;font-weight:700;">' + escapeHtml_(r.signDate) + '</div></div>' +
    '<div><div class="lbl">TIME:</div><div style="font-size:12px;font-weight:700;">' + escapeHtml_(r.signTime) + '</div></div>' +
    '</div></div></body></html>'
  );
}
