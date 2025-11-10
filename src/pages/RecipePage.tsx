import React from "react";
import { useParams } from "react-router-dom";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import "./recipepage.css"

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = initialRecipes.find(r => r.fileName === `${id}`);
  if (!recipe) return <p>Recipe {id} not found.</p>;

  return (
    <div className="main-content">
      <div className="recipe-title">
        <h1 className="">{recipe.title}</h1>
      </div>
      <div className="recipe">
        <div className="recipe--box recipe--ingredients">
          <h2 className="recipe--subtitle">Ingredients</h2>
          <ul className="list-disc ml-5">
            {recipe.ingredients.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
        <div className="recipe--box recipe--instructions">
          <h2 className="recipe--subtitle">Instructions</h2>
          {recipe.instructions.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
