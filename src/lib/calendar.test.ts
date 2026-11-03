import { describe, expect, it } from "vitest";
import { googleCalendarUrl, icsEscape, icsFile, toUtcStamp, type CalendarEvent } from "./calendar";
import { weddingCalendarEvent } from "./event";
import { weddingConfig } from "@/wedding.config";

const sample: CalendarEvent = {
  title: "A & B's wedding",
  start: "2027-01-31T12:12:00+05:30",
  end: "2027-01-31T12:33:00+05:30",
  location: "Hall, Town, State",
  description: "Line one\nLine two; with, punctuation",
  url: "https://example.github.io/site/",
};

describe("toUtcStamp", () => {
  it("converts Indian time to UTC", () => {
    expect(toUtcStamp("2027-01-31T12:12:00+05:30")).toBe("20270131T064200Z");
    expect(toUtcStamp("2027-01-31T12:33:00+05:30")).toBe("20270131T070300Z");
  });
  it("rejects invalid dates", () => {
    expect(() => toUtcStamp("not a date")).toThrow();
  });
});

describe("Google Calendar link", () => {
  const url = new URL(googleCalendarUrl(sample));
  const q = url.searchParams;

  it("uses the Google Calendar template endpoint", () => {
    expect(url.origin).toBe("https://calendar.google.com");
    expect(q.get("action")).toBe("TEMPLATE");
  });
  it("has the muhurtham in UTC", () => {
    expect(q.get("dates")).toBe("20270131T064200Z/20270131T070300Z");
  });
  it("keeps title, location and description intact", () => {
    expect(q.get("text")).toBe("A & B's wedding");
    expect(q.get("location")).toBe("Hall, Town, State");
    expect(q.get("details")).toContain("Line one\nLine two");
  });
  it("links to the full site address, not just the domain", () => {
    expect(q.get("details")).toContain("https://example.github.io/site/");
  });
});

describe("the real wedding event", () => {
  const e = weddingCalendarEvent();
  const details = new URL(googleCalendarUrl(e)).searchParams.get("details") ?? "";

  it("links to the invitation itself (regression: used to link to the GitHub profile)", () => {
    expect(weddingConfig.siteUrl).toBe("https://sdooodly.github.io/saveTheSadhya/");
    expect(details).toContain("https://sdooodly.github.io/saveTheSadhya/");
    expect(details).not.toMatch(/https:\/\/sdooodly\.github\.io(?!\/saveTheSadhya)/);
    expect(details).not.toContain("savethesadhya.com");
  });
  it("starts and ends on the wedding day, in that order", () => {
    expect(e.start.startsWith(weddingConfig.event.date)).toBe(true);
    expect(e.end.startsWith(weddingConfig.event.date)).toBe(true);
    expect(new Date(e.end) > new Date(e.start)).toBe(true);
  });
  it("calendar times match the muhurtham shown on the page", () => {
    // e.g. "11:30 a.m. – 1:00 p.m." ↔ start/end in +05:30
    const [from, to] = weddingConfig.event.muhurthamTime.split(/\s+(?:to|–|-)\s+/);
    const toClock = (t: string) => {
      const [hm, ap] = t.split(" ");
      const [h, m] = hm.split(":").map(Number);
      const hour = (h % 12) + (ap.startsWith("p") ? 12 : 0);
      return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };
    expect(e.start.slice(11, 16)).toBe(toClock(from));
    expect(e.end.slice(11, 16)).toBe(toClock(to));
    expect(e.start.endsWith("+05:30")).toBe(true);
  });
  it("location includes the venue and city", () => {
    expect(e.location).toContain("RDR Auditorium");
    expect(e.location).toContain("Thiruvananthapuram");
  });
});

describe(".ics file", () => {
  const now = new Date("2026-11-03T00:00:00Z");
  const ics = icsFile(sample, "uid-1@test", now);
  const lines = ics.split("\r\n");

  it("uses CRLF line endings and ends with one", () => {
    expect(ics.endsWith("\r\n")).toBe(true);
    expect(ics.replace(/\r\n/g, "")).not.toContain("\n");
  });
  it("has the required structure", () => {
    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(lines.at(-2)).toBe("END:VCALENDAR");
    expect(ics).toContain("UID:uid-1@test");
    expect(ics).toContain("DTSTAMP:20261103T000000Z");
    expect(ics).toContain("DTSTART:20270131T064200Z");
    expect(ics).toContain("DTEND:20270131T070300Z");
  });
  it("folds every line to at most 75 octets", () => {
    for (const line of lines) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });
  it("unfolds back to the original text", () => {
    const unfolded = ics.replace(/\r\n /g, "");
    expect(unfolded).toContain(`DESCRIPTION:${icsEscape(`${sample.description}\n\nRSVP and details: ${sample.url}`)}`);
  });
  it("escapes commas, semicolons, backslashes and newlines", () => {
    expect(icsEscape("a,b;c\\d\ne")).toBe("a\\,b\\;c\\\\d\\ne");
  });
});
