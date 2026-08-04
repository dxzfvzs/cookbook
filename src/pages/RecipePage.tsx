import React from "react";
import { useParams } from "react-router-dom";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import "./recipepage.css"

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = initialRecipes.find(r => r.fileName === `${id}`);
  if (!recipe) return <p>Recipe {id} not found.</p>;

  return (
    <div className="recipe-page">
      <div className="recipe-title">
        <h1 className="">{recipe.title}</h1>
      </div>
      <aside className="recipe--ingredients panel panel--translucent">
        <h2 className="uppercase">Ingredients</h2>
        <ul className="recipe--ingredients-list scroll-list">
          {recipe.ingredients.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </aside>
      <div className="recipe--instructions panel panel--solid">
        <h2 className="uppercase">Instructions</h2>
        <ol className="recipe--instructions-list scroll-list">
          {recipe.instructions.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipePage;
