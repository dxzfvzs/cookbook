import type { Recipe } from "./RecipeDto.ts";

const modules = import.meta.glob("./jsons/*.json", { eager: true });
export const initialRecipes: Recipe[] = Object.values(modules) as Recipe[];
