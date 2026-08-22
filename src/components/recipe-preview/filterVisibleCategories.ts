import type { Recipe } from "../../assets/data/recipes/RecipeDto.ts";
import { categoryById, type CategoryId } from "../../assets/data/categories.ts";

function isSweet(recipe: Recipe) {
  return recipe.categories?.includes("sweet") ?? false
}

export function filterVisibleCategories(recipe: Recipe, activeCategories: CategoryId[]): CategoryId[] {
  if (!recipe.categories) return [];

  return recipe.categories
    .filter((category) => activeCategories.includes(category) || (category !== "carnivore" && category !== "savory"))
    .filter((category) => activeCategories.includes(category) || !(isSweet(recipe) && categoryById[category].group === "diet"))
    // TODO: .filter((category) => activeCategories.includes(category) || !(isDrink(recipe) && (categoryById[category].group === "type" || categoryById[category].group === "diet")))
    .sort((a, b) => Number(categoryById[a].group === "outcome") - Number(categoryById[b].group === "outcome"))
}
