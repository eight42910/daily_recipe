# Phase 1: 最小機能（登録・一覧・削除）

## 🎯 このフェーズで達成すること

React の基礎を学びながら、レシピを**追加・一覧表示・削除**できる最小限のアプリを作ります。

### 学習目標

## 📋 前提条件

以下が完了していることを確認してください：

- ✅ Node.js（v18 以上）がインストール済み
- ✅ エディタ（VS Code 推奨）がセットアップ済み
- ✅ ターミナルの基本操作（cd, ls など）を理解している

---

## 🏗️ プロジェクトセットアップ

### Step 1: Vite プロジェクトの作成

````bash
# ディレクトリに移動

# 依存関係をインストール
**💡 解説:**
- `react-ts` テンプレートは React + TypeScript の構成です

### Step 2: Tailwind CSS の導入

```bash
# Tailwind CSS とその依存関係をインストール
npm install -D tailwindcss postcss autoprefixer

# Tailwind の設定ファイルを生成
npx tailwindcss init -p
````

`tailwind.config.js` を以下のように編集：

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

`src/index.css` を以下に置き換え：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**💡 解説:**

- Tailwind CSS は utility-first な CSS フレームワークで、クラス名でスタイルを指定します
- `content` 配列で指定したファイル内の Tailwind クラスのみが最終的な CSS に含まれます

### Step 3: プロジェクト構造の準備

不要なファイルを削除し、以下の構造を作成します：

```
src/
├── App.jsx              # メインコンポーネント
├── main.jsx            # エントリーポイント
├── index.css           # グローバルスタイル
└── components/         # コンポーネント用ディレクトリ（後で作成）
```

```bash
# 不要なファイルを削除
rm src/App.css src/assets/react.svg public/vite.svg

# components ディレクトリを作成
mkdir src/components

---

## 🧩 設計の全体像

### データフロー図

```

App (状態を持つ親コンポーネント)
├─ recipes: Recipe[] ← useState で管理
├─ handleAdd(recipe) ← 追加ハンドラ
└─ handleDelete(id) ← 削除ハンドラ
│
├─→ RecipeForm ← フォームコンポーネント
│ └─ onAdd を受け取って新規レシピを App に渡す
│
└─→ RecipeList ← 一覧表示コンポーネント
└─→ RecipeItem ← 1 件のレシピを表示
└─ onDelete を受け取って削除を App に通知

````


最初は最小限の項目だけで構成します：

```
// 参考（JSでは型ファイル不要。データ形状の例）
{
  id: 'string',
  title: 'string',
  category: 'main' | 'side' | 'soup' | 'noodle' | 'don' | 'dessert',
  status: 'cooked' | 'want',
}
````

**💡 ポイント:**

- `id` は各レシピを識別するためのユニークな値
- `category` と `status` は決まった値のみを許可（Union Types）

---

## 📝 実装手順

### Step 1: 参考データ形状の確認（型ファイルは不要）

JS プロジェクトのため、型ファイルは作りません。上の参考形状を念頭に置き、必要項目だけから始めます。

### Step 2: App コンポーネントの実装

`src/App.jsx`:

```jsx
import { useState } from "react";

function App() {
  // レシピの配列を状態として管理
  const [recipes, setRecipes] = useState([]);

  // レシピ追加ハンドラ
  const handleAdd = (input) => {
    const newRecipe = {
      ...input,
      id: crypto.randomUUID(),
    };
    // 新しいレシピを配列の先頭に追加
    setRecipes((prev) => [newRecipe, ...prev]);
  };

  // レシピ削除ハンドラ
  const handleDelete = (id) => {
    if (window.confirm("このレシピを削除しますか？")) {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">レシピノート</h1>

        {/* ここに RecipeForm と RecipeList を配置 */}
        <p className="text-gray-600">コンポーネントを追加していきます</p>
      </div>
    </div>
  );
}

export default App;
```

**💡 重要なポイント:**

- `useState<Recipe[]>([])` で空の配列を初期値として設定
- `setRecipes(prev => [...])` の形で、前の状態を元に新しい状態を生成
- `crypto.randomUUID()` はブラウザ標準の UUID 生成関数

**🔍 動作確認:**

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開き、「レシピノート」が表示されることを確認

### Step 3: RecipeForm コンポーネントの作成

`src/components/RecipeForm.jsx`:

```jsx
import { useState } from 'react';

export function RecipeForm({ onAdd }) {
  // フォームの各項目を個別の state で管理
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('main');
  const [status, setStatus] = useState('want');

  // フォーム送信ハンドラ
  const handleSubmit = (e) => {
    e.preventDefault(); // ページリロードを防ぐ
    // タイトルが空なら何もしない
    if (!title.trim()) {
      alert("レシピ名を入力してください");
      return;
    }
    onAdd({ title, category, status });
    setTitle('');
    setCategory('main');
    setStatus('want');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">新しいレシピを追加</h2>

      <div className="space-y-4">
        {/* レシピ名入力 */}
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
        </div>

        {/* カテゴリ選択 */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          レシピを追加
        </button>
```

**💡 重要な概念:**

- `e.preventDefault()` でフォーム送信時のページリロードを防止
  **🎨 Tailwind クラスの意味:**

`src/components/RecipeList.jsx`:

```jsx
import { RecipeItem } from "./RecipeItem";

export function RecipeList({ recipes, onDelete }) {
  // レシピが0件の場合
  if (recipes.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500">まだレシピが登録されていません</p>
        <p className="text-sm text-gray-400 mt-2">
          上のフォームから最初のレシピを追加してみましょう！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        レシピ一覧 ({recipes.length}件)
      </h2>
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} onDelete={onDelete} />
      ))}
    </div>
  );
}
```

