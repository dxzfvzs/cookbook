import React from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import { getAlternativeKey, isIngredientSections, isInstructionSections } from "../assets/data/recipes/RecipeDto.ts";
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

  const [selectedAlternatives, setSelectedAlternatives] = React.useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    recipe?.instructionAlternatives?.forEach((alt) => {
      const defaultOption = alt.options.find(o => o.recommended) ?? alt.options[0];
      if (defaultOption) defaults[alt.key] = defaultOption.name;
    });
    return defaults;
  });

  if (!recipe) return <p>Recipe {id} not found.</p>;

  const resolveInstructionText = (item: string): string => {
    const altKey = getAlternativeKey(item);
    if (!altKey) return item;
    const alt = recipe.instructionAlternatives?.find(a => a.key === altKey);
    const option = alt?.options.find(o => o.name === selectedAlternatives[altKey]) ?? alt?.options[0];
    return option?.text ?? item;
  };

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
        {recipe.instructionAlternatives?.map((alt) => (
          <div key={alt.key} className="recipe--instruction-alternatives">
            <h2 className="uppercase recipe--tab-title">
              Choose {alt.label ?? alt.key}:
            </h2>
            <div className="recipe--instruction-alternatives-options">
              {alt.options.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  className={
                    "recipe--instruction-alternative-pill" +
                    (selectedAlternatives[alt.key] === option.name
                      ? " recipe--instruction-alternative-pill--selected"
                      : "")
                  }
                  onClick={() => setSelectedAlternatives(prev => ({ ...prev, [alt.key]: option.name }))}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        ))}
        <h2 className="uppercase recipe--tab-title">Instructions</h2>
        {isInstructionSections(recipe.instructions) ? (
          (() => {
            let stepCount = 0;
            return recipe.instructions.map((section, sIdx) => (
              <div key={sIdx} className="recipe--instructions-section">
                <div className="recipe--instructions-section-heading">
                  <h3 className="recipe--instructions-section-title uppercase">
                    {section.section}
                  </h3>
                  <span className="recipe--instructions-section-line" aria-hidden="true" />
                </div>
                <ol className="recipe--instructions-list">
                  {section.items.map((i, idx) => {
                    stepCount += 1;
                    return (
                      <li key={idx}>
                        <span className="recipe--instructions-number">{stepCount}</span>
                        <span>{resolveInstructionText(i)}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ));
          })()
        ) : (
          <ol className="recipe--instructions-list">
            {recipe.instructions.map((i, idx) => (
              <li key={idx}>
                <span className="recipe--instructions-number">{idx + 1}</span>
                <span>{resolveInstructionText(i)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
