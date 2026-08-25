import React from "react";
import { DoneItemsContext } from "../../context/DoneItemsContext.tsx";

const DoneItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doneItems, setDoneItems] = React.useState<Set<string>>(new Set());
  const toggleItem = (key: string) => {
    setDoneItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <DoneItemsContext.Provider value={{ doneItems, toggleItem }}>
      {children}
    </DoneItemsContext.Provider>
  );
};

export default DoneItemsProvider;
