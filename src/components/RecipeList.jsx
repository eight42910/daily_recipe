import { RecipeItem } from "./RecipeItem";

export function RecipeList({ recipes, onDelete }) {
  if (recipes.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500">まだレシピが登録されていません</p>
        <p className="text-sm text-gray-400 mt-2">
          上のフォームから最初のレシピを追加してみましょう
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        レシピ一覧 ({recipes.length}件)
      </h2>
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} onDelete={onDelete} />
      ))}
    </div>
  );
}
