const CATEGORY_ORDER = ["קמח", "סוכר", "מוצרי חלב", "שוקולד", "אחר"];

function normalizeName(name) {
  return name.trim().toLowerCase();
}

export function buildList(recipes, selected) {
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
          category: ingredient.category || "אחר",
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
    const category = item.category || "אחר";
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category).push(item);
  });

  const groups = [];
  CATEGORY_ORDER.forEach((category) => {
    if (grouped.has(category)) {
      const items = grouped
        .get(category)
        .sort((a, b) => a.name.localeCompare(b.name));
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

export function getRecipeCost(recipe, batches = 1) {
  if (!recipe || !Array.isArray(recipe.ingredients)) return 0;
  const safeBatches = Math.max(1, Number(batches) || 1);
  return recipe.ingredients.reduce((sum, ingredient) => {
    const pricePerUnit = Number(ingredient.pricePerUnit) || 0;
    const qty = Number(ingredient.qty) || 0;
    if (!pricePerUnit || !qty) return sum;
    return sum + pricePerUnit * qty * safeBatches;
  }, 0);
}

export function listToText(groups) {
  if (!groups.length) return "עדיין אין פריטים.";
  return groups
    .map((group) => {
      const lines = group.items.map((item) => {
        const base = `- ${item.name}: ${item.qty} ${item.unit}`;
        if (item.totalCost) {
          return `${base} · ${item.totalCost.toFixed(2)} ₪`;
        }
        return base;
      });
      return `${group.category}\n${lines.join("\n")}`;
    })
    .join("\n\n");
}
