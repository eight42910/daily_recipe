import { useEffect, useMemo, useState } from "react";
import { RecipeForm } from "./components/RecipeForm";
import { RecipeList } from "./components/RecipeList";
import { filterRecipes, sortRecipes } from "./features/recipes/logic";
import { useDebouncedValue } from "./features/recipes/hook";
import { SearchFilters } from "./components/SearchFilters";
import { localRecipes, saveRecipes } from "./features/recipes/storage";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState(() => localRecipes());

  //保存トリガー
  useEffect(() => {
    saveRecipes(recipes);
  }, [recipes]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(); //undefinedならフィルタなし
  const [status, setStatus] = useState();
  const [sort, setSort] = useState("created-desc");

  const q = useDebouncedValue(query, 300);

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

  const filtered = useMemo(
    () => filterRecipes(recipes, q, category, status),
    [recipes, q, category, status]
  );
  const visible = useMemo(() => sortRecipes(filtered, sort), [filtered, sort]);
  return (
    <div>
      <div>
        <header>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            レシピノート
          </h1>
        </header>
        <section>
          <SearchFilters
            query={query}
            category={category}
            status={status}
            sort={sort}
            onQueryChange={setQuery}
            onCategoryChange={setCategory}
            onStatusChange={setStatus}
            onSortChange={setSort}
          />
          <RecipeForm onAdd={handleAdd} />
          <RecipeList recipes={visible} onDelete={handleDelete} />
        </section>
      </div>
    </div>
  );
}

export default App;
