import { categoryById, type CategoryId } from "../assets/data/categories.ts";

export function categoryMatchesTerm(categoryId: CategoryId, term: string): boolean {
  const category = categoryById[categoryId];
  const names = [category.label.toLowerCase(), ...(category.keywords ?? [])];
  return names.some((name) => name.includes(term) || term.includes(name));
}
