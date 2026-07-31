import { Sun, Soup, Popcorn, IceCreamBowl, Croissant, CupSoda, UtensilsCrossed, CakeSlice, Leaf, Fish, Beef } from "lucide-react"
import type { CategoryId } from "../../assets/data/categories.ts"

interface CategoryIconProps {
  id: CategoryId
  size?: number
  className?: string
}

const icons = {
  lunch: Sun,
  soup: Soup,
  snack: Popcorn,
  dessert: IceCreamBowl,
  pastry: Croissant,
  drink: CupSoda,

  savory: UtensilsCrossed,
  sweet: CakeSlice,

  vegetarian: Leaf,
  pescetarian: Fish,
  unrestricted: Beef,
} as const

export default function CategoryIcon({ id, size = 16, className }: CategoryIconProps) {
  const Icon = icons[id]
  return <Icon size={size} className={className} strokeWidth={2} />
}
