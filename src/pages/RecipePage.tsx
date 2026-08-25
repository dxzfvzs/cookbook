import React from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import "./recipepage.css"
import CategorySegment from "../components/category-icon/CategorySegment.tsx";
import { RecipeContext, useRecipeContext } from "../context/RecipeContext.tsx";
import IngredientsSection from "../components/ingredients-section/IngredientsSection.tsx";
import InstructionSection from "../components/instructions-section/InstructionSection.tsx";

const HeadlineSection = () => {
  const recipe = useRecipeContext();
  return (
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
  )
}

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = initialRecipes.find(r => r.fileName === `${id}`);

  if (!recipe) return <p>Recipe {id} not found.</p>;

  return (
    <RecipeContext.Provider value={recipe}>
      <div className="recipe-page">
        <HeadlineSection/>
        <IngredientsSection/>
        <InstructionSection/>
      </div>
    </RecipeContext.Provider>
  );
};

export default RecipePage;
