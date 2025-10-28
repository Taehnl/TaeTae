"use client";
import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import ThemeToggle from "../components/ThemeToggle";
import recipesData from "../data/recipes.json";

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [prices, setPrices] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const ingredients = [
    ...new Set(
      recipesData.flatMap((r) => Object.keys(r.재료))
    )
  ];

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 transition">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-cyan-400">태태 요리 계산기 🍳</h1>
        <div className="flex gap-2">
          <SearchBar search={search} setSearch={setSearch} />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>

      <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2 text-cyan-400">원재료 가격 입력</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ingredients.map((mat) => (
            <div key={mat}>
              <label className="text-sm">{mat}</label>
              <input
                type="number"
                value={prices[mat] || ""}
                onChange={(e) =>
                  setPrices((prev) => ({ ...prev, [mat]: Number(e.target.value) }))
                }
                className="w-full p-1 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recipesData
          .filter((r) => r.요리명.includes(search))
          .map((recipe) => (
            <RecipeCard key={recipe.요리명} recipe={recipe} prices={prices} />
          ))}
      </div>
    </main>
  );
}
