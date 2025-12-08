import { useParams } from "react-router-dom";
import { localRecipes } from "../features/recipes/storage";

export function RecipeDetailPage() {
  const { id } = useParams();

  const recipes = localRecipes();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) return <div>レシピが見つかりませんでした</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>
    </div>
  );
}
