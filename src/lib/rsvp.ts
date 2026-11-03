/** RSVP form rules, the payload sent to the sheet, and the submit call. */

export type Attending = "yes" | "no" | "";

export interface RSVPFormData {
  name: string;
  attending: Attending;
  plusOnes: number;
  plusOneNames: string[];
  message: string;
}

export interface RSVPPayload {
  name: string;
  attending: "yes" | "no";
  plusOnes: number;
  plusOneNames: string[];
  message: string;
}

export const emptyForm: RSVPFormData = {
  name: "",
  attending: "",
  plusOnes: 0,
  plusOneNames: [],
  message: "",
};

/** Collapse runs of spaces and trim. */
export function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Keep the guest count between 0 and max, and the names list the same length. */
export function setGuestCount(form: RSVPFormData, count: number, max: number): RSVPFormData {
  const n = Math.max(0, Math.min(Math.floor(count), max));
  const names = form.plusOneNames.slice(0, n);
  while (names.length < n) names.push("");
  return { ...form, plusOnes: n, plusOneNames: names };
}

/** First error to show, or null when the form can be sent. */
export function validateRsvp(form: RSVPFormData): string | null {
  if (!cleanText(form.name)) return "Please enter your name.";
  if (form.attending !== "yes" && form.attending !== "no") return "Please choose whether you can attend.";
  return null;
}

/**
 * What goes to the sheet. Guests only count when attending; the note is only
 * collected when declining — so switching answers never leaves stale data behind.
 */
export function buildPayload(form: RSVPFormData): RSVPPayload {
  if (form.attending !== "yes" && form.attending !== "no") throw new Error("attending is required");
  const attending = form.attending;
  const names = attending === "yes" ? form.plusOneNames.slice(0, form.plusOnes).map(cleanText) : [];
  return {
    name: cleanText(form.name),
    attending,
    plusOnes: attending === "yes" ? names.length : 0,
    plusOneNames: names,
    message: attending === "no" ? form.message.trim() : "",
  };
}

/** "Gayathri" from "  gayathri   anil " → keeps the guest's own capitalisation. */
export function firstName(name: string): string {
  return cleanText(name).split(" ")[0] ?? "";
}

export type SubmitResult = "sent" | "failed";

/**
 * Send to the Google Apps Script web app.
 *
 * `no-cors` makes this a "simple" request the script always receives, and the
 * browser never blocks it over CORS. The trade-off is an unreadable response,
 * so the only failure we can detect is the request not leaving the device
 * (offline, DNS, timeout) — which is exactly when the guest must try again.
 */
export async function submitRsvp(
  url: string,
  payload: RSVPPayload,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 20000
): Promise<SubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetchImpl(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return "sent";
  } catch {
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}
