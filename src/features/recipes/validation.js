export function validateRecipe(input) {
  const errors = {};

  const t = (input.title || "").trim();
  if (!t) errors.title = "タイトルは必須です";
  if (t.length > 20) errors.title = "20文字以内で入力してください";

  if (input.cookTime != null) {
    //有限数かどうかのチェックをする（abc,Infinity NaNをはじく）
    if (!Number.isFinite(Number(input.cookTime)))
      errors.cookTime = "数値で入力してください";
    else if (input.cookTime < 0 || input.cookTime > 600)
      errors.cookTime = "0~600分で入力してください";
  }

  if (input.sourceUrl && !/^https?:\/\//.test(input.sourceUrl)) {
    errors.sourceUrl = "URL形式で入力してください";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
