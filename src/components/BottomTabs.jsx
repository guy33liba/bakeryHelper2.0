const tabs = [
  { path: "/", label: "בית" },
  { path: "/recipes", label: "מתכונים" },
  { path: "/list", label: "רשימה" },
  { path: "/settings", label: "הגדרות" },
];

function BottomTabs({ activePath, navigate }) {
  return (
    <nav className="bottom-tabs" aria-label="ניווט תחתון">
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
