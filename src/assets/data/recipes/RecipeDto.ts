import type { CategoryId } from "../categories.ts"

export type Recipe = {
  title: string
  categories?: CategoryId[]
  ingredients: string[]
  instructions: string[]
  notes?: string[],
  fileName: string,
}
