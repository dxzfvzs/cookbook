import React from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import {
  getAlternativeKey,
  type IngredientSection,
  type InstructionAlternatives,
  type InstructionSection,
  isIngredientSections,
  isInstructionSections,
  type Recipe
} from "../assets/data/recipes/RecipeDto.ts";
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


// Headline -------------------------------------------------------------------

const HeadlineSection = ({ recipe }: { recipe: Recipe }) => {
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

// Ingredients ----------------------------------------------------------------

const IngredientSectionsSimpleContent = ({ ingredients }: { ingredients: string[] }) => {
  return (
    <aside className="recipe--ingredients panel panel--solid--paper">
      <h2 className="uppercase recipe--tab-title">Ingredients</h2>
      <ul className="recipe--ingredients-list">
        {ingredients.map((i, idx) => (
          <li key={idx}><IngredientText text={i}/></li>
        ))}
      </ul>
    </aside>
  );
}

const IngredientSectionsSectionedContent = ({ ingredients }: { ingredients: IngredientSection[] }) => {
  return (
    ingredients.map((section, sIdx) => (
      <div key={sIdx} className="recipe--ingredients-section">
        <div className="recipe--ingredients-section-heading">
          <h3 className="recipe--ingredients-section-title uppercase">
            {section.section}
          </h3>
          <span className="recipe--ingredients-section-line" aria-hidden="true"/>
        </div>
        <ul className="recipe--ingredients-list">
          {section.items.map((i, idx) => (
            <li key={idx}><IngredientText text={i}/></li>
          ))}
        </ul>
      </div>
    ))
  );
}

const IngredientsSection = ({ recipe }: { recipe: Recipe }) => {
  return (
    <aside className="recipe--ingredients panel panel--solid--paper">
      <h2 className="uppercase recipe--tab-title">Ingredients</h2>
      {isIngredientSections(recipe.ingredients)
        ? <IngredientSectionsSectionedContent ingredients={recipe.ingredients}/>
        : <IngredientSectionsSimpleContent ingredients={recipe.ingredients}/>
      }
    </aside>
  )
}

// Alternative Selector -------------------------------------------------------

const AlternativeInstructionsSelector = ({ instructionAlternatives, selectedAlternatives, setSelectedAlternatives }: {
  instructionAlternatives?: InstructionAlternatives[],
  selectedAlternatives: Record<string, string>
  setSelectedAlternatives: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) => {
  if (!instructionAlternatives) return null;

  return (
    instructionAlternatives?.map((alt) => (
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
    ))
  )
}

// Instructions ---------------------------------------------------------------

const InstructionSectionsSectionedContent = ({ instructions, resolveInstructionText }: {
  instructions: InstructionSection[],
  resolveInstructionText: (item: string) => string
}) => {
  let stepCount = 0;
  return instructions.map((section, sIdx) => (
    <div key={sIdx} className="recipe--instructions-section">
      <div className="recipe--instructions-section-heading">
        <h3 className="recipe--instructions-section-title uppercase">
          {section.section}
        </h3>
        <span className="recipe--instructions-section-line" aria-hidden="true"/>
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
}

const InstructionSectionsSimpleContent = ({ instructions, resolveInstructionText }: {
  instructions: string[],
  resolveInstructionText: (item: string) => string
}) => {
  return (
    <ol className="recipe--instructions-list">
      {instructions.map((i, idx) => (
        <li key={idx}>
          <span className="recipe--instructions-number">{idx + 1}</span>
          <span>{resolveInstructionText(i)}</span>
        </li>
      ))}
    </ol>
  );
}

const InstructionSection = ({ recipe }: { recipe: Recipe }) => {
  const [selectedAlternatives, setSelectedAlternatives] = React.useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    recipe?.instructionAlternatives?.forEach((alt) => {
      const defaultOption = alt.options.find(o => o.recommended) ?? alt.options[0];
      if (defaultOption) defaults[alt.key] = defaultOption.name;
    });
    return defaults;
  });

  const resolveInstructionText = (item: string): string => {
    const altKey = getAlternativeKey(item);
    if (!altKey) return item;
    const alt = recipe.instructionAlternatives?.find(a => a.key === altKey);
    const option = alt?.options.find(o => o.name === selectedAlternatives[altKey]) ?? alt?.options[0];
    return option?.text ?? item;
  };

  return (
    <div className="recipe--instructions panel panel--solid--paper">
      <AlternativeInstructionsSelector instructionAlternatives={recipe.instructionAlternatives}
                                       selectedAlternatives={selectedAlternatives}
                                       setSelectedAlternatives={setSelectedAlternatives}/>
      <h2 className="uppercase recipe--tab-title">Instructions</h2>
      {isInstructionSections(recipe.instructions)
        ? <InstructionSectionsSectionedContent instructions={recipe.instructions}
                                               resolveInstructionText={resolveInstructionText}/>
        : <InstructionSectionsSimpleContent instructions={recipe.instructions}
                                            resolveInstructionText={resolveInstructionText}/>
      }
    </div>
  );
}

// Page -----------------------------------------------------------------------

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = initialRecipes.find(r => r.fileName === `${id}`);

  if (!recipe) return <p>Recipe {id} not found.</p>;

  return (
    <div className="recipe-page">
      <HeadlineSection recipe={recipe}/>
      <IngredientsSection recipe={recipe}/>
      <InstructionSection recipe={recipe}/>
    </div>
  );
};

export default RecipePage;
