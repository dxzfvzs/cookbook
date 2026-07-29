import { useMemo, useState } from "react";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import RecipePreview from "../components/recipe-preview/RecipePreview.tsx";

export default function AllRecipes() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return initialRecipes;
    return initialRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(term) ||
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  return (
    <div className="recipe-preview--wrapper">

      {/* Filtered list */}
      <div className="recipe-preview--list">
        {filteredRecipes.map((recipe) => <RecipePreview recipe={recipe}/>)}
      </div>

      {/* If nothing matches */}
      {filteredRecipes.length === 0 && (
        <p className="recipe-preview--no-results">No recipes found.</p>
      )}
    </div>
  );
}
