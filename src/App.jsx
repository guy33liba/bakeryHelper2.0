import { useEffect, useMemo, useState } from "react";
import BottomTabs from "./components/BottomTabs.jsx";
import StepHeader from "./components/StepHeader.jsx";
import ThemeSwitch from "./components/ThemeSwitch.jsx";
import Home from "./routes/Home.jsx";
import Recipes from "./routes/Recipes.jsx";
import List from "./routes/List.jsx";
import Settings from "./routes/Settings.jsx";
import { loadData, saveData } from "./lib/storage.js";
import {
  normalizeIngredientName,
  pricePerUnitFromSaved,
} from "./lib/ingredients.js";

const ROUTES = ["/", "/recipes", "/list", "/settings"];

function getPath() {
  const path = window.location.pathname || "/";
  return ROUTES.includes(path) ? path : "/";
}

function useRoute() {
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (nextPath) => {
    const safePath = ROUTES.includes(nextPath) ? nextPath : "/";
    if (safePath === path) return;
    window.history.pushState({}, "", safePath);
    setPath(safePath);
  };

  return { path, navigate };
}

function App() {
  const { path, navigate } = useRoute();
  const [data, setData] = useState(() => loadData());
  const [toast, setToast] = useState("");

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", data.settings.theme);
  }, [data.settings.theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const recipesById = useMemo(() => {
    const map = new Map();
    data.recipes.forEach((recipe) => map.set(recipe.id, recipe));
    return map;
  }, [data.recipes]);

  const showToast = (message) => setToast(message);

  const setTheme = (theme) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme },
    }));
  };

  const toggleRecipe = (recipeId) => {
    setData((prev) => {
      const isSelected = prev.plan.selected.some(
        (item) => item.recipeId === recipeId,
      );
      const selected = isSelected
        ? prev.plan.selected.filter((item) => item.recipeId !== recipeId)
        : [...prev.plan.selected, { recipeId, batches: 1 }];
      return { ...prev, plan: { ...prev.plan, selected } };
    });
  };

  const setBatches = (recipeId, batches) => {
    const safeBatches = Math.max(1, batches);
    setData((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        selected: prev.plan.selected.map((item) =>
          item.recipeId === recipeId ? { ...item, batches: safeBatches } : item,
        ),
      },
    }));
  };

  const addRecipe = (recipe) => {
    setData((prev) => ({
      ...prev,
      recipes: [...prev.recipes, recipe],
    }));
    showToast("נשמר");
  };

  const removeRecipe = (recipeId) => {
    if (!window.confirm("למחוק את המתכון הזה?")) return;
    setData((prev) => ({
      ...prev,
      recipes: prev.recipes.filter((recipe) => recipe.id !== recipeId),
      plan: {
        ...prev.plan,
        selected: prev.plan.selected.filter(
          (item) => item.recipeId !== recipeId,
        ),
      },
    }));
    showToast("נשמר");
  };

  const updateListState = (checked) => {
    setData((prev) => ({
      ...prev,
      listState: { ...prev.listState, checked },
    }));
  };

  const resetAll = () => {
    if (!window.confirm("לאפס את הכול?")) return;
    const fresh = loadData(true);
    setData(fresh);
    showToast("נשמר");
  };

  const updateDemoEnabled = (demoDataEnabled) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, demoDataEnabled },
    }));
  };

  const updateIngredientPrice = (name, price) => {
    const key = normalizeIngredientName(name);
    if (!key) return;
    const safePrice = Number(price) || 0;
    setData((prev) => {
      const ingredientPrices = {
        ...(prev.ingredientPrices || {}),
        [key]: safePrice,
      };
      const recipes = prev.recipes.map((recipe) => {
        if (!Array.isArray(recipe.ingredients)) return recipe;
        const ingredients = recipe.ingredients.map((ingredient) => {
          if (normalizeIngredientName(ingredient.name) !== key)
            return ingredient;
          return {
            ...ingredient,
            pricePerUnit: pricePerUnitFromSaved(safePrice, ingredient.unit),
          };
        });
        return { ...recipe, ingredients };
      });
      return { ...prev, ingredientPrices, recipes };
    });
  };

  const mergeIngredientPrices = (updates) => {
    if (!updates || !Object.keys(updates).length) return;
    setData((prev) => {
      const ingredientPrices = {
        ...(prev.ingredientPrices || {}),
        ...updates,
      };
      const updateKeys = new Set(Object.keys(updates));
      const recipes = prev.recipes.map((recipe) => {
        if (!Array.isArray(recipe.ingredients)) return recipe;
        const ingredients = recipe.ingredients.map((ingredient) => {
          const key = normalizeIngredientName(ingredient.name);
          if (!updateKeys.has(key)) return ingredient;
          return {
            ...ingredient,
            pricePerUnit: pricePerUnitFromSaved(
              ingredientPrices[key],
              ingredient.unit,
            ),
          };
        });
        return { ...recipe, ingredients };
      });
      return { ...prev, ingredientPrices, recipes };
    });
  };

  const removeIngredientPrice = (name) => {
    const key = normalizeIngredientName(name);
    if (!key) return;
    setData((prev) => {
      if (!prev.ingredientPrices || prev.ingredientPrices[key] == null)
        return prev;
      const next = { ...prev.ingredientPrices };
      delete next[key];
      return { ...prev, ingredientPrices: next };
    });
  };

  return (
    <div className="app-shell">
      <header className="app-header" aria-live="polite">
        <div className="brand">בייקליסט</div>
        <div className="tagline">עוגיות ועוגות, הכי פשוט שיש.</div>
        <div className="header-theme">
          <ThemeSwitch
            checked={data.settings.theme === "dark"}
            onChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </header>

      <main className="app-main">
        {path === "/" && (
          <>
            <StepHeader
              title="התחלה"
              subtitle="בחרו מתכון, בחרו כמות סבבים, וקבלו רשימת קנייה."
            />
            <Home
              recipes={data.recipes}
              selected={data.plan.selected}
              listState={data.listState}
              navigate={navigate}
            />
          </>
        )}

        {path === "/recipes" && (
          <>
            <StepHeader title="שלב 1" subtitle="בחרו מתכון אחד או יותר." />
            <Recipes
              recipes={data.recipes}
              selected={data.plan.selected}
              toggleRecipe={toggleRecipe}
              addRecipe={addRecipe}
              removeRecipe={removeRecipe}
              ingredientPrices={data.ingredientPrices || {}}
              mergeIngredientPrices={mergeIngredientPrices}
              navigate={navigate}
            />
          </>
        )}

        {path === "/list" && (
          <>
            <StepHeader title="שלב 2 ו-3" subtitle="בחרו סבבים, ואז קנו." />
            <List
              recipes={data.recipes}
              selected={data.plan.selected}
              listState={data.listState}
              setBatches={setBatches}
              updateListState={updateListState}
              showToast={showToast}
              navigate={navigate}
            />
          </>
        )}

        {path === "/settings" && (
          <>
            <StepHeader title="הגדרות" subtitle="מגדירים איך שנוח." />
            <Settings
              data={data}
              setTheme={setTheme}
              updateDemoEnabled={updateDemoEnabled}
              resetAll={resetAll}
              setData={setData}
              showToast={showToast}
              updateIngredientPrice={updateIngredientPrice}
              removeIngredientPrice={removeIngredientPrice}
            />
          </>
        )}
      </main>

      <BottomTabs activePath={path} navigate={navigate} />

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
