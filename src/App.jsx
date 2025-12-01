import { useState } from "react";
import { RecipeForm } from "./components/RecipeForm";
import { RecipeList } from "./components/RecipeList";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);

  const handleAdd = (input) => {
    const newRecipe = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    setRecipes((prev) => [newRecipe, ...prev]);
  };

  const handleDelete = (id) => {
    if (window.confirm("このレシピを削除しますか？")) {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    }
  };
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">レシピノート</h1>
        <RecipeForm onAdd={handleAdd} />
        <RecipeList recipes={recipes} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default App;
