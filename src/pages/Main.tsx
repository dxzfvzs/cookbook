import Sidenav from "../components/ui/sidenav/Sidenav.tsx";
import { useState } from "react";
import RecipePreviewCard from "../components/recipe-preview/RecipePreview.tsx";

export default function Main() {
  const [selectedLetter, setSelectedLetter] = useState<string>('')

  return (
    <div className="main-content">
      <div className="side-by-side">
        <Sidenav selectedLetter={selectedLetter} onSelectLetter={setSelectedLetter}/>
        <RecipePreviewCard/>
      </div>
    </div>
  )
}
