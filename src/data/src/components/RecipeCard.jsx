export default function RecipeCard({ recipe, prices }) {
  const totalCost = Object.entries(recipe.재료).reduce(
    (sum, [mat, qty]) => sum + (prices[mat] || 0) * qty,
    0
  );
  const profitMin = recipe.가격하한 - totalCost;
  const profitMax = recipe.가격상한 - totalCost;

  return (
    <div className="bg-gray-900 dark:bg-gray-800 rounded-xl shadow-md p-4 hover:scale-[1.02] transition">
      <img
        src={recipe.이미지}
        alt={recipe.요리명}
        className="w-20 h-20 rounded-lg mx-auto mb-3"
      />
      <h2 className="text-lg font-bold text-center text-yellow-400">
        {recipe.요리명}
      </h2>

      <div className="text-gray-300 text-sm mt-2 text-center">
        {Object.entries(recipe.재료)
          .map(([mat, qty]) => `${mat} ${qty}`)
          .join(" ＋ ")}
      </div>

      <div className="text-center mt-3 text-sm">
        <div className="text-cyan-400">
          💰 {recipe.가격하한} ~ {recipe.가격상한}
        </div>
        <div className="text-green-400 font-semibold">
          순이익: {profitMin} ~ {profitMax}
        </div>
      </div>
    </div>
  );
}
