// Vanilla JS port of the React app (hash-based routing).

const ROUTES = ["/", "/recipes", "/list", "/settings"];
const STORAGE_KEY = "bakelist_v1";

const clone = (value) => JSON.parse(JSON.stringify(value));

function normalizeIngredientName(value) {
  return String(value || "").trim().toLowerCase();
}

function pricePerUnitFromSaved(savedPrice, unit) {
  const price = Number(savedPrice) || 0;
  if (!price) return 0;
  const normalizedUnit = String(unit || "").trim().toLowerCase();
  if (
    normalizedUnit === "g" ||
    normalizedUnit === "gram" ||
    normalizedUnit === "grams" ||
    normalizedUnit === "ג"
  ) {
    return price / 1000;
  }
  return price;
}

const DEFAULT_DATA = {
  settings: {
    theme: "light",
    demoDataEnabled: true,
  },
  recipes: [
    {
      id: "cookie-butter",
      title: "Butter Cookies",
      type: "cookie",
      builtIn: true,
      ingredients: [
        {
          id: "flour",
          name: "flour",
          qty: 250,
          unit: "g",
          category: "Flour",
          pricePerUnit: 0.01,
        },
        {
          id: "sugar",
          name: "sugar",
          qty: 120,
          unit: "g",
          category: "Sugar",
          pricePerUnit: 0.008,
        },
        {
          id: "butter",
          name: "butter",
          qty: 150,
          unit: "g",
          category: "Dairy",
          pricePerUnit: 0.04,
        },
        {
          id: "eggs",
          name: "eggs",
          qty: 1,
          unit: "pcs",
          category: "Dairy",
          pricePerUnit: 1.2,
        },
        {
          id: "vanilla",
          name: "vanilla",
          qty: 1,
          unit: "tsp",
          category: "Other",
          pricePerUnit: 1.5,
        },
        {
          id: "salt",
          name: "salt",
          qty: 1,
          unit: "tsp",
          category: "Other",
          pricePerUnit: 0.2,
        },
      ],
      steps: ["Mix", "Shape", "Bake"],
    },
    {
      id: "cookie-choc-chip",
      title: "Chocolate Chip Cookies",
      type: "cookie",
      builtIn: true,
      ingredients: [
        {
          id: "flour",
          name: "flour",
          qty: 260,
          unit: "g",
          category: "Flour",
          pricePerUnit: 0.01,
        },
        {
          id: "sugar",
          name: "sugar",
          qty: 150,
          unit: "g",
          category: "Sugar",
          pricePerUnit: 0.008,
        },
        {
          id: "butter",
          name: "butter",
          qty: 150,
          unit: "g",
          category: "Dairy",
          pricePerUnit: 0.04,
        },
        {
          id: "eggs",
          name: "eggs",
          qty: 1,
          unit: "pcs",
          category: "Dairy",
          pricePerUnit: 1.2,
        },
        {
          id: "choc-chips",
          name: "chocolate chips",
          qty: 200,
          unit: "g",
          category: "Chocolate",
          pricePerUnit: 0.05,
        },
        {
          id: "baking-soda",
          name: "baking soda",
          qty: 1,
          unit: "tsp",
          category: "Other",
          pricePerUnit: 0.3,
        },
      ],
      steps: ["Mix", "Shape", "Bake"],
    },
    {
      id: "cookie-oat",
      title: "Oatmeal Cookies",
      type: "cookie",
      builtIn: true,
      ingredients: [
        {
          id: "oats",
          name: "oats",
          qty: 200,
          unit: "g",
          category: "Flour",
          pricePerUnit: 0.02,
        },
        {
          id: "flour",
          name: "flour",
          qty: 120,
          unit: "g",
          category: "Flour",
          pricePerUnit: 0.01,
        },
        {
          id: "sugar",
          name: "sugar",
          qty: 120,
          unit: "g",
          category: "Sugar",
          pricePerUnit: 0.008,
        },
        {
          id: "butter",
          name: "butter",
          qty: 120,
          unit: "g",
          category: "Dairy",
          pricePerUnit: 0.04,
        },
        {
          id: "eggs",
          name: "eggs",
          qty: 1,
          unit: "pcs",
          category: "Dairy",
          pricePerUnit: 1.2,
        },
        {
          id: "cinnamon",
          name: "cinnamon",
          qty: 1,
          unit: "tsp",
          category: "Other",
          pricePerUnit: 0.4,
        },
      ],
      steps: ["Mix", "Shape", "Bake"],
    },
    {
      id: "cake-vanilla",
      title: "Vanilla Cake",
      type: "cake",
      builtIn: true,
      ingredients: [
        {
          id: "flour",
          name: "flour",
          qty: 300,
          unit: "g",
          category: "Flour",
          pricePerUnit: 0.01,
        },
        {
          id: "sugar",
          name: "sugar",
          qty: 200,
          unit: "g",
          category: "Sugar",
          pricePerUnit: 0.008,
        },
        {
          id: "butter",
          name: "butter",
          qty: 150,
          unit: "g",
          category: "Dairy",
          pricePerUnit: 0.04,
        },
        {
          id: "eggs",
          name: "eggs",
          qty: 2,
          unit: "pcs",
          category: "Dairy",
          pricePerUnit: 1.2,
        },
        {
          id: "milk",
          name: "milk",
          qty: 1,
          unit: "cup",
          category: "Dairy",
          pricePerUnit: 3,
        },
        {
          id: "baking-powder",
          name: "baking powder",
          qty: 2,
          unit: "tsp",
          category: "Other",
          pricePerUnit: 0.4,
        },
      ],
      steps: ["Mix", "Pour into pan", "Bake"],
    },
    {
      id: "cake-chocolate",
      title: "Chocolate Cake",
      type: "cake",
      builtIn: true,
      ingredients: [
        {
          id: "flour",
          name: "flour",
          qty: 280,
          unit: "g",
          category: "Flour",
          pricePerUnit: 0.01,
        },
        {
          id: "sugar",
          name: "sugar",
          qty: 200,
          unit: "g",
          category: "Sugar",
          pricePerUnit: 0.008,
        },
        {
          id: "butter",
          name: "butter",
          qty: 150,
          unit: "g",
          category: "Dairy",
          pricePerUnit: 0.04,
        },
        {
          id: "eggs",
          name: "eggs",
          qty: 2,
          unit: "pcs",
          category: "Dairy",
          pricePerUnit: 1.2,
        },
        {
          id: "cocoa",
          name: "cocoa powder",
          qty: 50,
          unit: "g",
          category: "Chocolate",
          pricePerUnit: 0.06,
        },
        {
          id: "milk",
          name: "milk",
          qty: 1,
          unit: "cup",
          category: "Dairy",
          pricePerUnit: 3,
        },
        {
          id: "baking-powder",
          name: "baking powder",
          qty: 2,
          unit: "tsp",
          category: "Other",
          pricePerUnit: 0.4,
        },
      ],
      steps: ["Mix", "Pour into pan", "Bake"],
    },
    {
      id: "cake-lemon",
      title: "Lemon Cake",
      type: "cake",
      builtIn: true,
      ingredients: [
        {
          id: "flour",
          name: "flour",
          qty: 280,
          unit: "g",
          category: "Flour",
          pricePerUnit: 0.01,
        },
        {
          id: "sugar",
          name: "sugar",
          qty: 180,
          unit: "g",
          category: "Sugar",
          pricePerUnit: 0.008,
        },
        {
          id: "butter",
          name: "butter",
          qty: 150,
          unit: "g",
          category: "Dairy",
          pricePerUnit: 0.04,
        },
        {
          id: "eggs",
          name: "eggs",
          qty: 2,
          unit: "pcs",
          category: "Dairy",
          pricePerUnit: 1.2,
        },
        {
          id: "lemon-zest",
          name: "lemon zest",
          qty: 1,
          unit: "tbsp",
          category: "Other",
          pricePerUnit: 0.5,
        },
        {
          id: "baking-powder",
          name: "baking powder",
          qty: 2,
          unit: "tsp",
          category: "Other",
          pricePerUnit: 0.4,
        },
      ],
      steps: ["Mix", "Pour into pan", "Bake"],
    },
  ],
  plan: {
    selected: [],
  },
  listState: {
    checked: [],
  },
  ingredientPrices: {
    "baking powder": 3,
    "candied hazelnuts": 15,
    walnuts: 14,
    "instant pudding": 6,
    milk: 10,
    butter: 10,
    "peanut butter": 18.5,
    "chocolate coins": 25,
    maple: 31,
    "chocolate chips": 14,
    "baking soda": 3,
    "brown sugar": 7,
    "white sugar": 6,
    sprinkles: 11.5,
    "chocolate bar": 8,
    "chocolate chunks": 16,
    chocolates: 12.5,
    oil: 12,
    "vanilla extract": 6,
    "rum extract": 4,
    flour: 7,
    "almond flour": 21,
    coconut: 10.5,
    cocoa: 35,
    "dulce de leche": 16,
    cream: 12,
  },
};

