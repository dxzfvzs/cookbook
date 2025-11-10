import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Layout from "./Layout.tsx";
import Main from "./pages/Main.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Main/>}/>

          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
