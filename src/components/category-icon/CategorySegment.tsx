import "./category-segment.css"
import CategoryIcon from "./CategoryIcon.tsx"
import { categoryById, type CategoryId } from "../../assets/data/categories.ts"

interface CategorySegmentProps {
  categoryId: CategoryId
  iconSize?: number
  className?: string
  showLabel?: boolean
}

export default function CategorySegment({ categoryId, className, showLabel, iconSize}: CategorySegmentProps) {
  const category = categoryById[categoryId]

  return (
    <span
      className={className ? `category-segment ${className}` : "category-segment"}
      style={{ backgroundColor: category.color }}
      title={category.label}
    >
      <CategoryIcon id={categoryId} size={iconSize}/>
      {showLabel && (
        <span className={"category-segment--label uppercase"}>{categoryId}</span>
      )}
    </span>
  )
}
