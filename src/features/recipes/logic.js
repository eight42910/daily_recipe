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
  //比較関数をマップ化
  const cmp = {
    "created-desc": (a, b) => b.createdAt - a.createdAt,
    "created-asc": (a, b) => a.createdAt - b.createdAt,
    "time-asc": (a, b) => (a.cookTime ?? 9_999) - (b.cookTime ?? 9_999),
    "time-desc": (a, b) => (b.cookTime ?? -1) - (a.cookTime ?? -1),
  };
  return arr.sort(cmp[sort]);
}
