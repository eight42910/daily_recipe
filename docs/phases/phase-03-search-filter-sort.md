# Phase 3: 検索・フィルタ・ソート・ステータス変更

## 🎯 このフェーズで達成すること

- キーワード検索、カテゴリ/ステータスのフィルタ、作成日・所要時間のソートを実装します
- ステータス（作った/作りたい）を変更できる UI を追加します

### 学習目標

- ✅ `filter` / `some` / `includes` / `sort` を組み合わせた配列処理
- ✅ `useMemo` による派生データのメモ化
- ✅ デバウンス（`useDebouncedValue`）の導入で入力体験を改善
- ✅ ロジックの分離（`logic.js`）

---

## 🔧 ロジック分離

`src/features/recipes/logic.js`（新規）：

```js
export function filterRecipes(recipes, query, category, status) {
  const q = (query || "").trim().toLowerCase();
  return recipes.filter((r) => {
    const textOk =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.ingredients || []).some((i) => (i || "").toLowerCase().includes(q)) ||
      (r.notes ?? "").toLowerCase().includes(q);
    const catOk = !category || r.category === category;
    const stOk = !status || r.status === status;
    return textOk && catOk && stOk;
  });
}

export function sortRecipes(recipes, sort) {
  const arr = [...recipes];
  const cmp = {
    "created-desc": (a, b) => b.createdAt - a.createdAt,
    "created-asc": (a, b) => a.createdAt - b.createdAt,
    "time-asc": (a, b) => (a.cookTime ?? 9_999) - (b.cookTime ?? 9_999),
    "time-desc": (a, b) => (b.cookTime ?? -1) - (a.cookTime ?? -1),
  };
  return arr.sort(cmp[sort]);
}
```

---

## 🪄 デバウンスフック

`src/features/recipes/hooks.js`（新規）：

```js
import { useEffect, useState } from "react";

export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

---

## 🧩 UI 側の組み込み

```jsx
// App.jsx（抜粋）
import { useMemo, useState } from "react";
import { filterRecipes, sortRecipes } from "./features/recipes/logic";
import { useDebouncedValue } from "./features/recipes/hooks";

const [query, setQuery] = useState("");
const [category, setCategory] = useState(undefined);
const [status, setStatus] = useState(undefined);
const [sort, setSort] = useState("created-desc");

const q = useDebouncedValue(query, 300);

const filtered = useMemo(
  () => filterRecipes(recipes, q, category, status),
  [recipes, q, category, status]
);
const visible = useMemo(() => sortRecipes(filtered, sort), [filtered, sort]);
```

検索入力やセレクト変更に応じて state を更新し、`visible` を `RecipeList` に渡します。

---

## ✅ 完了チェック

- [ ] 検索テキスト、カテゴリ、ステータス、ソートが同時に効く
- [ ] 入力中にカクつかず、デバウンスが効く
- [ ] ステータス変更が保存され、表示に反映される

---

## 🐛 つまずきポイントとヒント

- 検索対象は `title/ingredients/notes` を小文字化して部分一致
- ソートの比較関数はユニットテストしやすいように分離
- `useMemo` の依存配列を正しく指定（不足すると表示が更新されない）

---

## 🎓 次のステップ

- Phase 4 に進み、localStorage による永続化を追加します
