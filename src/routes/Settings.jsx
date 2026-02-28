import { useRef, useState } from "react";
import BigButton from "../components/BigButton.jsx";
import BigCard from "../components/BigCard.jsx";
import { buildList, listToText } from "../lib/listEngine.js";
import { importData, loadData } from "../lib/storage.js";

function Settings({
  data,
  updateDemoEnabled,
  resetAll,
  setData,
  showToast,
  updateIngredientPrice,
  removeIngredientPrice,
}) {
  const fileRef = useRef(null);
  const [priceName, setPriceName] = useState("");
  const [priceValue, setPriceValue] = useState("");

  const groups = buildList(data.recipes, data.plan.selected);

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
    const rows = ["Category,Ingredient,Quantity,Unit,Price"];
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
    if (total > 0) {
      rows.push(`"Total",,,,,"${total.toFixed(2)}"`);
    }
    downloadText(rows.join("\n"), "bakelist-list.csv", "text/csv");
    showToast("Saved");
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = importData(reader.result);
        setData({ ...loadData(true), ...imported });
        showToast("Saved");
      } catch {
        showToast("Invalid file");
      }
    };
    reader.readAsText(file);
  };

  const handleAddPrice = () => {
    const name = priceName.trim();
    if (!name) return;
    updateIngredientPrice(name, Number(priceValue) || 0);
    setPriceName("");
    setPriceValue("");
  };

  const priceEntries = Object.entries(data.ingredientPrices || {})
    .filter(([name]) => name)
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="stack">
      <BigCard>
        <h2>Export shopping list</h2>
        <div className="button-row">
          <BigButton
            variant="secondary"
            onClick={handleExportCsv}
            ariaLabel="Export to Excel"
          >
            Export to Excel (CSV)
          </BigButton>
          <BigButton
            variant="secondary"
            onClick={handleExportTxt}
            ariaLabel="Export to text"
          >
            Export to text (TXT)
          </BigButton>
        </div>
      </BigCard>

      {/* <BigCard>
        <h2>Backup</h2>
        <div className="button-row">
          <BigButton
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            ariaLabel="Import backup"
          >
            Import backup (JSON)
          </BigButton>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden-input"
            onChange={handleImport}
            aria-label="Import file"
          />
        </div>
        <BigButton variant="ghost" onClick={resetAll} ariaLabel="Reset data">
          Reset all
        </BigButton>
      </BigCard> */}

      <BigCard>
        <h2>Ingredient prices</h2>
        <div className="stack">
          <label className="field">
            <span>Ingredient name</span>
            <input
              className="big-input"
              type="text"
              value={priceName}
              onChange={(event) => setPriceName(event.target.value)}
              placeholder="Example: flour"
              aria-label="Ingredient name"
            />
          </label>
          <label className="field">
            <span>Price per unit</span>
            <input
              className="big-input"
              type="number"
              min="0"
              step="0.5"
              value={priceValue}
              onChange={(event) => setPriceValue(event.target.value)}
              placeholder="Example: 3.5"
              aria-label="Price per unit"
            />
          </label>
          <BigButton
            variant="secondary"
            onClick={handleAddPrice}
            ariaLabel="Add price"
          >
            Add or update price
          </BigButton>
          <p className="muted">When the unit is grams, the price is per kg.</p>
        </div>

        {priceEntries.length === 0 ? (
          <p className="muted">No prices saved yet.</p>
        ) : (
          <div className="price-list" aria-label="Ingredient prices">
            {priceEntries.map(([name, price]) => (
              <div key={name} className="price-row">
                <div className="price-name">{name}</div>
                <input
                  className="price-input"
                  type="number"
                  min="0"
                  step="0.5"
                  value={price}
                  onChange={(event) =>
                    updateIngredientPrice(name, Number(event.target.value) || 0)
                  }
                  aria-label={`Update price ${name}`}
                />
                <button
                  className="mini-remove"
                  onClick={() => removeIngredientPrice(name)}
                  aria-label={`Remove price ${name}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </BigCard>

      <BigCard>
        <h2>Demo data</h2>
        <div className="segmented">
          <button
            className={data.settings.demoDataEnabled ? "active" : ""}
            onClick={() => updateDemoEnabled(true)}
            aria-label="Enable demo data"
          >
            On
          </button>
          <button
            className={!data.settings.demoDataEnabled ? "active" : ""}
            onClick={() => updateDemoEnabled(false)}
            aria-label="Disable demo data"
          >
            Off
          </button>
        </div>
        <p className="muted">Demo data keeps the built-in recipes.</p>
      </BigCard>
    </div>
  );
}

export default Settings;
