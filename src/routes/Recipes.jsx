import { useMemo, useState } from "react";
import BigButton from "../components/BigButton.jsx";
import BigCard from "../components/BigCard.jsx";
import { getRecipeCost } from "../lib/listEngine.js";
import {
  normalizeIngredientName,
  pricePerUnitFromSaved,
} from "../lib/ingredients.js";

const UNITS = ["ג", 'ק"ג', "כפית", "כף", "כוס", "יח׳"];
const CATEGORIES = ["קמח", "סוכר", "מוצרי חלב", "שוקולד", "אחר"];
const UNIT_ALIASES = new Map([
  ["ג", "ג"],
  ["g", "ג"],
  ["gram", "ג"],
  ["grams", "ג"],
  ['ק"ג', 'ק"ג'],
  ["ק״ג", 'ק"ג'],
  ["kg", 'ק"ג'],
  ["כפית", "כפית"],
  ["tsp", "כפית"],
  ["teaspoon", "כפית"],
  ["teaspoons", "כפית"],
  ["כף", "כף"],
  ["tbsp", "כף"],
  ["tablespoon", "כף"],
  ["tablespoons", "כף"],
  ["כוס", "כוס"],
  ["cup", "כוס"],
  ["cups", "כוס"],
  ["יח׳", "יח׳"],
  ["יח", "יח׳"],
  ["pcs", "יח׳"],
  ["pc", "יח׳"],
  ["piece", "יח׳"],
  ["pieces", "יח׳"],
]);

const CATEGORY_HINTS = [
  { match: /קמח|שיבולת|flour|oat/i, category: "קמח" },
  { match: /סוכר|דבש|sugar|honey/i, category: "סוכר" },
  {
    match: /חמאה|ביצה|ביצים|חלב|שמנת|butter|egg|milk|cream/i,
    category: "מוצרי חלב",
  },
  { match: /שוקולד|קקאו|chocolate|cocoa/i, category: "שוקולד" },
];

function guessCategory(name) {
  const found = CATEGORY_HINTS.find((hint) => hint.match.test(name));
  return found ? found.category : "אחר";
}

function normalizeUnitToken(token) {
  const cleaned = token.toLowerCase().replace(/[.,]/g, "");
  return UNIT_ALIASES.get(cleaned) || null;
}

function parseIngredientLine(line) {
  const cleaned = line.replace(/[,-]+/g, " ").replace(/\s+/g, " ").trim();
  const firstNumber = cleaned.match(/\d+(?:\.\d+)?/);
  if (!firstNumber) {
    const fallbackName = line.trim();
    return {
      name: fallbackName,
      qty: 1,
      unit: "יח׳",
      category: guessCategory(fallbackName),
      pricePerUnitRaw: 0,
    };
  }
  const name = cleaned.slice(0, firstNumber.index).trim() || line.trim();
  const rest = cleaned.slice(firstNumber.index).trim();
  const tokens = rest.split(" ");
  const numbers = [];
  let unit = null;
  let unitIndex = -1;
  tokens.forEach((token, index) => {
    const normalizedUnit = normalizeUnitToken(token);
    if (normalizedUnit) {
      unit = normalizedUnit;
      unitIndex = index;
    }
    const numberMatch = token.match(/\d+(?:\.\d+)?/);
    if (numberMatch) {
      numbers.push({ value: Number(numberMatch[0]), index });
    }
  });

  let qty = numbers.length ? numbers[0].value : 1;
  let pricePerUnit = 0;
  if (numbers.length >= 2) {
    const first = numbers[0];
    const second = numbers[1];
    if (unitIndex > second.index) {
      pricePerUnit = first.value;
      qty = second.value;
    } else {
      qty = first.value;
      pricePerUnit = second.value;
    }
  }

  const category =
    CATEGORIES.find((cat) => cleaned.includes(cat)) || guessCategory(name);
  return {
    name,
    qty: Number(qty) || 1,
    unit: unit || "יח׳",
    category,
    pricePerUnitRaw: Number(pricePerUnit) || 0,
  };
}

