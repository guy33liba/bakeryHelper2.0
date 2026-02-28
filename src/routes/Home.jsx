import BigButton from "../components/BigButton.jsx";
import BigCard from "../components/BigCard.jsx";
import { buildList } from "../lib/listEngine.js";

function Home({ recipes, selected, listState, navigate }) {
  const selectedRecipes = selected
    .map((item) => recipes.find((recipe) => recipe.id === item.recipeId))
    .filter(Boolean);

  const groups = buildList(recipes, selected);
  const allItems = groups.flatMap((group) => group.items);
  const checkedCount = allItems.filter((item) =>
    listState.checked.includes(item.key),
  ).length;

  return (
    <div className="stack">
      <BigButton onClick={() => navigate("/recipes")} ariaLabel="התחלה">
        התחלה
      </BigButton>

      <BigCard>
        <h2>מתכונים אחרונים</h2>
        {selectedRecipes.length === 0 ? (
          <p className="muted">עדיין לא נבחרו מתכונים.</p>
        ) : (
          <ul className="simple-list" aria-label="מתכונים אחרונים">
            {selectedRecipes.slice(0, 3).map((recipe) => (
              <li key={recipe.id}>{recipe.title}</li>
            ))}
          </ul>
        )}
        <BigButton
          variant="secondary"
          onClick={() => navigate("/recipes")}
          ariaLabel="בחירת מתכונים"
        >
          לבחור מתכונים
        </BigButton>
      </BigCard>

      <BigCard>
        <h2>רשימת הקנייה שלי</h2>
        {allItems.length === 0 ? (
          <p className="muted">עדיין אין רשימה. בחרו מתכון.</p>
        ) : (
          <>
            <p className="muted">
              {checkedCount} מתוך {allItems.length} נקנו
            </p>
            <ul
              className="simple-list"
              aria-label="תצוגה מקדימה של רשימת קנייה"
            >
              {allItems.slice(0, 5).map((item) => (
                <li key={item.key}>
                  {item.name} — {item.qty} {item.unit}
                </li>
              ))}
            </ul>
          </>
        )}
        <BigButton
          variant="secondary"
          onClick={() => navigate("/list")}
          ariaLabel="פתיחת רשימת קנייה"
        >
          לפתוח רשימת קנייה
        </BigButton>
      </BigCard>
    </div>
  );
}

export default Home;
