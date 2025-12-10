// src/pages/NewRecipePage.jsx
import { RecipeForm } from "../components/RecipeForm";

export function NewRecipePage({ onAdd }) {
  const handleSave = (inputData) => {
    const newRecipe = {
      ...inputData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    onAdd(newRecipe);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">
        新しいレシピを追加
      </h1> */}
      <RecipeForm onAdd={handleSave} />
    </div>
  );
}
