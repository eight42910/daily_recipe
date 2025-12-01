const CATEGORY_LABELS = {
  main: "主菜",
  side: "副菜",
  soup: "汁物",
  noodle: "麺類",
  don: "丼物",
  dessert: "デザート",
};

const STATUS_LABELS = {
  cooked: "作った",
  want: "作りたい",
};

const STATUS_COLORS = {
  cooked: "bg-green-100 text-green-800",
  want: "bg-yellow-100 text-yellow-800",
};

export function RecipeItem({ recipe, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {recipe.title}
          </h3>

          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {CATEGORY_LABELS[recipe.category]}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                STATUS_COLORS[recipe.status]
              }`}
            >
              {STATUS_LABELS[recipe.status]}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(recipe.id)}
          className="ml-4 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors border "
          aria-label={`${recipe.title}を削除`}
        >
          削除
        </button>
      </div>
    </div>
  );
}
