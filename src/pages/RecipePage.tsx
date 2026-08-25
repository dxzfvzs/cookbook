import React from "react";
import { useParams } from "react-router-dom";
import { Check, Heart } from "lucide-react";
import { initialRecipes } from "../assets/data/recipes/init.ts";
import {
  getAlternativeKey,
  type InstructionAlternatives,
  isIngredientSections,
  isInstructionSections,
  type Recipe
} from "../assets/data/recipes/RecipeDto.ts";
import "./recipepage.css"
import CategorySegment from "../components/category-icon/CategorySegment.tsx";
import StrikeText from "../components/strike-text/StrikeText.tsx";

// Recipe context ---------------------------------------------------------

const RecipeContext = React.createContext<Recipe | null>(null);

const useRecipeContext = (): Recipe => {
  const ctx = React.useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipeContext must be used within a RecipeContext.Provider");
  return ctx;
};

// Done-item tracking -----------------------------------------------------

type DoneItemsContextValue = {
  doneItems: Set<string>;
  toggleItem: (key: string) => void;
};

const DoneItemsContext = React.createContext<DoneItemsContextValue | null>(null);

const DoneItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doneItems, setDoneItems] = React.useState<Set<string>>(new Set());
  const toggleItem = (key: string) => {
    setDoneItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <DoneItemsContext.Provider value={{ doneItems, toggleItem }}>
      {children}
    </DoneItemsContext.Provider>
  );
};

const useIsDone = (key: string): [boolean, () => void] => {
  const ctx = React.useContext(DoneItemsContext);
  if (!ctx) throw new Error("useIsDone must be used within a DoneItemsProvider");
  return [ctx.doneItems.has(key), () => ctx.toggleItem(key)];
};

const DoneListItem: React.FC<{ done: boolean; onToggle: () => void; children: React.ReactNode }> = ({
  done,
  onToggle,
  children
}) => (
  <li className={done ? "is-done" : undefined} onClick={onToggle}>
    {children}
  </li>
);

const IngredientText: React.FC<{ text: string; done: boolean }> = ({ text, done }) => {
  const noteStart = text.indexOf("(");
  if (noteStart === -1) return (
    <StrikeText active={done} className="recipe--ingredient-text">{text}</StrikeText>
  );

  return (
    <StrikeText active={done} className="recipe--ingredient-text">
      {text.slice(0, noteStart)}
      <span className="recipe--ingredient-note">{text.slice(noteStart)}</span>
    </StrikeText>
  );
};


// Headline -------------------------------------------------------------------

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

// Ingredients ----------------------------------------------------------------

const IngredientRow = ({ text, itemKey }: { text: string; itemKey: string }) => {
  const [done, toggle] = useIsDone(itemKey);
  return (
    <DoneListItem done={done} onToggle={toggle}>
      <IngredientText text={text} done={done}/>
    </DoneListItem>
  );
};

const IngredientSectionsSimpleContent = () => {
  const { ingredients } = useRecipeContext();
  if (isIngredientSections(ingredients)) return null;

  return (
    <ul className="recipe--ingredients-list">
      {ingredients.map((i, idx) => (
        <IngredientRow key={idx} text={i} itemKey={`${idx}`}/>
      ))}
    </ul>
  );
}

const IngredientSectionsSectionedContent = () => {
  const { ingredients } = useRecipeContext();
  if (!isIngredientSections(ingredients)) return null;

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
            <IngredientRow key={idx} text={i} itemKey={`${sIdx}-${idx}`}/>
          ))}
        </ul>
      </div>
    ))
  );
}

const IngredientsSection = () => {
  const { ingredients } = useRecipeContext();
  return (
    <aside className="recipe--ingredients panel panel--solid--paper">
      <h2 className="uppercase recipe--tab-title">Ingredients</h2>
      <DoneItemsProvider>
        {isIngredientSections(ingredients)
          ? <IngredientSectionsSectionedContent/>
          : <IngredientSectionsSimpleContent/>
        }
      </DoneItemsProvider>
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

const ResolveInstructionTextContext = React.createContext<((item: string) => string) | null>(null);

const useResolveInstructionText = (): (item: string) => string => {
  const ctx = React.useContext(ResolveInstructionTextContext);
  if (!ctx) throw new Error("useResolveInstructionText must be used within a ResolveInstructionTextContext.Provider");
  return ctx;
};

const InstructionStepMarker = ({ done, stepNumber }: { done: boolean; stepNumber: number }) => (
  <span className="recipe--instructions-number">
    {done ? <Check size={16} strokeWidth={3}/> : stepNumber}
  </span>
);

const InstructionRow = ({ text, itemKey, stepNumber }: { text: string; itemKey: string; stepNumber: number }) => {
  const [done, toggle] = useIsDone(itemKey);
  return (
    <DoneListItem done={done} onToggle={toggle}>
      <InstructionStepMarker done={done} stepNumber={stepNumber}/>
      <StrikeText active={done}>{text}</StrikeText>
    </DoneListItem>
  );
};

const InstructionSectionsSectionedContent = () => {
  const { instructions } = useRecipeContext();
  const resolveInstructionText = useResolveInstructionText();
  if (!isInstructionSections(instructions)) return null;

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
            <InstructionRow key={idx}
                            text={resolveInstructionText(i)}
                            itemKey={`${sIdx}-${idx}`}
                            stepNumber={stepCount}/>
          );
        })}
      </ol>
    </div>
  ));
}

const InstructionSectionsSimpleContent = () => {
  const { instructions } = useRecipeContext();
  const resolveInstructionText = useResolveInstructionText();
  if (isInstructionSections(instructions)) return null;

  return (
    <ol className="recipe--instructions-list">
      {instructions.map((i, idx) => (
        <InstructionRow key={idx}
                        text={resolveInstructionText(i)}
                        itemKey={`${idx}`}
                        stepNumber={idx + 1}/>
      ))}
    </ol>
  );
}

const InstructionSection = () => {
  const recipe = useRecipeContext();
  const [selectedAlternatives, setSelectedAlternatives] = React.useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    recipe.instructionAlternatives?.forEach((alt) => {
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
      <ResolveInstructionTextContext.Provider value={resolveInstructionText}>
        <DoneItemsProvider>
          {isInstructionSections(recipe.instructions)
            ? <InstructionSectionsSectionedContent/>
            : <InstructionSectionsSimpleContent/>
          }
        </DoneItemsProvider>
      </ResolveInstructionTextContext.Provider>
    </div>
  );
}

// Page -----------------------------------------------------------------------

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
