import "./search-bar.css";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

export default function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-bar--icon" />
      <input
        type="text"
        placeholder="Search ingredients (e.g. tomato, basil, rice)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar--input"
      />
    </div>
  )
}
