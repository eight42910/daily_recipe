# Phase 6: リファクタリングとテスト

## 🎯 このフェーズで達成すること

- useReducer + Context で状態を集約し、UI とロジックの責務を明確化します
- ロジックに対してユニットテストを用意します（validation/filter/sort/reducer）

### 学習目標

- ✅ グローバル状態の設計と分配（Context）
- ✅ カスタムフックを介した責務分離（`useRecipes`, `useRecipeFilter`）
- ✅ Vitest + Testing Library によるテストの導入

---

## 🧱 Context + Reducer

`src/features/recipes/context.jsx`（新規）：

```jsx
import { createContext, useContext, useMemo, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { ...state, recipes: [action.payload, ...state.recipes] };
    case "update":
      return {
        ...state,
        recipes: state.recipes.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case "delete":
      return {
        ...state,
        recipes: state.recipes.filter((r) => r.id !== action.payload),
      };
    case "setFilters":
      return { ...state, filters: action.payload };
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function RecipeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    recipes: [],
    filters: { q: "", sort: "created-desc" },
  });

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRecipesContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("RecipeProvider 配下で使用してください");
  return ctx;
}
```

---

## 🪝 カスタムフック

`src/features/recipes/hooks.js` を拡張：

```js
import { useMemo } from "react";
import { useRecipesContext } from "./context";
import { filterRecipes, sortRecipes } from "./logic";

export function useRecipeFilter() {
  const { state } = useRecipesContext();
  const { recipes, filters } = state;
  const filtered = useMemo(
    () => filterRecipes(recipes, filters.q, filters.cat, filters.st),
    [recipes, filters]
  );
  const visible = useMemo(
    () => sortRecipes(filtered, filters.sort),
    [filtered, filters.sort]
  );
  return { visible };
}
```

---

## 🧪 テスト

`vitest` を導入し、ロジックに対するユニットテストを作成します。

### セットアップ

```bash
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

`vite.config.js` に以下を追加：

```js
// @ts-check
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});
```

### サンプルテスト

`src/tests/logic.test.js`（新規）：

```js
import { describe, it, expect } from "vitest";
import { filterRecipes, sortRecipes } from "../features/recipes/logic";

describe("filterRecipes", () => {
  it("タイトル/材料/メモで部分一致検索できる", () => {
    const data = [
      {
        title: "カレー",
        ingredients: ["たまねぎ"],
        notes: "スパイシー",
        createdAt: 1,
      },
      {
        title: "シチュー",
        ingredients: ["じゃがいも"],
        notes: "",
        createdAt: 2,
      },
    ];
    const result = filterRecipes(data, "たま");
    expect(result).toHaveLength(1);
  });
});

describe("sortRecipes", () => {
  it("作成日降順で並ぶ", () => {
    const data = [
      { title: "A", createdAt: 1 },
      { title: "B", createdAt: 3 },
      { title: "C", createdAt: 2 },
    ];
    const result = sortRecipes(data, "created-desc");
    expect(result.map((r) => r.title)).toEqual(["B", "C", "A"]);
  });
});
```

---

## ✅ 完了チェック

- [ ] コンテキスト経由で状態を取得でき、主要な操作（追加/更新/削除/フィルタ設定）が行える
- [ ] `logic.js` と `validation.js` の純粋関数にユニットテストがある
- [ ] 主要ユースケースが壊れていない（目視確認）

---

## 📌 ヒント

- Reducer の Action 種類を固定の文字列に揃えてバグを防ぐ
- Provider の `value` は `useMemo` で包み、再レンダーを抑制
- テストデータはフィクスチャ関数やヘルパーで共通化すると読みやすくなる
