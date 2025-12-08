// src/pages/NewRecipePage.jsx
import { RecipeForm } from "../components/RecipeForm";

export function NewRecipePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">新しいレシピを追加</h1>
      <RecipeForm onAdd={() => {}} />
    </div>
  );
}
