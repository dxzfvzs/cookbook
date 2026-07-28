export type CategoryId = "meat" | "chicken" | "fish" | "veggie" | "baking" | "sweet"

export interface CategoryDefinition {
  id: CategoryId
  label: string
  color: string
  bgColor: string
}

export const CATEGORIES: CategoryDefinition[] = [
  { id: "meat", label: "Meat", color: "var(--cat-meat)", bgColor: "var(--cat-meat-bg)" },
  { id: "chicken", label: "Chicken", color: "var(--cat-chicken)", bgColor: "var(--cat-chicken-bg)" },
  { id: "fish", label: "Fish", color: "var(--cat-fish)", bgColor: "var(--cat-fish-bg)" },
  { id: "veggie", label: "Veggie", color: "var(--cat-veggie)", bgColor: "var(--cat-veggie-bg)" },
  { id: "baking", label: "Baking", color: "var(--cat-baking)", bgColor: "var(--cat-baking-bg)" },
  { id: "sweet", label: "Sweet", color: "var(--cat-sweet)", bgColor: "var(--cat-sweet-bg)" },
]

export const categoryById: Record<CategoryId, CategoryDefinition> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, CategoryDefinition>
