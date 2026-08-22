import { describe, expect, it } from "vitest";
import {
  ALTERNATIVE_PLACEHOLDER_PREFIX,
  flattenIngredients,
  getAlternativeKey,
  isIngredientSections, isInstructionSections
} from "./RecipeDto.ts";

describe("getAlternativeKey", () => {
  it("returns undefined if keyword prefix is not present", () => {
    const result = getAlternativeKey("no prefix input");
    expect(result).toBe(undefined);
  });

  it("returns the key if keyword prefix is present", () => {
    const result = getAlternativeKey(`${ALTERNATIVE_PLACEHOLDER_PREFIX}key`);
    expect(result).toBe("key");
  });

  it("returns empty string if keyword prefix is present, but not followed by key", () => {
    const result = getAlternativeKey(`${ALTERNATIVE_PLACEHOLDER_PREFIX}`);
    expect(result).toBe("");
  });
});


describe("isIngredientSections", () => {
  it("returns false if the input is empty array", () => {
    const result = isIngredientSections([]);
    expect(result).toBe(false);
  });

  it("returns false if the input is non-empty array of plain strings", () => {
    const result = isIngredientSections(["egg", "milk"]);
    expect(result).toBe(false);
  });

  it("returns true if the input is non-empty array of IngredientSections", () => {
    const result = isIngredientSections([{ section: "section", items: ["egg"] }]);
    expect(result).toBe(true);
  });
});

describe("flattenIngredients", () => {
  it("returns the input back if its simple list of strings", () => {
    const result = flattenIngredients([]);
    expect(result).toEqual([]);
  });

  it("returns a truly flattened list of all ingredients of each category", () => {
    const result = flattenIngredients([{ section: "a", items: ["egg"] }, { section: "b", items: ["milk"] }]);
    expect(result).toEqual(["egg", "milk"]);
  });
});

describe("isInstructionSections", () => {
  it("returns false if the input is empty array", () => {
    const result = isInstructionSections([]);
    expect(result).toBe(false);
  });

  it("returns false if the input is non-empty array of plain strings", () => {
    const result = isInstructionSections(["cook it", "bake it"]);
    expect(result).toBe(false);
  });

  it("returns true if the input is non-empty array of InstructionSection", () => {
    const result = isInstructionSections([{ section: "stove", items: ["cook it"] }]);
    expect(result).toBe(true);
  });
});
