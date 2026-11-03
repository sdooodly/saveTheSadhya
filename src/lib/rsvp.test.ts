import { describe, expect, it, vi } from "vitest";
import {
  buildPayload,
  cleanText,
  emptyForm,
  firstName,
  setGuestCount,
  submitRsvp,
  validateRsvp,
  type RSVPFormData,
} from "./rsvp";

const form = (over: Partial<RSVPFormData>): RSVPFormData => ({ ...emptyForm, ...over });

describe("validateRsvp", () => {
  it("needs a name", () => {
    expect(validateRsvp(form({ attending: "yes" }))).toMatch(/name/i);
  });
  it("rejects a name that is only spaces (the browser's `required` lets this through)", () => {
    expect(validateRsvp(form({ name: "   ", attending: "yes" }))).toMatch(/name/i);
  });
  it("needs an answer", () => {
    expect(validateRsvp(form({ name: "Asha" }))).toMatch(/attend/i);
  });
  it("accepts a complete form", () => {
    expect(validateRsvp(form({ name: "Asha", attending: "no" }))).toBeNull();
  });
});

describe("setGuestCount", () => {
  it("clamps between 0 and the max", () => {
    expect(setGuestCount(emptyForm, -1, 3).plusOnes).toBe(0);
    expect(setGuestCount(emptyForm, 9, 3).plusOnes).toBe(3);
  });
  it("adds empty name slots and keeps typed names when growing", () => {
    const one = { ...setGuestCount(emptyForm, 1, 3), plusOneNames: ["Ravi"] };
    expect(setGuestCount(one, 2, 3).plusOneNames).toEqual(["Ravi", ""]);
  });
  it("drops names when shrinking", () => {
    const two = form({ plusOnes: 2, plusOneNames: ["Ravi", "Meera"] });
    expect(setGuestCount(two, 1, 3).plusOneNames).toEqual(["Ravi"]);
  });
});

describe("buildPayload", () => {
  it("cleans the name", () => {
    expect(buildPayload(form({ name: "  Asha   Nair ", attending: "yes" })).name).toBe("Asha Nair");
  });
  it("sends guests only when attending (regression: decline after adding guests kept them)", () => {
    const p = buildPayload(form({ name: "Asha", attending: "no", plusOnes: 2, plusOneNames: ["Ravi", "Meera"] }));
    expect(p.plusOnes).toBe(0);
    expect(p.plusOneNames).toEqual([]);
  });
  it("sends the note only when declining", () => {
    expect(buildPayload(form({ name: "Asha", attending: "yes", message: "old note" })).message).toBe("");
    expect(buildPayload(form({ name: "Asha", attending: "no", message: " See you soon \n" })).message).toBe("See you soon");
  });
  it("keeps guest count and names consistent", () => {
    const p = buildPayload(form({ name: "Asha", attending: "yes", plusOnes: 2, plusOneNames: [" Ravi ", ""] }));
    expect(p.plusOnes).toBe(2);
    expect(p.plusOneNames).toEqual(["Ravi", ""]);
  });
  it("refuses to build without an answer", () => {
    expect(() => buildPayload(form({ name: "Asha" }))).toThrow();
  });
});

describe("text helpers", () => {
  it("firstName", () => {
    expect(firstName("  Asha   Nair ")).toBe("Asha");
    expect(firstName("Asha")).toBe("Asha");
  });
  it("cleanText", () => {
    expect(cleanText(" a \n b ")).toBe("a b");
  });
});

describe("submitRsvp", () => {
  const payload = buildPayload(form({ name: "Asha", attending: "yes" }));

  it("posts JSON as a simple no-cors request the Apps Script always receives", async () => {
    // no-cors responses are "opaque": nothing readable, which is fine.
    const fetchMock = vi.fn().mockResolvedValue({ type: "opaque", ok: false, status: 0 });
    expect(await submitRsvp("https://example.test/exec", payload, fetchMock)).toBe("sent");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.test/exec");
    expect(init.method).toBe("POST");
    expect(init.mode).toBe("no-cors");
    expect(init.headers["Content-Type"]).toMatch(/^text\/plain/);
    expect(JSON.parse(init.body)).toEqual(payload);
  });

  it("reports failure when the request can't leave the phone (regression: used to show 'Thank you' anyway)", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await submitRsvp("https://example.test/exec", payload, fetchMock)).toBe("failed");
  });

  it("gives up after the timeout", async () => {
    const hanging = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => init.signal?.addEventListener("abort", () => reject(new Error("aborted"))))
    );
    expect(await submitRsvp("https://example.test/exec", payload, hanging as unknown as typeof fetch, 30)).toBe("failed");
  });
});
