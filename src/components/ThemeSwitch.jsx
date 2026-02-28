function ThemeSwitch({ checked, onChange }) {
  return (
    <label className="theme-switch">
      <span className="theme-label">{checked ? "Dark" : "Light"}</span>
      <span className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-label={checked ? "Dark mode on" : "Light mode on"}
        />
        <span className="slider" />
      </span>
    </label>
  );
}

export default ThemeSwitch;
