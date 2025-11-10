import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Layout from "./Layout.tsx";
import Main from "./pages/Main.tsx";
import RecipePage from "./pages/RecipePage.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/recipe/:id" element={<RecipePage />} />

          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
