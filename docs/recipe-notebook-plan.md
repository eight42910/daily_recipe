# Recipe Notebook 開発・学習ドキュメント

このプロジェクトを作りながら React を学ぶための実践ロードマップです。各 Phase の詳細手順・コード断片・完了チェックリストは `docs/phases/` 配下に整備しました。初学者でも設計書に沿って順番に進めれば動くところまで到達できます。
本ドキュメントは「JS ファースト（TypeScript は拡張課題）」方針です。

## 0. 全体方針

- 目的: 「自分のレシピを管理する」アプリを作りつつ、React の基礎〜状態設計〜テストまでを一通り経験する。
- 技術スタック: React 18 / JavaScript / Vite / Tailwind CSS（テスト: Vitest + Testing Library）。
- ディレクトリ指針（最終イメージ）:
  - `src/components`: UI コンポーネント
  - `src/features/recipes`: 状態・ロジック（context, hooks, logic, storage, types）
  - `src/pages`: 画面単位
  - `src/tests`: ロジックのユニットテスト
- 進め方のルール: まずは機能を小さく積み上げ、Phase ごとに「動く → 振り返る → リファクタ → チェックリスト確認」の順で進める。

## 使い方（最短ルート）

- Step 1: `docs/phases/phase-01-minimum.md` を最初から実装（フォーム/一覧/削除）
- Step 2: `docs/phases/phase-02-details-validation.md` で詳細・バリデーションを追加
- Step 3: `docs/phases/phase-03-search-filter-sort.md` で検索・フィルタ・ソート・ステータス変更
- Step 4: `docs/phases/phase-04-persistence.md` で localStorage 永続化
- Step 5: `docs/phases/phase-05-routing.md` でルーティング/URL 同期
- Step 6: `docs/phases/phase-06-refactor-testing.md` でリファクタ + テスト

各 Phase ファイルは「学習目標 / 実装手順 / サンプルコード / 完了チェック / つまずきポイント」を備えています。

## 1. Phase 1 – 最小機能（登録・一覧・削除）

- 作るもの: レシピ追加フォーム、一覧表示、削除ボタン（確認ダイアログあり）。新しいレシピは上に追加。
- 学ぶこと: useState での配列状態管理 / map・filter・sort の基本 / 親子コンポーネントへの props 受け渡し。
- 進め方:
  1. Vite + React（JS）+ Tailwind 初期セットアップ
  2. 型雛形（暫定）とダミーデータで一覧表示
  3. フォーム（title, category, status）を Controlled Components で実装
  4. 追加・削除ロジックを組み込み、UI を軽く整える
- 完了条件: 追加 → 一覧反映 → 削除が動く。コンポーネント分割（App / RecipeForm / RecipeList / RecipeItem）ができている。詳細手順は `docs/phases/phase-01-minimum.md` を参照。

## 2. Phase 2 – 詳細・入力バリデーション

- 作るもの: 詳細フィールド（ingredients, steps, cookTime, servings, sourceUrl, notes）と入力チェック。詳細はモーダル or パネルで表示。
- 学ぶこと: Controlled Components の設計 / バリデーションの分離（validation.js） / データ構造の整理。
- 進め方:
  1. Recipe 型を確定
  2. バリデーション関数を UI から分離（純粋関数）
  3. エラーメッセージをフィールド下に表示（無効なら保存しない）
  4. 詳細表示 UI（クリックでモーダル or パネル）を追加
- 完了条件: バリデーションが効き、必要項目のみ一覧に表示。詳細表示で追加フィールドが確認できる。詳細手順は `docs/phases/phase-02-details-validation.md` を参照。

## 3. Phase 3 – 検索・フィルタ・ソート・ステータス更新

- 作るもの: キーワード検索（title/ingredients/notes, 部分一致・大小無視）、カテゴリ・ステータスフィルタ、ソート（作成日/所要時間）。ステータス変更 UI。
- 学ぶこと: filter/sort/some/includes の応用 / useMemo で派生データ最適化 / デバウンス用カスタムフック useDebouncedValue。
- 進め方:
  1. レシピデータに作成日を付与
  2. useDebouncedValue を実装し、入力中のリアルタイム絞り込み
  3. filter + sort ロジックを logic.js に分離し、UI では呼び出すだけにする
  4. ステータスを変更できる UI（バッジ・アイコン表示）
