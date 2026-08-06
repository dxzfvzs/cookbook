import type { Recipe, RecipeData } from "./RecipeDto.ts";

const modules = import.meta.glob("./jsons/*.json", { eager: true }) as Record<string, RecipeData>;
export const initialRecipes: Recipe[] = Object.entries(modules).map(([path, data]) => ({
  ...data,
  fileName: path.match(/([^/]+)\.json$/)![1],
}));
