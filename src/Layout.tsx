import React, { type ReactNode } from 'react';
import Header from "./components/ui/header/Header.tsx";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header/>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
