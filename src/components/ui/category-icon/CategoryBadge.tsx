import "./category-badge.css"
import CategoryIcon from "./CategoryIcon.tsx"
import { categoryById, type CategoryId } from "../../../assets/data/categories.ts"

interface CategoryBadgeProps {
  id: CategoryId
  size?: number
  className?: string
}

const ICON_TO_BADGE_RATIO = 0.6

export default function CategoryBadge({ id, size = 20, className }: CategoryBadgeProps) {
  const category = categoryById[id]

  return (
    <span
      className={className ? `category-badge ${className}` : "category-badge"}
      style={{ width: size, height: size, backgroundColor: category.color }}
      title={category.label}
    >
      <CategoryIcon id={id} size={Math.round(size * ICON_TO_BADGE_RATIO)} />
    </span>
  )
}
