const byId = (id) => document.getElementById(id);

const fields = {
  productName: byId("productName"),
  ingredientsPerBatch: byId("ingredientsPerBatch"),
  costPerBatch: byId("costPerBatch"),
  salePrice: byId("salePrice"),
  batches: byId("batches"),
  unitsPerBatch: byId("unitsPerBatch"),
};

const resultsEl = byId("results");

const formatMoney = (value) => `$${value.toFixed(2)}`;

function renderResults() {
  const productName = fields.productName.value.trim() || "Bakery Product";
  const ingredientsPerBatch = Number(fields.ingredientsPerBatch.value) || 0;
  const costPerBatch = Number(fields.costPerBatch.value) || 0;
  const salePrice = Number(fields.salePrice.value) || 0;
  const batches = Math.max(1, Number(fields.batches.value) || 1);
  const unitsPerBatch = Math.max(1, Number(fields.unitsPerBatch.value) || 1);

  const totalIngredients = ingredientsPerBatch * batches;
  const totalUnits = batches * unitsPerBatch;
  const totalCost = costPerBatch * batches;
  const projectedRevenue = salePrice * totalUnits;
  const projectedProfit = projectedRevenue - totalCost;

  resultsEl.innerHTML = `
    <li><strong>Product:</strong> ${productName}</li>
    <li><strong>Total ingredients needed:</strong> ${totalIngredients.toFixed(1)} kg</li>
    <li><strong>Total units produced:</strong> ${totalUnits}</li>
    <li><strong>Total production cost:</strong> ${formatMoney(totalCost)}</li>
    <li><strong>Projected revenue:</strong> ${formatMoney(projectedRevenue)}</li>
    <li><strong>Projected profit:</strong> ${formatMoney(projectedProfit)}</li>
  `;
}

byId("calculateBtn").addEventListener("click", renderResults);
renderResults();
