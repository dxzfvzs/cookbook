import "./category-segment.css"
import CategoryIcon from "./CategoryIcon.tsx"
import { categoryById, type CategoryId } from "../../../assets/data/categories.ts"

interface CategorySegmentProps {
  id: CategoryId
  iconSize?: number
  className?: string
}

export default function CategorySegment({ id, iconSize = 15, className }: CategorySegmentProps) {
  const category = categoryById[id]

  return (
    <span
      className={className ? `category-segment ${className}` : "category-segment"}
      style={{ backgroundColor: category.color }}
      title={category.label}
    >
      <CategoryIcon id={id} size={iconSize}/>
    </span>
  )
}
