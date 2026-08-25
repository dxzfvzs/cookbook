import React from "react";
import { isIngredientSections } from "../../assets/data/recipes/RecipeDto.ts";
import { useRecipeContext } from "../../context/RecipeContext.tsx";
import { useIsDone } from "../../context/DoneItemsContext.tsx";
import DoneListItem from "../done-item-tracking/DoneListItem.tsx";
import DoneItemsProvider from "../done-item-tracking/DoneItemsProvider.tsx";
import StrikeText from "../strike-text/StrikeText.tsx";
import "./ingredients-section.css";

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

export default IngredientsSection;
