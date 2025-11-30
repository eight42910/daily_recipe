import { useState } from "react";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);

  const handleAdd = (input) => {
    const newRecipe = {
      ...input,
      id: crypto.randomUUID(),
    };
    setRecipes((prev) => [newRecipe, ...prev]); //新規を先頭に
  };

  const handleDelete = (id) => {
    if (window.confirm("このレシピを削除しますか？")) {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    }
  };
  return;
}

export default App;
