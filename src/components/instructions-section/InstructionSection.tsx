import React from "react";
import { Check } from "lucide-react";
import {
  getAlternativeKey,
  type InstructionAlternatives,
  isInstructionSections
} from "../../assets/data/recipes/RecipeDto.ts";
import { useRecipeContext } from "../../context/RecipeContext.tsx";
import { useIsDone } from "../../context/DoneItemsContext.tsx";
import DoneListItem from "../done-item-tracking/DoneListItem.tsx";
import DoneItemsProvider from "../done-item-tracking/DoneItemsProvider.tsx";
import StrikeText from "../strike-text/StrikeText.tsx";
import "./instruction-section.css";

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
            <InstructionRow key={idx} text={resolveInstructionText(i)} itemKey={`${sIdx}-${idx}`}
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
        <InstructionRow key={idx} text={resolveInstructionText(i)} itemKey={`${idx}`} stepNumber={idx + 1}/>
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

export default InstructionSection;
