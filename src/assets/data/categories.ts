export type CategoryId = "meat" | "chicken" | "fish" | "veggie" | "baking" | "sweet"

export interface CategoryDefinition {
  id: CategoryId
  label: string
  color: string
}

export const CATEGORIES: CategoryDefinition[] = [
  { id: "meat", label: "Meat", color: "var(--cat-meat)" },
  { id: "chicken", label: "Chicken", color: "var(--cat-chicken)" },
  { id: "fish", label: "Fish", color: "var(--cat-fish)" },
  { id: "veggie", label: "Veggie", color: "var(--cat-veggie)" },
  { id: "baking", label: "Baking", color: "var(--cat-baking)" },
  { id: "sweet", label: "Sweet", color: "var(--cat-sweet)" },
]

export const categoryById: Record<CategoryId, CategoryDefinition> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, CategoryDefinition>
