import React from "react";
import type { Recipe } from "../assets/data/recipes/RecipeDto.ts";

export const RecipeContext = React.createContext<Recipe | null>(null);

export const useRecipeContext = (): Recipe => {
  const ctx = React.useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipeContext must be used within a RecipeContext.Provider");
  return ctx;
};
