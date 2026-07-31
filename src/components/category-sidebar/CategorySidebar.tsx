import "./category-sidebar.css";
import { CATEGORY_GROUPS, categoriesByGroup, type CategoryId } from "../../assets/data/categories.ts";
import CategorySegment from "../category-icon/CategorySegment.tsx";

interface CategorySidebarProps {
  activeCategory: CategoryId | null;
  onSelect: (category: CategoryId | null) => void;
}

export default function CategorySidebar({ activeCategory, onSelect }: CategorySidebarProps) {
  return (
    <nav className="category-sidebar">
      <h2 className="uppercase category-sidebar--title">Browse Categories</h2>

      {CATEGORY_GROUPS.map((group) => (
        <div key={group.id}>
          <h3 className="uppercase category-sidebar--subtitle">{group.label}</h3>

          <ul className="category-sidebar--list">
            {categoriesByGroup[group.id].map((category) => (
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
                  <CategorySegment id={category.id}/>
                  <span>{category.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
