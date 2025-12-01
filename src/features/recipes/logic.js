function filterRecipes(recipes, query, category, status) {
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
