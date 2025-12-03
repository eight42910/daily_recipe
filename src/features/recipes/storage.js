const KEY = "recipes";

export function localRecipes() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return []; //初回や空の場合は、空配列
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return []; //型が期待を違えば、捨てる
    return data;
  } catch (e) {
    console.warn("Failed to load recipes", e);
    return [];
  }
}

export function saveRecipes(recipes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(recipes));
  } catch (e) {
    console.warn("Failed to save recipes", e);
  }
}
