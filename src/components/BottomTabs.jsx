const tabs = [
  { path: "/", label: "Home" },
  { path: "/recipes", label: "Recipes" },
  { path: "/list", label: "List" },
  { path: "/settings", label: "Settings" },
];

function BottomTabs({ activePath, navigate }) {
  return (
    <nav className="bottom-tabs" aria-label="Bottom navigation">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`tab-button ${activePath === tab.path ? "active" : ""}`}
          onClick={() => navigate(tab.path)}
          aria-current={activePath === tab.path ? "page" : undefined}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default BottomTabs;
