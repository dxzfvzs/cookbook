import type { CategoryId } from "../categories.ts"

export type IngredientSection = {
  section: string
  items: string[]
}

export type RecipeData = {
  title: string
  categories?: CategoryId[]
  ingredients: string[] | IngredientSection[]
  instructions: string[]
  notes?: string[],
}

export type Recipe = RecipeData & {
  fileName: string,
}

export const isIngredientSections = (
  ingredients: string[] | IngredientSection[]
): ingredients is IngredientSection[] =>
  ingredients.length > 0 && typeof ingredients[0] !== "string";

export const flattenIngredients = (ingredients: string[] | IngredientSection[]): string[] =>
  isIngredientSections(ingredients) ? ingredients.flatMap((section) => section.items) : ingredients;
