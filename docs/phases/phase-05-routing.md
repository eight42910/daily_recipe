# Phase 5: ルーティングと URL 同期

## 🎯 このフェーズで達成すること

- React Router v6 を用いてページ分割（一覧/新規/詳細）を実装します
- 検索条件をクエリパラメータと同期し、URL 共有で同じ状態を再現します

### 学習目標

- ✅ React Router v6（`Routes/Route/useParams/useSearchParams`）の基本
- ✅ 検索条件と URL の双方向同期
- ✅ 戻る/進む操作と状態の整合性

---

## 🛣️ ルーティング構成

- `/` : 一覧 + 検索/フィルタ/ソート UI
- `/recipes/new` : 新規作成フォーム
- `/recipes/:id` : 詳細表示

`src/main.jsx`（抜粋）：

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { NewRecipePage } from "./pages/NewRecipePage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/new" element={<NewRecipePage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 🔍 詳細ページの取得

`/recipes/:id` では `useParams` で `id` を取得し、存在しなければ 404 UI を表示するか `/` にリダイレクトします。

```jsx
// RecipeDetailPage.jsx（イメージ）
const { id } = useParams();
const recipe = recipes.find((r) => r.id === id);
if (!recipe) return <NotFound />; // または navigate('/')
```

---

## 🔗 検索条件と URL の同期

`useSearchParams` を用い、state とクエリを相互に変換します。

```jsx
// HomePage.jsx（抜粋）
const [searchParams, setSearchParams] = useSearchParams();

const [filters, setFilters] = useState(() => paramsToState(searchParams));

useEffect(() => {
  setFilters(paramsToState(searchParams));
}, [searchParams]);

const handleChange = (next) => {
  setFilters(next);
  setSearchParams(stateToParams(next));
};
```

ユーティリティ（例）：

```js
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
  if (s.cat) p.set("cat", s.cat);
  if (s.st) p.set("st", s.st);
  if (s.sort && s.sort !== "created-desc") p.set("sort", s.sort);
  return p;
}
```

---

## ✅ 完了チェック

- [ ] URL を共有しても同じ検索/フィルタ/ソート状態が再現できる
- [ ] 存在しない ID の詳細ページにアクセスした場合のハンドリングがある
- [ ] 戻る/進むで状態が正しく復元される

---

## 🐛 つまずきポイントとヒント

- クエリ更新時は不要なキーを削除し、URL を簡潔に保つ
- 日本語の検索文字列は自動でエンコード/デコードされるが、意図通りか確認する

---

## 🎓 次のステップ

- Phase 6 に進み、リファクタリングとテストを実装します
