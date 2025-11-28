# Phase 2: 詳細情報と入力バリデーション

## 🎯 このフェーズで達成すること

詳細フィールド（材料・手順・所要時間・人数・参考 URL・メモ）を追加し、入力バリデーションを実装します。UI とバリデーションの責務を分離します。

### 学習目標

- ✅ フォーム項目を増やした上での Controlled Components 設計
- ✅ バリデーションを純粋関数として分離し、テストしやすくする
- ✅ エラーメッセージの表示方法とアクセシビリティ（`role="alert"`）

---

## 🧩 型の拡張

（JS 版では型ファイルは不要です。参考のデータ形状だけ共有します）

```
// Recipe（保存形）
{
  id: 'uuid',
  title: '文字列',
  category: 'main' | 'side' | 'soup' | 'noodle' | 'don' | 'dessert',
  status: 'cooked' | 'want',
  ingredients: string[],
  steps: string[],
  cookTime: number|null,
  servings: number|null,
  sourceUrl?: string,
  notes?: string,
  createdAt: number,
}

// RecipeInput（入力形）: 上記から id と createdAt を除いた形
```

---

## ✅ バリデーション設計

`src/features/recipes/validation.js`（新規）：

```js
export function validateRecipe(input) {
  const errors = {};

  const t = (input.title || "").trim();
  if (!t) errors.title = "タイトルは必須です";
  if (t.length > 100) errors.title = "100文字以内で入力してください";

  if (input.cookTime != null) {
    if (!Number.isFinite(Number(input.cookTime)))
      errors.cookTime = "数値で入力してください";
    else if (input.cookTime < 0 || input.cookTime > 600)
      errors.cookTime = "0〜600分で入力してください";
  }

  if (input.servings != null) {
    if (!Number.isFinite(Number(input.servings)))
      errors.servings = "数値で入力してください";
    else if (input.servings < 1 || input.servings > 10)
      errors.servings = "1〜10人で入力してください";
  }

  if (input.sourceUrl && !/^https?:\/\//.test(input.sourceUrl)) {
    errors.sourceUrl = "URL形式で入力してください";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
```

---

## 📝 フォーム実装（拡張）

Phase 1 の `RecipeForm` を拡張し、以下を追加します：

- 材料（改行区切り → `ingredients: string[]`）
- 手順（改行区切り → `steps: string[]`）
- 所要時間（分）
- 人数
- 参考 URL
- メモ

主要部分の例：

```jsx
// RecipeForm.jsx（抜粋）
import { useState } from 'react';
import { validateRecipe } from '../features/recipes/validation';

export function RecipeForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState('main');
  const [status, setStatus] = useState('want');
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [sourceUrl, setSourceUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
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
      cookTime: cookTime === '' ? null : Number(cookTime),
      servings: servings === '' ? null : Number(servings),
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
    // 入力リセット
    setTitle("");
    setCategory("main");
    setStatus("want");
    setIngredientsText("");
    setStepsText("");
    setCookTime("");
    setServings("");
    setSourceUrl("");
    setNotes("");
  };

  // それぞれのフィールドの下にエラーを表示（role="alert"）
  // ... UI コードは省略（既存の Tailwind スタイルを踏襲）
}
```

---

## 🔗 App 側の受け取り（createdAt 付与）

```jsx
// App.jsx（抜粋）
const handleAdd = (input) => {
  const newRecipe = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  setRecipes((prev) => [newRecipe, ...prev]);
};
```

---

## ✅ 完了チェック

- [ ] バリデーション NG の場合、保存されず、エラーが各フィールドに表示される
- [ ] 詳細フィールド（材料・手順・所要時間・人数・URL・メモ）が保存され、一覧または詳細表示で確認できる
- [ ] 入力形（RecipeInput）と保存形（Recipe）が想定どおりの形で扱われている

---

## 🐛 つまずきポイントとヒント

- フィールドが増えたフォームでは、入力状態とエラー状態を分けて管理すると整理しやすい
- 改行区切りの配列化は、空行を `filter(Boolean)` で除去
- URL は `http/https` で始まるかを簡易チェック（正規表現）

---

## 🎓 次のステップ

- Phase 3 に進み、検索・フィルタ・ソート・ステータス変更を実装します
