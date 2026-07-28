import { Beef, Drumstick, Fish, Broccoli, Croissant, CakeSlice } from "lucide-react"
import type { CategoryId } from "../../../assets/data/categories.ts"

interface CategoryIconProps {
  id: CategoryId
  size?: number
  className?: string
}

const icons = {
  meat: Beef,
  chicken: Drumstick,
  fish: Fish,
  veggie: Broccoli,
  baking: Croissant,
  sweet: CakeSlice,
} as const

export default function CategoryIcon({ id, size = 16, className }: CategoryIconProps) {
  const Icon = icons[id]
  return <Icon size={size} className={className} strokeWidth={2} />
}
