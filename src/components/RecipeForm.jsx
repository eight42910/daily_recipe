import { useState } from "react";
import { validateRecipe } from "../features/recipes/validation";

export function RecipeForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("main");
  const [status, setStatus] = useState("want");
  const [ingredientsText, setInGredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = {
      title,
      category,
      status,
      ingredients: ingredientsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      steps: stepsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      cookTime: cookTime === "" ? null : Number(cookTime),
      servings: servings === "" ? null : Number(servings),
      sourceUrl: sourceUrl || undefined,
      notes: notes || undefined,
    };

    const result = validateRecipe(input);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onAdd(input);

    //入力のリセット
    setTitle("");
    setCategory("main");
    setStatus("want");
    setInGredientsText("");
    setStepsText("");
    setCookTime("");
    setServings("");
    setSourceUrl("");
    setNotes("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">新しいレシピを追加</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            レシピ名
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: カレーライス"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="main">主菜</option>
            <option value="side">副菜</option>
            <option value="soup">汁物</option>
            <option value="noodle">麺類</option>
            <option value="don">丼物</option>
            <option value="dessert">デザート</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ステータス
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="want">作りたい</option>
            <option value="cooked">作った</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="cookTime"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            調理時間（分）
          </label>
          <input
            id="cookTime"
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            placeholder="例: 30"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cookTime && (
            <p className="mt-1 text-sm text-red-600">{errors.cookTime}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="sourceUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            参考URL
          </label>
          <input
            id="sourceUrl"
            type="text"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="例: https://example.com/recipe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.sourceUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.sourceUrl}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          レシピを追加
        </button>
      </div>
    </form>
  );
}
