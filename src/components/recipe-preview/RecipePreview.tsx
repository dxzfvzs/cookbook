import "./recipe-preview.css";
import { initialRecipes } from "../../assets/data/recipes/init.ts";

export default function RecipePreviewCard() {

  const groupedRecipes = initialRecipes.reduce((groups, recipe) => {
    const firstLetter = recipe.title[0].toUpperCase();
    if (!groups[firstLetter]) groups[firstLetter] = [];
    groups[firstLetter].push(recipe);
    return groups;
  }, {} as Record<string, typeof initialRecipes>);


  const sortedLetters = Object.keys(groupedRecipes).sort();

  return (
    <div className="recipe-preview--wrapper">
      {sortedLetters.map((letter) => (
        <div key={letter} id={`letter-${letter}`} className="recipe-preview--container">
          <h2 className="recipe-preview--letter">{letter}</h2>
          <div className="recipe-preview--list">
            {groupedRecipes[letter].map((recipe) => (
              <div key={recipe.title} className="recipe-preview--card">
                {recipe.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
