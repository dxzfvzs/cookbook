import React from "react";

const DoneListItem: React.FC<{ done: boolean; onToggle: () => void; children: React.ReactNode }> = ({
  done,
  onToggle,
  children
}) => (
  <li className={done ? "is-done" : undefined} onClick={onToggle}>
    {children}
  </li>
);

export default DoneListItem;
