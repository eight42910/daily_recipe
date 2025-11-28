# Phase 4: データ永続化（localStorage）

## 🎯 このフェーズで達成すること

- ブラウザを閉じてもデータが保持されるように `localStorage` を使って永続化します
- 余力があれば JSON のエクスポート/インポートも実装します

### 学習目標

- ✅ `useEffect` による初期ロードと保存トリガー
- ✅ ストレージ操作の責務分離（`storage.js`）
- ✅ JSON シリアライズ/デシリアライズの基礎

---

## 💾 ストレージラッパ

`src/features/recipes/storage.js`（新規）：

```js
const KEY = "recipes";

export function loadRecipes() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data;
  } catch (e) {
    console.warn("Failed to load recipes:", e);
    return [];
  }
}

export function saveRecipes(recipes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(recipes));
  } catch (e) {
    console.warn("Failed to save recipes:", e);
  }
}
```

---

## 🔗 App/Provider への組み込み

```jsx
// App.jsx（抜粋）
import { useEffect, useState } from "react";
import { loadRecipes, saveRecipes } from "./features/recipes/storage";

useEffect(() => {
  setRecipes(loadRecipes());
}, []);

useEffect(() => {
  saveRecipes(recipes);
}, [recipes]);
```

---

## ✅ 完了チェック

- [ ] リロードしてもレシピがそのまま表示される
- [ ] localStorage の中身が JSON で保存されている（ブラウザの DevTools で確認）
- [ ] 不正なデータが入ってもアプリが落ちない

---

## 🧪 発展（任意）: エクスポート/インポート

- エクスポート: `JSON.stringify(recipes)` を Blob としてダウンロード
- インポート: ファイル入力 → `FileReader` → JSON → バリデーションしてからマージ or 上書き

---

## 🎓 次のステップ

- Phase 5 に進み、ルーティングと URL 同期を実装します
