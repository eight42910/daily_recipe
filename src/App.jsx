/**
|--------------------------------------------------
| レイアウトファイル
|--------------------------------------------------
*/

import { Link, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { NewRecipePage } from "./pages/NewRecipePage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
export default function App() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">レシピノート</h1>
        <nav className="flex gap-3 text-blue-600">
          <Link to="/">一覧</Link>
          <Link
            to="/recipes/new"
            className="px-3 py-1 border border-blue-200 rounded hover:bg-blue-50"
          >
            新規追加
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/new" element={<NewRecipePage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
    </div>
  );
}
