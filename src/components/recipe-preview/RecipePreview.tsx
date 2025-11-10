import "./recipe-preview.css";
import { useMemo, useState } from "react";
import { initialRecipes } from "../../assets/data/recipes/init.ts";
import { Link } from "react-router-dom";

export default function RecipePreviewCard() {
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

  const groupedRecipes = useMemo(() => {
    return filteredRecipes.reduce((groups, recipe) => {
      const firstLetter = recipe.title[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(recipe);
      return groups;
    }, {} as Record<string, typeof initialRecipes>);
  }, [filteredRecipes]);

  const sortedLetters = Object.keys(groupedRecipes).sort();

  return (
      <div className="recipe-preview--wrapper">
        <div className="recipe-preview--search">
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="recipe-preview--searchbar"
          />
        </div>
        {/* Render grouped results */}
        {sortedLetters.map((letter) => (
          <div
            key={letter}
            id={`letter-${letter}`}
            className="recipe-preview--container"
          >
            <h2 className="recipe-preview--letter">{letter}</h2>
            <div className="recipe-preview--list">
              {groupedRecipes[letter].map((recipe) => (
                <Link to={`/recipe/${recipe.fileName}`} key={recipe.title} className="recipe-preview--card">
                  {recipe.title}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* If nothing matches */}
        {sortedLetters.length === 0 && (
          <p className="recipe-preview--no-results">No recipes found.</p>
        )}
      </div>
  );
}
