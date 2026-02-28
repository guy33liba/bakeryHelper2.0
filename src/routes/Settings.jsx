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
    showToast("נשמר");
  };

  const handleExportCsv = () => {
    const rows = ["קטגוריה,מרכיב,כמות,יחידה,מחיר"];
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
      rows.push(`"סך הכול",,,,,"${total.toFixed(2)}"`);
    }
    downloadText(rows.join("\n"), "bakelist-list.csv", "text/csv");
    showToast("נשמר");
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = importData(reader.result);
        setData({ ...loadData(true), ...imported });
        showToast("נשמר");
      } catch {
        showToast("קובץ לא תקין");
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
        <h2>ייצוא רשימת קנייה</h2>
        <div className="button-row">
          <BigButton
            variant="secondary"
            onClick={handleExportCsv}
            ariaLabel="ייצוא לאקסל"
          >
            לייצא לאקסל (CSV)
          </BigButton>
          <BigButton
            variant="secondary"
            onClick={handleExportTxt}
            ariaLabel="ייצוא לטקסט"
          >
            לייצא לטקסט (TXT)
          </BigButton>
        </div>
      </BigCard>

      {/* <BigCard>
        <h2>גיבוי</h2>
        <div className="button-row">
          <BigButton
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            ariaLabel="ייבוא גיבוי"
          >
            לייבא גיבוי (JSON)
          </BigButton>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden-input"
            onChange={handleImport}
            aria-label="ייבוא קובץ"
          />
        </div>
        <BigButton variant="ghost" onClick={resetAll} ariaLabel="איפוס נתונים">
          לאפס הכול
        </BigButton>
      </BigCard> */}

      <BigCard>
        <h2>מחירי מרכיבים</h2>
        <div className="stack">
          <label className="field">
            <span>שם מרכיב</span>
            <input
              className="big-input"
              type="text"
              value={priceName}
              onChange={(event) => setPriceName(event.target.value)}
              placeholder="דוגמה: קמח"
              aria-label="שם מרכיב"
            />
          </label>
          <label className="field">
            <span>מחיר ליחידה</span>
            <input
              className="big-input"
              type="number"
              min="0"
              step="0.5"
              value={priceValue}
              onChange={(event) => setPriceValue(event.target.value)}
              placeholder="דוגמה: 3.5"
              aria-label="מחיר ליחידה"
            />
          </label>
          <BigButton
            variant="secondary"
            onClick={handleAddPrice}
            ariaLabel="הוספת מחיר"
          >
            להוסיף או לעדכן מחיר
          </BigButton>
          <p className="muted">כשיחידה היא גרם, המחיר הוא לק"ג.</p>
        </div>

        {priceEntries.length === 0 ? (
          <p className="muted">עדיין לא נשמרו מחירים.</p>
        ) : (
          <div className="price-list" aria-label="מחירי מרכיבים">
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
                  aria-label={`עדכון מחיר ${name}`}
                />
                <button
                  className="mini-remove"
                  onClick={() => removeIngredientPrice(name)}
                  aria-label={`הסרת מחיר ${name}`}
                >
                  להסיר
                </button>
              </div>
            ))}
          </div>
        )}
      </BigCard>

      <BigCard>
        <h2>נתוני הדגמה</h2>
        <div className="segmented">
          <button
            className={data.settings.demoDataEnabled ? "active" : ""}
            onClick={() => updateDemoEnabled(true)}
            aria-label="הפעלת נתוני הדגמה"
          >
            פועל
          </button>
          <button
            className={!data.settings.demoDataEnabled ? "active" : ""}
            onClick={() => updateDemoEnabled(false)}
            aria-label="כיבוי נתוני הדגמה"
          >
            כבוי
          </button>
        </div>
        <p className="muted">נתוני הדגמה שומרים את המתכונים המובנים.</p>
      </BigCard>
    </div>
  );
}

export default Settings;
