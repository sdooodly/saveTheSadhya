/**
 * Date formatting for the invitation.
 *
 * Dates in the config are plain "YYYY-MM-DD" strings. `new Date("2027-01-31")`
 * means midnight UTC, which is still 30 January in the Americas — so every
 * date is formatted in Indian time, where the wedding happens. That way a
 * guest in the US sees exactly what a guest in Kerala sees.
 */

const TIME_ZONE = "Asia/Kolkata";

/** "Sunday, 31 January 2027" */
export function formatLongDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "31 January 2027" */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "31/01/27" */
export function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}
