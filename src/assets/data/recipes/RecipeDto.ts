import type { CategoryId } from "../categories.ts"

export type IngredientSection = {
  section: string
  items: string[]
}

export type InstructionSection = {
  section: string
  items: string[]
}

export type InstructionAlternativeOption = {
  name: string
  text: string
  recommended?: boolean
}

export type InstructionAlternatives = {
  key: string
  label?: string
  options: InstructionAlternativeOption[]
}

export type RecipeData = {
  title: string
  categories?: CategoryId[]
  ingredients: string[] | IngredientSection[]
  instructions: string[] | InstructionSection[]
  instructionAlternatives?: InstructionAlternatives[]
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

export const isInstructionSections = (
  instructions: string[] | InstructionSection[]
): instructions is InstructionSection[] =>
  instructions.length > 0 && typeof instructions[0] !== "string";

const ALTERNATIVE_PLACEHOLDER_PREFIX = "@alt:";

export const getAlternativeKey = (item: string): string | undefined =>
  item.startsWith(ALTERNATIVE_PLACEHOLDER_PREFIX)
    ? item.slice(ALTERNATIVE_PLACEHOLDER_PREFIX.length)
    : undefined;
