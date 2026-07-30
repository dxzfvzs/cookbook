import "./category-sidebar.css";
import { CATEGORIES, type CategoryId } from "../../assets/data/categories.ts";
import CategoryBadge from "../category-icon/CategoryBadge.tsx";

interface CategorySidebarProps {
  activeCategory: CategoryId | null;
  onSelect: (category: CategoryId | null) => void;
}

export default function CategorySidebar({ activeCategory, onSelect }: CategorySidebarProps) {
  return (
    <nav className="category-sidebar">
      <h2 className="category-sidebar--title">Browse Categories</h2>
      <ul className="category-sidebar--list">
        {CATEGORIES.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={
                activeCategory === category.id
                  ? "category-sidebar--item category-sidebar--item-active"
                  : "category-sidebar--item"
              }
              onClick={() => onSelect(activeCategory === category.id ? null : category.id)}
            >
              <CategoryBadge id={category.id} size={22} />
              <span>{category.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
