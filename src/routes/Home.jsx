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
      <BigButton onClick={() => navigate("/recipes")} ariaLabel="Get started">
        Get started
      </BigButton>

      <BigCard>
        <h2>Recent recipes</h2>
        {selectedRecipes.length === 0 ? (
          <p className="muted">No recipes selected yet.</p>
        ) : (
          <ul className="simple-list" aria-label="Recent recipes">
            {selectedRecipes.slice(0, 3).map((recipe) => (
              <li key={recipe.id}>{recipe.title}</li>
            ))}
          </ul>
        )}
        <BigButton
          variant="secondary"
          onClick={() => navigate("/recipes")}
          ariaLabel="Choose recipes"
        >
          Choose recipes
        </BigButton>
      </BigCard>

      <BigCard>
        <h2>My shopping list</h2>
        {allItems.length === 0 ? (
          <p className="muted">No list yet. Choose a recipe.</p>
        ) : (
          <>
            <p className="muted">
              {checkedCount} of {allItems.length} purchased
            </p>
            <ul
              className="simple-list"
              aria-label="Shopping list preview"
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
          ariaLabel="Open shopping list"
        >
          Open shopping list
        </BigButton>
      </BigCard>
    </div>
  );
}

export default Home;
