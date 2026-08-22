import "./recipe-preview.css";
import { Link } from "react-router-dom";
import type { Recipe } from "../../assets/data/recipes/RecipeDto.ts";
import CategorySegment from "../category-icon/CategorySegment.tsx";
import { type CategoryId } from "../../assets/data/categories.ts";
import { filterVisibleCategories } from "./filterVisibleCategories.ts";


interface RecipePreviewProps {
  recipe: Recipe
  activeCategories?: CategoryId[]
}

export default function RecipePreview({ recipe, activeCategories = [] }: RecipePreviewProps) {
  const visibleCategories = filterVisibleCategories(recipe, activeCategories);

  return (
    <Link to={`/recipe/${recipe.fileName}`} key={recipe.title} className="recipe-preview--card">
      <div className="recipe-preview--card-title">
        <span>{recipe.title}</span>
      </div>

      <div className={"recipe-preview--card-categories"}>
        {visibleCategories.map((category) => (
          <CategorySegment key={category} categoryId={category}/>
        ))}
      </div>
    </Link>
  );
}
