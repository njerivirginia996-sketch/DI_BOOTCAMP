import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      aria-label={`Switch to ${nextTheme} theme`}
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
      <span>Use {nextTheme} mode</span>
    </button>
  );
}

function ThemePreview() {
  const { theme } = useContext(ThemeContext);

  return (
    <section aria-label={`${theme} theme preview`} className={`preview preview-${theme}`}>
      <div className="preview-topline">
        <span className="preview-mark" aria-hidden="true">●</span>
        <span>YOUR WORKSPACE</span>
        <span className="theme-label">{theme} mode</span>
      </div>
      <h2>A calmer way<br />to focus.</h2>
      <p>Your interface follows the theme selected for this session.</p>
      <div className="preview-footer">
        <span className="status-dot" aria-hidden="true" />
        <span>All changes saved</span>
      </div>
    </section>
  );
}

function ThemeSwitcher() {
  const { theme } = useContext(ThemeContext);

  return (
    <main className={`page page-${theme}`}>
      <div className="content">
        <header className="page-header">
          <p className="eyebrow">REACT HOOKS LAB / 01</p>
          <h1>Set the<br /><em>tone.</em></h1>
          <p className="intro">One choice, carried through the whole interface.</p>
          <ThemeToggle />
        </header>
        <ThemePreview />
        <footer>useContext <span>+</span> useState</footer>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  );
}