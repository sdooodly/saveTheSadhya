/**
 * Save the Sadhya — RSVP receiver (Google Apps Script web app).
 *
 * Paste this over the existing script (Extensions → Apps Script in the RSVP
 * Google Sheet), then: Deploy → Manage deployments → ✏️ Edit → Version: "New
 * version" → Deploy. Editing the existing deployment keeps the same /exec URL,
 * so the website keeps working. (Creating a *new* deployment changes the URL.)
 *
 * Settings stay: Execute as "Me", Who has access "Anyone".
 *
 * What this guards against
 *  - Spreadsheet formula injection: a "name" like =IMPORTXML(...) or
 *    =HYPERLINK(...) would otherwise run as a formula in your sheet.
 *  - Junk / oversized data: strict validation and length limits.
 *  - Spam floods: per-minute and per-day caps, and duplicate suppression.
 *  - Data leaks: GET requests never return any guest data.
 */

// Rows go to this tab; it's created with headers on first use.
const SHEET_NAME = "RSVPs";
// Only needed if this script is NOT opened from the sheet itself.
const SPREADSHEET_ID = "";

const MAX_GUESTS = 3;
const MAX_NAME = 80;
const MAX_NOTE = 1000;
const MAX_BODY_BYTES = 6000;
const MAX_PER_MINUTE = 30; // all guests together
const MAX_PER_DAY = 400;
const DUPLICATE_WINDOW_SECONDS = 600; // same answer twice within 10 min → stored once

const HEADERS = ["Received (IST)", "Name", "Attending", "Guests", "Guest names", "Note"];

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > MAX_BODY_BYTES) return reply_("rejected");

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return reply_("rejected");
    }

    const rsvp = validate_(data);
    if (!rsvp) return reply_("rejected");

    const cache = CacheService.getScriptCache();
    if (!underLimits_(cache)) return reply_("busy");

    const dupKey = "dup-" + digest_([rsvp.name.toLowerCase(), rsvp.attending, rsvp.guests, rsvp.guestNames.join("|")].join("§"));
    if (cache.get(dupKey)) return reply_("success"); // already stored — e.g. a double tap

    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return reply_("busy");
    try {
      const sheet = sheet_();
      sheet.appendRow([
        Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
        cell_(rsvp.name),
        rsvp.attending === "yes" ? "Yes" : "No",
        rsvp.guests,
        cell_(rsvp.guestNames.filter(String).join(", ")),
        cell_(rsvp.message),
      ]);
      cache.put(dupKey, "1", DUPLICATE_WINDOW_SECONDS);
    } finally {
      lock.releaseLock();
    }
    return reply_("success");
  } catch (err) {
    console.error(err);
    return reply_("error");
  }
}

// Never return guest data from a GET.
function doGet() {
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

/** Returns a clean RSVP, or null if anything is off. */
function validate_(d) {
  if (!d || typeof d !== "object") return null;

  const name = clean_(d.name, MAX_NAME);
  if (!name) return null;

  if (d.attending !== "yes" && d.attending !== "no") return null;
  const attending = d.attending;

  let guestNames = [];
  if (attending === "yes" && Array.isArray(d.plusOneNames)) {
    guestNames = d.plusOneNames.slice(0, MAX_GUESTS).map(function (n) {
      return clean_(n, MAX_NAME);
    });
  }
  let guests = attending === "yes" ? Number(d.plusOnes) : 0;
  if (!Number.isInteger(guests) || guests < 0 || guests > MAX_GUESTS) return null;
  guestNames = guestNames.slice(0, guests);

  const message = attending === "no" ? clean_(d.message, MAX_NOTE, true) : "";

  return { name: name, attending: attending, guests: guests, guestNames: guestNames, message: message };
}

/** String, no control characters, trimmed, length-capped. */
function clean_(value, max, keepNewlines) {
  if (typeof value !== "string") return "";
  let v = value.replace(keepNewlines ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ");
  v = keepNewlines ? v.replace(/[ \t]+/g, " ") : v.replace(/\s+/g, " ");
  return v.trim().slice(0, max);
}

/** Stop the sheet from treating text as a formula. */
function cell_(text) {
  const v = String(text);
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function underLimits_(cache) {
  const now = new Date();
  const minuteKey = "rate-m-" + Math.floor(now.getTime() / 60000);
  const dayKey = "rate-d-" + Utilities.formatDate(now, "Asia/Kolkata", "yyyyMMdd");
  const perMinute = Number(cache.get(minuteKey) || 0) + 1;
  const perDay = Number(cache.get(dayKey) || 0) + 1;
  if (perMinute > MAX_PER_MINUTE || perDay > MAX_PER_DAY) return false;
  cache.put(minuteKey, String(perMinute), 120);
  cache.put(dayKey, String(perDay), 6 * 60 * 60); // cache max is 6 h; good enough for a cap
  return true;
}

function sheet_() {
  const book = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function digest_(text) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text));
}

function reply_(result) {
  return ContentService.createTextOutput(JSON.stringify({ result: result })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: run once from the editor (select "selfTest", ▶ Run) to check the
 * rules without touching the sheet. Results appear under "Execution log".
 */
function selfTest() {
  const ok = validate_({ name: "  Asha  ", attending: "yes", plusOnes: 1, plusOneNames: ["Ravi"], message: "" });
  console.log("valid →", JSON.stringify(ok));
  console.log("formula escaped →", cell_("=IMPORTXML(\"http://x\",\"//a\")"));
  console.log("no name →", validate_({ name: "   ", attending: "yes", plusOnes: 0 }));
  console.log("too many guests →", validate_({ name: "A", attending: "yes", plusOnes: 9, plusOneNames: [] }));
  console.log("bad answer →", validate_({ name: "A", attending: "maybe" }));
}