function buildDefaultIngredientPrices(recipes) {
  const prices = {};
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (ingredient.pricePerUnit == null) return;
      const key = normalizeIngredientName(ingredient.name);
      if (!key) return;
      if (prices[key] == null) {
        prices[key] = Number(ingredient.pricePerUnit) || 0;
      }
    });
  });
  return prices;
}

function applyIngredientPrices(data, defaultsSource = DEFAULT_DATA.recipes) {
  const defaultPrices = buildDefaultIngredientPrices(defaultsSource);
  const merged = {
    ...data,
    ingredientPrices: {
      ...defaultPrices,
      ...(data.ingredientPrices || {}),
    },
  };
  const normalizedPrices = {};
  Object.entries(merged.ingredientPrices || {}).forEach(([name, price]) => {
    const key = normalizeIngredientName(name);
    if (!key) return;
    normalizedPrices[key] = Number(price) || 0;
  });
  return { ...merged, ingredientPrices: normalizedPrices };
}

const RANGE_PRICE_OVERRIDES = {
  [normalizeIngredientName("chocolates")]: 12.5,
  [normalizeIngredientName("coconut")]: 10.5,
  [normalizeIngredientName("sprinkles")]: 11.5,
  [normalizeIngredientName("peanut butter")]: 18.5,
  [normalizeIngredientName("almond flour")]: 21,
  [normalizeIngredientName("cream")]: 12,
};

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function loadData(forceFresh = false) {
  if (forceFresh) {
    const fresh = clone(DEFAULT_DATA);
    return applyIngredientPrices(fresh, fresh.recipes);
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fresh = clone(DEFAULT_DATA);
    return applyIngredientPrices(fresh, fresh.recipes);
  }
  const parsed = safeParse(raw);
  if (!parsed || !parsed.settings || !parsed.recipes) {
    const fresh = clone(DEFAULT_DATA);
    return applyIngredientPrices(fresh, fresh.recipes);
  }
  const merged = {
    ...clone(DEFAULT_DATA),
    ...parsed,
  };
  const mergedWithPrices = applyIngredientPrices(merged, DEFAULT_DATA.recipes);
  Object.entries(RANGE_PRICE_OVERRIDES).forEach(([key, value]) => {
    if (!key) return;
    mergedWithPrices.ingredientPrices[key] = value;
  });

  const defaultRecipesById = new Map(
    DEFAULT_DATA.recipes.map((recipe) => [recipe.id, recipe]),
  );
  mergedWithPrices.recipes = mergedWithPrices.recipes.map((recipe) => {
    const fallbackRecipe = defaultRecipesById.get(recipe.id);
    if (!Array.isArray(recipe.ingredients)) return recipe;
    const fallbackIngredientsByKey = fallbackRecipe
      ? new Map(
          fallbackRecipe.ingredients.map((item) => [`${item.id}|${item.unit}`, item]),
        )
      : null;

    const ingredients = recipe.ingredients.map((ingredient) => {
      const base = { ...ingredient };
      const override = RANGE_PRICE_OVERRIDES[normalizeIngredientName(base.name)];
      if (override != null) {
        base.pricePerUnit = override;
        return base;
      }
      if (fallbackIngredientsByKey) {
        const fallback = fallbackIngredientsByKey.get(`${ingredient.id}|${ingredient.unit}`);
        if (fallback && base.pricePerUnit == null) {
          base.pricePerUnit = fallback.pricePerUnit;
        }
      }
      const priceKey = normalizeIngredientName(base.name);
      if (mergedWithPrices.ingredientPrices[priceKey] != null) {
        base.pricePerUnit = pricePerUnitFromSaved(
          mergedWithPrices.ingredientPrices[priceKey],
          base.unit,
        );
      }
      return base;
    });

    return { ...recipe, ingredients };
  });

  return mergedWithPrices;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function normalizeName(name) {
  return name.trim().toLowerCase();
}

const CATEGORY_ORDER = ["Flour", "Sugar", "Dairy", "Chocolate", "Other"];

function buildList(recipes, selected) {
  const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const merged = new Map();

  selected.forEach(({ recipeId, batches }) => {
    const recipe = recipeMap.get(recipeId);
    if (!recipe) return;
    recipe.ingredients.forEach((ingredient) => {
      const key = `${normalizeName(ingredient.name)}|${ingredient.unit}`;
      const qty = ingredient.qty * batches;
      const pricePerUnit = Number(ingredient.pricePerUnit) || 0;
      const totalCost = pricePerUnit > 0 ? pricePerUnit * qty : 0;
      if (!merged.has(key)) {
        merged.set(key, {
          name: ingredient.name,
          unit: ingredient.unit,
          qty,
          category: ingredient.category || "Other",
          totalCost,
          key,
        });
      } else {
        const current = merged.get(key);
        current.qty += qty;
        if (totalCost > 0) {
          current.totalCost = (current.totalCost || 0) + totalCost;
        }
      }
    });
  });

  const grouped = new Map();
  merged.forEach((item) => {
    const category = item.category || "Other";
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category).push(item);
  });

  const groups = [];
  CATEGORY_ORDER.forEach((category) => {
    if (grouped.has(category)) {
      const items = grouped.get(category).sort((a, b) => a.name.localeCompare(b.name));
      groups.push({ category, items });
    }
  });

  grouped.forEach((items, category) => {
    if (!CATEGORY_ORDER.includes(category)) {
      groups.push({ category, items });
    }
  });

  groups.forEach((group) => {
    group.items.forEach((item) => {
      if (item.totalCost && item.qty) {
        item.pricePerUnit = item.totalCost / item.qty;
      }
    });
  });

  return groups;
}

