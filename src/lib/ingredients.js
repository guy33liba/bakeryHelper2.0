export function normalizeIngredientName(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeUnit(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function pricePerUnitFromSaved(savedPrice, unit) {
  const price = Number(savedPrice) || 0;
  if (!price) return 0;
  const normalizedUnit = normalizeUnit(unit);
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
