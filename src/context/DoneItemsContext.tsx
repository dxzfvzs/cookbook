import React from "react";

export type DoneItemsContextValue = {
  doneItems: Set<string>;
  toggleItem: (key: string) => void;
};

export const DoneItemsContext = React.createContext<DoneItemsContextValue | null>(null);

export const useIsDone = (key: string): [boolean, () => void] => {
  const ctx = React.useContext(DoneItemsContext);
  if (!ctx) throw new Error("useIsDone must be used within a DoneItemsProvider");
  return [ctx.doneItems.has(key), () => ctx.toggleItem(key)];
};
