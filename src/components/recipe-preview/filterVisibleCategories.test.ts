import { describe, expect, it } from "vitest";
import { filterVisibleCategories } from "./filterVisibleCategories.ts";

const bogusRecipe = {
  title: "Recipe",
  fileName: "filename",
  ingredients: [],
  instructions: [],
  categories: [],
}

describe("filterVisibleCategories", () => {
  it("active category is always visible", () => {
    const result = filterVisibleCategories({ ...bogusRecipe, categories: ["savory", "carnivore"] }, ["savory"]);
    expect(result).toContain("savory");
  });

  it("carnivore and savory is hidden unless explicitly selected, leaving only visible outcome", () => {
    const result = filterVisibleCategories({ ...bogusRecipe, categories: ["savory", "carnivore", "lunch"] }, []);
    expect(result).toEqual(["lunch"]);
  });

  it("if the recipe is sweet, the diet is hidden", () => {
    const result = filterVisibleCategories({ ...bogusRecipe, categories: ["sweet", "vegetarian", "lunch"] }, []);
    expect(result).toEqual(["sweet", "lunch"]);
  });

  it("if the recipe is drink, everything but drink is hidden", () => {
    const result = filterVisibleCategories({ ...bogusRecipe, categories: ["sweet", "vegetarian", "drink"] }, []);
    expect(result).toEqual(["drink"]);
  });

  it("sorts the categories so the outcome is last", () => {
    const result = filterVisibleCategories({
      ...bogusRecipe,
      categories: ["lunch", "sweet", "vegetarian"]
    }, ["sweet", "vegetarian", "lunch"]);
    expect(result).toEqual(["sweet", "vegetarian", "lunch"]);
  });
});
