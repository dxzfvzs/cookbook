import { useMemo, useState } from "react";
import "./all-recipes.css";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import RecipePreview from "../components/recipe-preview/RecipePreview.tsx";
import SearchBar from "../components/search/SearchBar.tsx";
import CategorySidebar from "../components/category-sidebar/CategorySidebar.tsx";
import { categoryById, type CategoryGroupId, type CategoryId } from "../assets/data/categories.ts";

function categoryMatchesTerm(categoryId: CategoryId, term: string): boolean {
  const category = categoryById[categoryId];
  const names = [category.label.toLowerCase(), ...(category.keywords ?? [])];
  return names.some((name) => name.includes(term) || term.includes(name));
}

export default function AllRecipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategories, setActiveCategories] = useState<CategoryId[]>([]);

  const handleSelectCategory = (category: CategoryId, isMiddleClick: boolean) => {
    setActiveCategories((prev) => {
      if (isMiddleClick) {
        return prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category];
      }
      return prev.length === 1 && prev[0] === category ? [] : [category];
    });
  };

  const activeCategoriesByGroup = useMemo(() => {
    const groups = new Map<CategoryGroupId, CategoryId[]>();
    for (const cat of activeCategories) {
      const group = categoryById[cat].group;
      groups.set(group, [...(groups.get(group) ?? []), cat]);
    }
    return [...groups.values()];
  }, [activeCategories]);

  const filteredRecipes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return initialRecipes.filter((recipe) => {
      const matchesTerm =
        !term ||
        recipe.title.toLowerCase().includes(term) ||
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(term)) ||
        recipe.categories?.some((categoryId) => categoryMatchesTerm(categoryId, term));
      const matchesCategory = activeCategoriesByGroup.every((group) =>
        group.some((cat) => recipe.categories?.includes(cat))
      );
      return matchesTerm && matchesCategory;
    });
  }, [searchTerm, activeCategoriesByGroup]);

  return (
    <div className="all-recipes">

      <div className="all-recipes--search">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <CategorySidebar activeCategories={activeCategories} onSelect={handleSelectCategory}/>

      <div className="recipe-preview--wrapper">
        {filteredRecipes.length > 0 && (
          <div className="recipe-preview--list">
            {filteredRecipes.map((recipe) => (
              <RecipePreview key={recipe.fileName} recipe={recipe} activeCategories={activeCategories}/>
            ))}
          </div>
        )}
        {filteredRecipes.length === 0 && (
          <p className="recipe-preview--no-results">No recipes found.</p>
        )}
      </div>

    </div>
  );
}
