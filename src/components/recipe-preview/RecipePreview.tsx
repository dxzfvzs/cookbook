import "./recipe-preview.css";
import { Link } from "react-router-dom";
import type { Recipe } from "../../assets/data/recipes/RecipeDto.ts";
import CategorySegment from "../category-icon/CategorySegment.tsx";


export default function RecipePreview({ recipe }: { recipe: Recipe }) {
  return (
    <Link to={`/recipe/${recipe.fileName}`} key={recipe.title} className="recipe-preview--card">

      <div className="recipe-preview--card-title">
        <span>{recipe.title}</span>
      </div>

      <div className={"recipe-preview--card-categories"}>
        {recipe.categories?.map((category) => (
          <CategorySegment key={category} id={category}/>
        ))}
      </div>

    </Link>
  );
}
