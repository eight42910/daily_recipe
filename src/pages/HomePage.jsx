/**
|--------------------------------------------------
| 実働部
|--------------------------------------------------
*/

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchFilters } from "../components/SearchFilters";
import { RecipeForm } from "../components/RecipeForm";
import { RecipeList } from "../components/RecipeList";
import { filterRecipes, sortRecipes } from "../features/recipes/logic";
import { useDebouncedValue } from "../features/recipes/hook";
import { localRecipes, saveRecipes } from "../features/recipes/storage";

function paramsToState(p) {
  return {
    q: p.get("q") ?? "",
    cat: p.get("cat") || undefined,
    st: p.get("st") || undefined,
    sort: p.get("sort") || "created-desc",
  };
}

function stateToParams(s) {
  const p = new URLSearchParams();
  if (s.q) p.set("q", s.q);
  if (s.category) p.set("cat", s.category);
  if (s.status) p.set("st", s.status);
  if (s.sort && s.sort !== "created-desc") p.set("sort", s.sort);
  return p;
}

export function HomePage() {
  //初回だけ実行
  const [recipes, setRecipes] = useState(() => localRecipes());
  useEffect(() => saveRecipes(recipes), [recipes]); //recipesが変わるたびに、localStorageに保存
  //URLクエリと状態をあわせて、検索条件付きのURL共有、リロード復元を可能にする
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(() => paramsToState(params)); //URLクエリが変わるたびに、filtersをURLに合わせる
  useEffect(() => setFilters(paramsToState(params)), [params]);

  const q = useDebouncedValue(filters.q, 300); //q入力が変わるたびに、300ms後に確定値を更新

  //イベントハンドラ
  const handleAdd = (input) => {
    const newRecipe = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setRecipes((prev) => [newRecipe, ...prev]); //prevの先頭に親要素を挿入（新しい配列を返す）
  };
  const handleDelete = (id) => {
    if (window.confirm("このレシピを削除しますか？")) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleFilterChange = (next) => {
    setFilters(next);
    setParams(stateToParams(next));
  };
  //派生データ計算
  const filtered = useMemo(
    () => filterRecipes(recipes, q, filters.category, filters.status),
    [recipes, q, filters]
  );
  const visible = useMemo(
    () => sortRecipes(filtered, filters.sort),
    [filtered, filters.sort]
  );

  return (
    <div>
      <SearchFilters
        query={filters.q}
        category={filters.category}
        status={filters.status}
        sort={filters.sort}
        onQueryChange={(q) => handleFilterChange({ ...filters, q })}
        onCategoryChange={(category) =>
          handleFilterChange({ ...filters, category })
        }
        onStatusChange={(status) => handleFilterChange({ ...filters, status })}
        onSortChange={(sort) => handleFilterChange({ ...filters, sort })}
      />
      <RecipeForm onAdd={handleAdd} />
      <RecipeList recipes={visible} onDelete={handleDelete} />
    </div>
  );
}
