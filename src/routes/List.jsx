import BigButton from "../components/BigButton.jsx";
import BigCard from "../components/BigCard.jsx";
import { buildList, getRecipeCost, listToText } from "../lib/listEngine.js";

function List({
  recipes,
  selected,
  listState,
  setBatches,
  updateListState,
  showToast,
  navigate,
}) {
  const groups = buildList(recipes, selected);
  const allItems = groups.flatMap((group) => group.items);
  const totalCost = allItems.reduce(
    (sum, item) => sum + (item.totalCost || 0),
    0,
  );

  const toggleCheck = (key) => {
    const next = listState.checked.includes(key)
      ? listState.checked.filter((itemKey) => itemKey !== key)
      : [...listState.checked, key];
    updateListState(next);
  };

  const resetChecks = () => updateListState([]);

  const copyList = async () => {
    const text = listToText(groups);
    try {
      await navigator.clipboard.writeText(text);
      showToast("הועתק");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showToast("הועתק");
    }
  };

  const sendToWhatsApp = () => {
    const text = listToText(groups);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (selected.length === 0) {
    return (
      <BigCard>
        <h2>לא נבחרו מתכונים</h2>
        <p className="muted">קודם בוחרים מתכון.</p>
        <BigButton
          onClick={() => navigate("/recipes")}
          ariaLabel="בחירת מתכונים"
        >
          לבחור מתכונים
        </BigButton>
      </BigCard>
    );
  }

  return (
    <div className="stack">
      <BigCard>
        <h2>כמה סבבים?</h2>
        <div className="stack">
          {selected.map((item) => {
            const recipe = recipes.find((rec) => rec.id === item.recipeId);
            if (!recipe) return null;
            const perBatchCost = getRecipeCost(recipe, 1);
            const totalRecipeCost = getRecipeCost(recipe, item.batches);
            return (
              <div key={item.recipeId} className="batch-row">
                <div>
                  <div className="batch-title">{recipe.title}</div>
                  <div className="muted">סבבים</div>
                  {perBatchCost > 0 && (
                    <div className="batch-cost">
                      עלות לסבב: {perBatchCost.toFixed(2)} ₪ · סה"כ:{" "}
                      {totalRecipeCost.toFixed(2)} ₪
                    </div>
                  )}
                </div>
                <div className="stepper">
                  <button
                    onClick={() => setBatches(item.recipeId, item.batches - 1)}
                    aria-label={`הקטנת סבבים עבור ${recipe.title}`}
                  >
                    -
                  </button>
                  <div className="stepper-value" aria-live="polite">
                    {item.batches}
                  </div>
                  <button
                    onClick={() => setBatches(item.recipeId, item.batches + 1)}
                    aria-label={`הגדלת סבבים עבור ${recipe.title}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </BigCard>

      <BigCard>
        <div className="list-header">
          <h2>רשימת קנייה</h2>
          <div className="button-row">
            <BigButton
              variant="secondary"
              onClick={copyList}
              ariaLabel="העתקת רשימה"
            >
              להעתיק רשימה
            </BigButton>
            <BigButton
              variant="secondary"
              onClick={sendToWhatsApp}
              ariaLabel="שליחת רשימה לוואטסאפ"
            >
              לשלוח לוואטסאפ
            </BigButton>
            <BigButton
              variant="ghost"
              onClick={resetChecks}
              ariaLabel="סימון הכל כלא נקנה"
            >
              לסמן הכול כלא נקנה
            </BigButton>
          </div>
        </div>

        {groups.length === 0 ? (
          <p className="muted">עדיין אין פריטים.</p>
        ) : (
          <div className="list-groups">
            {groups.map((group) => (
              <div key={group.category} className="list-group">
                <h3>{group.category}</h3>
                <div className="checklist">
                  {group.items.map((item) => {
                    const checked = listState.checked.includes(item.key);
                    return (
                      <label
                        key={item.key}
                        className={`check-row ${checked ? "checked" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCheck(item.key)}
                          aria-label={`סימון ${item.name}`}
                        />
                        <span>
                          {item.name} — {item.qty} {item.unit}
                          {item.totalCost
                            ? ` · ${item.totalCost.toFixed(2)} ₪`
                            : ""}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalCost > 0 && (
          <div className="total-row">סך הכול: {totalCost.toFixed(2)} ₪</div>
        )}
      </BigCard>
    </div>
  );
}

export default List;
