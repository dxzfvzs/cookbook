import React from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import { isIngredientSections } from "../assets/data/recipes/RecipeDto.ts";
import "./recipepage.css"
import CategorySegment from "../components/category-icon/CategorySegment.tsx";

const IngredientText: React.FC<{ text: string }> = ({ text }) => {
  const noteStart = text.indexOf("(");
  if (noteStart === -1) return <span className="recipe--ingredient-text">{text}</span>;

  return (
    <span className="recipe--ingredient-text">
      {text.slice(0, noteStart)}
      <span className="recipe--ingredient-note">{text.slice(noteStart)}</span>
    </span>
  );
};

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
          <span className="recipe-title-divider-line"/>
          <Heart className="recipe-title-divider-heart" size={18} fill="currentColor"/>
          <span className="recipe-title-divider-line"/>
        </div>
      </div>
      <aside className="recipe--ingredients panel panel--solid--paper">
        <h2 className="uppercase recipe--tab-title">Ingredients</h2>
        {isIngredientSections(recipe.ingredients) ? (
          recipe.ingredients.map((section, sIdx) => (
            <div key={sIdx} className="recipe--ingredients-section">
              <div className="recipe--ingredients-section-heading">
                <h3 className="recipe--ingredients-section-title uppercase">
                  {section.section}
                </h3>
                <span className="recipe--ingredients-section-line" aria-hidden="true" />
              </div>
              <ul className="recipe--ingredients-list">
                {section.items.map((i, idx) => (
                  <li key={idx}><IngredientText text={i}/></li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <ul className="recipe--ingredients-list">
            {recipe.ingredients.map((i, idx) => (
              <li key={idx}><IngredientText text={i}/></li>
            ))}
          </ul>
        )}
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
