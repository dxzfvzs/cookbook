import Sidenav from "../components/ui/sidenav/Sidenav.tsx";
import { useState, useEffect } from "react";
import RecipePreviewCard from "../components/recipe-preview/RecipePreview.tsx";

export default function Main() {
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  const handleSelectLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#letter-${letter}`);
    }
    setSelectedLetter(letter);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#letter-", "");
    if (hash) {
      const el = document.getElementById(`letter-${hash}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setSelectedLetter(hash);
      }
    }
  }, []);

  return (
    <div className="main-content">
      <div className="side-by-side">
        <Sidenav
          selectedLetter={selectedLetter}
          onSelectLetter={handleSelectLetter}
        />
        <RecipePreviewCard />
      </div>
    </div>
  );
}
