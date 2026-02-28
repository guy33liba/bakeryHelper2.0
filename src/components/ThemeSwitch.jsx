function ThemeSwitch({ checked, onChange }) {
  return (
    <label className="theme-switch">
      <span className="theme-label">{checked ? "כהה" : "בהיר"}</span>
      <span className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-label={checked ? "מצב כהה מופעל" : "מצב בהיר מופעל"}
        />
        <span className="slider" />
      </span>
    </label>
  );
}

export default ThemeSwitch;
