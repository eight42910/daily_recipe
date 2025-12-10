/**
|--------------------------------------------------
| レイアウトファイル
|--------------------------------------------------
*/
import { useState, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { NewRecipePage } from "./pages/NewRecipePage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { localRecipes, saveRecipes } from "./features/recipes/storage";

export default function App() {
  //レシピデータ
  const [recipes, setRecipes] = useState(() => localRecipes());
  const navigate = useNavigate(); //ページ移動

  //レシピが変わるたびに保存
  useEffect(() => saveRecipes(recipes), [recipes]);

  //追加機能
  const addRecipe = (newRecipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
    navigate("/"); //呼んでトップに戻る
  };

  //削除機能
  const deleteRecipe = (id) => {
    //メソッド（ダイアログ）
    if (window.confirm("このレシピを削除しますか？")) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      navigate("/");
    }
  };

  return (
    <div className="max-w-5xl max-auto px-6 py-4">
      <header className="mb-8 border-b pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            <Link to="/">レシピノート</Link>
          </h1>
          <Link
            to="/recipes/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition font-bold shadow-md"
          >
            +　レシピ追加
          </Link>
        </div>
      </header>
      <Routes>
        <Route
          path="/"
          element={<HomePage recipes={recipes} onDelete={deleteRecipe} />}
        />
        <Route
          path="/recipes/new"
          element={<NewRecipePage onAdd={addRecipe} />}
        />
        <Route
          path="/recipes/:id"
          element={
            <RecipeDetailPage recipes={recipes} onDelete={deleteRecipe} />
          }
        />
      </Routes>
    </div>
  );
}
