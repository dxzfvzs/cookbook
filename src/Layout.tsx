import React, { type ReactNode, useMemo } from 'react';
import { useMatch } from 'react-router-dom';
import { initialRecipes } from './assets/data/recipes/init.ts';
import RecipeNav from './components/recipe-nav/RecipeNav.tsx';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const recipeMatch = useMatch('/recipe/:id');

  const sortedRecipes = useMemo(
    () => [...initialRecipes].sort((a, b) => a.title.localeCompare(b.title)),
    []
  );

  const recipeIndex = recipeMatch
    ? sortedRecipes.findIndex((r) => r.fileName === recipeMatch.params.id)
    : -1;
  const prevRecipe = recipeIndex > 0 ? sortedRecipes[recipeIndex - 1] : undefined;
  const nextRecipe =
    recipeIndex !== -1 && recipeIndex < sortedRecipes.length - 1
      ? sortedRecipes[recipeIndex + 1]
      : undefined;

  return (
    <div className="app-layout">
      <main>
        <div className={`main-scroll${recipeMatch ? ' main-scroll--recipe' : ''}`}>
          {recipeMatch && <RecipeNav prevRecipe={prevRecipe} nextRecipe={nextRecipe} />}
          <div className={`main-content shadow${recipeMatch ? ' main-content--recipe' : ''}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
