import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from "./Layout.tsx";
import AllRecipes from "./pages/AllRecipes.tsx";
import RecipePage from "./pages/RecipePage.tsx";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<AllRecipes/>}/>
          <Route path="/recipe/:id" element={<RecipePage/>}/>

          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