- 完了条件: 検索・フィルタ・ソートが同時に効く。パフォーマンス劣化がなく、ステータス変更が反映される。詳細手順は `docs/phases/phase-03-search-filter-sort.md` を参照。

## 4. Phase 4 – データ永続化（localStorage）

- 作るもの: localStorage への保存・読み込み。余力で JSON エクスポート/インポート。
- 学ぶこと: useEffect による初期ロードと保存トリガー / storage.js での責務分離 / JSON シリアライズ・デシリアライズ。
- 進め方:
  1. storage ラッパー（loadRecipes, saveRecipes）を実装
  2. 初回ロード時に復元、一覧更新時に保存
  3. （任意）エクスポート/インポート UI とマージ・上書きの動作
- 完了条件: ブラウザを閉じてもデータが保持される。意図しないデータ破損がない。詳細手順は `docs/phases/phase-04-persistence.md` を参照。

## 5. Phase 5 – ルーティングと URL 同期

- 作るもの: ルート `/`（一覧+検索）、`/recipes/new`（新規）、`/recipes/:id`（詳細）。検索条件をクエリパラメータと同期。
- 学ぶこと: React Router v6（Routes/Route/useParams/useSearchParams） / 検索条件と URL の双方向同期 / History API の挙動理解。
- 進め方:
  1. ルーティング導入とページ分割（HomePage/NewRecipePage/RecipeDetailPage）
  2. 検索・フィルタ・ソート条件をクエリに反映・復元
  3. 戻る/進むで状態が崩れないことを確認
- 完了条件: URL 共有で同じ条件の一覧が再現できる。詳細ページ遷移が自然に動く。詳細手順は `docs/phases/phase-05-routing.md` を参照。

## 6. Phase 6 – リファクタリング & テスト

- 作るもの: useReducer + Context による状態集約、ロジックと UI の分離、ロジックのユニットテスト。
- 学ぶこと: グローバル状態の設計 / カスタムフック分割（useRecipes, useRecipeFilter, useDebouncedValue） / Vitest + Testing Library の導入とテスト設計。
- 進め方:
  1. RecipeProvider を作り、アプリ全体で共有
  2. filter/sort/validate を純粋関数として `features/recipes/logic.js` へ
  3. Vitest でロジックテスト（validation / filter / sort）。カバレッジ 70〜80% 目標
  4. テストしやすい形にリファクタ
- 完了条件: ロジック部分にテストがあり、状態管理の責務が整理されている。詳細手順は `docs/phases/phase-06-refactor-testing.md` を参照。

## 実装チェックリスト（抜粋）

- フォーム
  - [ ] label と input が htmlFor/id で紐付く
  - [ ] Enter で送信、Tab で移動
  - [ ] 無効入力時は登録不可、エラーは role="alert"
- 一覧・検索
  - [ ] 新規追加が上に表示される
  - [ ] 検索・フィルタ・ソートが組み合わせても破綻しない
  - [ ] ステータスが視覚とテキスト両方で判別できる
- データ・状態
  - [ ] localStorage 復元と保存が安定している
  - [ ] URL と検索条件が同期し、戻る/進むで状態が保持される
- テスト
  - [ ] validation 関数のユニットテスト
  - [ ] filter/sort 関数のユニットテスト

## 開発の流れ（短縮タイムライン例）

- Day 1–2: Phase 1 完了（最小機能）
- Day 3–4: Phase 2 完了（詳細 + バリデーション）
- Day 5: Phase 3 完了（検索・フィルタ・ソート）
- Day 6: Phase 4 完了（永続化）
- Day 7: Phase 5 完了（ルーティング + URL 同期）
- Day 8–9: Phase 6 完了（リファクタ + テスト）

## 参考メモ（転職アピール観点）

- なぜ localStorage + React: シンプル構成で個人利用に十分。追加で API 化する余地を示せる。
- 状態管理の境界: どこまで useState で持ち、どこから Context/Reducer に寄せたかを説明する。
- ロジック分離: 検索・フィルタ・ソート・バリデーションを純粋関数化し、テスト容易性を担保。
- 継続改善の軸: レシピタグ、画像添付、PWA 化、家族共有などの拡張余地を語れるようにする。
