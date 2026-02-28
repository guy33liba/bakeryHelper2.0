import {
  normalizeIngredientName,
  pricePerUnitFromSaved,
} from "./ingredients.js";

const STORAGE_KEY = "bakelist_v1";

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

const clone = (value) => JSON.parse(JSON.stringify(value));

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

export function loadData(forceFresh = false) {
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
          fallbackRecipe.ingredients.map((item) => [
            `${item.id}|${item.unit}`,
            item,
          ]),
        )
      : null;
    const ingredients = recipe.ingredients.map((ingredient) => {
      const base = { ...ingredient };
      const override =
        RANGE_PRICE_OVERRIDES[normalizeIngredientName(base.name)];
      if (override != null) {
        base.pricePerUnit = override;
        return base;
      }
      if (fallbackIngredientsByKey) {
        const fallback = fallbackIngredientsByKey.get(
          `${ingredient.id}|${ingredient.unit}`,
        );
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

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportData(data) {
  return JSON.stringify(data, null, 2);
}

export function importData(text) {
  const parsed = safeParse(text);
  if (!parsed || !parsed.settings || !parsed.recipes || !parsed.plan) {
    throw new Error("Invalid backup");
  }
  return parsed;
}

export { STORAGE_KEY };
