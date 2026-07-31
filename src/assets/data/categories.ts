export type CategoryGroupId = "outcome" | "type" | "diet"

export type CategoryId =
  | "lunch" | "soup" | "snack" | "dessert" | "pastry" | "drink"
  | "savory" | "sweet"
  | "vegetarian" | "pescetarian" | "carnivore"

export interface CategoryDefinition {
  id: CategoryId
  label: string
  color: string
  group: CategoryGroupId
  keywords?: string[]
}

export interface CategoryGroupDefinition {
  id: CategoryGroupId
  label: string
}

export const CATEGORY_GROUPS: CategoryGroupDefinition[] = [
  { id: "outcome", label: "By Outcome" },
  { id: "type", label: "By Type" },
  { id: "diet", label: "Diet" },
]

export const CATEGORIES: CategoryDefinition[] = [
  { id: "soup", label: "Soup", color: "var(--cat-soup)", group: "outcome" },
  { id: "snack", label: "Snack", color: "var(--cat-snack)", group: "outcome" },
  { id: "lunch", label: "Lunch", color: "var(--cat-lunch)", group: "outcome" },
  { id: "pastry", label: "Pastry", color: "var(--cat-pastry)", group: "outcome" },
  { id: "dessert", label: "Dessert", color: "var(--cat-dessert)", group: "outcome" },
  { id: "drink", label: "Drink", color: "var(--cat-drink)", group: "outcome" },

  { id: "savory", label: "Savory", color: "var(--cat-savory)", group: "type" },
  { id: "sweet", label: "Sweet", color: "var(--cat-sweet)", group: "type" },

  { id: "vegetarian", label: "Vegetarian", color: "var(--cat-vegetarian)", group: "diet" },
  { id: "pescetarian", label: "Pescetarian", color: "var(--cat-pescetarian)", group: "diet", keywords: ["fish"] },
  { id: "carnivore", label: "Carnivore", color: "var(--cat-carnivore)", group: "diet" },
]

export const categoryById: Record<CategoryId, CategoryDefinition> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, CategoryDefinition>

export const categoriesByGroup: Record<CategoryGroupId, CategoryDefinition[]> = Object.fromEntries(
  CATEGORY_GROUPS.map((g) => [g.id, CATEGORIES.filter((c) => c.group === g.id)])
) as Record<CategoryGroupId, CategoryDefinition[]>
