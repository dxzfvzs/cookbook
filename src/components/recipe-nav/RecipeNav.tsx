import React from "react";
import { Link } from "react-router-dom";
import type { Recipe } from "../../assets/data/recipes/RecipeDto.ts";
import "./recipe-nav.css";

interface RecipeNavProps {
  prevRecipe?: Recipe;
  nextRecipe?: Recipe;
}

const RecipeNav: React.FC<RecipeNavProps> = ({ prevRecipe, nextRecipe }) => {
  return (
    <nav className="recipe-nav">
      <Link to="/" className="recipe-nav--back">
        <span className="recipe-nav--arrow" aria-hidden="true">&larr;</span>
        <span>Back to recipes</span>
      </Link>

      <div className="recipe-nav--adjacent">
        {prevRecipe ? (
          <Link to={`/recipe/${prevRecipe.fileName}`} className="recipe-nav--prev">
            <span aria-hidden="true">&larr;</span> Prev
          </Link>
        ) : (
          <span className="recipe-nav--prev recipe-nav--disabled">
            <span aria-hidden="true">&larr;</span> Prev
          </span>
        )}
        {nextRecipe ? (
          <Link to={`/recipe/${nextRecipe.fileName}`} className="recipe-nav--next">
            Next <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : (
          <span className="recipe-nav--next recipe-nav--disabled">
            Next <span aria-hidden="true">&rarr;</span>
          </span>
        )}
      </div>
    </nav>
  );
};

export default RecipeNav;
