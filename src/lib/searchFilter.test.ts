import { describe, expect, it } from "vitest";
import { categoryMatchesTerm } from "./searchFilter.ts";

describe("categoryMatchesTerm", () => {
  it("returns true if term category label contains term", () => {
    const result = categoryMatchesTerm("soup", "sou");
    expect(result).toBe(true);
  });

  it("returns true if any of category keywords contain term", () => {
    const result = categoryMatchesTerm("pescetarian", "fish");
    expect(result).toBe(true);
  });

  it("returns true if term contains category label", () => {
    const result = categoryMatchesTerm("lunch", "lunchables");
    expect(result).toBe(true);
  });

  it("returns false if term is not contained anywhere", () => {
    const result = categoryMatchesTerm("soup", "flyingspaghettimonster");
    expect(result).toBe(false);
  });
});
