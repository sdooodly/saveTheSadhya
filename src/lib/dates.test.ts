import { describe, expect, it } from "vitest";
import { formatDate, formatLongDate, formatShortDate } from "./dates";
import { weddingConfig } from "@/wedding.config";

// These run under several TZ settings (see `npm test` notes in README):
// the output must not depend on where the guest's phone is.
describe("dates are shown in Indian time, wherever the guest is", () => {
  it("wedding day reads Sunday, 31 January 2027", () => {
    expect(formatLongDate(weddingConfig.event.date)).toBe("Sunday, 31 January 2027");
  });

  it("short and plain forms", () => {
    expect(formatDate(weddingConfig.event.date)).toBe("31 January 2027");
    expect(formatShortDate(weddingConfig.event.date)).toBe("31/01/27");
  });

  it("RSVP deadline reads 1 January 2027", () => {
    expect(formatDate(weddingConfig.rsvp.deadline)).toBe("1 January 2027");
  });

  it("the deadline is before the wedding", () => {
    expect(new Date(weddingConfig.rsvp.deadline) < new Date(weddingConfig.event.date)).toBe(true);
  });
});
