import "./recipe-preview.css";
import { Link } from "react-router-dom";
import type { Recipe } from "../../assets/data/recipes/RecipeDto.ts";
import CategorySegment from "../category-icon/CategorySegment.tsx";
import { categoryById, type CategoryId } from "../../assets/data/categories.ts";


interface RecipePreviewProps {
  recipe: Recipe
  activeCategories?: CategoryId[]
}

export default function RecipePreview({ recipe, activeCategories = [] }: RecipePreviewProps) {
  const isSweet = recipe.categories?.includes("sweet") ?? false;

  return (
    <Link to={`/recipe/${recipe.fileName}`} key={recipe.title} className="recipe-preview--card">

      <div className="recipe-preview--card-title">
        <span>{recipe.title}</span>
      </div>

      <div className={"recipe-preview--card-categories"}>
        {recipe.categories
          ?.filter((category) => activeCategories.includes(category) || (category !== "carnivore" && category !== "savory"))
          .filter((category) => activeCategories.includes(category) || !(isSweet && categoryById[category].group === "diet"))
          .sort((a, b) => Number(categoryById[a].group === "outcome") - Number(categoryById[b].group === "outcome"))
          .map((category) => (
            <CategorySegment key={category} id={category}/>
          ))}
      </div>

    </Link>
  );
}