`src/components/RecipeItem.jsx`:

```jsx
// カテゴリ名を日本語表示に変換
const CATEGORY_LABELS = {
  main: "主菜",
  side: "副菜",
  soup: "汁物",
  noodle: "麺類",
  don: "丼物",
  dessert: "デザート",
};

// ステータス名を日本語表示に変換
const STATUS_LABELS = {
  cooked: "作った",
  want: "作りたい",
};

// ステータスごとの色を定義
const STATUS_COLORS = {
  cooked: "bg-green-100 text-green-800",
  want: "bg-yellow-100 text-yellow-800",
};

export function RecipeItem({ recipe, onDelete }) {
  const handleDelete = () => {
    onDelete(recipe.id);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {recipe.title}
          </h3>

          <div className="flex gap-2 mt-2">
            {/* カテゴリバッジ */}
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {CATEGORY_LABELS[recipe.category]}
            </span>

            {/* ステータスバッジ */}
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                STATUS_COLORS[recipe.status]
              }`}
            >
              {STATUS_LABELS[recipe.status]}
            </span>
          </div>
        </div>

        {/* 削除ボタン */}
        <button
          onClick={handleDelete}
          className="ml-4 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          aria-label={`${recipe.title}を削除`}
        >
          削除
        </button>
      </div>
    </div>
  );
}
```

**💡 重要なポイント:**

- `key={recipe.id}`: React が各要素を識別するために必須
- `Record<K, V>`: オブジェクトの型を厳密に定義（K がキー、V が値の型）
- `aria-label`: スクリーンリーダーなどアクセシビリティのためのラベル

### Step 5: App にコンポーネントを統合

`src/App.jsx` を更新：

```jsx
import { useState } from "react";
import { RecipeForm } from "./components/RecipeForm";
import { RecipeList } from "./components/RecipeList";

function App() {
  const [recipes, setRecipes] = useState([]);

  const handleAdd = (input) => {
    const newRecipe = {
      ...input,
      id: crypto.randomUUID(),
    };
    setRecipes((prev) => [newRecipe, ...prev]);
  };

  const handleDelete = (id) => {
    if (window.confirm("このレシピを削除しますか？")) {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">レシピノート</h1>

        <RecipeForm onAdd={handleAdd} />
        <RecipeList recipes={recipes} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default App;
```

---

## ✅ 動作確認チェックリスト

以下の項目を確認してください：

- [ ] レシピ名を入力して追加ボタンを押すと、一覧に表示される
- [ ] 新しく追加したレシピが一覧の**一番上**に表示される
- [ ] カテゴリとステータスが正しくバッジとして表示される
- [ ] 削除ボタンを押すと確認ダイアログが表示される
- [ ] 「OK」を押すとレシピが一覧から消える
- [ ] レシピ名が空のまま追加しようとするとアラートが表示される
- [ ] フォーム送信後、入力欄がクリアされる

---

## 🐛 よくあるエラーと対処法

### エラー 1: "Cannot find module"（import パス違い）

**原因:** ファイル名/拡張子が `.jsx` になっているが、import が `.tsx` などになっている

**対処法:**

```bash
# import 先の拡張子を確認
# 例）
sed -n '1,20p' src/App.jsx
```

### エラー 2: "crypto is not defined"

**原因:** 古いブラウザまたは環境で `crypto.randomUUID()` が使えない

**対処法:**

```typescript
// 代わりに Date.now() + Math.random() で簡易的な ID を生成
const newRecipe: Recipe = {
  ...input,
  id: `${Date.now()}-${Math.random()}`,
};
```

### エラー 3: セレクト値の型変換で詰まる

**原因:** TypeScript 前提のコード断片が残っている

**対処法:**

```jsx
// JSではそのまま文字列を使う
onChange={(e) => setCategory(e.target.value)}
```

---

## 📚 学習のポイント

### 1. useState の理解（JS）

```jsx
const [recipes, setRecipes] = useState([]);
```

- `recipes`: 現在の状態の値
- `setRecipes`: 状態を更新する関数
- 型指定は不要（JS）。配列として扱うだけで OK
- `[]`: 初期値（空の配列）

### 2. イミュータブルな更新

```typescript
// ❌ 間違い: 既存の配列を直接変更
recipes.push(newRecipe);
setRecipes(recipes);

// ✅ 正しい: 新しい配列を作成
setRecipes((prev) => [newRecipe, ...prev]);
```

React は状態が変わったことを「新しいオブジェクト・配列」で判断するため、必ず新しい配列を作成する必要があります。

### 3. props の受け渡し（JS）

JS では型定義なしで渡す。使う側で必要なキーがあるかを意識して作る。

### 4. コンポーネントの責務分離

- **App**: 状態管理とビジネスロジック
- **RecipeForm**: 入力フォームの表示と入力処理
- **RecipeList**: レシピ配列の反復処理
- **RecipeItem**: 1 件のレシピの表示

---

## 🎓 次のステップ

Phase 1 が完了したら、以下を確認してください：

1. ✅ コードが動作し、すべてのチェック項目を満たしている
2. ✅ 各コンポーネントの役割を説明できる
3. ✅ useState の使い方を理解している
4. ✅ props の受け渡しを理解している

準備ができたら **Phase 2（詳細情報と入力バリデーション）** に進みましょう！

---

## 💡 発展課題（余裕があれば）

- [ ] レシピ名の文字数制限を追加（例: 50 文字まで）
- [ ] 削除時に「取り消し」機能を追加
- [ ] レシピの編集機能を追加
- [ ] カテゴリごとに色を変える
- [ ] ステータスをトグルボタンで切り替えられるようにする
