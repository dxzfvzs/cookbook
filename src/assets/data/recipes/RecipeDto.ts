import type { CategoryId } from "../categories.ts"

export type IngredientSection = {
  section: string
  items: string[]
}

export type Recipe = {
  title: string
  categories?: CategoryId[]
  ingredients: string[] | IngredientSection[]
  instructions: string[]
  notes?: string[],
  fileName: string,
}
