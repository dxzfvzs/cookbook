import { useMemo, useState } from "react";
import "./all-recipes.css";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import RecipePreview from "../components/recipe-preview/RecipePreview.tsx";
import SearchBar from "../components/search/SearchBar.tsx";
import CategorySidebar from "../components/category-sidebar/CategorySidebar.tsx";
import { categoryById, type CategoryId } from "../assets/data/categories.ts";

function categoryMatchesTerm(categoryId: CategoryId, term: string): boolean {
  const category = categoryById[categoryId];
  const names = [category.label.toLowerCase(), ...(category.keywords ?? [])];
  return names.some((name) => name.includes(term) || term.includes(name));
}

export default function AllRecipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);

  const filteredRecipes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return initialRecipes.filter((recipe) => {
      const matchesTerm =
        !term ||
        recipe.title.toLowerCase().includes(term) ||
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(term)) ||
        recipe.categories?.some((categoryId) => categoryMatchesTerm(categoryId, term));
      const matchesCategory =
        !activeCategory || recipe.categories?.includes(activeCategory);
      return matchesTerm && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="all-recipes">

      <div className="all-recipes--search">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <CategorySidebar activeCategory={activeCategory} onSelect={setActiveCategory}/>

      <div className="recipe-preview--wrapper">
        {filteredRecipes.length > 0 && (
          <div className="recipe-preview--list">
            {filteredRecipes.map((recipe) => (
              <RecipePreview key={recipe.fileName} recipe={recipe}/>
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