function normalizeRecipe(raw) {
  if (!raw || !raw.title || !raw.ingredients) return null;
  const cleanIngredients = raw.ingredients
    .map((item) => ({
      id: item.id || `${item.name || "item"}-${item.unit || "יח׳"}`,
      name: item.name || "מרכיב",
      qty: Number(item.qty) || 1,
      unit: item.unit || "יח׳",
      category: item.category || guessCategory(item.name || ""),
      pricePerUnit: Number(item.pricePerUnit) || 0,
      pricePerUnitRaw: Number(item.pricePerUnitRaw) || 0,
    }))
    .filter((item) => item.name);
  if (!cleanIngredients.length) return null;
  return {
    id:
      raw.id ||
      `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: String(raw.title).trim(),
    type: raw.type === "cake" ? "cake" : "cookie",
    builtIn: false,
    ingredients: cleanIngredients,
    steps: Array.isArray(raw.steps) ? raw.steps.filter(Boolean) : [],
  };
}

function parseTextRecipe(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return null;
  const title = lines[0];
  let type = "cookie";
  let startIndex = 1;
  if (lines[1] && /^(cookie|cake|עוגה|עוגיות)$/i.test(lines[1])) {
    const rawType = lines[1].toLowerCase();
    type = rawType === "cake" || rawType === "עוגה" ? "cake" : "cookie";
    startIndex = 2;
  }
  const ingredients = [];
  for (let i = startIndex; i < lines.length; i += 1) {
    const line = lines[i];
    const parsed = parseIngredientLine(line);
    if (!parsed) continue;
    ingredients.push({
      id: `${parsed.name.toLowerCase().replace(/\s+/g, "-")}-${parsed.unit}`,
      ...parsed,
      pricePerUnit: pricePerUnitFromSaved(parsed.pricePerUnitRaw, parsed.unit),
    });
  }
  return normalizeRecipe({ title, type, ingredients });
}

function Recipes({
  recipes,
  selected,
  toggleRecipe,
  addRecipe,
  removeRecipe,
  ingredientPrices,
  mergeIngredientPrices,
  navigate,
}) {
  const selectedIds = useMemo(
    () => new Set(selected.map((item) => item.recipeId)),
    [selected],
  );
  const [pasteText, setPasteText] = useState("");

  const handlePaste = () => {
    const recipe = parseTextRecipe(pasteText);
    if (!recipe) return;
    addRecipe(applySavedPricesToRecipe(recipe));
    setPasteText("");
  };

  const applySavedPricesToRecipe = (recipe) => {
    const updates = {};
    const ingredients = recipe.ingredients.map((ingredient) => {
      const key = normalizeIngredientName(ingredient.name);
      if (!key) return ingredient;
      if (ingredient.pricePerUnitRaw && ingredient.pricePerUnitRaw > 0) {
        updates[key] = ingredient.pricePerUnitRaw;
        const converted = pricePerUnitFromSaved(
          ingredient.pricePerUnitRaw,
          ingredient.unit,
        );
        const next = { ...ingredient, pricePerUnit: converted };
        delete next.pricePerUnitRaw;
        return next;
      }
      if (ingredient.pricePerUnit && ingredient.pricePerUnit > 0) {
        return ingredient;
      }
      const saved = ingredientPrices[key];
      if (saved != null) {
        return {
          ...ingredient,
          pricePerUnit: pricePerUnitFromSaved(saved, ingredient.unit),
        };
      }
      return ingredient;
    });
    if (Object.keys(updates).length) mergeIngredientPrices(updates);
    return { ...recipe, ingredients };
  };

  return (
    <div className="stack">
      <div className="grid">
        {recipes.map((recipe) => {
          const isSelected = selectedIds.has(recipe.id);
          const recipeCost = getRecipeCost(recipe);
          return (
            <BigCard key={recipe.id} className="recipe-card">
              <h2>{recipe.title}</h2>
              <p className="muted">
                {recipe.type === "cookie" ? "עוגיות" : "עוגה"} ·{" "}
                {recipe.ingredients.length} פריטים
              </p>
              {recipeCost > 0 && (
                <p className="muted">
                  עלות משוערת לסבב: {recipeCost.toFixed(2)} ₪
                </p>
              )}
              <div className="button-row">
                <BigButton
                  variant={isSelected ? "secondary" : "primary"}
                  onClick={() => toggleRecipe(recipe.id)}
                  ariaLabel={isSelected ? "הסרה מהתכנית" : "הוספה לתכנית"}
                >
                  {isSelected ? "להסיר" : "להוסיף לתכנית"}
                </BigButton>
                {!recipe.builtIn && (
                  <BigButton
                    variant="ghost"
                    onClick={() => removeRecipe(recipe.id)}
                    ariaLabel="מחיקת מתכון"
                  >
                    למחוק
                  </BigButton>
                )}
              </div>
            </BigCard>
          );
        })}
      </div>

      <BigButton
        variant="secondary"
        onClick={() => navigate("/list")}
        ariaLabel="מעבר לסבבים ולרשימה"
      >
        הבא: סבבים ורשימה
      </BigButton>

      <BigCard>
        <h2>להוסיף מתכון מטקסט</h2>
        <p className="muted">
          הדביקו מתכון בטקסט פשוט. אנחנו נחלץ את המרכיבים לבד.
        </p>
        <label className="field">
          <span>מרכיב אחד בכל שורה: כמות + יחידה + שם</span>
          <textarea
            className="big-input"
            rows={5}
            value={pasteText}
            onChange={(event) => setPasteText(event.target.value)}
            placeholder={
              "דוגמה:\nעוגיות שוקולד\n200 ג קמח\n100 ג סוכר\n1 יח׳ ביצה"
            }
            aria-label="הדבקת טקסט מתכון"
          />
        </label>
        <BigButton
          variant="secondary"
          onClick={handlePaste}
          ariaLabel="הוספת מתכון מהדבקה"
          className="full-width paste-action"
        >
          לחלץ מרכיבים ולהוסיף
        </BigButton>
      </BigCard>
    </div>
  );
}

export default Recipes;