function getRecipeCost(recipe, batches = 1) {
  if (!recipe || !Array.isArray(recipe.ingredients)) return 0;
  const safeBatches = Math.max(1, Number(batches) || 1);
  return recipe.ingredients.reduce((sum, ingredient) => {
    const pricePerUnit = Number(ingredient.pricePerUnit) || 0;
    const qty = Number(ingredient.qty) || 0;
    if (!pricePerUnit || !qty) return sum;
    return sum + pricePerUnit * qty * safeBatches;
  }, 0);
}

function listToText(groups) {
  if (!groups.length) return "No items yet.";
  return groups
    .map((group) => {
      const lines = group.items.map((item) => {
        const base = `- ${item.name}: ${item.qty} ${item.unit}`;
        if (item.totalCost) return `${base} · ${item.totalCost.toFixed(2)} ₪`;
        return base;
      });
      return `${group.category}\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (value == null) return;
      if (key === "class") {
        node.className = value;
      } else if (key === "dataset") {
        Object.entries(value).forEach(([dkey, dval]) => {
          node.dataset[dkey] = dval;
        });
      } else if (key.startsWith("on") && typeof value === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === "style" && typeof value === "object") {
        Object.assign(node.style, value);
      } else if (key in node) {
        try {
          node[key] = value;
        } catch {
          node.setAttribute(key, String(value));
        }
      } else {
        node.setAttribute(key, String(value));
      }
    });
  }

  children.flat().forEach((child) => {
    if (child == null || child === false) return;
    if (typeof child === "string" || typeof child === "number") {
      node.appendChild(document.createTextNode(String(child)));
    } else {
      node.appendChild(child);
    }
  });
  return node;
}

function bigButton({ text, variant = "primary", onClick, ariaLabel, className = "" }) {
  return el(
    "button",
    {
      class: `big-button big-button-${variant} ${className}`.trim(),
      type: "button",
      onClick,
      "aria-label": ariaLabel,
    },
    text,
  );
}

function bigCard({ className = "", children }) {
  return el("div", { class: `big-card ${className}`.trim() }, children);
}

function stepHeader({ title, subtitle }) {
  return el(
    "div",
    { class: "step-header" },
    el("h1", null, title),
    subtitle ? el("p", null, subtitle) : null,
  );
}

function getPathFromHash() {
  const raw = (window.location.hash || "").replace(/^#/, "").trim();
  const path = raw.startsWith("/") ? raw : "/";
  return ROUTES.includes(path) ? path : "/";
}

function navigate(path) {
  const safe = ROUTES.includes(path) ? path : "/";
  if (getPathFromHash() === safe) return;
  window.location.hash = safe;
}

let state = {
  data: loadData(),
  toast: "",
};

let toastTimer = null;
function showToast(message) {
  state.toast = String(message || "");
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 1800);
  render();
}

function setData(updater) {
  const next = typeof updater === "function" ? updater(state.data) : updater;
  state.data = next;
  saveData(state.data);
  document.documentElement.setAttribute("data-theme", state.data.settings.theme);
  render();
}

function setTheme(theme) {
  setData((prev) => ({
    ...prev,
    settings: { ...prev.settings, theme: theme === "dark" ? "dark" : "light" },
  }));
}

function toggleRecipe(recipeId) {
  setData((prev) => {
    const isSelected = prev.plan.selected.some((item) => item.recipeId === recipeId);
    const selected = isSelected
      ? prev.plan.selected.filter((item) => item.recipeId !== recipeId)
      : [...prev.plan.selected, { recipeId, batches: 1 }];
    return { ...prev, plan: { ...prev.plan, selected } };
  });
}

function setBatches(recipeId, batches) {
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
}

function addRecipe(recipe) {
  setData((prev) => ({ ...prev, recipes: [...prev.recipes, recipe] }));
  showToast("Saved");
}

function removeRecipe(recipeId) {
  if (!window.confirm("Delete this recipe?")) return;
  setData((prev) => ({
    ...prev,
    recipes: prev.recipes.filter((recipe) => recipe.id !== recipeId),
    plan: {
      ...prev.plan,
      selected: prev.plan.selected.filter((item) => item.recipeId !== recipeId),
    },
  }));
  showToast("Saved");
}

function updateListChecked(checked) {
  setData((prev) => ({ ...prev, listState: { ...prev.listState, checked } }));
}

function updateDemoEnabled(demoDataEnabled) {
  setData((prev) => ({
    ...prev,
    settings: { ...prev.settings, demoDataEnabled: Boolean(demoDataEnabled) },
  }));
}

function updateIngredientPrice(name, price) {
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
        if (normalizeIngredientName(ingredient.name) !== key) return ingredient;
        return {
          ...ingredient,
          pricePerUnit: pricePerUnitFromSaved(safePrice, ingredient.unit),
        };
      });
      return { ...recipe, ingredients };
    });
    return { ...prev, ingredientPrices, recipes };
  });
}

function mergeIngredientPrices(updates) {
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
          pricePerUnit: pricePerUnitFromSaved(ingredientPrices[key], ingredient.unit),
        };
      });
      return { ...recipe, ingredients };
    });
    return { ...prev, ingredientPrices, recipes };
  });
}

function removeIngredientPrice(name) {
  const key = normalizeIngredientName(name);
  if (!key) return;
  setData((prev) => {
    if (!prev.ingredientPrices || prev.ingredientPrices[key] == null) return prev;
    const next = { ...prev.ingredientPrices };
    delete next[key];
    return { ...prev, ingredientPrices: next };
  });
}

const UNITS = ["g", "kg", "tsp", "tbsp", "cup", "pcs"];
const CATEGORIES = ["Flour", "Sugar", "Dairy", "Chocolate", "Other"];
const UNIT_ALIASES = new Map([
  ["ג", "g"],
  ["g", "g"],
  ["gram", "g"],
  ["grams", "g"],
  ['ק"ג', "kg"],
  ["ק״ג", "kg"],
  ["kg", "kg"],
  ["כפית", "tsp"],
  ["tsp", "tsp"],
  ["teaspoon", "tsp"],
  ["teaspoons", "tsp"],
  ["כף", "tbsp"],
  ["tbsp", "tbsp"],
  ["tablespoon", "tbsp"],
  ["tablespoons", "tbsp"],
  ["כוס", "cup"],
  ["cup", "cup"],
  ["cups", "cup"],
  ["יח׳", "pcs"],
  ["יח", "pcs"],
  ["pcs", "pcs"],
  ["pc", "pcs"],
  ["piece", "pcs"],
  ["pieces", "pcs"],
]);

const CATEGORY_HINTS = [
  { match: /קמח|שיבולת|flour|oat/i, category: "Flour" },
  { match: /סוכר|דבש|sugar|honey/i, category: "Sugar" },
  {
    match: /חמאה|ביצה|ביצים|חלב|שמנת|butter|egg|milk|cream/i,
    category: "Dairy",
  },
  { match: /שוקולד|קקאו|chocolate|cocoa/i, category: "Chocolate" },
];

function guessCategory(name) {
  const found = CATEGORY_HINTS.find((hint) => hint.match.test(name));
  return found ? found.category : "Other";
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
      unit: "pcs",
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

  const category = CATEGORIES.find((cat) => cleaned.includes(cat)) || guessCategory(name);
  return {
    name,
    qty: Number(qty) || 1,
    unit: unit || "pcs",
    category,
    pricePerUnitRaw: Number(pricePerUnit) || 0,
  };
}

function normalizeRecipe(raw) {
  if (!raw || !raw.title || !raw.ingredients) return null;
  const cleanIngredients = raw.ingredients
    .map((item) => ({
      id: item.id || `${item.name || "item"}-${item.unit || "pcs"}`,
      name: item.name || "Ingredient",
      qty: Number(item.qty) || 1,
      unit: item.unit || "pcs",
      category: item.category || guessCategory(item.name || ""),
      pricePerUnit: Number(item.pricePerUnit) || 0,
      pricePerUnitRaw: Number(item.pricePerUnitRaw) || 0,
    }))
    .filter((item) => item.name);
  if (!cleanIngredients.length) return null;
  return {
    id: raw.id || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: String(raw.title).trim(),
    type: raw.type === "cake" ? "cake" : "cookie",
    builtIn: false,
    ingredients: cleanIngredients,
    steps: Array.isArray(raw.steps) ? raw.steps.filter(Boolean) : [],
  };
}

function parseTextRecipe(text) {
  const lines = String(text || "")
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

function applySavedPricesToRecipe(recipe) {
  const updates = {};
  const ingredients = recipe.ingredients.map((ingredient) => {
    const key = normalizeIngredientName(ingredient.name);
    if (!key) return ingredient;
    if (ingredient.pricePerUnitRaw && ingredient.pricePerUnitRaw > 0) {
      updates[key] = ingredient.pricePerUnitRaw;
      const converted = pricePerUnitFromSaved(ingredient.pricePerUnitRaw, ingredient.unit);
      const next = { ...ingredient, pricePerUnit: converted };
      delete next.pricePerUnitRaw;
      return next;
    }
    if (ingredient.pricePerUnit && ingredient.pricePerUnit > 0) return ingredient;
    const saved = (state.data.ingredientPrices || {})[key];
    if (saved != null) {
      return { ...ingredient, pricePerUnit: pricePerUnitFromSaved(saved, ingredient.unit) };
    }
    return ingredient;
  });
  if (Object.keys(updates).length) mergeIngredientPrices(updates);
  return { ...recipe, ingredients };
}

function renderHome({ main }) {
  main.appendChild(stepHeader({
    title: "Start",
    subtitle: "Pick a recipe, choose batches, and get a shopping list.",
  }));

  const groups = buildList(state.data.recipes, state.data.plan.selected);
  const allItems = groups.flatMap((group) => group.items);
  const checkedCount = allItems.filter((item) => state.data.listState.checked.includes(item.key))
    .length;

  const selectedRecipes = state.data.plan.selected
    .map((item) => state.data.recipes.find((recipe) => recipe.id === item.recipeId))
    .filter(Boolean);

  const stack = el("div", { class: "stack" });
  stack.appendChild(
    bigButton({ text: "Get started", onClick: () => navigate("/recipes"), ariaLabel: "Get started" }),
  );

  stack.appendChild(
    bigCard({
      children: [
        el("h2", null, "Recent recipes"),
        selectedRecipes.length === 0
          ? el("p", { class: "muted" }, "No recipes selected yet.")
          : el(
              "ul",
              { class: "simple-list", "aria-label": "Recent recipes" },
              selectedRecipes.slice(0, 3).map((recipe) => el("li", { key: recipe.id }, recipe.title)),
            ),
        bigButton({
          text: "Choose recipes",
          variant: "secondary",
          onClick: () => navigate("/recipes"),
          ariaLabel: "Choose recipes",
        }),
      ],
    }),
  );

  stack.appendChild(
    bigCard({
      children: [
        el("h2", null, "My shopping list"),
        allItems.length === 0
          ? el("p", { class: "muted" }, "No list yet. Choose a recipe.")
          : el(
              "div",
              null,
              el("p", { class: "muted" }, `${checkedCount} of ${allItems.length} purchased`),
              el(
                "ul",
                { class: "simple-list", "aria-label": "Shopping list preview" },
                allItems.slice(0, 5).map((item) =>
                  el("li", { key: item.key }, `${item.name} — ${item.qty} ${item.unit}`),
                ),
              ),
            ),
        bigButton({
          text: "Open shopping list",
          variant: "secondary",
          onClick: () => navigate("/list"),
          ariaLabel: "Open shopping list",
        }),
      ],
    }),
  );

  main.appendChild(stack);
}

function renderRecipes({ main }) {
  main.appendChild(stepHeader({ title: "Step  1", subtitle: "Pick one or more recipes." }));
  const selectedIds = new Set(state.data.plan.selected.map((item) => item.recipeId));

  const stack = el("div", { class: "stack" });
  const grid = el("div", { class: "grid" });

  state.data.recipes.forEach((recipe) => {
    const isSelected = selectedIds.has(recipe.id);
    const recipeCost = getRecipeCost(recipe);
    const buttons = el("div", { class: "button-row" });
    buttons.appendChild(
      bigButton({
        text: isSelected ? "Remove" : "Add to plan",
        variant: isSelected ? "secondary" : "primary",
        onClick: () => toggleRecipe(recipe.id),
        ariaLabel: isSelected ? "Remove from plan" : "Add to plan",
      }),
    );
    if (!recipe.builtIn) {
      buttons.appendChild(
        bigButton({
          text: "Delete",
          variant: "ghost",
          onClick: () => removeRecipe(recipe.id),
          ariaLabel: "Delete recipe",
        }),
      );
    }

    grid.appendChild(
      bigCard({
        className: "recipe-card",
        children: [
          el("h2", null, recipe.title),
          el(
            "p",
            { class: "muted" },
            `${recipe.type === "cookie" ? "Cookies" : "Cake"} · ${recipe.ingredients.length} items`,
          ),
          recipeCost > 0
            ? el("p", { class: "muted" }, `Estimated cost per batch: ${recipeCost.toFixed(2)} ₪`)
            : null,
          buttons,
        ],
      }),
    );
  });

  stack.appendChild(grid);
  stack.appendChild(
    bigButton({
      text: "Next: batches and list",
      variant: "secondary",
      onClick: () => navigate("/list"),
      ariaLabel: "Go to batches and list",
    }),
  );

  const textarea = el("textarea", {
    class: "big-input",
    rows: 5,
    placeholder: "Example:\nChocolate chip cookies\n200 g flour\n100 g sugar\n1 pc egg",
    "aria-label": "Paste recipe text",
  });
  const addFromText = () => {
    const recipe = parseTextRecipe(textarea.value);
    if (!recipe) return;
    addRecipe(applySavedPricesToRecipe(recipe));
    textarea.value = "";
  };
  stack.appendChild(
    bigCard({
      children: [
        el("h2", null, "Add recipe from text"),
        el("p", { class: "muted" }, "Paste a plain-text recipe. We'll extract the ingredients."),
        el(
          "label",
          { class: "field" },
          el("span", null, "One ingredient per line: amount + unit + name"),
          textarea,
        ),
        bigButton({
          text: "Extract ingredients and add",
          variant: "secondary",
          onClick: addFromText,
          ariaLabel: "Add recipe from paste",
          className: "full-width paste-action",
        }),
      ],
    }),
  );

  main.appendChild(stack);
}

function renderList({ main }) {
  main.appendChild(stepHeader({ title: "Steps 2-3", subtitle: "Choose batches, then shop." }));

  const selected = state.data.plan.selected;
  if (selected.length === 0) {
    main.appendChild(
      bigCard({
        children: [
          el("h2", null, "No recipes selected"),
          el("p", { class: "muted" }, "Pick a recipe first."),
          bigButton({
            text: "Choose recipes",
            onClick: () => navigate("/recipes"),
            ariaLabel: "Choose recipes",
          }),
        ],
      }),
    );
    return;
  }

  const stack = el("div", { class: "stack" });
  const groups = buildList(state.data.recipes, selected);
  const allItems = groups.flatMap((group) => group.items);
  const totalCost = allItems.reduce((sum, item) => sum + (item.totalCost || 0), 0);

  const toggleCheck = (key) => {
    const current = state.data.listState.checked;
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    updateListChecked(next);
  };

  const resetChecks = () => updateListChecked([]);

  const copyList = async () => {
    const text = listToText(groups);
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showToast("Copied");
    }
  };

  const sendToWhatsApp = () => {
    const text = listToText(groups);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const batchesCardStack = el("div", { class: "stack" });
  selected.forEach((item) => {
    const recipe = state.data.recipes.find((rec) => rec.id === item.recipeId);
    if (!recipe) return;
    const perBatchCost = getRecipeCost(recipe, 1);
    const totalRecipeCost = getRecipeCost(recipe, item.batches);
    const row = el("div", { class: "batch-row" });
    const left = el(
      "div",
      null,
      el("div", { class: "batch-title" }, recipe.title),
      el("div", { class: "muted" }, "Batches"),
      perBatchCost > 0
        ? el(
            "div",
            { class: "batch-cost" },
            `Cost per batch: ${perBatchCost.toFixed(2)} ₪ · Total: ${totalRecipeCost.toFixed(2)} ₪`,
          )
        : null,
    );
    const stepper = el(
      "div",
      { class: "stepper" },
      el(
        "button",
        {
          type: "button",
          onClick: () => setBatches(item.recipeId, item.batches - 1),
          "aria-label": `Decrease batches for ${recipe.title}`,
        },
        "-",
      ),
      el("div", { class: "stepper-value", "aria-live": "polite" }, String(item.batches)),
      el(
        "button",
        {
          type: "button",
          onClick: () => setBatches(item.recipeId, item.batches + 1),
          "aria-label": `Increase batches for ${recipe.title}`,
        },
        "+",
      ),
    );
    row.appendChild(left);
    row.appendChild(stepper);
    batchesCardStack.appendChild(row);
  });

  stack.appendChild(
    bigCard({
      children: [el("h2", null, "How many batches?"), batchesCardStack],
    }),
  );

  const header = el(
    "div",
    { class: "list-header" },
    el("h2", null, "Shopping list"),
    el(
      "div",
      { class: "button-row" },
      bigButton({ text: "Copy list", variant: "secondary", onClick: copyList, ariaLabel: "Copy list" }),
      bigButton({
        text: "Send to WhatsApp",
        variant: "secondary",
        onClick: sendToWhatsApp,
        ariaLabel: "Send list to WhatsApp",
      }),
      bigButton({
        text: "Reset all to not purchased",
        variant: "ghost",
        onClick: resetChecks,
        ariaLabel: "Reset all to not purchased",
      }),
    ),
  );

  const listBody = groups.length === 0
    ? el("p", { class: "muted" }, "No items yet.")
    : el(
        "div",
        { class: "list-groups" },
        groups.map((group) =>
          el(
            "div",
            { class: "list-group" },
            el("h3", null, group.category),
            el(
              "div",
              { class: "checklist" },
              group.items.map((item) => {
                const checked = state.data.listState.checked.includes(item.key);
                const label = el("label", { class: `check-row ${checked ? "checked" : ""}`.trim() });
                const checkbox = el("input", {
                  type: "checkbox",
                  checked,
                  onChange: () => toggleCheck(item.key),
                  "aria-label": `Mark ${item.name}`,
                });
                const span = el(
                  "span",
                  null,
                  `${item.name} — ${item.qty} ${item.unit}${item.totalCost ? ` · ${item.totalCost.toFixed(2)} ₪` : ""}`,
                );
                label.appendChild(checkbox);
                label.appendChild(span);
                return label;
              }),
            ),
          ),
        ),
      );

  stack.appendChild(
    bigCard({
      children: [
        header,
        listBody,
        totalCost > 0 ? el("div", { class: "total-row" }, `Total: ${totalCost.toFixed(2)} ₪`) : null,
      ],
    }),
  );

  main.appendChild(stack);
}

function renderSettings({ main }) {
  main.appendChild(stepHeader({ title: "Settings", subtitle: "Tune it to your workflow." }));

  const stack = el("div", { class: "stack" });
  const groups = buildList(state.data.recipes, state.data.plan.selected);

  const downloadText = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportTxt = () => {
    const text = listToText(groups);
    downloadText(text, "bakelist-list.txt", "text/plain");
    showToast("Saved");
  };

  const handleExportCsv = () => {
    const rows = ["Category,Ingredient,Quantity,Unit,Price"]; // same as React
    let total = 0;
    groups.forEach((group) => {
      group.items.forEach((item) => {
        const cost = item.totalCost ? item.totalCost.toFixed(2) : "";
        if (item.totalCost) total += item.totalCost;
        const row = [group.category, item.name, item.qty, item.unit, cost]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",");
        rows.push(row);
      });
    });
    if (total > 0) rows.push(`"Total",,,,"${total.toFixed(2)}"`);
    downloadText(rows.join("\n"), "bakelist-list.csv", "text/csv");
    showToast("Saved");
  };

  stack.appendChild(
    bigCard({
      children: [
        el("h2", null, "Export shopping list"),
        el(
          "div",
          { class: "button-row" },
          bigButton({
            text: "Export to Excel (CSV)",
            variant: "secondary",
            onClick: handleExportCsv,
            ariaLabel: "Export to Excel",
          }),
          bigButton({
            text: "Export to text (TXT)",
            variant: "secondary",
            onClick: handleExportTxt,
            ariaLabel: "Export to text",
          }),
        ),
      ],
    }),
  );

  const nameInput = el("input", {
    class: "big-input",
    type: "text",
    placeholder: "Example: flour",
    "aria-label": "Ingredient name",
  });
  const priceInput = el("input", {
    class: "big-input",
    type: "number",
    min: 0,
    step: 0.5,
    placeholder: "Example: 3.5",
    "aria-label": "Price per unit",
  });
  const handleAddPrice = () => {
    const name = nameInput.value.trim();
    if (!name) return;
    updateIngredientPrice(name, Number(priceInput.value) || 0);
    nameInput.value = "";
    priceInput.value = "";
  };
  const priceEntries = Object.entries(state.data.ingredientPrices || {})
    .filter(([name]) => name)
    .sort((a, b) => a[0].localeCompare(b[0]));

  stack.appendChild(
    bigCard({
      children: [
        el("h2", null, "Ingredient prices"),
        el(
          "div",
          { class: "stack" },
          el("label", { class: "field" }, el("span", null, "Ingredient name"), nameInput),
          el("label", { class: "field" }, el("span", null, "Price per unit"), priceInput),
          bigButton({
            text: "Add or update price",
            variant: "secondary",
            onClick: handleAddPrice,
            ariaLabel: "Add price",
          }),
          el("p", { class: "muted" }, "When the unit is grams, the price is per kg."),
        ),
        priceEntries.length === 0
          ? el("p", { class: "muted" }, "No prices saved yet.")
          : el(
              "div",
              { class: "price-list", "aria-label": "Ingredient prices" },
              priceEntries.map(([name, price]) => {
                const row = el("div", { class: "price-row" });
                row.appendChild(el("div", { class: "price-name" }, name));
                const input = el("input", {
                  class: "price-input",
                  type: "number",
                  min: 0,
                  step: 0.5,
                  value: price,
                  onInput: (event) => updateIngredientPrice(name, Number(event.target.value) || 0),
                  "aria-label": `Update price ${name}`,
                });
                row.appendChild(input);
                row.appendChild(
                  el(
                    "button",
                    {
                      class: "mini-remove",
                      type: "button",
                      onClick: () => removeIngredientPrice(name),
                      "aria-label": `Remove price ${name}`,
                    },
                    "Remove",
                  ),
                );
                return row;
              }),
            ),
      ],
    }),
  );

  const onBtn = el(
    "button",
    {
      type: "button",
      class: state.data.settings.demoDataEnabled ? "active" : "",
      onClick: () => updateDemoEnabled(true),
      "aria-label": "Enable demo data",
    },
    "On",
  );
  const offBtn = el(
    "button",
    {
      type: "button",
      class: !state.data.settings.demoDataEnabled ? "active" : "",
      onClick: () => updateDemoEnabled(false),
      "aria-label": "Disable demo data",
    },
    "Off",
  );
  stack.appendChild(
    bigCard({
      children: [
        el("h2", null, "Demo data"),
        el("div", { class: "segmented" }, onBtn, offBtn),
        el("p", { class: "muted" }, "Demo data keeps the built-in recipes."),
      ],
    }),
  );

  main.appendChild(stack);
}

function renderBottomTabs({ shell, path }) {
  const tabs = [
    { path: "/", label: "Home" },
    { path: "/recipes", label: "Recipes" },
    { path: "/list", label: "List" },
    { path: "/settings", label: "Settings" },
  ];
  const nav = el("nav", { class: "bottom-tabs", "aria-label": "Bottom navigation" });
  tabs.forEach((tab) => {
    nav.appendChild(
      el(
        "button",
        {
          class: `tab-button ${path === tab.path ? "active" : ""}`.trim(),
          type: "button",
          onClick: () => navigate(tab.path),
        },
        tab.label,
      ),
    );
  });
  shell.appendChild(nav);
}

function renderHeader({ shell }) {
  const checked = state.data.settings.theme === "dark";
  const input = el("input", {
    type: "checkbox",
    checked,
    onChange: (event) => setTheme(event.target.checked ? "dark" : "light"),
    "aria-label": checked ? "Dark mode on" : "Light mode on",
  });
  const themeSwitch = el(
    "label",
    { class: "theme-switch" },
    el("span", { class: "theme-label" }, checked ? "Dark" : "Light"),
    el("span", { class: "switch" }, input, el("span", { class: "slider" })),
  );

  shell.appendChild(
    el(
      "header",
      { class: "app-header", "aria-live": "polite" },
      el("div", { class: "brand" }, "BakeList"),
      el("div", { class: "tagline" }, "Cookies and cakes, made simple."),
      el("div", { class: "header-theme" }, themeSwitch),
    ),
  );
}

function render() {
  const root = document.getElementById("root");
  if (!root) return;

  const path = getPathFromHash();
  root.textContent = "";

  const shell = el("div", { class: "app-shell" });
  renderHeader({ shell });

  const main = el("main", { class: "app-main" });
  if (path === "/") renderHome({ main });
  if (path === "/recipes") renderRecipes({ main });
  if (path === "/list") renderList({ main });
  if (path === "/settings") renderSettings({ main });
  shell.appendChild(main);

  renderBottomTabs({ shell, path });
  if (state.toast) {
    shell.appendChild(
      el("div", { class: "toast", role: "status", "aria-live": "polite" }, state.toast),
    );
  }

  root.appendChild(shell);
}

document.documentElement.setAttribute("data-theme", state.data.settings.theme);
window.addEventListener("hashchange", () => render());
if (!window.location.hash) window.location.hash = "#/";
render();
