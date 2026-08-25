import { useEffect, useState } from "react";
import "./category-sidebar.css";
import { CATEGORY_GROUPS, categoriesByGroup, type CategoryId } from "../../assets/data/categories.ts";
import CategorySegment from "../category-icon/CategorySegment.tsx";

interface CategorySidebarProps {
  activeCategories: CategoryId[];
  onSelect: (category: CategoryId, additive: boolean) => void;
}

function useIsCoarsePointer() {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const handleChange = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
    setIsCoarse(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return isCoarse;
}

export default function CategorySidebar({ activeCategories, onSelect }: CategorySidebarProps) {
  const isCoarsePointer = useIsCoarsePointer();

  return (
    <nav className="category-sidebar panel panel--translucent">
      <h2 className="uppercase category-sidebar--title">Browse Categories</h2>

      {CATEGORY_GROUPS.map((group) => (
        <div key={group.id} className="category-group">
          <h3 className="uppercase category-sidebar--subtitle">{group.label}</h3>

          <ul className="category-sidebar--list">
            {categoriesByGroup[group.id].map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  className={
                    activeCategories.includes(category.id)
                      ? "category-sidebar--item category-sidebar--item-active"
                      : "category-sidebar--item"
                  }
                  onClick={() => onSelect(category.id, isCoarsePointer)}
                  onMouseDown={(e) => {
                    if (e.button === 1) e.preventDefault();
                  }}
                  onAuxClick={(e) => {
                    if (e.button === 1) {
                      e.preventDefault();
                      onSelect(category.id, true);
                    }
                  }}
                >
                  <CategorySegment categoryId={category.id}/>
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
