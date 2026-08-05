import React from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import "./recipepage.css"
import CategorySegment from "../components/category-icon/CategorySegment.tsx";

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = initialRecipes.find(r => r.fileName === `${id}`);
  if (!recipe) return <p>Recipe {id} not found.</p>;

  return (
    <div className="recipe-page">
      <div className="recipe-title">
        <div className="recipe-title-categories">
          {recipe.categories?.map((category) => (
            <CategorySegment key={category} categoryId={category} showLabel={true} iconSize={22}/>
          ))}
        </div>
        <h1 className="">{recipe.title}</h1>
        <div className="recipe-title-divider" aria-hidden="true">
          <span className="recipe-title-divider-line" />
          <Heart className="recipe-title-divider-heart" size={18} fill="currentColor" />
          <span className="recipe-title-divider-line" />
        </div>
      </div>
      <aside className="recipe--ingredients panel panel--solid--paper">
        <h2 className="uppercase recipe--tab-title">Ingredients</h2>
        <ul className="recipe--ingredients-list">
          {recipe.ingredients.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </aside>
      <div className="recipe--instructions panel panel--solid--paper">
        <h2 className="uppercase recipe--tab-title">Instructions</h2>
        <ol className="recipe--instructions-list">
          {recipe.instructions.map((i, idx) => (
            <li key={idx}>
              <span className="recipe--instructions-number">{idx + 1}</span>
              <span>{i}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipePage;
