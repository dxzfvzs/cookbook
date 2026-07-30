import React, { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <main>
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
