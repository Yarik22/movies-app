import { describe, it, expect } from "vitest";
import { normalizeTitle, isValidYear } from "./format";

describe("normalizeTitle", () => {
  it("removes non-ASCII symbols and capitalizes words", () => {
    expect(normalizeTitle("hello world!")).toBe("Hello World");
    expect(normalizeTitle("  multiple   spaces ")).toBe("Multiple Spaces");
    expect(normalizeTitle("naïve café")).toBe("Naive Cafe");
  });

  it("handles empty strings", () => {
    expect(normalizeTitle("")).toBe("");
  });
});

describe("isValidYear", () => {
  it("validates correct years", () => {
    expect(isValidYear("1888")).toBe(true);
    expect(isValidYear(new Date().getFullYear().toString())).toBe(true);
  });

  it("rejects invalid years", () => {
    expect(isValidYear("abcd")).toBe(false);
    expect(isValidYear("1800")).toBe(false);
    expect(isValidYear("3000")).toBe(false);
  });
});
