export function SearchFilters({
  query,
  category,
  status,
  sort,
  onQueryChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
}) {
  return (
    <section className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="キーワード検索"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={category ?? ""}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">全カテゴリ</option>
          <option value="main">主菜</option>
          <option value="side">副菜</option>
          <option value="soup">汁物</option>
          <option value="noodle">麺類</option>
          <option value="don">丼物</option>
          <option value="dessert">デザート</option>
        </select>

        <select
          value={status ?? ""}
          onChange={(e) => onStatusChange(e.target.value || undefined)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">全ステータス</option>
          <option value="want">作りたい</option>
          <option value="cooked">作った</option>
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="created-desc">作成日 新しい順</option>
          <option value="created-asc">作成日 古い順</option>
          <option value="time-asc">所要時間 短い順</option>
          <option value="time-desc">所要時間 長い順</option>
        </select>
      </div>
    </section>
  );
}
